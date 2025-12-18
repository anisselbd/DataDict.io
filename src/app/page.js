'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Database, ArrowRight, Check, Zap, Share2, FileText, Code2, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="bg-primary p-1.5 rounded-lg text-primary-foreground shadow-lg shadow-primary/20">
              <Database className="h-5 w-5" />
            </div>
            <span>DataDict.io</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button className="gap-2 shadow-lg shadow-primary/20">
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="ghost">Se connecter</Button>
                </Link>
                <Link href="/auth">
                  <Button className="gap-2 shadow-lg shadow-primary/20">
                    Commencer gratuitement
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            Documentation de données simplifiée
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Créez des dictionnaires de données
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"> de A à Z</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Documentez vos schémas de base de données, partagez-les avec votre équipe,
            et exportez-les en Markdown ou PDF en quelques clics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all">
                Créer mon premier projet
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/p/demo">
              <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                Voir une démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white border-y">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Une solution complète pour documenter et partager vos structures de données.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Database className="h-6 w-6" />}
              title="Schémas visuels"
              description="Définissez vos entités, champs, types et contraintes dans une interface intuitive."
            />
            <FeatureCard
              icon={<Share2 className="h-6 w-6" />}
              title="Partage facile"
              description="Partagez vos dictionnaires avec un simple lien public. Pas besoin de compte pour consulter."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Export multi-format"
              description="Exportez en Markdown pour votre documentation ou en PDF pour vos présentations."
            />
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Support multi-types"
              description="VARCHAR, INT, BOOLEAN, JSON, UUID... Tous les types de données sont supportés."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Contraintes avancées"
              description="Définissez les clés primaires, index, unicité et valeurs par défaut."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Temps réel"
              description="Vos modifications sont sauvegardées instantanément. Collaborez sans friction."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Prêt à documenter vos données ?
          </h2>
          <p className="text-gray-600 mb-8">
            Commencez gratuitement et créez votre premier dictionnaire de données en quelques minutes.
          </p>
          <Link href="/auth">
            <Button size="lg" className="gap-2 text-lg px-8 py-6 shadow-2xl shadow-primary/30">
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg text-gray-600">
            <Database className="h-5 w-5" />
            DataDict.io
          </div>
          <p className="text-sm text-gray-500">
            © 2025 DataDict.io - Tous droits réservés. Anisselbd
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl border bg-gray-50/50 hover:bg-white hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
