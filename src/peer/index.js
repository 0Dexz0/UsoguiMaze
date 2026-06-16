import Peer from 'peerjs'

function generateRoomId() {
    return Math.random().toString(36).substring(2, 10)
}

export async function createRoom() {
    const roomId = generateRoomId()
    const peer = new Peer(roomId)
    return new Promise((resolve, reject) => {
        peer.on('open', () => resolve({ peer, roomId }))
        peer.on('error', (err) => reject(err))
    })
}

export async function joinRoom(roomId) {
    const peer = new Peer()
    return new Promise((resolve, reject) => {
        peer.on('open', () => {
            const connection = peer.connect(roomId)
            resolve({ peer, connection })
        })
        peer.on('error', (err) => reject(err))
    })
}