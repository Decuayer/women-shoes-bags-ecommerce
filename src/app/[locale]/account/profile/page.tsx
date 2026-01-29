import { cookies } from 'next/headers'
import { verifyAccessTokenEdge } from '@/lib/auth-edge'
import { prisma } from '@/lib/prisma'
import ProfileForm from '@/components/account/ProfileForm'
import { redirect } from 'next/navigation'

async function getUser() {
    const cookieStore = await cookies()
    const token = cookieStore.get('accessToken')?.value

    if (!token) return null

    const payload = await verifyAccessTokenEdge(token)
    if (!payload?.userId) return null

    const user = await prisma.user.findUnique({
        where: { id: payload.userId as string },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true
        }
    })

    return user
}

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params
    const isTr = locale === 'tr'
    const user = await getUser()

    if (!user) {
        redirect(`/${locale}/auth/login`)
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                {isTr ? 'Profil Bilgileri' : 'Profile Information'}
            </h1>
            <p className="text-text-muted mb-8">
                {isTr
                    ? 'Kişisel bilgilerinizi ve iletişim detaylarınızı buradan güncelleyebilirsiniz.'
                    : 'You can update your personal information and contact details here.'
                }
            </p>

            <div className="bg-background border border-border p-6 rounded-xl">
                <ProfileForm
                    user={{
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: user.phone || ''
                    }}
                    locale={locale}
                />
            </div>
        </div>
    )
}
