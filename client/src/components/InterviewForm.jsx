import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import rocket from "../../public/rocket1.png";

const InterviewForm = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: '',
    type: 'behavioural',
    level: 'junior',
    amount: 5,
    techstack: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    
    if (storedUserId && storedUserName) {
      setIsLoggedIn(true);
      setUserId(storedUserId);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/interview/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: userId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create interview');
      }

      const data = await response.json();
      console.log('Interview created successfully:', data);
      
      alert('Interview created successfully!');
      navigate('/');
      
    } catch (error) {
      console.error('Error creating interview:', error);
      alert(error.message || 'Failed to create interview. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to create an interview.</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <img src={rocket} alt="logo" className="w-12 h-12 mr-4" />
          <h1 className="text-3xl font-bold text-orange-700 font-serif">
            Create New Interview
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Job Role *
            </label>
            <input
              type="text"
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g., Software Engineer, Data Scientist, Product Manager"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Interview Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="behavioural">Behavioural</option>
              <option value="technical">Technical</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level *
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value="junior">Junior (0-2 years)</option>
              <option value="mid">Mid-level (3-5 years)</option>
              <option value="senior">Senior (5+ years)</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions *
            </label>
            <select
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            >
              <option value={3}>3 Questions</option>
              <option value={5}>5 Questions</option>
              <option value={7}>7 Questions</option>
              <option value={10}>10 Questions</option>
            </select>
          </div>

          {/* Tech Stack */}
          <div>
            <label htmlFor="techstack" className="block text-sm font-medium text-gray-700 mb-2">
              Tech Stack *
            </label>
            <input
              type="text"
              id="techstack"
              name="techstack"
              value={formData.techstack}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js, Python, AWS"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate multiple technologies with commas
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Link
              to="/"
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Interview...' : 'Create Interview'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewForm;
