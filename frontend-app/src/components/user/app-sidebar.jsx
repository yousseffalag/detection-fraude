import { useEffect, useState } from "react";
import {
    BarChart3,
    CreditCard,
    Bot,
    Brain,
    User,
    LogOut
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useAuth } from "../../context/authContext";
import axiosClient from "../../api/axiosClient";

// Menu utilisateur réorganisé
const menuGroups = [
    {
        label: "Vue d'ensemble",
        items: [{ title: "Dashboard", url: "/dashboard", icon: BarChart3 }],
    },
    {
        label: "Gestion des données",
        items: [
            { title: "Historique des transactions", url: "/transactionsHistory", icon: CreditCard },
        ],
    },
    {
        label: "Intelligence Artificielle",
        items: [
            { title: "Prédiction", url: "/prediction", icon: Bot },
            { title: "Prédiction par lots", url: "/predictionCSV", icon: Bot },
        ],
    },
    {
        label: "Configuration",
        items: [{ title: "Mon Profil", url: "/profile", icon: User }],
    },
];

const BrandHeader = () => {
  return (
    <div className="flex items-center px-8 py-5 border-b border-gray-100 mb-2">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-xl flex justify-center items-center mr-3 shadow-md">
        <Brain className="w-5 h-5 text-white" />
      </div>
      <div>
        <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          FraudGuard
        </span>
        <div className="text-xs text-gray-500">User Panel</div>
      </div>
    </div>
  );
};

// Profil + logout
const UserProfile = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        axiosClient.get("/auth/me")
            .then((res) => setUser(res.data))
            .catch((err) => console.error("Erreur fetch /me:", err));
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="p-5 border-t border-gray-100 pb-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex justify-center items-center mr-3 shadow-sm">
                        <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[12px] text-gray-900 truncate font-medium">
                            {user?.username || user?.sub || "Utilisateur"}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{user?.email || ""}</div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="ml-2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

// Sidebar utilisateur réorganisée
export function UserSidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

    const isActive = (url) => currentPath === url;

    return (
        <Sidebar className="font-inter">
            <SidebarContent className="bg-white flex flex-col h-full">
                <BrandHeader />

                <div className="flex-1">
                    {menuGroups.map((group) => (
                        <SidebarGroup key={group.label} className="ps-5">
                            <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {group.label}
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <Link
                                                    to={item.url}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm font-normal rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    <item.icon className="w-4 h-4" />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </div>

                <UserProfile />
            </SidebarContent>
        </Sidebar>
    );
}
