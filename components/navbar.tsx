import Link from 'next/link';
import { Code } from "lucide-react";

export function Navbar() {
  return (
    <div className="fixed top-0 inset-x-0 h-24 flex items-center justify-center z-50">
      {/* Blurred background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-white/80 to-transparent" />
      
      {/* Navbar container */}
      <div className="relative w-full max-w-3xl mx-4">
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 blur-xl opacity-75" />
        
        {/* Glass navbar */}
        <nav className="relative h-14 px-4 bg-white/40 backdrop-blur-md border border-white/40 rounded-full 
          flex items-center justify-between shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]
          hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] transition-all">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg shadow-sm">
              <Code className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                DrawUML
              </h1>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <Link 
              href="/docs"
              className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-white/60"
            >
              Docs
            </Link>
            <Link 
              href="/create"
              className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-white/60"
            >
              Create
            </Link>
            <a 
              href="https://github.com/shreyashsng" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 
                transition-colors rounded-full hover:bg-white/60 hover:shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="opacity-75"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
} 