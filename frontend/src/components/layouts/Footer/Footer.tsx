import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="mx-auto max-w-screen-xl px-6 py-8 text-center md:flex md:items-center md:justify-between">
        {/* Kiri */}
        <p className="text-sm opacity-80">
          © {new Date().getFullYear()} Quizolah. Semua hak dilindungi.
        </p>
        <p className="text-sm opacity-80">
          <Link
            href="https://mibp.dev"
            className="hover:text-quiz-gold transition"
          >
            Pengembang: mibp.dev
          </Link>
        </p>

        {/* Kanan */}
        <div className="mt-4 flex justify-center gap-6 md:mt-0">
          <a href="#" className="hover:text-quiz-gold text-sm transition">
            Tentang
          </a>
          <a href="#" className="hover:text-quiz-gold text-sm transition">
            Kebijakan Privasi
          </a>
          <a href="#" className="hover:text-quiz-gold text-sm transition">
            Kontak
          </a>
        </div>
      </div>
    </footer>
  );
}
