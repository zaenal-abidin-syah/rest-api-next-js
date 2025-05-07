This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/route.ts`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## API Routes

This directory contains example API routes for the headless API app.

For more details, see [route.js file convention](https://nextjs.org/docs/app/api-reference/file-conventions/route).

// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?
// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init

generator client {
provider = "prisma-client-js"
output = "generated/prisma"
}

datasource db {
provider = "mysql"
url = env("DATABASE_URL")
relationMode = "prisma"
}

enum Status {
borrowed
returned
overdue
}

model User {
id Int @id @default(autoincrement()) @db.UnsignedInt
username String @unique @db.VarChar(50)
password String @db.VarChar(255)
fullname String @db.VarChar(100)
email String @unique @db.VarChar(100)
created_at DateTime @default(now()) @db.Timestamp(6)

loans Loan[]  
 rateLimits RateLimit?

Token Token?
@@map("users")
}

model Book {
id Int @id @default(autoincrement()) @db.UnsignedInt
title String @db.VarChar(255)
author String @db.VarChar(150)
publisher String? @db.VarChar(150)
isbn String? @unique @db.VarChar(20)
published_year Int? @db.Year
stock Int @default(0) @db.UnsignedInt
created_at DateTime @default(now()) @db.Timestamp(6)
updated_at DateTime @updatedAt @db.Timestamp(6)

loans Loan[]
@@map("books")
}

model Loan {
id Int @id @default(autoincrement()) @db.UnsignedInt
user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
user_id Int @db.UnsignedInt
book Book @relation(fields: [book_id], references: [id], onDelete: Cascade)
book_id Int @db.UnsignedInt
loan_date DateTime @default(dbgenerated("CURRENT_DATE")) @db.Date
due_date DateTime @db.Date
return_date DateTime? @db.Date
status Status @default(borrowed)
created_at DateTime @default(now()) @db.Timestamp(6)

@@index([user_id])
@@index([book_id])
@@map("loans")
}

model RateLimit {
id Int @id @default(autoincrement()) @db.UnsignedInt
user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
user_id Int @db.UnsignedInt @unique
endpoint String @db.VarChar(255)
windowStart DateTime @db.DateTime(0)
requestCount Int @default(1) @db.UnsignedInt

@@unique([user_id, windowStart, endpoint], name: "user_window_endpoint")
@@map("rate_limits")
}
model Token {
id Int @id @default(autoincrement()) @db.UnsignedInt
user User @relation(fields: [user_id], references: [id], onDelete: Cascade)
user_id Int @db.UnsignedInt @unique
token String @unique @db.VarChar(255)
createdAt DateTime @default(now()) @db.Timestamp(6)

@@index([user_id])
@@map("tokens")
}
