import { css } from 'solid-styled'
import MazeLabels from './MazeLabels'
import MazeCells from './MazeCells'
import MazeWalls from './MazeWalls'
import { Show } from 'solid-js'

const Maze = (props) => {
    css`
    .maze {
        -webkit-tap-highlight-color: transparent;
        width: min(100vw, 100vh);
        max-width: 800px;
        height: auto;
        display: block;
        transform: translateX(5px);
    }
  `

    const cells = []
    for (let r = 0; r < props.rows; r++) {
        for (let c = 0; c < props.cols; c++) {
            cells.push({ x: c, y: r })
        }
    }

    const handleSvgClick = (e) => {
        if (!props.interactive) return

        const svg = e.currentTarget
        const pt = svg.createSVGPoint()
        pt.x = e.clientX
        pt.y = e.clientY
        const ctm = svg.getScreenCTM().inverse()
        const svgPoint = pt.matrixTransform(ctm)

        const mx = svgPoint.x
        const my = svgPoint.y

        const cellX = Math.floor(mx)
        const cellY = Math.floor(my)

        if (cellX < 0 || cellX >= props.cols || cellY < 0 || cellY >= props.rows) return

        if (!props.isPlacingWalls) {
            props.onCellClick?.(cellX, cellY)
            return
        }

        const isStart = props.startCell && props.startCell.x === cellX && props.startCell.y === cellY
        const isEnd = props.endCell && props.endCell.x === cellX && props.endCell.y === cellY

        if (isStart || isEnd) {
            props.onCellClick?.(cellX, cellY)
            return
        }

        const dx = mx - cellX
        const dy = my - cellY

        let side
        if (dx < 0.5 && dy < 0.5) {
            side = dx < dy ? 'left' : 'top'
        } else if (dx >= 0.5 && dy < 0.5) {
            const rightDist = 1 - dx
            side = rightDist < dy ? 'right' : 'top'
        } else if (dx < 0.5 && dy >= 0.5) {
            const bottomDist = 1 - dy
            side = dx < bottomDist ? 'left' : 'bottom'
        } else {
            const rightDist = 1 - dx
            const bottomDist = 1 - dy
            side = rightDist < bottomDist ? 'right' : 'bottom'
        }

        props.onWallClick?.(cellX, cellY, side)
    }

    return (
        <svg
            class="maze"
            viewBox={`-1 -1 ${props.cols + 2} ${props.rows + 2}`}
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleSvgClick}
            style={{ cursor: props.interactive ? 'pointer' : 'default' }}
        >
            <MazeLabels rows={props.rows} cols={props.cols} />
            <MazeCells
                cells={cells}
                startCell={props.startCell}
                endCell={props.endCell}
            />
            <Show when={props.showWalls !== false}>
                <MazeWalls
                    walls={props.walls}
                    rows={props.rows}
                    cols={props.cols}
                />
            </Show>
            {props.children}
        </svg>
    )
}

export default Maze