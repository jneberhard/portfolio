import type { Metadata, Viewport } from "next";
import "./globals.css";

// Site-wide search, sharing, and favicon metadata. Route-level metadata can extend
// or replace these defaults for pages such as case studies and the privacy notice.
export const metadata: Metadata = {
  title: "Jim Eberhard | Full-Stack Software Developer",
  description:
    "Portfolio of Jim Eberhard, a full-stack software developer building clear, scalable, user-focused applications.",
  keywords: [
    "Jim Eberhard",
    "software developer",
    "full-stack developer",
    "React developer",
    "Node.js developer",
    "BYU-Idaho",
  ],
  authors: [{ name: "Jim Eberhard" }],
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Jim Eberhard | Full-Stack Software Developer",
    description:
      "Modern web applications with thoughtful user experiences and maintainable software foundations.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Jim Eberhard | Full-Stack Software Developer",
    description:
      "Modern web applications with thoughtful user experiences and maintainable software foundations.",
  },
};

// Keep browser chrome aligned with the portfolio's light editorial color palette.
export const viewport: Viewport = {
  themeColor: "#f4f0e7",
  colorScheme: "light",
};

/** Root App Router layout shared by every page in the portfolio. */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
