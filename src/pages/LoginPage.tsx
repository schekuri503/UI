import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const signInWithGoogle = async () => {
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
    }
  }

  return (
    <div className='max-w-md mx-auto mt-10 bg-white p-6 rounded shadow space-y-4'>
      <h2 className='text-xl font-semibold'>Admin Login</h2>
      <p className='text-sm text-slate-600'>Use Google Sign-In via Supabase Auth (no manual registration form needed).</p>
      <button
        type='button'
        onClick={signInWithGoogle}
        disabled={loading}
        className='w-full rounded bg-blue-600 text-white py-2 font-medium disabled:opacity-60'
      >
        {loading ? 'Redirecting...' : 'Continue with Google'}
      </button>
      {error ? <p className='text-sm text-red-600'>{error}</p> : null}
      <p className='text-xs text-slate-500'>
        Setup note: In Supabase Auth, enable Google provider and add your site URLs to Redirect URLs.
      </p>
    </div>
  )
}
