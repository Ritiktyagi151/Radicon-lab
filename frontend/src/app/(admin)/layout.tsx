import { Geist } from 'next/font/google'
import AdminShell from '@/components/admin/AdminShell'
import { ToastProvider } from '@/components/admin/providers/ToastProvider'

const geist = Geist({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className={geist.className}>
      <ToastProvider>
        <AdminShell>{children}</AdminShell>
      </ToastProvider>
    </div>
  )
}
