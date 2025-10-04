import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogIn, Users, Info } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const demoAccounts = [
    {
      role: "Admin",
      email: "admin1@gmail.com",
      password: "admin123",
      description: "Full access to manage employees and tasks",
    },
    {
      role: "Employee",
      email: "emp1@gmail.com",
      password: "emp123",
      description: "View and update assigned tasks",
    },
  ];
  const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TeamFlow</h1>
          <p className="text-gray-400">Sign in to your account</p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <LogIn size={20} />
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>

            <div className="text-center">
              <p className="text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-blue-500 hover:text-blue-400 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="">
              {demoAccounts.map((account, index) => (
                <div key={index} className="">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <p className="text-xs">Demo Acc</p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        account.role === "Admin"
                          ? "bg-purple-500/10 bg-opacity-20 text-purple-400"
                          : "bg-blue-500/10 bg-opacity-20 text-blue-400"
                      }`}
                    >
                      {account.email}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        account.role === "Admin"
                          ? "bg-purple-500/10 bg-opacity-20 text-purple-400"
                          : "bg-blue-500/10 bg-opacity-20 text-blue-400"
                      }`}
                    >
                      {account.password}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-yellow-500/10 bg-opacity-10 border border-yellow-500 border-opacity-20 text-yellow-400 px-4 py-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info size={16} className="mt-0.5 flex-shrink-0" />
                <div className="text-[10px]">
                  <p className="font-medium ">Server Notice</p>
                  <p className="text-[10px]">
                    Using free hosting - instance spins down with inactivity.
                  </p>
                  <p className="text-[10px]">
                    First request may take ~50 seconds to wake up the server.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
