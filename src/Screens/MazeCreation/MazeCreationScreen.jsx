import { createSignal, Show, createMemo, onMount, onCleanup } from 'solid-js'
import { css } from 'solid-styled'
import { useGame } from '../../context/GameContext'
import Maze from '../../components/MazeComponents/Maze'
import SelectionModal from '../../components/ModalComponents/TemporaryModal'
import WallCounter from './WallCounter'
import ErrorModal from '../../components/ModalComponents/ErrorModal'
import WaitingOpponentModal from '../../components/ModalComponents/WaitingOpponentModal'
import buttonStyles from '../../shared-styles/buttons.module.css'

function hasPath(rows, cols, start, end, walls) {
    const visited = new Set()
    const queue = [{ x: start.x, y: start.y }]
    visited.add(`${start.x},${start.y}`)

    const directions = [
        { dx: 0, dy: -1, wallCheck: (x, y) => `h_${y}_${x}` },
        { dx: 0, dy: 1, wallCheck: (x, y) => `h_${y + 1}_${x}` },
        { dx: -1, dy: 0, wallCheck: (x, y) => `v_${y}_${x}` },
        { dx: 1, dy: 0, wallCheck: (x, y) => `v_${y}_${x + 1}` }
    ]

    while (queue.length > 0) {
        const { x, y } = queue.shift()
        if (x === end.x && y === end.y) return true

        for (const { dx, dy, wallCheck } of directions) {
            const nx = x + dx
            const ny = y + dy
            if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue
            const wallId = wallCheck(x, y)
            if (walls.has(wallId)) continue
            const key = `${nx},${ny}`
            if (visited.has(key)) continue
            visited.add(key)
            queue.push({ x: nx, y: ny })
        }
    }
    return false
}

function getWallId(cellX, cellY, side, rows, cols) {
    switch (side) {
        case 'left': return cellX > 0 ? `v_${cellY}_${cellX}` : null
        case 'right': return cellX < cols - 1 ? `v_${cellY}_${cellX + 1}` : null
        case 'top': return cellY > 0 ? `h_${cellY}_${cellX}` : null
        case 'bottom': return cellY < rows - 1 ? `h_${cellY + 1}_${cellX}` : null
        default: return null
    }
}

const MazeCreationScreen = () => {
    css`
    .mazeWrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      padding-bottom: 80px;
    }
    .confirmButtonWrapper {
      position: fixed; 
      bottom: 50px;     
      left: 50%;
      transform: translateX(-50%);
      z-index: 100;
      pointer-events: none;
    }
    .confirmButtonWrapper button {
      pointer-events: auto;
    }
  `

    const { roomConfig, gameData, myMaze, setMyMaze, opponentMaze, setOpponentMaze, navigateToPlay } = useGame()
    const sizeConfig = roomConfig()?.mazeSize || '8x8'
    const [rows, cols] = sizeConfig.split('x').map(Number)
    const maxWalls = roomConfig()?.wallsCount || 15

    const [startCell, setStartCell] = createSignal(null)
    const [endCell, setEndCell] = createSignal(null)
    const [showModal, setShowModal] = createSignal(true)
    const [walls, setWalls] = createSignal(new Set())
    const [showErrorModal, setShowErrorModal] = createSignal(false)
    const [waitingForOpponent, setWaitingForOpponent] = createSignal(false)

    const isPlacingWalls = () => startCell() && endCell()
    const wallsPlaced = createMemo(() => walls().size)

    let connection

    onMount(() => {
        connection = gameData().connection
        connection.on('data', (data) => {
            if (data.type === 'maze') {
                setOpponentMaze(data.payload)
                if (myMaze()) {
                    navigateToPlay()
                }
            } else if (data.type === 'cancel') {
                setOpponentMaze(null)
            }
        })
    })

    onCleanup(() => {
        if (connection) connection.off('data')
    })

    const handleCellClick = (x, y) => {
        const start = startCell()
        const end = endCell()

        if (start && start.x === x && start.y === y) {
            setStartCell(null)
            return
        }
        if (end && end.x === x && end.y === y) {
            setEndCell(null)
            return
        }

        if (!start) {
            setStartCell({ x, y })
            return
        }
        if (!end) {
            setEndCell({ x, y })
            return
        }
    }

    const handleWallClick = (x, y, side) => {
        if (!isPlacingWalls()) return

        const newWalls = new Set(walls())
        const wallId = getWallId(x, y, side, rows, cols)
        if (!wallId) return

        if (newWalls.has(wallId)) {
            newWalls.delete(wallId)
        } else {
            if (newWalls.size >= maxWalls) return
            newWalls.add(wallId)
        }
        setWalls(newWalls)
    }

    const handleConfirm = () => {
        const pathExists = hasPath(rows, cols, startCell(), endCell(), walls())
        if (!pathExists) {
            setShowErrorModal(true)
            return
        }
        const maze = {
            start: startCell(),
            end: endCell(),
            walls: [...walls()]
        }
        setMyMaze(maze)
        gameData().connection.send({ type: 'maze', payload: maze })
        if (opponentMaze()) {
            navigateToPlay()
        } else {
            setWaitingForOpponent(true)
        }
    }

    const handleCancelWait = () => {
        setMyMaze(null)
        gameData().connection.send({ type: 'cancel' })
        setWaitingForOpponent(false)
    }

    return (
        <div class="screen-container">
            <Show when={showModal()}>
                <SelectionModal onFadeOut={() => setShowModal(false)}>
                    Select <span style="color: #5b81d4">Start</span> and <span style="color: #39ac63">End</span> cells on the maze
                </SelectionModal>
            </Show>
            <Show when={showErrorModal()}>
                <ErrorModal onClose={() => setShowErrorModal(false)}>
                    No path exists between the <span style="color: #5b81d4">Start</span> and <span style="color: #39ac63">End</span> cells
                </ErrorModal>
            </Show>
            <Show when={waitingForOpponent()}>
                <WaitingOpponentModal onCancel={handleCancelWait} />
            </Show>
            <div class="mazeWrapper">
                <WallCounter placed={wallsPlaced()} total={maxWalls} />
                <Maze
                    interactive={true}
                    rows={rows}
                    cols={cols}
                    startCell={startCell()}
                    endCell={endCell()}
                    walls={walls}
                    isPlacingWalls={isPlacingWalls()}
                    onCellClick={handleCellClick}
                    onWallClick={handleWallClick}
                />
                <Show when={isPlacingWalls() && wallsPlaced() === maxWalls && !waitingForOpponent()}>
                    <div class="confirmButtonWrapper">
                        <button class={buttonStyles.actionButton} onClick={handleConfirm}>
                            Confirm Selection
                        </button>
                    </div>
                </Show>
            </div>
        </div>
    )
}

export default MazeCreationScreen