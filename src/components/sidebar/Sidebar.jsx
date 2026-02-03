import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  LogOut,
  Settings
} from "lucide-react";
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <>
      <aside className="bg-base-200 border-r border-base-300 flex flex-col transition-all duration-300 w-20 lg:w-64">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center lg:justify-start px-6 py-12">
          <span className="text-xl font-bold text-primary hidden lg:inline hover:opacity-85">
            <Link to="/dashboard">FlowBoard</Link>
          </span>
          <span className="text-xl font-bold text-primary lg:hidden hover:opacity-85">
            <Link to="/dashboard">FB</Link>
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-2">
          <NavLink
            end
            to="/dashboard"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-base-300 border-accent font-semibold"
                  : "opacity-70 hover:opacity-100"
              } btn btn-ghost justify-center lg:justify-start w-full gap-2`
            }
          >
            <LayoutDashboard size={20} />
            <span className="hidden lg:inline">Dashboard</span>
          </NavLink>

          <NavLink
            to="/projects"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-base-300 border-accent font-semibold"
                  : "opacity-70 hover:opacity-100"
              } btn btn-ghost justify-center lg:justify-start w-full gap-2`
            }
          >
            <FolderKanban size={20} />
            <span className="hidden lg:inline">Projects</span>
          </NavLink>

          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-base-300 border-accent font-semibold"
                  : "opacity-70 hover:opacity-100"
              } btn btn-ghost justify-center lg:justify-start w-full gap-2`
            }
          >
            <CheckSquare size={20} />
            <span className="hidden lg:inline">Tasks</span>
          </NavLink>

          <NavLink
            to="/teams"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-base-300 border-accent font-semibold"
                  : "opacity-70 hover:opacity-100"
              } btn btn-ghost justify-center lg:justify-start w-full gap-2`
            }
          >
            <Users size={20} />
            <span className="hidden lg:inline">Teams</span>
          </NavLink>

          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `${
                isActive
                  ? "bg-base-300 border-accent font-semibold"
                  : "opacity-70 hover:opacity-100"
              } btn btn-ghost justify-center lg:justify-start w-full gap-2`
            }
          >
            <Settings size={20} />
            <span className="hidden lg:inline">Settings</span>
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-base-300">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="btn btn-sm btn-ghost w-full"
          >
            <LogOut size={20} />
            <span className="hidden lg:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout confirmation modal */}
      {showLogoutModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm logout</h3>
            <p className="py-4">
              Are you sure you want to log out of FlowBoard?
            </p>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
