import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface SkeletonCardProps {
  imageHeight?: string;
  lines?: number;
  hasFooter?: boolean;
  hasButton?: boolean;
  className?: string;
}

/**
 * Skeleton loader for card components
 */
const SkeletonCard = ({
  imageHeight = "h-48",
  lines = 3,
  hasFooter = true,
  hasButton = true,
  className = "",
}: SkeletonCardProps) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className={`${imageHeight} w-full`}>
        <Skeleton className="h-full w-full" />
      </div>
      
      <CardHeader className="pb-2">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      
      <CardContent className="pb-2">
        {Array(lines)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              key={i}
              className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"} mb-2`}
            />
          ))}
      </CardContent>
      
      {hasFooter && (
        <CardFooter className="flex justify-between pt-0">
          <Skeleton className="h-4 w-1/4" />
          {hasButton && <Skeleton className="h-9 w-24" />}
        </CardFooter>
      )}
    </Card>
  );
};

export default SkeletonCard;
