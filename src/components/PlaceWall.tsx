import { useEffect, useRef, useState } from 'react';
import { Coordinate, PlaceWallState } from '../model/Game';
import { SIZE } from '../Constants';
import { BOARD_SIZE, WALL_LENGTH } from '../domain/GameRule';

function useMousePosition() {
  const [
    mousePosition,
    setMousePosition,
  ] = useState<Coordinate>([0, 0]);

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition([ev.clientY, ev.clientX]);
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  return mousePosition;
}

function PlaceWall(props: {
  wallState: Exclude<PlaceWallState, undefined>
  onPlace: (at: Coordinate) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mousePosition = useMousePosition()
  const { wallState } = props

  const y = mousePosition[0] - (containerRef.current?.getBoundingClientRect().top ?? 0)
  const x = mousePosition[1] - (containerRef.current?.getBoundingClientRect().left ?? 0)

  const isInside = y >= 0 &&
    x >= 0 &&
    y <= SIZE * BOARD_SIZE - (wallState === 'v' ? SIZE * WALL_LENGTH : 0) &&
    x <= SIZE * BOARD_SIZE - (wallState === 'h' ? SIZE * WALL_LENGTH : 0)

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      onClick={() => {
        if (isInside) {
          props.onPlace([Math.round(y / SIZE), Math.round(x / SIZE)])
        }
      }}>
      {isInside ? (
        <div style={{
          position: 'absolute',
          top: y,
          left: x,
          width: wallState === 'h' ? SIZE * WALL_LENGTH : 3,
          height: wallState === 'v' ? SIZE * WALL_LENGTH : 3,
          backgroundColor: 'white',
        }}></div>
      ) : null}
    </div>
  )
}

export default PlaceWall
