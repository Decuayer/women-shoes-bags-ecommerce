
import Sidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/AdminHeader'

interface AdminLayoutProps {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
    const { locale } = await params

    return (
        <div className="flex min-h-screen bg-background text-text">
            <Sidebar locale={locale} />
            <div className="flex-1 flex flex-col min-w-0">
                <AdminHeader locale={locale} />
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
