import React from "react"
import { Route } from 'react-router-dom'
import style from './app.module.css'
import Mint from "./components/Mint/Mint"

function App() {
  return (
    <div className={style.app}>
      <Route path="/" component={Mint} />
      {/*<Route path="/" exact component={InitialPage} />
      <Route path="/videogames" exact component={Home} />
      <Route path="/videogames/create" exact component={Create} />
      <Route path="/videogames/detail/:id" exact component={Details} /> */}
    </div>
  )
}

export default App
