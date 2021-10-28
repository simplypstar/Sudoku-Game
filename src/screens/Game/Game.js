import React, { useState, useEffect } from "react";

import "./Game.css";
import {
  Grid,
  ChoiceBoard,
  Button,
  InformationModal,
} from "../../components/index.js";
import {
  animateElement,
  arrayDeepCopy,
  checkBoard,
  createSudokuGrid,
  solveSudoku,
} from "../../utility";

const Game = () => {
  const [grid, setGrid] = useState(null);
  const [startingGrid, setStartingGrid] = useState(null);
  const [clickValue, setClickValue] = useState(1);

  // Logic for modal
  const [showInformationModal, setShowInformationModal] = useState(false);

  useEffect(() => {
    // Creating a grid for the sudoku
    if (
      localStorage.getItem("startingGrid") == null ||
      localStorage.getItem("currentGrid") == null
    ) {
      let newSudokuGrid = createSudokuGrid();
      setStartingGrid(arrayDeepCopy(newSudokuGrid));
      setGrid(arrayDeepCopy(newSudokuGrid));

      localStorage.setItem("startingGrid", JSON.stringify(newSudokuGrid));
      localStorage.setItem("currentGrid", JSON.stringify(newSudokuGrid));
    } else {
      setStartingGrid(JSON.parse(localStorage.getItem("startingGrid")));
      setGrid(JSON.parse(localStorage.getItem("currentGrid")));
    }
  }, []);

  const setCurrentGrid = (givenGrid) => {
    // setting the value to the grid and also to the local storage
    setGrid(givenGrid);
    localStorage.setItem("currentGrid", JSON.stringify(givenGrid));
  };

  const handleReset = () => {
    setCurrentGrid(arrayDeepCopy(startingGrid));
  };

  const handleSolve = () => {
    let solvedBoard = JSON.parse(JSON.stringify(grid));
    let solvedStatus = solveSudoku(solvedBoard);
    if (solvedStatus === false) {
      alert("Cannot be solved!");
      return;
    }

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j].value === 0) {
          solvedBoard[i][j].isHinted = true;
          solvedBoard[i][j].isModifiable = false;
        }
      }
    }
    setCurrentGrid(solvedBoard);
  };

  const handleHint = () => {
    let solvedBoard = JSON.parse(JSON.stringify(grid));
    let solvedStatus = solveSudoku(solvedBoard);
    if (solvedStatus === false) {
      alert("Cannot be solved!");
      return;
    }

    // Finding all the empty nodes
    let emptyNodePositionList = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (grid[i][j].value === 0) {
          emptyNodePositionList.push([i, j]);
        }
      }
    }

    if (emptyNodePositionList.length === 0) {
      return;
    }

    // Making new node and replacing the empty value with the hint
    let newBoard = JSON.parse(JSON.stringify(grid));
    const hintNode =
      emptyNodePositionList[
        Math.floor(Math.random() * emptyNodePositionList.length)
      ];
    let hint_row = hintNode[0];
    let hint_column = hintNode[1];

    newBoard[hint_row][hint_column].value =
      solvedBoard[hint_row][hint_column].value;
    newBoard[hint_row][hint_column].isHinted = true;
    newBoard[hint_row][hint_column].isModifiable = false;

    setCurrentGrid(newBoard);
  };

  const handleNewGame = () => {
    let newSudokuGrid = createSudokuGrid();
    setStartingGrid(arrayDeepCopy(newSudokuGrid));
    setGrid(arrayDeepCopy(newSudokuGrid));

    localStorage.setItem("startingGrid", JSON.stringify(newSudokuGrid));
    localStorage.setItem("currentGrid", JSON.stringify(newSudokuGrid));
  };

  const handleCellClick = (row, column, isModifiable) => {
    if (!isModifiable) {
      animateElement(".grid-table", "headShake");
      return;
    }

    let newGrid = [...grid];

    newGrid[row][column].value = clickValue;

    checkBoard(newGrid);

    // setting the value to the grid and also to the local storage
    setCurrentGrid(newGrid);
  };

  return (
    <div className="Game">
      <h1
        onClick={() => setShowInformationModal((show) => !show)}
        className="main-title"
      >
        Sudoku Game
      </h1>
      {showInformationModal && (
        <InformationModal
          closeModal={() => setShowInformationModal((show) => !show)}
        />
      )}

      {/* TODO:Make a Game won modal */}

      <Grid handleCellClick={handleCellClick} grid={grid} />

      <ChoiceBoard setClickValue={setClickValue} selected={clickValue} />

      <div className="action-container">
        <Button
          onClick={handleReset}
          buttonStyle="btn--primary--solid"
          text="Clear"
        />
        <Button
          onClick={handleSolve}
          buttonStyle="btn--success--solid"
          text="Solve"
        />
        <Button
          onClick={handleHint}
          buttonStyle="btn--warning--solid"
          text="Hint"
        />
        <Button
          onClick={handleNewGame}
          buttonStyle="btn--danger--solid"
          text="New Game"
        />
      </div>
    </div>
  );
};

export default Game;