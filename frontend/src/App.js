import React from "react";
import { useRoutes,Outlet } from "react-router";
import LandingPage from "./views/LandingPage";
import Register from "./views/Register";
import Login from "./views/Login";
import Dashboard from "./views/Dashboard";
import './App.css';
import OTP from "./views/OTP";
import Post from "./views/Post";
import PostDetails from "./views/PostDetails";


function App() {
const routes = useRoutes([
  {
    path: '/',
    element: <LandingPage/>
  },
  {
    path: '/register',
    element: <Register/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/dashboard',
    element: <Dashboard/>
  },
  {
    path: '/otp',
    element: <OTP/>
  },
  {
    path: '/post',
    element: <Post/>
  },{
    path: '/postdetails',
    element: <PostDetails/>
  }
]);

return routes;
}

export default App;
