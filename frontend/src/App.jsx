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
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideNav={false}>
                <CallPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideNav={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
            )
          }
        />
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideNav>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
            )
          }
        />
        <Route
          path="/friends"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideNav>
                <FriendsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
            )
          }
        />
        <Route
          path="/edit-Profile"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSideNav>
                <OnBoardingPage isEditPage={true} />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboard"} />
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
