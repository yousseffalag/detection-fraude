import { useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link
import { Brain, Menu, X, ChevronDown, Shield, BarChart3, Eye } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { name: 'Home', href: '/Home' },
        { name: 'About', href: '/Home#a-propos' },
        { name: 'Contact', href: '/Home#contact' }
    ];

    const featuresItems = [
        {
            name: 'AI Detection',
            href: '/Home#fonctionnalites',
            description: 'Advanced AI algorithms to detect fraudulent patterns',
            icon: Brain,
            color: 'from-blue-500 to-cyan-500',
            color_hover: 'from-blue-600 to-cyan-600'
        },
        {
            name: 'Real-time Monitoring',
            href: '/Home#fonctionnalites',
            description: 'Monitor transactions and activities in real-time',
            icon: Eye,
            color: 'from-green-500 to-emerald-500',
            color_hover: 'from-green-600 to-emerald-600'
        },
        {
            name: 'Risk Assessment',
            href: '/Home#fonctionnalites',
            description: 'Comprehensive risk scoring and assessment tools',
            icon: Shield,
            color: 'from-purple-500 to-indigo-500',
            color_hover: 'from-purple-600 to-indigo-600'
        },
        {
            name: 'Analytics Dashboard',
            href: '/Home#fonctionnalites',
            description: 'Detailed analytics and reporting dashboard',
            icon: BarChart3,
            color: 'from-orange-500 to-red-500',
            color_hover: 'from-orange-600 to-red-600'
        }
    ];

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-[9999]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/Home" className="flex items-center">
                            <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-900">FraudGuard</span>
                        </Link>

                        {/* Navigation Desktop */}
                        <div className="hidden md:flex items-center space-x-10 ml-20">

                            <Link
                                to="/Home"
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium text-sm"
                            >
                                Home
                            </Link>


                            {/* Features avec menu personnalisé */}
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                                    <span className="text-sm">Features</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>

                                <div className="absolute top-full left-0 mt-2 w-[700px] bg-white rounded-lg shadow-lg border border-gray-200 py-4 px-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[9999]">
                                    <div className="grid grid-cols-2 gap-4">
                                        {featuresItems.map((item) => {
                                            const IconComponent = item.icon;
                                            return (
                                                <a
                                                    href={item.href}
                                                    className="group block p-4 rounded-lg hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-200"
                                                >
                                                    <div className="flex items-start space-x-4">
                                                        <div
                                                            className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-all duration-200`}
                                                        >
                                                            <IconComponent className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <span className="text-[15px] font-medium text-gray-900 group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-200">
                                                                    {item.name}
                                                                </span>
                                                                <span className="ms-2 inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                                                                    New
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                                                        </div>
                                                    </div>
                                                </a>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <a
                                href="/Home#a-propos"
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium text-sm"
                            >
                                About
                            </a>
                            <a
                                href="/Home#contact"
                                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium text-sm"
                            >
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Buttons Desktop */}
                    <div className="hidden md:flex items-center space-x-3">
                        <Link to="/login">
                            <button className="bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer">
                                Log in
                            </button>
                        </Link>
                        <Link to="/signup">
                            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 text-sm rounded-md transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer">
                                Sign up
                            </button>
                        </Link>
                    </div>

                    {/* Bouton Menu Mobile */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-gray-600 hover:text-blue-600 transition-colors duration-200 p-2"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Menu Mobile */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="py-4 space-y-2 bg-white border-t border-gray-100">
                        {/* Navigation Mobile */}
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.href}
                                className="block text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 px-4 py-3 rounded-lg mx-2 font-medium"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {/* Features Mobile avec submenu */}
                        <div>
                            <button
                                onClick={() => setIsFeaturesOpen(!isFeaturesOpen)}
                                className="flex items-center justify-between w-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 px-4 py-3 rounded-lg mx-2 font-medium"
                            >
                                <span>Features</span>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {/* Submenu Mobile */}
                            <div
                                className={`ml-4 mt-1 space-y-1 transition-all duration-200 ${isFeaturesOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                                    }`}
                            >
                                {featuresItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="group flex items-center space-x-3 text-sm text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 px-4 py-3 rounded-lg mx-2"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            <div
                                                className={`w-8 h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-md transition-all duration-200`}
                                            >
                                                <IconComponent className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="group-hover:font-medium transition-all duration-200 flex items-center space-x-2">
                                                <span>{item.name}</span>
                                                <span className="inline-block bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                                    New
                                                </span>
                                            </span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Séparateur */}
                        <hr className="my-4 border-gray-200" />

                        {/* Actions Mobile */}
                        <div className="px-4 py-2 space-y-3">
                            <Link to="/login">
                                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-200">
                                    Log in
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 px-4 text-sm font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                                    Sign up
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
