import { Route, Routes } from "react-router-dom";
import GuestRoutes from "./components/routes/GuestRoutes";
import SADRoutes from "./components/routes/SADRoutes";
import AuthRoutes from "./components/routes/AuthRoutes";
import NotFoundPage from "./pages/notFound/NotFoundPage";
import HomePage from "./pages/home/HomePage";
import RegisterPage from "./pages/auth/register/RegisterPage";
import ContactUsPage from "./pages/contactUs/ContactUsPage";
import UserProfilePage from "./pages/user/profile/UserProfilePage";
import ManualPage from "./pages/manual/ManualPage";
import PrivacyPolicyPage from "./pages/privacyPolicy/PrivacyPolicyPage";
import VerifyOtpPage from "./pages/auth/verifyOtp/VerifyOtpPage";
import AdminRoutes from "./components/routes/AdminRoutes";
import AdminManageUsersPage from "./pages/admin/manageUsers/AdminManageUsersPage";
import AdminLogsPage from "./pages/admin/adminLogs/AdminLogsPage";
import ForgotPasswordPage from "./pages/auth/forgotPassword/ForgotPasswordPage";
import VerifyFPOtpPage from "./pages/auth/forgotPassword/verify-otp/VerifyFPOtpPage";
import YearRangePage from "./pages/sad/yearRange/YearRangePage";
import ItemsPage from "./pages/sad/items/ItemsPage";
import FirmsPage from "./pages/sad/firms/FirmsPage";
import CreateFirmsPage from "./pages/sad/firms/CreateFirmsPage";
import CreateItemsPage from "./pages/sad/items/CreateItemsPage";
import RatesPage from "./pages/sad/rates/RatesPage";
import CreateRatesPage from "./pages/sad/rates/CreateRatesPage";
import AddApprovedFirmsPage from "./pages/sad/firms/AddApprovedFirmsPage";
import PurchasePage from "./pages/sad/purchase/PurchasePage";
import CreatePurchasePage from "./pages/sad/purchase/CreatePurchasePage";
import IssuePage from "./pages/sad/issue/IssuePage";
import CreateIssuePage from "./pages/sad/issue/CreateIssuePage";
import DashboardPage from "./pages/sad/DashboardPage";
import CategoryPage from "./pages/sad/category/CategoryPage";
import LedgerPage from "./pages/sad/ledger/LedgerPage";
import UnitsPage from "./pages/sad/units/UnitsPage";
import FirmsApprovePage from "./pages/sad/firms/FirmsApprovePage";
import PurchaseRoutes from "./components/routes/PurchaseRoutes";
import { AuthProvider } from "./components/auth/authContext";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import IssueRoutes from "./components/routes/IssueRoutes";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* GUEST ROUTES **********************************************************/}
        <Route path="/" element={<GuestRoutes />}>
          <Route index element={<HomePage />} />
          <Route path="contact-us" element={<ContactUsPage />} />
          <Route path="manual" element={<ManualPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
        </Route>

        {/* AUTH ROUTES ***********************************************************/}
        <Route path="/auth" element={<AuthRoutes />}>
          <Route path="register" element={<RegisterPage />} />
          <Route path="verify-otp" element={<VerifyOtpPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="forgot-password/verify-otp"
            element={<VerifyFPOtpPage />}
          />
        </Route>

        {/* SAD ROUTES *******************************************************/}
        <Route path="/sad" element={<SADRoutes />}>
          {/* Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="year-range" element={<YearRangePage />} />
          <Route path="items" element={<ItemsPage />} />
          <Route path="firms" element={<FirmsPage />} />
          <Route path="firms/create" element={<CreateFirmsPage />} />
          <Route path="items/create" element={<CreateItemsPage />} />
          <Route path="rates" element={<RatesPage />} />
          <Route path="rates/create" element={<CreateRatesPage />} />
          <Route path="purchase" element={<PurchasePage />} />
          <Route path="purchase/create" element={<CreatePurchasePage />} />
          <Route path="issue" element={<IssuePage />} />
          <Route path="issue/create" element={<CreateIssuePage />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="ledger" element={<LedgerPage />} />
          <Route path="units" element={<UnitsPage />} />
          <Route
            path="firms/add-approved-firm"
            element={<AddApprovedFirmsPage />}
          />
          <Route
            path="firms/bulk-approve-firms"
            element={<FirmsApprovePage />}
          />

          {/* Profile */}
          <Route path="profile" element={<UserProfilePage />} />
        </Route>

        {/* Purchase ROUTES *******************************************************/}
        <Route element={<ProtectedRoute allowedRoles={["PUR"]} />}>
          <Route path="/purchase" element={<PurchaseRoutes />}>
            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="purchase" element={<PurchasePage />} />
            <Route path="purchase/create" element={<CreatePurchasePage />} />
            <Route path="ledger" element={<LedgerPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="firms" element={<FirmsPage />} />
            <Route path="rates" element={<RatesPage />} />
            <Route path="category" element={<CategoryPage />} />
            {/* <Route path="year-range" element={<YearRangePage />} />
        

            {/* Profile */}
            <Route path="profile" element={<UserProfilePage />} />
          </Route>
        </Route>

        {/* Issue ROUTES *******************************************************/}
        <Route element={<ProtectedRoute allowedRoles={["ISS"]} />}>
          <Route path="/issue" element={<IssueRoutes />}>
            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="issue" element={<IssuePage />} />
            <Route path="issue/create" element={<CreateIssuePage />} />
            <Route path="ledger" element={<LedgerPage />} />
            <Route path="items" element={<ItemsPage />} />
            <Route path="firms" element={<FirmsPage />} />
            <Route path="category" element={<CategoryPage />} />
            {/* <Route path="year-range" element={<YearRangePage />} />
        

            {/* Profile */}
            <Route path="profile" element={<UserProfilePage />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES ******************************************************** */}
        <Route path="/admin" element={<AdminRoutes />}>
          {/* Dashboard */}
          <Route path="logs" element={<AdminLogsPage />} />

          {/* Manage Users */}
          <Route path="users" element={<AdminManageUsersPage />} />

          {/* Profile */}
          <Route path="profile" element={<UserProfilePage />} />
        </Route>

        {/* NOT FOUND *************************************************************/}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
