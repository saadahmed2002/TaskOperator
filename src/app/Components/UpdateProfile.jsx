import { useState } from 'react';

export default function UpdateProfileForm({ user }) {
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const API = process.env.NEXT_PUBLIC_API_URL;

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (password && password.length < 6) {
      setMessage('Password must be at least 6 characters long.');
      return; 
    }

    try {
      const res = await fetch(`/api/user/update`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: user.email, name, password }),
      });

      if (res.ok) {
        setMessage('Profile updated successfully!');
        setTimeout(() => {
          window.location.reload(); 
        }, 2000); 
      } else {
        setMessage('Failed to update profile.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleUpdate} className="mt-8 space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Name</label>
        <input
          type="text"
          className="w-full p-2 bg-gray-700 rounded text-white"
          value={name}
          required
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">New Password</label>
        <input
          type="password"
          className="w-full p-2 bg-gray-700 rounded text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white transition"
      >
        Update Profile
      </button>
      {message && <p className={`text-sm mt-2
      ${message == "Profile updated successfully!" ? 'text-green-400' : message == 'Failed to update profile.' ? "text-red-400":  "text-yellow-400"}
      `}>{message }</p>}
    </form>
  );
}
