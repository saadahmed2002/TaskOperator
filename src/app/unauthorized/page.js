'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center px-6 text-center">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-4xl font-bold mb-2">Access Denied</h1>
      <p className="mb-6 text-gray-300">
        You don't have permission to view this page. Please contact your manager if you believe this is a mistake.
      </p>
      <Link href="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
          Go Back Home
        </button>
      </Link>
    </div>
  );
}
