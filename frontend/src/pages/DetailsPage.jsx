import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import DetailsItem from "../components/cards/DetailsItem";
import { getEachFood } from "../services/Products";
import Loader from "../components/loader/Loader";

const DetailsPage = () => {
    const { name } = useParams()
    const [product, setProduct ] = useState({})
    const [loading, setLoading] = useState(false)
    
    useEffect(()=>{
        const fetchingProduct = async () => {
            setLoading(true);
            try {
                const response = await getEachFood(name);
                setProduct(response);
            } catch (err) {
                console.error("Error fetching product:", err);
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        }
        fetchingProduct()
    },[name])

    if (loading) return <Loader/>
    
    
    return(
        <DetailsItem 
            key = {product.id} 
            name = {product.name} 
            image = {product.image} 
            description={product.description} 
            price={product.price}/>
    )

}

export default DetailsPage