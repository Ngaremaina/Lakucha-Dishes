import React, { useState } from "react";

const Checkout = ({addShipping}) => {
    const [shipping, setShipping] = useState({
      firstname:"",
      lastname:"",
      address:"",
      city:"",
      region:"",
    })
    const handleSubmit = (event) => {
      event.preventDefault()
      // console.log(shipping)
      addShipping(shipping)
    }
    const handleChange = (event) => {
      const input = event.target.id
      const value = event.target.value

      setShipping(prev => {return {...prev, [input]:value}})

    }
    return(
        <div className="card">
          <div className="row d-flex justify-content-center">
          <div className="col-md-7 col-lg-8">
              <div className="card mb-4">
                <div className="card-header py-3">
                  <h4 className="mb-0">Shipping Address</h4>
                </div>
                <div className="card-body">
                  <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                    <div className="row g-3">
                    <div className="col-sm-6 my-1">
                        <label className="form-label">
                          First name
                        </label>
                        <input type="text" className="form-control" id="firstname" placeholder="John" value={shipping.firstname} required onChange={handleChange}/>
                        <div className="invalid-feedback">
                          Valid first name is required.
                        </div>
                      </div>
                      <div className="col-sm-6 my-1">
                        <label className="form-label">
                          Last name
                        </label>
                        <input type="text" className="form-control" id="lastname" placeholder="Doe" value={shipping.lastname} required onChange={handleChange}/>
                        <div className="invalid-feedback">
                          Valid last name is required.
                        </div>
                      </div>
                      <div className="col-12 my-1">
                        <label className="form-label">
                          Address
                        </label>
                        <input type="text" className="form-control" id="address" placeholder="1234 Main St" value={shipping.address} required onChange={handleChange}/>
                        <div className="invalid-feedback">
                          Please enter your shipping address.
                        </div>
                      </div>

                      <div className="col-sm-6 y-1">
                        <label className="form-label">
                          Region
                        </label>
                        <br />
                        <select className="form-select" id="region" value={shipping.region} required onChange={handleChange}>
                          <option value="">Choose...</option>
                          <option>Nairobi</option>
                        </select>
                        <div className="invalid-feedback">
                          Please select a valid region.
                        </div>
                      </div>

                      <div className="col-sm-6 my-1">
                        <label className="form-label">
                          City
                        </label>
                        <br />
                        <select className="form-select" id="city" value={shipping.city} required onChange={handleChange}>
                          <option value="">Choose...</option>
                          <option>Utawala</option>
                        </select>
                        <div className="invalid-feedback">
                          Please provide a valid city.
                        </div>
                      </div>
                    </div>
                    <hr className="my-4" />

                    <button className="btn btn-primary" type="submit">
                      Save
                    </button>
                  </form>
                </div>
              </div>
            </div>
          
          </div>
        </div>
        
    )

}

export default Checkout