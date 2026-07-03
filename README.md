# MR!JK! Portfolio Website & CMS

A production-grade cinematic personal portfolio for **Jaikiran E ("MR!JK!")** built with Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Lenis, and Prisma SQLite database. 

It features a dual-identity interactive hero cursor reveal (Analyst mode vs Exploit mode) and a hidden admin content management system.

---

## 1. Setup Instructions

### Prerequisites
- Node.js (v18.x or higher)
- npm or pnpm

### Installation
1. Clone or extract the project files.
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the database & run migrations + seeds:
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. Run the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 2. Environment Variables

Create a `.env` file in the root directory (defaults are automatically provided in `.env` for local dev):

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="use-a-secure-random-string-for-session-signing"
```

---

## 3. Hidden Admin CMS & Authentication

### Entry Point
- Navigate to the footer of the portfolio homepage.
- Find the **decorative dot** in the bottom-right corner (next to the copyright string).
- It is visually faint (`opacity: 15%`), has no pointer-cursor change on hover, but is fully accessible to keyboard navigation (focusable via Tab key with `aria-label="Site administration"`).
- Click/tap or press Enter to route to `/admin`.

### First-Time Setup
1. On your first visit to `/admin`, the database checks if any administrator account exists.
2. If none is found, you will be redirected to the **Initialize Admin Account** screen to configure a master password (minimum 8 characters).
3. The password is hashed using `bcrypt` (12 rounds) and saved to the SQLite database.

### Lockouts & Cooldowns
- The login endpoint features a double-layered brute-force rate limiter:
  - **In-Memory IP Limiter**: Locks out IP addresses after 5 unsuccessful attempts for 15 minutes.
  - **Database Locks**: If a password match fails, the `Admin` row is incremented. At 5 failures, `lockedUntil` timestamp is written, locking out any credentials checks.
