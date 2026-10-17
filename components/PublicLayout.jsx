import Navbar from './Navbar';

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-28 md:pt-16">{children}</main>
      <footer className="border-t border-ink/10 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-ink/60 sm:flex-row">
          <p>© {new Date().getFullYear()} BlogSpace. Stories on testing, automation and software.</p>
        </div>
      </footer>
    </div>
  );
}
