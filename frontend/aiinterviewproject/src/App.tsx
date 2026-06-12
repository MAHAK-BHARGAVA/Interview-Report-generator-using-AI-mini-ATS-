import AppRouter from './approuter'
import { AuthProvider } from './features/auth/auth.context'
function App() {
 

  return (
    <>
      <AuthProvider>
      <AppRouter />
    </AuthProvider>
    </>
  )
}

export default App
