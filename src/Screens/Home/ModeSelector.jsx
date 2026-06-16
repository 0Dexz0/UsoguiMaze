import { css } from 'solid-styled'
import { useGame } from '../../context/GameContext'

const ModeSelector = () => {
    const { navigateToCreate, navigateToJoin } = useGame()

    css`
    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .title {
      font-size: 2.5rem;
      font-weight: 600;
      margin-bottom: 2rem;
      letter-spacing: -0.5px;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      max-width: 300px;
    }
    .button {
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 500;
      border: 1px solid #d1d5db;
      background: #f9fafb;
      color: #1a1a1a;
      border-radius: 8px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .button:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }
    .button:active {
      background: #e5e7eb;
    }
  `

    return (
        <div class="container">
            <h1 class="title">Maze Game</h1>
            <div class="actions">
                <button class="button" onClick={navigateToCreate}>Create Room</button>
                <button class="button" onClick={navigateToJoin}>Join Room</button>
            </div>
        </div>
    )
}

export default ModeSelector