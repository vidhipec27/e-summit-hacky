import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import Auth from './components/AuthFiles/Login.jsx';
import Home from './components/Home.jsx';
import LoginE from './components/Authfiles/LoginE.jsx';
import LoginIn from './components/Authfiles/LoginIn.jsx';
import RegisterE from './components/Authfiles/RegisterEntre.jsx';
import RegisterIn from './components/Authfiles/RegisterInvestor.jsx';
import RegisterSelection from './components/Authfiles/RegisterSelection.jsx';

function App() {
    const router = createBrowserRouter([
      {
        path: "/",
        element: <><RegisterSelection /></>
      },
      {
        path: "/login/entrepreneur",
        element: <><LoginE /></>
      },
      {
        path: "/login/mentor",
        element: <><LoginIn /></>
      },
      {
        path: "/register/entrepreneur",
        element: <><RegisterE /></>
      },
      {
        path: "/register/mentor",
        element: <><RegisterIn /></>
      },
      {
        path: "/Home",
        element: <><Home /></>
      },
    ])
    return <RouterProvider router={router} />;
}
export default App;
