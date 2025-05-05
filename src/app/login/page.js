'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/Authcontext'; // update path if needed

export default function LoginPage() {
  const [disable, setEnable] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');
  const router = useRouter();

  const { user, loading, setUser } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading]);

  const handleLogin = async (e) => {
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
        console.log('Login failed');
      }
    } catch (err) {
      console.log(err)
      console.log('Server error');
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
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md"
          >
            <option value="member">Member</option>
            <option value="manager">Manager</option>
          </select>
          <button 
            type="submit"
            disabled={disable}
            className="w-full disabled:bg-purple-500 bg-purple-700 text-white py-2 rounded-md hover:bg-purple-800 transition"
          >
            Login
          </button>
          {
              loading ? 
            <div className="w-full justify-center flex">
            <Loader/>
          </div> : null
          }
        </form>
      </div>
    </div>
  );
}
