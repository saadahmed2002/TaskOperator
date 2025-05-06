'use client'
import Loader from '@/app/Components/Loader';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddMemberPage() {
  const [load, setLoading] = useState(false)
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    id: '',
    role: 'member',
    designation: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, email, password, id, designation } = form;
  
    if (!name || !email || !password || !id || !designation) {
      setMessage('All fields are required.');
      return false;
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage('Invalid email format.');
      return false;
    }
  
    if (password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return false;
    }
  
    return true;
  };
  
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    setMessage('');
  
    if (!validateForm()) return;
  console.log(process.env.NEXT_PUBLIC_API_URL)
    try {
      const res = await fetch(`/api/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setMessage('Member added successfully!');
        setForm({ name: '', email: '', password: '', id: '', designation: '' });
        router.replace('/');
      } else {
        setMessage(data.error || 'Something went wrong, Try again!.');
      }
    } catch (error) {
      console.log(error);
      setMessage('Server error.');
    }
    setLoading(false)
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 text-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 text-white p-8 rounded-2xl shadow-lg ring-1 ring-gray-700">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Add New Member</h2>
        {message && (
          <div className={`mb-4 text-center text-md text-white ${message == "Member added successfully!" ? 
            'bg-green-800' : 'bg-red-500'
          } p-2 rounded-lg`}>
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="id"
            placeholder="Employee ID"
            value={form.id}
            onChange={handleChange}
            required
          />
          <input
            className="w-full p-3 bg-gray-700 text-white border border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            name="designation"
            placeholder="Designation"
            value={form.designation}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white p-3 rounded-lg font-semibold"
          >
            Add Member
          </button>
        <div className="w-full justify-center">{load && <Loader />}</div>
        </form>
      </div>
    </div>
  );
}
