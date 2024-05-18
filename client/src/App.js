import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Footer from './components/Footer';
import FoodList from './components/FoodList';
import NavBar from './components/NavBar';
import DetailsPage from './components/DetailsPage';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';
import Cart from './components/Cart';
import About from './components/About';
import Checkout from './components/Checkout';
import Payment from './components/Payment';
import Menu from './components/Menu';
import { useAuth } from './components/Authentication';

function App() {
  const [products, setProducts] = useState([])
  const { userToken, admin } = useAuth();
  const navigate = useNavigate()
  const fetchCategory = async (name) => {
    const response = await fetch(`/category/${name}`)
    const data = await response.json()
    return setProducts(data.product)
  }

  const fetchingProducts = async () => {
    const response = await fetch("/products")
    const data = await response.json()
    return setProducts(data)
  }
  
  useEffect(() => {
    fetchingProducts()
  },[])

  const handleAddtoCart = (name, price, description, image, quantity, total) => {
     fetch("/cart",{
      method:"POST",
      headers:{"Content-Type":"application/json", "Accept": "application"},
      body:JSON.stringify({
        name:name,
        price:price,
        description:description,
        image:image,
        quantity:quantity, 
        total:total,
        auth_id:admin.id
      })
    })
  }

  const contactUser = (user) => {
    fetch("/contact",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(user)
    })
    .then(response => {
      if (response.status === 200){
        console.log("sucess")
      }
    })
  }

  const addShipping = (location) => {
    fetch("/shippings",{
      method:"POST", 
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(location)
    })
    .then(response => {
      if (response.status === 200){
        navigate("/payment")
        response.json()
      }
    })
    .catch(err => console.log(err))

  }

  const addPayment = (phone, total) => {
    let number = "254" + phone
    const phone_number = parseInt(number)
    fetch("/payments", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        phone:phone_number,
        amount:total
      })
    })

  }

  const addSales =(quantity, amount,name) => {
    fetch("/sales",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        quantity:quantity,
        amount:amount,
        name:name
      })
    })
    .then(response => {
      if (response.status === 200){
        response.json()
      }
    })
  }

  const registerUser = (user) => {
    fetch("/register",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(user)
    })
   .then(response => {
    if (response.status === 200) {
      navigate("/signin")
    }
   })
  }


  return (
    <div className="App">
      {userToken && (
        <>
        <NavBar fetchCategory = {fetchCategory} fetchingProducts = {fetchingProducts}/>
        <Routes>
          <Route path="/dashboard" element = {<FoodList products={products} fetchCategory = {fetchCategory} handleAddtoCart={handleAddtoCart}/>}></Route>
          <Route path="/:name" element = {<DetailsPage handleAddtoCart={handleAddtoCart}/>}></Route>
          <Route path="/contact us" element = {<Contact contactUser = {contactUser}/>}></Route>
          <Route path="/mycart" element = {<Cart addSales={addSales}/>}></Route>
          <Route path="/about us" element = {<About />}></Route>
          <Route path="/checkout" element = {<Checkout addShipping={addShipping}/>}></Route>
          <Route path="payment" element = {<Payment addPayment={addPayment} />}></Route>
          <Route path="/menu" element = {<Menu products={products} fetchCategory = {fetchCategory}/>}></Route>

        </Routes>
        <Footer fetchCategory = {fetchCategory}/>
        </>
      )}
      {!userToken && (
        <Routes>
          <Route path ="/*" element = {<Login />}></Route>
          <Route path="/signup" element = {<Register registerUser={registerUser}/>}></Route>
        
        </Routes>)}
      
    </div>
  );
}

export default App;
