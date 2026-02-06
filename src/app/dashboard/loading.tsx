import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardLoading() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="h-10 w-64 bg-muted rounded animate-pulse" />
                <div className="h-10 w-32 bg-muted rounded animate-pulse" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-6 space-y-4">
                            <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
                            <div className="h-4 w-full bg-muted rounded animate-pulse" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="h-6 w-48 bg-muted rounded animate-pulse" />
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full bg-muted rounded animate-pulse" />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
