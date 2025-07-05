import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Feedback = () => {
  const { feedbackId } = useParams();
  const [interview, setInterview] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First, fetch feedback by ID
        const feedbackRes = await fetch(`http://localhost:5000/interview/feedback/${feedbackId}`);
        if (!feedbackRes.ok) throw new Error("Failed to fetch feedback");
        const feedbackData = await feedbackRes.json();
        setFeedback(feedbackData.feedback);
        
        // Then, fetch interview using interviewId from feedback
        const interviewRes = await fetch(`http://localhost:5000/interview/get/${feedbackData?.feedback?.interviewId}`);
        if (!interviewRes.ok) throw new Error("Failed to fetch interview");
        const interviewData = await interviewRes.json();
        setInterview(interviewData.interview);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [feedbackId]);

  if (loading) return <div className="flex justify-center items-center h-96">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!interview || !feedback) return <div className="text-center mt-8">No data found.</div>;
  
  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 font-mono">
          Interview Feedback Report
        </h1>
        <p className="text-lg text-gray-600 uppercase">
          {interview.role} • {interview.level} • {interview.type}
        </p>
      </div>

      {/* Overall Score Card */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 font-mono">Overall Score</h2>
            <p className="text-orange-100 font-mono">Your performance assessment</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold font-mono">{feedback.totalScore}</div>
            <div className="text-orange-100 font-mono">out of 100</div>
          </div>
        </div>
      </div>

      {/* Interview Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex gap-2 mb-2 ">
            <img src="/globe.svg" width={20} height={20} alt="calendar" />
            <h3 className="font-semibold text-gray-700 font-mono">Interview Date</h3>
          </div>
          <p className="text-gray-600 font-mono items-center w-full">
            {feedback.createdAt ? new Date(feedback.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : "N/A"}
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <img src="/file.svg" width={20} height={20} alt="tech" />
            <h3 className="font-semibold text-gray-700 font-mono">Tech Stack</h3>
          </div>
          <p className="text-gray-600 uppercase font-mono">
            {interview.techstack?.join(', ') || 'N/A'}
          </p>
        </div>
      </div>

      {/* Final Assessment */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
        <h3 className="font-semibold text-blue-800 mb-2">Final Assessment</h3>
        <p className="text-blue-700 leading-relaxed">{feedback.finalAssessment}</p>
      </div>

      {/* Category Scores */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 font-mono">Detailed Breakdown</h2>
        <div className="grid gap-4">
          {feedback.categoryScores?.map((category, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-800 font-mono">
                  {index + 1}. {category.name}
                </h4>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${category.score}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-orange-600 font-mono">{category.score}/100</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed font-mono">{category.comment}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Improvements */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Key Strengths
          </h3>
          <ul className="space-y-2">
            {feedback.strengths?.map((strength, index) => (
              <li key={index} className="text-green-700 flex items-start gap-2">
                <span className="text-green-500 mt-1">✓</span>
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {feedback.areasForImprovement?.map((area, index) => (
              <li key={index} className="text-red-700 flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span className="text-sm">{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <Link to="/" className="flex-1">
          <button className="w-full py-3 px-6 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold text-gray-700 transition-colors duration-200">
            Back to Dashboard
          </button>
        </Link>
        <Link to={`/interview/${feedback.interviewId}`} className="flex-1">
          <button className="w-full py-3 px-6 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors duration-200">
            Retake Interview
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Feedback;
