import React, { useEffect, useState } from 'react';
import "./updateticket.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateTicket = ({ setIsAuthenticated }) => {
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

    // Get logged in user info
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.id : null;
    const user_name = user ? user.name : null;
    const user_group = user ? user.user_group : null;

    // Get ticket by id
    const [ticket, setTicket] = useState(tickets);
    const navigate = useNavigate();
    const { id } = useParams();
    const inputHandler = (e) => {
        const {name, value} = e.target
        setTicket({...ticket, [name]: value});
    }
    
    // Ticket replies / comments
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const [users, setUsers] = useState([]); // State to store users

    useEffect(() => {
        // Fetch ticket details
        axios.get(`http://localhost:8000/api/ticket/${id}`)
        .then((response) => {
            setTicket(response.data)
        })
        .catch((error) => {
            console.log(error);
        });

        // Fetch comments for the ticket
        axios.get(`http://localhost:8000/api/ticket/replies/${id}`)
        .then((response) => {
            setComments(response.data.replies);
        })
        .catch((error) => {
            console.log(error);
        });

        // Fetch list of users to assign to the ticket
        axios.get(`http://localhost:8000/api/users`, {
            params: {
                user_group : user_group,
                is_exclude_customers : true
            },
        }) 
        .then((response) => {
            if (Array.isArray(response.data.users)) {
                setUsers(response.data.users);
            }
        })
        .catch((error) => {
            console.log(error);
        });
    },[id]);

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

        if (Object.keys(errors).length > 0) {
            setErrorMessages(errors);  // Set errors to the state
            return; // Stop form submission if there are errors
        }

        await axios.put(`http://localhost:8000/api/update/ticket/${id}`, ticket)
        .then((response) => {
            toast.success(response.data.message, {position: "top-right"});
            navigate("/");
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const getDateInMalaysiaTime = () => {
        const date = new Date();
        // Adjust by adding 8 hours (Malaysia is UTC +8)
        date.setHours(date.getHours() + 8);
        return date;
    };

    // Submit ticket replies / comments
    const submitComment = async (e) => {
        e.preventDefault();
        e.stopPropagation();
    
        // Ensure the comment is not empty before submitting
        if (!newComment.trim()) {
            toast.error('Comment cannot be empty');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8000/api/ticket/replies/${id}`, {
                message: newComment,
                user_id: user_id, // Add user_id of logged in user
                name: user_name, // Add user name of logged in user
                date_added: getDateInMalaysiaTime,
            });
    
            toast.success('Comment added successfully');
            setNewComment(''); // Clear the input field
            // Optionally, refetch the comments after submitting
            setComments((prevComments) => [...prevComments, response.data]); // Append the new comment
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

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
            <div className="updateTicket" onSubmit={ submitForm }>
                <div className="card">
                    <div className="card-header">
                        <h5 className="card-title"><i className="fa-solid fa-pen-to-square"></i> Ticket (#{ticket.ticket_no})</h5>
                    </div>
                    <div className="card-body">
                        <form className="updateTicketForm">
                            <Link to="/" type="button" className="btn btn-secondary back-btn">
                                <i className="fa-solid fa-backward"></i> Back
                            </Link>
                            <fieldset><legend className="legend">Ticket Details</legend></fieldset>
                            <div className="viewGroup row mb-4">
                                <label htmlFor="name" className="col-sm-2 fw-bold">Date</label>
                                <div className="col-sm-10">
                                    {new Date(ticket.date_added).toLocaleString('en-GB', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false,
                                        timeZone: 'UTC',
                                    }).replace(',', '')}
                                </div>
                            </div>
                            <div className="viewGroup row mb-4">
                                <label htmlFor="name" className="col-sm-2 fw-bold">Created By</label>
                                <div className="col-sm-10">
                                    {ticket.user_id.name}
                                </div>
                            </div>
                            <div className="viewGroup row mb-4">
                                <label htmlFor="name" className="col-sm-2 fw-bold">Name</label>
                                <div className="col-sm-10">
                                    {ticket.name}
                                </div>
                            </div>
                            <div className="viewGroup row mb-4">
                                <label htmlFor="email" className="col-sm-2 fw-bold">Email</label>
                                <div className="col-sm-10">
                                    {ticket.email}
                                </div>
                            </div>
                            <div className="viewGroup row mb-4">
                                <label htmlFor="subject" className="col-sm-2 fw-bold">Subject</label>
                                <div className="col-sm-10">
                                    {ticket.subject}
                                </div>
                            </div>
                            <div className="viewGroup row mb-4">
                                <label htmlFor="message" className="col-sm-2 fw-bold">Message</label>
                                <div className="col-sm-10">
                                    {ticket.message}
                                </div>
                            </div>
                            <div className="viewGroup row mb-4">
                                <label htmlFor="category" className="col-sm-2 fw-bold">Category</label>
                                <div className="col-sm-10">
                                    {ticket.category}
                                </div>
                            </div>
                            <div className="viewGroup row mb-4">
                                <label htmlFor="priority" className="col-sm-2 fw-bold">Priority</label>
                                <div className="col-sm-10">
                                    {ticket.priority}
                                </div>
                            </div>
                            <div className="inputGroup row mb-4">
                                <label htmlFor="status" className="col-sm-2 fw-bold">Status</label>
                                <div className="col-sm-10">
                                    {user_group === "Admin" || user_group === "Agent" ? (
                                        <select id="status" name="status" className="form-control form-select" onChange={inputHandler} value={ticket.status}>
                                            <option value="Pending">Pending</option>
                                            <option value="Open">Open</option>
                                            <option value="Close">Close</option>
                                        </select>
                                        ) : (
                                        <p>{ticket.status ? ticket.status : "Pending"}</p>
                                    )}
                                </div>
                            </div>
                            <div className="inputGroup row mb-4">
                                <label htmlFor="assigned_to" className="col-sm-2 fw-bold">Assigned To</label>
                                <div className="col-sm-10">
                                {user_group === "Admin" ? (
                                    <select name="assigned_to" value={ticket.assigned_to || ""} onChange={inputHandler} className="form-control form-select" >
                                        <option value="">-- Select a user --</option>
                                        {users.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    ) : (
                                    <p>{ticket.assigned_to ? 
                                        (users.find(user => user._id === ticket.assigned_to)?.name || "User not found") 
                                        : "Not Assigned"}</p>
                                )}
                                </div>
                            </div>
                            {user_group === "Admin" || user_group === "Agent" ? (
                                <div className="inputGroup submit">
                                    <button type="submit" className="btn btn-primary"><i className="fa-solid fa-pen-to-square"></i> Update</button>
                                </div>
                                ) : (
                                <div></div>
                            )}
                        </form>
                        <div className="comments-section">
                            <fieldset>
                                <legend className="legend">Comments</legend>
                            </fieldset>
                            {comments.length > 0 ? (
                                <div className="comments-list">
                                    {comments.map((comment, index) => {
                                        const date = new Date(comment.date_added);

                                        // Format date in dd-MM-yy HH:mm:ssAM/PM
                                        const day = String(date.getUTCDate()).padStart(2, '0');
                                        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                                        const year = String(date.getUTCFullYear());

                                        let hours = date.getUTCHours();
                                        const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                                        const seconds = String(date.getUTCSeconds()).padStart(2, '0');
                                        const ampm = hours >= 12 ? 'PM' : 'AM';
                                        hours = hours % 12 || 12;

                                        const formattedDate = `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes}:${seconds}${ampm}`;

                                        return (
                                            <div key={index} className="comment">
                                                <div className="comment-header">
                                                <strong>{comment.user_id && comment.user_id.name ? comment.user_id.name : comment.name || ' '}</strong>
                                                    <span className="comment-date">{formattedDate}</span>
                                                </div>
                                                <div className="comment-body">
                                                    {comment.message}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p>No comments available for this ticket.</p>
                            )}
                        </div>
                        <div className="add-comment-section">
                            <form onSubmit={submitComment}>
                                <div className="form-group">
                                    <textarea className="form-control" rows="4" value={newComment} onChange={handleCommentChange} placeholder="Type your comment here..."></textarea>
                                </div>
                                <div className="form-group text-end">
                                    <button type="button" onClick={submitComment} className="btn btn-primary">Add Comment</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default UpdateTicket;