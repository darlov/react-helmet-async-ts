import {FC, useState} from 'react'

import './App.css'
import {Body, Helmet, HelmetContextProvider, Html, Link, Meta, Title} from "../../../src";

const CounterRender:FC<{counter: number}> = ({counter}) => {
  
  
  return <>{counter} {counter % 3 == 0? "My text" : null}</>
}
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <HelmetContextProvider>
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

        <Helmet>
          <Title>My Title <CounterRender counter={count}/></Title>
        </Helmet>
        {<Helmet>
          {/*<Title>Hello World {count}</Title>*/}

          <Link rel="canonical" href="https://www.tacobell.com/"/>
          <Meta charSet="UTF-8"/>
          {count % 3 === 0 ? <Meta name="generator" property={"dsfsdf"}/> : null}
          <Html className={"class " + count} lang="en"/>
          <Body className={"class " + count} color={"#ff"}/>
        </Helmet>}
      </HelmetContextProvider>
    </>
  )
}

export default App
