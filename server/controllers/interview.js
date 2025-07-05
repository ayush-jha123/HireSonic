import { generateObject, generateText } from "ai";
import { google } from "@ai-sdk/google";
import Interview from "../models/interview.js";
import Feedback from "../models/feedback.js";
import mongoose from "mongoose";
import { feedbackSchema } from "../validations/feedbackValidations.js";

const COVER_IMAGES = [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
];

export const createInterview = async (req, res) => {
    const type = req.body.type?.toLowerCase() || "behavioural"; // Default to behavioural if not provided
    const role = req.body.role?.toLowerCase() || "software engineer"; // Default to software engineer if not provided
    const level = req.body.level?.toLowerCase() || "junior"; // Default to junior if not provided
    const techstack = req.body.techstack?.toLowerCase() || "javascript, react"; // Default to javascript, react if not provided
    const amount = req.body.amount || 5; // Default to 5 questions if not provided
    const userId = req.body.userId || req.userId; // Use userId from request body or from authenticated user    
    console.log("Creating interview with parameters:", {
        type,
        role,
        level,
        techstack,
        amount,
        userId
    });

    try {
        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ 
                success: false, 
                error: "Invalid userId format" 
            });
        }

        // Generate questions using AI
        const { text: questions } = await generateText({
              model: google("gemini-2.0-flash-001"),
              prompt: `Prepare questions for a job interview.
                The job role is ${role}.
                The job experience level is ${level}.
                The tech stack used in the job is: ${techstack}.
                The focus between behavioural and technical questions should lean towards: ${type}.
                The amount of questions required is: ${amount}.
                Please return only the questions, without any additional text.
                The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
                Return the questions formatted like this:
                ["Question 1", "Question 2", "Question 3"]
                
                Thank you! <3
            `,
            });

        // Create interview document
        const interview = new Interview({
            role,
            type,
            level,
            techstack: techstack.split(","),
            questions: JSON.parse(questions),
            userId,
            finalized: true,
            coverImage: COVER_IMAGES[Math.floor(Math.random() * COVER_IMAGES.length)],
            createdAt: new Date().toISOString()
        });
        console.log("Generated Questions:", interview.questions);
        // Save to database
        const savedInterview = await interview.save();

        return res.status(201).json({
            success: true,
            interviewId: savedInterview._id,
            interview: savedInterview
        });
        
    } catch (error) {
        console.error("Error creating interview:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, interviews });
    } catch (error) {
        console.error("Error fetching interviews:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getUserInterviews = async (req, res) => {
    const { userId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ success: false, error: "Invalid userId format" });
    }
    
    try {
        const interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, interviews });
    } catch (error) {
        console.error("Error fetching user interviews:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getInterview = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, error: "Invalid interview ID format" });
    }
    try {
        const interview = await Interview.findById(id);
        if (!interview) {
            return res.status(404).json({ success: false, error: "Interview not found" });
        }
        return res.status(200).json({ success: true, interview });
    } catch (error) {
        console.error("Error fetching interview:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};



export const getInterviews = async (req, res) => {
    return res.status(200).json({ success: true, data: "Thank you!" });
};


export const createFeedback = async (req, res) => {
    const { interviewId, userId, transcript } = req.body;
    
    try {
        // Validate required fields
        if (!interviewId || !userId || !Array.isArray(transcript)) {
            return res.status(400).json({ 
                success: false, 
                error: "Missing required fields: interviewId, userId, or transcript" 
            });
        }

        // Format transcript for prompt
        const formattedTranscript = transcript
            .map((sentence) => `- ${sentence.role}: ${sentence.content}`)
            .join("\n");

        // Generate feedback using AI
        const { object } = await generateObject({
            model: google("gemini-2.0-flash-001", {
                structuredOutputs: false,
            }),
            schema: feedbackSchema, 
            prompt: `
                You are an AI interviewer analyzing a mock interview. Evaluate the candidate thoroughly.
                
                Transcript:
                ${formattedTranscript}

                Score the candidate (0-100) in these exact categories:
                1. Communication Skills: Clarity, articulation
                2. Technical Knowledge: Role-specific concepts
                3. Problem-Solving: Analytical ability
                4. Cultural Fit: Company values alignment
                5. Confidence: Poise and clarity

                Provide:
                - Specific scores for each category
                - 3-5 key strengths
                - 3-5 improvement areas
                - Final summary assessment
            `,
        });

        const validatedData = feedbackSchema.parse(object);

    // Save to database
    const feedback = new Feedback({
      interviewId,
      userId,
      ...validatedData
    });

    await feedback.save();

    return res.status(201).json(feedback);
        
    } catch (error) {
        console.error("Error in createFeedback:", error);
        return res.status(500).json({ 
            success: false, 
            error: error.message || "Failed to generate feedback" 
        });
    }
};


export const getFeedback = async (req, res) => {
    const { id } = req.params;
    try {
        // Validate feedback ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ 
                success: false, 
                error: "Invalid feedback ID format" 
            });
        }

        // Find feedback by ID
        const feedback = await Feedback.findById(id);
        if (!feedback) {
            return res.status(404).json({ 
                success: false, 
                error: "Feedback not found" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            feedback 
        });
        
    } catch (error) {
        console.error("Error fetching feedback:", error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};