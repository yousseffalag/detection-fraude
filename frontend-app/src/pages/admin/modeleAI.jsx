import React, { useState, useEffect } from "react";
import {
  Brain,
  CheckCircle,
  AlertTriangle,
  Cloud,
  Plus,
  Download,
  TrendingUp,
  Activity,
  X,
  Save,
  Upload,
  Loader,
  Info
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosClient from '../../api/axiosClient';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

function KpiCard({ icon, title, value, trend, trendUp, color, iconBg = "bg-gray-100" }) {
  return (
    <Card className="rounded-xl bg-white shadow-sm border border-gray-100">
      <CardContent className="flex ps-6 items-start">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${iconBg} mr-4`}>{icon}</div>
          <div>
            <p className="text-[14px] font-semibold text-gray-500">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            {trend && (
              <div
                className={`flex items-center gap-1 text-sm font-semibold mt-2 ${trendUp ? "text-green-600" : "text-red-600"
                  }`}
              >
                <TrendingUp className={`w-3 h-3 ${!trendUp ? "rotate-180" : ""}`} />
                {trend}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const ModelDetailModal = ({ model, onClose }) => {
  if (!model) return null;

  const performanceData = [
    { subject: 'Précision', A: model.precision ? model.precision * 100 : 0, fullMark: 100 },
    { subject: 'Rappel', A: model.recall ? model.recall * 100 : 0, fullMark: 100 },
    { subject: 'F1-Score', A: model.f1_score ? model.f1_score * 100 : 0, fullMark: 100 },
    { subject: 'Exactitude', A: model.accuracy ? model.accuracy * 100 : 0, fullMark: 100 },
  ];

  const comparisonData = [
    { name: 'Précision', value: model.precision ? model.precision * 100 : 0 },
    { name: 'Rappel', value: model.recall ? model.recall * 100 : 0 },
    { name: 'F1-Score', value: model.f1_score ? model.f1_score * 100 : 0 },
  ];

  const confusionMatrixData = {
    truePositives: 45,
    falsePositives: 8,
    trueNegatives: 120,
    falseNegatives: 12
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Détails du Modèle</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
            <X className="h-4 w-4 cursor-pointer" />
          </button>
        </div>

        <div className="p-4 px-8 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{model.name}</h3>
              <p className="text-[12px] text-gray-500">
                Dernière MAJ : {new Date(model.created_at).toLocaleDateString()}
              </p>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[12px] ${model.created_at ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}>
              {model.created_at ? "Actif" : "Inactif"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-green-600">
                {model.precision ? (model.precision * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-gray-500">Précision</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-blue-600">
                {model.recall ? (model.recall * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-gray-500">Recall</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-purple-600">
                {model.f1_score ? (model.f1_score * 100).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-gray-500">F1-Score</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-orange-600">
                {model.n_transactions ? model.n_transactions.toLocaleString() : 0}
              </p>
              <p className="text-xs text-gray-500">Transactions traitées</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-sm">Détails techniques</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li><span className="font-medium">Algorithme :</span> {model.algorithm}</li>
                <li><span className="font-medium">Fichier :</span> {model.file_path ? model.file_path.split('/').pop() : 'N/A'}</li>
                <li><span className="font-medium">Précision :</span> {model.precision ? (model.precision * 100).toFixed(2) + '%' : 'N/A'}</li>
                <li><span className="font-medium">Exactitude :</span> {model.accuracy ? (model.accuracy * 100).toFixed(2) + '%' : 'N/A'}</li>
                <li><span className="font-medium">Créé le :</span> {new Date(model.created_at).toLocaleDateString()}</li>
              </ul>
            </div>

            <div className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-sm">État du système</h4>
              <ul className="space-y-2 text-xs">
                <li className="flex items-center gap-2 text-green-600"><CheckCircle className="w-4 h-4" /> Modèle opérationnel</li>
                <li className="flex items-center gap-2 text-blue-600"><Cloud className="w-4 h-4" /> API disponible</li>
                {model.additional_info && (
                  <li className="flex items-center gap-2 text-orange-600"><AlertTriangle className="w-4 h-4" /> Métriques disponibles</li>
                )}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-sm">Comparaison des Métriques</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Valeur']} />
                    <Bar dataKey="value" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Comparaison des principales métriques de performance</p>
            </div>

            <div className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-sm">Performance Globale</h4>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar name="Performance" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">Visualisation radar des performances sur différentes métriques</p>
            </div>
          </div>

          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-2 text-sm">Matrice de Confusion</h4>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="col-span-1"></div>
                <div className="col-span-1 text-center font-medium p-1">Prédit Positif</div>
                <div className="col-span-1 text-center font-medium p-1">Prédit Négatif</div>

                <div className="text-right font-medium pr-2 py-1">Réel Positif</div>
                <div className="bg-green-100 p-2 text-center border rounded">{confusionMatrixData.truePositives}</div>
                <div className="bg-red-100 p-2 text-center border rounded">{confusionMatrixData.falseNegatives}</div>

                <div className="text-right font-medium pr-2 py-1">Réel Négatif</div>
                <div className="bg-red-100 p-2 text-center border rounded">{confusionMatrixData.falsePositives}</div>
                <div className="bg-green-100 p-2 text-center border rounded">{confusionMatrixData.trueNegatives}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-100 mr-1 border border-green-300"></div>
                <span>Vrais positifs/négatifs: {confusionMatrixData.truePositives + confusionMatrixData.trueNegatives}</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-100 mr-1 border border-red-300"></div>
                <span>Faux positifs/négatifs: {confusionMatrixData.falsePositives + confusionMatrixData.falseNegatives}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">Répartition des prédictions correctes et incorrectes</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose} className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

const AddModelModal = ({ isOpen, onClose, onAddModel, uploadProgress }) => {
  const [formData, setFormData] = useState({
    name: "",
    algorithm: "",
    n_transactions: "",
    version: ""
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    setLoading(true);

    const submitFormData = new FormData();
    submitFormData.append("name", formData.name);
    submitFormData.append("algorithm", formData.algorithm);
    submitFormData.append("n_transactions", formData.n_transactions);

    if (file) {
      submitFormData.append("file", file);
    }

    try {
      await onAddModel(submitFormData);

      setFormData({ name: "", algorithm: "", n_transactions: "", version: "" });
      setFile(null);


      setTimeout(() => {
        setLoading(false);
        onClose();
      }, 1500);

    } catch (error) {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50">

      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Ajouter un nouveau modèle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nom du modèle *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: FraudDetect Pro"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Version
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 1.0.0"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Algorithme *
              </label>
              <select
                name="algorithm"
                value={formData.algorithm}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="">Sélectionner un algorithme</option>
                <option value="RandomForest">Random Forest</option>
                <option value="XGBoost">XGBoost</option>
                <option value="LogisticRegression">Régression Logistique</option>
                <option value="NeuralNetwork">Réseau de Neurones</option>
                <option value="DecisionTree">Arbre de Décision</option>
                <option value="SVM">SVM</option>
                <option value="GradientBoosting">Gradient Boosting</option>
                <option value="LightGBM">LightGBM</option>
                <option value="CatBoost">CatBoost</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre de transactions *
              </label>
              <input
                type="number"
                name="n_transactions"
                value={formData.n_transactions}
                onChange={handleChange}
                required
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-[14px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: 10000"
                disabled={loading}
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Uploader le modèle *
            </label>
            <div className="flex items-center justify-center w-full">
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer ${loading ? "bg-gray-100 border-gray-300" : "border-gray-300 hover:bg-gray-50"
                }`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-xs text-gray-500">
                    {file ? file.name : "Glisser-déposer ou choisir un fichier"}
                  </p>
                  <p className="text-xs text-gray-500">Fichiers .pkl, .joblib, .h5, .pt acceptés</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pkl,.joblib,.h5,.pt,.sav,.model"
                  required
                  disabled={loading}
                />
              </label>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-700">
                <strong>Note :</strong> Le nombre de transactions correspond au nombre d'échantillons
                utilisés pour l'entraînement du modèle.
              </p>
            </div>
          </div>
        </form>
        {uploadProgress > 0 && (
          <div className="bg-gray-200 rounded-full h-2.5 mb-4 mx-8">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 flex items-center justify-center"
              style={{ width: `${uploadProgress}%` }}
            >
              <span className="text-[13px] text-white">{uploadProgress}%</span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {loading ? "Création en cours..." : "Créer le modèle"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AIModelsAdmin = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeModel, setActiveModel] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);


  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/ml-models/");
      setModels(response.data);
      if (response.data.length > 0) {
        setActiveModel(response.data[0]);
      }
    } catch (err) {
      const errorMessage = "Erreur lors du chargement des modèles";
      setError(errorMessage);
      // showNotification(errorMessage, "error");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModel = async (formData) => {
    try {
      setUploadProgress(0);

      const response = await axiosClient.post("/ml-models/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        }
      });

      const newModel = response.data;
      setModels(prev => [...prev, newModel]);
      setActiveModel(newModel);

      return Promise.resolve();

    } catch (err) {
      const errorMessage = err.response?.data?.detail || "Erreur lors de la création du modèle";
      setError(errorMessage);
      console.error("Erreur:", err);
      return Promise.reject(errorMessage);
    } finally {
      setUploadProgress(0);
    }
  };

  const handleDownloadModel = async (modelId, modelName) => {
    try {
      const response = await axiosClient.get(`/ml-models/${modelId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${modelName}.pkl`);
      document.body.appendChild(link);
      link.click();
      link.remove();


    } catch (err) {
      const errorMessage = "Erreur lors du téléchargement";
      setError(errorMessage);
      console.error("Erreur:", err);
    }
  };

  const handleViewModel = (model) => {
    setSelectedModel(model);
    setShowDetailModal(true);
  };

  const stats = [
    {
      title: "Total Modèles",
      value: models.length,
      trend: models.length > 0 ? `+${models.length}` : "",
      trendUp: models.length > 0,
      icon: <Brain className="w-5 h-5 text-blue-600" />,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Précision Moyenne",
      value: models.length > 0
        ? `${((models.reduce((sum, model) => sum + (model.precision || 0), 0) / models.length) * 100).toFixed(1)}%`
        : "0%",
      trend: models.length > 0 ? "+2.3%" : "",
      trendUp: true,
      icon: <Activity className="w-5 h-5 text-green-600" />,
      color: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Transactions Traitées",
      value: models.length > 0
        ? `${(models.reduce((sum, model) => sum + (model.n_transactions || 0), 0) / 1000).toFixed(0)}K`
        : "0K",
      trend: models.length > 0 ? "+15%" : "",
      trendUp: true,
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 md:px-8 2xl:px-12 2xl:py-6">

      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Administration des Modèles IA</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gérez et surveillez les performances de vos modèles d'intelligence artificielle
          </p>
        </div>
        <div>
          <Button
            size="sm"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mt-3 mx-2 cursor-pointer"
            onClick={() => setShowAddModal(true)}
          >
            <Plus className="w-4 h-4" />
            Nouveau modèle
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 mx-2">
        {stats.map((stat, idx) => (
          <KpiCard key={idx} {...stat} />
        ))}
      </div>

      {models.length > 0 && (
        <div className="bg-white rounded-lg px-4 py-2 mb-6 border border-gray-200 mx-2">
          <div className="flex space-x-4 overflow-x-auto pb-1">
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveModel(m)}
                className={`px-4 py-2 font-medium text-sm cursor-pointer border-b-2 transition whitespace-nowrap
                  ${activeModel && activeModel.id === m.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeModel ? (
        <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200 mx-2">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-md font-semibold">{activeModel.name}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Créé le : {new Date(activeModel.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${activeModel.created_at ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                {activeModel.created_at ? "Actif" : "Inactif"}
              </span>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xl font-bold text-green-600">
                  {activeModel.precision ? (activeModel.precision * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">Précision</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xl font-bold text-blue-600">
                  {activeModel.recall ? (activeModel.recall * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">Recall</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xl font-bold text-purple-600">
                  {activeModel.f1_score ? (activeModel.f1_score * 100).toFixed(1) : 0}%
                </p>
                <p className="text-xs text-gray-500">F1-Score</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-xl font-bold text-orange-600">
                  {activeModel.n_transactions ? activeModel.n_transactions.toLocaleString() : 0}
                </p>
                <p className="text-xs text-gray-500">Transactions traitées</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-sm">Détails techniques</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li><span className="font-medium">Algorithme :</span> {activeModel.algorithm}</li>
                  <li><span className="font-medium">Fichier :</span> {activeModel.file_path ? activeModel.file_path.split('/').pop() : 'N/A'}</li>
                  <li><span className="font-medium">Accuracy :</span> {activeModel.accuracy ? (activeModel.accuracy * 100).toFixed(2) + '%' : 'N/A'}</li>
                  <li><span className="font-medium">Créé le :</span> {new Date(activeModel.created_at).toLocaleDateString()}</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-sm">État du système</h4>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-center gap-2 text-green-600"><CheckCircle className="w-4 h-4" /> Modèle opérationnel</li>
                  <li className="flex items-center gap-2 text-blue-600"><Cloud className="w-4 h-4" /> API disponible</li>
                  {activeModel.additional_info && (
                    <li className="flex items-center gap-2 text-orange-600"><AlertTriangle className="w-4 h-4" /> Métriques disponibles</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => handleDownloadModel(activeModel.id, activeModel.name)}
            >
              <Download className="w-4 h-4" />
              Télécharger le modèle
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              onClick={() => handleViewModel(activeModel)}
            >
              Voir les détails
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-sm shadow-sm p-8 text-center border border-gray-200 mx-2">
          <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun modèle disponible</h3>
          <p className="text-gray-500 text-sm mb-4">
            Commencez par ajouter votre premier modèle IA
          </p>
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Ajouter un modèle
          </Button>
        </div>
      )}

      {showDetailModal && (
        <ModelDetailModal
          model={selectedModel}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedModel(null);
          }}
        />
      )}

      <AddModelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddModel={handleAddModel}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};

export default AIModelsAdmin;