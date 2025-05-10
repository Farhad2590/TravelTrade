import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useSender from "../hooks/useSender";

const SenderRoute = ({ children }) => {
  const { loading, user } = useAuth();
  const [isSender, isSenderLoading] = useSender();
  const location = useLocation();

  if (loading || isSenderLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (user && isSender) {
    return children;
  }

  return <Navigate to="/unauthorized" state={location.pathname} replace={true} />;
};

export default SenderRoute;