import React, { useState } from "react";
import axios from "axios";
import "../styles/Register.css";
function Register() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try {
            await axios.post("http://localhost:7984/auth/register", {
                email,
                password
            });

            alert("Registered Successfully");
            window.location.href = "/";

        } catch (err) {
            alert("Registration Failed");
        }
    };

    return (
        <div className="register-page">

            <div className="register-card">

                <h2>Create Account</h2>
                <p className="subtitle">Join Smart Token System</p>

                <input
                    type="email"
                    placeholder="Enter Email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button onClick={handleRegister}>
                    Register
                </button>

                <p className="login-link">
                    Already have an account? <a href="/">Login</a>
                </p>

            </div>

        </div>
    );
}

export default Register;