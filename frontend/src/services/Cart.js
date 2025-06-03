import axiosInstance from "../api/api"

export const getCartItems = async (adminId) => {
    try{
        const response = await axiosInstance.get(`/users/${adminId}`)
        return await response.data
    }
    catch (error) {
        console.error('Login error:', error.response?.data || error.message);
        throw error;
    }
}

export const updateCart = async (id, name, price, description, image, total, quantity, adminId) => {
    try{
        let product = {
            name:name,
            description:description,
            price:price,
            quantity:quantity,
            image:image,
            total:total,
            auth_id: adminId,
            
        }
        const response = await axiosInstance.patch(`/cart/${id}`, product)

        return await response.data
    }
        

    catch (error) {
        console.error('Update cart error:', error.response?.data || error.message);
        throw error;
    }
}

export const handleDelete = async (id) => {
    try{
        const response = await axiosInstance.delete(`/cart/${id}`)
        return response.data
    }
    catch (error) {
        console.error('Delete Cart Item error:', error.response?.data || error.message);
        throw error;
    }
    
}
    
export const handleAddtoCart = async (name, price, description, image, quantity, total, adminId) => {
    const payload = {
        name:name,
        price:price,
        description:description,
        image:image,
        quantity:quantity, 
        total:total,
        auth_id:adminId
      }
    try{
        const response = await axiosInstance.post('/cart', payload)
        return await response.data
    }
    catch (error) {
        console.error('Error adding to cart:', error.response?.data || error.message);
        throw error;
    }
    
}