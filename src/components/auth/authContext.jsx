import { createContext, useContext, useEffect, useState } from "react";
import { useFetchUsersProfile } from "../../hooks/userQueries";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const profileQuery = useFetchUsersProfile({
    enabled: false, // ❗ important
  });

  useEffect(() => {
    if (profileQuery.isSuccess) {
      setUser(profileQuery.data.data);
    }

    if (profileQuery.isError) {
      setUser(null);
      localStorage.clear();
    }
  }, [profileQuery.status]);

  const refreshUser = async () => {
    await profileQuery.refetch();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isAuthenticated: !!user,
        isLoading: profileQuery.isPending,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
