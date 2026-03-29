import type { ReactNode } from "react";
import { Footer } from "@/shared/components/Footer";
import { Header } from "@/shared/components/Header";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
