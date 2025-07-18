'use client';

import React, { useState, useCallback } from 'react';
import Board from './Board';
import type { GameState } from '@/lib/types';
import { DIFFICULTY } from '@/lib/types';
import {
  createEmptyBoard,
  placeMines,
  revealCell,
  toggleFlag,
  checkWinCondition,
  revealAllMines
} from '@/lib/gameLogic';
import { Button, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';

type DifficultyLevel = keyof typeof DIFFICULTY;

const Minesweeper: React.FC = () => {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('BEGINNER');
  const [gameState, setGameState] = useState<GameState>(() => {
    const config = DIFFICULTY[difficulty];
    return {
      board: createEmptyBoard(config.rows, config.cols),
      gameStatus: 'playing',
      mineCount: config.mines,
      flagCount: 0,
      rows: config.rows,
      cols: config.cols
    };
  });
  const [firstClick, setFirstClick] = useState(true);

  const initializeGame = useCallback((level: DifficultyLevel) => {
    const config = DIFFICULTY[level];
    setGameState({
      board: createEmptyBoard(config.rows, config.cols),
      gameStatus: 'playing',
      mineCount: config.mines,
      flagCount: 0,
      rows: config.rows,
      cols: config.cols
    });
    setFirstClick(true);
    setDifficulty(level);
  }, []);

  const handleDifficultyChange = useCallback((event: SelectChangeEvent<DifficultyLevel>) => {
    initializeGame(event.target.value as DifficultyLevel);
  }, [initializeGame]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState.gameStatus !== 'playing') return;

    setGameState(prevState => {
      let newBoard = prevState.board;

      if (firstClick) {
        newBoard = placeMines(newBoard, prevState.mineCount, row, col);
        setFirstClick(false);
      }

      if (newBoard[row][col].isMine) {
        return {
          ...prevState,
          board: revealAllMines(newBoard),
          gameStatus: 'lost'
        };
      }

      newBoard = revealCell(newBoard, row, col);

      if (checkWinCondition(newBoard)) {
        return {
          ...prevState,
          board: newBoard,
          gameStatus: 'won'
        };
      }

      return {
        ...prevState,
        board: newBoard
      };
    });
  }, [gameState.gameStatus, firstClick]);

  const handleCellRightClick = useCallback((row: number, col: number) => {
    if (gameState.gameStatus !== 'playing') return;

    setGameState(prevState => {
      const newBoard = toggleFlag(prevState.board, row, col);
      const flagCount = newBoard.flat().filter(cell => cell.isFlagged).length;

      return {
        ...prevState,
        board: newBoard,
        flagCount
      };
    });
  }, [gameState.gameStatus]);

  const getStatusMessage = () => {
    switch (gameState.gameStatus) {
      case 'won':
        return '🎉 You Won!';
      case 'lost':
        return '💥 Game Over!';
      default:
        return '🎯 Good Luck!';
    }
  };

  const getStatusColor = () => {
    switch (gameState.gameStatus) {
      case 'won':
        return 'text-green-600';
      case 'lost':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">💣 Minesweeper</h1>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
          <FormControl sx={{ minWidth: 240 }}>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              value={difficulty}
              label="Difficulty"
              onChange={handleDifficultyChange}
            >
              <MenuItem value="BEGINNER">Beginner (9x9, 10 mines)</MenuItem>
              <MenuItem value="INTERMEDIATE">Intermediate (16x16, 40 mines)</MenuItem>
              <MenuItem value="EXPERT">Expert (16x30, 99 mines)</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="contained"
            onClick={() => initializeGame(difficulty)}
            sx={{ px: 3, py: 1.5, fontWeight: 'medium' }}
          >
            New Game
          </Button>
        </div>

        <div className="text-center mb-6">
          <div className={`text-2xl font-bold mb-2 ${getStatusColor()}`}>
            {getStatusMessage()}
          </div>
          <div className="flex justify-center gap-8 text-gray-700">
            <span className="flex items-center gap-1">
              <span className="font-medium">Mines:</span> {gameState.mineCount}
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium">Flags:</span> {gameState.flagCount}
            </span>
            <span className="flex items-center gap-1">
              <span className="font-medium">Remaining:</span> {gameState.mineCount - gameState.flagCount}
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <Board
            gameState={gameState}
            onCellClick={handleCellClick}
            onCellRightClick={handleCellRightClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Minesweeper;