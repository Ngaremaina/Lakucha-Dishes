import React from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Signup = () => {
    return(
        <Form className = "">
            <h3 className="d-flex justify-content-center mb-3 mt-3">Sign Up Form</h3>
            <Form.Group controlId = "formBasicFirstName" className="p-2 mb-2">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter first name" />
                <Form.Text className="text-muted">Please Enter your First Name</Form.Text>
            </Form.Group>
            <Form.Group controlId = "formBasicLastName" className="p-2 mb-2">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter last name" />
                <Form.Text className="text-muted">Please Enter your Last Name</Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicEmail" className="p-2 mb-2">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">Please Enter your Email Address</Form.Text>
            </Form.Group>
            <Form.Group controlId = "formBasicPassword" className="p-2 mb-2">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="enter password"/>
                <Form.Text className="text-muted">Enter your password</Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit" className="mb-2">Submit</Button>
        </Form>
    )

}

export default Signup