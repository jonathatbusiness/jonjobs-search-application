import Footer from "./Footer";
import Header from "./Header";

export default function AppShell({ children, automationEnabled = false }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <Header automationEnabled={automationEnabled} />
      <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      <Footer />
    </div>
  );
}
