import React from "react";
import { useRoutes,Outlet } from "react-router";
import LandingPage from "./views/LandingPage";
import Register from "./views/Register";
import './App.css';


function App() {
const routes = useRoutes([
  {
    path: '/',
    element: <LandingPage/>
  },
  {
    path: '/register',
    element: <Register/>
  }
]);

return routes;
}

export default App;
