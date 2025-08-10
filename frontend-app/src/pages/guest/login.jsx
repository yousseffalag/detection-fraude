import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Mail, CheckCircle } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/authContext';


const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');


    const { login } = useAuth();


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!formData.email || !formData.password) {
            setError('All fields are required.');
            return;
        }
        // Simulation de connexion
        console.log('Login data:', formData);

        axiosClient.post('/auth/login', formData)
            .then(res => {   
              console.log('Login successful:', res.data);
              const token = res.data.access_token;
              if(token){
                login(token);
                console.log('User logged in successfully');
              }
            })
            .catch(err => {
                 
                 if (err.status === 403){
                    console.log("Email is not verified");
                    setError('Email is not verified');
                    return;
                }

                console.error('Login error:', err);
                setError(err.response?.data?.detail || 'An error occurred during login. Please try again.');
            });


    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-7xl grid lg:grid-cols-2 bg-white overflow-hidden">

                {/* Présentation (gauche) */}
                <div className='bg-white flex justify-center p-8 lg:p-20'>
                    <div className="max-w-md ms-8">
                        {/* Logo */}
                        {/* <div className="flex items-center mb-8">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                                <Brain className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gray-900">FraudGuard</span>
                        </div> */}

                        {/* Titre */}
                        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-snug">
                            Plateforme de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">détection de fraude</span> basée sur l'IA
                        </h1>

                        {/* Description */}
                        <p className="text-md text-gray-600 mb-8 leading-relaxed">
                            Analysez vos transactions en temps réel ou via importation de fichiers. Notre solution intelligente vous offre des résultats fiables, rapides et clairs.
                        </p>

                        {/* Points clés */}
                        <div className="space-y-5 ps-6 text-gray-700">
                            <div className="flex items-center"><CheckCircle className="text-green-500 w-5 h-5 mr-3" /> Détection à 99.2%</div>
                            <div className="flex items-center"><CheckCircle className="text-green-500 w-5 h-5 mr-3" /> Support jusqu'à 1M lignes (CSV)</div>
                            <div className="flex items-center"><CheckCircle className="text-green-500 w-5 h-5 mr-3" /> Résultats en moins d'une seconde</div>
                            <div className="flex items-center"><CheckCircle className="text-green-500 w-5 h-5 mr-3" /> Rapports complets et visualisations</div>
                        </div>
                    </div>
                </div>

                {/* Formulaire (droite) */}
                <div className="p-8 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-5">
                                Connexion à Votre Espace
                            </h2>
                            <p className="text-sm text-gray-500">
                                Veuillez vous connecter pour accéder à votre tableau de bord sécurisé et lancer vos analyses de fraude en toute sérénité.
                            </p>
                        </div>

                        {/* Conteneur du formulaire avec bordure élégante */}
                        <div className="border-1 border-gray-200 rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                            <div className="space-y-5">

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <div className="relative mb-6">
                                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="votre@email.com"
                                            className="w-full px-4 py-[10px] pl-12 border text-sm border-gray-300 rounded-lg focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Mot de passe */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            id="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-[10px] pl-12 pr-12  text-sm  border border-gray-300 rounded-lg focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                                            aria-label="Afficher / masquer mot de passe"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <div className="text-right mt-2">
                                        <a href="#" className="text-[13px] text-blue-600 hover:underline">Mot de passe oublié ?</a>
                                    </div>
                                </div>

                                {/* Erreur */}
                                {error && (
                                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
                                )}

                                {/* Terms */}
                                <div className="flex items-start">
                                    <input type="checkbox" id="terms" className="w-3.5 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded mt-1 cursor-pointer" />
                                    <label htmlFor="terms" className="ml-2 text-[13px] text-gray-600">
                                        J'accepte les <a className="text-blue-600 hover:underline" href="#">Conditions Générales</a>
                                    </label>
                                </div>

                                {/* Bouton */}
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                                >
                                    <span>Se connecter</span>
                                </button>

                                {/* Inscription */}
                                <p className="text-[13px] text-center text-gray-600">
                                    Vous n'avez pas de compte ? <a href="#" className="text-blue-600 hover:underline">S'inscrire</a>
                                </p>

                            </div>
                        </div>

                        {/* Footer */}
                        <p className="text-xs text-gray-500 text-center mt-6">
                            Plateforme sécurisée conforme aux standards bancaires. <a href="#" className="text-blue-600 hover:underline">Politique de sécurité</a> et <a href="#" className="text-blue-600 hover:underline">Confidentialité</a>.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;