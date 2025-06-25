import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
// import Auth from './components/AuthFiles/Login.jsx';
// import Home from './components/HomeEntre.jsx';
import LoginE from './components/Authfiles/LoginE.jsx';
import LoginIn from './components/Authfiles/LoginIn.jsx';
import RegisterE from './components/Authfiles/RegisterEntre.jsx';
import RegisterIn from './components/Authfiles/RegisterInvestor.jsx';
import RegisterSelection from './components/Authfiles/RegisterSelection.jsx';
import CompleteEntreRegister from './components/Authfiles/CompleteEntreRegister.jsx';
import CompleteInvestorRegister from './components/Authfiles/CompleteInvestorRegister.jsx';
import HomeEntre from './components/HomeEntre.jsx';
import HomeInvestor from './components/HomeInvestor.jsx';
import EntreConnect from './components/EntreConnect.jsx';
import InvestorProfile from './components/ListOfInvestors/InvestorProfile.jsx';
import ChatBox from './components/Chatbox/chatbox.jsx';
import EntrepreneurProfile from './components/ListEntre.jsx';
// import ProfileInvestors from './components/ProfileInvestors.jsx';
// import ProfileInvestors from './components/ProfileInvestor.jsx';
import ProfileInvestors from './components/ProfileInvestor.jsx';
import ProfileEntre from './components/ProfileEntre.jsx';
import ChatPage from './components/ChatPages/ChatPage.jsx';
import AboutUs from './components/AboutUs.jsx';
import Contact from './components/Contact.jsx';
import Feedback from "./components/FeedbackPage.jsx";

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
        path: "/login/investor",
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
        path: "/complete-registration/entrepreneur",
        element: <><CompleteEntreRegister /></>
      },
      {
        path: "/complete-registration/investor",
        element: <><CompleteInvestorRegister /></>
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
        path: "/investor/ListOfEntre",
        element: <><EntrepreneurProfile /></>
      },
      {
        path: "/chatbox/:emailid",
        element: <><ChatBox /></>
      },
      {
        path: "/profileIn/:emailid",
        element: <><ProfileInvestors /></>
      },
      {
        path: "/profileE/:emailid",
        element: <><ProfileEntre/></>
      },
      {
        path: "/chatpage/:emailid?",
        element: <><ChatPage/></>
      },
      {
        path: "/about",
        element: <><AboutUs/></>
      },
      {
        path: "/contact",
        element: <><Contact/></>
      },
      {
        path: "/feedback",
        element: <><Feedback/></>
      },
    ])
    return <RouterProvider router={router} />;
}
export default App;
