import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./Authentication";
import { getCategories, getFoods } from "../services/Products";
import { getCartItems } from "../services/Cart";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const { userToken, admin } = useAuth();
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState([])

  const fetchCategory = async (name) => {
    try {
      const response = await getCategories(name);
      setCategories(response?.product);
      return response;
    } catch (error) {
      console.error("Failed to fetch category:", error.message);
    }
  };

  const fetchCart = async () => {
    try {
      const response = await getCartItems(admin.id);
      setCartItems(response.cart);
    } catch (err) {
      console.error("Error fetching cart items", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getFoods();

      setProducts(response);
      return response;
    } catch (error) {
      console.error("Failed to fetch products:", error.message);
    }
  };

  useEffect(() => {
    if (!userToken) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        if (userToken) {
          await Promise.all([
            fetchProducts(),
            fetchCategory(),
            fetchCart()
          ]);
        }
      } catch (err) {
        console.error("Global fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userToken]);
  return (
    <GlobalContext.Provider
      value={{
        userToken,
        loading,
        fetchCategory,
        fetchProducts,
        fetchCart,
        products,
        categories,
        cartItems
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);
