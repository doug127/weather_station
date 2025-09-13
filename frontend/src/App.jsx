import {Routes, Route} from 'react-router-dom'
import { Home } from '@/features/Home/pages/Home'
import { Auth } from '@/features/Auth/pages/Auth'
import { Validation } from '@/features/Auth/pages/Validation'
import { ForgotPassword } from '@/features/Auth/pages/ForgotPassword'
import { ResetCode } from '@/features/Auth/pages/ResetCode'
import { ProtectedRoute } from '@/shared/hooks/ProtectedRoute'
import { useContext } from 'react'
import { AuthContext } from '@/shared/hooks/AuthContext'
import { Sidebar } from '@/features/Home/layouts/Sidebar'
import { SkeletonPage } from '@/shared/components/skeletons/SkeletonPage'

export const App = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <SkeletonPage/>;
  }

  return(
    <Routes>
      <Route 
        path='/home' 
        element={
          <ProtectedRoute user={user}>
            <Sidebar/>
          </ProtectedRoute>
        }>
          <Route index element={<Home />} /> 
          <Route path='/home' element={<Home />} /> 
      </Route>
      <Route path='/Auth' element={<Auth/>} />
      <Route path='/Verify-email' element={<Validation/>} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-code" element={<ResetCode />} />      
    </Routes>
  )
}