import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Upload } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Form validation schema
const verificationSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  registrationNumber: z.string().min(2, "Registration number is required"),
  taxId: z.string().min(2, "Tax ID is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  contactPerson: z.string().min(2, "Contact person name is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

interface VerificationFormProps {
  merchantId: string;
  onComplete?: () => void;
  className?: string;
}

/**
 * Form for merchant verification
 */
const VerificationForm = ({
  merchantId,
  onComplete,
  className = "",
}: VerificationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Initialize form
  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      businessName: "",
      registrationNumber: "",
      taxId: "",
      address: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      description: "",
    },
  });

  // Handle document file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    
    if (!file) return;
    
    // Check file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Please upload a PDF, JPEG, or PNG file.");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds the limit of 5MB.");
      return;
    }
    
    setDocumentFile(file);
  };

  // Handle form submission
  const onSubmit = async (values: VerificationFormValues) => {
    if (!documentFile) {
      setUploadError("Please upload a business document for verification.");
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      // 1. Upload document to storage
      const fileExt = documentFile.name.split(".").pop();
      const fileName = `${merchantId}-${Date.now()}.${fileExt}`;
      const filePath = `verification-documents/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("merchant-documents")
        .upload(filePath, documentFile, {
          cacheControl: "3600",
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          },
        });
      
      if (uploadError) throw uploadError;
      
      // 2. Get the public URL
      const { data: urlData } = supabase.storage
        .from("merchant-documents")
        .getPublicUrl(filePath);
      
      // 3. Submit verification request
      const { error: verificationError } = await supabase
        .from("merchant_verifications")
        .insert({
          merchant_id: merchantId,
          business_name: values.businessName,
          registration_number: values.registrationNumber,
          tax_id: values.taxId,
          address: values.address,
          contact_person: values.contactPerson,
          contact_email: values.contactEmail,
          contact_phone: values.contactPhone,
          website: values.website || null,
          description: values.description,
          document_url: urlData.publicUrl,
          status: "pending",
        });
      
      if (verificationError) throw verificationError;
      
      // 4. Update merchant status
      const { error: updateError } = await supabase
        .from("merchants")
        .update({ verification_status: "pending" })
        .eq("id", merchantId);
      
      if (updateError) throw updateError;
      
      toast.success("Verification request submitted successfully");
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Failed to submit verification request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Merchant Verification</CardTitle>
        <CardDescription>
          Complete this form to verify your business and gain the verified merchant badge.
          Verified merchants receive higher visibility and increased trust from customers.
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Business Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Registration Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Registration Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax ID / VAT Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Tax ID or VAT Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Business Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input placeholder="contact@business.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourbusiness.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your business, products, and services" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel>Business Document</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                <input
                  type="file"
                  id="document-upload"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    {documentFile ? documentFile.name : "Click to upload a business document"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPEG, or PNG (max. 5MB)
                  </p>
                </label>
              </div>
              {uploadError && (
                <p className="text-sm text-red-500">{uploadError}</p>
              )}
              <FormDescription>
                Upload a business registration certificate, tax document, or other official document that proves your business identity.
              </FormDescription>
            </div>
            
            {isSubmitting && uploadProgress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
            
            <Alert>
              <AlertDescription>
                Your verification request will be reviewed by our team within 1-3 business days.
                You will be notified by email once your verification is complete.
              </AlertDescription>
            </Alert>
          </CardContent>
          
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Verification Request"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default VerificationForm;
