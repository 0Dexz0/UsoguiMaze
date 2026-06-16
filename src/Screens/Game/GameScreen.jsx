import { createSignal, Show, createMemo, onMount, onCleanup } from 'solid-js'
import { For } from 'solid-js'
import { css } from 'solid-styled'
import { useGame } from '~/context/GameContext'
import Maze from '~/components/MazeComponents/Maze'
import TemporaryModal from '~/components/ModalComponents/TemporaryModal'
import PlayerToken from '~/Screens/Game/PlayerToken'
import MoveHighlights from '~/Screens/Game/MoveHighlights'
import ResultModal from '~/components/ModalComponents/ResultModal'
import { getAdjacentCells, wallIdToLine, startRevealSequence } from '~/utils/gameUtils'
import buttonStyles from '~/shared-styles/buttons.module.css'

const GameScreen = () => {
    css`
    .viewTabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tabButton {
      padding: 0.5rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      border: 2px solid #d1d5db;
      background: #f9fafb;
      color: #1a1a1a;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }

    .tabButton:hover {
      background: #f3f4f6;
    }

    .active {
      background: #e5e7eb;
      border-color: #9ca3af;
    }

    .turnMy {
      border-color: #22c55e;
    }

    .turnOpponent {
      border-color: #dc2626;
    }

    .mazeWrapper {
      position: relative;
      display: inline-block;
      padding-bottom: 80px;
    }

    .returnButtonWrapper {
      position: fixed;
      bottom: 50px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      pointer-events: none;
    }
    .returnButtonWrapper button {
      pointer-events: auto;
    }

    .fadeIn {
      animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `

    const { roomConfig, gameData, myMaze, opponentMaze, navigateToHome } = useGame()
    const sizeConfig = roomConfig()?.mazeSize || '8x8'
    const [rows, cols] = sizeConfig.split('x').map(Number)
    const [showTurnModal, setShowTurnModal] = createSignal(true)
    const [myTurn, setMyTurn] = createSignal(gameData()?.isHost ?? false)
    const [viewMode, setViewMode] = createSignal('mine')
    const [playerPos, setPlayerPos] = createSignal(opponentMaze()?.start || { x: 0, y: 0 })
    const [opponentPos, setOpponentPos] = createSignal(myMaze()?.start || { x: 0, y: 0 })
    const [discoveredWalls, setDiscoveredWalls] = createSignal(new Set())
    const [discoveredLines, setDiscoveredLines] = createSignal([])
    const [revealedLines, setRevealedLines] = createSignal([])
    const [gameOver, setGameOver] = createSignal(false)
    const [isWinner, setIsWinner] = createSignal(null)
    const [showResultModal, setShowResultModal] = createSignal(false)
    const [opponentRevealedLines, setOpponentRevealedLines] = createSignal([])

    let connection

    onMount(() => {
        connection = gameData().connection
        connection.on('data', (data) => {
            if (data.type === 'turn') {
                setMyTurn(data.myTurn)
                if (data.position) setOpponentPos(data.position)
                setShowTurnModal(true)
            } else if (data.type === 'gameOver') {
                if (!gameOver()) {
                    setGameOver(true)
                    setIsWinner(false)
                    setShowResultModal(true)
                    if (data.position) setOpponentPos(data.position)
                    const baseWalls = opponentMaze()?.walls || []
                    startRevealSequence(baseWalls, new Set(data.discoveredWalls), setOpponentRevealedLines)
                }
            }
        })
    })

    onCleanup(() => {
        if (connection) connection.off('data')
    })

    const adjacentCells = createMemo(() => {
        if (!myTurn() || viewMode() !== 'mine' || gameOver()) return { reachable: [], blocked: [] }
        const pos = playerPos()
        const maze = opponentMaze()
        if (!maze) return { reachable: [], blocked: [] }
        const wallsSet = new Set(maze.walls || [])
        return getAdjacentCells(pos.x, pos.y, rows, cols, wallsSet, discoveredWalls())
    })

    const handleMoveClick = (x, y) => {
        if (!myTurn() || viewMode() !== 'mine' || gameOver()) return
        const { reachable, blocked } = adjacentCells()
        const newPos = { x, y }
        if (reachable.some(cell => cell.x === x && cell.y === y)) {
            setPlayerPos(newPos)
            const maze = opponentMaze()
            if (maze && maze.end && maze.end.x === x && maze.end.y === y) {
                setGameOver(true)
                setIsWinner(true)
                setShowResultModal(true)
                gameData().connection.send({
                    type: 'gameOver',
                    discoveredWalls: [...discoveredWalls()],
                    position: newPos
                })
                startRevealSequence(opponentMaze()?.walls || [], discoveredWalls(), setRevealedLines)
                return
            }
            setMyTurn(false)
            gameData().connection.send({ type: 'turn', myTurn: true, position: newPos })
            setShowTurnModal(true)
            return
        }
        const blockedCell = blocked.find(cell => cell.x === x && cell.y === y)
        if (blockedCell) {
            const { wallId } = blockedCell
            if (!discoveredWalls().has(wallId)) {
                setDiscoveredWalls(prev => new Set([...prev, wallId]))
                const line = wallIdToLine(wallId)
                if (line) setDiscoveredLines(prev => [...prev, line])
            }
            setMyTurn(false)
            gameData().connection.send({ type: 'turn', myTurn: true, position: playerPos() })
            setShowTurnModal(true)
        }
    }

    return (
        <div class="screen-container">
            <Show when={showTurnModal()}>
                <TemporaryModal onFadeOut={() => setShowTurnModal(false)} duration={800}>
                    <span style={{ color: myTurn() ? '#22c55e' : '#dc2626' }}>
                        {myTurn() ? 'Your turn' : "Opponent's turn"}
                    </span>
                </TemporaryModal>
            </Show>

            <ResultModal
                show={showResultModal()}
                isWinner={isWinner()}
                onFadeOut={() => setShowResultModal(false)}
            />

            <div class="viewTabs">
                <button
                    class={`tabButton ${viewMode() === 'mine' ? 'active' : ''} ${myTurn() ? 'turnMy' : ''}`}
                    onClick={() => setViewMode('mine')}
                >
                    My Maze
                </button>
                <button
                    class={`tabButton ${viewMode() === 'opponent' ? 'active' : ''} ${!myTurn() ? 'turnOpponent' : ''}`}
                    onClick={() => setViewMode('opponent')}
                >
                    Opponent's Maze
                </button>
            </div>

            <div class="mazeWrapper">
                <Maze
                    interactive={false}
                    showWalls={false}
                    rows={rows}
                    cols={cols}
                    startCell={viewMode() === 'mine' ? opponentMaze()?.start : myMaze()?.start}
                    endCell={viewMode() === 'mine' ? opponentMaze()?.end : myMaze()?.end}
                >
                    <Show when={viewMode() === 'opponent'}>
                        <For each={myMaze()?.walls || []}>
                            {(id) => {
                                const line = wallIdToLine(id)
                                return line ? (
                                    <line
                                        x1={line.x1}
                                        y1={line.y1}
                                        x2={line.x2}
                                        y2={line.y2}
                                        stroke="#dc2626"
                                        stroke-width="0.06"
                                    />
                                ) : null
                            }}
                        </For>
                    </Show>
                    <Show when={viewMode() === 'mine'}>
                        <>
                            <For each={discoveredLines()}>
                                {(line) => (
                                    <line
                                        x1={line.x1}
                                        y1={line.y1}
                                        x2={line.x2}
                                        y2={line.y2}
                                        stroke="#dc2626"
                                        stroke-width="0.06"
                                    />
                                )}
                            </For>
                            <For each={revealedLines()}>
                                {(line) => (
                                    <line
                                        class="fadeIn"
                                        x1={line.x1}
                                        y1={line.y1}
                                        x2={line.x2}
                                        y2={line.y2}
                                        stroke="#dc2626"
                                        stroke-width="0.06"
                                    />
                                )}
                            </For>
                            <Show when={gameOver()}>
                                <For each={opponentRevealedLines()}>
                                    {(line) => (
                                        <line
                                            class="fadeIn"
                                            x1={line.x1}
                                            y1={line.y1}
                                            x2={line.x2}
                                            y2={line.y2}
                                            stroke="#dc2626"
                                            stroke-width="0.06"
                                        />
                                    )}
                                </For>
                            </Show>
                        </>
                    </Show>
                    <MoveHighlights
                        reachableCells={gameOver() ? [] : adjacentCells().reachable}
                        blockedCells={gameOver() ? [] : adjacentCells().blocked}
                        onCellClick={handleMoveClick}
                    />
                    <PlayerToken
                        x={viewMode() === 'mine' ? playerPos().x : opponentPos().x}
                        y={viewMode() === 'mine' ? playerPos().y : opponentPos().y}
                    />
                </Maze>
            </div>

            <Show when={gameOver()}>
                <div class="returnButtonWrapper">
                    <button class={buttonStyles.actionButton} onClick={navigateToHome}>
                        Return to Home
                    </button>
                </div>
            </Show>
        </div>
    )
}

export default GameScreen