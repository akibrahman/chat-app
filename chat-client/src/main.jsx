import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import AuthProvider from "./Components/AuthProvider.jsx";
import Chat from "./Components/Chat.jsx";
import HomePage from "./Components/HomePage.jsx";
import LoginForm from "./Components/LoginForm.jsx";
import RegistrationForm from "./Components/RegistrationPage.jsx";
import "./index.css";

const tanstack = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/registration",
        element: <RegistrationForm />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={tanstack}>
      <AuthProvider>
        <ToastContainer position="top-center" autoClose={2000} theme="dark" />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
