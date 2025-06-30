import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
    role: { type: String, required: true },
    type: { type: String, required: true },
    level: { type: String, required: true },
    techstack: [{ type: String, required: true }],
    questions: { type: Array, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    finalized: { type: Boolean, default: false },
    coverImage: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Interview', interviewSchema);
