export default function Loading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Header Skeleton */}
            <div className="glass sticky top-0 z-50">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <div className="skeleton h-8 w-32" />
                        <div className="hidden md:flex gap-6">
                            <div className="skeleton h-6 w-20" />
                            <div className="skeleton h-6 w-20" />
                            <div className="skeleton h-6 w-20" />
                        </div>
                        <div className="flex gap-4">
                            <div className="skeleton h-8 w-8 rounded-full" />
                            <div className="skeleton h-8 w-8 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Skeleton */}
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="card">
                            <div className="skeleton aspect-[3/4]" />
                            <div className="p-4 space-y-3">
                                <div className="skeleton h-5 w-3/4" />
                                <div className="skeleton h-4 w-1/2" />
                                <div className="skeleton h-6 w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
