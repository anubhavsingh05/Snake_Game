
import { useEffect, useRef } from 'react';


export function useInterval(callback:(...arg:any[]) => any, delay = 150) {
  const savedCallback = useRef<(...arg:any[])=>any>()

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
        if (savedCallback.current) {
            savedCallback.current()
        }
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      return () => clearInterval(id)
    }
  }, [delay])
}


  // 1) Remember the latest callback.
  // 2) Set up the interval.