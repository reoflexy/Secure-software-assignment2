import React from "react";
import { useRoutes,Outlet } from "react-router";
import LandingPage from "./views/LandingPage";
import './App.css';


function App() {
const routes = useRoutes([
  {
    path: '/',
    element: <LandingPage/>
  }
]);

return routes;
}

export default App;
