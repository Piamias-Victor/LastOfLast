import Link from "next/link";
import { Editor } from "@/features/editor";
import { PropertiesPanel } from "@/features/properties";
import { LibraryPanel } from "@/features/library";

export default function EditorPage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center border-b px-4 lg:px-6 bg-white shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg text-pharmacy-primary"
        >
          <span>Pharmacy Planner</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-sm font-medium hover:text-pharmacy-primary hover:underline underline-offset-4 transition-colors"
          >
            Accueil
          </Link>
        </nav>
      </header>
      <div className="flex h-[calc(100vh-3.5rem)] w-full">
        {/* Sidebar gauche pour les outils et éléments */}
        <div className="w-64 border-r bg-white shadow-sm overflow-auto">
          <LibraryPanel />
        </div>
        
        {/* Zone principale pour le canvas */}
        <div className="flex-1 overflow-hidden relative bg-gray-100">
          <Editor />
        </div>
        
        {/* Sidebar droite pour les propriétés */}
        <div className="w-64 border-l bg-white shadow-sm overflow-auto">
          <PropertiesPanel />
        </div>
      </div>
    </main>
  );
}