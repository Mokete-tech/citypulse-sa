import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Download, FileText, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { mailerSendService } from '@/services/mailersend-service';

interface StatementGeneratorProps {
  merchantId: string;
  merchantName: string;
  className?: string;
}

export function StatementGenerator({ merchantId, merchantName, className }: StatementGeneratorProps) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 0)
  );
  const [statementType, setStatementType] = useState<'detailed' | 'summary'>('detailed');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEmailSending, setIsEmailSending] = useState(false);
  const [generatedStatementUrl, setGeneratedStatementUrl] = useState<string | null>(null);

  const generateStatement = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select a date range');
      return;
    }

    if (endDate < startDate) {
      toast.error('End date must be after start date');
      return;
    }

    setIsGenerating(true);
    setGeneratedStatementUrl(null);

    try {
      // Call Supabase function to generate statement
      const { data, error } = await supabase.functions.invoke('generate-statement', {
        body: {
          merchantId,
          startDate: format(startDate, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd'),
          statementType,
        }
      });

      if (error) throw error;

      if (data?.statementUrl) {
        setGeneratedStatementUrl(data.statementUrl);
        toast.success('Statement generated successfully');
      } else {
        throw new Error('No statement URL returned');
      }
    } catch (error: any) {
      console.error('Error generating statement:', error);
      toast.error('Failed to generate statement', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const sendStatementEmail = async () => {
    if (!generatedStatementUrl || !user?.email) {
      toast.error('No statement available to send');
      return;
    }

    setIsEmailSending(true);

    try {
      const periodText = `${format(startDate!, 'MMMM yyyy')}`;
      
      const { success, error } = await mailerSendService.sendMerchantStatementEmail(
        user.email,
        merchantName,
        generatedStatementUrl,
        periodText
      );

      if (!success) throw new Error(error);
      
      toast.success('Statement sent to your email', {
        description: `Check your inbox at ${user.email}`
      });
    } catch (error: any) {
      console.error('Error sending statement email:', error);
      toast.error('Failed to send statement email', {
        description: error.message || 'An unexpected error occurred'
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle>Generate Statement</CardTitle>
        <CardDescription>
          Create financial statements for your merchant account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Date Range</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <span className="hidden sm:flex items-center">to</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "End date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Statement Type</Label>
          <RadioGroup
            value={statementType}
            onValueChange={(value) => setStatementType(value as 'detailed' | 'summary')}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="detailed" id="detailed" />
              <Label htmlFor="detailed" className="font-normal cursor-pointer">
                Detailed (includes all transactions)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="summary" id="summary" />
              <Label htmlFor="summary" className="font-normal cursor-pointer">
                Summary (monthly totals only)
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <Button 
          onClick={generateStatement} 
          disabled={isGenerating || !startDate || !endDate}
          className="w-full sm:w-auto"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Generate Statement
            </>
          )}
        </Button>
        
        {generatedStatementUrl && (
          <>
            <Button 
              variant="outline" 
              onClick={() => window.open(generatedStatementUrl, '_blank')}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
            
            <Button 
              variant="secondary" 
              onClick={sendStatementEmail}
              disabled={isEmailSending}
              className="w-full sm:w-auto"
            >
              {isEmailSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Email Statement
                </>
              )}
            </Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
