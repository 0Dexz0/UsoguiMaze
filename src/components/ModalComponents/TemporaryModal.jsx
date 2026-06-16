import { onMount, createSignal } from 'solid-js'
import { css } from 'solid-styled'
import modalStyles from '~/shared-styles/modal.module.css'

const TemporaryModal = (props) => {
    css`
        .temporaryOverlay {
            z-index: 100;
            opacity: 0;
            transition: opacity 0.75s ease;
        }

        .temporaryOverlay.visible {
            opacity: 1;
        }

        .temporaryOverlay.closing {
            opacity: 0;
        }

        .message {
            font-size: 2.5rem;
            color: #1a1a1a;
            text-align: center;
            max-width: 80%;
            line-height: 1.3;
        }
    `

    let modalRef
    const [closing, setClosing] = createSignal(false)
    const duration = props.duration ?? 1500

    onMount(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                if (modalRef) {
                    modalRef.classList.add('visible')
                }
            })
        })

        setTimeout(() => {
            setClosing(true)
        }, duration)
    })

    const handleTransitionEnd = () => {
        if (closing()) {
            props.onFadeOut()
        }
    }

    return (
        <div
            ref={modalRef}
            class={`${modalStyles.overlay} temporaryOverlay ${closing() ? 'closing' : ''}`}
            onTransitionEnd={handleTransitionEnd}
        >
            <p class="message">
                {props.children}
            </p>
        </div>
    )
}

export default TemporaryModal