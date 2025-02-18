export function Footer() {
  return (
    <footer className="w-full py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-sm text-gray-500">
            © 2025 DrawUML. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</a>
            <span>•</span>
            <a href="/terms" className="hover:text-gray-600 transition-colors">Terms</a>
            <span>•</span>
            <a href="https://x.com/shreyashsng" className="hover:text-gray-600 transition-colors">Shreyash</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 