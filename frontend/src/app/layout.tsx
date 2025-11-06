import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SupperClub – Smart Offer Recommendation",
  description: "Technical assessment demo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", padding: "2rem" }}>
        {children}
      </body>
    </html>
  );
}