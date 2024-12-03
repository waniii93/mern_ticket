import mongoose from "mongoose";
import bcrypt from "bcrypt"; // To hash passwords

const getDateInMalaysiaTime = () => {
    const date = new Date();
    // Adjust by adding 8 hours (Malaysia is UTC +8)
    date.setHours(date.getHours() + 8);
    return date;
};

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    user_group: { 
        type: String, 
        enum: ['Admin', 'Agent', 'Customer'], 
        required: true 
    },
    date_added: {
        type: Date,
        default: getDateInMalaysiaTime
    }
})

// Hash the password before saving a user
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);  // Generate a salt
        this.password = await bcrypt.hash(this.password, salt);  // Hash the password
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function(userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

export default mongoose.model("Users", userSchema)
