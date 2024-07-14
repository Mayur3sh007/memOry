"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, db, googleAuthProvider, storage } from "@/config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup, User } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { IconBrandGoogle } from "@tabler/icons-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const router = useRouter();

  // Fetching user data from local storage if it exists
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedUsername = localStorage.getItem("username");
    const savedAvatarURL = localStorage.getItem("avatarURL");

    if (savedEmail && savedUsername) {
      setEmail(savedEmail);
      setUsername(savedUsername);
    }
  }, []);

  const addAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAvatar(e.target.files[0]);
    }
  };

  const addUsertoDB = async (user: User, avatarURL: string | null, username: string, email: string) => {
    try {
      const userRef = doc(db, "Users", user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          username: username,
          email: email,
          avatarURL: avatarURL,
        });

        // Creates random doc id for user 
        // await addDoc(collection(db, "Users"), {  
        //   uid: user.uid,
        //   username: username,
        //   email: email,
        //   avatarURL: avatarURL,
        // });
      }
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        let avatarURL = null;

        if (avatar) {
          const avatarRef = ref(storage, `avatars/${username}'s Avatar`);
          const snapshot = await uploadBytes(avatarRef, avatar);
          avatarURL = await getDownloadURL(snapshot.ref);
        }

        await addUsertoDB(user, avatarURL, username, email);

        toast.success("Successfully signed up!", {
          position: "bottom-left",
        });
        router.push("/");
      }
    } catch (error: any) {
      console.error("Signup Error:", error.message);
      toast.error(`Error: ${error.message}`, {
        position: "bottom-left",
      });
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const user = result.user;

      if (user) {
        const username = user.displayName || "";
        const email = user.email || "";
        const avatarURL = user.photoURL || null;

        await addUsertoDB(user, avatarURL, username, email);

        toast.success("Successfully signed in with Google!", {
          position: "bottom-left",
        });
        router.push("/");
      }
    } catch (error: any) {
      console.error("Google Sign-in Error:", error.message);
      toast.error(`Error: ${error.message}`, {
        position: "bottom-left",
      });
    }
  };



  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-gray-200 border border-y-neutral-400">
      <h2 className="font-bold text-xl text-neutral-800 text-center">Sign Up</h2>
      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="your-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-yellow-50"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="avatar">Avatar</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={addAvatar}
            className="bg-yellow-50"
          />
        </LabelInputContainer>
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
          className="bg-yellow-400 hover:bg-yellow-500 text-white w-full rounded-md h-10 font-medium shadow hover:shadow-amber-300"
          type="submit"
        >
          Sign up &rarr;
        </button>
        <div className="bg-gradient-to-r from-transparent via-blue-300 to-transparent my-8 h-[1px] w-full" />
        <div className="flex flex-col space-y-4">
          <button
            className="flex space-x-2 items-center justify-start px-4 w-full text-yellow-100 rounded-md h-10 font-medium shadow-input bg-blue-400 hover:bg-blue-500 focus:outline-none"
            type="button"
            onClick={signInWithGoogle}
          >
            <IconBrandGoogle className="h-4 w-4" style={{ color: "red" }} />
            <span className="font-bold">Sign in with Google</span>
          </button>
        </div>
        <div className="flex flex-col space-y-4 mt-4 text-blue-600 hover:text-color-400">
          <Link href="/log-in" className="text-center">
            <h3>Already have an account?</h3>
          </Link>
        </div>
      </form>
    </div>
  );
};

interface LabelInputContainerProps {
  children: React.ReactNode;
  className: string;
}

const LabelInputContainer = ({ children, className }: LabelInputContainerProps) => {
  return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};

export default SignupPage;
