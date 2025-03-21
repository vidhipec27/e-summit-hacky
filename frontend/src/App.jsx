import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import Auth from './components/AuthFiles/Login.jsx';
// import Home from './components/HomeEntre.jsx';
import LoginE from './components/Authfiles/LoginE.jsx';
import LoginIn from './components/Authfiles/LoginIn.jsx';
import RegisterE from './components/Authfiles/RegisterEntre.jsx';
import RegisterIn from './components/Authfiles/RegisterInvestor.jsx';
import RegisterSelection from './components/Authfiles/RegisterSelection.jsx';
import HomeEntre from './components/HomeEntre.jsx';
import HomeInvestor from './components/HomeInvestor.jsx';
import EntreConnect from './components/EntreConnect.jsx';
import InvestorProfile from './components/ListOfInvestors/InvestorProfile.jsx';
import ChatPage from './components/Chatbox/chatbox.jsx';
// import ProfileInvestors from './components/ProfileInvestors.jsx';
// import ProfileInvestors from './components/ProfileInvestor.jsx';
import ProfileInvestors from './components/ProfileInvestor.jsx';

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
        path: "/entreconnect",
        element: <><EntreConnect /></>
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
        path: "/Home/entrepreneur",
        element: <><HomeEntre /></>
      },
      {
        path: "/Home/investor",
        element: <><HomeInvestor /></>
      },
      {
        path: "/entrepreneur/ListOfInvestors",
        element: <><InvestorProfile /></>
      },
      {
        path: "/chatbox/:emailid",
        element: <><ChatPage /></>
      },
      {
        path: "/profileIn/:emailid",
        element: <><ProfileInvestors /></>
      },
    ])
    return <RouterProvider router={router} />;
}
export default App;
