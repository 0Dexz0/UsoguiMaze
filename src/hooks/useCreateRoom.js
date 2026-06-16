import { createSignal, onMount } from 'solid-js'
import { createRoom } from '~/peer'

export function useCreateRoom(roomConfig, navigateToGame, navigateToHome) {
    const [roomId, setRoomId] = createSignal('')
    const [ready, setReady] = createSignal(false)
    const [copied, setCopied] = createSignal(false)
    let peer

    onMount(async () => {
        try {
            const room = await createRoom()
            peer = room.peer
            setRoomId(room.roomId)
            setReady(true)

            peer.on('connection', (conn) => {
                conn.on('open', () => {
                    conn.send({ type: 'config', payload: roomConfig() })
                    navigateToGame(peer, conn, null, true)
                })
            })

            peer.on('error', (err) => {
                console.error('Peer error:', err)
            })
        } catch (err) {
            console.error('Failed to create room:', err)
            navigateToHome()
        }
    })

    const handleCancel = () => {
        if (peer && !peer.destroyed) {
            peer.destroy()
        }
        navigateToHome()
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(roomId())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return { roomId, ready, copied, handleCancel, handleCopy }
}