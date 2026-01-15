import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Live Calls",
    description: "Painel de Live Calls para streams",
};

export default function LiveCallsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
