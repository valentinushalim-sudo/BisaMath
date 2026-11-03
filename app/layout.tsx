import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bisa Math - Petualangan Matematika',
  description: 'Platform gamifikasi matematika SD-SMP',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-slate-800 overflow-x-hidden relative`}>
        {/* Placeholder untuk komponen FloatingIcons animasi */}
        <div className="relative z-10 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <main className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl min-h-[90vh] overflow-hidden">
             {children}
          </main>
        </div>
      </body>
    </html>
  );
}
