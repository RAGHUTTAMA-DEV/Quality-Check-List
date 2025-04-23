import { useAuth } from './hooks/AuthContext'
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface isAuthType {
  children: React.ReactNode;
}

export default function PrivateProvider({ children, roles = [] }: isAuthType & { roles?: string[] }) {
    const navigate = useNavigate();
    const { user } = useAuth();
  
    useEffect(() => {
      if (!user || (roles.length && !roles.includes(user.role))) {
        navigate("/login");
      }
    }, [user, roles, navigate]);
  
    if (!user) return null;
    return <>{children}</>;
  }
  