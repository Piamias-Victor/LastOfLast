import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Utiliser la police Inter avec des sous-ensembles étendus
const inter = Inter({
  subsets: ["latin"],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Pharmacy Planner - Application de Merchandising Pharmaceutique",
  description: "Créez, modifiez et optimisez visuellement le plan de votre pharmacie avec une interface intuitive et professionnelle.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="h-full">
      <body className={`${inter.className} h-full text-gray-900 antialiased`}>{children}</body>
    </html>
  );
}