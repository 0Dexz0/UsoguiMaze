import { css } from 'solid-styled'
import modalStyles from '~/shared-styles/modal.module.css'

const ErrorModal = (props) => {
    css`
        .errorOverlay {
            z-index: 200;
        }

        .message {
            font-size: 1.2rem;
            color: #1a1a1a;
            margin-bottom: 1.5rem;
        }
    `

    return (
        <div class={`${modalStyles.overlay} errorOverlay`}>
            <div class={modalStyles.modalBox}>
                <p class="message">{props.children}</p>
                <button class={modalStyles.modalButton} onClick={props.onClose}>
                    Close
                </button>
            </div>
        </div>
    )
}

export default ErrorModal