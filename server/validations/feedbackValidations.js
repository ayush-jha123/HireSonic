// src/validations/feedbackValidation.js
import { z } from "zod";

const categoryScoreSchema = z.object({
  name: z.enum([
    "Communication Skills",
    "Technical Knowledge", 
    "Problem Solving",
    "Cultural Fit",
    "Confidence and Clarity"
  ]),
  score: z.number().min(0).max(100),
  comment: z.string().min(10)
});

export const feedbackSchema = z.object({
  totalScore: z.number().min(0).max(100),
  categoryScores: z.array(categoryScoreSchema).length(5),
  strengths: z.array(z.string().min(10)).min(1),
  areasForImprovement: z.array(z.string().min(10)).min(1),
  finalAssessment: z.string().min(50)
});