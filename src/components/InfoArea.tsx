import { Game, GameStatus } from '../model/Game'

function InfoArea(props: {
  game: Game
  onStart: () => void
}) {
  const { game } = props
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
        <span>{`${game.players[game.playingIndex ?? 0].name} Playing`}</span>
      )}
    </div>
  )
}

export default InfoArea
