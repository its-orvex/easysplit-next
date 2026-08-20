import { AuthProvider } from '@/context/AuthContext'

export default function SnowLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>
}

