import { AppProviders } from '@/app/providers'
import { HousesPage } from '@/features/houses/components/HousesPage'
import { AppShell } from '@/shared/components/AppShell'

export default function App() {
  return (
    <AppProviders>
      <AppShell>
        <HousesPage />
      </AppShell>
    </AppProviders>
  )
}
