import React, { useEffect, useState } from 'react';
import "./addticket.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddTicket = ({ setIsAuthenticated }) => {
    const tickets = {
        user_id: 0,
        name: "",
        email: "",
        subject: "",
        message: "",
        category: "",
        priority: ""
    }

    // Error messages
    const [errorMessages, setErrorMessages] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: '',
        priority: '',
    });

    const [ticket, setTicket] = useState(tickets);
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const {name, value} = e.target

        setTicket({...ticket, [name]: value});
    }

    const validateForm = () => {
        let errors = {};

        // Regular expression to validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Check for required fields
        if (!ticket.name) errors.name = 'Name is required!';
        if (!ticket.email) {
            errors.email = 'Email is required!';
        } else if (!emailRegex.test(ticket.email)) {
            errors.email = 'Invalid email format!';
        }
        if (!ticket.subject) errors.subject = 'Subject is required!';
        if (!ticket.message) errors.message = 'Message is required!';
        if (!ticket.category) errors.category = 'Category is required!';
        if (!ticket.priority) errors.priority = 'Priority is required!';
    
        return errors;
    };

    const submitForm = async(e) => {
        e.preventDefault();

        // Validate form before submitting
        const errors = validateForm();

        // Get token from localStorage
        const token = localStorage.getItem("token");

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);  // Set errors to the state
            return; // Stop form submission if there are errors
        }

        await axios.post("http://localhost:8000/api/add/ticket", ticket, {
            headers: {
                Authorization: `Bearer ${token}`, // Pass token in Authorization header
            }
        })
        .then((response) => {
            toast.success(response.data.message, {position: "top-right"});
            navigate("/");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    // Logout function
    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem("token"); // Adjust the key based on your app
        localStorage.removeItem("user");

        // Update authentication state
        setIsAuthenticated(false);

        toast.success("Logged out successfully", {position: "top-right"});
    };

    return (
        <div>
            <div className="logout-container">
                <button className="btn btn-danger logout-btn" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            </div>
            <div className="addTicket" onSubmit={ submitForm }>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title"><i className="fa fa-pencil"></i> Add Ticket</h5>
                    </div>
                    <div className="card-body">
                        <form className="addTicketForm">
                            <Link to="/" type="button" className="btn btn-secondary back-btn">
                                <i className="fa-solid fa-backward"></i> Back
                            </Link>
                            <div className="inputGroup row mb-4">
                                <label htmlFor="name" className="col-sm-2 fw-bold"><span class="required">* </span>Name</label>
                                <div className="col-sm-10">
                                    <input type="text" id="name" name="name" placeholder="Name" className="form-control" onChange={inputHandler} />
                                    {errorMessages.name && <div style={{ color: 'red' }}>{errorMessages.name}</div>}
                                </div>
                            </div>
                            <div className="inputGroup row mb-4">
                                <label htmlFor="email" className="col-sm-2 fw-bold"><span class="required">* </span>Email</label>
                                <div className="col-sm-10">
                                    <input type="text" id="email" name="email" placeholder="Email" className="form-control" onChange={inputHandler} />
                                    {errorMessages.email && <div style={{ color: 'red' }}>{errorMessages.email}</div>}
                                </div>
                            </div>
                            <div className="inputGroup row mb-4">
                                <label htmlFor="subject" className="col-sm-2 fw-bold"><span class="required">* </span>Subject</label>
                                <div className="col-sm-10">
                                    <input type="text" id="subject" name="subject" placeholder="Subject" className="form-control" onChange={inputHandler} />
                                    {errorMessages.subject && <div style={{ color: 'red' }}>{errorMessages.subject}</div>}
                                </div>
                            </div>
                            <div className="inputGroup row mb-4">
                                <label htmlFor="message" className="col-sm-2 fw-bold"><span class="required">* </span>Message</label>
                                <div className="col-sm-10">
                                    <textarea id="message" name="message" placeholder="Message" className="form-control" onChange={inputHandler} />
                                    {errorMessages.message && <div style={{ color: 'red' }}>{errorMessages.message}</div>}
                                </div>
                            </div>
                            <div className="inputGroup row mb-4">
                                <label htmlFor="category" className="col-sm-2 fw-bold"><span class="required">* </span>Category</label>
                                <div className="col-sm-10">
                                    <select id="category" name="category" className="form-control form-select" onChange={inputHandler} >
                                        <option value="">-- Select Category --</option>
                                        <option value="General">General</option>
                                        <option value="Technical">Technical</option>
                                        <option value="Billing">Billing</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    {errorMessages.category && <div style={{ color: 'red' }}>{errorMessages.category}</div>}
                                </div>
                            </div>
                            <div className="inputGroup row mb-4">
                                <label htmlFor="priority" className="col-sm-2 fw-bold"><span class="required">* </span>Priority</label>
                                <div className="col-sm-10">
                                    <select id="priority" name="priority" className="form-control form-select" onChange={inputHandler} >
                                        <option value="">-- Select Priority --</option>
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                    {errorMessages.priority && <div style={{ color: 'red' }}>{errorMessages.priority}</div>}
                                </div>
                            </div>
                            <div className="inputGroup submit">
                                <button type="submit" className="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default AddTicket;