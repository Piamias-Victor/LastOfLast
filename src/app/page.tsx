import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4">
          <h1 className="text-2xl font-bold text-pharmacy-primary">Pharmacy Planner</h1>
        </div>
      </div>

      <div className="mt-32 flex max-w-5xl flex-col items-center justify-center gap-8">
        <h2 className="text-4xl font-bold text-pharmacy-primary">
          Application de Merchandising Pharmaceutique
        </h2>
        <p className="text-xl text-center max-w-3xl">
          Créez, modifiez et optimisez visuellement le plan de votre pharmacie avec une interface
          intuitive et professionnelle.
        </p>
        <Link
          href="/editor"
          className="mt-6 rounded-lg bg-pharmacy-primary px-6 py-3 text-lg font-medium text-white hover:bg-pharmacy-accent transition-colors"
        >
          Commencer un Nouveau Plan
        </Link>
      </div>
    </main>
  );
}