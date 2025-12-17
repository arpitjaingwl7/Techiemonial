import { BrowserRouter, Route, Routes } from "react-router";
import Footer from "./Component/Footer";
import Navbar from "./Component/Navbar";
import TechieFeed from "./Component/Feed";
import LoginPage from "./Component/Login";
// import Signup from "./Component/Signup";
import MatchPage from "./Component/MatchPage";
import Body from "./Body";
import { Provider } from 'react-redux'
import { store } from './store.jsx'
import RequestPage from "./Component/RequestPage.jsx";
import ProfilePage from "./Component/Profile.jsx";
import SurprizePage from "./Component/Surprise.jsx";
import PaymentPage from "./Component/Payment.jsx";


function App() {
  return (
    <>
    <Provider store={store}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body/>}>
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/signup" element={<Signup />} /> */}
            <Route path="/feed" element={<TechieFeed/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/matches" element={<MatchPage />} />
            <Route path="/requests" element={<RequestPage/>} />
            <Route path="/surprize" element={<SurprizePage/>} />
            <Route path="/payment" element={<PaymentPage/>} />

          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
