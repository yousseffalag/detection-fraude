import Footer from '../../components/Footer';
import {
  Brain, Shield, BarChart3, CheckCircle, ArrowRight, Play,
  TrendingUp, Users, Database, Award, Clock, Target,
  Mail, Phone, MapPin, Upload, Zap, Activity, Bell, ChevronUp
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';


const features = [
  {
    icon: Upload,
    title: "Upload de Transactions",
    description: "Importez vos fichiers CSV/Excel ou saisissez des transactions individuelles pour une analyse immédiate.",
    benefits: ["Upload par lot", "Saisie manuelle", "Formats multiples"]
  },
  {
    icon: Brain,
    title: "IA de Détection",
    description: "Algorithmes de machine learning avancés avec réseaux de neurones pour identifier les fraudes avec 99.2% de précision.",
    benefits: ["ML supervisé", "Deep learning", "Auto-apprentissage"]
  },
  {
    icon: BarChart3,
    title: "Dashboard Personnalisé",
    description: "Interface intuitive avec graphiques interactifs, métriques en temps réel et rapports détaillés.",
    benefits: ["Graphiques dynamiques", "Métriques temps réel", "Rapports PDF"]
  },
  {
    icon: Bell,
    title: "Alertes Intelligentes",
    description: "Notifications instantanées par email/SMS dès qu'une transaction suspecte est détectée.",
    benefits: ["Alertes temps réel", "Multi-canaux", "Seuils configurables"]
  },
  {
    icon: Shield,
    title: "Analyse de Risque",
    description: "Score de risque détaillé avec explications des facteurs de décision et recommandations d'actions.",
    benefits: ["Score 0-100", "Explications IA", "Actions suggérées"]
  },
  {
    icon: Activity,
    title: "Monitoring Continu",
    description: "Surveillance 24/7 avec apprentissage continu pour s'adapter aux nouveaux patterns de fraude.",
    benefits: ["Surveillance 24/7", "Adaptation continue", "Nouveaux patterns"]
  }
];

const stats = [
  { number: "99.2%", label: "Précision de détection", icon: Target },
  { number: "< 500ms", label: "Temps d'analyse", icon: Clock },
  { number: "50M+", label: "Transactions analysées", icon: Database },
  { number: "500+", label: "Fraudes détecté", icon: Shield }
];

const workflowSteps = [
  {
    number: "01",
    title: "Upload/Saisie",
    description: "Importez votre fichier de transactions ou saisissez une transaction unique",
    icon: Upload
  },
  {
    number: "02",
    title: "Analyse IA",
    description: "Notre algorithme ML analyse instantanément chaque transaction",
    icon: Brain
  },
  {
    number: "03",
    title: "Résultats",
    description: "Obtenez le verdict (fraude/légitime) avec score de confiance",
    icon: CheckCircle
  },
  {
    number: "04",
    title: "Dashboard",
    description: "Visualisez les résultats sur votre tableau de bord personnalisé",
    icon: BarChart3
  }
];


const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Contactez-nous par email",
    value: "fraudgard@gmail.com",
    action: "Envoyer un email",
    link: "mailto:fraudgard@gmail.com"
  },
  {
    icon: Phone,
    title: "Téléphone",
    description: "Appelez notre équipe",
    value: "+212 5 123 456 789",
    action: "Appeler maintenant",
    link: "tel:+2125123456789"
  },
  {
    icon: MapPin,
    title: "Bureau",
    description: "Rencontrez-nous en personne",
    value: "Agadir, Maroc",
    action: "Voir sur la carte",
    link: "https://maps.google.com"
  }
];

const aboutPoints = [
  {
    title: "Objectif du Projet",
    description: "Créer une solution IA accessible pour détecter la fraude dans le secteur financier."
  },
  {
    title: "Vision Technique",
    description: "Concevoir une plateforme open-source d'apprentissage et de recherche."
  },
  {
    title: "Philosophie",
    description: "Innovation, transparence, excellence technique et collaboration ouverte."
  }
];


