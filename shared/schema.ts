import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  merchantName: text("merchant_name"),
  merchantId: text("merchant_id"),
});

export const deals = pgTable("deals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  discount: text("discount").notNull(),
  category: text("category").notNull(),
  merchantId: text("merchant_id").notNull(),
  merchantName: text("merchant_name").notNull(),
  expirationDate: text("expiration_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  featured: boolean("featured").default(false),
  views: integer("views").default(0),
  imageUrl: text("image_url").default("/placeholder-deal.jpg"),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  price: text("price"),
  createdAt: timestamp("created_at").defaultNow(),
  featured: boolean("featured").default(false),
  imageUrl: text("image_url").default("/placeholder-event.jpg"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  merchantName: true,
  merchantId: true,
});

export const insertDealSchema = createInsertSchema(deals).pick({
  title: true,
  description: true,
  discount: true,
  category: true,
  merchantId: true,
  merchantName: true,
  expirationDate: true,
  featured: true,
  imageUrl: true,
});

export const insertEventSchema = createInsertSchema(events).pick({
  title: true,
  description: true,
  category: true,
  date: true,
  time: true,
  location: true,
  price: true,
  featured: true,
  imageUrl: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDeal = z.infer<typeof insertDealSchema>;
export type Deal = typeof deals.$inferSelect;
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;
