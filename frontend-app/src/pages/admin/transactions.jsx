import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  TrendingUp,
  Download,
  CreditCard,
  AlertTriangle,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  DollarSign,
  User,
  UserCheck,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosClient from "../../api/axiosClient";

function KpiCard({ icon, title, value, trend, trendUp, color, iconBg = "bg-gray-100" }) {
  return (
    <Card className="rounded-xl bg-white shadow-xs">
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

  const getFraudRiskLabel = (probability) => {
    if (probability >= 0.7) return "Risque élevé";
    if (probability >= 0.4) return "Risque modéré";
    return "Risque faible";
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "N/A";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(value);
  };

  const getDayName = (weekday) => {
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    return weekday !== undefined && weekday !== null ? days[weekday] : "Inconnu";
  };

  const getValue = (value, fallback = "N/A") =>
    value !== undefined && value !== null ? value : fallback;

  const getInfluenceFactorColor = (value) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.5) return value > 0 ? 'text-red-600' : 'text-green-600';
    if (absValue >= 0.2) return value > 0 ? 'text-orange-600' : 'text-blue-600';
    return 'text-gray-700';
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-800">Détails de la transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-sm text-gray-700">
          {/* Fraud Risk */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">Analyse de fraude</span>
              <span className="text-gray-600">
                {Math.round(getValue(transaction.probability, 0) * 100)}% —{" "}
                {getFraudRiskLabel(getValue(transaction.probability, 0))}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 bg-blue-500 rounded-full"
                style={{ width: `${getValue(transaction.probability, 0) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500">
                Modéle utilisé :{" "}
                <span className="font-medium text-gray-800">{getValue(transaction.model.name)}</span>
              </p>
              <p className="text-xs text-gray-500">
                Algorithme utilisé :{" "}
                <span className="font-medium text-gray-800">{getValue(transaction.model.algorithm)}</span>
              </p>
            </div>
          </div>

          {/* Facteurs d'influence */}
          {transaction.influencing_factors && (
            <div>
              <p className="font-medium text-gray-800 mb-2">Facteurs d'influence principaux :</p>
              <ul className="divide-y divide-gray-100 border border-gray-100 rounded-md">
                {Object.entries(transaction.influencing_factors)
                  .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                  .slice(0, 3)
                  .map(([key, value], idx) => (
                    <li key={idx} className={`flex justify-between items-center px-3 py-2`}>
                      <span>{key}</span>
                      <span className={`text-sm font-medium ${getInfluenceFactorColor(value)} `}>{value.toFixed(3)}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Infos principales en 2 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colonne gauche → infos transaction */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800 border-b pb-1">Informations de la transaction</h3>
              <p><span className="text-gray-500">Type :</span> {getValue(transaction.type)}</p>
              <p><span className="text-gray-500">Montant :</span> {formatCurrency(getValue(transaction.amt))}</p>
              <p><span className="text-gray-500">Jour :</span> {getDayName(getValue(transaction.weekday))}</p>
              <p><span className="text-gray-500">Heure :</span> {getValue(transaction.hour)}h</p>
              <p><span className="text-gray-500">Solde expéditeur :</span> {formatCurrency(getValue(transaction.oldbalanceOrg))}</p>
              <p><span className="text-gray-500">Nouveau solde expéditeur :</span> {formatCurrency(getValue(transaction.newbalanceOrig))}</p>
              <p><span className="text-gray-500">Solde destinataire :</span> {formatCurrency(getValue(transaction.oldbalanceDest))}</p>
              <p><span className="text-gray-500">Nouveau solde destinataire :</span> {formatCurrency(getValue(transaction.newbalanceDest))}</p>
            </div>

            {/* Colonne droite → expéditeur et destinataire */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-800 border-b pb-1">Informations de l'expéditeur</h3>
              <p><span className="text-gray-500">Expéditeur :</span> {getValue(transaction.nameOrig)}</p>
              {transaction.user && (
                <>
                  <p><span className="text-gray-500">Utilisateur :</span> {getValue(transaction.user.username)}</p>
                  <p><span className="text-gray-500">Email :</span> {getValue(transaction.user.email)}</p>
                </>
              )}

              <h3 className="font-medium text-gray-800 border-b pb-1 mt-4">Informations du destinataire</h3>
              <p><span className="text-gray-500">Destinataire :</span> {getValue(transaction.nameDest)}</p>
              <p>
                <span className="text-gray-500">Fraude confirmée :</span>{" "}
                {getValue(transaction.isFraud, false) ? (
                  <span className="text-red-600 font-medium">Oui</span>
                ) : (
                  <span className="text-green-600 font-medium">Non</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 py-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border rounded-md hover:bg-gray-50"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    total_transactions: { current: 0, previous: 0, evolution_percent: 0 },
    suspect_transactions: { current: 0, previous: 0, evolution_percent: 0 },
    fraud_rate: { current: 0, previous: 0, evolution_percent: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterRisk, setFilterRisk] = useState("All");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Fonction pour générer les numéros de page à afficher
  const getPageNumbers = (currentPage, totalPages) => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Si le nombre total de pages est inférieur ou égal au maximum visible, afficher toutes les pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);

      // Déterminer quelles pages afficher au milieu
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      // Ajuster si on est près du début
      if (currentPage <= 3) {
        endPage = 4;
      }

      // Ajuster si on est près de la fin
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Ajouter les points de suspension si nécessaire
      if (startPage > 2) {
        pages.push('ellipsis-left');
      }

      // Ajouter les pages du milieu
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Ajouter les points de suspension si nécessaire
      if (endPage < totalPages - 1) {
        pages.push('ellipsis-right');
      }

      // Toujours afficher la dernière page
      pages.push(totalPages);
    }

    return pages;
  };

  const fetchTransactions = useCallback(async () => {
  try {
    setLoading(true);
    const params = {
      page: currentPage
    };

    if (filterStatus !== "All") {
      params.status = filterStatus; // "accepted", "rejected", "completed", "failed"
    }

    if (filterRisk !== "All") {
      params.risk = filterRisk;
    }

    if (searchTerm) {
      params.search = searchTerm;
    }

    const response = await axiosClient.get("/transactions", { params });
    console.log("Transactions récupérées:", response.data);

    setTransactions(response.data.transactions || []);
    setTotalPages(response.data.pages); // 👈 déjà calculé côté backend
  } catch (error) {
    console.error("Erreur lors de la récupération des transactions:", error);
    setTransactions([]);
  } finally {
    setLoading(false);
  }
}, [currentPage, filterStatus, filterRisk, searchTerm]);

  // Fonction pour récupérer les statistiques
  const fetchStats = useCallback(async () => {
    try {
      const params = {};

      // Ajouter les mêmes filtres aux statistiques pour cohérence
      if (filterStatus !== "All") {
        params.status = filterStatus;
      }

      if (filterRisk !== "All") {
        params.risk = filterRisk;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await axiosClient.get("/transactions/stats", { params });
      console.log("Statistiques récupérées:", response.data);
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    }
  }, [filterStatus, filterRisk, searchTerm]);

  // Effet pour charger les données initiales
  useEffect(() => {
    fetchStats();
    fetchTransactions();
  }, [fetchStats, fetchTransactions]);

  // Fonction de recherche avec debounce
  const handleSearchChange = (value) => {
    setSearchTerm(value);

    // Clear le timer précédent
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Déclencher la recherche après 500ms d'inactivité
    setDebounceTimer(setTimeout(() => {
      setCurrentPage(1); // Reset à la première page pour une nouvelle recherche
      fetchStats();
      fetchTransactions();
    }, 500));
  };

  // Fonction pour changer le filtre de statut
  const handleStatusFilterChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1); // Reset à la première page pour un nouveau filtre
  };

  // Fonction pour changer le filtre de risque
  const handleRiskFilterChange = (value) => {
    setFilterRisk(value);
    setCurrentPage(1); // Reset à la première page pour un nouveau filtre
  };

  // Nettoyer le timer à la destruction du composant
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // Nouvelle fonction pour déterminer le statut basé sur isFraud
  const getStatusFromFraud = (isFraud) => {
    return isFraud ? "rejected" : "accepted";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "accepted": return "Accepté";
      case "rejected": return "Rejeté";
      default: return "Inconnu";
    }
  };

  // Fonction améliorée pour obtenir la couleur selon le type de transaction
  const getTypeColor = (type) => {
    switch (type) {
      case "PAYEMENT":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "TRANSFER":
        return "bg-purple-100 text-purple-800 border border-purple-200";
      case "CASH_OUT":
        return "bg-orange-100 text-orange-800 border border-orange-200";
      case "CASH_IN":
        return "bg-green-100 text-green-800 border border-green-200";
      case "DEBIT":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };


  // Fonction pour obtenir le libellé du type de transaction
  const getTypeLabel = (type) => {
    switch (type) {
      case "PAYEMENT": return "Paiement";
      case "TRANSFER": return "Virement";
      case "CASH_OUT": return "Retrait";
      case "CASH_IN": return "Dépôt";
      case "DEBIT": return "Débit";
      default: return type;
    }
  };

  const getRiskLevel = (probability) => {
    if (probability >= 0.7) return "élevé";
    if (probability >= 0.4) return "modéré";
    return "faible";
  };

  const getRiskColor = (probability) => {
    if (probability >= 0.7) return "bg-red-100 text-red-600 border border-red-200";
    if (probability >= 0.4) return "bg-orange-100 text-orange-600 border border-orange-200";
    return "bg-green-100 text-green-600 border border-green-200";
  };

  const getRiskLabel = (risk) => {
    switch (risk) {
      case "élevé": return "Élevé";
      case "modéré": return "Modéré";
      case "faible": return "Faible";
      default: return risk;
    }
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleExport = async () => {
    try {
      const params = {};

      // Ajouter les filtres actuels à l'export
      if (filterStatus !== "All") {
        params.status = filterStatus;
      }

      if (filterRisk !== "All") {
        params.risk = filterRisk;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await axiosClient.get("/transactions/export", {
        responseType: 'blob',
        params
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'transactions.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erreur lors de l'export:", error);
    }
  };

  const kpiStats = [
    {
      title: "Total Transactions",
      value: stats.total_transactions?.current || 0,
      trend: `${stats.total_transactions?.evolution_percent > 0 ? '+' : ''}${Math.round(stats.total_transactions?.evolution_percent || 0)}%`,
      trendUp: (stats.total_transactions?.evolution_percent || 0) >= 0,
      icon: <CreditCard className="w-5 h-5 text-blue-600" />,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Transactions Suspectes",
      value: stats.suspect_transactions?.current || 0,
      trend: `${stats.suspect_transactions?.evolution_percent > 0 ? '+' : ''}${Math.round(stats.suspect_transactions?.evolution_percent || 0)}%`,
      trendUp: (stats.suspect_transactions?.evolution_percent || 0) < 0,
      icon: <AlertTriangle className="w-5 h-5 text-red-600" />,
      color: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      title: "Taux de Fraude",
      value: `${Math.round(stats.fraud_rate?.current || 0)}%`,
      trend: `${stats.fraud_rate?.evolution_percent > 0 ? '+' : ''}${Math.round(stats.fraud_rate?.evolution_percent || 0)}%`,
      trendUp: (stats.fraud_rate?.evolution_percent || 0) < 0,
      icon: <Shield className="w-5 h-5 text-purple-600" />,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 md:px-8 2xl:px-12 2xl:py-6">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des Transactions</h1>
          <p className="text-gray-600 text-sm mt-1">
            Surveillez et analysez toutes les transactions avec détection de fraude en temps réel
          </p>
        </div>
        <Button
          onClick={handleExport}
          size="sm"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Exporter
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {kpiStats.map((stat, idx) => (
          <KpiCard key={idx} {...stat} />
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Recherche par ID, expéditeur, destinataire ou utilisateur..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <select
                value={filterStatus}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="pl-8 pr-8 py-2 border border-gray-300 rounded-md text-[13px] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">Tous les Statuts</option>
                <option value="accepted">Accepté</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>

            <div className="relative">
              <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
              <select
                value={filterRisk}
                onChange={(e) => handleRiskFilterChange(e.target.value)}
                className="pl-8 pr-8 py-2 border border-gray-300 rounded-md text-[13px] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="All">Tous les Risques</option>
                <option value="faible">Risque Faible</option>
                <option value="modéré">Risque Modéré</option>
                <option value="élevé">Risque Élevé</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-xs overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Expéditeur</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Destinataire</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Risque Fraude</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-gray-500 mt-2">Chargement des transactions...</p>
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((transaction) => {
                  const status = getStatusFromFraud(transaction.isFraud);
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="text-[13px] font-medium text-gray-900">
                          #{transaction.id}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div>
                          <div className="text-[14px] font-medium text-gray-900 ">
                            {transaction.nameOrig}
                          </div>
                          {transaction.user && (
                            <div className="text-xs text-gray-500">
                              {transaction.user.username}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="text-[14px] font-medium text-gray-900">
                          {transaction.nameDest}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="text-[13px] font-semibold text-gray-900">
                          {transaction.amt?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                          {getTypeLabel(transaction.type)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          {getStatusLabel(status)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(transaction.probability)}`}>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {getRiskLabel(getRiskLevel(transaction.probability))}
                          </span>
                          <div className="text-xs text-gray-500">
                            {Math.round(transaction.probability * 100)}% de risque
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewTransaction(transaction)}
                          className="inline-flex items-center p-2 text-blue-600 hover:bg-blue-50 rounded-md cursor-pointer transition-colors"
                          title="Voir les détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Aucune transaction trouvée</h3>
                    <p className="text-gray-500 text-sm">Essayez d'ajuster vos critères de recherche ou de filtre.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination améliorée */}
        {!loading && totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-center border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md ${currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 cursor-pointer'}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {getPageNumbers(currentPage, totalPages).map((page, index) => {
                if (page === 'ellipsis-left' || page === 'ellipsis-right') {
                  return (
                    <span key={index} className="px-2 py-1 text-gray-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </span>
                  );
                }

                return (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`min-w-[2rem] px-2 py-1 rounded-md text-sm ${currentPage === page
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100 cursor-pointer'}`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md ${currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 cursor-pointer'}`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
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