const HomePage = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 text-sm md:text-[15px]">

      {/* Hero Section */}
      <section id="hero" className="py-12 px-6 md:px-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Détection instantanée par IA
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">FraudGuard</span><br />
              <span className="text-5xl text-gray-900">Détectez les fraudes avant qu'elles n'impactent vos finances</span>
            </h1>

            <p className="text-lg text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Solution complète de détection de fraudes utilisant le machine learning. Uploadez vos transactions ou saisissez-les manuellement pour une analyse instantanée avec tableau de bord personnalisé et alertes en temps réel.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Link to = "/signup">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold flex items-center hover:shadow-lg transition transform hover:-translate-y-1 cursor-pointer">
                  Commencer l'analyse
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </Link>
              <button className="bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold flex items-center hover:border-gray-400 hover:bg-gray-50 transition cursor-pointer">
                <Play className="mr-2 w-5 h-5" />
                Voir la démo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm text-center hover:shadow-md transition-all">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.number}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* Comment ça marche */}
      < section className="py-20 px-6 md:px-16 bg-white" id='comment-ca-marche' >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[34px] font-bold mb-4 text-gray-900">
              Comment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">ça marche</span>
            </h2>
            <p className="text-[17px] text-gray-600 max-w-3xl mx-auto my-5">
              Un processus simple en 4 étapes pour détecter les fraudes dans vos transactions
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workflowSteps.map((step, i) => (
              <div key={i} className="text-center relative">
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white border-2 border-blue-600 rounded-full w-8 h-8 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{step.number}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>

                {i < workflowSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full">
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section >
      {/* Fonctionnalités */}
      < section className="py-20 px-6 md:px-16 bg-gradient-to-br from-blue-50 via-white to-purple-50" id='fonctionnalites' >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[34px] font-bold mb-4 text-gray-900">
              Fonctionnalités <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Avancées</span>
            </h2>
            <p className="text-[17px] text-gray-600 max-w-3xl mx-auto my-5">
              Une suite complète d'outils pour détecter, analyser et prévenir les fraudes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, description, benefits }, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:border-gray-300 group">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>
                <ul className="space-y-3">
                  {benefits.map((benefit, j) => (
                    <li key={j} className="flex items-center text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* À propos */}
      < section className="py-20 px-6 md:px-16 bg-white" id='a-propos' >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-[34px] font-bold mb-6 text-gray-900">
                À propos du <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">projet</span>
              </h2>
              <p className="text-[17px] text-gray-600 mb-8 leading-relaxed">
                FraudGuard est un projet de recherche et développement utilisant l'intelligence artificielle pour prévenir les fraudes financières avec une efficacité et une précision inégalées dans l'industrie.
              </p>

              <div className="space-y-6">
                {aboutPoints.map((point, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-300">
                    <h4 className="font-bold text-gray-900 mb-2 text-lg">{point.title}</h4>
                    <p className="text-gray-600 leading-relaxed">{point.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-md transition-all duration-300">
                <Award className="w-10 h-10 text-green-600 mb-4" />
                <h4 className="font-bold text-gray-900 mb-3 text-lg">Recherche Académique</h4>
                <p className="text-gray-600 leading-relaxed">Basé sur les dernières recherches en détection d'anomalies, machine learning et intelligence artificielle appliquée à la finance.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-md transition-all duration-300">
                <Users className="w-10 h-10 text-blue-600 mb-4" />
                <h4 className="font-bold text-gray-900 mb-3 text-lg">Open Source</h4>
                <p className="text-gray-600 leading-relaxed">Projet ouvert à la communauté scientifique et technique pour encourager l'apprentissage, la collaboration et l'amélioration continue.</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-md transition-all duration-300">
                <TrendingUp className="w-10 h-10 text-purple-600 mb-4" />
                <h4 className="font-bold text-gray-900 mb-3 text-lg">Innovation Continue</h4>
                <p className="text-gray-600 leading-relaxed">Évolution constante avec l'intégration des dernières technologies IA, data science et méthodes de détection avancées.</p>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Contact */}
      < section className="py-20 px-6 md:px-16 bg-gradient-to-br from-blue-50 via-white to-purple-50" id='contact' >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[34px] font-bold mb-4 text-gray-900">
              Contactez-<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">nous</span>
            </h2>
            <p className="text-[17px] text-gray-600 max-w-3xl mx-auto my-5">
              Notre équipe est disponible pour répondre à vos questions et organiser une présentation détaillée du projet.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all duration-300 hover:border-gray-300 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                  <method.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-900">{method.title}</h3>
                <p className="text-gray-600 mb-4">{method.description}</p>
                <p className="font-semibold text-gray-900 mb-6 text-md">{method.value}</p>
                <a
                  href={method.link}
                  className="inline-flex items-center text-blue-600 hover:text-blue-500 transition-colors duration-300 text-sm"
                >
                  {method.action}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* Bouton Retour en haut */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 cursor-pointer"
          aria-label="Retour en haut"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
      )}

      {/* Footer */}
      < Footer />
    </div >
  );
};

export default HomePage;