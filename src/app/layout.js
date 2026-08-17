import "./globals.css";

export const metadata = {
  title: "JonJobs - Search & Application",
  description: "Personal Job Search CRM",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
