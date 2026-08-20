import { AuthProvider } from '@/context/AuthContext'
import { TripsProvider } from '@/context/TripsContext'
import { Toaster } from 'react-hot-toast'
import Nav from '@/components/layout/Nav'
import PWAInstallBanner from '@/components/PWAInstallBanner'

export default function NewTripLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <TripsProvider>
        <div className="min-h-screen bg-slate-50">
          <Nav />
          <main>{children}</main>
        </div>
        <PWAInstallBanner />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { borderRadius: '12px', background: '#1e293b', color: '#f8fafc', fontSize: '14px' },
            duration: 3000,
          }}
        />
      </TripsProvider>
    </AuthProvider>
  )
}
