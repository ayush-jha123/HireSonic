import React, { useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";
import { Link } from "react-router-dom";

import aiAvatar from "../../public/agent1.png";
import userAvatar from "../../public/profile.svg";
import rocket from "../../public/rocket1.png";
import { interviewer } from "../constants";
import { useNavigate } from "react-router-dom";

import { cn } from "../utilis";
const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({ username, userId, type, questions, interviewId, feedbackId }) => {
  console.log(interviewId);
  
  // Check if user is authenticated
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access this feature.</p>
          <Link 
            to="/signup" 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  // Added missing props
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const [showManualOption, setShowManualOption] = useState(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [showManualEnd, setShowManualEnd] = useState(false);
  const vapiRef = useRef(null);
  const navigate = useNavigate();
  // Initialize VAPI client
  useEffect(() => {
    if (!import.meta.env.VITE_VAPI_WEB_TOKEN) {
      setError("Missing VAPI token");
      return;
    }

    vapiRef.current = new Vapi(import.meta.env.VITE_VAPI_WEB_TOKEN);

    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
      setError(null);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
      setIsSpeaking(false);
      setShowManualEnd(false);
    };

    const onMessage = (message) => {
      console.log("Received message:", message);
      if (message.type === "transcript" && message.transcriptType === "final") {
        setMessages((prev) => [
          ...prev,
          {
            role: message.role,
            content: message.transcript,
            timestamp: new Date(),
          },
        ]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (err) => {
      console.error("VAPI Error:", err);
      setError(err.message || "An error occurred");
      setCallStatus(CallStatus.FINISHED);
      
      // If it's a generate type and there's an error, show manual option
      if (type === "generate") {
        setShowManualOption(true);
      }
    };

    const vapi = vapiRef.current;
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    // Remove this line, as it sets messages to a string:
    // if (messages?.length > 0) {
    //   setMessages(messages[messages?.length - 1].content);
    // }

    const handleGenerateFeedback = async (messagesArr) => {
      console.log("handleGenerateFeedback");
      setIsGeneratingFeedback(true);
      let success = false, id = null;
      try {
        const response = await fetch("http://localhost:5000/interview/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewId: interviewId,
            userId: userId,
            transcript: messagesArr,
          }),
        });
        const data = await response.json();
        id = data?._id;
        console.log("data:",data);
        console.log(id);
      } catch (err) {
        console.error("Error posting feedback:", err);
        success = false;
        id = null;
      }

      if (id) {
        console.log('navigated');
        navigate(`/feedback/${id}`);
      } else {
        console.log("Error saving feedback");
        setIsGeneratingFeedback(false);
        navigate("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      // Only call handleGenerateFeedback if messages is an array
      if (Array.isArray(messages) && messages.length > 0) {
        handleGenerateFeedback(messages);
      } else {
        // If messages is not an array, do not call feedback
        console.warn("No transcript messages to send for feedback.");
        // Navigate to home if no messages for any type
        navigate("/");
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, type, userId, navigate]);


      const handleCall = async () => {
      if (!vapiRef.current) return;

      setCallStatus(CallStatus.CONNECTING);
      setError(null);
      setShowManualEnd(false);
      console.log(callStatus);
      try {
        if (type === "generate") {
          await vapiRef.current.start(
            null,
            null,
            null,
            import.meta.env.VITE_VAPI_WORKFLOW_ID,
            {
              variableValues: {
                username: username,
                userId: userId,
              },
            }
          );
        } else {
          let formattedQuestions = "";
          if (questions) {
            formattedQuestions = questions
              .map((question) => `- ${question}`)
              .join("\n");
          }

          await vapiRef.current.start(interviewer, {
            variableValues: {
              questions: formattedQuestions,
            },
          });
        }
        
        // Show manual end option after 30 seconds for interview type
        if (type !== "generate") {
          setTimeout(() => {
            if (callStatus === CallStatus.ACTIVE) {
              setShowManualEnd(true);
            }
          }, 30000); // 30 seconds
        }
      } catch (err) {
        console.error("Call start failed:", err);
        setError(err.message || "Failed to start call");
        setCallStatus(CallStatus.FINISHED);
      }
    };

  const handleDisconnect = async () => {
    if (!vapiRef.current) return;

    try {
      await vapiRef.current.stop();
      setCallStatus(CallStatus.FINISHED);
    } catch (err) {
      console.error("Call end failed:", err);
      setError(err.message || "Failed to end call");
    }
  };

  const lastMessage =
    messages?.length > 0 ? messages[messages?.length - 1].content : "";

  return (
    <>
      <div className="bg-orange-50 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-20 my-4 sm:my-6 md:my-8 lg:my-10 border-2 border-orange-500 rounded-lg p-2 sm:p-4 md:p-6 shadow-lg min-h-screen">
        <div className="w-full h-16 sm:h-20 md:h-24 lg:h-32 rounded-lg flex justify-between px-4 sm:px-8 md:px-12 lg:px-16 items-center">
          <div className="flex flex-row space-x-2 sm:space-x-3 items-center p-2 sm:p-4">
            <img src={rocket} alt="logo" className="w-8 sm:w-12 md:w-16 lg:w-20" />
            <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-serif text-orange-700">
              HireSonic
            </h1>
          </div>
        </div>
        
        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-orange-700 font-serif w-full sm:w-[95%] md:w-[90%] mx-auto mt-4 sm:mt-5 text-center">
            {type==='generate' ? "Generate Interview" : "Ace Your Interview"} 
        </div>
        
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8 md:mt-10 w-full sm:w-[95%] md:w-[90%] mx-auto mb-5">
          {/* AI Interviewer Card */}
          <div className="border h-48 sm:h-64 md:h-80 lg:h-96 border-gray-300 rounded-lg p-3 sm:p-4 w-full sm:w-1/2 flex flex-col items-center justify-center bg-slate-700">
            <div className="avatar">
              <img
                src={aiAvatar}
                alt="profile-image"
                width={65}
                height={54}
                className="object-cover w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24"
              />
              {isSpeaking && <span className="animate-speak" />}
            </div>
            <h3 className="text-sm sm:text-base md:text-lg lg:text-xl text-white mt-2">AI Voice Agent</h3>
          </div>

          {/* User Profile Card */}
          <div className="border h-48 sm:h-64 md:h-80 lg:h-96 border-gray-300 rounded-lg p-3 sm:p-4 w-full sm:w-1/2 flex flex-col items-center justify-center bg-orange-300">
            <div className="text-center">
              <img
                src={userAvatar}
                alt="profile-image"
                width={539}
                height={539}
                className="rounded-full object-cover w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32"
              />
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl mt-2 font-medium">{username}</h3>
            </div>
          </div>
        </div>

        {messages?.length > 0 && (    
          <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 mb-4 sm:mb-6">
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl min-h-[3rem] px-3 sm:px-5 py-3 flex items-center justify-center">
              <p
                key={lastMessage}
                className={cn(
                  "transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100 text-sm sm:text-base md:text-lg text-center text-white"
                )}
              >
                {lastMessage}
              </p>
            </div>
          </div>
        )}

        {/* Feedback Generation Loading State */}
        {isGeneratingFeedback && (
          <div className="w-full flex justify-center mb-4 sm:mb-6 px-4 sm:px-8">
            <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 w-full max-w-md">
              <div className="flex items-center justify-center mb-3">
                <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-500"></div>
              </div>
              <p className="text-blue-700 font-medium mb-2 text-sm sm:text-base">Generating Your Feedback</p>
              <p className="text-blue-600 text-xs sm:text-sm">Please wait while we analyze your interview responses...</p>
            </div>
          </div>
        )}

        <div className="w-full flex justify-center px-4 sm:px-8">
          {callStatus !== "ACTIVE" ? (
            <div className="flex flex-col items-center space-y-4 w-full max-w-md">
              <button className="relative btn-call w-full sm:w-auto" onClick={() => handleCall()}>
                <span
                  className={cn(
                    "absolute animate-ping rounded-full opacity-75",
                    callStatus !== "CONNECTING" && "hidden"
                  )}
                />

                <span className="relative">
                  {callStatus === "INACTIVE" || callStatus === "FINISHED"
                    ? "Call"
                    : ". . ."}
                </span>
              </button>
              
              {/* Show manual option for generate type */}
              {type === "generate" && (
                <div className="text-center w-full">
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-2 font-mono">Or <br /> If facing issues with voice agent you can create interview manually </p>
                  <Link 
                    to="/create-interview" 
                    className="inline-block bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm"
                  >
                    Create Interview Manually
                  </Link>
                </div>
              )}
              
              {/* Show error and manual option if voice agent failed */}
              {error && type === "generate" && showManualOption && (
                <div className="text-center bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 w-full max-w-md">
                  <p className="text-red-600 mb-3 text-sm sm:text-base">Voice agent encountered an issue. You can try again or create manually.</p>
                  <div className="space-y-2">
                    <button 
                      onClick={() => {
                        setError(null);
                        setShowManualOption(false);
                        setCallStatus(CallStatus.INACTIVE);
                      }}
                      className="block w-full bg-orange-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm"
                    >
                      Try Voice Agent Again
                    </button>
                    <Link 
                      to="/create-interview" 
                      className="block w-full bg-gray-500 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-xs sm:text-sm"
                    >
                      Create Manually
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 w-full max-w-md">
              <button
                className="btn-disconnect w-full sm:w-auto"
                onClick={() => handleDisconnect()}
              >
                End
              </button>
              
              {/* Manual end option for interview type */}
              {type !== "generate" && (
                <div className="text-center bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 w-full max-w-md">
                  <p className="text-yellow-600 text-xs sm:text-sm mb-3">If the interview doesn't end automatically, you can end it manually</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Agent;


