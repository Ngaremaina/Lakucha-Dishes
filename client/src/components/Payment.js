import React, { useEffect, useState } from "react";


const Payment = ({addPayment}) => {
    const [sales, setSales] = useState([])
    useEffect(() => {
        const getSales = async () => {
            const response = await fetch("/sales")
            const data = await response.json()
            return setSales(data)
        }
        getSales()

    },[])
    // console.log(sales)

    let total = 0
    let items = 0
    let allPrices = []
    let allitems = []

    sales?.map(sale => {
        allitems.push(sale.quantity)
        allPrices.push(sale.amount)
        return null
    })
    const grandTotal = allPrices.reduce((accumulator, currentValue) => accumulator + currentValue, total)
    var totalPrice =  grandTotal + 250
    const granditems = allitems.reduce((accumulator, currentValue) => accumulator + currentValue, items)

    // console.log(grandTotal)
    // console.log(granditems, totalPrice)
    

    const [payment, setPayment] = useState({
        phone:"",
        amount:grandTotal
    })
    const handleSubmit = (event) => {
        event.preventDefault()
        // console.log(payment)
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
                        <div className="card-header">
                            Order Summary
                        </div>
                        <div className="card-body">
                        <table class="table">
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