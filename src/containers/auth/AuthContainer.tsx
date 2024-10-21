"use client";

import LoginCard from "@/src/components/composite/LoginCard";
import { useSession } from "@/src/hooks/useSession";
import { BASE_URL_API } from "@/src/utils/constants";
import { useRouter } from "next/navigation";

export default function AuthContainer() {
    const router = useRouter();

    const handleLogin = async () => {
        const url = `${BASE_URL_API}/api/login`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Login Error");
        }

        const { result } = await res.json();

        router.push(result.url);
    };

    return <LoginCard handleLogin={handleLogin} />;
}
