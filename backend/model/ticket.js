import mongoose from "mongoose";

const getDateInMalaysiaTime = () => {
    const date = new Date();
    // Adjust by adding 8 hours (Malaysia is UTC +8)
    date.setHours(date.getHours() + 8);
    return date;
};

const ticketSchema = new mongoose.Schema({
    ticket_no: {
        type: Number,
        required: true,
        unique: true,
        default: 0
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference to the Users model
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['General', 'Technical', 'Billing', 'Other'],
        default: 'General'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    status: {
        type: String,
        enum: ['Open', 'Pending', 'Close'],
        default: 'Pending'
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', // Reference to the Users model
        default: null
    },
    date_added: {
        type: Date,
        default: getDateInMalaysiaTime
    },
    date_modified: {
        type: Date,
        default: getDateInMalaysiaTime
    }
})

ticketSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            // Find the last ticket by ticket_no in descending order
            const lastTicket = await this.constructor.findOne().sort({ ticket_no: -1 }).exec();
            // If no ticket exists, set ticket_no to 1, otherwise increment the last ticket_no
            this.ticket_no = lastTicket ? lastTicket.ticket_no + 1 : 1;
        } catch (error) {
            return next(error);  // Pass error to next middleware
        }
    }

    // Middleware to update `date_modified` whenever a ticket is updated
    this.date_modified = getDateInMalaysiaTime;
    next();
});

export default mongoose.model("Tickets", ticketSchema)