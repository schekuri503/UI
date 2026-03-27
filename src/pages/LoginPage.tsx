import { useAuth } from '../context/useAuth'

export const LoginPage = ({ onDone }: { onDone: () => void }) => {
  const { signIn, isLoading } = useAuth()

  return (
    <div className="center-wrap">
      <div className="card login-card">
        <h1>IPL Predictor</h1>
        <p>Private friends league with weighted scoring and skips.</p>
        <button
          disabled={isLoading}
          onClick={async () => {
            await signIn()
            onDone()
          }}
        >
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  )
}
