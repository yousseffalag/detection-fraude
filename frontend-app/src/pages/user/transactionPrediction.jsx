import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Shield,
  PieChart,
  DollarSign,
  Calendar,
  Clock,
  User,
  ArrowRightLeft,
  CreditCard,
  Eye,
  Activity,
  Zap,
  Target,
  Wallet,
  TrendingDown,
  Building2,
  X,
  Brain,
  Cloud,
  Download,
  Plus,
  Save,
  Upload,
  Cpu,
  FileText,
  ChevronDown,
  Sparkles,
  Search,
  Filter,
  BarChart2,
  Layers,
  CpuIcon,
  Info,
  ShieldAlert,
  Lock,
  Bell
} from "lucide-react";
import AxiosClient from "../../api/axiosClient"; // Import de votre client Axios configuré

const FraudDetectionApp = () => {
  const [formData, setFormData] = useState({
    type: "",
    amt: "",
    nameOrig: "",
    oldbalanceOrg: "",
    newbalanceOrig: "",
    nameDest: "",
    oldbalanceDest: "",
    newbalanceDest: "",
    date: "",
    weekday: "",
    hour: "",
    minute: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);
  const [error, setError] = useState(null);

  // Icônes par défaut pour les modèles
  const defaultIcons = {
    "xgboost": BarChart2,
    "cnn": Layers,
    "lstm": CpuIcon,
    "default": Brain
  };

  // Fonction pour obtenir l'icône en fonction du type de modèle
  const getModelIcon = (modelName) => {
    const lowerName = modelName.toLowerCase();
    if (lowerName.includes("xgboost")) return defaultIcons.xgboost;
    if (lowerName.includes("cnn")) return defaultIcons.cnn;
    if (lowerName.includes("lstm")) return defaultIcons.lstm;
    return defaultIcons.default;
  };

  // Charger les modèles disponibles depuis l'API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await AxiosClient.get("/ml-models");

        console.log("Modèles chargés:", response.data);

        const modelsWithIcons = response.data.map(model => ({
          ...model,
          icon: getModelIcon(model.name)
        }));
        setAvailableModels(modelsWithIcons);

        // Sélectionner le premier modèle par défaut
        if (modelsWithIcons.length > 0 && !selectedModel) {
          setSelectedModel(modelsWithIcons[0]);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des modèles:", error);
        setError("Impossible de charger les modèles. Utilisation des modèles par défaut.");

        // Modèles par défaut en cas d'erreur
        const defaultModels = [
          {
            id: 1,
            name: "FraudShield XGBoost",
            version: "3.0",
            precision: 96.1,
            recall: 94.7,
            f1: 95.4,
            transactions: 310000,
            description: "Modèle basé sur XGBoost optimisé pour la détection de fraude financière",
            architecture: "Gradient Boosted Trees",
            framework: "XGBoost",
            color: "bg-gradient-to-r from-blue-500 to-indigo-600",
            icon: getModelIcon("xgboost")
          },
          {
            id: 2,
            name: "FraudNet CNN",
            version: "2.1",
            precision: 92.8,
            recall: 91.2,
            f1: 92.0,
            transactions: 185000,
            description: "Réseau de neurones convolutif pour l'analyse des séquences transactionnelles",
            architecture: "Convolutional Neural Network",
            framework: "TensorFlow",
            color: "bg-gradient-to-r from-purple-500 to-pink-600",
            icon: getModelIcon("cnn")
          },
          {
            id: 3,
            name: "FraudLSTM Pro",
            version: "1.5",
            precision: 94.3,
            recall: 93.1,
            f1: 93.7,
            transactions: 225000,
            description: "LSTM pour l'analyse temporelle des patterns de transactions",
            architecture: "Recurrent Neural Network",
            framework: "PyTorch",
            color: "bg-gradient-to-r from-green-500 to-teal-600",
            icon: getModelIcon("lstm")
          }
        ];
        setAvailableModels(defaultModels);
        if (!selectedModel) {
          setSelectedModel(defaultModels[0]);
        }
      }
    };

    fetchModels();
  }, []);

  useEffect(() => {
    setPrediction(null);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedModel) {
      alert("Veuillez sélectionner un modèle d'analyse");
      return;
    }

    // Validation des données
    if (!formData.type || !formData.amt || !formData.nameOrig || !formData.nameDest) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Préparer les données pour l'API
      const requestData = {
        type: formData.type,
        amt: parseFloat(formData.amt),
        nameOrig: formData.nameOrig,
        oldbalanceOrg: parseFloat(formData.oldbalanceOrg) || 0,
        newbalanceOrig: parseFloat(formData.newbalanceOrig) || 0,
        nameDest: formData.nameDest,
        oldbalanceDest: parseFloat(formData.oldbalanceDest) || 0,
        newbalanceDest: parseFloat(formData.newbalanceDest) || 0,
        weekday: parseInt(formData.weekday) || new Date().getDay(),
        hour: parseInt(formData.hour) || new Date().getHours(),
        ml_model_id: selectedModel.id
      };

      // Appel à l'API
      const response = await AxiosClient.post("/transactions/predict", requestData);
      
      console.log("Request Data :", requestData);

      console.log("Prediction :", response.data);

      // Traitement de la réponse
      const predictionData = response.data;

      // Calcul du score de risque basé sur la probabilité
      const riskScore = Math.round(predictionData.probability * 100);
      const isFraudulent = predictionData.prediction === 1;

      // Transformation des facteurs d'influence SHAP en format utilisable
      const factors = predictionData.influencing_factors ?
        Object.entries(predictionData.influencing_factors).map(([factor, impact]) => ({
          factor: factor,
          impact: Math.abs(impact) * 100,
          description: getFactorDescription(factor, impact),
          positive: impact < 0, // Impact négatif signifie réduction du risque
          icon: getFactorIcon(factor)
        })).sort((a, b) => b.impact - a.impact) : [];

      setPrediction({
        fraudulent: isFraudulent,
        confidence: (predictionData.probability * 100).toFixed(1),
        riskScore: riskScore,
        explanation: isFraudulent
          ? "ALERTE : Cette transaction présente des caractéristiques typiques de fraude financière selon notre modèle d'apprentissage automatique."
          : "Cette transaction semble légitime et respecte les patterns normaux de comportement financier.",
        factors: factors,
        recommendation: isFraudulent
          ? "BLOCAGE IMMÉDIAT - Investigation manuelle obligatoire"
          : "AUTORISER - Transaction dans les normes acceptables",
        transactionSummary: {
          amount: parseFloat(formData.amt),
          balanceChange: (parseFloat(formData.oldbalanceOrg) || 0) - (parseFloat(formData.newbalanceOrig) || 0),
          destBalanceChange: (parseFloat(formData.newbalanceDest) || 0) - (parseFloat(formData.oldbalanceDest) || 0),
          type: formData.type
        },
        modelUsed: selectedModel
      });
    } catch (error) {
      console.error("Erreur de prédiction:", error);
      setError("Une erreur s'est produite lors de l'analyse. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions utilitaires pour les facteurs d'influence
  const getFactorDescription = (factor, impact) => {
    const impactText = Math.abs(impact) > 0.1 ? "impact significatif" : "impact modéré";
    return impact < 0
      ? `Réduction du risque (${impactText})`
      : `Augmentation du risque (${impactText})`;
  };

  const getFactorIcon = (factor) => {
    const factorIcons = {
      "hour_of_day": Clock,
      "day_of_week": Calendar,
      "oldbalanceOrg": Wallet,
      "newbalanceOrig": Wallet,
      "oldbalanceDest": Building2,
      "newbalanceDest": Building2,
      "diff_new_old_balance": TrendingDown,
      "diff_new_old_destiny": TrendingUp,
      "ratio_amount_balanceOrig": DollarSign,
      "type": ArrowRightLeft
    };
    return factorIcons[factor] || Activity;
  };

  const getRiskColor = (score) => {
    if (score < 30) return "text-green-600 bg-green-100";
    if (score < 65) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getRiskLevel = (score) => {
    if (score < 30) return "FAIBLE";
    if (score < 65) return "MODÉRÉ";
    return "CRITIQUE";
  };

  const weekdays = [
    "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"
  ];

  const transactionTypes = [
    { value: "PAYMENT", label: "PAYMENT - Paiement", risk: "Faible" },
    { value: "TRANSFER", label: "TRANSFER - Transfert", risk: "Élevé" },
    { value: "CASH_OUT", label: "CASH_OUT - Retrait", risk: "Très élevé" },
    { value: "DEBIT", label: "DEBIT - Débit", risk: "Modéré" },
    { value: "CASH_IN", label: "CASH_IN - Dépôt", risk: "Faible" }
  ];

  // Conseils pour éviter les fraudes
  const fraudPreventionTips = [
    {
      icon: Shield,
      title: "Vérifiez l'authenticité",
      description: "Toujours vérifier l'identité du destinataire avant d'effectuer un transfert."
    },
    {
      icon: Lock,
      title: "Mots de passe forts",
      description: "Utilisez des mots de passe complexes et différents pour chaque service bancaire."
    },
    {
      icon: Bell,
      title: "Alertes de transaction",
      description: "Activez les notifications pour être informé de toutes les transactions."
    },
    {
      icon: Eye,
      title: "Surveillance régulière",
      description: "Vérifiez régulièrement vos relevés bancaires pour détecter toute activité suspecte."
    }
  ];

  return (
    <div className="min-h-screen p-4 pb-8 md:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center">
          <h1 className="text-[22px] font-bold text-gray-800">Détection de Fraude Intelligente</h1>
        </div>
        <p className="text-gray-600 text-[14px] mt-1">
          Système avancé d'analyse transactionnelle utilisant l'intelligence artificielle.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Formulaire */}
        <div className="bg-white rounded-sm shadow-xs border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-800">Analyse de Transaction</h2>
                <p className="text-gray-600 text-sm">Renseignez les détails de la transaction à analyser</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* Sélecteur de modèle compact */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-indigo-600" />
                Modèle d'analyse
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    {selectedModel ? (
                      <>
                        <div className={`p-2 rounded-lg mr-3 ${selectedModel.color || "bg-gradient-to-r from-blue-500 to-indigo-600"}`}>
                          {selectedModel.icon ? <selectedModel.icon className="h-4 w-4 text-white" /> : <Brain className="h-4 w-4 text-white" />}
                        </div>
                        <div className="text-left">
                          <span className="font-medium text-sm block">{selectedModel.name}</span>
                          <span className="text-xs text-gray-500">Précision: {(selectedModel.precision * 100).toFixed(1)}% </span>
                        </div>
                      </>
                    ) : (
                      <span className="text-gray-500">Sélectionner un modèle</span>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showModelDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {availableModels.map(model => {
                      const ModelIcon = model.icon || Brain;
                      return (
                        <div
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model);
                            setShowModelDropdown(false);
                          }}
                          className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-start">
                              <div className={`p-2 rounded-lg mr-3 ${model.color || "bg-gradient-to-r from-blue-500 to-indigo-600"}`}>
                                <ModelIcon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{model.name}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Précision: {(model.precision * 100).toFixed(1)}% |
                                  F1: {(model.f1_score * 100).toFixed(1)}% |
                                  Recall: {(model.recall * 100).toFixed(1)}%
                                </div>
                              </div>
                            </div>
                            {selectedModel?.id === model.id && (
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Section Informations de transaction */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <ArrowRightLeft className="h-4 w-4 mr-2 text-indigo-600" />
                Informations de transaction
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Type de transaction */}
                <div className="md:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Type de transaction *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {transactionTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} ({type.risk})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Montant */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Montant (€) *
                  </label>
                  <input
                    type="number"
                    name="amt"
                    value={formData.amt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>

                {/* Date exacte */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Date exacte
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Heure et minute */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Heure
                    </label>
                    <input
                      type="number"
                      name="hour"
                      value={formData.hour}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="HH"
                      min="0"
                      max="23"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Minute
                    </label>
                    <input
                      type="number"
                      name="minute"
                      value={formData.minute}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="MM"
                      min="0"
                      max="59"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Informations personnelles */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-indigo-600" />
                Informations personnelles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Compte origine */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Compte origine *
                  </label>
                  <input
                    type="text"
                    name="nameOrig"
                    value={formData.nameOrig}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="C123456789"
                    required
                  />
                </div>

                {/* Compte destination */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Compte destination *
                  </label>
                  <input
                    type="text"
                    name="nameDest"
                    value={formData.nameDest}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="M987654321"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section Soldes des comptes */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <Wallet className="h-4 w-4 mr-2 text-indigo-600" />
                Soldes des comptes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ancien solde origine */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ancien solde origine (€)
                  </label>
                  <input
                    type="number"
                    name="oldbalanceOrg"
                    value={formData.oldbalanceOrg}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Nouveau solde origine */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nouveau solde origine (€)
                  </label>
                  <input
                    type="number"
                    name="newbalanceOrig"
                    value={formData.newbalanceOrig}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Ancien solde destination */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Ancien solde destination (€)
                  </label>
                  <input
                    type="number"
                    name="oldbalanceDest"
                    value={formData.oldbalanceDest}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>

                {/* Nouveau solde destination */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Nouveau solde destination (€)
                  </label>
                  <input
                    type="number"
                    name="newbalanceDest"
                    value={formData.newbalanceDest}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !selectedModel}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center shadow-md hover:shadow-lg text-sm"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyse en cours...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2 cursor-pointer" />
                  Analyser la transaction
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2 text-blue-600" />
            Signes d'alerte
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="text-red-500 mr-1">•</span>
              Transactions à des heures inhabituelles
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-1">•</span>
              Montants anormalement élevés
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-1">•</span>
              Demandes pressantes
            </li>
          </ul>
        </div>

        {/* Résultats */}
        {prediction ? (
          <div className="space-y-4">
            {/* Résultat principal compact */}
            <div className={`bg-white rounded-xl shadow-sm border-2 ${prediction.fraudulent ? 'border-red-200' : 'border-green-200'} transition-all duration-500 overflow-hidden`}>
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {prediction.fraudulent ? (
                      <div className="p-2 bg-red-100 rounded-lg mr-3">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                    ) : (
                      <div className="p-2 bg-green-100 rounded-lg mr-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-md font-bold text-gray-800">
                        {prediction.fraudulent ? 'FRAUDE DÉTECTÉE' : 'TRANSACTION LÉGITIME'}
                      </h3>
                      <p className="text-xs text-gray-500">{prediction.modelUsed.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Score de risque compact */}
                    <div className="flex items-center">
                      <div className="relative w-16 h-16">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={prediction.fraudulent ? "#ef4444" : "#10b981"}
                            strokeWidth="4"
                            strokeDasharray={`${prediction.riskScore}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-sm font-bold text-gray-800">{prediction.riskScore}%</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getRiskColor(prediction.riskScore)}`}>
                      {getRiskLevel(prediction.riskScore)}
                    </span>
                  </div>
                </div>

                {/* Métriques en ligne */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-500 text-xs">Montant</p>
                    <p className="text-sm font-bold text-gray-800">
                      {prediction.transactionSummary.amount.toLocaleString()} €
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-500 text-xs">Type</p>
                    <p className="text-sm font-bold text-gray-800">
                      {prediction.transactionSummary.type}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-500 text-xs">Confiance</p>
                    <p className="text-sm font-bold text-gray-800">{prediction.confidence}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <p className="text-gray-500 text-xs">Recommandation</p>
                    <p className={`text-xs font-bold ${prediction.fraudulent ? 'text-red-600' : 'text-green-600'}`}>
                      {prediction.fraudulent ? 'BLOQUER' : 'AUTORISER'}
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${prediction.fraudulent ? 'bg-red-100' : 'bg-green-100' } `}>
                  <p className={`text-sm ${prediction.fraudulent ? 'text-red-600' : 'text-green-600' } `}>{prediction.explanation}</p>
                </div>
              </div>
            </div>

            {/* Facteurs d'impact en grille */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-md font-semibold text-gray-800 ml-2">Facteurs d'Impact</h3>
                </div>
                <p className="text-gray-600 text-sm mt-1">Principaux éléments ayant influencé la décision</p>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prediction.factors.map((factor, index) => {
                    const IconComponent = factor.icon;
                    return (
                      <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start">
                            <div className={`p-2 rounded-lg mr-3 ${factor.positive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm">{factor.factor}</h4>
                              <p className="text-gray-600 text-xs mt-1">{factor.description}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${factor.positive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {factor.impact.toFixed(0)}%
                          </span>
                        </div>

                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-1000 ${factor.positive ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${Math.min(factor.impact, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Résumé des changements de solde */}
                <div className="mt-5 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <Wallet className="h-4 w-4 mr-2 text-blue-600" />
                    Analyse des Soldes
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-600 text-xs">Variation compte origine</p>
                      <p className={`text-sm font-bold ${prediction.transactionSummary.balanceChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {prediction.transactionSummary.balanceChange >= 0 ? '+' : ''}{prediction.transactionSummary.balanceChange.toLocaleString()} €
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-600 text-xs">Variation compte destination</p>
                      <p className={`text-sm font-bold ${prediction.transactionSummary.destBalanceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {prediction.transactionSummary.destBalanceChange >= 0 ? '+' : ''}{prediction.transactionSummary.destBalanceChange.toLocaleString()} €
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // État d'attente avec informations dataset - compact
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="relative mb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <PieChart className="h-8 w-8 text-indigo-500" />
                </div>
              </div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Système de Détection de Fraude
              </h3>
              <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                Notre système d'IA analyse les transactions en temps réel pour détecter les activités suspectes avec une précision de 98.7%.
              </p>

              {/* Indicateurs de performance compacts */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="text-green-600 font-bold text-sm">98.7%</h4>
                  <p className="text-green-500 text-xs">Précision</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="text-blue-600 font-bold text-sm">&lt;2s</h4>
                  <p className="text-blue-500 text-xs">Temps</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Activity className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="text-purple-600 font-bold text-sm">50K+</h4>
                  <p className="text-purple-500 text-xs">Transactions</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudDetectionApp;