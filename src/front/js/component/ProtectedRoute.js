import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Context } from "./store/appContext";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { store } = useContext(Context);
  const { auth } = store;
alert(JSON.stringify(auth));
  // Si no hay token, redirige al login
  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  // Si se requiere un rol específico y el usuario no lo tiene, redirige
  if (requiredRole && auth.user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  // Si todo está bien, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;