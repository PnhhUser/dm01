import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "./pages/home";
import LoginPage, { action as loginAction } from "./pages/login";
import RegisterPage, { action as registerAction } from "./pages/register";
import { AuthProvider } from "./contexts/authContext";
import { PrivateUser } from "./components/privateUser";

function Router() {
  const routerApp = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <PrivateUser>
              <HomePage />
            </PrivateUser>
          }
        />
        <Route path="login" element={<LoginPage />} action={loginAction} />
        <Route
          path="register"
          element={<RegisterPage />}
          action={registerAction}
        />
      </Route>
    )
  );

  return (
    <AuthProvider>
      <RouterProvider router={routerApp} />
    </AuthProvider>
  );
}

export default Router;
