import { Game, GameStatus, PlaceWallState } from '../model/Game'

function InfoArea(props: {
  game: Game
  onStart: () => void
  wallState?: PlaceWallState
  onSetWallState: (state: PlaceWallState) => void
}) {
  const { game, wallState, onSetWallState } = props

  return (
    <div style={{
      maxWidth: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: '20px',
      textAlign: 'center',
    }}>
      {game.status === GameStatus.End && typeof game.wonIndex === 'number' ? (
        <>
          <span style={{fontWeight: 'bold'}}>{`${game.players[game.wonIndex].name} Wins!`}</span>
          <br />
        </>
      ) : null}
      {game.status !== GameStatus.Playing ? (
        <button onClick={props.onStart}>{game.status === GameStatus.Ready ? 'START' : 'REPLAY'}</button>
      ) : (
        <>
          <span>{`${game.players[game.playingIndex ?? 0].name} Playing`}</span>
          <br />
          <span>{`Remaining walls: ${game.players[game.playingIndex ?? 0].remainingWalls}`}</span>
          <br />
          <label>
            <input
              type="checkbox"
              checked={wallState === 'v'}
              onChange={e => {
                onSetWallState(e.currentTarget.checked ? 'v' : undefined)
              }}
            />
            Vertical Wall
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={wallState === 'h'}
              onChange={e => {
                onSetWallState(e.currentTarget.checked ? 'h' : undefined)
              }}
            />
            Horizontal Wall
          </label>
        </>
      )}
    </div>
  )
}

export default InfoArea
