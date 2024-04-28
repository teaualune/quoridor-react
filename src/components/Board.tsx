import { BOARD_SIZE, WALL_LENGTH } from '../domain/GameRule'
import { Fragment } from 'react'
import { SIZE } from '../Constants'
import PlayerStep from './PlayerStep'
import { GameStore } from '../store/GameStore'

const PLAYER_SIZE = 28
const BORDER_ARR = new Array(BOARD_SIZE + 1).fill(0)
const BOARD_DIM = SIZE * BOARD_SIZE + 1

function Board(props: {
  game: GameStore
}) {
  return (
    <>
      <div style={{
        marginLeft: 'auto',
        marginRight: 'auto',
        position: 'relative',
        width: BOARD_DIM,
        height: BOARD_DIM,
      }}>
        {BORDER_ARR.map((_, i) => (
          <Fragment key={`border-${i}`}>
            <div style={{
              position: 'absolute',
              top: i * SIZE,
              left: 0,
              width: BOARD_DIM,
              height: 1,
              backgroundColor: 'black',
            }}></div> 
            <div style={{
              position: 'absolute',
              top: 0,
              left: i * SIZE,
              width: 1,
              height: BOARD_DIM,
              backgroundColor: 'black',
            }}></div> 
          </Fragment>
        ))}
        {props.game.walls.map((wall, i) => (
          <div key={`wall-${i}`} style={{
            position: 'absolute',
            top: wall.position[0] * SIZE,
            left: wall.position[1] * SIZE,
            width: wall.angle === 'h' ? WALL_LENGTH * SIZE : 1,
            height: wall.angle === 'v' ? WALL_LENGTH * SIZE : 1,
            backgroundColor: 'brown',
          }}></div>
        ))}
        {props.game.players.map(player => (
          <div key={player.name} style={{
            position: 'absolute',
            top: player.pawn.position[0] * SIZE,
            left: player.pawn.position[1] * SIZE,
            width: SIZE,
            height: SIZE,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <div style={{
              width: PLAYER_SIZE,
              height: PLAYER_SIZE,
              borderRadius: PLAYER_SIZE / 2,
              backgroundColor: player.pawn.color,
            }}></div>
          </div>
        ))}
        <PlayerStep game={props.game} onMove={(y, x) => {
          props.game.movePawn([y, x])
        }} />
      </div>
    </>
  )
}

export default Board
