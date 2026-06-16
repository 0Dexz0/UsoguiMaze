import { Show, createSignal } from 'solid-js'
import { css } from 'solid-styled'
import { useGame } from '~/context/GameContext'
import { useCreateRoom } from '~/hooks/useCreateRoom'
import buttonStyles from '~/shared-styles/buttons.module.css'

const CopyIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
)

const WaitingRoomScreen = () => {
    const { roomConfig, navigateToGame, navigateToHome } = useGame()
    const { roomId, ready, handleCancel } = useCreateRoom(
        roomConfig,
        navigateToGame,
        navigateToHome
    )

    const [copied, setCopied] = createSignal(false)

    css`
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: #ffffff;
        gap: 1.5rem;
    }

    .spinner {
        width: 48px;
        height: 48px;
        border: 4px solid #e5e7eb;
        border-top-color: #6b7280;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    .text {
        font-size: 1.1rem;
        color: #4b5563;
        margin: 0;
    }

    .roomInfo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: #f9fafb;
        min-height: 44px;
        box-sizing: border-box;
    }

    .roomId {
        font-size: 1rem;
        color: #1a1a1a;
        font-family: monospace;
    }

    .copyButton {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        padding: 0.3rem 0.6rem;
        font-size: 0.85rem;
        font-weight: 500;
        border: 1px solid #d1d5db;
        background: #ffffff;
        color: #1a1a1a;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.2s;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
    }

    .copyButton:hover {
        background: #f3f4f6;
    }

    .copyButton:active {
        background: #e5e7eb;
    }

    .skeleton {
        background: #e5e7eb;
        border-radius: 4px;
        animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
    }
  `

    const copyToClipboard = async (text) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            try {
                await navigator.clipboard.writeText(text)
                return true
            } catch (err) {
                return fallbackCopy(text)
            }
        }
        return fallbackCopy(text)
    }

    const fallbackCopy = (text) => {
        try {
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.position = 'fixed'
            textarea.style.left = '-9999px'
            textarea.style.top = '-9999px'
            textarea.style.opacity = '0'
            document.body.appendChild(textarea)

            textarea.select()
            textarea.setSelectionRange(0, text.length)

            const success = document.execCommand('copy')
            document.body.removeChild(textarea)
            return success
        } catch (err) {
            return false
        }
    }

    const handleCopyClick = async () => {
        const id = roomId()
        if (!id) return

        const success = await copyToClipboard(id)
        if (success) {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div class="screen-container">
            <div class="container">
                <div class="spinner" />
                <p class="text">Waiting for a player to join...</p>
                <div class="roomInfo">
                    <Show
                        when={ready()}
                        fallback={
                            <>
                                <div class="skeleton" style="width: 134px; height: 20px;" />
                                <div class="skeleton" style="width: 65px; height: 28px; border-radius: 6px;" />
                            </>
                        }
                    >
                        <span class="roomId">Room: {roomId()}</span>
                        <button class="copyButton" onClick={handleCopyClick}>
                            <CopyIcon />
                            {copied() ? 'Copied!' : 'Copy'}
                        </button>
                    </Show>
                </div>
                <button class={buttonStyles.actionButton} onClick={handleCancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default WaitingRoomScreen