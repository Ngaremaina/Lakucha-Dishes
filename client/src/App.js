import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import FoodList from './components/FoodList';
import NavBar from './components/NavBar';
import DetailsPage from './components/DetailsPage';
import Login from './components/Login';
import Register from './components/Register';
import Contact from './components/Contact';
import Cart from './components/Cart';
import About from './components/About';

function App() {
  const [products, setProducts] = useState([])
  const [product, setProduct ] = useState({})
  
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
  const fetchingProduct = async (name) => {
    const response = await fetch(`/products/${name}`)
    const data = await response.json()
    return setProduct(data)
  }
  useEffect(() => {
    fetchingProducts()
  },[])

  const loginUser = (user) => {
    fetch("/users", {
      method:'POST',
      headers:{"Content-Type":"application/json", "Accept": "application/json"},
      body:JSON.stringify(user)
    })
    .then(res => res.json())
    
  }

  const registerUser = (user) => {
    fetch("/re",{
      method:"POST",
      headers:{"Content-Type":"application/json", "Accept": "application"},
      body:JSON.stringify(user)
    })
  }

  const handleAddtoCart = (name, price, description, image, quantity, total) => {
    // e.preventDefault();
     fetch("/cart",{
      method:"POST",
      headers:{"Content-Type":"application/json", "Accept": "application"},
      body:JSON.stringify({
        name:name,
        price:price,
        description:description,
        image:image,
        quantity:quantity, 
        total:total
      })
    })
  }

  const contactUser = (user) => {
    fetch("/contact",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify(user)
    })
  }

  return (
    <div className="App">
      <NavBar fetchCategory = {fetchCategory} fetchingProducts = {fetchingProducts}/>
      <Routes>
        <Route path="/" element = {<FoodList products={products} fetchCategory = {fetchCategory} handleAddtoCart={handleAddtoCart}/>}></Route>
        <Route path="/:name" element = {<DetailsPage getProduct={fetchingProduct} product={product} handleAddtoCart={handleAddtoCart}/>}></Route>
        <Route path ="/signin" element = {<Login loginUser={loginUser}/>}></Route>
        <Route path="/signup" element = {<Register registerUser = {registerUser} />}></Route>
        <Route path="/contact us" element = {<Contact contactUser = {contactUser}/>}></Route>
        <Route path="/mycart" element = {<Cart handleDelete={handleDelete}/>}></Route>
        <Route path="/about us" element = {<About />}></Route>
      </Routes>
      <Footer fetchCategory = {fetchCategory}/>
    </div>
  );
}

export default App;
