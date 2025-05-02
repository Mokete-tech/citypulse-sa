import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, ThumbsUp, Flag, MoreHorizontal, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Review {
  id: string;
  user_id: string;
  merchant_id: string;
  deal_id?: string;
  event_id?: string;
  title: string;
  content: string;
  rating: number;
  helpful_count: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  user: {
    display_name: string;
    avatar_url?: string;
  };
  is_verified_purchase: boolean;
}

interface ReviewListProps {
  merchantId?: string;
  dealId?: string;
  eventId?: string;
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

/**
 * Component to display a list of reviews
 */
const ReviewList = ({
  merchantId,
  dealId,
  eventId,
  limit = 5,
  showFilters = true,
  className = "",
}: ReviewListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest" | "most_helpful">("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [helpfulLoading, setHelpfulLoading] = useState<string | null>(null);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Build query
        let query = supabase
          .from("reviews")
          .select(`
            *,
            user:user_id (
              display_name,
              avatar_url
            )
          `)
          .eq("status", "approved");
        
        // Apply filters
        if (merchantId) {
          query = query.eq("merchant_id", merchantId);
        }
        
        if (dealId) {
          query = query.eq("deal_id", dealId);
        }
        
        if (eventId) {
          query = query.eq("event_id", eventId);
        }
        
        if (filter !== null) {
          query = query.eq("rating", filter);
        }
        
        // Apply sorting
        switch (sortBy) {
          case "newest":
            query = query.order("created_at", { ascending: false });
            break;
          case "highest":
            query = query.order("rating", { ascending: false });
            break;
          case "lowest":
            query = query.order("rating", { ascending: true });
            break;
          case "most_helpful":
            query = query.order("helpful_count", { ascending: false });
            break;
        }
        
        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
        
        // Execute query
        const { data, error, count } = await query;
        
        if (error) throw error;
        
        // Get total count and average rating
        const { data: statsData, error: statsError } = await supabase
          .rpc("get_review_stats", {
            merchant_id_param: merchantId || null,
            deal_id_param: dealId || null,
            event_id_param: eventId || null,
          });
        
        if (statsError) throw statsError;
        
        setReviews(data || []);
        setTotalReviews(count || 0);
        setHasMore(count ? from + limit < count : false);
        
        if (statsData && statsData.length > 0) {
          setAverageRating(statsData[0].average_rating || 0);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, [merchantId, dealId, eventId, filter, sortBy, page, limit]);

  // Mark review as helpful
  const markAsHelpful = async (reviewId: string) => {
    setHelpfulLoading(reviewId);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to mark a review as helpful");
        return;
      }
      
      // Check if user already marked this review
      const { data: existingMark } = await supabase
        .from("review_helpful_marks")
        .select("*")
        .eq("review_id", reviewId)
        .eq("user_id", user.id)
        .single();
      
      if (existingMark) {
        toast.error("You have already marked this review as helpful");
        return;
      }
      
      // Add helpful mark
      await supabase
        .from("review_helpful_marks")
        .insert({
          review_id: reviewId,
          user_id: user.id,
        });
      
      // Update helpful count
      await supabase.rpc("increment_helpful_count", {
        review_id_param: reviewId,
      });
      
      // Update local state
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, helpful_count: review.helpful_count + 1 }
            : review
        )
      );
      
      toast.success("Review marked as helpful");
    } catch (error) {
      console.error("Error marking review as helpful:", error);
      toast.error("Failed to mark review as helpful");
    } finally {
      setHelpfulLoading(null);
    }
  };

  // Report review
  const reportReview = async (reviewId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to report a review");
        return;
      }
      
      // Check if user already reported this review
      const { data: existingReport } = await supabase
        .from("review_reports")
        .select("*")
        .eq("review_id", reviewId)
        .eq("user_id", user.id)
        .single();
      
      if (existingReport) {
        toast.error("You have already reported this review");
        return;
      }
      
      // Add report
      await supabase
        .from("review_reports")
        .insert({
          review_id: reviewId,
          user_id: user.id,
          reason: "inappropriate",
        });
      
      toast.success("Review reported for moderation");
    } catch (error) {
      console.error("Error reporting review:", error);
      toast.error("Failed to report review");
    }
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // Render review summary
  const renderSummary = () => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-2">{averageRating.toFixed(1)}</span>
          {renderStars(Math.round(averageRating))}
          <span className="ml-2 text-sm text-muted-foreground">
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
          </span>
        </div>
        
        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant={filter === null ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFilter(null)}
            >
              All
            </Button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Button
                key={rating}
                variant={filter === rating ? "secondary" : "outline"}
                size="sm"
                onClick={() => setFilter(rating)}
              >
                {rating} {rating === 1 ? "Star" : "Stars"}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render loading state
  const renderLoading = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16 mt-1" />
                </div>
              </div>
              <Skeleton className="h-4 w-20" />
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ));
  };

  // Render empty state
  const renderEmpty = () => {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <p className="text-muted-foreground">No reviews yet. Be the first to leave a review!</p>
        </CardContent>
      </Card>
    );
  };

  // Render error state
  const renderError = () => {
    return (
      <Card className="text-center py-8 border-red-200 bg-red-50">
        <CardContent>
          <p className="text-red-600">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => setPage(1)}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Reviews</h2>
        
        {showFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <select
              className="text-sm border rounded-md px-2 py-1"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Newest</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="most_helpful">Most Helpful</option>
            </select>
          </div>
        )}
      </div>
      
      {renderSummary()}
      
      <div className="space-y-4">
        {isLoading ? (
          renderLoading()
        ) : error ? (
          renderError()
        ) : reviews.length === 0 ? (
          renderEmpty()
        ) : (
          <>
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={review.user.avatar_url || ""} />
                        <AvatarFallback>
                          {review.user.display_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.user.display_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(review.created_at), "MMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{review.title}</h3>
                    {review.is_verified_purchase && (
                      <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{review.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                    onClick={() => markAsHelpful(review.id)}
                    disabled={helpfulLoading === review.id}
                  >
                    {helpfulLoading === review.id ? (
                      <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsUp className="mr-1 h-4 w-4" />
                    )}
                    Helpful ({review.helpful_count})
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => reportReview(review.id)}>
                        <Flag className="mr-2 h-4 w-4" />
                        Report Review
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
            
            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Load More Reviews
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReviewList;
