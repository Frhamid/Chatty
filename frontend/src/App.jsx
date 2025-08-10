import React from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import OnBoardingPage from "./Pages/OnBoardingPage";
import ChatPage from "./Pages/ChatPage";
import NotificationsPage from "./Pages/NotificationsPage";
import CallPage from "./Pages/CallPage";
import { Toaster, toast } from "react-hot-toast";
import Loadercomp from "./components/loadercomp";
import useAuthUser from "./Hooks/useAuthUser";

const App = () => {
  // using our custom hook for getting current user
  const { authUser, isLoading } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if (isLoading) {
    return <Loadercomp />;
  }
  return (
    <div className=" h-screen " data-theme="dark">
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <HomePage />
            ) : !isAuthenticated ? (
              <Navigate to="/login" />
            ) : (
              <Navigate to="/onboard" />
            )
          }
        />
        <Route
          path="/login"
          element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />}
        />
        <Route
          path="/onboard"
          element={
            isAuthenticated ? (
              !isOnboarded ? (
                <OnBoardingPage />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/call"
          element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/chat"
          element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/Notifications"
          element={
            isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />
          }
        />
      </Routes>
      <div>
        <Toaster />
      </div>
    </div>
  );
};

export default App;
