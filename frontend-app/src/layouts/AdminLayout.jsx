import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/admin/app-sidebar"
import { Outlet, useLocation, Link } from "react-router-dom"

const AdminLayout = () => {
  const location = useLocation()
  const pathSegments = location.pathname.split("/").filter(Boolean)

  // Exemple: "/admin/models/performance" => ["admin","models","performance"]

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-screen ">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="z-40 bg-white/80 backdrop-blur border-b h-16 flex items-center px-4">
            <SidebarTrigger className="mr-2" />
            
            {/* Breadcrumb dynamique */}
            <div className="flex items-center font-normal border-l ms-1 px-4 border-gray-200 text-[13px] text-gray-600">
              <span className="text-gray-500">Admin</span>
              {pathSegments.slice(1).map((seg, idx) => {
                const fullPath = "/" + pathSegments.slice(0, idx + 2).join("/")
                return (
                  <span key={idx} className="flex items-center">
                    <span className="px-2">{">"}</span>
                    <Link
                      to={fullPath}
                      className="hover:text-blue-600 capitalize"
                    >
                      {seg.replace(/-/g, " ")}
                    </Link>
                  </span>
                )
              })}
            </div>
          </header>

          <main className="flex-1 w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

export default AdminLayout
