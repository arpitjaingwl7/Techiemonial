import { BrowserRouter, Route, Routes } from "react-router";
import Footer from "./Component/Footer";
import Navbar from "./Component/Navbar";
import Login from "./Component/login";
import Signup from "./Component/signup";
import Body from "./body";



function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="/" element={<Body/>}>
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<Signup />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
