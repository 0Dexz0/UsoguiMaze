import { css } from 'solid-styled'

const WallCounter = (props) => {
    css`
        .counter {
            font-size: 1rem;
            font-weight: 500;
            color: #1a1a1a;
            margin-bottom: 0.75rem;
            text-align: center;
        }

        @media (min-width: 660px) {
            .counter {
                transform: translateY(15px);
                font-size: 20px;
            }
        }
    `

    return (
        <div class="counter">
            Walls: {props.placed} / {props.total}
        </div>
    )
}

export default WallCounter