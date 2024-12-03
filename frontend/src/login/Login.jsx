import React, { useEffect, useState } from 'react';
import "./login.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:8000/api/login', { email, password });

            // Store token and user information in localStorage
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("user", JSON.stringify(response.data.user));

            toast.success(response.data.message, { position: "top-right" });

            setTimeout(() => {
                setIsLoading(false);
                window.location.href = "/tickets"; // Redirect to the tickets page
            }, 1500);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setError(error.response?.data?.message || "Login failed. Please try again.");
            toast.error(error.response?.data?.message || "An error occurred.", { position: "top-right" });
        }
    };
    
    return (
        <div className="login">
            <h1 className="login-title">Login</h1>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <div className="inputGroup">
                    <label htmlFor="email" className="fw-bold"><i className="fa-solid fa-user"></i> Email</label>
                    <div className="inputField">
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
                    </div>
                </div>
                <div className="inputGroup">
                    <label htmlFor="password" className="fw-bold"><i className="fa-solid fa-lock"></i> Password</label>
                    <div className="inputField">
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
                    </div>
                </div>
                <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-login" disabled={isLoading}>
                    {isLoading ? (
                        <>
                            <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                            ></span>{" "}
                            Logging in...
                        </>
                    ) : (
                        "Login"
                    )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Login;