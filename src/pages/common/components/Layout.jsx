import { pageRoutes } from "@/apiRoutes";
import React from "react";
import { Navigate } from "react-router-dom";
import { NavigationBar } from "./NavigationBar";
import useAuthStore from "@/store/auth/useAuthStore";
import ToastPopup from "@/components/ToastPopup";

export const authStatusType = {
  NEED_LOGIN: "NEED_LOGIN",
  NEED_NOT_LOGIN: "NEED_NOT_LOGIN",
  COMMON: "COMMON",
};

export const Layout = ({
  children,
  containerClassName = "",
  authStatus = authStatusType.COMMON,
}) => {
  const { isLogin } = useAuthStore();

  if (authStatus === authStatusType.NEED_LOGIN && !isLogin) {
    return <Navigate to={pageRoutes.login} />;
  }

  if (authStatus === authStatusType.NEED_NOT_LOGIN && isLogin) {
    return <Navigate to={pageRoutes.main} />;
  }

  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col min-h-screen mt-24">
        <main className="flex-grow">
          <div className={`container mx-auto px-4 ${containerClassName}`}>
            {children}
          </div>
        </main>
      </div>
      <ToastPopup />
    </div>
  );
};
