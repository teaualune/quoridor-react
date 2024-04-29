import './App.css'
import { useState } from 'react'
import { useStore } from 'zustand'
import gameStore from './store/GameStore'
import { GameType, PlaceWallState } from './model/Game'
import Board from './components/Board'
import InfoArea from './components/InfoArea'

function App() {
  const gameStoreState = useStore(gameStore, state => state)
  const [wallState, setWallState] = useState<PlaceWallState>()

  // useEffect(() => {
  //   gameStoreState.initGame(GameType.Two)
  //   // gameStoreState.placeWall({
  //   //   position: [0, 0],
  //   //   angle: 'h',
  //   // })
  //   gameStoreState.movePawn([4, 6])
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <>
      <Board
        game={gameStoreState}
        wallState={wallState}
        resetWallState={() => setWallState(undefined)}
      />
      <InfoArea
        game={gameStoreState}
        onStart={() => {
          gameStoreState.initGame(GameType.Two)
        }}
        wallState={wallState}
        onSetWallState={setWallState}
      />
    </>
  )
}

export default App
