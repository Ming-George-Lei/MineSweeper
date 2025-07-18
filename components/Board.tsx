import React from 'react';
import Cell from './Cell';
import type { GameState } from '@/lib/types';

interface BoardProps {
  gameState: GameState;
  onCellClick: (row: number, col: number) => void;
  onCellRightClick: (row: number, col: number) => void;
}

const Board: React.FC<BoardProps> = ({ gameState, onCellClick, onCellRightClick }) => {
  return (
    <div
      className="inline-grid gap-0 border-2 border-gray-500 bg-gray-600 p-2 rounded-lg shadow-lg"
      style={{
        gridTemplateColumns: `repeat(${gameState.cols}, 1fr)`,
        gridTemplateRows: `repeat(${gameState.rows}, 1fr)`
      }}
    >
      {gameState.board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onLeftClick={onCellClick}
            onRightClick={onCellRightClick}
            gameStatus={gameState.gameStatus}
          />
        ))
      )}
    </div>
  );
};

export default Board;