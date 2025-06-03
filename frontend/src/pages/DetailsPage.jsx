import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import DetailsItem from "../components/cards/DetailsItem";

const DetailsPage = ({handleAddtoCart}) => {
    const {name} = useParams()
    const [product, setProduct ] = useState({})
    
    useEffect(()=>{
        const fetchingProduct = async () => {
            const response = await fetch(`/products/${name}`)
            const data = await response.json()
            return setProduct(data)
        }
        fetchingProduct()
    },[name])
    
    
    return(
        <DetailsItem key = {product.id} name = {product.name} image = {product.image} description={product.description} price={product.price}  handleAddtoCart = {handleAddtoCart} />
    )

}

export default DetailsPage