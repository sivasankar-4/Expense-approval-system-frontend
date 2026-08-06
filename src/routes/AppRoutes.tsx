import { Route, Routes } from "react-router-dom"
import LoginPage from "../pages/Login/LoginPage"
import AuthLayout from "../components/layout/AuthLayout"
import AppLayout from "../components/layout/AppLayout"
import DashboardPage from "../pages/Dashboard/DashboardPage"
import ExpensesPage from "../pages/Expenses/ExpensesPage"
import ApprovalsPage from "../pages/Approvals/ApprovalsPage"
import ReportsPage from "../pages/Reports/ReportsPage"
import SettingsPage from "../pages/Settings/SettingsPage"
import NotFoundPage from "../pages/NotFound/NotFoundPage"
import UsersPage from "../pages/Users/UsersPage"


const AppRoutes = () => {
     
    return (
    <Routes>
        <Route element ={<AuthLayout/>}>
            <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element ={<AppLayout />}>

            <Route path="/dashboard" element={<DashboardPage />}/>
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/reports" element={<ReportsPage/>} />
            <Route path="/users" element={<UsersPage/>} />
            <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
    </Routes>
    );
}
export default AppRoutes;
