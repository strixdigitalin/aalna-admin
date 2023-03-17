import "./App.css";
import AdminPortalLogin from "./LoginComponents/AdminPortalLogin";
import AdminPortalHome from "./MainComponents/AdminPortalHome";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import AdminPortalOrderDetails from "./MainComponents/AdminOrderDetails";
import ProductsOnSite from "./MainComponents/ProductsOnSite";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { initialState, reducer } from "./reducers/userReducer";
import UserDetails from "./MainComponents/UserDetails";
import BlogPage from "./MainComponents/Blogpage";
import FaqPage from "./MainComponents/Faqpage";
import CouponPage from "./MainComponents/CouponPage";
import BannerPage from "./MainComponents/BannerPage";
import TrendingPage from "./MainComponents/Trending";

export const UserContext = createContext();

const Routing = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) dispatch({ type: "USER", payload: user });
    else navigate("/");
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<AdminPortalLogin />} />
      <Route exact path="/Home" element={<AdminPortalHome />} />
      <Route exact path="/Products" element={<ProductsOnSite />} />
      <Route exact path="/OrderDetail" element={<AdminPortalOrderDetails />} />
      <Route exact path="/UserDetail" element={<UserDetails />} />
      <Route exact path="/BlogsPage" element={<BlogPage />} />
      {/* <Route exact path="/FAQPage" element={<FaqPage />} /> */}
      <Route exact path="/CouponPage" element={<CouponPage />} />
      <Route exact path="/BannerPage" element={<BannerPage />} />
      <Route exact path="/TrendingPage" element={<TrendingPage />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <UserContext.Provider value={{ state, dispatch }}>
        <BrowserRouter>
          <Routing />
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
