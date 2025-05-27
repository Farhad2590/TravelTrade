import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import UseTraveler from "../hooks/UseTraveler";

const TravelerRoute = ({ children }) => {
  const { loading, user } = useAuth();
  const [isTraveler, isTravelerLoading] = UseTraveler();
  const location = useLocation();

  if (loading || isTravelerLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (user && isTraveler) {
    return children;
  }

  // Pass the current path to the Unauthorized component
  // so it can determine which role is needed
  return <Navigate to="/unauthorized" state={location.pathname} replace={true} />;
};

export default TravelerRoute;