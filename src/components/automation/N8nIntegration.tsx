import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Zap, Play, Settings, Workflow, Mail, MessageSquare, Calendar } from 'lucide-react';

const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMTk5MjMzMC00YzRiLTQ1YjQtOWU2OS0xNTZlNDA0MjdhZDIiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQ3OTQ5NTU3fQ.X7JQpz1W9pXshIYOoDz-gkbz-UHfeIHzn-rMUUco9hk";

interface N8nIntegrationProps {
  className?: string;
  onExecutionComplete?: (response: N8nResponse) => void;
  onExecutionError?: (error: N8nError) => void;
  onModeChange?: (isCustomMode: boolean) => void;
  onTemplateSelect?: (templateId: string) => void;
  initialTemplate?: string;
  initialWebhook?: string;
  initialData?: string;
}

interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  webhookUrl: string;
  sampleData: Record<string, string | number | boolean | null | undefined>;
  category?: 'notification' | 'marketing' | 'social' | 'reminder';
  tags?: string[];
  requiredFields?: string[];
  validationRules?: {
    webhook?: RegExp;
    data?: (data: string) => boolean;
  };
}

interface N8nResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  executionId?: string;
  status?: 'running' | 'completed' | 'failed';
  error?: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
  timestamp?: string;
  headers?: Record<string, string>;
}

interface N8nError {
  error: string;
  message: string;
  code?: string;
  details?: Record<string, unknown>;
  timestamp?: string;
  retryable?: boolean;
}

interface N8nState {
  selectedTemplate: string;
  customWebhook: string;
  customData: string;
  isLoading: boolean;
  error: N8nError | null;
  lastExecution: {
    id: string;
    status: 'running' | 'completed' | 'failed';
    timestamp: string;
    webhookUrl?: string;
    data?: Record<string, unknown>;
  } | null;
  isCustomMode: boolean;
  showTemplates: boolean;
  validationErrors: {
    webhook?: string;
    data?: string;
  };
}

interface TemplateExecutionHandler {
  (template: AutomationTemplate): Promise<void>;
}

interface CustomExecutionHandler {
  (): Promise<void>;
}

interface WebhookChangeHandler {
  (e: React.ChangeEvent<HTMLInputElement>): void;
}

interface DataChangeHandler {
  (e: React.ChangeEvent<HTMLTextAreaElement>): void;
}

interface ModeToggleHandler {
  (): void;
}

interface TemplateSelectHandler {
  (templateId: string): void;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string | undefined>;
}

