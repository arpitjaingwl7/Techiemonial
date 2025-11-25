import { BrowserRouter, Route, Routes } from "react-router";
import Footer from "./Component/Footer";
import Navbar from "./Component/Navbar";
import TechieFeed from "./Component/Feed";
import LoginPage from "./Component/login";
import Signup from "./Component/signup";
import MatchPage from "./Component/MatchPage";
import Body from "./body";
import { Provider } from 'react-redux'
import { store } from './store.jsx'
import RequestPage from "./Component/RequestPage.jsx";
import ProfilePage from "./Component/Profile.jsx";



function App() {
  return (
    <>
    <Provider store={store}>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body/>}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/feed" element={<TechieFeed/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/matches" element={<MatchPage />} />
            <Route path="/requests" element={<RequestPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
