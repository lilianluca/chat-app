import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks';

export const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirect to dashboard (if using React Router)
      // navigate('/dashboard');
    } catch (_err) {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='Password'
      />
      <button type='submit'>Log In</button>
    </form>
  );
};
