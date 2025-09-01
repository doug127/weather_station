import {Routes, Route} from 'react-router-dom'
import { Home } from '@/features/Home/pages/Home'
import { Auth } from '@/features/Auth/pages/Auth'
import { Validation } from '@/features/Auth/pages/Validation'
import { ProtectedRoute } from '@/shared/hooks/ProtectedRoute'
import { useContext } from 'react'
import { AuthContext } from '@/shared/hooks/AuthContext'

export const App = () => {
  const { user } = useContext(AuthContext);

  return(
    <Routes>
      <Route path='/Home' element={
        <ProtectedRoute user={user}>
          <Home/>
        </ProtectedRoute>
      } />
      <Route path='/Auth' element={<Auth/>} />
      <Route path='/Verify-email' element={<Validation/>} />
    </Routes>
  )
}