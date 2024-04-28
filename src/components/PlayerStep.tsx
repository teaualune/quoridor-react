import { memo } from 'react'
import { calculatePawnSteps } from '../domain/GameRule'
import { Game, GameStatus } from '../model/Game'
import { SIZE } from '../Constants'

const PlayerStep = memo((props: {
  game: Game
  onMove: (y: number, x: number) => void
}) => {
  const { game, onMove } = props
  const { playingIndex, status } = game
  if (status !== GameStatus.Playing || typeof playingIndex !== 'number') {
    return null
  }

  const steps = calculatePawnSteps(game)
  const [y, x] = game.players[playingIndex].pawn.position
  console.log(steps)

  return (
    <>
      {steps.top > 0 ? (<div style={{
        position: 'absolute',
        top: (y - steps.top) * SIZE,
        left: x * SIZE,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <button onClick={() => {
          onMove(y - steps.top, x)
        }}>U</button>
      </div>) : null}
      {steps.left > 0 ? (<div style={{
        position: 'absolute',
        top: y * SIZE,
        left: (x - steps.left) * SIZE,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <button onClick={() => {
          onMove(y, x - steps.left)
        }}>L</button>
      </div>) : null}
      {steps.right > 0 ? (<div style={{
        position: 'absolute',
        top: y * SIZE,
        left: (x + steps.right) * SIZE,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <button onClick={() => {
          onMove(y, x + steps.right)
        }}>R</button>
      </div>) : null}
      {steps.bottom > 0 ? (<div style={{
        position: 'absolute',
        top: (y + steps.bottom) * SIZE,
        left: x * SIZE,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <button onClick={() => {
          onMove(y + steps.bottom, x)
        }}>B</button>
      </div>) : null}
    </>
  )
}, (prevProps, nextProps) => {
  const prevGame = prevProps.game
  const nextGame = nextProps.game
  if (prevGame.status !== nextGame.status) return false
  if (prevGame.playingIndex !== nextGame.playingIndex) return false
  return true
})

export default PlayerStep
