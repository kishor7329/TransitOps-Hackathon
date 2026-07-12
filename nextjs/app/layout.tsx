import { Outfit } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";

const outfit = Outfit({
    variable: "--font-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: {
        default: "TransitOps | Smart Transport Operations Platform",
        template: "%s | TransitOps",
    },
    description:
        "TransitOps is a role-based transport operations platform for fleet, driver, trip, maintenance, fuel, expense, and analytics workflows.",
    keywords: [
        "TransitOps",
        "fleet management",
        "transport operations",
        "dispatch management",
        "maintenance tracking",
        "RBAC dashboard",
    ],
    authors: [{ name: "TransitOps Hackathon Team" }],
    creator: "TransitOps Hackathon Team",
    publisher: "TransitOps Hackathon Team",

    openGraph: {
        title: "TransitOps | Smart Transport Operations Platform",
        description:
            "A responsive operations workspace for vehicles, drivers, dispatch, maintenance, fuel, expenses, and analytics.",
        siteName: "TransitOps",
        type: "website",
    },

    twitter: {
        card: "summary_large_image",
        title: "TransitOps | Smart Transport Operations Platform",
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
