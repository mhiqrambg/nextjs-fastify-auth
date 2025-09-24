import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-quiz-navy text-white">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-center gap-2 py-4 md:flex-row">
        <p className="text-sm">
          © {new Date().getFullYear()} Quizolah. All rights reserved.
        </p>
        <Link
          href="https://mibp.dev"
          className="hover:text-quiz-gold text-sm transition-colors"
        >
          by mibp.dev
        </Link>
      </div>
    </footer>
  );
}
