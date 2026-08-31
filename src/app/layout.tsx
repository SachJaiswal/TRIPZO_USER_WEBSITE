import type { Metadata } from "next";
import { AppProvider } from "../application/providers/AppProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tripzo — AI Travel Planner & Itinerary Generator",
  description: "Plan your dream trip in seconds with personalized AI travel itineraries, flight tracking, and hotel bookings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
