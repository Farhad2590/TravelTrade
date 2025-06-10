import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import loginImage from "../assets/login/loginImage.png";
import vectorone from "../assets/login/Login_Vector_One.png";
import vectortwo from "../assets/login/Login_Vector_Two.png";
import vectorthree from "../assets/login/Login_Vector_Three.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showResendVerification, setShowResendVerification] = useState(false);
  const { signIn, resendVerificationEmail } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setShowResendVerification(false);
    
    try {
      const result = await signIn(email, password);
      console.log(result.user);
      navigate("/");
    } catch (err) {
      console.error(err);
      if (err.message.includes('verify your email')) {
        setError(err.message);
        setShowResendVerification(true);
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password");
      } else if (err.code === 'auth/user-not-found') {
        setError("No account found with this email");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Sign in failed. Please try again.");
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
    } catch (err) {
      console.error('Error resending verification email:', err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left Section - Image */}
      <div
        className="w-full lg:w-1/2 bg-cover bg-center h-screen hidden lg:block"
        style={{
          backgroundImage: `url(${loginImage})`,
          backgroundSize: "cover",
        }}
      ></div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-between pt-8 px-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header with Plane */}
          <div className="mb-12 mt-12 relative flex flex-col items-center justify-center ">
            
              <h1 className="text-4xl font-bold text-[#009ee2] mb-1">Welcome Back</h1>
              <p className="text-gray-500 text-sm">Login with email</p>
          </div>
          <div className=" absolute left-[650px] bottom-[700px] w-full flex justify-center space-x-4">
            <img src={vectorthree} alt="Notre Dame" className="h-12" />
          </div>
          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-6 w-full">
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs text-gray-500">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="steve@travel.com"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:ring-2 focus:ring-[#009ee2] focus:border-[#009ee2] focus:outline-none"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <FaEnvelope className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs text-gray-500">Password</label>
                <a href="#" className="text-xs text-[#009ee2] hover:underline">
                  Forgot your password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full border border-gray-300 rounded-md px-10 py-2 focus:ring-2 focus:ring-[#009ee2] focus:border-[#009ee2] focus:outline-none"
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
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-red-600 text-sm">{error}</p>
                {showResendVerification && (
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    className="mt-2 text-sm text-[#009ee2] hover:underline font-medium"
                  >
                    Resend Verification Email
                  </button>
                )}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#009ee2] text-white font-medium py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              LOGIN
            </button>

            {/* Register Link */}
            <div className="text-center text-sm text-gray-500">
              Don't have an account?{" "}
              <Link to="/signUpFlow" className="text-[#009ee2] hover:underline">
                Register Now
              </Link>
            </div>
          </form>
        </div>

        {/* Bottom Section with Landmark Images */}
        <div className="mt-8 w-full flex justify-between space-x-4">
          <img src={vectorone} alt="Taj Mahal" className="h-28" />
          <img src={vectortwo} alt="Leaning Tower" className="h-28" />
          {/* <img src={vectorthree} alt="Notre Dame" className="h-12" /> */}
        </div>
      </div>
    </div>
  );
};

export default SignIn;