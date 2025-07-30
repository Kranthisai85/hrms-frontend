import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { authService } from "../../services/api";

function AuthHandler({ setIsAuthenticated, setUserType, setIsCheckingAuth }) {
  const location = useLocation();

  useEffect(() => {
    const authenticate = async () => {
      const params = new URLSearchParams(location.search);
      const companyId = params.get("companyId");
      const superAdminID = params.get("superAdminID");
      const password = params.get("password");

      if (companyId && superAdminID && password) {
        setIsCheckingAuth(true);
        try {
          // Call authService to validate credentials
          const response = await authService.login(
            superAdminID,
            password
          );

          if (response.success) {
            // Get current session data from localStorage
            const currentCompanyId = localStorage.getItem("companyId");
            const currentSuperAdminID = localStorage.getItem("superAdminID");
            const isAuthenticatedCurrently = localStorage.getItem("isAuthenticated") === "true";

            // Case 1: No existing session, log in with new credentials
            if (!isAuthenticatedCurrently) {
              setIsAuthenticated(true);
              setUserType(response.userType);
              localStorage.setItem("isAuthenticated", "true");
              localStorage.setItem("userType", "admin");
              localStorage.setItem("companyId", companyId);
              localStorage.setItem("superAdminID", superAdminID);
            } else {
              // Case 2: Existing session, check companyId and superAdminID
              if (currentCompanyId !== companyId || currentSuperAdminID !== superAdminID) {
                // Different company or different user, log out and log in with new credentials
                authService.logout();
                setIsAuthenticated(true);
                setUserType(response.userType);
                localStorage.setItem("isAuthenticated", "true");
                localStorage.setItem("userType", response.userType);
                localStorage.setItem("companyId", companyId);
                localStorage.setItem("superAdminID", superAdminID);
              }
              // Case 3: Same company and same user, no action needed (stay logged in)
            }
          } else {
            // Authentication failed, clear session and show error
            authService.logout();
            setIsAuthenticated(false);
            setUserType("");
            console.error("URL authentication failed:", response.message);
          }
        } catch (error) {
          authService.logout();
          setIsAuthenticated(false);
          setUserType("");
          console.error("Authentication error:", error.message);
        } finally {
          setIsCheckingAuth(false);
        }
      } else {
        // No URL parameters, skip authentication
        setIsCheckingAuth(false);
      }
    };

    authenticate();
  }, [location.search, setIsAuthenticated, setUserType, setIsCheckingAuth]);

  return null; // This component doesn't render anything
}

export default AuthHandler;