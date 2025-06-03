import axiosInstance from "../api/api"

export const getCategories = async (name) => {
    
    try{
        const response = await axiosInstance.get(`/category/${name}`)
        return response.data
    }
    catch (error) {
        console.error("Failed to fetch category:", error.message);
        throw error;
    }
}

export const getFoods = async () => {
    try{
        const response = await axiosInstance.get("/products")
        return response.data
    }
    catch (error) {
        console.error('Fetch foods error:', error.response?.data || error.message);
        throw error;
    }
}




export const addPayment = async (phone, total) => {
    let number = "254" + phone
    const phone_number = parseInt(number)
    const payload = {
        phone:phone_number,
        amount:total
    }
    try{
        const response = await axiosInstance.post('/payments', {
            payload
        })
        return await response.data
    }
    catch (error) {
        console.error('Error initializing payment:', error.response?.data || error.message);
        throw error;
    }

}

export const addShipping = async (location) => {
    try{
        const response = await axiosInstance.post('/shippings',{
            location
        })
        return await response.data
    }
    catch(error){
        console.error('Error adding location:', error.response?.data || error.message);
        throw error;
    }

  }