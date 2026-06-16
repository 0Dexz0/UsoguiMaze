import { For } from 'solid-js'
import { css } from 'solid-styled'

const MoveHighlights = (props) => {
    css`
        .highlight {
            opacity: 0.5;
        }
    `

    return (
        <>
            <For each={props.reachableCells}>
                {({ x, y }) => (
                    <rect
                        class="highlight"
                        x={x}
                        y={y}
                        width="1"
                        height="1"
                        fill="#bfdbfe"
                        onClick={() => props.onCellClick?.(x, y)}
                        style={{ cursor: 'pointer' }}
                    />
                )}
            </For>
            <For each={props.blockedCells}>
                {({ x, y }) => (
                    <rect
                        class="highlight"
                        x={x}
                        y={y}
                        width="1"
                        height="1"
                        fill="#bfdbfe"
                        onClick={() => props.onCellClick?.(x, y)}
                        style={{ cursor: 'pointer' }}
                    />
                )}
            </For>
        </>
    )
}

export default MoveHighlights