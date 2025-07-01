import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isRefreshing = useSelector((state) => state.auth.isRefreshing);

  if (isRefreshing) {
    return <div className="text-white text-center p-4">Checking login...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}