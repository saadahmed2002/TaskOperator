'use client';
import { useAuth } from '@/app/context/Authcontext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NotificationDropdown from '../NotificationDropDown';

const navLinks = [
  { name: 'Dashboard', path: '/' },
  { name: 'Add Member', path: '/addmember' },
  { name: 'Assign Task', path: '/assigntask' },
  { name: 'Assigned Task', path: '/assignedTask' },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const {currentUser, user} = useAuth()

  return (
    <nav className="bg-gray-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">{currentUser ? currentUser.name : "Manager"}</h1>
        <ul className="flex space-x-6">


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
          {/* <li>{user && <NotificationDropdown userId={user._id}/>}</li> */}
          
        </ul>
      </div>
    </nav>
  );
}
