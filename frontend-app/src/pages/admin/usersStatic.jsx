import React, { useState } from "react";
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
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id: user?.id || null,
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "User",
    status: user?.status || "Active",
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.email) {
      alert("Name and Email are required");
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
          <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Full Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-2 py-2 font-medium text-[12px] border border-gray-300 rounded-lg outline-none transition-all bg-gray-50"
            placeholder="Enter user's full name"
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
            <option value="User">User</option>
            <option value="Admin">Administrator</option>
          </select>
        </div>

        <div>
          <label className="text-[12px] font-semibold text-gray-700 mb-1.5 block">Account Status:</label>
          <div className="grid grid-cols-2 gap-2">
            <div
              onClick={() => setFormData(prev => ({ ...prev, status: "Active" }))}
              className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${formData.status === "Active"
                ? 'bg-green-50 border-green-500 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className={`w-2 h-2 ${formData.status === "Active" ? 'bg-green-500' : 'bg-gray-300'} rounded-full mr-2`} />
              <span className={`text-[12px] ${formData.status === "Active" ? 'font-semibold' : 'font-medium'}`}>Active</span>
              {formData.status === "Active" && <Check className="ml-auto h-4 w-4 text-green-500" />}
            </div>
            <div
              onClick={() => setFormData(prev => ({ ...prev, status: "Inactive" }))}
              className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${formData.status === "Inactive"
                ? 'bg-red-50 border-red-500 shadow-sm'
                : 'border-gray-200 hover:bg-gray-50'
                }`}
            >
              <div className={`w-2 h-2 ${formData.status === "Inactive" ? 'bg-red-500' : 'bg-gray-300'} rounded-full mr-2`} />
              <span className={`text-[12px] ${formData.status === "Inactive" ? 'font-semibold' : 'font-medium'}`}>Inactive</span>
              {formData.status === "Inactive" && <Check className="ml-auto h-4 w-4 text-red-500" />}
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

const UsersStatic = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      status: "Active",
      joinDate: "2024-01-15",
      lastActive: "2024-08-19",
      avatar: null,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "User",
      status: "Active",
      joinDate: "2024-02-20",
      lastActive: "2024-08-18",
      avatar: null,
    },
    {
      id: 4,
      name: "Sarah Wilson",
      email: "sarah.wilson@example.com",
      role: "User",
      status: "Active",
      joinDate: "2024-03-12",
      lastActive: "2024-08-19",
      avatar: null,
    },
    {
      id: 5,
      name: "Alex Chen",
      email: "alex.chen@example.com",
      role: "User",
      status: "Active",
      joinDate: "2024-04-05",
      lastActive: "2024-08-17",
      avatar: null,
    }
  ]);

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
      case "Admin":
        return "bg-red-100 text-red-600";
      case "Manager":
        return "bg-blue-100 text-blue-600";
      case "User":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "Admin":
        return <Shield className="w-4 h-4 text-red-600" />;
      case "Manager":
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      case "User":
        return <User className="w-4 h-4 text-green-600" />;
      case "SuperAdmin":
        return <Crown className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-600";
      case "Inactive":
        return "bg-gray-100 text-gray-600";
      case "Pending":
        return "bg-yellow-100 text-yellow-600";
      case "Banned":
        return "bg-red-100 text-red-600";
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "All" || user.role === filterRole;
    const matchesStatus = filterStatus === "All" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      trend: "+12%",
      trendUp: true,
      icon: <UsersIcon className="w-5 h-5 text-blue-600" />,
      color: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "Active").length,
      trend: "+8%",
      trendUp: true,
      icon: <UserCheck className="w-5 h-5 text-green-600" />,
      color: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      title: "Administrators",
      value: users.filter((u) => u.role === "Admin").length,
      trend: "0%",
      trendUp: false,
      icon: <Crown className="w-5 h-5 text-purple-600" />,
      color: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      title: "New This Month",
      value: users.filter(
        (u) => new Date(u.joinDate).getMonth() === new Date().getMonth()
      ).length,
      trend: "+25%",
      trendUp: true,
      icon: <TrendingUp className="w-5 h-5 text-orange-600" />,
      color: "text-orange-600",
      iconBg: "bg-orange-100",
    },
  ];

  const handleSaveUser = (data) => {
    if (data.id) {
      // Modifier
      setUsers(users.map(u => u.id === data.id ? { ...u, ...data } : u));
    } else {
      // Ajouter
      const newUser = {
        ...data,
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString().split("T")[0],
        avatar: null
      };
      setUsers([...users, newUser]);
    }
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 md:px-8 2xl:px-40 2xl:py-6">
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
        {stats.map((stat, idx) => (
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
              <option value="Admin">Admin</option>
              <option value="User">User</option>
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
      <div className="bg-white rounded-md shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Join Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Last Active</th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${getAvatarColor(user.name)} rounded-lg flex items-center justify-center`}>
                        <span className="text-white text-xs font-medium">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(user.status)}`}>
                      <div className={`w-2 h-2 rounded-full mr-1 ${user.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {new Date(user.lastActive).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded-md"
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-md"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Modal */}
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
    </div>
  );
};

export default UsersStatic;