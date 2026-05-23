import React, { useEffect, useRef, useState } from "react";

const GRID_SIZE = 20;
const CELL_SIZE = 20;

const INITIAL_SNAKE = [{ x: 8, y: 8 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

function getRandomFood() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE),
  };
}

export default function SnakeGame() {
  const canvasRef = useRef(null);

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState(getRandomFood());
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const handleKey = (e) => {
      switch (e.key) {
        case "ArrowUp":
          setDirection((d) => (d.y === 1 ? d : { x: 0, y: -1 }));
          break;
        case "ArrowDown":
          setDirection((d) => (d.y === -1 ? d : { x: 0, y: 1 }));
          break;
        case "ArrowLeft":
          setDirection((d) => (d.x === 1 ? d : { x: -1, y: 0 }));
          break;
        case "ArrowRight":
          setDirection((d) => (d.x === -1 ? d : { x: 1, y: 0 }));
          break;
        case " ":
          setRunning((r) => !r);
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = {
          x: prev[0].x + direction.x,
          y: prev[0].y + direction.y,
        };

        if (
          head.x < 0 ||
          head.y < 0 ||
          head.x >= GRID_SIZE ||
          head.y >= GRID_SIZE
        ) {
          setRunning(false);
          return prev;
        }

        const newSnake = [head, ...prev];

        if (head.x === food.x && head.y === food.y) {
          setFood(getRandomFood());
          setScore((s) => s + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [direction, food, running]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");

    ctx.clearRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? "lime" : "green";
      ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    });
  }, [snake, food]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Snake Game</h2>
      <p>Score: {score} | Space = Pause</p>

      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        style={{ border: "1px solid black", background: "black" }}
      />

      {!running && <p style={{ color: "red" }}>Game Over / Paused</p>}
    </div>
  );
}