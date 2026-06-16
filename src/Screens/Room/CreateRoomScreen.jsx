import { createSignal, createMemo, For } from 'solid-js'
import { useGame } from '~/context/GameContext'
import formStyles from '~/shared-styles/formStyles.module.css'

const mazeSizes = ['4x4', '8x8', '10x10', '12x12', '15x15']

const baseWalls = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

const wallsOptions = {
    '4x4': [5, 10],
    '8x8': baseWalls,
    '10x10': [...baseWalls, 60, 65],
    '12x12': [...baseWalls, 60, 65, 70, 75],
    '15x15': [...baseWalls, 60, 65, 70, 75, 80, 85],
}

const defaultWalls = wallsOptions['4x4'][0]

const CreateRoomScreen = () => {
    const { setRoomConfig, navigateToWaiting, navigateToHome } = useGame()

    const [mazeSize, setMazeSize] = createSignal(mazeSizes[0])
    const [wallsCount, setWallsCount] = createSignal(defaultWalls)

    const availableWalls = createMemo(() => wallsOptions[mazeSize()])

    const handleMazeSizeChange = (e) => {
        const newSize = e.currentTarget.value
        setMazeSize(newSize)
        const newOptions = wallsOptions[newSize]
        if (!newOptions.includes(wallsCount())) {
            setWallsCount(newOptions[0])
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setRoomConfig({ mazeSize: mazeSize(), wallsCount: wallsCount() })
        navigateToWaiting()
    }

    return (
        <div class="screen-container">
            <h1 class={formStyles.title}>Create Room</h1>
            <form class={formStyles.form} onSubmit={handleSubmit}>
                <div class={formStyles.field}>
                    <label for="mazeSize">Maze size</label>
                    <select
                        id="mazeSize"
                        value={mazeSize()}
                        onInput={handleMazeSizeChange}
                    >
                        <For each={mazeSizes}>
                            {(size) => <option value={size}>{size}</option>}
                        </For>
                    </select>
                </div>
                <div class={formStyles.field}>
                    <label for="wallsCount">Number of walls</label>
                    <select
                        id="wallsCount"
                        value={wallsCount()}
                        onInput={(e) => setWallsCount(Number(e.currentTarget.value))}
                    >
                        <For each={availableWalls()}>
                            {(count) => <option value={count}>{count}</option>}
                        </For>
                    </select>
                </div>
                <div class={formStyles.formActions}>
                    <button type="button" class={formStyles.buttonSecondary} onClick={navigateToHome}>
                        Back
                    </button>
                    <button type="submit" class={formStyles.buttonPrimary}>
                        Create
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CreateRoomScreen