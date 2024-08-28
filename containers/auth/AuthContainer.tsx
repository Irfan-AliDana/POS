"use client";

import { signIn, signOut } from "next-auth/react";
import LoginCard from "@/components/composite/LoginCard";

export default function AuthContainer() {
    const handleLogin = () =>
        signIn("square", { callbackUrl: "https://myapp.local:3000/dashboard" });
    // const handleLogout = () => signOut();

    return <LoginCard handleLogin={handleLogin} />;
}
