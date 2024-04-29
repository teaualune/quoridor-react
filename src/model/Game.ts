export type Coordinate = [number, number]

export enum GameStatus {
  Ready,
  Playing,
  End,
}

export enum GameType {
  Two,
  Four,
}

export type PawnColor = 'red' | 'yellow' | 'blue' | 'green'

export interface Pawn {
  color: PawnColor
  position: Coordinate
}

export type Direction = 'top' | 'left' | 'bottom' | 'right'

export interface Wall {
  position: Coordinate
  angle: 'v' | 'h'
}

export interface Player {
  name: string
  pawn: Pawn
  remainingWalls: number
}

export interface Game {
  status: GameStatus
  players: Player[]
  walls: Wall[]
  playingIndex?: number
  wonIndex?: number
}

export type PawnStepLength = 0 | 1 | 2
export type PawnSteps = Record<Direction, PawnStepLength>

export type PlaceWallState = 'v' | 'h' | undefined
