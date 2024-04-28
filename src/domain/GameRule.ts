import {
  Coordinate,
  Game,
  GameStatus,
  GameType,
  Pawn,
  PawnColor,
  PawnStepLength,
  PawnSteps,
  Player,
  Wall,
} from '../model/Game'

const pawnColors: PawnColor[] = ['red', 'blue', 'yellow', 'green']

const wallCount: Record<GameType, number> = {
  [GameType.Two]: 10,
  [GameType.Four]: 5,
}

export const BOARD_SIZE = 9
export const WALL_LENGTH = 2

const START_IDX = 0
const CENTER_IDX = Math.floor(BOARD_SIZE / 2)
const END_IDX = BOARD_SIZE - 1

function initPlayers(gameType: GameType): Player[] {
  const colors: PawnColor[] = gameType === GameType.Four ? pawnColors : [pawnColors[0], pawnColors[1]]
  return colors.map((color, index) => ({
    name: `Player ${index + 1}`,
    pawn: {
      color,
      position: index === 0 ?
        [CENTER_IDX, START_IDX] : // left
        gameType === GameType.Four && index === 1 ?
        [START_IDX, CENTER_IDX] : // top
        (gameType === GameType.Two && index === 1) || index === 2 ?
        [CENTER_IDX, END_IDX] : // right
        [END_IDX, CENTER_IDX], // bottom
    },
    remainingWalls: wallCount[gameType],
  }))
}

export const emptyGameState: Game = {
  status: GameStatus.Ready,
  players: [],
  walls: [],
}

export function initGame(gameType: GameType): Game {
  return {
    status: GameStatus.Playing,
    players: initPlayers(gameType),
    walls: [],
    playingIndex: 0,
  }
}

function getPlayingIndex(game: Game): number {
  const { playingIndex, status } = game
  if (status !== GameStatus.Playing || typeof playingIndex !== 'number') {
    throw new Error('invalid game state')
  }
  return playingIndex
}

export function calculatePawnSteps(game: Game): PawnSteps {
  const playingIndex = getPlayingIndex(game)
  const { position } = game.players[playingIndex].pawn
  let top: PawnStepLength = 1
  let left: PawnStepLength = 1
  let bottom: PawnStepLength = 1
  let right: PawnStepLength = 1

  const y = position[0]
  const x = position[1]

  if (y === START_IDX) top = 0
  if (y === END_IDX) bottom = 0
  if (x === START_IDX) left = 0
  if (x === END_IDX) right = 0

  let topPawn = false
  let leftPawn = false
  let bottomPawn = false
  let rightPawn = false
  game.players.forEach((otherPlayer, index) => {
    if (index === playingIndex) return
    const yOther = otherPlayer.pawn.position[0]
    const xOther = otherPlayer.pawn.position[1]
    if (y === yOther + 1 && x === xOther) topPawn = true
    else if (y === yOther - 1 && x === xOther) bottomPawn = true
    else if (x === xOther + 1 && y === yOther) leftPawn = true
    else if (x === xOther - 1 && y === yOther) rightPawn = true
  })

  let topWall2 = false
  let leftWall2 = false
  let bottomWall2 = false
  let rightWall2 = false
  for (const wall of game.walls) {
    const yDiff = wall.position[0] - y
    const xDiff = wall.position[1] - x
    if (wall.angle === 'h' && xDiff > -WALL_LENGTH && xDiff <= 0) {
      if (yDiff === -1) topWall2 = true
      else if (yDiff === 0) top = 0
      else if (yDiff === 1) bottom = 0
      else if (yDiff === 2) bottomWall2 = true
    } else if (wall.angle === 'v' && yDiff > -WALL_LENGTH && yDiff <= 0) {
      if (xDiff === -1) leftWall2 = true
      else if (xDiff === 0) left = 0
      else if (xDiff === 1) right = 0
      else if (xDiff === 2) rightWall2 = true
    }
  }

  if (topPawn) top = topWall2 ? 0 : 2
  if (leftPawn) left = leftWall2 ? 0 : 2
  if (rightPawn) right = rightWall2 ? 0 : 2
  if (bottomPawn) bottom = bottomWall2 ? 0 : 2

  return { top, left, bottom, right }
}

export function movePawn(to: Coordinate, game: Game): [Pawn, number] {
  const playingIndex = getPlayingIndex(game)
  const { pawn } = game.players[playingIndex]
  return [{
    ...pawn,
    position: to,
  }, playingIndex]
}

function isWallIntersected(wall1: Wall, wall2: Wall): boolean {
  const y1 = wall1.position[0]
  const x1 = wall1.position[1]
  const y2 = wall2.position[0]
  const x2 = wall2.position[1]
  if (wall1.angle === 'h') {
    if (wall2.angle === 'h' && Math.abs(y1 - y2) < WALL_LENGTH) return true
    if (
      wall2.angle === 'v' &&
      y1 - y2 > 0 &&
      y1 - y2 < WALL_LENGTH &&
      x2 - x1 > 0 &&
      x2 - x1 < WALL_LENGTH
    ) return true // crossed
  } else {
    if (wall2.angle === 'v' && Math.abs(x1 - x2) < WALL_LENGTH) return true
    if (
      wall2.angle === 'h' &&
      y2 - y1 > 0 &&
      y2 - y1 < WALL_LENGTH &&
      x1 - x2 > 0 &&
      x1 - x2 < WALL_LENGTH
    ) return true // crossed
  }
  return false
}

export function canPlaceWall(wall: Wall, game: Game): boolean {
  const { angle } = wall
  const y = wall.position[0]
  const x = wall.position[1]

  if (y < START_IDX || y > BOARD_SIZE || x < START_IDX || x > BOARD_SIZE) return false
  if (angle === 'h' && x > BOARD_SIZE - WALL_LENGTH) return false
  if (angle === 'v' && y > BOARD_SIZE - WALL_LENGTH) return false

  for (const otherWall of game.walls) {
    if (isWallIntersected(wall, otherWall)) return false
  }

  // TODO: determine closed area

  return true
}

export function placeWall(wall: Wall, game: Game): [Game['walls'], number, number] {
  const playingIndex = getPlayingIndex(game)
  return [[...game.walls, wall], game.players[playingIndex].remainingWalls - 1, playingIndex]
}

export function onTurnEnd(shouldDetermineWinning: boolean, game: Game): 'next' | { wonIndex: number } {
  if (!shouldDetermineWinning) return 'next'
  const playingIndex = getPlayingIndex(game)
  const { position } = game.players[playingIndex].pawn
  const gameType = game.players.length === 2 ? GameType.Two : GameType.Four
  let won = false
  const y = position[0]
  const x = position[1]
  if (playingIndex === 0) {
    // left -> right
    won = x === END_IDX
  } else if (gameType === GameType.Four && playingIndex === 1) {
    // top -> bottom
    won = y === END_IDX
  } else if ((gameType === GameType.Two && playingIndex === 1) || playingIndex === 2) {
    // right -> left
    won = x === START_IDX
  } else {
    // bottom -> top
    won = y === START_IDX
  }
  return won ? { wonIndex: playingIndex } : 'next'
}
