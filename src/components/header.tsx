import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-neutral-800 px-6 py-4">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <Link href="/" className="text-lg font-bold tracking-tight">
          LARPIn
        </Link>
        <a
          href="https://www.linkedin.com/in/astrilo/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
        >
          LinkedIn
        </a>
      </div>
    </header>
  );
}
