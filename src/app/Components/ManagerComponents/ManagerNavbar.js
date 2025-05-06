'use client';
import { useAuth } from '@/app/context/Authcontext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react'; // Import useState for managing mobile menu toggle

const navLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Add Member', path: '/addmember' },
  { name: 'Assign Task', path: '/assigntask' },
  { name: 'Assigned Task', path: '/assignedTask' },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const { currentUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage mobile menu toggle

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">{currentUser ? currentUser.name : "Manager"}</h1>

        <div className="block lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-8 h-8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        <ul
          className={`flex space-x-6 lg:flex ${
            isMenuOpen ? 'flex-col absolute bg-gray-900 top-16 left-0 w-full z-10 px-6 py-4' : 'hidden lg:flex'
          }`}
        >
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.path}
                className={`px-4 py-2 rounded-md transition duration-200 ${
                  pathname === link.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        
        </ul>
      </div>
    </nav>
  );
}
