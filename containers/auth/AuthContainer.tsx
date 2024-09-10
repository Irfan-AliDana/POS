"use client";

import LoginCard from "@/components/composite/LoginCard";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthContainer() {
    const router = useRouter();

    const { data: session } = useQuery({
        queryKey: ["session"],
        queryFn: () => fetch("/api/get-session").then((res) => res.json()),
    });

    const handleLogin = async () => {
        const url = "http://myapp.local:5000/api/login";
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Login Error");
        }

        const { result } = await res.json();

        router.push(result.url);
    };

    if (session?.isLoggedIn) {
        return router.push("/");
    }

    return <LoginCard handleLogin={handleLogin} />;
}
