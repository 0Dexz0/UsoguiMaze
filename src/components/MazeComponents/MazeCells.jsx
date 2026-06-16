import { For, Show } from 'solid-js'

const MazeCells = (props) => {
    const getFill = (x, y) => {
        if (props.startCell && props.startCell.x === x && props.startCell.y === y) return '#5b81d4'
        if (props.endCell && props.endCell.x === x && props.endCell.y === y) return '#39ac63'
        return '#f9fafb'
    }

    return (
        <For each={props.cells}>
            {({ x, y }) => (
                <g>
                    <rect
                        x={x}
                        y={y}
                        width="1"
                        height="1"
                        fill={getFill(x, y)}
                        stroke="#d1d5db"
                        stroke-width="0.04"
                    />
                    <Show when={props.startCell && props.startCell.x === x && props.startCell.y === y}>
                        <text
                            x={x + 0.5}
                            y={y + 0.5}
                            text-anchor="middle"
                            dominant-baseline="central"
                            fill="#ffffff"
                            font-size="0.5"
                            font-family="system-ui, -apple-system, sans-serif"
                            style="pointer-events: none; user-select: none;"
                        >
                            S
                        </text>
                    </Show>
                    <Show when={props.endCell && props.endCell.x === x && props.endCell.y === y}>
                        <text
                            x={x + 0.5}
                            y={y + 0.5}
                            text-anchor="middle"
                            dominant-baseline="central"
                            fill="#ffffff"
                            font-size="0.5"
                            font-family="system-ui, -apple-system, sans-serif"
                            style="pointer-events: none; user-select: none;"
                        >
                            E
                        </text>
                    </Show>
                </g>
            )}
        </For>
    )
}

export default MazeCells