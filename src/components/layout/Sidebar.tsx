import { NavLink } from "react-router-dom";

const Sidebar = () => {

    return (

      <aside className="w-64 border-r p-4"> 
      <h2 className="mb-6 text-xl font-bold">
        Expense Approval System
      </h2>

      <nav className="flex flex-col gap-3">
        <p className="text-xs uppercase text-gray-500">
           General
         </p>
        <NavLink to="/dashboard" 
        className={({ isActive }) =>
        isActive
            ? "font-semibold text-black"
            : "text-gray-500"
    }>Dashboard</NavLink>

        <p className="text-xs uppercase text-gray-500">
        Expense Management
       </p>

        <NavLink to="/expenses" className={({ isActive }) =>
        isActive
            ? "font-semibold text-black"
            : "text-gray-500"
    }>Expenses</NavLink>

        <p className="text-xs uppercase text-gray-500">
          Approvals
         </p>
        <NavLink to="/approvals" className={({ isActive }) =>
        isActive
            ? "font-semibold text-black"
            : "text-gray-500"
    }>Approvals</NavLink>

        <p className="text-xs uppercase text-gray-500">
         Adminstration
       </p>
        <NavLink to="/reports" className={({ isActive }) =>
        isActive
            ? "font-semibold text-black"
            : "text-gray-500"
    }>Reports</NavLink>
        <NavLink to="/users" className={({ isActive }) =>
        isActive
            ? "font-semibold text-black"
            : "text-gray-500"
    }>Users</NavLink>
        <NavLink to="/settings" className={({ isActive }) =>
        isActive
            ? "font-semibold text-black"
            : "text-gray-500"
    }>Settings</NavLink>
      </nav>
        </aside>
    );
};

export default Sidebar;