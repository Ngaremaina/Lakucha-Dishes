import React from "react";
import Form  from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
const Login = () => {
    return(
        <Form>
            <h3>Sign Up</h3>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" />
                <Form.Text className="text-muted">Please Enter your Email Address</Form.Text>
                
            </Form.Group>
            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" />
                <Form.Text className="text-muted">Please Enter your Password</Form.Text>
            </Form.Group>
            <Button variant="primary">Submit</Button>
        </Form>
    )

}

export default Login