import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface OnboardingGuideProps {
  merchantId: string;
  onComplete?: () => void;
  className?: string;
}

/**
 * Step-by-step onboarding guide for new merchants
 */
const OnboardingGuide = ({
  merchantId,
  onComplete,
  className = "",
}: OnboardingGuideProps) => {
  // In a real app, this would be fetched from the database
  const [steps, setSteps] = useState<OnboardingStep[]>([
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your business details, logo, and contact information.",
      completed: false,
    },
    {
      id: "verification",
      title: "Verify Your Business",
      description: "Submit documents to verify your business identity.",
      completed: false,
    },
    {
      id: "payment",
      title: "Set Up Payment Methods",
      description: "Connect your bank account to receive payments.",
      completed: false,
    },
    {
      id: "first_deal",
      title: "Create Your First Deal",
      description: "Create an attractive deal to bring in customers.",
      completed: false,
    },
    {
      id: "promote",
      title: "Promote Your Business",
      description: "Learn how to promote your deals and events.",
      completed: false,
    },
  ]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = steps[currentStepIndex];
  const progress = Math.round(
    (steps.filter((step) => step.completed).length / steps.length) * 100
  );

  // Mark step as completed
  const markStepCompleted = async (stepId: string) => {
    // In a real app, this would update the database
    setSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
    
    // Update onboarding progress in the database
    try {
      await supabase
        .from("merchant_onboarding")
        .upsert({
          merchant_id: merchantId,
          step_id: stepId,
          completed_at: new Date().toISOString(),
        });
      
      // Check if all steps are completed
      const updatedSteps = steps.map((step) =>
        step.id === stepId ? { ...step, completed: true } : step
      );
      
      const allCompleted = updatedSteps.every((step) => step.completed);
      
      if (allCompleted && onComplete) {
        // Update merchant status
        await supabase
          .from("merchants")
          .update({ onboarding_completed: true })
          .eq("id", merchantId);
        
        onComplete();
      }
    } catch (error) {
      console.error("Error updating onboarding progress:", error);
    }
  };

  // Navigate to next step
  const goToNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  // Navigate to previous step
  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Render step content
  const renderStepContent = (stepId: string) => {
    switch (stepId) {
      case "profile":
        return (
          <div className="space-y-4">
            <p>
              A complete profile helps customers trust your business. Make sure to include:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Business name and description</li>
              <li>Logo and cover image</li>
              <li>Contact information</li>
              <li>Business hours</li>
              <li>Location and service areas</li>
            </ul>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Businesses with complete profiles receive up to 75% more views!
              </AlertDescription>
            </Alert>
            <div className="pt-4">
              <Button
                onClick={() => window.location.href = "/merchant/profile"}
                className="mr-2"
              >
                Edit Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => markStepCompleted("profile")}
              >
                Mark as Completed
              </Button>
            </div>
          </div>
        );
      
      case "verification":
        return (
          <div className="space-y-4">
            <p>
              Verified merchants receive a badge that builds customer trust and increases visibility.
            </p>
            <p>To verify your business, you'll need to provide:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Business registration documents</li>
              <li>Tax ID or VAT number</li>
              <li>Proof of business address</li>
              <li>Owner identification</li>
            </ul>
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Verified merchants see an average of 40% more engagement!
              </AlertDescription>
            </Alert>
            <div className="pt-4">
              <Button
                onClick={() => window.location.href = "/merchant/verification"}
                className="mr-2"
              >
                Start Verification
              </Button>
              <Button
                variant="outline"
                onClick={() => markStepCompleted("verification")}
              >
                Mark as Completed
              </Button>
            </div>
          </div>
        );
      
      case "payment":
        return (
          <div className="space-y-4">
            <p>
              Set up your payment methods to receive payments from customers.
            </p>
            <p>We support the following payment methods:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Direct bank deposits</li>
              <li>Stripe integration</li>
              <li>PayFast</li>
            </ul>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Payments are processed securely and deposited to your account within 2-3 business days.
              </AlertDescription>
            </Alert>
            <div className="pt-4">
              <Button
                onClick={() => window.location.href = "/merchant/payments"}
                className="mr-2"
              >
                Set Up Payments
              </Button>
              <Button
                variant="outline"
                onClick={() => markStepCompleted("payment")}
              >
                Mark as Completed
              </Button>
            </div>
          </div>
        );
      
      case "first_deal":
        return (
          <div className="space-y-4">
            <p>
              Create your first deal to attract customers to your business.
            </p>
            <p>Tips for creating effective deals:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Offer a compelling discount (at least 20%)</li>
              <li>Use high-quality images</li>
              <li>Write clear, concise descriptions</li>
              <li>Set reasonable redemption terms</li>
              <li>Add relevant tags for better discoverability</li>
            </ul>
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Deals with images receive 3x more views than those without!
              </AlertDescription>
            </Alert>
            <div className="pt-4">
              <Button
                onClick={() => window.location.href = "/merchant/deals/new"}
                className="mr-2"
              >
                Create Deal
              </Button>
              <Button
                variant="outline"
                onClick={() => markStepCompleted("first_deal")}
              >
                Mark as Completed
              </Button>
            </div>
          </div>
        );
      
      case "promote":
        return (
          <div className="space-y-4">
            <p>
              Learn how to promote your business and deals to reach more customers.
            </p>
            <p>Promotion strategies:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Share deals on your social media</li>
              <li>Use the "Share" button on your deals</li>
              <li>Encourage customers to leave reviews</li>
              <li>Consider featured placement options</li>
              <li>Create limited-time offers to create urgency</li>
            </ul>
            <Alert>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                Merchants who promote their deals see up to 5x more redemptions!
              </AlertDescription>
            </Alert>
            <div className="pt-4">
              <Button
                onClick={() => window.location.href = "/merchant/marketing"}
                className="mr-2"
              >
                Marketing Tools
              </Button>
              <Button
                variant="outline"
                onClick={() => markStepCompleted("promote")}
              >
                Mark as Completed
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Merchant Onboarding Guide</CardTitle>
        <CardDescription>
          Complete these steps to set up your merchant account and start attracting customers.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <Tabs defaultValue="steps" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="steps">Step by Step</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="steps" className="pt-4">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Step {currentStepIndex + 1}: {currentStep.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  {currentStep.completed ? (
                    <span className="flex items-center text-green-600">
                      <CheckCircle2 className="mr-1 h-4 w-4" />
                      Completed
                    </span>
                  ) : (
                    <span>Pending</span>
                  )}
                </div>
              </div>
              
              {renderStepContent(currentStep.id)}
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={currentStepIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={goToNextStep}
                  disabled={currentStepIndex === steps.length - 1}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="overview" className="pt-4">
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border ${
                    step.completed
                      ? "bg-green-50 border-green-200"
                      : index === currentStepIndex
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full mr-3 ${
                          step.completed
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{step.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentStepIndex(index)}
                    >
                      {step.completed ? "Review" : "Start"}
                    </Button>
                  </div>
                </div>
              ))}
              
              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open("https://help.citypulse-sa.com/merchant-guide", "_blank")}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Complete Merchant Guide
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t pt-6">
        <p className="text-sm text-muted-foreground">
          Need help? Contact our merchant support team.
        </p>
        <Button variant="outline" size="sm" onClick={() => window.location.href = "/merchant/support"}>
          Get Support
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OnboardingGuide;
