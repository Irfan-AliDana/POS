import { signIn, signOut } from "next-auth/react";

export default function AuthContainer() {
    const handleLogin = () =>
        signIn("square", { callbackUrl: "https://localhost:3000/dashboard" });
    const handleLogout = () => signOut();

    return { handleLogin, handleLogout };
}
