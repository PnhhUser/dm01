import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { Spinner } from "@chakra-ui/react";

export const PrivateUser = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};
