import './App.css';
import React, { useEffect, useState } from 'react';
import AddTicket from './addTicket/AddTicket';
import UpdateTicket from './updateTicket/UpdateTicket';
import Tickets from './getTickets/Tickets';
import Login from './login/Login';
import {createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function App() {
  // Function to check if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    return token !== null;
  });

  useEffect(() => {
  }, [isAuthenticated]);

  const route = createBrowserRouter([
    {
      path: "/",
      element: isAuthenticated ? <Navigate to="/tickets" /> : <Login />,
    },
    {
      path: "/add",
      element: isAuthenticated ? <AddTicket setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />,
    },
    {
      path: "/update/:id",
      element: isAuthenticated ? <UpdateTicket setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />,
    },
    {
      path: "/tickets",
      element: isAuthenticated ? <Tickets setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />,
    },
  ]);

  return (
    <div className="App">
      <RouterProvider router = {route}></RouterProvider>
    </div>
  );
}

export default App;
