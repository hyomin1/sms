import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import Home from "./screens/home/Home";
import KakaoLogin from "./screens/auth/KakaoLogin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "kakaoLogin",
        element: <KakaoLogin />,
      },
      {
        path: "home",
        element: <Home />,
      },
    ],
  },
]);

export default router;
