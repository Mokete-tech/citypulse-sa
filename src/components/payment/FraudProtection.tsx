import { useState } from "react";
import { Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface TransactionRisk {
  score: number;
  level: "low" | "medium" | "high";
  reasons?: string[];
}

interface FraudProtectionProps {
  transactionId?: string;
  risk?: TransactionRisk;
  isChecking?: boolean;
  className?: string;
}

/**
 * Component that displays fraud protection information for transactions
 */
const FraudProtection = ({
  transactionId,
  risk = { score: 0, level: "low" },
  isChecking = false,
  className = "",
}: FraudProtectionProps) => {
  // In a real app, this would be fetched from an API
  const [transactionRisk, setTransactionRisk] = useState<TransactionRisk>(risk);

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600";
      case "medium":
        return "text-amber-600";
      case "high":
        return "text-red-600";
      default:
        return "text-green-600";
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-50 border-green-200";
      case "medium":
        return "bg-amber-50 border-amber-200";
      case "high":
        return "bg-red-50 border-red-200";
      default:
        return "bg-green-50 border-green-200";
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case "low":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "high":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
  };

  if (isChecking) {
    return (
      <Alert className={`border-blue-200 bg-blue-50 ${className}`}>
        <Shield className="h-5 w-5 text-blue-600" />
        <AlertTitle className="text-blue-800">Fraud Check in Progress</AlertTitle>
        <AlertDescription className="text-blue-700">
          <div className="mt-2">
            <p className="text-sm mb-2">Verifying transaction security...</p>
            <Progress value={45} className="h-2" />
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className={`${getRiskBgColor(transactionRisk.level)} ${className}`}>
      {getRiskIcon(transactionRisk.level)}
      <AlertTitle className={getRiskColor(transactionRisk.level)}>
        {transactionRisk.level === "low" && "Secure Transaction"}
        {transactionRisk.level === "medium" && "Transaction Under Review"}
        {transactionRisk.level === "high" && "High Risk Transaction"}
      </AlertTitle>
      <AlertDescription className="text-gray-700">
        <div className="mt-2">
          <div className="flex items-center mb-1">
            <span className="text-sm font-medium mr-2">Risk Score:</span>
            <div className="w-full max-w-[200px] bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  transactionRisk.level === "low"
                    ? "bg-green-600"
                    : transactionRisk.level === "medium"
                    ? "bg-amber-600"
                    : "bg-red-600"
                }`}
                style={{ width: `${transactionRisk.score}%` }}
              ></div>
            </div>
            <span className="text-sm ml-2">{transactionRisk.score}%</span>
          </div>

          {transactionRisk.reasons && transactionRisk.reasons.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium mb-1">Risk Factors:</p>
              <ul className="text-sm list-disc list-inside">
                {transactionRisk.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {transactionId && (
            <p className="text-xs mt-2">
              Transaction ID: {transactionId}
            </p>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default FraudProtection;
