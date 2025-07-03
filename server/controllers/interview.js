import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import Interview from "../models/interview.js";
import mongoose from "mongoose";

const COVER_IMAGES = [
    "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
];

export const createInterview = async (req, res) => {
    const { type, role, level, techstack, amount, userId } = req.body;
    console.log("Received request to create interview:", req.body);
    try {
        // Validate required fields
        if (!type || !role || !level || !techstack || !amount || !userId) {
            return res.status(400).json({ 
                success: false, 
                error: "Missing required fields: type, role, level, techstack, amount, userId" 
            });
        }

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

export const getInterview = async (req, res) => {
    const { id } = req.params;

    try {
        // Validate interviewId
        // if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        //     return res.status(400).json({ 
        //         success: false, 
        //         error: "Invalid or missing interviewId" 
        //     });
        // }

        // Fetch interviews for the user
        const interview = await Interview.find({ _id: id }).sort({ createdAt: -1 });
        
        
        return res.status(200).json({
            success: true,
            interview
        });

    } catch (error) {
        console.error("Error fetching interviews:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            interviews
        });
    } catch (error) {
        console.error("Error fetching all interviews:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};