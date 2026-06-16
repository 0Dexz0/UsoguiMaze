import { createEffect, Show } from 'solid-js'
import confetti from 'canvas-confetti'
import TemporaryModal from './TemporaryModal'

let confettiInterval = null

export default function ResultModal(props) {
    createEffect(() => {
        if (props.isWinner && props.show) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } })
            confettiInterval = setInterval(() => {
                confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } })
            }, 400)
            setTimeout(() => {
                if (confettiInterval) {
                    clearInterval(confettiInterval)
                    confettiInterval = null
                }
            }, 2500)
        }
    })

    return (
        <Show when={props.show}>
            <TemporaryModal onFadeOut={props.onFadeOut} duration={2500}>
                <span style={{ color: props.isWinner ? '#22c55e' : '#dc2626', 'font-size': '2rem' }}>
                    {props.isWinner ? '🎉 You Win!' : '💀 You Lose!'}
                </span>
            </TemporaryModal>
        </Show>
    )
}