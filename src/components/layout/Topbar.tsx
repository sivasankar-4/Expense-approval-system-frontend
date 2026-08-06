import { useLocation } from "react-router-dom";

const Topbar = () => {

  const location = useLocation();

  const pageTitle = location.pathname.split("/")[1] ||  "Dashboard";
  return (
    <header className="border-b p-4">
      <h1 className="text-2xl font-semibold captilize">{pageTitle}</h1>
    </header>
  );
};

export default Topbar;