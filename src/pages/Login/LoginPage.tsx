import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "@/services/auth/authService";
import GlassmorphismLoginCard from "@/components/GlassmorphismLoginCard";
import AnoAI from "@/components/ui/animated-shader-background";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: { email: string; password: string }) => {
    setLoginError(null);
    setIsLoading(true);

    try {
      const { accessToken, refreshToken, tokenType } = await login(data);

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("tokenType", tokenType);

      navigate("/dashboard");
    } catch {
      setLoginError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google Login clicked");
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password clicked");
  };

  const handleSignUp = () => {
    console.log("Sign Up clicked");
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center">
      {/* 1. WebGL Animated Shader Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AnoAI />
      </div>

      {/* 2. Dark Frosted Overlay Layer for contrast */}
      <div className="fixed inset-0 bg-[#060403]/30 backdrop-blur-xs z-10 pointer-events-none" />

      {/* 3. Glass Login Card Layer */}
      <div className="relative z-20 flex items-center justify-center p-4 w-full">
        <GlassmorphismLoginCard
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
          onForgotPassword={handleForgotPassword}
          onSignUp={handleSignUp}
          isLoading={isLoading}
          errorMessage={loginError}
        />
      </div>
    </div>
  );
};

export default LoginPage;
