import locationHelperBuilder from "redux-auth-wrapper/history4/locationHelper";
import { connectedRouterRedirect } from "redux-auth-wrapper/history4/redirect";
// import { createBrowserHistory } from "history";
import LoadingSpinner from "../components/loading/LoadingSpinner";

const locationHelper = locationHelperBuilder({});
// const browserHistory = createBrowserHistory();

export const UserIsAuthenticated = connectedRouterRedirect({
  wrapperDisplayName: "UserIsAuthenticated",
  AuthenticatingComponent: LoadingSpinner,
  allowRedirectBack: true,
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || "/login",
  authenticatingSelector: ({ firebase: { auth, profile, isInitializing } }) =>
    !auth.isLoaded || isInitializing === true,
  authenticatedSelector: ({ firebase: { auth } }) =>
    auth.isLoaded && !auth.isEmpty,
});

export const UserIsNotAuthenticated = connectedRouterRedirect({
  wrapperDisplayName: "UserIsNotAuthenticated",
  AuthenticatingComponent: LoadingSpinner,
  allowRedirectBack: false,
  redirectPath: (state, ownProps) =>
    locationHelper.getRedirectQueryParam(ownProps) || "/",
  authenticatingSelector: ({ firebase: { auth, isInitializing } }) =>
    !auth.isLoaded || isInitializing === true,
  authenticatedSelector: ({ firebase: { auth } }) =>
    auth.isLoaded && auth.isEmpty,
});
