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
          // 👆 Auth0 will redirect here after a successful login
          // because this exactly matches your allowed callback URL

          // If you want the user to return to the previous page:
          // redirect_uri: window.location.origin + "/Rent-Mate/#/",
        }}
        onRedirectCallback={(appState) => {
          // After redirect, move user to the page they should land on
          const targetUrl = appState?.returnTo || "/verification-form"; // default landing page

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
