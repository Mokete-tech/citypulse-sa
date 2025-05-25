import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CommissionCalculator from './CommissionCalculator';

interface ServiceType {
  name: string;
  description: string;
  baseCommission: number;
  volumeDiscount: {
    threshold: number;
    discount: number;
  }[];
  features: string[];
}

const serviceTypes: ServiceType[] = [
  {
    name: "Table Reservations",
    description: "Restaurant and bar table bookings",
    baseCommission: 2.5,
    volumeDiscount: [
      { threshold: 50, discount: 0.5 },
      { threshold: 100, discount: 1.0 },
    ],
    features: [
      "Real-time availability",
      "Instant confirmation",
      "Customer reminders",
      "No-show protection"
    ]
  },
  {
    name: "Event Tickets",
    description: "Concert, theater, and special event tickets",
    baseCommission: 3.0,
    volumeDiscount: [
      { threshold: 100, discount: 0.5 },
      { threshold: 500, discount: 1.0 },
    ],
    features: [
      "Digital ticket delivery",
      "QR code scanning",
      "Event analytics",
      "Marketing tools"
    ]
  },
  {
    name: "Spa & Wellness",
    description: "Massage, spa treatments, and wellness services",
    baseCommission: 2.0,
    volumeDiscount: [
      { threshold: 30, discount: 0.5 },
      { threshold: 75, discount: 1.0 },
    ],
    features: [
      "Service scheduling",
      "Therapist profiles",
      "Package deals",
      "Loyalty rewards"
    ]
  },
  {
    name: "Room Bookings",
    description: "Hotel rooms and accommodation",
    baseCommission: 3.5,
    volumeDiscount: [
      { threshold: 25, discount: 0.5 },
      { threshold: 50, discount: 1.0 },
    ],
    features: [
      "Room type selection",
      "Special requests",
      "Cancellation policy",
      "Group bookings"
    ]
  }
];

const CommissionStructure = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Commission Structure</h2>
        <p className="text-sm text-muted-foreground">
          Our competitive commission rates help you grow while we handle the platform
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {serviceTypes.map((service) => (
          <Card key={service.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </div>
                <Badge variant="secondary" className="text-lg">
                  {service.baseCommission}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Volume Discounts</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Monthly Bookings</TableHead>
                        <TableHead>Discount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {service.volumeDiscount.map((discount) => (
                        <TableRow key={discount.threshold}>
                          <TableCell>+{discount.threshold}</TableCell>
                          <TableCell>-{discount.discount}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Included Features</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <span className="mr-2">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center text-sm text-muted-foreground">
                  <Info className="h-4 w-4 mr-2" />
                  <span>
                    Commission is calculated on the total booking value
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Benefits</CardTitle>
          <CardDescription>
            Value-added services included with your commission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium">Marketing Support</h4>
              <p className="text-sm text-muted-foreground">
                Featured listings, social media promotion, and email marketing
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Analytics Dashboard</h4>
              <p className="text-sm text-muted-foreground">
                Detailed insights into customer behavior and booking patterns
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Customer Support</h4>
              <p className="text-sm text-muted-foreground">
                24/7 customer service for both merchants and customers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <CommissionCalculator />
    </div>
  );
};

export default CommissionStructure; 