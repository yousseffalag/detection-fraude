import {Brain} from 'lucide-react';

const Footer = () => {
    return (
        < div className="bg-gray-100 text-gray-800 px-6 md:px-16 pt-10 pb-8" >
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-12">
                    <div>
                        <div className="flex items-center mb-6">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                                <Brain className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">FraudGuard</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            Solution professionnelle de détection de fraude par intelligence artificielle pour le secteur financier.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-lg text-gray-900">Technologies</h4>
                        <ul className="space-y-3 text-gray-600">
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Python / TensorFlow</li>
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Machine Learning</li>
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Deep Learning</li>
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">API REST</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-lg text-gray-900">Ressources</h4>
                        <ul className="space-y-3 text-gray-600">
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Documentation</li>
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Code Source</li>
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Exemples</li>
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Tutoriels</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6 text-lg text-gray-900">Légal</h4>
                        <ul className="space-y-3 text-gray-600">
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Mentions légales</li>
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Confidentialité</li>
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Conditions d'utilisation</li>
                            <li className="hover:text-gray-800 transition-colors cursor-pointer">Licence MIT</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-300 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-600">
                    <p className="mb-4 md:mb-0">© {new Date().getFullYear()} FraudGuard AI. Tous droits réservés.</p>
                    <div className="flex space-x-6">
                        <a href="#" className="hover:text-gray-800 transition-colors">Accessibilité</a>
                        <a href="#" className="hover:text-gray-800 transition-colors">Cookies</a>
                        <a href="#" className="hover:text-gray-800 transition-colors">RGPD</a>
                    </div>
                </div>
            </div>
        </div >
    )
};

export default Footer;