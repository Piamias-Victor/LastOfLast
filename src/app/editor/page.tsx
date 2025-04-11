import Link from "next/link";
import { Editor } from "@/features/editor";
import { PropertiesPanel } from "@/features/properties";
import { LibraryPanel } from "@/features/library";

export default function EditorPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <header className="flex h-14 items-center justify-between border-b px-4 bg-white shadow-sm z-10">
        <Link
          href="/"
          className="flex items-center gap-2 font-medium text-lg text-pharmacy-primary"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <span className="tracking-tight">Pharmacy Planner</span>
        </Link>
        
        <div className="flex items-center gap-3">
          <button className="text-sm px-3 py-1.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50">
            Annuler
          </button>
          <button className="text-sm px-4 py-1.5 bg-pharmacy-primary text-white rounded-lg hover:bg-pharmacy-primary-dark shadow-sm">
            Enregistrer
          </button>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-3.5rem)] w-full">
        {/* Sidebar gauche pour les outils et éléments */}
        <div className="w-64 border-r shadow-sm overflow-hidden">
          <LibraryPanel />
        </div>
        
        {/* Zone principale pour le canvas */}
        <div className="flex-1 overflow-hidden relative">
          <Editor />
        </div>
        
        {/* Sidebar droite pour les propriétés */}
        <div className="w-64 border-l shadow-sm overflow-auto">
          <PropertiesPanel />
        </div>
      </div>
    </main>
  );
}