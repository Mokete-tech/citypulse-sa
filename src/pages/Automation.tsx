
import React from 'react';
import { ResponsiveLayout } from '@/components/layout/ResponsiveLayout';
import { N8nIntegration } from '@/components/automation/N8nIntegration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Workflow, Zap, Bot, Clock } from 'lucide-react';

const Automation = () => {
  return (
    <ResponsiveLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">CityPulse Automation</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automate your CityPulse operations with powerful n8n workflows
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <Bot className="h-8 w-8 mx-auto text-primary" />
              <CardTitle>Smart Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Automate repetitive tasks like notifications, email campaigns, and social media posting
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 mx-auto text-primary" />
              <CardTitle>Save Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Reduce manual work and focus on growing your business with automated workflows
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Workflow className="h-8 w-8 mx-auto text-primary" />
              <CardTitle>Custom Workflows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                Create custom automation flows tailored to your specific business needs
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Automation Component */}
        <N8nIntegration />

        {/* Additional Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Popular Automation Ideas
            </CardTitle>
            <CardDescription>
              Here are some popular automation workflows you can set up with n8n
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Marketing Automation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Send welcome emails to new users</li>
                  <li>• Create weekly deal newsletters</li>
                  <li>• Post new deals to social media</li>
                  <li>• Send personalized recommendations</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Operational Automation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Generate merchant reports</li>
                  <li>• Monitor deal performance</li>
                  <li>• Send event reminders</li>
                  <li>• Update inventory levels</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
};

export default Automation;
