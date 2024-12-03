
import Ticket from "../model/ticket.js"
import TicketReplies from "../model/ticketReplies.js"
import Users from "../model/users.js";

export const createTicket = async(req, res) => {
    try{
        const userId = req.user.id;
        const newTicket = new Ticket({
            ...req.body,
            user_id: userId // User id of the logged in user
        });

        const savedTicket = await newTicket.save();
        res.status(201).json({ message: "Ticket created successfully."});
    } catch (error){
        console.error("Error saving ticket:", error.message);
        res.status(500).json({ errorMessage: error.message});
    }
}

// Get all tickets
export const getAllTickets = async(req, res) => {
    try{
        const page = parseInt(req.query.page) || null;
        const limit = parseInt(req.query.limit) || null;

        // Filters
        const priority = req.query.priority || null;
        const status = req.query.status || null;
        const category = req.query.category || null;
        const search = req.query.search || "";

        let ticketData;
        let filter_data = {};

        const userId = req.query.user_id || null; // Get the logged-in user's ID
        const userGroup = req.query.user_group || null; // Get the logged-in user's group

        if (userGroup === "Customer") {
            // Show only tickets created by the logged in user
            filter_data.user_id = userId;
        } else if (userGroup === "Agent") {
            // Show tickets created by or assigned to the logged in user
            filter_data.$or = [
                { user_id: userId }, // Tickets created by the logged in user
                { assigned_to: userId } // Tickets assigned to the logged in user
            ];
        }

        if (priority) {
            filter_data.priority = priority;
        }

        if (status) {
            filter_data.status = status;
        }

        if (category) {
            filter_data.category = category;
        }

        if (search) {
            // Use a regex search for a case-insensitive search term
            filter_data.$or = [
                { name: { $regex: search, $options: 'i' } }, // Search by name
                { email: { $regex: search, $options: 'i' } }, // Search by email
                { subject: { $regex: search, $options: 'i' } }, // Search by subject
            ];
        }

        // Count all tickets matching the filter
        const totalTickets = await Ticket.countDocuments(filter_data);

        if (page && limit) {
            // Pagination
            const skip = (page - 1) * limit;
            ticketData = await Ticket.find(filter_data)
            .skip(skip)
            .limit(limit)
            .sort({ date_added: -1 })
            .populate('user_id', 'name'); // Sort by date_added in descending order
        } else {
            // Return all tickets if no pagination
            ticketData = await Ticket.find().sort({ date_added: -1 }).populate('user_id', 'name')
        }

        res.status(200).json({
            tickets: ticketData, // Tickets for the current page
            total: totalTickets, // Total number of tickets
        });
    } catch (error){
        console.error("Error fetching tickets:", error.message);
        res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
    }
}

// Get ticket by ID
export const getTicketById = async(req, res) => {
    try{
        const id = req.params.id;
        const ticketExist = await Ticket.findById(id).populate('user_id', 'name');

        if(!ticketExist){
            return res.status(404).json({ message:"Ticket not found." });
        }

        res.status(200).json(ticketExist);
    } catch (error){
        console.error("Error fetching ticket:", error.message);
        res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
    }
}

export const updateTicket = async(req, res) => {
    try{
        const id = req.params.id;
        const ticketExist = await Ticket.findById(id);

        if(!ticketExist){
            return res.status(404).json({ message:"Ticket not found." });
        }

        const updatedData = await Ticket.findByIdAndUpdate(id, req.body, {
            new:true // return updated document rather than original document
        })
        // res.status(200).json(updatedData); // Response
        res.status(201).json({ message: "Ticket updated successfully."});
    } catch (error){
        console.error("Error updating ticket:", error.message);
        res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
    }
}

// Add a reply to an existing ticket
export const addTicketReply = async(req, res) => {
    const getDateInMalaysiaTime = () => {
        const date = new Date();
        // Adjust by adding 8 hours (Malaysia is UTC +8)
        date.setHours(date.getHours() + 8);
        return date;
    };

    try {
        const ticket_id = req.params.id;
        const { user_id, name, message } = req.body;

        // Validate the message
        if (!message || message.trim() === "") {
            return res.status(400).json({ errorMessage: "Comment cannot be empty" });
        }

        // Check if the ticket exists in the Ticket collection
        const ticketExist = await Ticket.findById(ticket_id);
        if (!ticketExist) {
            return res.status(404).json({ errorMessage: "Ticket not found." });
        }

        // Create a new reply
        const newReply = new TicketReplies({
            ticket_id: ticket_id, // Link to the ticket
            user_id,
            message,
            date_added: getDateInMalaysiaTime()
        });

        const savedReply = await newReply.save();

        console.log(newReply.message);

        // Fetch all replies for the ticket
        const all_replies = await TicketReplies.find({ ticket_id }).sort({ date_added: 1 });

        // Return the ticket with all replies
        res.status(200).json({
            message: newReply.message,
            date_added: getDateInMalaysiaTime(),
            user_id: user_id,
            name: name,
            ticket: ticketExist, // This will show the updated ticket with the new reply reference
            replies: all_replies, // Return all replies for the ticket
        });
    } catch (error) {
        console.error("Error adding comment:", error.message);
        res.status(500).json({
            errorMessage: "Something went wrong. Please try again later."
        });
    }
}

export const getTicketReplies = async (req, res) => {
    try {
        const { id: ticket_id } = req.params;

        // Fetch all replies for the given ticket
        const replies = await TicketReplies.find({ ticket_id }).sort({ date_added: 1 }).populate('user_id', 'name');

        if (replies.length === 0) {
            return res.status(404).json({ message: "No comments found." });
        }

        res.status(200).json({ replies });
    } catch (error) {
        console.error("Error fetching replies:", error.message);
        res.status(500).json({
            errorMessage: "Something went wrong. Please try again later.",
        });
    }
}

export const deleteTicket = async(req, res) => {
    try{
        const id = req.params.id;
        const ticketExist = await Ticket.findById(id);

        if(!ticketExist){
            return res.status(404).json({ message:"Ticket not found." });
        }

        await Ticket.findByIdAndDelete(id)
        res.status(200).json({message: "Ticket deleted successfully"}); // Response
    } catch (error){
        console.error("Error deleting ticket:", error.message);
        res.status(500).json({ errorMessage: "Something went wrong. Please try again later." });
    }
}