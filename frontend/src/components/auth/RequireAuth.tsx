import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

export const RequireAuth = () => {
  const is_logged_in = useSelector((state: RootState) => {
    return state.authReducers.isLoggedIn;
  });

  const location = useLocation();

  return is_logged_in ? (
    <Outlet />
  ) : (
    // since user is not asking to be sent to the login page, they want to go to another page but we see that they didn't log in, so we send them to the log in page
    // in order to do so, we "replace" the "login" in usre's navigation history with the "location" where they come from
    <Navigate to="/login" state={{ from: location }} replace />
  );
};
