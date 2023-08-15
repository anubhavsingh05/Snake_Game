

import {useInterval} from './useInterval'
import {useState, useEffect, useRef} from 'react'
import { CANVAS_SIZE, SCALE,APPLE_START,
         SNAKE_START, SPEED, DIRECTIONS
      } from './game_Constraints'

function App() {

  const canvasRef:React.RefObject<HTMLCanvasElement> = useRef(null)
  const buttonRef = useRef(null)
  const [Snake, setSnake] = useState(SNAKE_START)
  const [Apple, setApple] = useState(APPLE_START)
  const [Speed, setSpeed] = useState(SPEED)
  const [Dir, setDir] = useState([0,-1])
  const [GameOver, setGameOver] = useState(false)
  

  const StartGame = () => {
       setSpeed(SPEED)
       setSnake(SNAKE_START)
       setApple(APPLE_START)
       setDir([0,-1])
       setGameOver(false)

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



  const isColliding = (head, body = Snake) => {
    const wallCollide = head[0]*SCALE >= CANVAS_SIZE[0] ||
                        head[0] <= 0 ||
                        head[1]*SCALE >= CANVAS_SIZE[1] ||
                        head[1] <= 0
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

    setApple(newApple)
    setSpeed(prev => prev + 100)
    return true
  }
  return false
}

  const GameLoop = () => {
      const snakeCopy = JSON.parse(JSON.stringify(Snake))
      const newSnakeHead = [snakeCopy[0][0]+Dir[0], snakeCopy[0][1]+Dir[1]]

      if (isColliding(newSnakeHead)) EndGame();

      snakeCopy.unshift(newSnakeHead)
      
      if(!appleCollision(snakeCopy)) snakeCopy.pop();
      
      setSnake(snakeCopy)
  }




  useInterval(GameLoop, Speed)

  
  
  useEffect(()=>{
    GameLoop()
  },[Dir])

  useEffect(()=>{
    const canvasContext = canvasRef.current?.getContext("2d")  
    canvasContext?.setTransform(SCALE,0,0,SCALE,0,0)
    canvasContext?.clearRect(0,0,CANVAS_SIZE[0],CANVAS_SIZE[1])

    canvasContext!.fillStyle = "pink"
    Snake.forEach(([x,y]) => canvasContext?.fillRect(x,y,1,1))

    canvasContext!.fillStyle = "white"
    canvasContext?.fillRect(Apple[0], Apple[1], 1,1)

  },[Apple, Snake, GameOver])
   
   
   
   

  return (

    <>
      <button  className={``} 
            role='button' 
            tabIndex={0} 
            onKeyDown={e => moveSnake(e)}
            autoFocus
            ref={buttonRef}>
            
            <canvas className={`border-2 border-white bg-gray-600`}
                    width={`${CANVAS_SIZE[0]}px`}
                    height={`${CANVAS_SIZE[1]}px`}
                    ref={canvasRef}/>

            {
              GameOver &&
              <div className='bg-white text-black'>
                Game Over
              </div>
            }
      </button>

      <button onClick={StartGame}>
        Start Game
      </button>
    </>
  )
}

export default App
