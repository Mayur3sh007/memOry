"use client";
import React, { useEffect, useState } from "react";
import { auth } from '@/config/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Switch } from "@/components/ui/switch";


const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");
    if (savedEmail) {
      setEmail(savedEmail);
      setPassword(savedPassword);
    }
  }, []);

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/");
      toast.success("Successfully signed in!", {
        position: "bottom-left",
      });
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      }
    } catch (error) {
      console.log(error);
      toast.error("Invalid email or password!", {
        position: "bottom-left",
      });
    }
  };

  const handleSwitchToggle = () => {
    setRememberMe(!rememberMe);
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-gray-200 border border-y-neutral-400 space-y-4">
      <h2 className="font-bold text-xl text-neutral-800 text-center">
        Login
      </h2>

      <form className="my-12" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="your-email@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-yellow-50"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-yellow-50"
          />
        </LabelInputContainer>

        <button
          className="bg-yellow-400 hover:bg-yellow-500 text-white w-full rounded-md h-10 font-medium shadow"
          type="submit"
        >
          Login &rarr;
        </button>

        <div className="flex mt-2 max-w-fit items-center justify-center space-x-2">
          <label>Remember Me</label>
          <Switch checked={rememberMe} onCheckedChange={handleSwitchToggle}/>
        </div>

        <div className="bg-gradient-to-r from-transparent via-blue-300 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4 mt-4 text-blue-600 hover:text-color-400">
          <Link href="/sign-up" className="text-center">
            <h3>Don't have an account?</h3>
          </Link>
        </div>
      </form>
    </div>
  );
};

const LabelInputContainer = ({ children, className } : { children : any, className : string }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default LoginPage;
