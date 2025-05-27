import { useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import UseAuth from "../hooks/useAuth";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import loginImage from "../assets/login/loginImage.png";
import vectorone from "../assets/login/Login_Vector_One.png";
import vectortwo from "../assets/login/Login_Vector_Two.png";
import vectorthree from "../assets/login/Login_Vector_Three.png";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase.configue";

const SignUp = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location?.state || "/";

  const { createUser, updateUserProfile } = UseAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    userType: userType,
  });

  const [passwordMatch, setPasswordMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    // Validate password length
    if (e.target.name === "password") {
      setPasswordValid(validatePassword(e.target.value));
      setPasswordMatch(
        e.target.value === formData.confirmPassword ||
          formData.confirmPassword === ""
      );
    }

    // Check if passwords match
    if (e.target.name === "password" || e.target.name === "confirmPassword") {
      if (e.target.name === "confirmPassword") {
        setPasswordMatch(e.target.value === formData.password);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(formData.password)) {
      setPasswordValid(false);
      setError("Password must be at least 8 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false);
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const result = await createUser(formData.email, formData.password);
      console.log(result);

       await setDoc(doc(db, "users", result.user.uid), {
        username: formData.name,
        email: formData.email,
        id: result.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", result.user.uid), {
        chats: [],
      });
      

      await updateUserProfile(formData.name, "");

      const userData = {
        email: formData.email.toLowerCase(),
        name: formData.name,
        mobile: formData.mobile,
        photo: "",
        verificationStatus: "not_submitted",
        createdAt: new Date().toISOString(),
        role: userType === "traveler" ? "traveler" : "sender",
        firebaseId: result.user.uid,
      };

      try {
        await axios.post("http://localhost:9000/users", userData);
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
          userType: userType,
        });
        navigate(from, { replace: true });
      } catch (apiError) {
        console.error(
          "API Error:",
          apiError.response?.data || apiError.message
        );
        setError("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setError("Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    return userType === "traveler" ? "Traveler" : "Product Sender";
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Section - Image */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-between pt-8 px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header with Plane */}
          <div className="mb-12 mt-12 relative flex flex-col items-center justify-center ">
            <h1 className="text-4xl font-bold text-[#009ee2] mb-1">
              Create Account
            </h1>
            <p className="text-gray-500 text-sm">
              Sign up as a {getRoleTitle()}
            </p>
          </div>
          <div className="absolute left-[650px] bottom-[700px] w-full flex justify-center space-x-4">
            <img src={vectorthree} alt="Notre Dame" className="h-12" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:ring-2 focus:ring-[#009ee2] focus:border-[#009ee2] focus:outline-none"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaUser className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Email</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="steve@travel.com"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:ring-2 focus:ring-[#009ee2] focus:border-[#009ee2] focus:outline-none"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaEnvelope className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Mobile Input */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Mobile Number</label>
              <div className="relative">
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+1 234 567 8900"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:ring-2 focus:ring-[#009ee2] focus:border-[#009ee2] focus:outline-none"
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaPhone className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••••"
                  className={`w-full border ${
                    !passwordValid && formData.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md px-10 py-2 focus:ring-2 focus:ring-[#009ee2] focus:border-[#009ee2] focus:outline-none`}
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaLock className="text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
              {!passwordValid && formData.password && (
                <p className="text-red-500 text-xs mt-1">
                  Password must be at least 8 characters long
                </p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••••••"
                  className={`w-full border ${
                    !passwordMatch && formData.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md px-10 py-2 focus:ring-2 focus:ring-[#009ee2] focus:border-[#009ee2] focus:outline-none`}
                  required
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaLock className="text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </button>
              </div>
              {!passwordMatch && formData.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                required
                className="h-4 w-4 text-[#009ee2] focus:ring-[#009ee2] border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-500">
                I agree to the{" "}
                <a href="#" className="text-[#009ee2] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#009ee2] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm">{error}</p>}

            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#009ee2] text-white font-medium py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {loading ? "CREATING ACCOUNT..." : "SIGN UP"}
            </button>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/" className="text-[#009ee2] hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>

        {/* Bottom Section with Landmark Images */}
        <div className="mt-8 w-full flex justify-between space-x-4">
          <img src={vectorone} alt="Taj Mahal" className="h-28" />
          <img src={vectortwo} alt="Leaning Tower" className="h-28" />
        </div>
      </div>
      {/* Right Section - Form */}
      <div
        className="w-full lg:w-1/2 bg-cover bg-center min-h-full hidden lg:block"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
        }}
      ></div>
    </div>
  );
};

export default SignUp;
