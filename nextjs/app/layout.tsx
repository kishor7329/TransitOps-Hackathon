import { Outfit } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const outfit = Outfit({
    variable: "--font-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "TransitOps — Smart Transport Operations Platform",
        template: "%s | TransitOps",
    },
    description:
        "TransitOps is a modern smart transport operations platform designed for efficient and scalable transit management. Includes real-time tracking, route optimization, and analytics.",
    keywords: [
        "TransitOps",
        "smart transport",
        "transit management",
        "real-time tracking",
        "route optimization",
        "analytics",
    ],
    authors: [{ name: "TransitOps Hackathon Team" }],
    creator: "TransitOps Hackathon Team",
    publisher: "TransitOps Hackathon Team",

    openGraph: {
        title: "TransitOps — Smart Transport Operations Platform",
        description:
            "Launch faster with TransitOps, a modern smart transport operations platform featuring real-time tracking, route optimization, and analytics.",
        siteName: "PrebuiltUI",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "TransitOps — Smart Transport Operations Platform",
        description:
            "Role-based fleet operations UI built for the TransitOps hackathon challenge.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={outfit.variable}>
                {children}
            </body>
        </html>
    );
}
