'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/Authcontext';
import Loader from '../Components/Loader';

export default function LoginPage() {
  const [disable, setEnable] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const [error, setError] = useState('')
  const router = useRouter();

  const { user, loading, setUser } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading]);

  const handleLogin = async (e) => {
    setError('')
    setEnable(true);
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
       
        setUser(data.user || { email, role });
        router.push('/');
      } else {
        setError("Invalid Credentials!")
        console.log('Login failed');
      }
    } catch (err) {
      // console.log(err)
      setError("Something went wrong!")

    }
    setEnable(false);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            value={email}
            disabled={disable}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 disabled:cursor-not-allowed py-2 bg-gray-800 text-white border border-gray-700 rounded-md"
            required
          />
          <input
            type="password"
            value={password}
            disabled={disable}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full disabled:cursor-not-allowed px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={disable}
            className="w-full px-4 disabled:cursor-not-allowed py-2 bg-gray-800 text-white border border-gray-700 rounded-md"
          >
            <option value="member">Member</option>
            <option value="manager">Manager</option>
          </select>
          <button 
            type="submit"
            disabled={disable}
            className="w-full disabled:bg-purple-500 disabled:cursor-not-allowed bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition"
          >
            Login
          </button>
          {
              disable ? 
            <div className="w-full justify-center flex">
            <Loader size={'9'}/>
          </div> : null
          }
          
          <h1 className="text-red-500 text-xl w-full text-center">{error}</h1>
        </form>
      </div>
    </div>
  );
}
