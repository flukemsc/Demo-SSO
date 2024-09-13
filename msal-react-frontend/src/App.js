import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";

import Test from "./components/Test";
import Login from "./components/Login";
export default function App({ instance }) {
  const ProtectedRoute = () => {
    if (instance.getActiveAccount()) {
      return <Outlet />;
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <MsalProvider instance={instance}>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/test" element={<Test />} />
        </Route>
      </Routes>
    </MsalProvider>
  );
}
