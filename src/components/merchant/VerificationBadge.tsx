import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export type VerificationStatus = "verified" | "pending" | "unverified";

interface VerificationBadgeProps {
  status: VerificationStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

/**
 * Badge showing merchant verification status
 */
const VerificationBadge = ({
  status,
  size = "md",
  showLabel = true,
  className = "",
}: VerificationBadgeProps) => {
  const sizeClasses = {
    sm: "h-5 text-xs",
    md: "h-6 text-sm",
    lg: "h-7 text-base",
  };

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const statusConfig = {
    verified: {
      variant: "success" as const,
      icon: <CheckCircle2 size={iconSize[size]} className="mr-1" />,
      label: "Verified Merchant",
      tooltip: "This merchant has been verified by CityPulse",
    },
    pending: {
      variant: "warning" as const,
      icon: <Clock size={iconSize[size]} className="mr-1" />,
      label: "Verification Pending",
      tooltip: "Verification is in progress for this merchant",
    },
    unverified: {
      variant: "secondary" as const,
      icon: <AlertCircle size={iconSize[size]} className="mr-1" />,
      label: "Unverified",
      tooltip: "This merchant has not completed verification",
    },
  };

  const config = statusConfig[status];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant={config.variant}
            className={`${sizeClasses[size]} font-medium ${className}`}
          >
            {config.icon}
            {showLabel && config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{config.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default VerificationBadge;
