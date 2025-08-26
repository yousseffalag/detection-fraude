import React, { useState } from "react";
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
  Upload
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Détails du Modèle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Header Info */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-semibold">
                {model.name} v{model.version}
              </h3>
              <p className="text-sm text-gray-500">
                Dernière MAJ : {model.lastUpdate}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                model.status === "Actif"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {model.status}
            </span>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-green-600">
                {model.precision}%
              </p>
              <p className="text-xs text-gray-500">Précision</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-blue-600">
                {model.recall}%
              </p>
              <p className="text-xs text-gray-500">Recall</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-purple-600">
                {model.f1}%
              </p>
              <p className="text-xs text-gray-500">F1-Score</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-orange-600">
                {model.transactions.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Transactions traitées</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-sm">Détails techniques</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>
                  <span className="font-medium">Architecture :</span>{" "}
                  {model.architecture}
                </li>
                <li>
                  <span className="font-medium">Framework :</span>{" "}
                  {model.framework}
                </li>
                <li>
                  <span className="font-medium">Dataset :</span>{" "}
                  {model.dataset}
                </li>
                <li>
                  <span className="font-medium">Classes :</span>{" "}
                  {model.classes}
                </li>
                <li>
                  <span className="font-medium">Taille :</span>{" "}
                  {model.size}
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-3">
              <h4 className="font-semibold mb-2 text-sm">État du système</h4>
              <ul className="space-y-2 text-xs">
                {model.system.operational && (
                  <li className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" /> Modèle opérationnel
                  </li>
                )}
                {model.system.api && (
                  <li className="flex items-center gap-2 text-blue-600">
                    <Cloud className="w-4 h-4" /> API disponible
                  </li>
                )}
                {model.system.update && (
                  <li className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" /> Mise à jour dispo (v
                    {model.system.update})
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Performance Chart (placeholder) */}
          <div className="border rounded-lg p-3">
            <h4 className="font-semibold mb-2 text-sm">Performance</h4>
            <div className="h-40 bg-gray-50 rounded flex items-center justify-center">
              <p className="text-xs text-gray-500">Graphique de performance du modèle</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

const AddModelModal = ({ isOpen, onClose, onAddModel }) => {
  const [formData, setFormData] = useState({
    name: "",
    version: "",
    architecture: "",
    framework: "",
    dataset: "",
    classes: "",
    size: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Générer un ID unique
    const id = formData.name.toLowerCase().replace(/\s+/g, '-');
    
    // Créer le nouveau modèle avec des valeurs par défaut
    const newModel = {
      id,
      name: formData.name,
      version: formData.version,
      precision: 0,
      recall: 0,
      f1: 0,
      transactions: 0,
      classes: parseInt(formData.classes) || 0,
      size: formData.size,
      lastUpdate: new Date().toISOString().split('T')[0],
      status: "Inactif",
      architecture: formData.architecture,
      framework: formData.framework,
      dataset: formData.dataset,
      system: {
        operational: false,
        api: false,
        update: null,
      }
    };
    
    onAddModel(newModel);
    onClose();
    
    // Réinitialiser le formulaire
    setFormData({
      name: "",
      version: "",
      architecture: "",
      framework: "",
      dataset: "",
      classes: "",
      size: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Ajouter un nouveau modèle</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Ex: FraudDetect Pro"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Version *
              </label>
              <input
                type="text"
                name="version"
                value={formData.version}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Ex: 1.0"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Architecture *
              </label>
              <select
                name="architecture"
                value={formData.architecture}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Sélectionner une architecture</option>
                <option value="Convolutional Neural Network">CNN</option>
                <option value="Recurrent Neural Network">RNN</option>
                <option value="Transformer">Transformer</option>
                <option value="Gradient Boosted Trees">Gradient Boosted Trees</option>
                <option value="Random Forest">Random Forest</option>
                <option value="Other">Autre</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Framework *
              </label>
              <select
                name="framework"
                value={formData.framework}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">Sélectionner un framework</option>
                <option value="TensorFlow">TensorFlow</option>
                <option value="PyTorch">PyTorch</option>
                <option value="Scikit-learn">Scikit-learn</option>
                <option value="XGBoost">XGBoost</option>
                <option value="Keras">Keras</option>
                <option value="Other">Autre</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Dataset *
              </label>
              <input
                type="text"
                name="dataset"
                value={formData.dataset}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Ex: 50,000 images"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Nombre de classes
              </label>
              <input
                type="number"
                name="classes"
                value={formData.classes}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Ex: 10"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Taille estimée
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                placeholder="Ex: 45.2 MB"
              />
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Uploader le modèle (optionnel)
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-gray-400" />
                  <p className="mb-2 text-xs text-gray-500">Glisser-déposer ou <span className="text-blue-600">choisir un fichier</span></p>
                  <p className="text-xs text-gray-500">Fichiers .h5, .pkl, .pt acceptés</p>
                </div>
                <input type="file" className="hidden" />
              </label>
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Créer le modèle
          </button>
        </div>
      </div>
    </div>
  );
};

const AIModelsAdmin = () => {
  const [models, setModels] = useState([
    {
      id: "phyto",
      name: "PhytoVigil CNN",
      version: "2.1",
      precision: 94.2,
      recall: 91.5,
      f1: 92.8,
      transactions: 125000,
      classes: 38,
      size: "45.2 MB",
      lastUpdate: "2025-07-25",
      status: "Actif",
      architecture: "Convolutional Neural Network",
      framework: "TensorFlow",
      dataset: "50,000 images",
      system: {
        operational: true,
        api: true,
        update: "2.2",
      },
    },
    {
      id: "fraud",
      name: "FraudShield XGBoost",
      version: "3.0",
      precision: 96.1,
      recall: 94.7,
      f1: 95.4,
      transactions: 310000,
      classes: 2,
      size: "120 MB",
      lastUpdate: "2025-06-12",
      status: "Actif",
      architecture: "Gradient Boosted Trees",
      framework: "XGBoost",
      dataset: "1,200,000 transactions",
      system: {
        operational: true,
        api: true,
        update: null,
      },
    },
  ]);

  const [activeModel, setActiveModel] = useState(models[0]);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);

  const stats = [
    {
      title: "Total Modèles",
      value: models.length,
      trend: "+1",
      trendUp: true,
      icon: <Brain className="w-5 h-5 text-blue-600" />,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Précision Moyenne",
      value: `${((models.reduce((sum, model) => sum + model.precision, 0) / models.length)).toFixed(1)}%`,
      trend: "+2.3%",
      trendUp: true,
      icon: <Activity className="w-5 h-5 text-green-600" />,
      color: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Transactions Traitées",
      value: (models.reduce((sum, model) => sum + model.transactions, 0) / 1000).toFixed(0) + "K",
      trend: "+15%",
      trendUp: true,
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  const handleViewModel = (model) => {
    setSelectedModel(model);
    setShowDetailModal(true);
  };

  const handleAddModel = (newModel) => {
    setModels(prev => [...prev, newModel]);
    setActiveModel(newModel);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 md:px-8 2xl:px-12 2xl:py-6">
      {/* Header */}
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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 mx-2">
        {stats.map((stat, idx) => (
          <KpiCard key={idx} {...stat} />
        ))}
      </div>

      {/* Tabs navigation */}
      <div className="bg-white rounded-lg px-4 py-2 mb-6 border border-gray-200 mx-2">
        <div className="flex space-x-4 overflow-x-auto pb-1">
          {models.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveModel(m)}
              className={`px-4 py-2 font-medium text-sm cursor-pointer border-b-2 transition whitespace-nowrap
                ${
                  activeModel.id === m.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {m.name} v{m.version}
            </button>
          ))}
        </div>
      </div>

      {/* Active Model Card */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200 mx-2">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-md font-semibold">
                {activeModel.name} v{activeModel.version}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Dernière MAJ : {activeModel.lastUpdate}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                activeModel.status === "Actif"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {activeModel.status}
            </span>
          </div>
        </div>

        <div className="p-4">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-green-600">
                {activeModel.precision}%
              </p>
              <p className="text-xs text-gray-500">Précision</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-blue-600">
                {activeModel.recall}%
              </p>
              <p className="text-xs text-gray-500">Recall</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-purple-600">
                {activeModel.f1}%
              </p>
              <p className="text-xs text-gray-500">F1-Score</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xl font-bold text-orange-600">
                {activeModel.transactions.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Transactions traitées</p>
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-sm">Détails techniques</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>
                  <span className="font-medium">Architecture :</span>{" "}
                  {activeModel.architecture}
                </li>
                <li>
                  <span className="font-medium">Framework :</span>{" "}
                  {activeModel.framework}
                </li>
                <li>
                  <span className="font-medium">Dataset :</span>{" "}
                  {activeModel.dataset}
                </li>
                <li>
                  <span className="font-medium">Classes :</span>{" "}
                  {activeModel.classes}
                </li>
                <li>
                  <span className="font-medium">Taille :</span>{" "}
                  {activeModel.size}
                </li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-sm">État du système</h4>
              <ul className="space-y-2 text-xs">
                {activeModel.system.operational && (
                  <li className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-4 h-4" /> Modèle opérationnel
                  </li>
                )}
                {activeModel.system.api && (
                  <li className="flex items-center gap-2 text-blue-600">
                    <Cloud className="w-4 h-4" /> API disponible
                  </li>
                )}
                {activeModel.system.update && (
                  <li className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="w-4 h-4" /> Mise à jour disponible (v{activeModel.system.update})
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
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

      {/* Model Detail Modal */}
      {showDetailModal && (
        <ModelDetailModal
          model={selectedModel}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedModel(null);
          }}
        />
      )}

      {/* Add Model Modal */}
      <AddModelModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddModel={handleAddModel}
      />
    </div>
  );
};

export default AIModelsAdmin;