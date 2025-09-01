import React, { useMemo, useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  CheckCircle,
  Clock,
  Database,
  Download,
  RefreshCw,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  XCircle,
  Search,
  Bell,
  Filter,
  ChevronDown,
  Calendar,
  Eye,
  MoreHorizontal
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// -----------------------
// Données simulées (pour le fallback)
// -----------------------
const TRANSACTION_TYPES = ["CASH_OUT", "TRANSFER", "CASH_IN", "DEBIT", "PAYMENT"];
const LABELS_FR = {
  CASH_OUT: "Retrait (CASH_OUT)",
  TRANSFER: "Virement (TRANSFER)",
  CASH_IN: "Dépôt (CASH_IN)",
  DEBIT: "Débit (DEBIT)",
  PAYMENT: "Paiement (PAYMENT)",
};

const CHANNELS = ["Web", "Mobile", "Agence"];

// Génère 520 transactions sur 45 jours
const MOCK_TX = Array.from({ length: 520 }, (_, i) => {
  const type = TRANSACTION_TYPES[i % 5];
  const amount = Math.floor(50 + Math.random() * 10000);
  const isFraud = Math.random() < (type === "TRANSFER" ? 0.08 : type === "CASH_OUT" ? 0.06 : 0.03);
  const status = isFraud ? "Fraude" : "Légitime";
  const risk = isFraud ? Math.floor(75 + Math.random() * 25) : Math.floor(1 + Math.random() * 70);
  const createdAt = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 45); // 45 derniers jours
  return {
    id: `TX-${100000 + i}`,
    user: `user_${(i % 38) + 1}`,
    type,
    amount,
    currency: "MAD",
    isFraud,
    status,
    risk,
    createdAt,
    channel: CHANNELS[i % 3],
  };
});

// Métriques par défaut (fallback)
const DEFAULT_MODEL_METRICS = {
  n_models: 3,
  avg_accuracy: 93.2,
  avg_precision: 87.5,
  avg_recall: 91.3,
  avg_f1_score: 89.1,
  updatedAt: new Date().toLocaleString("fr-FR"),
  version: "v2.1.0"
};

// -----------------------
// Utilitaires
// -----------------------
function formatNumber(n) {
  return (n ?? 0).toLocaleString("fr-FR");
}

