import { AuthProvider } from "../../common/context/AuthContext.jsx";

export const AppProviders = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
