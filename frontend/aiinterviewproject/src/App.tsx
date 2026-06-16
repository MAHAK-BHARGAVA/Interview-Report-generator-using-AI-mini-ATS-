import AppRouter from './approuter'
import { AuthProvider } from './features/auth/auth.context'
import { InterviewProvider } from './features/interview/interview.context'

function App() {
 

  return (
    <>
      <AuthProvider>
        <InterviewProvider>
      <AppRouter />
      </InterviewProvider>
    </AuthProvider>
    </>
  )
}

export default App
