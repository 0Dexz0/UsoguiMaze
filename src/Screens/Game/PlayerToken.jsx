import { css } from 'solid-styled'

const PlayerToken = (props) => {
    css`
        .token {
            pointer-events: none;
            user-select: none;
        }
    `

    return (
        <circle
            class="token"
            style={{
                cx: props.x + 0.5,
                cy: props.y + 0.5,
                r: '0.3',
                fill: '#3b82f6',
                stroke: '#1d4ed8',
                'stroke-width': '0.05',
                transition: 'cx 0.5s ease, cy 0.5s ease'
            }}
        />
    )
}

export default PlayerToken