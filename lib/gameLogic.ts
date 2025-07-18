import type { Cell } from './types';

export function createEmptyBoard(rows: number, cols: number): Cell[][] {
  return Array(rows).fill(null).map((_, row) =>
    Array(cols).fill(null).map((_, col) => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
      row,
      col
    }))
  );
}

export function placeMines(board: Cell[][], mineCount: number, excludeRow: number, excludeCol: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const rows = newBoard.length;
  const cols = newBoard[0].length;
  let minesPlaced = 0;

  while (minesPlaced < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    if (!newBoard[row][col].isMine && !(row === excludeRow && col === excludeCol)) {
      newBoard[row][col].isMine = true;
      minesPlaced++;
    }
  }

  return calculateNeighborMines(newBoard);
}

export function calculateNeighborMines(board: Cell[][]): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const rows = newBoard.length;
  const cols = newBoard[0].length;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newBoard[row][col].isMine) {
        let count = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
              if (newBoard[newRow][newCol].isMine) {
                count++;
              }
            }
          }
        }
        newBoard[row][col].neighborMines = count;
      }
    }
  }

  return newBoard;
}

export function revealCell(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));
  const rows = newBoard.length;
  const cols = newBoard[0].length;

  function floodFill(r: number, c: number) {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return;
    if (newBoard[r][c].isRevealed || newBoard[r][c].isFlagged) return;

    newBoard[r][c].isRevealed = true;

    if (newBoard[r][c].neighborMines === 0 && !newBoard[r][c].isMine) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          floodFill(r + i, c + j);
        }
      }
    }
  }

  floodFill(row, col);
  return newBoard;
}

export function toggleFlag(board: Cell[][], row: number, col: number): Cell[][] {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })));

  if (!newBoard[row][col].isRevealed) {
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
  }

  return newBoard;
}

export function checkWinCondition(board: Cell[][]): boolean {
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      const cell = board[row][col];
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

export function revealAllMines(board: Cell[][]): Cell[][] {
  return board.map(row =>
    row.map(cell =>
      cell.isMine ? { ...cell, isRevealed: true } : cell
    )
  );
}