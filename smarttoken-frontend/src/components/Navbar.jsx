import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <nav className="navbar-custom d-flex justify-content-between align-items-center">
            <h4>Smart Token System</h4>
            <button className="btn btn-danger" onClick={logout}>
                Logout
            </button>
        </nav>
    );
}

export default Navbar;