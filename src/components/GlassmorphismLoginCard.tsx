import React, { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export interface GlassmorphismLoginCardProps {
  onLogin?: (data: { email: string; password: string }) => Promise<void> | void;
  onGoogleLogin?: () => void;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const GlassmorphismLoginCard: React.FC<GlassmorphismLoginCardProps> = ({
  onLogin,
  onGoogleLogin,
  onForgotPassword,
  onSignUp,
  isLoading = false,
  errorMessage = null,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email) {
      setValidationError("Please enter your email address.");
      return;
    }
    if (!password) {
      setValidationError("Please enter your password.");
      return;
    }

    if (onLogin) {
      await onLogin({ email, password });
    }
  };

  return (
    <div
      className="w-full max-w-[420px] p-8 shadow-2xl transition-all duration-300 relative z-10"
      style={{
        background: "rgba(255, 255, 255, 0.07)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: "24px",
        border: "1px solid rgba(255, 255, 255, 0.15)",
        boxShadow:
          "0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F6F5]">
            Login to your account
          </h1>
          <button
            type="button"
            onClick={onSignUp}
            className="text-sm font-bold text-white hover:underline transition-colors focus:outline-none cursor-pointer"
          >
            Sign Up
          </button>
        </div>
        <p className="text-sm font-normal text-[#A1A1A4] leading-relaxed">
          Enter your email below to login to your account
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#F5F6F5]"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="m@example.com"
            required
            className="w-full px-4 py-3 text-sm placeholder-[#A1A1A4]/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              borderRadius: "12px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#F5F6F5",
            }}
          />
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#F5F6F5]"
            >
              Password
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs font-normal text-[#A1A1A4] hover:text-white transition-colors focus:outline-none cursor-pointer"
            >
              Forgot your password?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full pl-4 pr-11 py-3 text-sm placeholder-[#A1A1A4]/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/40"
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "#F5F6F5",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A1A1A4] hover:text-white transition-colors focus:outline-none cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Error Messages */}
        {(errorMessage || validationError) && (
          <div className="p-3 text-xs rounded-lg bg-red-500/10 border border-red-500/20 text-red-300">
            {errorMessage || validationError}
          </div>
        )}

        {/* Buttons */}
        <div className="space-y-3 pt-1">
          {/* Primary Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 font-bold text-sm transition-all duration-200 hover:bg-white hover:shadow-lg active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            style={{
              backgroundColor: "#F5F6F5",
              color: "#060403",
              borderRadius: "9999px",
            }}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>

          {/* Secondary Button: Google Login */}
          <button
            type="button"
            onClick={onGoogleLogin}
            className="w-full py-3 px-4 font-medium text-sm flex items-center justify-center gap-3 transition-all duration-200 hover:bg-white/10 hover:border-white/40 active:scale-[0.99] cursor-pointer"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#F5F6F5",
              borderRadius: "9999px",
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.23v3.14C3.2 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.59H1.23C.44 8.16 0 9.98 0 12s.44 3.84 1.23 5.41l4.05-3.14z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.2 2.7 1.23 6.59l4.05 3.14c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Login with Google
          </button>
        </div>
      </form>
    </div>
  );
};

export default GlassmorphismLoginCard;