export function N8nIntegration({ 
  className = "",
  onExecutionComplete,
  onExecutionError,
  onModeChange,
  onTemplateSelect,
  initialTemplate = "",
  initialWebhook = "",
  initialData = ""
}: N8nIntegrationProps) {
  const [state, setState] = useState<N8nState>({
    selectedTemplate: initialTemplate,
    customWebhook: initialWebhook,
    customData: initialData,
    isLoading: false,
    error: null,
    lastExecution: null,
    isCustomMode: false,
    showTemplates: true,
    validationErrors: {}
  });

  // Predefined automation templates for CityPulse
  const automationTemplates: AutomationTemplate[] = [
    {
      id: "deal_notification",
      name: "New Deal Notification",
      description: "Send notifications when new deals are added",
      icon: <Zap className="h-4 w-4" />,
      webhookUrl: "https://your-n8n-instance.com/webhook/deal-notification",
      sampleData: {
        dealTitle: "Sample Deal",
        dealPrice: "R99",
        dealLocation: "Cape Town",
        timestamp: new Date().toISOString()
      }
    },
    {
      id: "email_campaign",
      name: "Email Marketing Campaign",
      description: "Trigger email campaigns for deals and events",
      icon: <Mail className="h-4 w-4" />,
      webhookUrl: "https://your-n8n-instance.com/webhook/email-campaign",
      sampleData: {
        campaignType: "weekly_deals",
        recipients: ["user@example.com"],
        dealCount: 5,
        timestamp: new Date().toISOString()
      }
    },
    {
      id: "social_posting",
      name: "Social Media Posting",
      description: "Automatically post deals to social media platforms",
      icon: <MessageSquare className="h-4 w-4" />,
      webhookUrl: "https://your-n8n-instance.com/webhook/social-post",
      sampleData: {
        platform: "twitter",
        dealTitle: "Amazing Deal Alert!",
        dealUrl: "https://citypulse.com/deals/123",
        timestamp: new Date().toISOString()
      }
    },
    {
      id: "event_reminder",
      name: "Event Reminders",
      description: "Send automated reminders for upcoming events",
      icon: <Calendar className="h-4 w-4" />,
      webhookUrl: "https://your-n8n-instance.com/webhook/event-reminder",
      sampleData: {
        eventTitle: "Concert at Stadium",
        eventDate: "2024-02-15",
        reminderType: "24h_before",
        timestamp: new Date().toISOString()
      }
    }
  ];

  const triggerN8nWorkflow = async (webhookUrl: string, data: Record<string, unknown>): Promise<N8nResponse> => {
    // Validate webhook URL
    if (!webhookUrl.startsWith('http')) {
      throw {
        error: 'INVALID_WEBHOOK',
        message: 'Invalid webhook URL',
        code: 'VALIDATION_ERROR',
        retryable: false
      } as N8nError;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    console.log("Triggering n8n workflow:", webhookUrl, data);

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${N8N_API_KEY}`,
        },
        mode: "no-cors",
        body: JSON.stringify({
          ...data,
          source: "citypulse",
          triggered_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw {
          error: 'WORKFLOW_TRIGGER_FAILED',
          message: 'Failed to trigger workflow',
          code: 'API_ERROR',
          details: { status: response.status, statusText: response.statusText },
          retryable: true
        } as N8nError;
      }

      const result: N8nResponse = {
        success: true,
        message: "Workflow triggered successfully",
        data: await response.json(),
        timestamp: new Date().toISOString(),
        headers: Object.fromEntries(response.headers.entries())
      };

      setState(prev => ({
        ...prev,
        lastExecution: {
          id: result.executionId || Date.now().toString(),
          status: result.status || 'completed',
          timestamp: new Date().toISOString(),
          webhookUrl,
          data
        }
      }));

      toast.success("Workflow Triggered", {
        description: "n8n automation has been triggered successfully. Check your n8n instance for execution details.",
      });

      return result;

    } catch (error) {
      const n8nError: N8nError = {
        error: 'WORKFLOW_TRIGGER_FAILED',
        message: error instanceof Error ? error.message : 'Failed to trigger the n8n workflow',
        code: 'API_ERROR',
        timestamp: new Date().toISOString(),
        retryable: true
      };

      setState(prev => ({ ...prev, error: n8nError }));
      console.error("Error triggering n8n workflow:", n8nError);
      toast.error("Automation Failed", {
        description: "Failed to trigger the n8n workflow. Please check your webhook URL and try again.",
      });

      throw n8nError;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleTemplateExecution: TemplateExecutionHandler = async (template: AutomationTemplate) => {
    try {
      await triggerN8nWorkflow(template.webhookUrl, template.sampleData);
    } catch (error) {
      console.error('Template execution failed:', error);
    }
  };

  const validateInput = (): ValidationResult => {
    const errors: ValidationResult['errors'] = {};
    
    if (state.isCustomMode) {
      if (!state.customWebhook) {
        errors.webhook = 'Webhook URL is required';
      } else if (!state.customWebhook.startsWith('http')) {
        errors.webhook = 'Invalid webhook URL';
      }
      
      if (state.customData) {
        try {
          JSON.parse(state.customData);
        } catch (error) {
          errors.data = 'Invalid JSON data';
        }
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  const handleWebhookChange: WebhookChangeHandler = (e) => {
    const value = e.target.value;
    setState(prev => ({ 
      ...prev, 
      customWebhook: value,
      validationErrors: {
        ...prev.validationErrors,
        webhook: value && !value.startsWith('http') ? 'Invalid webhook URL' : undefined
      }
    }));
  };

  const handleDataChange: DataChangeHandler = (e) => {
    const value = e.target.value;
    let dataError: string | undefined;
    
    if (value) {
      try {
        JSON.parse(value);
      } catch (error) {
        dataError = 'Invalid JSON data';
      }
    }
    
    setState(prev => ({ 
      ...prev, 
      customData: value,
      validationErrors: {
        ...prev.validationErrors,
        data: dataError
      }
    }));
  };

  const handleCustomExecution: CustomExecutionHandler = async () => {
    const validation = validateInput();
    if (!validation.isValid) {
      setState(prev => ({ 
        ...prev, 
        validationErrors: validation.errors 
      }));
      toast.error("Validation Error", {
        description: Object.values(validation.errors).filter(Boolean).join(', ')
      });
      return;
    }

    let data: Record<string, unknown> = {};
    if (state.customData) {
      try {
        data = JSON.parse(state.customData);
      } catch (error) {
        toast.error("Invalid JSON", {
          description: "Please enter valid JSON data or leave empty",
        });
        return;
      }
    }

    try {
      const result = await triggerN8nWorkflow(state.customWebhook, data);
      onExecutionComplete?.(result);
    } catch (error) {
      const n8nError = error as N8nError;
      onExecutionError?.(n8nError);
      console.error('Custom execution failed:', n8nError);
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5" />
          n8n Automation Hub
        </CardTitle>
        <CardDescription>
          Trigger automated workflows for CityPulse operations using n8n
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Predefined Templates */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Automation Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automationTemplates.map((template) => (
              <Card key={template.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <h4 className="font-medium">{template.name}</h4>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleTemplateExecution(template)}
                      disabled={state.isLoading}
                      className="shrink-0"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Run
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {template.description}
                  </p>
                  <div className="text-xs bg-muted p-2 rounded">
                    <strong>Webhook:</strong> {template.webhookUrl}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Webhook Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Custom Workflow
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">n8n Webhook URL</Label>
              <Input
                id="webhook-url"
                placeholder="https://your-n8n-instance.com/webhook/your-workflow"
                value={state.customWebhook}
                onChange={handleWebhookChange}
              />
            </div>

            <div>
              <Label htmlFor="custom-data">Custom Data (JSON)</Label>
              <Textarea
                id="custom-data"
                placeholder='{"key": "value", "timestamp": "2024-01-01"}'
                value={state.customData}
                onChange={handleDataChange}
                rows={4}
              />
            </div>

            <Button 
              onClick={handleCustomExecution}
              disabled={state.isLoading}
              className="w-full"
            >
              {state.isLoading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Triggering...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Trigger Custom Workflow
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Setup Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h4 className="font-medium text-blue-800 mb-2">Setup Instructions</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>1. Create workflows in your n8n instance with webhook triggers</p>
            <p>2. Update the webhook URLs in the templates above</p>
            <p>3. Configure your workflows to handle the data structure shown</p>
            <p>4. Test each workflow individually before using in production</p>
          </div>
        </div>

        {/* API Key Info */}
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <h4 className="font-medium text-green-800 mb-2">API Key Status</h4>
          <p className="text-sm text-green-700">
            ✅ n8n API key is configured and ready to use
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

