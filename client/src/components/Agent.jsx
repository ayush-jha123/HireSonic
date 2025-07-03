import React, { useEffect, useState, useRef } from "react";
import Vapi from "@vapi-ai/web";

import aiAvatar from "../../public/ai-avatar.png";
import userAvatar from "../../public/user-avatar.png";
import rocket from "../../public/rocket1.png";
import { interviewer } from "../constants";

import { cn } from "../utilis";
const CallStatus = {
  INACTIVE: "INACTIVE",
  CONNECTING: "CONNECTING",
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
};

const Agent = ({ username, userid, type, questions}) => {
  console.log(type, username, userid, questions);
  // Added missing props
  const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  const [messages, setMessages] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const vapiRef = useRef(null);

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

  const handleCall = async () => {
    if (!vapiRef.current) return;

    setCallStatus(CallStatus.CONNECTING);
    setError(null);

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
              userid: userid,
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
    messages.length > 0 ? messages[messages.length - 1].content : "";

  return (
    <>
      <div className="bg-orange-50 m-[5rem] ml-[8rem] border-2 border-orange-500 rounded-lg p-2 max-h-full shadow-lg">
        <div className="w-full h-[8rem] rounded-lg  flex justify-between px-16 items-center">
          <div className="flex flex-row space-x-3 items-center p-4">
            <img src={rocket} alt="logo" className="w-[5rem]" />
            <h1 className="text-[3rem] font-bold font-serif text-orange-700">
              HireSonic
            </h1>
          </div>
          <button className="bg-orange-500 text-white py-2 px-4 rounded-lg w-[6rem] h-[2.5rem]">
            LogIn
          </button>
        </div>
        <div className="text-[2rem] font-bold text-orange-700 font-serif w-[90%] mx-auto mt-5">
            {type==='generate' ? "Generate Interview" : "Take Interview"} 
          </div>
        <div className="flex flex-row items-center space-x-3 mt-10 w-[90%] mx-auto mb-5">
          {/* AI Interviewer Card */}
          <div className="border h-[20rem] border-gray-300 rounded-lg p-4 w-1/2 flex flex-col items-center justify-center bg-slate-700">
            <div className="avatar">
              <img
                src={aiAvatar}
                alt="profile-image"
                width={65}
                height={54}
                className="object-cover"
              />
              {isSpeaking && <span className="animate-speak" />}
            </div>
            <h3>AI Interviewer</h3>
          </div>

          {/* User Profile Card */}
          <div className="border h-[20rem] border-gray-300 rounded-lg p-4 w-1/2 flex flex-col items-center justify-center bg-orange-300">
            <div className="">
              <img
                src={userAvatar}
                alt="profile-image"
                width={539}
                height={539}
                className="rounded-full object-cover size-[120px]"
              />
              <h3>{username}</h3> {/* Fixed variable name */}
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <div className="transcript-border">
            <div className="transcript">
              <p
                key={lastMessage}
                className={cn(
                  "transition-opacity duration-500 opacity-0",
                  "animate-fadeIn opacity-100"
                )}
              >
                {lastMessage}
              </p>
            </div>
          </div>
        )}

        <div className="w-full flex justify-center">
          {callStatus !== "ACTIVE" ? (
            <button className="relative btn-call" onClick={() => handleCall()}>
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
          ) : (
            <button
              className="btn-disconnect"
              onClick={() => handleDisconnect()}
            >
              End
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Agent;

// return (
//     <div className="w-full  h-full ">
//       <div className="bg-orange-50 m-[5rem] ml-[8rem] border-2 border-orange-500 rounded-lg p-2 max-h-full  ">
//         <div className="w-full h-[8rem] rounded-lg  flex justify-between p-5 items-center">
//           <div className="flex flex-row space=4 items-center">
//             <img src={rocket} alt="logo" className="w-[7rem]" />
//             <h1 className="text-[3rem] font-bold font-serif text-orange-700">
//               HireSonic
//             </h1>
//           </div>
//           <button className="bg-orange-500 text-white py-2 px-4 rounded-lg w-[6rem] h-[2.5rem]">
//             LogIn
//           </button>
//         </div>
//         <div className="w-full box-content flex flex-row items-center space-4 mt-10">
//           <div className="flex justify-center w-1/2 h-full">
//             <img
//               src={lady}
//               alt="Banner"
//               className="w-[70%] rounded-lg border border-blue-500"
//             />
//           </div>
//           <div className="flex flex-col items-center justify-center mt-5 w-1/2 h-full space-y-4">
//             <p className="text-[3.5rem] font-bold text-orange-700 font-serif">
//               Welcome to HireSonic! 🚀
//             </p>
//             <p className="text-[1.8rem] font-semibold text-gray-700 font-mono">
//               Ace your next interview with AI-powered
//               coaching that feels just like the real deal. <br />💡 Practice with
//               hyper-realistic simulations <br /> 🎯 Get instant feedback on your
//               answers <br /> 📊 Improve faster with personalized tips <br /> Ready to
//               outperform the competition? Let’s get started!</p>

//             <Link to="/agent" className="bg-orange-500 text-white py-2 px-4 rounded-lg w-[10rem] h-[3rem] ">
//               Get Started
//             </Link>
//           </div>
//         </div>

//         <div>
//           <p>Your Interviews</p>

//         </div>
//       </div>
//     </div>
//   );