function exportCSV(rows) {
  if (!rows || rows.length === 0) return;
  const replacer = (v) => (typeof v === "string" && v.includes(",")) ? `"${v.replace(/"/g, '""')}"` : v;
  const header = Object.keys(rows[0] ?? {}).join(",");
  const csv = [
    header,
    ...rows.map((r) => Object.values(r).map(replacer).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions_${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

const COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
];

// -----------------------
// Composant principal
// -----------------------
export default function ProfessionalDashboard() {
  const [timeRange, setTimeRange] = useState("week");
  const [apiData, setApiData] = useState(null);
  const [mlModelsData, setMlModelsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mlModelsLoading, setMlModelsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mlModelsError, setMlModelsError] = useState(null);

  // Appel à l'API pour récupérer les statistiques des transactions
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/transactions/stats/yearly");
        setApiData(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Impossible de charger les données. Affichage des données de démonstration.");
        // On continue avec les données simulées en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Appel à l'API pour récupérer les statistiques des modèles ML
  useEffect(() => {
    const fetchMlModelsStats = async () => {
      try {
        setMlModelsLoading(true);
        const response = await axiosClient.get("/ml-models/stats");
        setMlModelsData(response.data);
        setMlModelsError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des statistiques ML:", err);
        setMlModelsError("Impossible de charger les statistiques des modèles ML. Utilisation des données par défaut.");
        // On utilise les données par défaut en cas d'erreur
      } finally {
        setMlModelsLoading(false);
      }
    };

    fetchMlModelsStats();
  }, []);

  // Filtrage par date uniquement (utilise MOCK_TX pour la démo)
  const filtered = useMemo(() => {
    const cutoffDays = { today: 1, week: 7, month: 30, all: 365 }[timeRange] || 7;
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - cutoffDays);

    return MOCK_TX.filter((t) => {
      return timeRange === "all" ? true : t.createdAt >= minDate;
    });
  }, [timeRange]);

  // KPIs - Utilise les données de l'API si disponibles
  const totals = useMemo(() => {
    if (apiData) {
      return {
        total: apiData.total_transactions.value,
        fraud: apiData.fraud_transactions.value,
        legit: apiData.nonfraud_transactions.value,
        fraudRate: apiData.fraud_rate.value,
        avgAmount: 0, // Non fourni par l'API
        sumAmount: 0, // Non fourni par l'API
        sumFraudAmount: 0, // Non fourni par l'API
      };
    }

    // Fallback aux données simulées si l'API n'est pas disponible
    const total = filtered.length;
    const fraud = filtered.filter((t) => t.isFraud).length;
    const sumAmount = filtered.reduce((s, t) => s + t.amount, 0);
    const sumFraudAmount = filtered.filter((t) => t.isFraud).reduce((s, t) => s + t.amount, 0);
    return {
      total,
      fraud,
      legit: total - fraud,
      fraudRate: total ? parseFloat(((100 * fraud) / total).toFixed(1)) : 0,
      avgAmount: total ? Math.round(sumAmount / total) : 0,
      sumAmount,
      sumFraudAmount,
    };
  }, [filtered, apiData]);

  // Fraudes par type - Utilise les données de l'API si disponibles
  const byType = useMemo(() => {
    if (apiData) {
      return apiData.fraud_by_type.map((item) => ({
        type: item.type,
        total: item.total,
        fraud: item.fraud,
        rate: item.fraud_rate,
      }));
    }

    // Fallback aux données simulées
    return TRANSACTION_TYPES.map((tp) => {
      const arr = filtered.filter((t) => t.type === tp);
      const total = arr.length;
      const fraud = arr.filter((t) => t.isFraud).length;
      return {
        type: tp,
        total,
        fraud,
        rate: total ? parseFloat(((100 * fraud) / total).toFixed(1)) : 0,
      };
    });
  }, [filtered, apiData]);

  // Distribution des montants - Utilise les données de l'API si disponibles
  const amountHist = useMemo(() => {
    if (apiData) {
      return apiData.amount_distribution.map((item) => ({
        bucket: item.range,
        total: item.total,
        fraud: item.fraud,
      }));
    }

    // Fallback aux données simulées
    const bins = [0, 100, 250, 500, 1000, 2500, 5000, 10000, 20000];
    const counters = bins.slice(0, -1).map((b, i) => ({
      bucket: `${bins[i]}-${bins[i + 1]}`,
      total: 0,
      fraud: 0,
    }));
    filtered.forEach((t) => {
      const idx = bins.findIndex((b) => t.amount <= b) - 1;
      const bi = idx >= 0 ? idx : bins.length - 2;
      counters[bi].total += 1;
      if (t.isFraud) counters[bi].fraud += 1;
    });
    return counters;
  }, [filtered, apiData]);

  // Métriques des modèles ML - Utilise les données de l'API si disponibles
  const modelMetrics = useMemo(() => {
    if (mlModelsData) {
      return {
        n_models: mlModelsData.n_models || 0,
        accuracy: (mlModelsData.avg_accuracy || 0) * 100,
        precision: (mlModelsData.avg_precision || 0) * 100,
        recall: (mlModelsData.avg_recall || 0) * 100,
        f1: (mlModelsData.avg_f1_score || 0) * 100,
        updatedAt: new Date().toLocaleString("fr-FR"),
        version: "v2.1.0"
      };
    }

    return DEFAULT_MODEL_METRICS;
  }, [mlModelsData]);

  const trendDaily = useMemo(() => {
    const days = [...Array(14).keys()].reverse().map((i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayTx = MOCK_TX.filter((t) => t.createdAt.toISOString().slice(0, 10) === key);
      const total = dayTx.length;
      const fraud = dayTx.filter((t) => t.isFraud).length;
      const fraudAmount = dayTx.filter((t) => t.isFraud).reduce((s, t) => s + t.amount, 0);
      return { day: key, total, fraud, fraudAmount };
    });
    return days;
  }, []);

  // Top utilisateurs suspects
  const topUsers = useMemo(() => {
    const agg = {};
    filtered.forEach((t) => {
      if (!agg[t.user]) agg[t.user] = { user: t.user, total: 0, fraud: 0, riskSum: 0 };
      agg[t.user].total += 1;
      agg[t.user].riskSum += t.risk;
      if (t.isFraud) agg[t.user].fraud += 1;
    });
    return Object.values(agg)
      .filter((u) => u.total >= 5)
      .map((u) => ({ ...u, rate: (100 * u.fraud) / u.total, riskAvg: u.riskSum / u.total }))
      .sort((a, b) => b.rate - a.rate || b.riskAvg - a.riskAvg)
      .slice(0, 5);
  }, [filtered]);

  // Top transactions risquées
  const topRiskTx = useMemo(() => [...filtered].sort((a, b) => b.risk - a.risk || b.amount - a.amount).slice(0, 10), [filtered]);

  return (
    <div className="min-h-screen">
      {/* Indicateur de chargement */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-gray-600">Chargement des données...</p>
          </div>
        </div>
      )}

      {/* Message d'erreur */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-4 mx-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Message d'erreur pour les modèles ML */}
      {mlModelsError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md mb-4 mx-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>{mlModelsError}</span>
          </div>
        </div>
      )}

      <main className="p-4 md:p-6 md:px-8 2xl:px-12 2xl:py-6">
        {/* Header avec titre et contrôles */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Tableau de bord</h2>
            <p className="text-gray-600 text-[13px]">Détection des transactions frauduleuses en temps réel</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onClick={() => exportCSV(filtered)}
            >
              <Download className="w-4 h-4" />
              Exporter
            </Button>
            {/* <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="today">Aujourd'hui</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="all">Tout</option>
              </select>
            </div> */}
          </div>
        </div>

        {/* KPIs principaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <KpiCard
            icon={<Database className="w-5 h-5" />}
            title="Transactions"
            value={formatNumber(totals.total)}
            trend="+12%"
            color="text-blue-600"
            trendUp={true}
            iconBg="bg-blue-100 text-blue-600"
          />
          <KpiCard
            icon={<CheckCircle className="w-5 h-5" />}
            title="Légitimes"
            value={formatNumber(totals.legit)}
            trend="+8%"
            color="text-green-600"
            trendUp={true}
            iconBg="bg-green-100 text-green-600"
          />
          <KpiCard
            icon={<XCircle className="w-5 h-5" />}
            title="Frauduleuses"
            value={formatNumber(totals.fraud)}
            trend="-3%"
            trendUp={false}
            color="text-red-600"
            iconBg="bg-red-100 text-red-600"
          />
          <KpiCard
            icon={<AlertTriangle className="w-5 h-5" />}
            title="Taux de fraude"
            value={`${totals.fraudRate.toFixed(1)}%`}
            trend="-2%"
            trendUp={false}
            color="text-amber-600"
            iconBg="bg-amber-100 text-amber-600"
          />
        </div>

        {/* Graphiques principaux */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Tendance des fraudes
                  </CardTitle>
                  <CardDescription>Évolution sur 14 jours</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                  En temps réel
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendDaily} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="total"
                      name="Total"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="#6366f1"
                      fillOpacity={0.1}
                    />
                    <Area
                      type="monotone"
                      dataKey="fraud"
                      name="Fraudes"
                      stroke="#ef4444"
                      strokeWidth={2}
                      fill="#ef4444"
                      fillOpacity={0.1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="w-4 h-4 text-purple-600" />
                Santé du modèle IA
              </CardTitle>
              <CardDescription>Métriques en temps réel</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-4">
                <MetricProgress label="Exactitude" value={modelMetrics.accuracy} color="indigo" />
                <MetricProgress label="Précision" value={modelMetrics.precision} color="green" />
                <MetricProgress label="Rappel" value={modelMetrics.recall} color="amber" />
                <MetricProgress label="F1-Score" value={modelMetrics.f1} color="purple" />

                <Separator className="my-2" />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Nombre de modèles</span>
                  <span className="font-medium">{modelMetrics.n_models}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Dernière MAJ</span>
                  <span className="font-medium">{modelMetrics.updatedAt}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-500">Modèle actif - {modelMetrics.version}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Répartition des fraudes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                Fraudes par type
              </CardTitle>
              <CardDescription>Répartition des incidents détectés</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byType.map((d) => ({ name: LABELS_FR[d.type] || d.type, value: d.fraud }))}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      innerRadius={40}
                    >
                      {byType.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4 text-purple-600" />
                Statistiques détaillées
              </CardTitle>
              <CardDescription>Analyse des fraudes par type</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                {byType.map((type, idx) => (
                  <div key={type.type} className="flex items-center justify-between p-2 rounded bg-gray-50">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-800 text-sm">
                          {LABELS_FR[type.type] || type.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {type.total} transactions
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-sm">{type.fraud}</p>
                      <p className="text-xs text-gray-500">{type.rate.toFixed(1)}% de fraude</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Distribution des montants */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Distribution des montants
            </CardTitle>
            <CardDescription>Analyse par tranche de montant</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={amountHist} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                  <XAxis
                    dataKey="bucket"
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="total"
                    name="Total"
                    fill="#6366f1"
                    radius={[2, 2, 0, 0]}
                    opacity={0.8}
                  />
                  <Bar
                    dataKey="fraud"
                    name="Fraudes"
                    fill="#ef4444"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tables de données */}
        <div className="grid grid-cols-1 gap-5 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="w-4 h-4 text-orange-600" />
                    Utilisateurs à risque
                  </CardTitle>
                  <CardDescription>Top 5 par taux de fraude</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <Th>Utilisateur</Th>
                      <Th>Transactions</Th>
                      <Th>Fraudes</Th>
                      <Th>Taux</Th>
                      <Th>Risque</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topUsers.map((u, idx) => (
                      <tr key={u.user} className="hover:bg-gray-50">
                        <Td>
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white ${idx === 0 ? 'bg-red-500' : idx === 1 ? 'bg-orange-500' : idx === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}>
                              {idx + 1}
                            </div>
                            <span className="font-medium">{u.user}</span>
                          </div>
                        </Td>
                        <Td>{u.total}</Td>
                        <Td className="text-red-600 font-medium">{u.fraud}</Td>
                        <Td>
                          <Badge variant={u.rate > 50 ? "destructive" : u.rate > 20 ? "secondary" : "outline"} className="text-xs">
                            {u.rate.toFixed(1)}%
                          </Badge>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-1">
                            <div className="w-10 bg-gray-200 rounded-full h-1.5">
                              <div
                                className={`h-1.5 rounded-full ${u.riskAvg > 70 ? 'bg-red-500' : u.riskAvg > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(u.riskAvg, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs">{u.riskAvg.toFixed(0)}%</span>
                          </div>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Transactions critiques
                  </CardTitle>
                  <CardDescription>Transactions à risque élevé</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <Th className="w-32">ID</Th>
                      <Th className="w-32">Utilisateur</Th>
                      <Th className="w-40">Montant</Th>
                      <Th className="w-28">Risque</Th>
                      <Th className="w-28">Action</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {topRiskTx.slice(0, 10).map((t) => (
                      <tr key={t.id} className="hover:bg-gray-50 transition">
                        <Td>
                          <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">
                            {t.id}
                          </code>
                        </Td>
                        <Td className="font-medium">{t.user}</Td>
                        <Td>
                          <span className="font-semibold">{formatNumber(t.amount)}</span>
                          <span className="text-gray-500 ml-1 text-xs">{t.currency}</span>
                        </Td>
                        <Td>
                          <Badge
                            variant={t.risk >= 80 ? "destructive" : t.risk >= 60 ? "secondary" : "outline"}
                            className="text-xs font-mono"
                          >
                            {t.risk}%
                          </Badge>
                        </Td>
                        <Td>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Détails
                          </Button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span>© {new Date().getFullYear()} FraudGuard - Système de détection de fraude</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>Dernière synchronisation: il y a 2 min</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Système opérationnel</span>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// -----------------------
// Composants UI
// -----------------------
function KpiCard({
  icon,
  title,
  value,
  trend,
  trendUp,
  color,
  iconBg = "bg-gray-100",
}) {
  return (
    <Card
      className={`rounded-2xl border border-gray-100 shadow-sm bg-white }`}
    >
      <CardContent className="flex px-6 items-start">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${iconBg} mr-5`}>{icon}</div>
          <div>
            <p className="text-[15px] font-semibold text-gray-500">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-md font-semibold mt-2
                ${trendUp ? 'text-green-600' : 'text-red-600 '}`}>
                <TrendingUp className={`w-3 h-3 ${!trendUp ? 'rotate-180' : ''}`} />
                {trend}
              </div>)}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricProgress({ label, value, color }) {
  const colorMap = {
    indigo: { bg: 'bg-indigo-500', light: 'bg-indigo-100' },
    green: { bg: 'bg-green-500', light: 'bg-green-100' },
    amber: { bg: 'bg-amber-500', light: 'bg-amber-100' },
    purple: { bg: 'bg-purple-500', light: 'bg-purple-100' },
  };

  const colors = colorMap[color] || colorMap.indigo;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="font-bold">{value ? value.toFixed(1) : '0.0'}%</span>
      </div>
      <div className={`w-full ${colors.light} rounded-full h-1.5 overflow-hidden`}>
        <div
          className={`h-1.5 ${colors.bg} rounded-full`}
          style={{ width: `${value || 0}%` }}
        ></div>
      </div>
    </div>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return (
    <td className={`px-4 py-2 whitespace-nowrap text-sm ${className}`}>
      {children}
    </td>
  );
}