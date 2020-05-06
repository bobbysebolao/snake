import React, { useState, useEffect, useRef } from 'react'
import Snake from './components/snake'
import Food from './components/food'
import getRandomCoordinates from './utils/getRandomCoordinates'
import initialState from './utils/initialState'
import onKeydown from './utils/keyDown'

function App(props) {
  const [speed, setSpeed] = useState(initialState.speed)
  const [food, setFood] = useState(initialState.food)
  const [direction, setDirection] = useState(initialState.direction)
  const [snakeDots, setSnakeDots] = useState(initialState.snakeDots)

  useEffect(() => {
    const keyDownCallback = (e) => setDirection(onKeydown(e)) //include in presentation
    window.addEventListener('keydown', keyDownCallback)
    return () => window.removeEventListener('keydown', keyDownCallback)
  }, [snakeDots])

  useEffect(() => {
    checkIfOutOfBorders()
    checkIfCollided()
    checkEat()
  })

  const moveSnake = () => {
    let dots = [...snakeDots]
    let head = dots[dots.length - 1]

    switch (direction) {
      case 'right':
        head = [head[0] + 2, head[1]]
        break
      case 'left':
        head = [head[0] - 2, head[1]]
        break
      case 'up':
        head = [head[0], head[1] - 2]
        break
      case 'down':
        head = [head[0], head[1] + 2]
        break
      default:
        head = [head[0] + 2, head[1]]
    }
    dots.push(head)
    dots.shift()
    setSnakeDots(dots)
  }

  const checkIfOutOfBorders = () => {
    let head = snakeDots[snakeDots.length - 1]
    if (head[0] >= 100 || head[0] < 0 || head[1] >= 100 || head[1] < 0) {
      onGameOver()
    }
  }

  const checkIfCollided = () => {
    let snake = [...snakeDots]
    let head = snake[snake.length - 1]
    snake.pop()
    snake.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        onGameOver()
      }
    })
  }

  const checkEat = () => {
    let head = snakeDots[snakeDots.length - 1]
    let foodPosition = food

    if (head[0] === foodPosition[0] && head[1] === food[1]) {
      setFood(getRandomCoordinates())
      enlargeSnake()
      increaseSpeed()
    }
  }

  const enlargeSnake = () => {
    let newSnake = [...snakeDots]
    newSnake.unshift([])
    setSnakeDots(newSnake)
  }

  const increaseSpeed = () => {
    if (speed > 10) {
      setSpeed(speed - 10)
    }
  }

  const onGameOver = () => {
    alert(`Game Over. Snake length ${snakeDots.length}`)
    setSpeed(initialState.speed)
    setFood(initialState.food)
    setDirection(initialState.direction)
    setSnakeDots(initialState.snakeDots)
  }

  useInterval(moveSnake, speed)

  function useInterval(callback, snakeSpeed) {
    const savedCallback = useRef
    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback
    }, [callback, savedCallback])
    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current()
      }
      if (snakeSpeed !== null) {
        let id = setInterval(tick, snakeSpeed)
        console.log(id)
        return () => clearInterval(id)
      }
    }, [snakeSpeed, savedCallback])
  }

  return (
    <div className="game-area">
      <Snake snakeDots={snakeDots} />
      <Food dot={food} />
    </div>
  )
}

export default App
