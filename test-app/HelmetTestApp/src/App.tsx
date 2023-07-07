import { useState } from 'react'

import './App.css'
import {Helmet, HelmetContextProvider, Html, Link, Title} from "../../../src";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/*<div>*/}
      {/*  <a href="https://vitejs.dev" target="_blank">*/}
      {/*    <img src={viteLogo} className="logo" alt="Vite logo" />*/}
      {/*  </a>*/}
      {/*  <a href="https://react.dev" target="_blank">*/}
      {/*    <img src={reactLogo} className="logo react" alt="React logo" />*/}
      {/*  </a>*/}
      {/*</div>*/}
      {/*<h1>Vite + React</h1>*/}
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <HelmetContextProvider>
        <Helmet>
          <Title>My Title {count}</Title>
        </Helmet>
        { <Helmet>
          {/*<Title>Hello World {count}</Title>*/}
          <Link rel="canonical" href="https://www.tacobell.com/"/>
          <Html className={"class " + count} lang="en" />
        </Helmet>}
      </HelmetContextProvider>
    </>
  )
}

export default App
