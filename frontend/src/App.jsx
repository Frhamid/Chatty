import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import OnBoardingPage from "./Pages/OnBoardingPage";
import ChatPage from "./Pages/ChatPage";
import NotificationsPage from "./Pages/NotificationsPage";
import FriendsPage from "./Pages/FriendsPage";
import CallPage from "./Pages/CallPage";
import { Toaster, toast } from "react-hot-toast";
import Loadercomp from "./components/loadercomp";
import useAuthUser from "./Hooks/useAuthUser";
import Layout from "./components/Layout";
import { useThemeStore } from "./store/useThemeStore ";

const App = () => {
  // using our custom hook for getting current user
  const { authUser, isLoading } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  const { theme, setTheme } = useThemeStore();

  useEffect(() => {
    if (authUser?.theme) {
      setTheme(authUser.theme);
    }
  }, [authUser?.theme, setTheme]);

  if (isLoading) {
    return <Loadercomp />;
  }
  return (
    <div className=" size-full " data-theme={theme}>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideNav>
                <HomePage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <LoginPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboard"} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            !isAuthenticated ? (
              <SignupPage />
            ) : (
              <Navigate to={isOnboarded ? "/" : "/onboard"} />
            )
          }
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
          path="/notifications"
          element={
            isAuthenticated ? (
              <Layout showSideNav>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated ? (
              <Layout showSideNav>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
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
