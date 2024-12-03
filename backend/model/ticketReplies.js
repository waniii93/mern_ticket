import mongoose from "mongoose";

const getDateInMalaysiaTime = () => {
    const date = new Date();
    // Adjust by adding 8 hours (Malaysia is UTC +8)
    date.setHours(date.getHours() + 8);
    return date;
};

const ticketReplySchema = new mongoose.Schema({
    ticket_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tickets',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference to the Users model
        required: true
    },
    message: {
        type: String,
        required: true
    },
    date_added: {
        type: Date,
        default: getDateInMalaysiaTime  // Set date to Malaysia time manually
    }
})

export default mongoose.model("TicketReplies", ticketReplySchema)