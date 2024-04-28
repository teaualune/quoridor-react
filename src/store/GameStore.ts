import { createStore } from 'zustand'
import { emptyGameState, initGame, movePawn, onTurnEnd, placeWall } from '../domain/GameRule'
import { Coordinate, Game, GameStatus, GameType, Wall } from '../model/Game'
import { immer } from 'zustand/middleware/immer'

async function wait(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, 1)
  })
}

export interface GameStore extends Game {
  initGame(gameType: GameType): void
  movePawn(to: Coordinate): Promise<void>
  placeWall(wall: Wall): Promise<void>
}

const gameStore = createStore(immer<GameStore>((set, get) => {
  const endTurn = async (isMovePawn: boolean) => {
    await wait()
    const game = get()
    const result = onTurnEnd(isMovePawn, game)
    if (result === 'next') {
      set(state => {
        const nextPlaying = (state.playingIndex ?? 0) + 1
        const count = state.players.length
        state.playingIndex = nextPlaying >= count ? (nextPlaying - count) : nextPlaying
      })
    } else {
      set({
        status: GameStatus.End,
        wonIndex: result.wonIndex,
      })
    }
  }

  return {
    ...emptyGameState,
    initGame(gameType: GameType) {
      set(initGame(gameType))
    },
    async movePawn(to: Coordinate) {
      const game = get()
      const [nextPawn, playingIndex] = movePawn(to, game)
      set(state => {
        state.players[playingIndex].pawn = nextPawn
      })
      await endTurn(true)
    },
    async placeWall(wall: Wall) {
      const game = get()
      const [walls, remainingWalls, playingIndex] = placeWall(wall, game)
      set(state => {
        state.walls = walls
        state.players[playingIndex].remainingWalls = remainingWalls
      })
      await endTurn(false)
    },
  }
}))

export default gameStore
