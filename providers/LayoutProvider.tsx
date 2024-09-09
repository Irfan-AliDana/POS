"use client";

import LayoutContainer from "@/containers/layout/LayoutContainer";

export default function LayoutProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <LayoutContainer>{children}</LayoutContainer>;
}
