
import biteApple from '../assets/BiteSound.wav'
import BackgroundImg from '../assets/BackgroundImg.jpg'

import { useInterval } from './useInterval'
import { useState, useEffect, useRef } from 'react'
import { CANVAS_SIZE, SCALE,APPLE_START, SNAKE_START, SPEED, DIRECTIONS } from './game_Constraints'

function App() {

  const canvasRef:React.RefObject<HTMLCanvasElement> = useRef(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [Snake, setSnake] = useState(SNAKE_START)
  const [Apple, setApple] = useState(APPLE_START)
  const [Speed, setSpeed] = useState(SPEED)
  const [Dir, setDir] = useState([0,-1])
  const [GameOver, setGameOver] = useState(false)

  const [GameStart, setGameStart] = useState(false)
  const [Score, setScore] = useState(0)
  const appleSound = new Audio(biteApple)
  

  const StartGame = () => {
       setSpeed(SPEED)
       setSnake(SNAKE_START)
       setApple(APPLE_START)
       setDir([0,-1])
       setGameOver(false)
       setGameStart(true)
       setScore(0)

       if (buttonRef.current) {
        buttonRef.current.focus();
      }
  }

  const EndGame = () => {
      setSpeed(0)
      setGameOver(true)
  }

  const moveSnake = ({keyCode}: React.KeyboardEvent) => {
    
    const isArrowKey = keyCode === 37 || keyCode === 38 ||
                       keyCode === 39 || keyCode === 40

    if (isArrowKey) {
      // Array can not be directly compared
      const conflicting = DIRECTIONS[keyCode][0] === -Dir[0] &&
                          DIRECTIONS[keyCode][1] === -Dir[1]
      
      if (!conflicting) {
        setDir(DIRECTIONS[keyCode])
      }
    }
  }



  const isColliding = (head:number[], body = Snake) => {
    const wallCollide = head[0]*SCALE >= CANVAS_SIZE[0] ||
                        head[0] <= -1 ||
                        head[1]*SCALE >= CANVAS_SIZE[1] ||
                        head[1] <= -1
    if (wallCollide) {
     return true
    }

    for(const segement of  body){
      if (segement[0] === head[0] && segement[1] === head[1]) {
        return true
      }
    }

    return false
}


const appleCollision = (newSnake:number[][]) => {
  if (newSnake[0][0] === Apple[0] && newSnake[0][1] === Apple[1]) {
    let newApple = Apple.map((_,i)=> Math.floor(Math.random()*CANVAS_SIZE[i]/SCALE))

    while(isColliding(newApple, newSnake)){
      newApple = Apple.map((_,i)=> Math.floor(Math.random()*CANVAS_SIZE[i]/SCALE))
    }
    
    setScore(p => p+1)
    setApple(newApple)
    setSpeed(prev => prev + 1)
    return true
  }
  return false
}

  const GameLoop = () => {
      const snakeCopy = JSON.parse(JSON.stringify(Snake))
      const newSnakeHead = [snakeCopy[0][0]+Dir[0], snakeCopy[0][1]+Dir[1]]

      if (isColliding(newSnakeHead)) EndGame();

      snakeCopy.unshift(newSnakeHead)
      
      if(!appleCollision(snakeCopy)) snakeCopy.pop()
      else appleSound.play()

      setSnake(snakeCopy)
  }

  useInterval(GameLoop,Math.floor(Speed ? 2000/Speed : 100000))
  
  useEffect(()=>{
    GameLoop()
  },[Dir])

  useEffect(()=>{
    const canvasContext = canvasRef.current?.getContext("2d")  
    canvasContext?.setTransform(SCALE,0,0,SCALE,0,0)
    canvasContext?.clearRect(0,0,CANVAS_SIZE[0],CANVAS_SIZE[1])
 
    canvasContext!.fillStyle = "white"
    Snake.forEach(([x,y]) => canvasContext?.fillRect(x,y,1,1))

    // canvasContext!.fillStyle = "red"
    // canvasContext?.fillRect(Apple[0], Apple[1], 1,1)

    canvasContext?.beginPath();
    canvasContext?.arc(Apple[0] + 0.5, Apple[1] + 0.5, 0.5, 0, Math.PI * 2);
    canvasContext!.fillStyle = "red";
    canvasContext?.fill();
    canvasContext?.closePath();


  },[Apple, Snake, GameOver])
   
   
   
   

  return (

    <div>
      <button  className={`bg-red-500 w-screen h-screen flex justify-center bg-cover py-10`} 
            role='button' 
            tabIndex={0} 
            style={{
            backgroundImage: `url(${BackgroundImg})`,
          }}
            onKeyDown={e => moveSnake(e)}
            autoFocus
            ref={buttonRef}>
            
            <canvas className={`border-2 border-black bg-black bg-opacity-60 rounded-3xl`}
                    width={`${CANVAS_SIZE[0]+10}px`}
                    height={`${CANVAS_SIZE[1]+10}px`}
                    ref={canvasRef}/>
      </button>

      {
        GameOver &&
        <div className='text-white w-screen h-screen absolute top-0 flex flex-col justify-center items-center bg-cover bg-blend-darken bg-black bg-opacity-60'
        style={{
          backgroundImage: `url(${BackgroundImg})`,
        }}>
          <div className={`flex flex-col bg-transparent px-6 relative scale-125`}>
              <p className='font-bold text-4xl'>
                Game Over
              </p>
              <button className='bg-white text-black px-12 mt-2 py-1 font-bold text-lg'
                      onClick={StartGame}>
                Start Again
              </button>
              <div className={`flex justify-between`}>
                <p className='text-3xl font-bold'>
                  Score:
                </p>
                <p className='text-3xl font-bold'>
                  {Score} 🍎
                </p>
              </div>
          </div>
        </div>
      }

      {
        !GameStart &&
          <div className='text-white w-screen h-screen absolute top-0 flex flex-col justify-center items-center bg-cover bg-blend-darken bg-black bg-opacity-60'
          style={{
            backgroundImage: `url(${BackgroundImg})`,
          }}>
            <div className={`flex flex-col items-center relative`}>
                <p className='text-5xl'>
                  APPLES AND
                </p>
                <p className='font-bold text-7xl'>
                  SNAKES
                </p>
                <button className='bg-white text-black px-20 mt-4 py-1 font-bold text-lg '
                        onClick={StartGame}>
                  Start The Game
                </button>

            </div>
        </div>
      }
    </div>
  )
}

export default App
