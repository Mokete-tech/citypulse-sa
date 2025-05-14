import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Terms = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>1. Introduction</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Welcome to CityPulse South Africa. These Terms and Conditions govern your use of our website and services.
                  By accessing or using CityPulse South Africa, you agree to be bound by these Terms. If you disagree with any part of the terms,
                  you may not access the service.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>2. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  When you create an account with us, you must provide accurate, complete, and current information.
                  You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
                <p>
                  You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>3. Merchant Accounts</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Merchants are responsible for the accuracy of their listings, including deals, events, and business information.
                  All promotional content must comply with applicable laws and regulations.
                </p>
                <p>
                  Merchants agree to honor all deals and promotions listed on the platform for the duration specified.
                  CityPulse South Africa reserves the right to remove any content that violates these terms.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>4. Content and Conduct</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material.
                  You are responsible for the content you post and its legality.
                </p>
                <p>
                  You agree not to post content that is illegal, fraudulent, misleading, or infringes on intellectual property rights.
                  CityPulse South Africa has the right to remove any content that violates these terms.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>5. Payments and Fees</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Merchants may be charged fees for listing deals and events on the platform. All fees are non-refundable unless otherwise specified.
                </p>
                <p>
                  Payment processing is handled by our third-party payment processor, Stripe. By using our payment services,
                  you agree to Stripe's terms of service.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>6. Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information.
                  By using our service, you agree to our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>7. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  CityPulse South Africa shall not be liable for any indirect, incidental, special, consequential or punitive damages,
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>8. Changes to Terms</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of these terms.
                  Your continued use of the platform after such modifications will constitute your acknowledgment of the modified terms.
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>9. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose max-w-none">
                <p>
                  If you have any questions about these Terms, please contact us at info@citypulse.co.za.
                </p>
              </CardContent>
            </Card>

            <p className="text-sm text-muted-foreground text-center mt-8">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Terms;
