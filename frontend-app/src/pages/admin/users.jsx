import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  User,
  Mail,
  Shield,
  Calendar,
  Users as UsersIcon,
  UserCheck,
  Crown,
  Eye,
  TrendingUp,
  Activity,
  Download,
  Check,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/authContext';
import { motion, AnimatePresence } from "framer-motion";


const Notification = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: "bg-green-100 text-green-600 border-l border-green-500",
    error: "bg-red-100 text-red-600 border-l border-red-500",
    warning: "bg-yellow-100 text-yellow-600 border-l border-yellow-500",
  };

  const Icon = type === "error" || type === "warning" ? AlertTriangle : Check;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -20, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -20, scale: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`fixed top-5 left-5 z-50 rounded-md px-5 py-3 flex items-center shadow-lg hover:scale-105 transform transition-transform duration-200 ${typeStyles[type]}`}
      >
        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
        <span className="text-[13px]">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};

// Composant de confirmation de suppression
const DeleteConfirmationModal = ({ user, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <h2 className="text-sm font-medium uppercase text-gray-700">Confirmer la suppression</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 mb-4 text-[15px]">
            Êtes-vous sûr de vouloir supprimer l'utilisateur <span className="font-semibold">{user?.username}</span> ?
          </p>
          <p className="text-[14px] text-gray-500 mb-6">
            Cette action est irréversible. Toutes les données associées à cet utilisateur seront définitivement supprimées.
          </p>
        </div>

        <div className="flex justify-end gap-3 px-5 py-3 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[13px] font-medium text-gray-600 border rounded-md cursor-pointer"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(user.id)}
            className="px-4 py-2 text-[13px] font-medium text-white bg-red-600 rounded-md cursor-pointer"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: user?.id || null,
    username: user?.username || "",
    email: user?.email || "",
    role: user?.role || "user",
    is_verified: user?.is_verified !== undefined ? user.is_verified : true,
  });

  const handleSubmit = () => {
    if (!formData.username || !formData.email) {
      alert("Username and Email are required");
      return;
    }
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-[14px] font-medium uppercase text-gray-600">
          {user ? "Edit User" : "Add New User"}
        </h2>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-5 w-5 cursor-pointer" />
        </button>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-2 py-2 font-medium text-[12px] border border-gray-300 rounded-lg outline-none transition-all bg-gray-50"
            placeholder="Enter username"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-2 py-2 font-medium text-[12px] border border-gray-300 rounded-lg outline-none transition-all bg-gray-50"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">User Role:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 font-medium text-[12px] border border-gray-300 rounded-lg outline-none transition-all bg-gray-50 cursor-pointer"
            required
          >
            <option value="user">User</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Account Status:</label>
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => setFormData(prev => ({ ...prev, is_verified: true }))}
              className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${formData.is_verified
                ? 'bg-green-50 border-green-500 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className={`w-2 h-2 ${formData.is_verified ? 'bg-green-500' : 'bg-gray-300'} rounded-full mr-2`} />
              <span className={`text-[12px] ${formData.is_verified ? 'font-semibold' : 'font-medium'}`}>Active</span>
              {formData.is_verified && <Check className="ml-auto h-4 w-4 text-green-500" />}
            </div>
            <div
              onClick={() => setFormData(prev => ({ ...prev, is_verified: false }))}
              className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${!formData.is_verified
                ? 'bg-red-50 border-red-500 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className={`w-2 h-2 ${!formData.is_verified ? 'bg-red-500' : 'bg-gray-300'} rounded-full mr-2`} />
              <span className={`text-[12px] ${!formData.is_verified ? 'font-semibold' : 'font-medium'}`}>Inactive</span>
              {!formData.is_verified && <Check className="ml-auto h-4 w-4 text-red-500" />}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 p-2 border-t border-gray-200 bg-gray-50 pr-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 cursor-pointer font-medium bg-white border border-gray-300 text-gray-700 rounded-lg text-[12px] hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-3 py-2 cursor-pointer font-medium bg-blue-600 text-white rounded-lg text-[12px] hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <Check className="h-4 w-4" />
          {user ? 'Update User' : 'Add User'}
        </button>
      </div>
    </div>
  );
};

