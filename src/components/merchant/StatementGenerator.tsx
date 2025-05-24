import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from '@/components/ui/sonner';
import { FileText, Download, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from '@/contexts/AuthContext';

// Extend jsPDF to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface Transaction {
  id: number;
  created_at: string;
  amount: number;
  status: string;
  payment_method: string;
  item_type: 'deal' | 'event';
  item_id: number;
  item_name: string;
  premium: boolean;
}

interface StatementGeneratorProps {
  merchantId: string;
  merchantName: string;
  merchantEmail: string;
}

export function StatementGenerator({ merchantId, merchantName, merchantEmail }: StatementGeneratorProps) {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date>(startOfMonth(subMonths(new Date(), 1)));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(subMonths(new Date(), 1)));
  const [statementType, setStatementType] = useState<'detailed' | 'summary'>('detailed');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStatement = async () => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'You must be logged in to generate statements.'
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Fetch transactions for the selected period
      const { data: transactions, error } = await supabase
        .from('payments')
        .select(`
          id,
          created_at,
          amount,
          status,
          payment_method,
          item_type,
          item_id,
          item_name,
          premium
        `)
        .eq('merchant_id', merchantId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!transactions || transactions.length === 0) {
        toast.info('No transactions found', {
          description: 'There are no transactions for the selected period.'
        });
        setIsGenerating(false);
        return;
      }

      // Generate PDF statement
      const doc = new jsPDF();
      
      // Add header with logo and merchant info
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204);
      doc.text('CityPulse South Africa', 15, 20);
      
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('Transaction Statement', 15, 30);
      
      // Merchant info
      doc.setFontSize(10);
      doc.text(`Merchant: ${merchantName}`, 15, 40);
      doc.text(`Email: ${merchantEmail}`, 15, 45);
      doc.text(`Period: ${format(startDate, 'dd MMM yyyy')} - ${format(endDate, 'dd MMM yyyy')}`, 15, 50);
      doc.text(`Generated on: ${format(new Date(), 'dd MMM yyyy HH:mm')}`, 15, 55);
      
      // Summary section
      const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
      const successfulTransactions = transactions.filter(t => t.status === 'succeeded');
      const totalSuccessful = successfulTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      doc.setFontSize(12);
      doc.setTextColor(0, 102, 204);
      doc.text('Summary', 15, 65);
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(`Total Transactions: ${transactions.length}`, 15, 75);
      doc.text(`Successful Transactions: ${successfulTransactions.length}`, 15, 80);
      doc.text(`Total Amount: R${totalAmount.toFixed(2)}`, 15, 85);
      doc.text(`Total Successful Amount: R${totalSuccessful.toFixed(2)}`, 15, 90);
      
      // Detailed transactions table
      if (statementType === 'detailed') {
        doc.setFontSize(12);
        doc.setTextColor(0, 102, 204);
        doc.text('Transaction Details', 15, 105);
        
        const tableData = transactions.map(t => [
          format(new Date(t.created_at), 'dd/MM/yyyy'),
          t.item_type.charAt(0).toUpperCase() + t.item_type.slice(1),
          t.item_name,
          t.premium ? 'Premium' : 'Standard',
          t.payment_method,
          t.status.charAt(0).toUpperCase() + t.status.slice(1),
          `R${t.amount.toFixed(2)}`
        ]);
        
        doc.autoTable({
          startY: 110,
          head: [['Date', 'Type', 'Item', 'Level', 'Method', 'Status', 'Amount']],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });
      } else {
        // Summary by type
        doc.setFontSize(12);
        doc.setTextColor(0, 102, 204);
        doc.text('Summary by Type', 15, 105);
        
        const dealTransactions = transactions.filter(t => t.item_type === 'deal');
        const eventTransactions = transactions.filter(t => t.item_type === 'event');
        
        const dealAmount = dealTransactions.reduce((sum, t) => sum + t.amount, 0);
        const eventAmount = eventTransactions.reduce((sum, t) => sum + t.amount, 0);
        
        const summaryData = [
          ['Deals', dealTransactions.length.toString(), `R${dealAmount.toFixed(2)}`],
          ['Events', eventTransactions.length.toString(), `R${eventAmount.toFixed(2)}`],
          ['Total', transactions.length.toString(), `R${totalAmount.toFixed(2)}`]
        ];
        
        doc.autoTable({
          startY: 110,
          head: [['Type', 'Count', 'Amount']],
          body: summaryData,
          theme: 'grid',
          styles: { fontSize: 9 },
          headStyles: { fillColor: [0, 102, 204], textColor: [255, 255, 255] },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        });
      }
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(
          'CityPulse South Africa - This statement is automatically generated and does not require a signature.',
          15,
          doc.internal.pageSize.height - 10
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.width - 30,
          doc.internal.pageSize.height - 10
        );
      }
      
      // Save the PDF
      const filename = `CityPulse_Statement_${merchantName.replace(/\s+/g, '_')}_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.pdf`;
      doc.save(filename);
      
      toast.success('Statement generated', {
        description: 'Your statement has been generated and downloaded.'
      });
    } catch (error) {
      console.error('Error generating statement:', error);
      toast.error('Failed to generate statement', {
        description: 'An error occurred while generating your statement. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generate Statement
        </CardTitle>
        <CardDescription>
          Create and download statements for your transactions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-date">Start Date</Label>
            <DatePicker
              id="start-date"
              date={startDate}
              setDate={setStartDate}
              disabled={(date) => date > new Date() || date > endDate}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-date">End Date</Label>
            <DatePicker
              id="end-date"
              date={endDate}
              setDate={setEndDate}
              disabled={(date) => date > new Date() || date < startDate}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="statement-type">Statement Type</Label>
          <Select value={statementType} onValueChange={(value) => setStatementType(value as 'detailed' | 'summary')}>
            <SelectTrigger id="statement-type">
              <SelectValue placeholder="Select statement type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="detailed">Detailed Statement</SelectItem>
              <SelectItem value="summary">Summary Statement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={generateStatement} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate Statement
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
