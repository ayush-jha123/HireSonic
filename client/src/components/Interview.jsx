import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Agent from "./Agent";

const Interview = () => {
  const { id } = useParams();
  const [interview, setInterview] = React.useState(null);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        const response = await fetch(`http://localhost:5000/interview/get/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch interviews");
        }

        const data = await response.json();
        setInterview(data.interview);
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterview();
  }, [id]);
  // console.log(interview);
  // console.log("Interview ID:", id);
  return (
    <div>
      {/* <h1>Take Interview</h1> */}
      <Agent questions={interview?.questions} type="take"/>
    </div>
  );
};

export default Interview;
