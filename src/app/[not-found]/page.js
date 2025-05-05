'use client';

import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">
      <AlertCircle className="w-20 h-20 text-red-600 mb-6" />
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6 text-gray-400">Page not found. The page you’re looking for doesn’t exist or has been moved.</p>
      <Link href="/">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
          Go to Home
        </button>
      </Link>
    </div>
  );
}
