import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";

const AdminRoute = ({ children }) => {
  const { loading, user } = useAuth();
  const [isAdmin, isAdminLoading] = useAdmin();
  const location = useLocation();

  if (loading || isAdminLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (user && isAdmin) {
    return children;
  }

  // Pass the current path to the Unauthorized component
  // so it can determine which role is needed
  return <Navigate to="/unauthorized" state={location.pathname} replace={true} />;
};

export default AdminRoute;