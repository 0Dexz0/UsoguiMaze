import { createContext, useContext, createSignal } from 'solid-js'

const GameContext = createContext()

export function GameProvider(props) {
    const [screen, setScreen] = createSignal('home')
    const [gameData, setGameData] = createSignal(null)
    const [roomConfig, setRoomConfig] = createSignal(null)
    const [myMaze, setMyMaze] = createSignal(null)
    const [opponentMaze, setOpponentMaze] = createSignal(null)

    const navigateToGame = (peer, connection, config = null, isHost = false) => {
        if (config) setRoomConfig(config)
        setGameData({ peer, connection, isHost })
        setScreen('game')
    }

    const navigateToPlay = () => {
        setScreen('play')
    }

    const navigateToHome = () => {
        const data = gameData()
        if (data?.peer && !data.peer.destroyed) {
            data.peer.destroy()
        }
        setScreen('home')
        setGameData(null)
        setMyMaze(null)
        setOpponentMaze(null)
    }

    const navigateToCreate = () => {
        setScreen('create')
    }

    const navigateToJoin = () => {
        setScreen('join')
    }

    const navigateToWaiting = () => {
        setScreen('waiting')
    }

    return (
        <GameContext.Provider value={{
            screen,
            gameData,
            roomConfig,
            setRoomConfig,
            myMaze,
            setMyMaze,
            opponentMaze,
            setOpponentMaze,
            navigateToGame,
            navigateToPlay,
            navigateToHome,
            navigateToCreate,
            navigateToJoin,
            navigateToWaiting
        }}>
            {props.children}
        </GameContext.Provider>
    )
}

export function useGame() {
    return useContext(GameContext)
}