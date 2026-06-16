import { For, createMemo } from 'solid-js'

const MazeWalls = (props) => {
    const hWalls = createMemo(() => {
        const wallsSet = props.walls()
        const arr = []
        for (let r = 1; r < props.rows; r++) {
            for (let c = 0; c < props.cols; c++) {
                const id = `h_${r}_${c}`
                if (wallsSet.has(id)) {
                    arr.push({ id, x1: c, y1: r, x2: c + 1, y2: r })
                }
            }
        }
        return arr
    })

    const vWalls = createMemo(() => {
        const wallsSet = props.walls()
        const arr = []
        for (let c = 1; c < props.cols; c++) {
            for (let r = 0; r < props.rows; r++) {
                const id = `v_${r}_${c}`
                if (wallsSet.has(id)) {
                    arr.push({ id, x1: c, y1: r, x2: c, y2: r + 1 })
                }
            }
        }
        return arr
    })

    return (
        <g>
            <For each={hWalls()}>
                {(wall) => (
                    <line
                        x1={wall.x1}
                        y1={wall.y1}
                        x2={wall.x2}
                        y2={wall.y2}
                        stroke="#dc2626"
                        stroke-width="0.06"
                    />
                )}
            </For>
            <For each={vWalls()}>
                {(wall) => (
                    <line
                        x1={wall.x1}
                        y1={wall.y1}
                        x2={wall.x2}
                        y2={wall.y2}
                        stroke="#dc2626"
                        stroke-width="0.06"
                    />
                )}
            </For>
        </g>
    )
}

export default MazeWalls