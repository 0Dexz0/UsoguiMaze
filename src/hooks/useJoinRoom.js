import { createSignal } from 'solid-js'
import { joinRoom } from '~/peer'

export function useJoinRoom(navigateToGame) {
    const [roomId, setRoomId] = createSignal('')
    const [error, setError] = createSignal('')
    const [connecting, setConnecting] = createSignal(false)

    const handleSubmit = async (id) => {
        const trimmed = id.trim()
        if (!trimmed) return

        setError('')
        setConnecting(true)

        try {
            const { peer, connection } = await joinRoom(trimmed)
            let configReceived = false

            connection.on('data', (data) => {
                if (data.type === 'config' && !configReceived) {
                    configReceived = true
                    navigateToGame(peer, connection, data.payload, false)
                }
            })

            connection.on('open', () => {
                setTimeout(() => {
                    if (!configReceived) {
                        setError('Did not receive game configuration.')
                        setConnecting(false)
                        peer.destroy()
                    }
                }, 5000)
            })

            connection.on('error', () => {
                setError('Room not found or connection failed.')
                setConnecting(false)
                peer.destroy()
            })

            peer.on('error', () => {
                if (connecting()) {
                    setError('Could not connect to the room.')
                    setConnecting(false)
                    peer.destroy()
                }
            })
        } catch {
            setError('Failed to connect. Please try again.')
            setConnecting(false)
        }
    }

    return { roomId, setRoomId, error, connecting, handleSubmit }
}