import { useState } from 'react'
import {sign} from './tools'
type Resolve<T = unknown> = T extends Promise<infer G> ? G : never
function App() {
  const [state, setState] = useState<undefined | Resolve<ReturnType<typeof sign>>>(undefined)
  const [address, setAddress] = useState('')
  async function createSign() {
    setState(await sign(address))
  }

  return (
    <div>
      <input placeholder='address' onChange={e => setAddress(e.currentTarget.value)} />
      <button onClick={createSign}>createSign</button>

      {state && <pre>
        {JSON.stringify(state, null, 4)}
      </pre>}
    </div>
  )
}

export default App
