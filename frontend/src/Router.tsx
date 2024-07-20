import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./screens/auth/Login";
import Register from "./screens/auth/Register";
import Home from "./screens/home/Home";
import SocialLogin from "./screens/auth/SocialLogin";
import CreateStudyGroup from "./screens/studygroup/CreateStudyGroup";
import GroupList from "./screens/studygroup/GroupList";
import Profile from "./screens/user/Profile";
import SearchGroup from "./screens/studygroup/SearchGroup";
import Users from "./screens/user/Users";

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
        path: "socialLogin",
        element: <SocialLogin />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "createGroup",
        element: <CreateStudyGroup />,
      },
      {
        path: "groupList",
        element: <GroupList />,
      },

      {
        path: "searchGroup",
        element: <SearchGroup />,
      },
      {
        path: "manageUser",
        element: <Users />,
      },
    ],
  },
]);

export default router;
