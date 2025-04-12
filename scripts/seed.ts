import { db, pool } from "../server/db";
import { users, deals, events } from "../shared/schema";

async function seed() {
  console.log("🌱 Seeding database with sample data...");

  // Clear existing data
  await db.delete(deals);
  await db.delete(events);
  await db.delete(users);

  // Add sample merchant user
  const [merchant] = await db
    .insert(users)
    .values({
      username: "testmerchant",
      password: "password123",
      email: "test@merchant.com",
      merchantName: "Cape Town Coffee Co.",
      merchantId: "m1"
    })
    .returning();

  console.log("✅ Added sample merchant user");

  // Add sample deals
  await db
    .insert(deals)
    .values([
      {
        title: "Morning Brew Coffee",
        description: "Start your day with our artisan coffee. 20% off any drink before 11am.",
        discount: "20",
        category: "Café & Restaurant",
        merchantId: "m1",
        merchantName: "Cape Town Coffee Co.",
        expirationDate: "2023-05-25",
        featured: true,
        views: 0,
        imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
      },
      {
        title: "Cape Town Seafood Grill",
        description: "Fresh seafood with an ocean view. 10% off your total bill on weekdays.",
        discount: "10",
        category: "Restaurant",
        merchantId: "m1",
        merchantName: "Cape Town Coffee Co.",
        expirationDate: "2023-06-30",
        featured: true,
        views: 0,
        imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd"
      },
      {
        title: "Durban Wellness Spa",
        description: "First-time customers receive 30% off any massage treatment.",
        discount: "30",
        category: "Wellness & Spa",
        merchantId: "m1",
        merchantName: "Cape Town Coffee Co.",
        expirationDate: "2023-05-25",
        featured: true,
        views: 0,
        imageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db"
      }
    ]);

  console.log("✅ Added sample deals");

  // Add sample events
  await db
    .insert(events)
    .values([
      {
        title: "Jazz Night at Long Street Lounge",
        description: "Live jazz music featuring the Cape Town Jazz Quartet. Food and drinks available.",
        category: "Music & Nightlife",
        date: "May 15, 2023",
        time: "8:00 PM",
        location: "Long Street Lounge, Cape Town",
        price: "FREE ENTRY",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819"
      },
      {
        title: "Neighbourgoods Market",
        description: "Local produce, crafts, and food vendors. Family-friendly with activities for kids.",
        category: "Food & Community",
        date: "May 14, 2023",
        time: "9:00 AM",
        location: "Woodstock, Cape Town",
        price: "FREE ENTRY",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1577368499727-28d788ae5fc5"
      },
      {
        title: "African Pottery Workshop",
        description: "Learn traditional South African pottery techniques from master potter Thandi Mkhize. All materials provided.",
        category: "Arts & Culture",
        date: "May 18, 2023",
        time: "6:30 PM",
        location: "Johannesburg Art Studio",
        price: "R450 PER PERSON",
        featured: true,
        imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622"
      }
    ]);

  console.log("✅ Added sample events");
  console.log("✅ Database seeding completed!");
}

seed()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    process.exit(0);
  });