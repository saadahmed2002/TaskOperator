'use client';
import { useAuth } from '@/app/context/Authcontext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationDropdown from '../NotificationDropDown';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // optional, replace with emoji/icons if needed

const navLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'New Task', path: '/newtask' },
  { name: 'My Tasks', path: '/mytasks' },
  { name: 'Me', path: '/profile' },
];

export default function MemberNavbar() {
  const pathname = usePathname();
  const { currentUser, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <h1 className="text-xl font-bold text-blue-400">
          <Link href="/">{currentUser?.name || 'MEMBER'}</Link>
        </h1>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6 items-center">
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
          <li>{user && <NotificationDropdown userId={user._id} />}</li>
        </ul>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setMenuOpen(false)}
              className={`block px-4 py-2 rounded-md transition duration-200 ${
                pathname === link.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user && <div className="mt-2"><NotificationDropdown userId={user._id} /></div>}
        </div>
      )}
    </nav>
  );
}
