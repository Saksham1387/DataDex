"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("");
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [passerror, setPassError] = useState(false);
  const [matchEroor, setMatchError] = useState(false);

  const handleProviderLogin = async (provider: string) => {
    const result = await signIn(provider, { redirect: false });
    if (result?.ok) {
      router.push("/dashboard");
    } else if (result?.error) {
      console.error(result.error);
    } else {
      console.error("Sign-in function returned undefined.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const PASSWORD_MIN_LENGTH = 8;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

    if (passwordValue.length < PASSWORD_MIN_LENGTH || !PASSWORD_REGEX.test(passwordValue)) {
      setPassError(true);
      setLoading(false);
      return;
    }

    if (passwordValue !== confirmPasswordValue) {
      console.error("Passwords do not match.");
      setMatchError(true);
      setLoading(false);
      return;
    }

    const result = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullname: fullName,
        username: userName,
        email: email,
        password: passwordValue,
      }),
    });

    const resultJson = await result.json();
    if (!resultJson.error) {
      console.log("Sign-up successful.");
      const signInResult = await signIn("credentials", {
        redirect: false,
        email: email,
        password: passwordValue,
      });
      if (signInResult?.ok) {
        router.push("/dashboard");
      } else if (signInResult?.error) {
        console.error(signInResult.error);
        setError(true);
      }
    } else {
      console.error("Sign-up failed.");
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2 bg-lightgray text-white">
      <div className="hidden lg:block relative">
      <video
            src="/SignupVid.mp4"
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
          />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-center">
            <h1 className="text-slate-300 text-2xl mb-3">Welcome to</h1>
            <h1 className="text-6xl text-white font-roboto">AiGrind Community</h1>
            <h1 className="text-white text-md mt-4">Join a growing community of AI enthusiasts.</h1>
            <button
              onClick={() => router.push("/")}
              className="font-light text-green-300 text-xs hover:underline"
            >
              Know more
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col  p-4 lg:w-1/2 w-full h-full lg:ml-[200px]">
        <div className="max-w-md w-full space-y-3">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2 mt-20">
              <h1 className="text-3xl font-bold">Join Us</h1>
              <Image src="/Main-logo.png" alt="Logo" width={50} height={50} className="object-contain" />
            </div>
            <p className="text-3xl font-bold">Create an Account on AiGrind</p>
            <p className="text-balance text-muted-foreground font-light">To get your first ML interview</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                className="text-black"
                placeholder="John Doe"
                required
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="userName">Username</Label>
              <Input
                id="userName"
                className="text-black"
                type="text"
                placeholder="johndoe123"
                required
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                className="text-black"
                placeholder="m@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  className="pr-10 text-black"
                />
                {passwordValue && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="text-black" size={20} />
                    ) : (
                      <Eye className="text-black" size={20} />
                    )}
                  </button>
                )}
              </div>
            </div>
            {passerror && (
              <p className="text-red-500 text-sm text-center">
                Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number
                <button
                  className="ml-3 underline"
                  onClick={() => {
                    setPasswordValue("");
                    setConfirmPasswordValue("");
                    setError(false);
                    setPassError(false);
                  }}
                >
                  Try Again
                </button>
              </p>
            )}
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPasswordValue}
                  onChange={(e) => setConfirmPasswordValue(e.target.value)}
                  className="pr-10 text-black"
                />
                {confirmPasswordValue && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="text-black" size={20} />
                    ) : (
                      <Eye className="text-black" size={20} />
                    )}
                  </button>
                )}
              </div>
            </div>
            {matchEroor && (
              <div className="text-red-500 text-center">
                The Passwords should match{" "}
                <button
                  className="underline"
                  onClick={() => {
                    setPasswordValue("");
                    setConfirmPasswordValue("");
                    setMatchError(false);
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
            <Button type="submit" className="w-full bg-white text-black hover:bg-slate-100 mt-5" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
            {error && (
              <div className="text-red-500 text-center">
                An account with this email already exists.{" "}
                <button
                  className="underline"
                  onClick={() => {
                    setError(false);
                    setEmail("");
                    setPasswordValue("");
                    setConfirmPasswordValue("");
                  }}
                >
                  Try Again
                </button>
              </div>
            )}
          </form>
          <div className="space-y-2">
            {/* <Button
              className="w-full border bg-white text-black hover:bg-white"
              onClick={() => handleProviderLogin("github")}
              disabled={loading}
            >
              <div className="bg-white p-1 rounded-full">
                    <svg className="w-6" viewBox="0 0 32 32">
                      <path
                        fillRule="evenodd"
                        d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                      />
                    </svg>
                  </div>
              Sign up with GitHub
            </Button> */}
            <Button
              className="w-full border bg-white text-black hover:bg-white"
              onClick={() => handleProviderLogin("google")}
              disabled={loading}
            >
              <div className="bg-white p-2 rounded-full">
                    <svg className="w-4" viewBox="0 0 533.5 544.3">
                      <path
                        d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                        fill="#4285f4"
                      />
                      <path
                        d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                        fill="#34a853"
                      />
                      <path
                        d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                        fill="#fbbc04"
                      />
                      <path
                        d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                        fill="#ea4335"
                      />
                    </svg>
                  </div>
              Sign up with Google
            </Button>
          </div>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/signin" className="underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;