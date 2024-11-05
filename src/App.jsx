import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import Bookings from './Bookings'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <div className="text-left mb-5 space-y-4 w-3/5 mx-auto">
          <h1 className="text-[30px] font-bold">Réserver le Dôme des Libellules
</h1>
        </div>
        <Bookings />

    </>
  )
}

export default App
