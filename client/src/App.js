import './App.css';
import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/Footer';
import FoodList from './components/FoodList';
import NavBar from './components/NavBar';
import DetailsPage from './components/DetailsPage';

function App() {
  const [products, setProducts] = useState([])
  const [product, setProduct ] = useState({})

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

  console.log(products)
  

  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element = {<FoodList products={products} />}></Route>
        <Route path="/:name" element = {<DetailsPage getProduct={fetchingProduct} product={product}/>}></Route>
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
