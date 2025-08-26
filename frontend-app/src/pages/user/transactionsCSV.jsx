import { useState, useRef } from "react";
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
  AlertCircle,
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
  Bell,
  FileUp,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon
} from "lucide-react";

const FraudCSVAnalysis = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState(null);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef(null);

  // Modèles disponibles
  const availableModels = [
    {
      id: "fraud-xgboost",
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
      icon: BarChart2
    },
    {
      id: "fraud-cnn",
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
      icon: Layers
    },
    {
      id: "fraud-lstm",
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
      icon: CpuIcon
    }
  ];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleAnalyzeCSV = async () => {
    if (!selectedModel) {
      alert("Veuillez sélectionner un modèle d'analyse");
      return;
    }

    if (!fileName) {
      alert("Veuillez sélectionner un fichier CSV à analyser");
      return;
    }

    setIsLoading(true);

    try {
      // Simulation d'analyse de fichier CSV
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Générer des données simulées pour la démonstration
      const totalTransactions = Math.floor(Math.random() * 1000) + 500;
      const fraudulentCount = Math.floor(totalTransactions * 0.15);
      const legitimateCount = totalTransactions - fraudulentCount;

      // Générer des données pour le graphique par type de transaction
      const transactionTypes = [
        { type: "PAYMENT", fraudulent: Math.floor(Math.random() * 20), legitimate: Math.floor(Math.random() * 100) },
        { type: "TRANSFER", fraudulent: Math.floor(Math.random() * 40), legitimate: Math.floor(Math.random() * 60) },
        { type: "CASH_OUT", fraudulent: Math.floor(Math.random() * 35), legitimate: Math.floor(Math.random() * 40) },
        { type: "DEBIT", fraudulent: Math.floor(Math.random() * 15), legitimate: Math.floor(Math.random() * 80) },
        { type: "CASH_IN", fraudulent: Math.floor(Math.random() * 5), legitimate: Math.floor(Math.random() * 120) }
      ];

      // Générer des données pour le graphique par montant
      const amountRanges = [
        { range: "0-1000", fraudulent: Math.floor(Math.random() * 10), legitimate: Math.floor(Math.random() * 150) },
        { range: "1000-5000", fraudulent: Math.floor(Math.random() * 20), legitimate: Math.floor(Math.random() * 120) },
        { range: "5000-10000", fraudulent: Math.floor(Math.random() * 25), legitimate: Math.floor(Math.random() * 80) },
        { range: "10000-50000", fraudulent: Math.floor(Math.random() * 30), legitimate: Math.floor(Math.random() * 50) },
        { range: "50000+", fraudulent: Math.floor(Math.random() * 40), legitimate: Math.floor(Math.random() * 20) }
      ];

      // Générer des données pour le graphique temporel (évolution des fraudes)
      const timeSeriesData = [
        { hour: "00h", fraudulent: Math.floor(Math.random() * 5), legitimate: Math.floor(Math.random() * 40) },
        { hour: "04h", fraudulent: Math.floor(Math.random() * 3), legitimate: Math.floor(Math.random() * 20) },
        { hour: "08h", fraudulent: Math.floor(Math.random() * 8), legitimate: Math.floor(Math.random() * 60) },
        { hour: "12h", fraudulent: Math.floor(Math.random() * 12), legitimate: Math.floor(Math.random() * 80) },
        { hour: "16h", fraudulent: Math.floor(Math.random() * 15), legitimate: Math.floor(Math.random() * 90) },
        { hour: "20h", fraudulent: Math.floor(Math.random() * 10), legitimate: Math.floor(Math.random() * 70) }
      ];

      setPredictions({
        totalTransactions,
        fraudulentCount,
        legitimateCount,
        fraudPercentage: ((fraudulentCount / totalTransactions) * 100).toFixed(2),
        transactionTypes,
        amountRanges,
        timeSeriesData,
        modelUsed: selectedModel
      });
    } catch (error) {
      console.error("Erreur d'analyse:", error);
      alert("Une erreur s'est produite lors de l'analyse du fichier.");
    } finally {
      setIsLoading(false);
    }
  };

  const FraudPieChart = ({ fraudulent, legitimate }) => {
    const total = fraudulent + legitimate;
    const fraudPercentage = total > 0 ? (fraudulent / total) * 100 : 0;
    const legitPercentage = total > 0 ? (legitimate / total) * 100 : 0;

    return (
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#e5e7eb" strokeWidth="3" />
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            strokeDasharray={`${fraudPercentage} ${100 - fraudPercentage}`}
            strokeDashoffset="25"
          />
          <circle
            cx="18"
            cy="18"
            r="15.9155"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            strokeDasharray={`${legitPercentage} ${100 - legitPercentage}`}
            strokeDashoffset={25 - fraudPercentage}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-800">{total}</span>
          <span className="text-sm text-gray-500 mt-1">transactions</span>
        </div>

        <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className="text-xs font-medium">{fraudulent} fraudes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs font-medium">{legitimate} légitimes</span>
          </div>
        </div>
      </div>
    );
  };
  const BarChartComponent = ({ data, title, color }) => {
    if (!data || !Array.isArray(data)) {
      return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              <BarChart3 className="h-4 w-4 text-gray-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
          </div>
          <p className="text-xs text-gray-500 text-center py-4">Aucune donnée disponible</p>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => (item.fraudulent || 0) + (item.legitimate || 0)));

    return (
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-indigo-100 rounded-lg mr-3">
            <BarChart3 className="h-4 w-4 text-indigo-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="space-y-3">
          {data.map((item, index) => {
            const fraudulent = item.fraudulent || 0;
            const legitimate = item.legitimate || 0;
            const total = fraudulent + legitimate;
            const percentage = maxValue > 0 ? (total / maxValue) * 100 : 0;

            return (
              <div key={index} className="flex items-center">
                <span className="text-xs w-20 font-medium text-gray-700 truncate">{item.range || item.type || item.hour || 'N/A'}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2 ml-3">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      background: color
                    }}
                  ></div>
                </div>
                <span className="text-xs w-12 text-right ml-3 font-semibold text-gray-800">{total}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const TimeSeriesChart = ({ data }) => {
    if (!data || !Array.isArray(data)) {
      return (
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gray-100 rounded-lg mr-3">
              <Activity className="h-4 w-4 text-gray-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-800">Évolution temporelle</h3>
          </div>
          <p className="text-xs text-gray-500 text-center py-4">Aucune donnée disponible</p>
        </div>
      );
    }

    const maxValue = Math.max(...data.map(item => (item.fraudulent || 0) + (item.legitimate || 0)));

    return (
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-purple-100 rounded-lg mr-3">
            <Activity className="h-4 w-4 text-purple-600" />
          </div>
          <h3 className="text-sm font-semibold text-gray-800">Évolution temporelle des transactions</h3>
        </div>

        <div className="flex items-end justify-between h-40 mt-6 border-b border-l border-gray-200 px-2">
          {data.map((item, index) => {
            const fraudulent = item.fraudulent || 0;
            const legitimate = item.legitimate || 0;
            const total = fraudulent + legitimate;
            const height = maxValue > 0 ? (total / maxValue) * 100 : 0;

            return (
              <div key={index} className="flex flex-col items-center" style={{ width: `${100 / data.length}%` }}>
                <div className="flex flex-col items-center justify-end h-32">
                  <div className="flex">
                    <div
                      className="w-3 bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all duration-500"
                      style={{ height: `${legitimate / maxValue * 100}%` }}
                      title={`Légitimes: ${legitimate}`}
                    ></div>
                    <div
                      className="w-3 bg-gradient-to-t from-red-500 to-red-400 rounded-t ml-0.5 transition-all duration-500"
                      style={{ height: `${fraudulent / maxValue * 100}%` }}
                      title={`Frauduleuses: ${fraudulent}`}
                    ></div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-2 truncate">{item.hour}h</span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-t from-green-500 to-green-400 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-600">Légitimes</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gradient-to-t from-red-500 to-red-400 rounded-sm mr-2"></div>
            <span className="text-xs text-gray-600">Frauduleuses</span>
          </div>
        </div>
      </div>
    );
  };

  const RiskMeter = ({ percentage }) => {
    const riskLevel = percentage > 20 ? 'Élevé' : percentage > 10 ? 'Moyen' : 'Faible';
    const riskColor = percentage > 20 ? 'red' : percentage > 10 ? 'orange' : 'green';

    return (
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
        <h4 className="text-sm font-semibold text-gray-800 mb-6 flex items-center">
          <ShieldAlert className="h-4.5 w-4 mr-2 text-red-600" />
          Niveau de Risque Global
        </h4>
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
            <div
              className="h-3 rounded-full transition-all duration-1000"
              style={{
                width: `${percentage > 100 ? 100 : percentage}%`,
                background: riskColor === 'red'
                  ? 'linear-gradient(90deg, #ef4444, #dc2626)'
                  : riskColor === 'orange'
                    ? 'linear-gradient(90deg, #f97316, #ea580c)'
                    : 'linear-gradient(90deg, #22c55e, #16a34a)'
              }}
            ></div>
          </div>
          <div className="flex justify-between w-full text-xs text-gray-500 mb-2">
            <span>Faible</span>
            <span>Moyen</span>
            <span>Élevé</span>
          </div>
          <div className="text-center">
            <span className={`text-xl font-bold ${riskColor === 'red' ? 'text-red-600' :
              riskColor === 'orange' ? 'text-orange-600' :
                'text-green-600'
              }`}>
              {riskLevel}
            </span>
            <p className="text-[13px] text-gray-600 mt-1">{percentage}% de transactions suspectes</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-6 md:px-8 2xl:px-12 2xl:py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">Analyse de Fichier CSV</h1>
        </div>
        <p className="text-gray-600 text-sm mt-1">
          Analysez un fichier CSV contenant des transactions pour détecter les fraudes.
        </p>
      </div>

      <div className="space-y-6">
        {/* Formulaire d'upload */}
        <div className="bg-white rounded-sm shadow-xs border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <FileUp className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-800">Analyse par Lot</h2>
                <p className="text-gray-600 text-sm">Uploader un fichier CSV pour analyser plusieurs transactions</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            {/* Sélecteur de modèle */}
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
                        <div className={`p-2 rounded-lg mr-3 ${selectedModel.color}`}>
                          <selectedModel.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="text-left">
                          <span className="font-medium text-sm block">{selectedModel.name}</span>
                          <span className="text-xs text-gray-500">Précision: {selectedModel.precision}%</span>
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
                      const ModelIcon = model.icon;
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
                              <div className={`p-2 rounded-lg mr-3 ${model.color}`}>
                                <ModelIcon className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{model.name}</div>
                                <div className="text-xs text-gray-500 mt-1">Précision: {model.precision}% | F1: {model.f1}%</div>
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

            {/* Upload de fichier */}
            <div className="mb-6">
              <h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center">
                <Upload className="h-4 w-4 mr-2 text-indigo-600" />
                Fichier CSV
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors cursor-pointer">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".csv"
                  className="hidden"
                />

                {fileName ? (
                  <div
                    className="flex flex-col items-center"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="h-12 w-12 text-indigo-500 mb-3" />
                    <p className="text-sm font-medium text-gray-700">{fileName}</p>
                    <button className="text-indigo-600 text-sm mt-2 hover:text-indigo-800">
                      Changer de fichier
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">
                      <span className="text-indigo-600 font-medium">Cliquez pour uploader</span> ou glissez-déposez
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Formats acceptés: .csv (max 10MB)</p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleAnalyzeCSV}
              disabled={isLoading || !selectedModel || !fileName}
              className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-md font-medium hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center shadow-md hover:shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyse en cours...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyser le fichier
                </>
              )}
            </button>
          </div>
        </div>

        {/* Conseils */}
        <div className="bg-white rounded-sm shadow-xs border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <Info className="h-5 w-5 text-white" />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold text-gray-800">Conseils d'Upload</h2>
                <p className="text-gray-600 text-sm">Recommandations pour un fichier CSV optimal</p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg mr-3">
                  <FileText className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Format des colonnes</h4>
                  <p className="text-xs text-gray-600">Assurez-vous que votre CSV contient les colonnes: type, amount, nameOrig, oldbalanceOrg, newbalanceOrig, nameDest, oldbalanceDest, newbalanceDest</p>
                </div>
              </div>

              <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">Données valides</h4>
                  <p className="text-xs text-gray-600">Vérifiez que toutes les valeurs sont au format correct et qu'il n'y a pas de valeurs manquantes dans les colonnes obligatoires</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Résultats - Version améliorée */}
        {predictions ? (
          <div className="space-y-6">
            {/* En-tête des résultats */}
            <div className="bg-white rounded-sm shadow-xs border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                      <PieChartIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h2 className="text-lg font-semibold text-gray-800">Résultats de l'Analyse</h2>
                      <p className="text-gray-600 text-sm">Résumé des transactions analysées</p>
                    </div>
                  </div>
                  <div className="bg-white/80 px-3 py-1 rounded-full border border-blue-200">
                    <span className="text-blue-700 text-sm font-medium flex items-center">
                      <Brain className="h-3 w-3 mr-1" />
                      {predictions.modelUsed.name}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Cartes de statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
                  {/* Carte Total Transactions */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg mr-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800 pr-10">Total Transactions</h4>
                      </div>
                      <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        TOTAL
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-blue-700 mb-3 mt-2">{predictions.totalTransactions.toLocaleString()}</p>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Carte Transactions Légitimes */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg mr-3">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800">Transactions Légitimes</h4>
                      </div>
                      <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                        SÉCURISÉ
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-green-700 mb-2">{predictions.legitimateCount.toLocaleString()}</p>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-green-100 rounded-full h-2 mr-3">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${(predictions.legitimateCount / predictions.totalTransactions) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">
                        {((predictions.legitimateCount / predictions.totalTransactions) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Carte Transactions Frauduleuses */}
                  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg mr-3">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-800">Transactions Frauduleuses</h4>
                      </div>
                      <div className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                        ALERTE
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-red-700 mb-2">{predictions.fraudulentCount.toLocaleString()}</p>
                    <div className="flex items-center justify-between">
                      <div className="w-full bg-red-100 rounded-full h-2 mr-3">
                        <div
                          className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${predictions.fraudPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-red-600">
                        {predictions.fraudPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Graphique circulaire et indicateur de risque */}
                <div className="flex flex-col lg:flex-row gap-6 mb-6">
                  {/* Graphique circulaire */}
                  <div className="flex-1 bg-white rounded-xl p-5 border border-gray-100 shadow-xs">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-indigo-100 rounded-lg mr-3">
                        <PieChart className="h-4 w-4 text-indigo-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">Répartition des transactions</h3>
                    </div>
                    <div className="flex justify-center py-2 mb-6">
                      <FraudPieChart
                        fraudulent={predictions.fraudulentCount}
                        legitimate={predictions.legitimateCount}
                      />
                    </div>
                  </div>

                  {/* Indicateur de risque */}
                  <div className="flex-1 bg-white rounded-xl p-5 border border-gray-100 shadow-xs">
                    <div className="flex items-center mb-4">
                      <div className="p-2 bg-amber-100 rounded-lg mr-3 shadow-xs">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-800">Niveau de risque</h3>
                    </div>
                    <div className="py-4">
                      <RiskMeter percentage={parseFloat(predictions.fraudPercentage)} />
                    </div>
                  </div>
                </div>

                {/* Bannière de statut */}
                {/* Bannière de statut */}
                <div className="p-4">
                  <div className={`flex items-start p-3 rounded-lg ${predictions.fraudulentCount > 50 ?
                    'bg-red-50' : 'bg-green-50'
                    }`}>
                    <div className={`p-2 rounded-lg mr-3 ${predictions.fraudulentCount > 50 ?
                      'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                      }`}>
                      {predictions.fraudulentCount > 50 ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        {predictions.fraudulentCount > 50 ?
                          'Taux de fraude élevé détecté' :
                          'Taux de fraude dans les normes'
                        }
                      </h4>
                      <p className="text-xs text-gray-600">
                        {predictions.fraudulentCount > 50 ?
                          `Recommandation: Investigation manuelle des ${predictions.fraudulentCount} transactions suspectes.` :
                          'Vos transactions présentent un profil de risque acceptable.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Section des graphiques analytiques */}
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 uppercase">Analyses détaillées</h2>
                <div className="flex items-center text-xs text-gray-500">
                  <Info className="h-3.5 w-3.5 mr-1" />
                  Données basées sur l'analyse du fichier
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Graphique par type de transaction */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs hover:shadow-sm transition-all duration-200">
                  <div className="flex items-start mb-5">
                    <div className="p-2.5 bg-blue-500/10 rounded-lg mr-3 flex-shrink-0">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Types de transactions</h3>
                      <p className="text-xs text-gray-500">Répartition par catégorie opérationnelle</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <BarChartComponent
                      data={predictions.transactionTypes}
                      title=""
                      color="linear-gradient(90deg, #3b82f6, #6366f1)"
                    />
                  </div>
                </div>

                {/* Graphique par plage de montant */}
                <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs transition-all duration-200">
                  <div className="flex items-start mb-5">
                    <div className="p-2.5 bg-green-500/10 rounded-lg mr-3 flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 mb-1">Plages de montants</h3>
                      <p className="text-xs text-gray-500">Distribution des valeurs transactionnelles</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <BarChartComponent
                      data={predictions.amountRanges}
                      title=""
                      color="linear-gradient(90deg, #10b981, #059669)"
                    />
                  </div>
                </div>
              </div>

              {/* Graphique d'évolution temporelle */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xs transition-all duration-200">
                <div className="flex items-start mb-5">
                  <div className="p-2.5 bg-purple-500/10 rounded-lg mr-3 flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Évolution temporelle</h3>
                    <p className="text-xs text-gray-500">Fluctuation des transactions dans le temps</p>
                  </div>
                </div>
                <div className="mt-4">
                  <TimeSeriesChart data={predictions.timeSeriesData} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white mx-32 my-6">
              <div className="flex flex-col md:flex-row justify-center items-center gap-4">
                <button className="flex-1 py-2 px-2 text-white bg-gradient-to-r from-blue-600 to-indigo-700 font-medium rounded-lg text-[13px] flex items-center justify-center cursor-pointer">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger Le Rapport
                </button>
                <button
                  onClick={() => {
                    setPredictions(null);
                    setFileName("");
                  }}
                  className="flex-1 py-2 px-2 bg-gradient-to-r from-gray-200 to-gray-400 text-white rounded-lg text-[13px] font-medium  flex items-center justify-center cursor-pointer"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Nouvelle analyse
                </button>
              </div>
            </div>


          </div>
        ) : (
          // État d'attente sans fichier
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-8 text-center">
              <div className="relative mb-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <BarChartIcon className="h-8 w-8 text-indigo-500" />
                </div>
              </div>
              <h3 className="text-md font-semibold text-gray-800 mb-2">
                Analyse par Lot CSV
              </h3>
              <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
                Uploader un fichier CSV contenant des transactions pour obtenir une analyse complète avec visualisations.
              </p>

              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <p className="text-blue-500 text-xs">Format CSV</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="text-green-500 text-xs">Analyse Rapide</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <PieChartIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-purple-500 text-xs">Visualisations</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FraudCSVAnalysis;