import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "./context/AuthContext";
import { HashRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { ChatProvider } from "./context/ChatContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <ChatProvider>
      <Auth0Provider
        domain="dev-2lu26s32fhqf1n1p.us.auth0.com"
        clientId="L3sDgUmPrMrch05EFhnt2rCtOvwK9HM3"
        authorizationParams={{
          redirect_uri:
            window.location.origin + "/Rent-Mate/#/verification-form",
        }}
        onRedirectCallback={(appState) => {
          const targetUrl = appState?.returnTo || "/verification-form";
          window.location.replace(
            window.location.origin + "/Rent-Mate/#" + targetUrl
          );
        }}
      >
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </Auth0Provider>
    </ChatProvider>
  </Router>
);
