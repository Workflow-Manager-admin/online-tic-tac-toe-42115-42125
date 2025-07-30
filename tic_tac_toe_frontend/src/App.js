import React, { useState, useEffect } from 'react';
import './App.css';

/*
  PUBLIC_INTERFACE
  Main App - Renders and manages the 2-player Tic Tac Toe game,
  board, status, and reset. Minimalist, responsive, and using light theme.
*/

const BOARD_SIZE = 3;
const PLAYER_X = 'X';
const PLAYER_O = 'O';

const COLORS = {
  primary: '#1976d2',        // X moves, some lines, highlights
  accent: '#e53935',         // O moves, win highlight
  background: '#ffffff',     // Board/background
  border: '#e0e0e0',
  square: '#f9f9f9'
};

// Compute winning lines for 3x3 board
function getWinningLines() {
  const lines = [];
  // Rows
  for (let i = 0; i < BOARD_SIZE; ++i) {
    lines.push([i * BOARD_SIZE, i * BOARD_SIZE + 1, i * BOARD_SIZE + 2]);
  }
  // Columns
  for (let i = 0; i < BOARD_SIZE; ++i) {
    lines.push([i, i + BOARD_SIZE, i + 2 * BOARD_SIZE]);
  }
  // Diagonals
  lines.push([0, 4, 8]);
  lines.push([2, 4, 6]);
  return lines;
}
const WINNING_LINES = getWinningLines();

// PUBLIC_INTERFACE
function calculateWinner(squares) {
  // Returns {winner: "X"|"O", line: [idx, ...]} or null
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line };
    }
  }
  return null;
}

// PUBLIC_INTERFACE
function isBoardFull(squares) {
  return squares.every((sq) => sq !== null && sq !== undefined);
}

// PUBLIC_INTERFACE
function App() {
  const emptyBoard = Array(BOARD_SIZE * BOARD_SIZE).fill(null);
  const [squares, setSquares] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [gameKey, setGameKey] = useState(0); // For clean reset

  // Game logic
  const winnerResult = calculateWinner(squares);
  const draw = !winnerResult && isBoardFull(squares);
  const status = winnerResult
    ? `Winner: ${winnerResult.winner}`
    : draw
      ? 'Draw!'
      : `Current Turn: ${xIsNext ? PLAYER_X : PLAYER_O}`;

  // Highlight winning cells
  const winLine = winnerResult ? winnerResult.line : [];

  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    // Ignore if occupied or game over
    if (squares[idx] !== null || winnerResult) return;
    const newSquares = squares.slice();
    newSquares[idx] = xIsNext ? PLAYER_X : PLAYER_O;
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(emptyBoard);
    setXIsNext(true);
    setGameKey(k => k + 1);
  }

  // Centered container
  return (
    <div
      className="ttt-app-root"
      style={{
        minHeight: '100vh',
        background: COLORS.background,
        color: '#222',
        fontFamily: "'Inter', system-ui, Arial, sans-serif",
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <header style={{ margin: 0, padding: '2.5rem 0 1rem 0', textAlign: 'center', letterSpacing: '0.01em' }}>
        <h1 style={{
          fontWeight: 600,
          letterSpacing: '0.05em',
          fontSize: '2.2rem',
          color: COLORS.primary,
          margin: '0 0 0.2em 0'
        }}>
          Tic Tac Toe
        </h1>
        <div style={{
          fontSize: '1.05rem',
          letterSpacing: '0.02em',
          color: '#434343',
          fontWeight: 400,
          opacity: 0.8
        }}>
          Minimal 2-Player Game
        </div>
      </header>

      <main style={{
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}>
          {/* Game Status */}
          <div
            aria-live="polite"
            style={{
              marginBottom: '1.3rem',
              fontSize: '1.18rem',
              fontWeight: 500,
              color: winnerResult
                ? COLORS.accent
                : draw
                  ? '#888'
                  : COLORS.primary
            }}
            data-testid="game-status"
          >
            {status}
          </div>
          {/* Board */}
          <Board
            key={gameKey}
            squares={squares}
            onSquareClick={handleSquareClick}
            winLine={winLine}
          />
          {/* Restart/Reset */}
          <button
            onClick={handleRestart}
            className="ttt-reset-btn"
            style={{
              marginTop: '2.1rem',
              padding: '0.7em 2.2em',
              background: COLORS.primary,
              color: COLORS.background,
              fontWeight: 600,
              fontSize: '1.06rem',
              borderRadius: '0.5em',
              border: 'none',
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.07)',
              letterSpacing: '0.04em',
              cursor: 'pointer',
              transition: 'background 0.19s'
            }}
            aria-label="Restart Game"
          >
            Restart
          </button>
        </div>
      </main>
      <footer style={{ textAlign: 'center', fontSize: '0.97rem', color: '#aaa', opacity: 0.7, paddingBottom: 14, marginTop: 25 }}>
        <span>© {new Date().getFullYear()} Simple React Tic Tac Toe</span>
      </footer>
    </div>
  );
}

// PUBLIC_INTERFACE
// Square cell for the board
function Square({ value, onClick, highlight }) {
  const color =
    value === PLAYER_X
      ? COLORS.primary
      : value === PLAYER_O
        ? COLORS.accent
        : COLORS.background;

  return (
    <button
      type="button"
      aria-label={value ? `Cell ${value}` : "Empty Cell"}
      className="ttt-cell"
      style={{
        width: '100%',
        height: '100%',
        background: highlight ? '#fbe9e7' : COLORS.square,
        border: `2px solid ${highlight ? COLORS.accent : COLORS.border}`,
        borderRadius: '0.44em',
        fontSize: '2.35rem',
        fontWeight: 700,
        color: color,
        outline: highlight ? `2.5px solid ${COLORS.accent}` : 'none',
        boxShadow: highlight ? '0 3px 18px -4px #e539355a' : undefined,
        transition: 'background 0.17s, box-shadow 0.16s'
      }}
      onClick={onClick}
      tabIndex={0}
      data-testid="ttt-cell"
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
// Board component
function Board({ squares, onSquareClick, winLine }) {
  // Responsive square grid
  return (
    <div
      className="ttt-board"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
        gap: '0.9em',
        width: 'clamp(290px, 86vw, 370px)',
        aspectRatio: '1',
        background: COLORS.background,
        boxShadow: '0 4px 32px rgba(33, 150, 243, 0.065)',
        borderRadius: '1.1em',
        padding: '1.2em',
        margin: '0 auto'
      }}
      data-testid="ttt-board"
    >
      {squares.map((value, idx) => (
        <div
          key={idx}
          style={{
            minWidth: '0',
            minHeight: '0',
            display: 'flex'
          }}
        >
          <Square
            value={value}
            onClick={() => onSquareClick(idx)}
            highlight={winLine.includes(idx)}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
