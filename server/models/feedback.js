import mongoose from 'mongoose';

const CategoryScoreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: [
      "Communication Skills",
      "Technical Knowledge",
      "Problem Solving",
      "Cultural Fit",
      "Confidence and Clarity"
    ]
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100 // Assuming scores are percentages; adjust as needed
  },
  comment: {
    type: String,
    required: true
  }
});

const FeedbackSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview', // Reference to an Interview model if you have one
    required: true,
    index: true // Add index for faster querying
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model
    required: true,
    index: true // Add index for faster querying
  },
  totalScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100 // Adjust max value based on your scoring system
  },
  categoryScores: {
    type: [CategoryScoreSchema],
    required: true,
    validate: {
      validator: function(arr) {
        // Ensure exactly 5 category scores are provided
        return arr.length === 5;
      },
      message: 'Must provide exactly 5 category scores'
    }
  },
  strengths: {
    type: [String],
    required: true,
    default: []
  },
  areasForImprovement: {
    type: [String],
    required: true,
    default: []
  },
  finalAssessment: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
FeedbackSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model('Feedback', FeedbackSchema);