function KpiCard({ icon, title, value, trend, trendUp, color, iconBg = "bg-gray-100" }) {
  return (
    <Card className="rounded-xl bg-white shadow-sm border border-gray-100">
      <CardContent className="flex px-5 items-start">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${iconBg} mr-4`}>{icon}</div>
          <div>
            <p className="text-[13px] font-semibold text-gray-500">{title}</p>
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

const Users = () => {
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: { count: 0, change_percentage: 0 },
    active_users: { count: 0, change_percentage: 0 },
    admins: { count: 0, change_percentage: 0 },
    new_this_month: { count: 0, change_percentage: 0 }
  });

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  // États pour les notifications et modals
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const getAvatarColor = (name) => {
    const colors = [
      "bg-red-500",
      "bg-green-500",
      "bg-blue-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-600";
      case "manager":
        return "bg-blue-100 text-blue-600";
      case "user":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4 text-red-600" />;
      case "manager":
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case "user":
        return <User className="w-4 h-4 text-green-600" />;
      case "superadmin":
        return <Crown className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case true:
        return "bg-green-100 text-green-600";
      case false:
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const response = await axiosClient.get("/users/statistics");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      if (err.response?.status === 401) {
        console.log("Unauthorized! Logging out...");
        logout();
      } else {
        setError("Erreur lors du chargement des statistiques");
      }
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: currentPage,
        limit: itemsPerPage
      };

      if (searchTerm) params.search = searchTerm;
      if (filterRole !== "All") params.role = filterRole;
      if (filterStatus !== "All") params.status = filterStatus === "Active";

      const response = await axiosClient.get("/users", { params });
      console.log("Fetched users:", response.data);

      // Si l'API retourne un objet avec les données et les infos de pagination
      if (response.data.users && response.data.pagination) {
        setUsers(response.data.users);
        setTotalItems(response.data.pagination.total);
      } else {
        // Si l'API retourne juste un tableau
        setUsers(response.data);
        setTotalItems(response.data.length);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 401) {
        console.log("Unauthorized! Logging out...");
        logout();
      } else {
        setError("Erreur lors du chargement des utilisateurs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        if (isMounted) {
          await fetchStats();
          await fetchUsers();
        }
      } catch (error) {
        console.error("Error in loadData:", error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [searchTerm, filterRole, filterStatus, currentPage, itemsPerPage]);

  const handleSaveUser = async (data) => {
    try {
      if (data.id) {
        await axiosClient.patch(`/users/${data.id}`, {
          username: data.username,
          email: data.email,
          role: data.role,
          is_verified: data.is_verified
        });
        showNotification("Utilisateur modifié avec succès", "success");
      } else {
        await axiosClient.post("/users", {
          username: data.username,
          email: data.email,
          role: data.role,
          is_verified: data.is_verified
        });
        showNotification("Utilisateur ajouté avec succès", "success");
      }

      fetchUsers();
      fetchStats();
      setShowModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error saving user:", error);
      showNotification("Erreur lors de la sauvegarde: " + (error.response?.data?.detail || error.message), "error");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axiosClient.delete(`/users/${id}`);
      showNotification("Utilisateur supprimé avec succès", "success");
      fetchUsers();
      fetchStats();
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotification("Erreur lors de la suppression: " + (error.response?.data?.detail || error.message), "error");
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const formatPercentage = (value) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // Calculs pour la pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const statsCards = [
    {
      title: "Total Users",
      value: stats.total_users.count,
      trend: formatPercentage(stats.total_users.change_percentage),
      trendUp: stats.total_users.change_percentage >= 0,
      icon: <UsersIcon className="w-5 h-5 text-blue-600" />,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: stats.active_users.count,
      trend: formatPercentage(stats.active_users.change_percentage),
      trendUp: stats.active_users.change_percentage >= 0,
      icon: <UserCheck className="w-5 h-5 text-green-600" />,
      color: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Administrators",
      value: stats.admins.count,
      trend: formatPercentage(stats.admins.change_percentage),
      trendUp: stats.admins.change_percentage >= 0,
      icon: <Crown className="w-5 h-5 text-purple-600" />,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      title: "New This Month",
      value: stats.new_this_month.count,
      trend: formatPercentage(stats.new_this_month.change_percentage),
      trendUp: stats.new_this_month.change_percentage >= 0,
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      color: "text-orange-600",
      iconBg: "bg-orange-100",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 md:px-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: "", type: "success" })}
        />
      )}

      {/* Header */}
      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des utilisateurs</h1>
          <p className="text-gray-600 text-sm mt-1">
            Gérez et surveillez tous les utilisateurs de votre système
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((stat, idx) => (
          <KpiCard key={idx} {...stat} />
        ))}
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg p-3 mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-sm mx-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Recherche par le nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-sm"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-2 py-1 border border-gray-300 rounded-md text-[13px] cursor-pointer"
            >
              <option value="All">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="z-100 px-2 py-1 border border-gray-300 rounded-md text-[13px] cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              onClick={handleAddUser}
              className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-[12px] font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-md shadow-sm mt-8 overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr key={Math.random()}>
                  <td colSpan="6" className="px-4 py-6 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-gray-500 mt-2">Loading users...</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="pl-6 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 ${getAvatarColor(user.username)} rounded-lg flex items-center justify-center`}>
                          <span className="text-white text-xs font-medium">
                            {user.username.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(user.status)}`}>
                        <div className={`w-2 h-2 rounded-full mr-1 ${user.status ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                        {user.status ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Calendar className="w-3 h-3" />
                        {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <Activity className="w-3 h-3" />
                        {new Date().toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      {user.role == 'user' && (
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-md cursor-pointer hover:text-blue-500"
                            title="Edit User"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => confirmDelete(user)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-md cursor-pointer hover:text-red-500"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && users.length === 0 && (
          <div className="text-center py-6">
            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6 text-gray-500" />
            </div>
            <h3 className="text-md text-gray-900 mb-1">No users found</h3>
            <p className="text-gray-500 text-[13px]">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-gray-200 bg-white">
            <div className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing <span className="font-medium">{startItem}</span> to <span className="font-medium">{endItem}</span> of{' '}
              <span className="font-medium">{totalItems}</span> results
            </div>

            <div className="flex items-center space-x-2">

              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1.5 rounded-md border text-sm font-medium ${currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-700'
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal d'ajout/édition */}
      {showModal && (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center p-4 z-50">
          <UserForm
            user={selectedUser}
            onSave={handleSaveUser}
            onCancel={() => {
              setShowModal(false);
              setSelectedUser(null);
            }}
          />
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <DeleteConfirmationModal
          user={userToDelete}
          onConfirm={handleDeleteUser}
          onCancel={() => {
            setShowDeleteModal(false);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default Users;