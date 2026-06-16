import { Show } from 'solid-js'
import { useGame } from '~/context/GameContext'
import { useJoinRoom } from '~/hooks/useJoinRoom'
import formStyles from '~/shared-styles/formStyles.module.css'

const JoinRoomScreen = () => {
    const { navigateToGame, navigateToHome } = useGame()
    const { roomId, setRoomId, error, connecting, handleSubmit } = useJoinRoom(navigateToGame)

    const onFormSubmit = (e) => {
        e.preventDefault()
        handleSubmit(roomId())
    }

    return (
        <div class="screen-container">
            <h1 class={formStyles.title}>Join Room</h1>
            <form class={formStyles.form} onSubmit={onFormSubmit}>
                <div class={formStyles.field}>
                    <label for="roomId">Room ID</label>
                    <input
                        id="roomId"
                        type="text"
                        value={roomId()}
                        onInput={(e) => setRoomId(e.currentTarget.value)}
                        placeholder="Enter room code"
                    />
                </div>
                <Show when={error()}>
                    <p class={formStyles.error}>{error()}</p>
                </Show>
                <div class={formStyles.formActions}>
                    <button type="button" class={formStyles.buttonSecondary} onClick={navigateToHome}>
                        Back
                    </button>
                    <button type="submit" class={formStyles.buttonPrimary} disabled={connecting()}>
                        {connecting() ? 'Connecting...' : 'Join'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default JoinRoomScreen