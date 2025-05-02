import { Button } from "@/components/ui/button";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Share2, 
  Copy, 
  Check 
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
  hashtags?: string[];
  className?: string;
  compact?: boolean;
}

/**
 * Component for sharing content to social media platforms
 */
const SocialShare = ({
  url,
  title,
  description = "",
  hashtags = [],
  className = "",
  compact = false
}: SocialShareProps) => {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedHashtags = hashtags.join(",");

  // Share URLs for different platforms
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const emailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;

  // Handle native share if available
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        toast.success("Shared successfully");
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Error sharing content");
          console.error("Error sharing:", error);
        }
      }
    } else {
      toast.error("Native sharing not supported on this device");
    }
  };

  // Copy URL to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        toast.error("Failed to copy link");
        console.error("Could not copy text: ", err);
      }
    );
  };

  // Compact version with just the share button
  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          className="px-2"
          onClick={navigator.share ? handleNativeShare : copyToClipboard}
          title="Share"
        >
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <p className="text-sm font-medium">Share this {description ? "deal" : "content"}:</p>
      <div className="flex flex-wrap gap-2">
        {/* Native Share Button */}
        {navigator.share && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleNativeShare}
            title="Share"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}

        {/* Facebook */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(facebookUrl, "_blank")}
          title="Share on Facebook"
        >
          <Facebook className="h-4 w-4" />
        </Button>

        {/* Twitter/X */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(twitterUrl, "_blank")}
          title="Share on X (Twitter)"
        >
          <Twitter className="h-4 w-4" />
        </Button>

        {/* LinkedIn */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(linkedinUrl, "_blank")}
          title="Share on LinkedIn"
        >
          <Linkedin className="h-4 w-4" />
        </Button>

        {/* Email */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(emailUrl, "_blank")}
          title="Share via Email"
        >
          <Mail className="h-4 w-4" />
        </Button>

        {/* Copy Link */}
        <Button
          variant="outline"
          size="icon"
          onClick={copyToClipboard}
          title="Copy Link"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default SocialShare;
