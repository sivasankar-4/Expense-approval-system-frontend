import { useLocation, useNavigate } from "react-router-dom";
import { logout } from "@/services/auth/authService";

const Topbar = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle = location.pathname.split("/")[1] ||  "Dashboard";

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex items-center justify-between border-b p-4">
      <h1 className="text-2xl font-semibold captilize">{pageTitle}</h1>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </header>
  );
};

export default Topbar;
