"use client";

import LoginCard from "@/src/components/composite/LoginCard";
import { useSession } from "@/src/hooks/useSession";
import { useRouter } from "next/navigation";

export default function AuthContainer() {
    const router = useRouter();

    const handleLogin = async () => {
        const url = "http://myapp.local:5000/api/login";
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Login Error");
        }

        const { result } = await res.json();

        router.push(result.url);
    };

    return <LoginCard handleLogin={handleLogin} />;
}
