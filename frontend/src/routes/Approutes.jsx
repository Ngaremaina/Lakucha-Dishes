import { Routes, Route } from "react-router-dom"
import { useAuth } from "../context/Authentication";
import NavBar from "../components/header/NavBar"
import FoodList from "../pages/FoodList"
import DetailsPage from "../pages/DetailsPage"
import Contact from "../pages/Contact"
import Cart from "../pages/Cart"
import About from "../pages/About"
import Checkout from "../pages/Checkout"
import Menu from "../pages/Menu"
import Payment from "../pages/Payment"
import Footer from  "../components/footer/Footer"
import Login from "../pages/Login"
import Register from "../pages/Register"
import { useGlobal } from "../context/GlobalContext";
import Loader from "../components/loader/Loader"

export default function AppRoutes(){
    const { userToken, loading: authLoading  } = useAuth();
    const { fetchCategory, fetchProducts, loading: dataLoading } = useGlobal();

   if (authLoading || dataLoading) return <Loader/>;

    return(
        <>
        {userToken && <NavBar fetchCategory={fetchCategory} fetchingProducts={fetchProducts} />}
      
        <Routes>
            {/* Protected Routes */}
            {userToken ? (
              <>
                <Route path="/dashboard" element={<FoodList/>} />
                <Route path="/:name" element={<DetailsPage />} />
                <Route path="/contact us" element={<Contact />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about us" element={<About />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/menu" element={<Menu />} />
    
              </>
            ) : (
              <>
                <Route path="/signin" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                {/* Redirect all other paths to login */}
                <Route path="/*" element={<Login />} />
              </>
            )}
        </Routes>
       
      {userToken && <Footer fetchCategory = {fetchCategory}/>}
      </>
    )
}