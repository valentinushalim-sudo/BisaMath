import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col min-h-full">
      <Navbar />
      <section className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-4">
        <h1 className="text-3xl font-black text-slate-800">{title}</h1>
        <p className="text-slate-500 font-medium">Fitur ini segera hadir.</p>
        <Link href="/" className="bg-blue-500 hover:bg-blue-400 text-white font-bold px-6 py-2 rounded-full transition-colors">
          Kembali ke Dashboard
        </Link>
      </section>
    </div>
  );
}
