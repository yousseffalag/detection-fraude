import React, { useMemo, useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  Database,
  Download,
  RefreshCw,
  TrendingUp,
  XCircle,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Eye,
  MoreHorizontal,
  CreditCard,
  Wallet
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
// Données simulées (pour l'évolution des transactions et dernières transactions)
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

// Génère 120 transactions pour l'utilisateur
const MOCK_USER_TX = Array.from({ length: 120 }, (_, i) => {
  const type = TRANSACTION_TYPES[i % 5];
  const amount = Math.floor(50 + Math.random() * 5000);
  const isFraud = Math.random() < (type === "TRANSFER" ? 0.03 : type === "CASH_OUT" ? 0.02 : 0.01);
  const status = isFraud ? "Frauduleuse" : "Légitime";
  const risk = isFraud ? Math.floor(75 + Math.random() * 25) : Math.floor(1 + Math.random() * 30);
  const createdAt = new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 45); // 45 derniers jours
  return {
    id: `TX-${100000 + i}`,
    user: `user_123`, // ID utilisateur fixe pour la démo
    type,
    amount,
    currency: "MAD",
    isFraud,
    status,
    risk,
    createdAt,
    channel: CHANNELS[i % 3],
    recipient: i % 3 === 0 ? `Compte ${Math.floor(Math.random() * 1000)}` : `Marchand ${Math.floor(Math.random() * 100)}`,
  };
});

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
  a.download = `mes_transactions_${Date.now()}.csv`;
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
export default function UserDashboard() {
  const [timeRange, setTimeRange] = useState("month");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Appel à l'API pour récupérer les statistiques des transactions utilisateur
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/transactions/user/stats");
        setApiData(response.data);
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des données:", err);
        setError("Impossible de charger vos données. Affichage des données de démonstration.");
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Filtrage par date (pour les données simulées)
  const filtered = useMemo(() => {
    const cutoffDays = { week: 7, month: 30, quarter: 90, year: 365 }[timeRange] || 30;
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - cutoffDays);

    return MOCK_USER_TX.filter((t) => {
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
        trends: {
          total: apiData.total_transactions.change_percent,
          fraud: apiData.fraud_transactions.change_percent,
          legit: apiData.nonfraud_transactions.change_percent,
          fraudRate: apiData.fraud_rate.change_percent,
        }
      };
    }

    // Fallback aux données simulées si l'API n'est pas disponible
    const total = filtered.length;
    const fraud = filtered.filter((t) => t.isFraud).length;
    return {
      total,
      fraud,
      legit: total - fraud,
      fraudRate: total ? parseFloat(((100 * fraud) / total).toFixed(1)) : 0,
      trends: {
        total: 12,
        fraud: -3,
        legit: 8,
        fraudRate: -2,
      }
    };
  }, [filtered, apiData]);

  // Fraudes par type - Utilise les données de l'API si disponibles
  const byType = useMemo(() => {
    if (apiData) {
      return apiData.fraud_by_type;
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
      return apiData.amount_distribution.map(item => ({
        bucket: item.range,
        total: item.total,
        fraud: item.fraud
      }));
    }

    // Fallback aux données simulées
    const bins = [0, 100, 250, 500, 1000, 2500, 5000, 10000];
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

  // Évolution quotidienne (données simulées uniquement)
  const trendDaily = useMemo(() => {
    const days = [...Array(14).keys()].reverse().map((i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayTx = filtered.filter((t) => t.createdAt.toISOString().slice(0, 10) === key);
      const total = dayTx.length;
      const fraud = dayTx.filter((t) => t.isFraud).length;
      return { day: key, total, fraud };
    });
    return days;
  }, [filtered]);

  // 5 dernières transactions (données simulées uniquement)
  const lastTransactions = useMemo(() => 
    [...filtered]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5),
    [filtered]
  );

  return (
    <div className="min-h-screen">
      {/* Indicateur de chargement */}
      {loading && (
        <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-2" />
            <p className="text-gray-600">Chargement de vos données...</p>
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

      <main className="p-4 md:p-6 md:px-8 2xl:px-12 2xl:py-6">
        {/* Header avec titre et contrôles */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Tableau de bord</h2>
            <p className="text-gray-600 text-[13px]">Vue d'ensemble de votre activité</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              className="flex items-center gap-2 cursor-pointer bg-blue-600 text-white hover:bg-blue-700 hover:text-white"
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
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="quarter">3 derniers mois</option>
                <option value="year">Cette année</option>
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
            trend={`${totals.trends.total > 0 ? '+' : ''}${totals.trends.total}%`}
            color="text-blue-600"
            trendUp={totals.trends.total >= 0}
            iconBg="bg-blue-100 text-blue-600"
          />
          <KpiCard
            icon={<CheckCircle className="w-5 h-5" />}
            title="Légitimes"
            value={formatNumber(totals.legit)}
            trend={`${totals.trends.legit > 0 ? '+' : ''}${totals.trends.legit}%`}
            color="text-green-600"
            trendUp={totals.trends.legit >= 0}
            iconBg="bg-green-100 text-green-600"
          />
          <KpiCard
            icon={<XCircle className="w-5 h-5" />}
            title="Frauduleuses"
            value={formatNumber(totals.fraud)}
            trend={`${totals.trends.fraud > 0 ? '+' : ''}${totals.trends.fraud}%`}
            trendUp={totals.trends.fraud >= 0}
            color="text-red-600"
            iconBg="bg-red-100 text-red-600"
          />
          <KpiCard
            icon={<AlertTriangle className="w-5 h-5" />}
            title="Taux de Fraude"
            value={`${totals.fraudRate}%`}
            trend={`${totals.trends.fraudRate > 0 ? '+' : ''}${totals.trends.fraudRate}%`}
            trendUp={totals.trends.fraudRate >= 0}
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
                    Évolution des transactions
                  </CardTitle>
                  <CardDescription>Vos transactions sur 14 jours</CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                  Temps réel
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
                      tickFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', {day: 'numeric', month: 'short'})}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    />
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
                      name="Frauduleuses"
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
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Fraudes par type
              </CardTitle>
              <CardDescription>Répartition des transactions frauduleuses</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={byType.filter(d => d.fraud > 0).map((d) => ({ name: LABELS_FR[d.type] || d.type, value: d.fraud }))}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      innerRadius={40}
                      label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {byType.filter(d => d.fraud > 0).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} transactions`, "Frauduleuses"]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Répartition des transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="w-4 h-4 text-blue-600" />
                Transactions par type
              </CardTitle>
              <CardDescription>Répartition de votre activité</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={byType} margin={{ left: 0, right: 0, top: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
                    <XAxis
                      dataKey="type"
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => LABELS_FR[value]?.split(' ')[0] || value}
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip 
                      formatter={(value, name) => [`${value}`, name === "total" ? "Total" : "Frauduleuses"]}
                      labelFormatter={(value) => LABELS_FR[value] || value}
                    />
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
                      name="Frauduleuses"
                      fill="#ef4444"
                      radius={[2, 2, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="w-4 h-4 text-purple-600" />
                Statistiques par type
              </CardTitle>
              <CardDescription>Détail de vos transactions</CardDescription>
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
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-sm">{type.total}</p>
                      <p className="text-xs text-gray-500">
                        {type.fraud} frauduleuses ({type.rate || type.fraud_rate}%)
                      </p>
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
              <CreditCard className="w-4 h-4 text-indigo-600" />
              Distribution des montants
            </CardTitle>
            <CardDescription>Répartition par tranche de montant</CardDescription>
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
                    tickFormatter={(value) => `${value} MAD`}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip formatter={(value, name) => [`${value}`, name === "total" ? "Total" : "Frauduleuses"]} />
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
                    name="Frauduleuses"
                    fill="#ef4444"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Dernières transactions */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Dernières transactions
                </CardTitle>
                <CardDescription>Vos 5 transactions les plus récentes</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <Th>Date</Th>
                    <Th>Type</Th>
                    <Th>Destinataire</Th>
                    <Th>Montant</Th>
                    <Th>Status</Th>
                    <Th>Action</Th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {lastTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50">
                      <Td>{new Date(t.createdAt).toLocaleDateString('fr-FR')}</Td>
                      <Td>
                        <Badge variant="outline" className="text-xs">
                          {LABELS_FR[t.type] || t.type}
                        </Badge>
                      </Td>
                      <Td className="max-w-[120px] truncate">{t.recipient}</Td>
                      <Td>
                        <span className="font-semibold">{formatNumber(t.amount)}</span>
                        <span className="text-gray-500 ml-1 text-xs">{t.currency}</span>
                      </Td>
                      <Td>
                        <Badge
                          variant={t.status === "Frauduleuse" ? "destructive" : "default"}
                          className="text-xs"
                        >
                          {t.status}
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
    <Card className="rounded-2xl border border-gray-100 shadow-sm bg-white">
      <CardContent className="flex px-6 items-start">
        <div className="flex items-center">
          <div className={`p-2 rounded-full ${iconBg} mr-5`}>{icon}</div>
          <div>
            <p className="text-[15px] font-semibold text-gray-500">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
            {trend && (
              <div className={`flex items-center gap-1 text-md font-semibold mt-2
                ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
                <TrendingUp className={`w-3 h-3 ${!trendUp ? 'rotate-180' : ''}`} />
                {trend}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
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