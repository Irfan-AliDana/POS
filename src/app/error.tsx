"use client"; // Error boundaries must be Client Components

import { Flex } from "antd";
import { useEffect } from "react";
import ButtonMod from "../components/base/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <Flex
            justify="center"
            align="center"
            style={{ height: "calc(100vh - 158px)" }}
            vertical
            gap={20}
        >
            <h2
                style={{
                    padding: "20px",
                    backgroundColor: "#ff4c4c",
                    borderRadius: "10px",
                    color: "white",
                }}
            >
                Something went wrong!
            </h2>
            <ButtonMod onClick={() => reset()}>Try again</ButtonMod>
        </Flex>
    );
}
