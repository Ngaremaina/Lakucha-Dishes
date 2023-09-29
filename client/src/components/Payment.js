import React, { useEffect, useState } from "react";


const Payment = ({addPayment}) => {
    const [products, setProducts] = useState([])
    useEffect(() => {
        const getSales = async () => {
            const response = await fetch("/cart")
            const data = await response.json()
            return setProducts(data)
        }
        getSales()

    },[])
    let allPrices = []
    let allitems = []

    products?.map(item => {
        allPrices.push(item.total)
        allitems.push(item.quantity)
        return null
    })
    let grandPrice = 0
    let totalitems = 0
    const grandTotal = allPrices.reduce((accumulator, currentValue) => accumulator + currentValue, grandPrice)
    const totalPrice =  grandTotal + 250
    const granditems = allitems.reduce((accumulator, currentValue) => accumulator + currentValue, totalitems)

    const [payment, setPayment] = useState({
        phone:"",
        amount:totalPrice
    })
    const handleSubmit = (event) => {
        event.preventDefault()
        addPayment(payment)
      }
      const handleChange = (event) => {
        const input = event.target.id
        const value = event.target.value
        setPayment(prev => {return {...prev, [input]:value}})
      }

    return(
        <div className="card">
          <div className="row d-flex justify-content-center">
          <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">MPESA Payment</h4>
                </div>
                <div className="row d-flex justify-content-center">
                    <div className="col-md-5">
                        <h4 className="text-center">
                            Order Summary
                        </h4>
                        <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                <th scope="col">Items</th>
                                <th scope="col">Shipping Fees</th>
                                <th scope="col">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td>{granditems}</td>
                                <td>250</td>
                                <td>{totalPrice}</td>
                                </tr>                               
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                  <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="row g-3">
                    <div className="col-sm-2 my-1">
                        <label className="form-label">
                          Prefix
                        </label>
                       <p className="mt-2">+254</p>
                    </div>

                    <div className="col-sm-6 my-1">
                        <label className="form-label">
                          Phone Number
                        </label>
                        <input type="number" className="form-control" id="phone" placeholder="712345678" value={payment.phone} required onChange={handleChange}/>
                        <div className="invalid-feedback">
                          Valid number is required.
                        </div>
                    </div>                    
                      
                    </div>
                    <hr className="my-4" />

                    <button className="btn btn-primary" type="submit">
                      Pay
                    </button>
                  </form>
                </div>
              </div>
            </div>
          
          </div>
        </div>
        
    )

}

export default Payment