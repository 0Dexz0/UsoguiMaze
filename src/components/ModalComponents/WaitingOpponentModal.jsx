import { css } from 'solid-styled'
import modalStyles from '~/shared-styles/modal.module.css'

const WaitingOpponentModal = (props) => {
    css`
        .waitingOverlay {
            z-index: 200;
        }

        .modalContent {
            display: flex;
            flex-direction: column;
            align-items: center;
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
            to {
                transform: rotate(360deg);
            }
        }

        .message {
            font-size: 1.1rem;
            color: #4b5563;
            margin: 0;
        }
    `

    return (
        <div class={`${modalStyles.overlay} waitingOverlay`}>
            <div class={`${modalStyles.modalBox} modalContent`}>
                <div class="spinner"></div>
                <p class="message">Waiting for opponent to finish...</p>
                <button class={modalStyles.modalButton} onClick={props.onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default WaitingOpponentModal