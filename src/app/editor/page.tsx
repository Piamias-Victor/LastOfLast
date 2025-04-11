import Link from "next/link";
import { Editor } from "@/features/editor";
import { PropertiesPanel } from "@/features/properties";
import { LibraryPanel } from "@/features/library";

export default function EditorPage() {
  return (
    <main className="flex h-screen flex-col bg-gray-50">
      <header className="flex h-14 items-center border-b border-gray-100/80 px-6 lg:px-8 bg-white/90 backdrop-blur-sm shadow-sm z-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-lg text-pharmacy-primary tracking-tight"
        >
          <span>Pharmacy Planner</span>
        </Link>
        <nav className="ml-auto flex gap-8">
          <Link
            href="/"
            className="text-sm font-medium text-gray-500 hover:text-pharmacy-primary transition-colors"
          >
            Accueil
          </Link>
        </nav>
      </header>
      <div className="flex h-[calc(100vh-3.5rem)] w-full">
        {/* Sidebar gauche pour les outils et éléments */}
        <div className="w-72 border-r border-gray-100/80 bg-white overflow-auto">
          <LibraryPanel />
        </div>
        
        {/* Zone principale pour le canvas */}
        <div className="flex-1 overflow-hidden relative bg-gray-50/80">
          <Editor />
        </div>
        
        {/* Sidebar droite pour les propriétés */}
        <div className="w-72 border-l border-gray-100/80 bg-white overflow-auto">
          <PropertiesPanel />
        </div>
      </div>
    </main>
  );
}