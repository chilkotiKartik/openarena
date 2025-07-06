import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function MentorsLoading() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-4 w-full max-w-3xl" />
          <Skeleton className="h-4 w-full max-w-2xl" />
        </div>

        <div className="flex justify-between items-center gap-4 mb-6">
          <Skeleton className="h-10 w-[300px]" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-6 w-[150px] mb-2" />
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[80px] mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-[80px]" />
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-4 w-[80px]" />
                  </div>

                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>

                  <div>
                    <Skeleton className="h-5 w-[100px] mb-2" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-[80px]" />
                      <Skeleton className="h-6 w-[100px]" />
                      <Skeleton className="h-6 w-[90px]" />
                      <Skeleton className="h-6 w-[110px]" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-4">
                  <Skeleton className="h-9 w-[120px]" />
                  <Skeleton className="h-9 w-[120px]" />
                </CardFooter>
              </Card>
            ))}
        </div>
      </div>
    </div>
  )
}
