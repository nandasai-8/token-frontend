import React, { useState } from "react";
import axios from "axios";
import "../styles/Login.css";
function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:7985/auth/login", {
                email,
                password
            });

            localStorage.setItem("token", res.data);
            alert("Login Successful");
            window.location.href = "/dashboard";

        } catch (err) {
            alert("Invalid Credentials");
        }
    };
    return (
        <div className="login-wrapper">

            <div className="neon-card">
                <h1 className="brand">SMART TOKEN</h1>

                <div className="input-group">
                    <input
                        type="email"
                        required
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label>Email</label>
                </div>

                <div className="input-group">
                    <input
                        type="password"
                        required
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label>Password</label>
                </div>

                <button className="neon-btn" onClick={handleLogin}>
                    LOGIN
                </button>

                <p className="switch-link">
                    No account? <a href="/register">Create one</a>
                </p>
            </div>

        </div>
    );

}

export default Login;