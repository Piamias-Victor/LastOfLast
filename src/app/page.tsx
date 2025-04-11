import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* En-tête minimaliste */}
      <header className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100/80">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-medium text-pharmacy-primary tracking-tight">Pharmacy Planner</h1>
          <nav className="hidden md:flex space-x-8">
            <Link href="#" className="text-sm text-gray-500 hover:text-pharmacy-primary transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-pharmacy-primary transition-colors">
              Témoignages
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:text-pharmacy-primary transition-colors">
              Support
            </Link>
          </nav>
          <Link 
            href="/editor" 
            className="hidden md:flex text-sm px-5 py-2 rounded-full bg-pharmacy-primary text-white hover:bg-pharmacy-primary-dark transition-all shadow-sm"
          >
            Essayer
          </Link>
        </div>
      </header>

      {/* Section principale épurée */}
      <section className="pt-40 pb-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-medium text-gray-900 leading-tight mb-8 tracking-tight">
                Concevez votre espace <span className="text-pharmacy-primary">pharmaceutique</span> avec précision
              </h2>
              <p className="text-xl text-gray-500 mb-12 leading-relaxed">
                Une solution intuitive pour concevoir, organiser et optimiser l'aménagement de votre pharmacie.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/editor"
                  className="text-center px-8 py-4 bg-pharmacy-primary text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Commencer un nouveau plan
                </Link>
                <Link
                  href="#demo"
                  className="text-center px-8 py-4 bg-white border border-gray-200/70 text-gray-800 rounded-full text-sm font-medium hover:border-pharmacy-primary hover:text-pharmacy-primary transition-all"
                >
                  Explorer les fonctionnalités
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-50/50 rounded-2xl overflow-hidden shadow-lg">
                <div className="absolute inset-0 opacity-80 bg-gradient-to-br from-pharmacy-primary/5 to-pharmacy-primary/20"></div>
                <div className="p-8 relative z-10">
                  <div className="w-full h-full bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white p-6 transition-all hover:shadow-md">
                    <div className="w-full h-8 bg-pharmacy-primary/10 rounded-lg mb-6 flex items-center px-4">
                      <div className="w-3 h-3 rounded-full bg-pharmacy-primary/80 mr-3"></div>
                      <div className="w-24 h-2 bg-pharmacy-primary/20 rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-square bg-white rounded-lg border border-gray-100/80 shadow-sm flex items-center justify-center transition-all hover:shadow-md">
                          <div className={`w-2/3 h-2/3 ${i % 3 === 0 ? 'bg-pharmacy-primary/10' : 'bg-gray-50'} rounded-md`}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-pharmacy-primary rounded-full flex items-center justify-center text-white shadow-lg">
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section des fonctionnalités */}
      <section className="py-24 px-8 bg-gray-50/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-sm font-medium text-pharmacy-primary uppercase tracking-widest mb-3">Fonctionnalités</h3>
            <h2 className="text-3xl font-medium text-gray-900 tracking-tight">Tout ce dont vous avez besoin</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100/80 transition-all hover:shadow-md">
                <div className="w-12 h-12 rounded-full bg-pharmacy-primary/10 flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-pharmacy-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} />
                  </svg>
                </div>
                <h4 className="text-xl font-medium text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section de démonstration */}
      <section id="demo" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-sm font-medium text-pharmacy-primary uppercase tracking-widest mb-3">Comment ça marche</h3>
              <h2 className="text-3xl font-medium text-gray-900 mb-8 tracking-tight">Un processus simplifié en trois étapes</h2>
              
              <div className="space-y-10">
                {steps.map((step, index) => (
                  <div key={index} className="flex">
                    <div className="mr-6 flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-pharmacy-primary text-white flex items-center justify-center font-medium shadow-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-gray-900 mb-2">{step.title}</h4>
                      <p className="text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50/70 rounded-2xl overflow-hidden shadow-sm border border-gray-100/80">
              <video className="w-full h-auto" poster="/demo-poster.jpg">
                <source src="/demo.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              <div className="p-8">
                <h4 className="text-xl font-medium text-gray-900 mb-3">Visualisez votre espace avant de le créer</h4>
                <p className="text-gray-500 mb-6 leading-relaxed">Notre éditeur visuel vous permet de tester différentes configurations pour trouver l'agencement optimal.</p>
                <Link href="/editor" className="text-pharmacy-primary font-medium hover:text-pharmacy-primary-dark inline-flex items-center transition-colors">
                  Essayer maintenant
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-24 px-8 bg-pharmacy-primary bg-gradient-to-br from-pharmacy-primary to-pharmacy-primary-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-medium text-white mb-6 tracking-tight">Prêt à transformer votre espace pharmaceutique?</h2>
          <p className="text-lg text-white/90 mb-10 leading-relaxed">Rejoignez les centaines de pharmaciens qui optimisent déjà leur espace et améliorent l'expérience de leurs clients.</p>
          <Link
            href="/editor"
            className="inline-block px-8 py-4 bg-white text-pharmacy-primary rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all"
          >
            Commencer gratuitement
          </Link>
          <p className="mt-4 text-sm text-white/70">Aucune carte de crédit requise</p>
        </div>
      </section>

      {/* Pied de page */}
      <footer className="py-16 px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <h3 className="text-lg font-medium mb-6 tracking-tight">Pharmacy Planner</h3>
              <p className="text-sm text-gray-400 leading-relaxed">La référence en matière de conception d'espaces pharmaceutiques.</p>
            </div>
            
            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-6">Produit</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Fonctionnalités</Link></li>
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Témoignages</Link></li>
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-6">Ressources</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Guide d'utilisation</Link></li>
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Tutoriels vidéo</Link></li>
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Support</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-6">Légal</h4>
              <ul className="space-y-3">
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Conditions d'utilisation</Link></li>
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Politique de confidentialité</Link></li>
                <li><Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">CGV</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">© 2023 Pharmacy Planner. Tous droits réservés.</p>
            <div className="flex space-x-6 mt-6 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Données de fonctionnalités
const features = [
  {
    title: "Conception par glisser-déposer",
    description: "Créez facilement des plans détaillés avec notre interface intuitive qui ne nécessite aucune compétence technique.",
    icon: "M12 4v16m8-8H4"
  },
  {
    title: "Éléments pharmaceutiques spécialisés",
    description: "Accédez à une bibliothèque complète d'éléments spécifiques aux pharmacies : comptoirs, rayonnages, zones client et plus encore.",
    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
  },
  {
    title: "Analyse de circulation",
    description: "Optimisez le flux des clients grâce à nos outils d'analyse qui identifient les goulots d'étranglement et les zones sous-exploitées.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
  }
];

// Étapes d'utilisation
const steps = [
  {
    title: "Créez votre plan",
    description: "Utilisez notre éditeur intuitif pour concevoir votre espace pharmaceutique avec précision."
  },
  {
    title: "Personnalisez chaque zone",
    description: "Ajustez les dimensions, les couleurs et les propriétés de chaque élément selon vos besoins spécifiques."
  },
  {
    title: "Optimisez et partagez",
    description: "Analysez l'efficacité de votre aménagement, puis exportez ou partagez votre plan final."
  }
];