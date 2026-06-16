import { For, createMemo } from 'solid-js';

const MazeWalls = (props) => {
  const hWallsIds = createMemo(() =>
    [...props.walls()].filter(id => id.startsWith('h_'))
  );
  const vWallsIds = createMemo(() =>
    [...props.walls()].filter(id => id.startsWith('v_'))
  );

  return (
    <g>
      <For each={hWallsIds()}>
        {(id) => {
          const pos = createMemo(() => {
            const [_, r, c] = id.split('_');
            return {
              x1: +c,
              y1: +r,
              x2: +c + 1,
              y2: +r,
            };
          });
          return (
            <line
              x1={pos().x1}
              y1={pos().y1}
              x2={pos().x2}
              y2={pos().y2}
              stroke="#dc2626"
              stroke-width="0.06"
            />
          );
        }}
      </For>

      <For each={vWallsIds()}>
        {(id) => {
          const pos = createMemo(() => {
            const [_, r, c] = id.split('_');
            return {
              x1: +c,
              y1: +r,
              x2: +c,
              y2: +r + 1,
            };
          });
          return (
            <line
              x1={pos().x1}
              y1={pos().y1}
              x2={pos().x2}
              y2={pos().y2}
              stroke="#dc2626"
              stroke-width="0.06"
            />
          );
        }}
      </For>
    </g>
  );
};

export default MazeWalls;