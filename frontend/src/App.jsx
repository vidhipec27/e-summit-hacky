import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import Auth from './components/AuthFiles/Login.jsx';
import Home from './components/Home.jsx';
import Login from './components/components/Login.jsx';
import Register from './components/components/Register.jsx';
function App() {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <Navigate to = "/register" replace />
      },
      {
        path: "/login",
        element: <><Login /></>
      },
      {
        path: "/register",
        element: <><Register /></>
      },
      {
        path: "/Home",
        element: <><Home /></>
      },
    ])
    return <RouterProvider router={router} />;
}
export default App;
