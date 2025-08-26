import React, { useState } from "react";
import {
  Search,
  Eye,
  TrendingUp,
  Activity,
  Download,
  CreditCard,
  AlertTriangle,
  Shield,
  DollarSign,
  Calendar,
  MapPin,
  Clock,
  User,
  Building2,
  Smartphone,
  Globe,
  CheckCircle,
  XCircle,
  AlertCircle,
  X
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

const TransactionDetailModal = ({ transaction, onClose }) => {
  if (!transaction) return null;

  const getFraudRiskColor = (probability) => {
    if (probability >= 0.7) return "text-red-600 bg-red-50 border-red-200";
    if (probability >= 0.4) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-green-600 bg-green-50 border-green-200";
  };

  const getFraudRiskLabel = (probability) => {
    if (probability >= 0.7) return "Risque Élevé";
    if (probability >= 0.4) return "Risque Modéré";
    return "Risque Faible";
  };

  const getFraudRiskIcon = (probability) => {
    if (probability >= 0.7) return <XCircle className="w-4 h-4" />;
    if (probability >= 0.4) return <AlertCircle className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatTime = (hour, minute) => {
    const safeHour = hour !== undefined && hour !== null ? hour : 0;
    const safeMinute = minute !== undefined && minute !== null ? minute : 0;
    return `${safeHour.toString().padStart(2, '0')}:${safeMinute.toString().padStart(2, '0')}`;
  };

  const getDayName = (weekday) => {
    if (weekday === undefined || weekday === null) return 'Inconnu';
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[weekday] || 'Inconnu';
  };

  const getValue = (value, fallback = 'N/A') => {
    return value !== undefined && value !== null ? value : fallback;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
          <h2 className="text-sm font-semibold text-gray-800">Détails Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 space-y-3">
          {/* Fraud Risk Assessment */}
          <div className={`p-2 rounded-md border ${getFraudRiskColor(getValue(transaction.fraudProbability, 0))}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {getFraudRiskIcon(getValue(transaction.fraudProbability, 0))}
                <h3 className="text-xs font-semibold">Analyse Fraude</h3>
              </div>
              <span className="text-lg font-bold">{Math.round(getValue(transaction.fraudProbability, 0) * 100)}%</span>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">{getFraudRiskLabel(getValue(transaction.fraudProbability, 0))}</span>
              <span className="text-xs text-gray-500">Algo: {getValue(transaction.algorithm, 'Inconnu')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1 mb-2">
              <div 
                className={`h-1 rounded-full ${getValue(transaction.fraudProbability, 0) >= 0.7 ? 'bg-red-500' : 
                  getValue(transaction.fraudProbability, 0) >= 0.4 ? 'bg-orange-500' : 'bg-green-500'}`}
                style={{ width: `${getValue(transaction.fraudProbability, 0) * 100}%` }}
              ></div>
            </div>
            {transaction.fraudFactors && transaction.fraudFactors.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1">Facteurs risque:</p>
                <div className="grid grid-cols-2 gap-1">
                  {transaction.fraudFactors.map((factor, idx) => (
                    <div key={idx} className="text-xs flex items-start">
                      <span className="text-red-500 mr-1">•</span> 
                      <span className="truncate">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Grid Layout en 2 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Basic Information */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-800 border-b pb-1">Infos Base</h3>
              
              <div className="space-y-1">
                <div>
                  <p className="text-xs text-gray-500">Nom</p>
                  <p className="text-xs font-medium truncate">{getValue(transaction.firstName, '')} {getValue(transaction.lastName, '')}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Type</p>
                  <p className="text-xs font-medium capitalize">{getValue(transaction.type, 'Inconnu')}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Montant</p>
                  <p className="text-sm font-bold text-green-700">{formatCurrency(getValue(transaction.amt))}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Date/Heure</p>
                  <p className="text-xs font-medium">{getDayName(getValue(transaction.weekday))}</p>
                  <p className="text-xs font-medium">{formatTime(getValue(transaction.hour), getValue(transaction.minute))}</p>
                  <p className="text-xs text-gray-500">
                    {getValue(transaction.is_weekend) ? 'WE' : 'Sem'} • 
                    {getValue(transaction.is_night) ? 'Nuit' : 'Jour'}
                  </p>
                </div>
              </div>
            </div>

            {/* Balance Information */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-800 border-b pb-1">Soldes</h3>
              
              <div className="space-y-1">
                <div>
                  <p className="text-xs text-gray-500">Initial</p>
                  <p className="text-xs font-medium">{formatCurrency(getValue(transaction.oldbalanceOrg))}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Nouveau</p>
                  <p className="text-xs font-medium">{formatCurrency(getValue(transaction.newbalanceOrig))}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Variation</p>
                  <p className={`text-xs font-medium ${getValue(transaction.balance_delta_orig, 0) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatCurrency(getValue(transaction.balance_delta_orig))}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Transfert complet</p>
                  <p className="text-xs font-medium">{getValue(transaction.is_full_balance_transfer) ? 'Oui' : 'Non'}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Même exp/dest</p>
                  <p className="text-xs font-medium">{getValue(transaction.same_sender_receiver) ? 'Oui' : 'Non'}</p>
                </div>
              </div>
            </div>

            {/* Sender Statistics */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-800 border-b pb-1">Stats Expéditeur</h3>
              
              <div className="space-y-1">
                <div>
                  <p className="text-xs text-gray-500">Nb transactions</p>
                  <p className="text-xs font-medium">{getValue(transaction.orig_tx_count)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Total envoyé</p>
                  <p className="text-xs font-medium">{formatCurrency(getValue(transaction.orig_tx_sum))}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Moyenne</p>
                  <p className="text-xs font-medium">{formatCurrency(getValue(transaction.orig_tx_mean))}</p>
                </div>
              </div>
            </div>
              
            {/* Receiver Statistics */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-800 border-b pb-1">Stats Destinataire</h3>
              
              <div className="space-y-1">
                <div>
                  <p className="text-xs text-gray-500">Nb reçues</p>
                  <p className="text-xs font-medium">{getValue(transaction.dest_received_count)}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Total reçu</p>
                  <p className="text-xs font-medium">{formatCurrency(getValue(transaction.dest_received_sum))}</p>
                </div>
                
                <div>
                  <p className="text-xs text-gray-500">Moyenne reçue</p>
                  <p className="text-xs font-medium">{formatCurrency(getValue(transaction.dest_received_mean))}</p>
                </div>
              </div>
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



const Transactions = () => {
  const [transactions, setTransactions] = useState([
    {
      id: "TXN-2024-001",
      amount: 1250.00,
      currency: "MAD",
      date: "2024-08-20T14:30:00Z",
      status: "Completed",
      merchant: "Amazon Maroc",
      merchantCategory: "E-commerce",
      userName: "Mohammed Alami",
      userEmail: "m.alami@email.com",
      location: "Casablanca, Maroc",
      ipAddress: "196.200.12.45",
      device: "iPhone 15 Pro",
      browser: "Safari 17.0",
      fraudProbability: 0.15,
      algorithm: "Random Forest v2.1",
      fraudFactors: [],
      transactionFlow: [
        { name: "Initié", completed: true, time: "14:30:00" },
        { name: "Authentification", completed: true, time: "14:30:15" },
        { name: "Vérification", completed: true, time: "14:30:20" },
        { name: "Traitement", completed: true, time: "14:30:35" },
        { name: "Confirmé", completed: true, time: "14:30:40" }
      ]
    },
    {
      id: "TXN-2024-002",
      amount: 25000.00,
      currency: "MAD",
      date: "2024-08-20T11:15:00Z",
      status: "Pending",
      merchant: "Bijouterie Nejma",
      merchantCategory: "Bijouterie",
      userName: "Fatima Benali",
      userEmail: "f.benali@email.com",
      location: "Rabat, Maroc",
      ipAddress: "105.156.23.12",
      device: "Samsung Galaxy S24",
      browser: "Chrome 118.0",
      fraudProbability: 0.78,
      algorithm: "Neural Network v3.0",
      fraudFactors: ["Montant inhabituel", "Nouveau marchand", "Heure inhabituelle"],
      transactionFlow: [
        { name: "Initié", completed: true, time: "11:15:00" },
        { name: "Authentification", completed: true, time: "11:15:10" },
        { name: "Vérification", completed: false, time: "-" },
        { name: "Traitement", completed: false, time: "-" },
        { name: "Confirmé", completed: false, time: "-" }
      ]
    },
    {
      id: "TXN-2024-003",
      amount: 850.00,
      currency: "MAD",
      date: "2024-08-20T16:45:00Z",
      status: "Failed",
      merchant: "Station Total",
      merchantCategory: "Carburant",
      userName: "Youssef Tazi",
      userEmail: "y.tazi@email.com",
      location: "Marrakech, Maroc",
      ipAddress: "41.230.45.78",
      device: "MacBook Pro",
      browser: "Firefox 119.0",
      fraudProbability: 0.45,
      algorithm: "XGBoost v1.7",
      fraudFactors: ["Localisation inhabituelle"],
      transactionFlow: [
        { name: "Initié", completed: true, time: "16:45:00" },
        { name: "Authentification", completed: true, time: "16:45:08" },
        { name: "Vérification", completed: false, time: "-" },
        { name: "Traitement", completed: false, time: "-" },
        { name: "Confirmé", completed: false, time: "-" }
      ]
    },
    {
      id: "TXN-2024-004",
      amount: 3200.00,
      currency: "MAD",
      date: "2024-08-20T09:20:00Z",
      status: "Completed",
      merchant: "FNAC Maroc",
      merchantCategory: "Électronique",
      userName: "Aicha Zahra",
      userEmail: "a.zahra@email.com",
      location: "Casablanca, Maroc",
      ipAddress: "196.200.15.92",
      device: "iPad Air",
      browser: "Safari 17.0",
      fraudProbability: 0.23,
      algorithm: "Ensemble Model v2.3",
      fraudFactors: [],
      transactionFlow: [
        { name: "Initié", completed: true, time: "09:20:00" },
        { name: "Authentification", completed: true, time: "09:20:12" },
        { name: "Vérification", completed: true, time: "09:20:18" },
        { name: "Traitement", completed: true, time: "09:20:25" },
        { name: "Confirmé", completed: true, time: "09:20:28" }
      ]
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRisk, setFilterRisk] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Failed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Failed":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getRiskLevel = (probability) => {
    if (probability >= 0.7) return "High";
    if (probability >= 0.4) return "Medium";
    return "Low";
  };

  const getRiskColor = (probability) => {
    if (probability >= 0.7) return "bg-red-100 text-red-600";
    if (probability >= 0.4) return "bg-orange-100 text-orange-600";
    return "bg-green-100 text-green-600";
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" || transaction.status === filterStatus;
    const matchesRisk = filterRisk === "All" || getRiskLevel(transaction.fraudProbability) === filterRisk;
    return matchesSearch && matchesStatus && matchesRisk;
  });

  const stats = [
    {
      title: "Total Transactions",
      value: transactions.length,
      trend: "+12%",
      trendUp: true,
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Transactions Suspectes",
      value: transactions.filter((t) => t.fraudProbability >= 0.7).length,
      trend: "+5%",
      trendUp: false,
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      color: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      title: "Taux de Fraude",
      value: `${Math.round((transactions.filter(t => t.fraudProbability >= 0.7).length / transactions.length) * 100)}%`,
      trend: "-3%",
      trendUp: true,
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen p-4 md:p-6 md:px-8 2xl:px-12 2xl:py-6">
      {/* Header */}
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Transactions</h1>
          <p className="text-gray-600 text-sm mt-1">
            Surveillez et analysez toutes les transactions avec détection de fraude en temps réel
          </p>
        </div>
        <div>
          <Button size="sm" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 mt-3 mx-2 cursor-pointer">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 mx-2">
        {stats.map((stat, idx) => (
          <KpiCard key={idx} {...stat} />
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-3 mb-6 border border-gray-200 mx-2">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm mx-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Recherche par ID, utilisateur ou marchand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-[13px] cursor-pointer"
            >
              <option value="All">Tous les Statuts</option>
              <option value="Completed">Complété</option>
              <option value="Pending">En Attente</option>
              <option value="Failed">Échoué</option>
            </select>

            <select
              value={filterRisk}
              onChange={(e) => setFilterRisk(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-[13px] cursor-pointer"
            >
              <option value="All">Tous les Risques</option>
              <option value="Low">Risque Faible</option>
              <option value="Medium">Risque Modéré</option>
              <option value="High">Risque Élevé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-gray-200 mx-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Transaction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Utilisateur</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Montant</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Risque Fraude</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.id}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {transaction.merchant}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.userName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {transaction.userEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {transaction.amount.toLocaleString()} {transaction.currency}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.merchantCategory}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {getStatusIcon(transaction.status)}
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getRiskColor(transaction.fraudProbability)}`}>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {getRiskLevel(transaction.fraudProbability)}
                      </span>
                      <div className="text-xs text-gray-500">
                        {Math.round(transaction.fraudProbability * 100)}% de risque
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleViewTransaction(transaction)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-md cursor-pointer"
                      title="Voir les détails"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune transaction trouvée</h3>
            <p className="text-gray-500 text-sm">Essayez d'ajuster vos critères de recherche ou de filtre.</p>
          </div>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {showModal && (
        <TransactionDetailModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default Transactions;