import { Switch, Match } from 'solid-js'
import { GameProvider, useGame } from './context/GameContext'
import HomeScreen from './Screens/Home/HomeScreen'
import CreateRoomScreen from './Screens/Room/CreateRoomScreen'
import JoinRoomScreen from './Screens/Room/JoinRoomScreen'
import WaitingRoomScreen from './Screens/Room/WaitingRoomScreen'
import MazeCreationScreen from './Screens/MazeCreation/MazeCreationScreen'
import GameScreen from './Screens/Game/GameScreen'

const AppContent = () => {
    const { screen } = useGame()
    return (
        <Switch>
            <Match when={screen() === 'home'}>
                <HomeScreen />
            </Match>
            <Match when={screen() === 'create'}>
                <CreateRoomScreen />
            </Match>
            <Match when={screen() === 'join'}>
                <JoinRoomScreen />
            </Match>
            <Match when={screen() === 'waiting'}>
                <WaitingRoomScreen />
            </Match>
            <Match when={screen() === 'game'}>
                <MazeCreationScreen />
            </Match>
            <Match when={screen() === 'play'}>
                <GameScreen />
            </Match>
        </Switch>
    )
}

const App = () => {
    return (
        <GameProvider>
            <AppContent />
        </GameProvider>
    )
}

export default App