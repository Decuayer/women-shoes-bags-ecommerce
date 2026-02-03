export default function ProductsLoading() {
    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container py-12">
                {/* Page Title Skeleton */}
                <div className="mb-8">
                    <div className="skeleton h-10 w-48 mb-4" />
                    <div className="skeleton h-5 w-64" />
                </div>

                {/* Filters Skeleton */}
                <div className="flex gap-4 mb-8 overflow-x-auto">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="skeleton h-10 w-24 rounded-full flex-shrink-0" />
                    ))}
                </div>

                {/* Products Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="card">
                            <div className="skeleton aspect-[3/4]" />
                            <div className="p-4 space-y-3">
                                <div className="skeleton h-5 w-3/4" />
                                <div className="skeleton h-4 w-1/2" />
                                <div className="flex justify-between items-center">
                                    <div className="skeleton h-6 w-20" />
                                    <div className="skeleton h-9 w-9 rounded-full" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
