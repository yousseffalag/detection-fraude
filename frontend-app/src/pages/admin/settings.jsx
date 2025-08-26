import React, { useState } from 'react';
import { Shield, Mail, Bell, Save, Check, User } from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('security');
  const [saved, setSaved] = useState(false);
  
  // États pour les différents paramètres
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordMinLength: 8,
    maxLoginAttempts: 5
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    systemAlerts: true,
    userRegistrationNotify: true
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'admin@example.com',
    smtpPassword: '',
    fromEmail: 'noreply@example.com'
  });

  const tabs = [
    { id: 'security', name: 'Sécurité', icon: Shield, iconBg: 'bg-red-100', iconColor: 'text-red-600' },
    { id: 'email', name: 'Email', icon: Mail, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { id: 'notifications', name: 'Notifications', icon: Bell, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' }
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // Composant pour les toggles personnalisés
  const CustomToggle = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <h4 className="text-sm font-medium text-gray-900">{label}</h4>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-3 w-3 rounded-full bg-white transition-transform shadow-sm ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      {/* Section Paramètres de sécurité */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-red-100 mr-2">
            <Shield className="w-4 h-4 text-red-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Paramètres de sécurité</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durée de session (minutes)
            </label>
            <input
              type="number"
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Longueur min. mot de passe
            </label>
            <input
              type="number"
              value={securitySettings.passwordMinLength}
              onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tentatives max
            </label>
            <input
              type="number"
              value={securitySettings.maxLoginAttempts}
              onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Section Authentification */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-yellow-100 mr-2">
            <User className="w-4 h-4 text-yellow-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Authentification</h3>
        </div>
        
        <div className="space-y-0.5 divide-y divide-gray-100">
          <CustomToggle
            checked={securitySettings.twoFactorAuth}
            onChange={() => setSecuritySettings({...securitySettings, twoFactorAuth: !securitySettings.twoFactorAuth})}
            label="Authentification à deux facteurs"
            description="Obliger l'A2F pour tous les administrateurs"
          />
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-4">
      {/* Section Configuration SMTP */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex items-center mb-4">
          <div className="p-1.5 rounded-md bg-green-100 mr-2">
            <Mail className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="text-base font-semibold text-gray-900">Configuration SMTP</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Serveur SMTP
            </label>
            <input
              type="text"
              value={emailSettings.smtpHost}
              onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Port SMTP
            </label>
            <input
              type="text"
              value={emailSettings.smtpPort}
              onChange={(e) => setEmailSettings({...emailSettings, smtpPort: e.target.value})}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="email"
              value={emailSettings.smtpUsername}
              onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={emailSettings.smtpPassword}
              onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email expéditeur
            </label>
            <input
              type="email"
              value={emailSettings.fromEmail}
              onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button className="inline-flex items-center px-3 py-1.5 text-sm bg-green-50 hover:bg-green-100 text-green-700 font-medium rounded-md border border-green-200 transition-colors">
            <Check className="w-3 h-3 mr-1.5" />
            Tester la connexion SMTP
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {/* Section Notifications */}
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
            onChange={() => setNotificationSettings({...notificationSettings, emailNotifications: !notificationSettings.emailNotifications})}
            label="Notifications par email"
            description="Recevoir les alertes importantes par email"
          />
          <CustomToggle
            checked={notificationSettings.pushNotifications}
            onChange={() => setNotificationSettings({...notificationSettings, pushNotifications: !notificationSettings.pushNotifications})}
            label="Notifications push"
            description="Recevoir les notifications push sur le navigateur"
          />
          <CustomToggle
            checked={notificationSettings.systemAlerts}
            onChange={() => setNotificationSettings({...notificationSettings, systemAlerts: !notificationSettings.systemAlerts})}
            label="Alertes système"
            description="Recevoir les alertes de maintenance et de sécurité"
          />
          <CustomToggle
            checked={notificationSettings.userRegistrationNotify}
            onChange={() => setNotificationSettings({...notificationSettings, userRegistrationNotify: !notificationSettings.userRegistrationNotify})}
            label="Nouvelles inscriptions"
            description="Être notifié lors de nouvelles inscriptions utilisateur"
          />
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'security':
        return renderSecuritySettings();
      case 'email':
        return renderEmailSettings();
      case 'notifications':
        return renderNotificationSettings();
      default:
        return renderSecuritySettings();
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 md:px-8 2xl:px-12 2xl:py-6 text-md">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Paramètres d'administration</h1>
          <p className="text-gray-600 text-sm mt-1">Gérez la configuration de votre application avec des contrôles avancés</p>
        </div>

        <div className="bg-white rounded-md shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row">
            {/* Navigation des onglets */}
            <div className="lg:w-64 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="p-2">
                <h2 className="px-3 py-2 text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Configuration</h2>
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center px-2.5 py-1.5 text-sm text-left rounded-sm transition-all cursor-pointer  ${
                          activeTab === tab.id
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

            {/* Contenu des paramètres */}
            <div className="flex-1 p-4 lg:p-5">
              {renderContent()}
              
              {/* Bouton de sauvegarde fixe */}
              <div className="sticky bottom-0 mt-6 pt-4 bg-white border-t border-gray-200 -mx-4 lg:-mx-5 px-4 lg:px-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                    Sauvegarde automatique activée
                  </div>
                  <button
                    onClick={handleSave}
                    disabled={saved}
                    className={`inline-flex items-center px-4 py-2 rounded-md font-semibold transition-all shadow-sm text-sm ${
                      saved
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