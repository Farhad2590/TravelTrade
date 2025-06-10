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
import { signOut } from "firebase/auth";

const SignUp = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { createUser, updateUserProfile, sendVerificationEmail } = UseAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setError("");
    setSuccess("");

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
      
      // Create Firebase user
      const result = await createUser(formData.email, formData.password);
      console.log("User created:", result);

      // Update user profile
      await updateUserProfile(formData.name, "");

      // Create Firestore documents
      await setDoc(doc(db, "users", result.user.uid), {
        username: formData.name,
        email: formData.email,
        id: result.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, "userchats", result.user.uid), {
        chats: [],
      });

      // Send verification email
      await sendVerificationEmail(result.user);

      // Create user in MongoDB
      const userData = {
        email: formData.email.toLowerCase(),
        name: formData.name,
        mobile: formData.mobile,
        photo: "",
        verificationStatus: "not_submitted",
        createdAt: new Date().toISOString(),
        role: userType === "traveler" ? "traveler" : "sender",
        firebaseId: result.user.uid,
        emailVerified: false, // Track email verification status
      };

      try {
        await axios.post("http://localhost:9000/users", userData);
        
        // Sign out the user immediately after registration
        await signOut(result.user.auth);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          mobile: "",
          password: "",
          confirmPassword: "",
          userType: userType,
        });

        setSuccess(
          "Account created successfully! Please check your email and click the verification link before signing in."
        );

        // Redirect to signin page after 3 seconds
        setTimeout(() => {
          navigate("/signin");
        }, 3000);

      } catch (apiError) {
        console.error(
          "API Error:",
          apiError.response?.data || apiError.message
        );
        setError("Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.code === 'auth/email-already-in-use') {
        setError("An account with this email already exists.");
      } else if (error.code === 'auth/weak-password') {
        setError("Password is too weak. Please choose a stronger password.");
      } else if (error.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRoleTitle = () => {
    return userType === "traveler" ? "Traveler" : "Product Sender";
  };

  // Show success message if registration was successful
  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="mb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email!</h2>
          <p className="text-gray-600 mb-6">{success}</p>
          <div className="space-y-4">
            <Link 
              to="/signin" 
              className="block w-full bg-[#009ee2] text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Go to Sign In
            </Link>
            <p className="text-sm text-gray-500">
              Didn't receive the email? Check your spam folder or contact support.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

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
              <Link to="/signin" className="text-[#009ee2] hover:underline">
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