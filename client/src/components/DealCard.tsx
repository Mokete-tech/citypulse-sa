import { Card, CardContent } from "@/components/ui/card";
import { Deal } from "@shared/schema";
import { Link } from "wouter";

interface DealCardProps {
  deal: Deal;
}

export default function DealCard({ deal }: DealCardProps) {
  // Format expiration date
  const formatExpiration = (dateString: string) => {
    const expirationDate = new Date(dateString);
    const today = new Date();
    
    // Calculate days difference
    const diffTime = expirationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return "Expired";
    } else if (diffDays === 1) {
      return "Expires tomorrow";
    } else if (diffDays <= 3) {
      return `Expires in ${diffDays} days`;
    } else {
      // Format date as MMM DD, YYYY
      return `Expires ${expirationDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
  };
  
  const isNew = () => {
    const createdAt = new Date(deal.createdAt);
    const today = new Date();
    const diffTime = today.getTime() - createdAt.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3;
  };

  return (
    <Card className="overflow-hidden transition transform hover:-translate-y-1 hover:shadow-lg">
      <div className="relative">
        <img src={deal.imageUrl} alt={deal.title} className="w-full h-48 object-cover" />
        <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 rounded-bl-lg font-bold text-lg">
          {deal.discount}% OFF
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-neutral-dark/60">{deal.category}</span>
          <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">{deal.city || "Cape Town"}</span>
        </div>
        <h3 className="font-bold text-xl mb-2">{deal.title}</h3>
        <p className="text-neutral-dark/80 mb-4">{deal.description}</p>
        <div className="flex justify-between items-center">
          {isNew() ? (
            <span className="text-xs font-semibold bg-success/20 text-success px-2 py-1 rounded">New Deal</span>
          ) : (
            <span className="text-xs font-semibold bg-warning/20 text-warning px-2 py-1 rounded">{formatExpiration(deal.expirationDate)}</span>
          )}
          <Link href={`/deals/${deal.id}`}>
            <a className="text-primary font-medium hover:text-opacity-80 flex items-center">
              Details
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
