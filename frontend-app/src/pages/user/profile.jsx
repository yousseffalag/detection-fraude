import React, { useState, useRef } from 'react';
import { User, Lock, Eye, EyeOff, Save, Check, Bell, Camera, Upload, X } from 'lucide-react';

export default function UserProfilePage() {
    const [activeTab, setActiveTab] = useState('account');
    const [saved, setSaved] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const fileInputRef = useRef(null);

    const [profileInfo, setProfileInfo] = useState({
        username: 'Ussef',
        email: 'ussef@gmail.com',
        firstName: 'Ussef',
        lastName: 'flg',
    });

    const [passwordSettings, setPasswordSettings] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
        newsletter: false
    });

    const tabs = [
        { id: 'account', name: 'Compte', icon: User, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
        { id: 'security', name: 'Sécurité', icon: Lock, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
        { id: 'notifications', name: 'Notifications', icon: Bell, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' }
    ];

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        console.log('Changement de mot de passe:', passwordSettings);
        setPasswordSettings({ currentPassword: '', newPassword: '', confirmPassword: '' });
        handleSave();
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatar(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const removeAvatar = () => {
        setAvatar(null);
    };

    const CustomToggle = ({ checked, onChange, label, description }) => (
        <div className="flex items-center justify-between py-2">
            <div>
                <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${checked ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
            >
                <span
                    className={`inline-block h-3 w-3 rounded-full bg-white transition-transform shadow-sm ${checked ? 'translate-x-5' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );


    const renderAccountTab = () => (
        <div className="space-y-4">

            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
            />

            {/* Photo de profil */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-center mb-4">
                    <div className="p-1.5 rounded-md bg-blue-100 mr-2">
                        <Camera className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Photo de profil</h3>
                </div>

                <div className="flex items-center">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold">
                            {avatar ? (
                                <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                `${profileInfo.firstName.charAt(0)}${profileInfo.lastName.charAt(0)}`
                            )}
                        </div>
                        <button
                            onClick={triggerFileInput}
                            className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm border cursor-pointer border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                            <Camera className="w-3 h-3 text-gray-600" />
                        </button>
                    </div>

                    <div className="ml-4">
                        <p className="text-xs text-gray-500 mb-1">JPG, GIF ou PNG. Taille max. 5MB.</p>
                        <button
                            onClick={triggerFileInput}
                            className="text-blue-600 hover:text-blue-800 font-medium text-xs cursor-pointer"
                        >
                            Changer la photo
                        </button>
                    </div>
                </div>
            </div>

            {/* Informations personnelles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-center mb-4">
                    <div className="p-1.5 rounded-md bg-blue-100 mr-2">
                        <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Informations personnelles</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                        <input
                            type="text"
                            value={profileInfo.username}
                            onChange={(e) => setProfileInfo({ ...profileInfo, username: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={profileInfo.email}
                            onChange={(e) => setProfileInfo({ ...profileInfo, email: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                        <input
                            type="text"
                            value={profileInfo.firstName}
                            onChange={(e) => setProfileInfo({ ...profileInfo, firstName: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                        <input
                            type="text"
                            value={profileInfo.lastName}
                            onChange={(e) => setProfileInfo({ ...profileInfo, lastName: e.target.value })}
                            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSecurityTab = () => (
        <div className="space-y-4">
            {/* Changement de mot de passe */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-center mb-4">
                    <div className="p-1.5 rounded-md bg-red-100 mr-2">
                        <Lock className="w-4 h-4 text-red-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Changer le mot de passe</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                value={passwordSettings.currentPassword}
                                onChange={(e) => setPasswordSettings({ ...passwordSettings, currentPassword: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                required
                                placeholder="Entrez votre mot de passe actuel"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordSettings.newPassword}
                                onChange={(e) => setPasswordSettings({ ...passwordSettings, newPassword: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                required
                                placeholder="Créez un nouveau mot de passe"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Utilisez au moins 8 caractères avec des lettres, chiffres et symboles.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le nouveau mot de passe</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={passwordSettings.confirmPassword}
                                onChange={(e) => setPasswordSettings({ ...passwordSettings, confirmPassword: e.target.value })}
                                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                                required
                                placeholder="Confirmez votre nouveau mot de passe"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="inline-flex items-center px-3 py-1.5 bg-red-700 text-white rounded-md font-semibold text-sm cursor-pointer hover:bg-red-800 transition-colors"
                        >
                            <Lock className="w-4 h-4 mr-1.5" /> Mettre à jour le mot de passe
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <div className="flex items-center mb-4">
                    <div className="p-1.5 rounded-md bg-orange-100 mr-2">
                        <Bell className="w-4 h-4 text-orange-600" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900">Préférences de notification</h3>
                </div>

                <div className="space-y-0.5 divide-y divide-gray-100">
                    <CustomToggle
                        checked={notificationSettings.emailNotifications}
                        onChange={() => setNotificationSettings({ ...notificationSettings, emailNotifications: !notificationSettings.emailNotifications })}
                        label="Notifications par email"
                        description="Recevoir les notifications importantes par email"
                    />
                    <CustomToggle
                        checked={notificationSettings.marketingEmails}
                        onChange={() => setNotificationSettings({ ...notificationSettings, marketingEmails: !notificationSettings.marketingEmails })}
                        label="Emails marketing"
                        description="Recevoir des offres promotionnelles et des nouvelles"
                    />
                    <CustomToggle
                        checked={notificationSettings.securityAlerts}
                        onChange={() => setNotificationSettings({ ...notificationSettings, securityAlerts: !notificationSettings.securityAlerts })}
                        label="Alertes de sécurité"
                        description="Recevoir des alertes en cas d'activité suspecte"
                    />
                    <CustomToggle
                        checked={notificationSettings.newsletter}
                        onChange={() => setNotificationSettings({ ...notificationSettings, newsletter: !notificationSettings.newsletter })}
                        label="Newsletter"
                        description="Recevoir notre newsletter mensuelle"
                    />
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'account':
                return renderAccountTab();
            case 'security':
                return renderSecurityTab();
            case 'notifications':
                return renderNotificationsTab();
            default:
                return renderAccountTab();
        }
    };

    return (
        <div className="min-h-screen p-4 md:py-4 md:px-8 text-md">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Mon Profil</h1>
                    <p className="text-gray-600 text-sm mt-1">Gérez vos informations personnelles et vos préférences</p>
                </div>

                <div className="bg-white rounded-md shadow-sm border border-gray-100">
                    <div className="flex flex-col lg:flex-row">
                        {/* Navigation des onglets */}
                        <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200">
                            <div className="p-4">
                                <div className="flex items-center mb-6">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg mr-3">
                                        {avatar ? (
                                            <img src={avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            `${profileInfo.firstName.charAt(0)}${profileInfo.lastName.charAt(0)}`
                                        )}
                                    </div>
                                    <div>
                                        <h2 className="font-semibold text-gray-900 text-sm">{profileInfo.username}</h2>
                                        <p className="text-xs text-gray-500">{profileInfo.email}</p>
                                    </div>
                                </div>

                                <h2 className="px-3 py-2 text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Paramètres</h2>
                                <nav className="space-y-2">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`w-full flex items-center px-2.5 py-1.5 text-sm text-left rounded-sm transition-all cursor-pointer  ${activeTab === tab.id
                                                        ? 'bg-blue-50 text-blue-700 font-semibold border-r-1 border-blue-600'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                            >
                                                <div className={`p-1.5 rounded-md mr-2 ${activeTab === tab.id ? tab.iconBg : 'bg-gray-100'}`}>
                                                    <Icon className={`w-4 h-4 ${activeTab === tab.id ? tab.iconColor : 'text-gray-500'}`} />
                                                </div>
                                                {tab.name}
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>

                        {/* Contenu du profil */}
                        <div className="flex-1 p-4 lg:p-5">
                            {renderContent()}

                            {/* Bouton de sauvegarde fixe */}
                            <div className="sticky bottom-0 mt-6 pt-4 bg-white border-t border-gray-200 -mx-4 lg:-mx-5 px-4 lg:px-5">
                                <div className="flex items-center justify-end">
                                    <button
                                        onClick={handleSave}
                                        disabled={saved}
                                        className={`inline-flex items-center px-4 py-2 rounded-md font-semibold transition-all cursor-pointer shadow-sm text-sm ${saved
                                                ? 'bg-green-50 text-green-700 border-2 border-green-200'
                                                : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md'
                                            }`}
                                    >
                                        {saved ? (
                                            <>
                                                <Check className="w-4 h-4 mr-1.5" />
                                                Sauvegardé !
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-1.5" />
                                                Sauvegarder
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}