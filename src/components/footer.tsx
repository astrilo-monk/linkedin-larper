export function Footer() {
  return (
    <footer className="border-t border-neutral-800 px-6 py-6 mt-auto">
      <div className="mx-auto max-w-2xl flex items-center justify-between text-xs text-neutral-500">
        <p>No LinkedIn profiles were harmed. Probably.</p>
        <a
          href="https://github.com/astrilo-monk/linkedin-larper"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-neutral-300"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
