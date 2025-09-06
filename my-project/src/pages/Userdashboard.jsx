import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserDashboard() {
  const [problems, setProblems] = useState([]);
  const [user, setUser] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch all problems
    axios.get("http://localhost:5000/api/problems")
      .then((res) => setProblems(res.data))
      .catch((err) => console.error(err));

    // Fetch logged-in user
    if (token) {
      axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, [token]);

  const handleProblemClick = (id) => {
    navigate(`/problem/${id}`);
  };

  const toggleUserDetails = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to CodeChamp</h1>

        {/* Profile */}
        {user && (
          <div className="relative">
            <div
              onClick={toggleUserDetails}
              className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center cursor-pointer text-lg font-semibold"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>

            {showDetails && (
              <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                <p className="font-bold text-gray-800 mb-2">User Details</p>
                <p className="text-sm text-gray-700"><strong>Name:</strong> {user.name}</p>
                <p className="text-sm text-gray-700"><strong>Email:</strong> {user.email}</p>
                <p className="text-sm text-gray-700"><strong>Role:</strong> {user.role}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Problem List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem) => (
          <div
            key={problem._id}
            className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition"
            onClick={() => handleProblemClick(problem._id)}
          >
            <h2 className="text-xl font-semibold">{problem.title}</h2>
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{problem.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
