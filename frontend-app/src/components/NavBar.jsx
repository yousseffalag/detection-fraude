import { useState } from 'react';
import { Brain, Menu, X, ChevronDown, Shield, BarChart3, Eye } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { name: 'Accueil', href: '/Home' },
        { name: 'À propos', href: '/Home#a-propos' },
        { name: 'Contact', href: '/Home#contact' }
    ];

    const featuresItems = [
        {
            name: 'Détection IA',
            href: '/Home#fonctionnalites',
            description: 'Algorithmes IA avancés pour détecter les schémas frauduleux',
            icon: Brain
        },
        {
            name: 'Surveillance Temps Réel',
            href: '/Home#fonctionnalites',
            description: 'Surveillez les transactions et activités en temps réel',
            icon: Eye
        },
        {
            name: 'Évaluation des Risques',
            href: '/Home#fonctionnalites',
            description: 'Outils complets de scoring et d\'évaluation des risques',
            icon: Shield
        },
        {
            name: 'Tableau de Bord',
            href: '/Home#fonctionnalites',
            description: 'Analytics détaillées et tableau de bord complet',
            icon: BarChart3
        }
    ];

    return (
        <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-[9999]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div className="flex items-center">
                        <a href="/Home" className="flex items-center group cursor-pointer">
                            <div className="relative w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl flex items-center justify-center mr-3 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                <Brain className="w-5 h-5 text-white" />
                                <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                    FraudGuard
                                </span>
                                <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300"></div>
                            </div>
                        </a>

                        {/* Navigation Desktop */}
                        <div className="hidden md:flex items-center space-x-8 ml-16">
                            <a
                                href="/Home"
                                className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm group"
                            >
                                Accueil
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </a>

                            {/* Features avec menu simplifié */}
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium group">
                                    <span className="text-sm">Fonctionnalités</span>
                                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                                </button>

                                <div className="absolute top-full left-0 mt-3 w-[720px] bg-white rounded-xl shadow-xl border border-gray-200 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[9999]">
                                    <div className="px-4 pb-3 mb-3 border-b border-gray-100">
                                        <h3 className="text-base font-semibold text-gray-900">Nos Solutions</h3>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
                                        {featuresItems.map((item, index) => {
                                            const IconComponent = item.icon;
                                            return (
                                                <a
                                                    key={index}
                                                    href={item.href}
                                                    className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                                                >
                                                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                                        <IconComponent className="w-6 h-6 text-gray-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-gray-900 mb-1">
                                                            {item.name}
                                                        </div>
                                                        <p className="text-[13px] text-gray-500 leading-relaxed">{item.description}</p>
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <div className="px-4">
                                            <a href="/Home#fonctionnalites" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                                Voir toutes les fonctionnalités →
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <a
                                href="/Home#a-propos"
                                className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm group"
                            >
                                À propos
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </a>
                            <a
                                href="/Home#contact"
                                className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium text-sm group"
                            >
                                Contact
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        </div>
                    </div>

                    {/* Buttons Desktop */}
                    <div className="hidden md:flex items-center space-x-3">
                        <a href="/login">
                            <button className="relative overflow-hidden bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 px-4 text-sm font-medium rounded-md transition-all duration-300 hover:shadow-md group cursor-pointer">
                                <span className="relative z-10">Se connecter</span>
                            </button>
                        </a>
                        <a href="/signup">
                            <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white py-2.5 px-5 text-sm font-medium rounded-md transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group cursor-pointer">
                                <span className="relative z-10">S'inscrire</span>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                            </button>
                        </a>
                    </div>

                    {/* Bouton Menu Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="relative text-gray-700 hover:text-blue-600 transition-all duration-300 p-2.5 rounded-xl hover:bg-gray-100"
                            aria-label="Basculer le menu"
                        >
                            <div className="w-6 h-6 relative">
                                <Menu className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
                                <X className={`w-6 h-6 absolute transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Menu Mobile */}
                <div
                    className={`md:hidden transition-all duration-500 ease-out ${
                        isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                    }`}
                >
                    <div className="py-6 space-y-2 bg-white/95 backdrop-blur-sm border-t border-gray-100 rounded-b-2xl">
                        {/* Navigation Mobile */}
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="block text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 px-4 py-3 rounded-lg mx-2 font-medium cursor-pointer"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}

                        {/* Features Mobile simplifié */}
                        <div>
                            <button
                                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                                className="flex items-center justify-between w-full text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-all duration-300 px-4 py-3 rounded-lg mx-2 font-medium"
                            >
                                <span>Fonctionnalités</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-300 ${
                                        isFeaturesOpen ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>

                            {/* Submenu Mobile simplifié */}
                            <div
                                className={`ml-2 mt-1 space-y-1 transition-all duration-300 overflow-hidden ${
                                    isFeaturesOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                                }`}
                            >
                                {featuresItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center space-x-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 px-4 py-3 rounded-lg mx-2 cursor-pointer"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <IconComponent className="w-3.5 h-3.5 text-gray-600" />
                                            </div>
                                            <span>{item.name}</span>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Séparateur */}
                        <div className="my-4 mx-4">
                            <div className="h-px bg-gray-200"></div>
                        </div>

                        {/* Actions Mobile */}
                        <div className="px-4 py-2 space-y-3">
                            <a href="/login">
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 cursor-pointer">
                                    Se connecter
                                </button>
                            </a>
                            <a href="/signup">
                                <button className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-800 text-white py-3 px-4 text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer">
                                    S'inscrire gratuitement
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;