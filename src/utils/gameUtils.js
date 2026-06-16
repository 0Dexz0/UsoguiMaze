export function getAdjacentCells(x, y, rows, cols, wallsSet, discovered) {
    const reachable = []
    const blocked = []
    const directions = [
        { dx: 0, dy: -1, wallId: `h_${y}_${x}` },
        { dx: 0, dy: 1, wallId: `h_${y + 1}_${x}` },
        { dx: -1, dy: 0, wallId: `v_${y}_${x}` },
        { dx: 1, dy: 0, wallId: `v_${y}_${x + 1}` }
    ]
    for (const { dx, dy, wallId } of directions) {
        const nx = x + dx
        const ny = y + dy
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
            if (wallsSet.has(wallId)) {
                if (!discovered.has(wallId)) {
                    blocked.push({ x: nx, y: ny, wallId, dx, dy, fromX: x, fromY: y })
                }
            } else {
                reachable.push({ x: nx, y: ny })
            }
        }
    }
    return { reachable, blocked }
}

export function wallIdToLine(id) {
    if (id.startsWith('h_')) {
        const [, r, c] = id.split('_')
        const y = parseInt(r)
        const x = parseInt(c)
        return { id, x1: x, y1: y, x2: x + 1, y2: y }
    } else if (id.startsWith('v_')) {
        const [, r, c] = id.split('_')
        const y = parseInt(r)
        const x = parseInt(c)
        return { id, x1: x, y1: y, x2: x, y2: y + 1 }
    }
    return null
}

export function startRevealSequence(baseWalls, discoveredSet, targetLinesSignal) {
    const unknownWalls = baseWalls.filter(id => !discoveredSet.has(id))
    if (unknownWalls.length === 0) return

    let delay = 200
    const minDelay = 50
    const acceleration = 0.9
    let index = 0

    function revealNext() {
        if (index >= unknownWalls.length) return
        const wallId = unknownWalls[index]
        const line = wallIdToLine(wallId)
        if (line) {
            targetLinesSignal(prev => [...prev, line])
        }
        index++
        delay = Math.max(minDelay, delay * acceleration)
        setTimeout(revealNext, delay)
    }
    revealNext()
}