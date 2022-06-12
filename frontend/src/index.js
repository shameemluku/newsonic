import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";
import { SnackbarProvider } from "notistack";

import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
          <App />
        </SnackbarProvider>
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
