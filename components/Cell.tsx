import React from 'react';
import type { Cell as CellType } from '@/lib/types';
import { Button } from '@mui/material';

interface CellProps {
  cell: CellType;
  onLeftClick: (row: number, col: number) => void;
  onRightClick: (row: number, col: number) => void;
  gameStatus: 'playing' | 'won' | 'lost';
}

const Cell: React.FC<CellProps> = ({ cell, onLeftClick, onRightClick, gameStatus }) => {
  const handleClick = () => {
    if (gameStatus === 'playing' && !cell.isRevealed && !cell.isFlagged) {
      onLeftClick(cell.row, cell.col);
    }
  };

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (gameStatus === 'playing') {
      onRightClick(cell.row, cell.col);
    }
  };

  const getCellContent = () => {
    if (cell.isFlagged) return '🚩';
    if (!cell.isRevealed) return '';
    if (cell.isMine) return '💣';
    if (cell.neighborMines > 0) return cell.neighborMines.toString();
    return '';
  };

  const getCellSx = () => {
    const baseSx = {
      width: 32,
      height: 32,
      minWidth: 32,
      padding: 0,
      fontSize: '0.875rem',
      fontWeight: 'bold',
      border: '1px solid #9ca3af',
      borderRadius: 0
    };
    
    if (cell.isRevealed) {
      if (cell.isMine) {
        return {
          ...baseSx,
          backgroundColor: '#ef4444',
          color: 'white',
          '&:hover': { backgroundColor: '#ef4444' }
        };
      } else {
        const numberColors = {
          1: '#2563eb',
          2: '#16a34a',
          3: '#dc2626',
          4: '#9333ea',
          5: '#ca8a04',
          6: '#db2777',
          7: '#000000',
          8: '#4b5563'
        };
        return {
          ...baseSx,
          backgroundColor: '#e5e7eb',
          color: numberColors[cell.neighborMines as keyof typeof numberColors] || '#000000',
          '&:hover': { backgroundColor: '#e5e7eb' }
        };
      }
    } else {
      if (cell.isFlagged) {
        return {
          ...baseSx,
          backgroundColor: '#fef3c7',
          '&:hover': { backgroundColor: '#fde68a' }
        };
      } else {
        return {
          ...baseSx,
          backgroundColor: '#d1d5db',
          '&:hover': { backgroundColor: '#9ca3af' },
          '&:active': { backgroundColor: '#6b7280' }
        };
      }
    }
  };

  return (
    <Button
      sx={getCellSx()}
      onClick={handleClick}
      onContextMenu={handleRightClick}
      disabled={gameStatus !== 'playing'}
    >
      {getCellContent()}
    </Button>
  );
};

export default Cell;