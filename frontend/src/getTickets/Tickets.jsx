import React, { useEffect, useState } from 'react';
import "./tickets.css";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Tickets = ({ setIsAuthenticated }) => {
    // localStorage.clear();
    const [tickets, setTickets] = useState([]);
    const [current_page, setCurrentPage] = useState(1); // Track current page
    const [total_tickets, setTotalTickets] = useState(0); // Track total number of tickets
    const tickets_per_page = 10;  // Set the number of tickets per page
    const [priorityFilter, setPriorityFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [searchTerm, setSearchTerm] = useState(""); // For text-based search

    const navigate = useNavigate();

    // Retrieve user_id and user_group from localStorage to get logged in user information
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.id : null;
    const user_group = user ? user.user_group : null;

    // Fetch tickets data based on the current page and tickets per page
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/tickets', {
                    params: {
                        page       : current_page,
                        limit      : tickets_per_page,
                        priority   : priorityFilter,
                        status     : statusFilter,
                        category   : categoryFilter,
                        search     : searchTerm,
                        user_id    : user_id,
                        user_group : user_group
                    },
                });
                setTickets(response.data.tickets);
                setTotalTickets(response.data.total);
            } catch (error) {
                console.log('Error fetching tickets:', error);
            }
        };

        fetchTickets();
    }, [priorityFilter, statusFilter, categoryFilter, searchTerm, current_page]);  // Fetch tickets when current_page changes  

    useEffect(() => {
        // Initialize tooltips for elements in the DOM
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        const tooltipList = tooltipTriggerList.map(tooltipTriggerEl => new window.bootstrap.Tooltip(tooltipTriggerEl));

        // Cleanup function to destroy tooltips
        return () => {
            tooltipList.forEach(tooltipInstance => tooltipInstance.dispose());
        };
    }, [tickets]);

    // Calculate the total number of pages
    const total_pages = Math.ceil(total_tickets / tickets_per_page);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > total_pages) return;  // Prevent invalid page numbers
        setCurrentPage(pageNumber);
    };

    // Delete Ticket
    const deleteTicket = async (ticket_id) => {
        // Show confirmation box
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this ticket?"
        );

        if (confirmDelete) {
            await axios.delete(`http://localhost:8000/api/delete/ticket/${ticket_id}`)
            .then((response) => {
                setTickets((prevTicket) => prevTicket.filter((ticket)=>ticket._id !==ticket_id));
                toast.success(response.data.message, {position:"top right"});
            })
            .catch((error) => {
                console.log(error);
            })
        }
    }

    // Logout function
    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem("token");
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
            <div className="ticketTable">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title"><i className="fa-solid fa-list"></i> Tickets</h4>
                    </div>
                    <div className="card-body">
                        <Link to="/add" type="button" className="btn btn-primary add-btn"><i className="fa-solid fa-plus"></i> Add Ticket</Link>
                        <div className="filters">
                            <div className="well">
                                <div className="row">
                                    <div className="col-sm-3">
                                        <div className="filter-group">
                                            <label>Priority</label>
                                            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                                                <option value="">All</option>
                                                <option value="Low">Low</option>
                                                <option value="Medium">Medium</option>
                                                <option value="High">High</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="filter-group">
                                            <label>Status</label>
                                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                                <option value="">All</option>
                                                <option value="Open">Open</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Close">Close</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="filter-group">
                                            <label>Category</label>
                                            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                                                <option value="">-- Select Category --</option>
                                                <option value="General">General</option>
                                                <option value="Technical">Technical</option>
                                                <option value="Billing">Billing</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-sm-3">
                                        <div className="filter-group">
                                            <label>Search</label>
                                            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by Name, Email, or Subject"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <table className="table table-bordered table-hover table-responsive">
                            <thead>
                                <tr>
                                    <th scope="col" className="text-end">Ticket No.</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Subject</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Priority</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Created By</th>
                                    <th className="text-center" scope="col">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.length === 0 ? (
                                    <tr><td colSpan="100%" className="text-center">No results</td></tr>
                                ) : (
                                    tickets.map((ticket, index) => {
                                        return (
                                            <tr>
                                                <td data-label="Ticket No." className="text-end">{ ticket.ticket_no }</td>
                                                <td data-label="Date">{new Date(ticket.date_added).toLocaleString('en-GB', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: false,
                                                    timeZone: 'UTC',
                                                }).replace(',', '')}</td>
                                                <td data-label="Name">{ ticket.name }</td>
                                                <td data-label="Email">{ ticket.email }</td>
                                                <td data-label="Subject">{ ticket.subject }</td>
                                                <td data-label="Category">{ ticket.category }</td>
                                                <td data-label="Priority"><span className={`badge ${
                                                    ticket.priority === 'Low'
                                                    ? 'bg-success'
                                                    : ticket.priority === 'Medium'
                                                    ? 'bg-warning'
                                                    : ticket.priority === 'High'
                                                    ? 'bg-danger'
                                                    : 'bg-secondary'
                                                    }`} > {ticket.priority}
                                                </span></td>
                                                <td data-label="Status"><span className={`badge ${
                                                    ticket.status === 'Open'
                                                    ? 'bg-primary'
                                                    : ticket.status === 'Pending'
                                                    ? 'bg-warning'
                                                    : ticket.status === 'Close'
                                                    ? 'bg-secondary'
                                                    : 'bg-dark'
                                                    }`} > {ticket.status}
                                                </span></td>
                                                <td data-label="Created By">{ ticket.user_id.name }</td>
                                                <td data-label="Actions" className="text-center actionButtons">
                                                    <Link to={`/update/`+ticket._id} type="button" className="btn btn-info" data-bs-toggle="tooltip" title="View"><i className="fa-solid fa-eye"></i></Link>

                                                    {user_group === "Admin" ? (
                                                        <button type="button" onClick={() => deleteTicket(ticket._id)} className="btn btn-danger" data-bs-toggle="tooltip" title="Delete"><i className="fa-solid fa-trash"></i></button>
                                                        ) : (
                                                        <div></div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                        {/* Pagination Controls */}
                        <div className="pagination d-flex justify-content-end">
                            <button className="btn btn-light" onClick={() => handlePageChange(1)} disabled={current_page === 1} > &lt;&lt; First </button>
                            
                            <button className="btn btn-light" onClick={() => handlePageChange(current_page - 1)} disabled={current_page === 1} >Previous</button>
                            
                            {/* Show page numbers */}
                            {[...Array(total_pages)].map((_, index) => (
                                <button
                                    key={index}
                                    className={`btn ${current_page === index + 1 ? 'btn-primary' : 'btn-light'}`}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            
                            <button className="btn btn-light" onClick={() => handlePageChange(current_page + 1)} disabled={current_page === total_pages} >Next</button>

                            <button className="btn btn-light" onClick={() => handlePageChange(total_pages)} disabled={current_page === total_pages} >Last &gt;&gt;</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Pagination = ({ total_tickets, tickets_per_page, current_page, onPageChange }) => {
    const total_pages = Math.ceil(total_tickets / tickets_per_page);
    const pageNumbers = Array.from({ length: total_pages }, (_, i) => i + 1);
  
    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li
              key={number}
              className={`page-item ${current_page === number ? 'active' : ''}`}
            >
              <button onClick={() => onPageChange(number)} className="page-link">
                {number}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
};

export default Tickets;