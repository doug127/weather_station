import {Routes, Route} from 'react-router-dom'
import { Home } from './features/Home/pages/Home'
import { Auth } from './features/Auth/pages/Auth'

export const App = () => {
  return(
    <Routes>
      <Route path='/Home' element={<Home/>} />
      <Route path='/Auth' element={<Auth/>} />
    </Routes>
  )
}