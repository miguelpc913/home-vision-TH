import { AppProviders } from "@/app/providers";
import { HousesPage } from "@/features/houses/pages/HousesPage";
import { Footer } from "./shared/components/Footer";
import { Header } from "./shared/components/Header";

export default function App() {
  return (
    <AppProviders>
      <div className="flex min-h-svh flex-col bg-background">
        <Header />
        <main className="flex-1">
          <HousesPage />
        </main>
        <Footer />
      </div>
    </AppProviders>
  );
}
