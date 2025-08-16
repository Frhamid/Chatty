import React from "react";
import NavBar from "./NavBar";
import SideNav from "./SideNav";

const Layout = ({ children, showSideNav = true }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSideNav && <SideNav />}
        <div className="flex-1 flex flex-col">
          <NavBar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
