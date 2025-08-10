import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Mail, CheckCircle, User, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setIsLoading(true);

        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required.');
            setIsLoading(false);
            return;
        }

        const registerData = {
            username: formData.firstName + ' ' + formData.lastName,
            email: formData.email,
            password: formData.password,
            confirm_password: formData.confirmPassword
        };

        axiosClient.post('/auth/register', registerData)
            .then(res => {
                console.log('Registration successful:', res.data);
                setSuccess(true);
                setIsLoading(false);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });
            })
            .catch(err => {
                if( err.response?.status === 422) {
                    setIsLoading(false);
                    console.log('Validation error:', err.response.data);
                    setError(err.response.data.detail[0].ctx.reason || 'Validation error occurred.');
                    return;
                }
                    
                setError(err.response?.data?.detail || 'An error occurred during registration.');
                console.error('Registration error:', err.response.data);
                setIsLoading(false);
            })
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-7xl grid lg:grid-cols-2 bg-white shadow-2xl rounded-2xl overflow-hidden">

                {/* Présentation (gauche) */}
                <div className='bg-white flex justify-center p-8 lg:p-20'>
                    <div className="max-w-md ms-8">

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
                <div className="p-8 lg:p-10 lg:px-16 flex flex-col justify-center">
                    <div className="max-w-lg mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-5">
                                Créer Votre Compte
                            </h2>
                            <p className="text-sm text-gray-500">
                                Rejoignez notre plateforme sécurisée et commencez à protéger vos transactions dès aujourd'hui.
                            </p>
                        </div>

                        {/* Conteneur du formulaire avec bordure élégante */}
                        <div className="border-1 border-gray-200 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:border-blue-300">
                            <div className="space-y-4">

                                {/* Nom et Prénom */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                placeholder="Prénom"
                                                className="w-full px-4 py-[10px] pl-12 border text-sm border-gray-300 rounded-lg focus:outline-none"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                placeholder="Nom"
                                                className="w-full px-4 py-[10px] pl-12 border text-sm border-gray-300 rounded-lg focus:outline-none"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="votre@email.com"
                                            className="w-full px-4 py-[10px] pl-12 border text-sm border-gray-300 rounded-lg focus:outline-none"
                                            disabled={isLoading}
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
                                            className="w-full px-4 py-[10px] pl-12 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                                            aria-label="Afficher / masquer mot de passe"
                                            disabled={isLoading}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirmer mot de passe */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            name="confirmPassword"
                                            id="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="••••••••"
                                            className="w-full px-4 py-[10px] pl-12 pr-12 text-sm border border-gray-300 rounded-lg focus:outline-none"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={toggleConfirmPasswordVisibility}
                                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                                            aria-label="Afficher / masquer mot de passe"
                                            disabled={isLoading}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Erreur */}
                                {error && (
                                    <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>
                                )}

                                {/* Succès */}
                                {success && (
                                    <div className="text-green-600 text-sm bg-green-50 border border-green-200 rounded-lg p-3">Your a compte is created succesfully</div>
                                )}

                                {/* Terms */}
                                <div className="flex items-start">
                                    <input 
                                        type="checkbox" 
                                        id="terms" 
                                        className="w-3.5 h-3 text-blue-600 bg-gray-100 border-gray-300 rounded mt-1 cursor-pointer" 
                                        disabled={isLoading}
                                    />
                                    <label htmlFor="terms" className="ml-2 text-[13px] text-gray-600">
                                        J'accepte les <a className="text-blue-600 hover:underline" href="#">Conditions Générales</a> et la <a className="text-blue-600 hover:underline" href="#">Politique de confidentialité</a>
                                    </label>
                                </div>

                                {/* Bouton */}
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center ${
                                        isLoading 
                                            ? 'opacity-70 cursor-not-allowed' 
                                            : 'hover:from-blue-700 hover:to-purple-700 hover:shadow-xl cursor-pointer'
                                    }`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            <span>Création en cours...</span>
                                        </>
                                    ) : (
                                        <span>Créer mon compte</span>
                                    )}
                                </button>

                                {/* Connexion */}
                                <p className="text-[13px] text-center text-gray-600">
                                    Vous avez déjà un compte ? <a href="#" className="text-blue-600 hover:underline">Se connecter</a>
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

export default RegisterPage;