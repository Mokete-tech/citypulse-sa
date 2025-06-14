
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-white py-12 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600">Get in touch with the CityPulse team</p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Send us a message</CardTitle>
              <p className="text-gray-600 text-center">We'll get back to you as soon as possible</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input placeholder="First Name" required />
                <Input placeholder="Last Name" required />
              </div>
              <Input placeholder="Email Address" type="email" required />
              <Input placeholder="Subject" required />
              <Textarea 
                placeholder="Your message..." 
                className="min-h-[150px]" 
                required 
              />
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
                Send Message
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
