import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { user } = useSelector((state) => state.auth);
  const token = localStorage.getItem('userToken');

  // Redirect to login if no user and no token
  if (!user && !token) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;