import { For } from 'solid-js'
import { css } from 'solid-styled'

const MazeLabels = (props) => {
    css`
        .label {
            fill: #4b5563;
            font-size: 0.35px;
            font-family: system-ui, -apple-system, sans-serif;
        }
    `

    const { rows, cols } = props
    const letters = Array.from({ length: cols }, (_, i) => String.fromCharCode(65 + i))
    const numbers = Array.from({ length: rows }, (_, i) => i + 1)

    return (
        <>
            <g class="label">
                <For each={letters}>
                    {(letter, index) => (
                        <text x={index() + 0.5} y={-0.2} text-anchor="middle">{letter}</text>
                    )}
                </For>
            </g>
            <g class="label">
                <For each={numbers}>
                    {(number, index) => (
                        <text x={-0.3} y={index() + 0.5} text-anchor="end" dominant-baseline="central">{number}</text>
                    )}
                </For>
            </g>
        </>
    )
}

export default MazeLabels