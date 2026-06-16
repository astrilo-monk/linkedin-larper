export function Header() {
  return (
    <header className="border-b border-neutral-800 px-6 py-4">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <a href="/" className="text-lg font-bold tracking-tight">
          LARPIn
        </a>
        <a
          href="https://github.com/astrilo-monk/linkedin-larper"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-300"
        >
          GitHub
        </a>
      </div>
    </header>
  );
}
