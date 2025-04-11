import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDealSchema, insertUserSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get("/api/deals", async (req: Request, res: Response) => {
    try {
      const merchantId = req.query.merchantId as string | undefined;
      const featured = req.query.featured === "true";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      let deals;
      if (merchantId) {
        deals = await storage.getDealsByMerchant(merchantId);
      } else if (featured) {
        deals = await storage.getFeaturedDeals(limit);
      } else {
        deals = await storage.getAllDeals();
      }
      
      res.json(deals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deals" });
    }
  });
  
  app.get("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const deal = await storage.getDealById(id);
      
      if (!deal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      await storage.incrementDealViews(id);
      res.json(deal);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deal" });
    }
  });
  
  app.post("/api/deals", async (req: Request, res: Response) => {
    try {
      const dealData = insertDealSchema.parse(req.body);
      const deal = await storage.createDeal(dealData);
      res.status(201).json(deal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid deal data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create deal" });
    }
  });
  
  app.put("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updatedDeal = await storage.updateDeal(id, req.body);
      
      if (!updatedDeal) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      res.json(updatedDeal);
    } catch (error) {
      res.status(500).json({ message: "Failed to update deal" });
    }
  });
  
  app.delete("/api/deals/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDeal(id);
      
      if (!success) {
        return res.status(404).json({ message: "Deal not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete deal" });
    }
  });
  
  app.get("/api/events", async (req: Request, res: Response) => {
    try {
      const featured = req.query.featured === "true";
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const events = featured 
        ? await storage.getFeaturedEvents(limit)
        : await storage.getAllEvents();
      
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch events" });
    }
  });
  
  app.get("/api/events/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const event = await storage.getEventById(id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch event" });
    }
  });
  
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // In a real app, we would set up a session or JWT here
      res.json({ 
        id: user.id, 
        username: user.username, 
        email: user.email,
        merchantId: user.merchantId,
        merchantName: user.merchantName
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      const user = await storage.createUser(userData);
      
      res.status(201).json({ 
        id: user.id, 
        username: user.username, 
        email: user.email,
        merchantId: user.merchantId,
        merchantName: user.merchantName
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
