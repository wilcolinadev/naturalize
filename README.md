# 🇺🇸 U.S. Citizenship Practice App

A modern bilingual web application to help users prepare for the U.S. Naturalization Test with interactive quizzes, reading/writing practice, and progress tracking.

## ✨ Features

- **Interactive Quizzes**: Practice with official USCIS civics questions
- **Bilingual Support**: Available in English and Spanish (coming soon)
- **Reading & Writing Practice**: Master all portions of the naturalization test
- **Progress Tracking**: Monitor improvement and identify areas to focus on
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Authentication**: Secure user accounts and progress saving
- **Free & Premium Plans**: Basic practice free, advanced features with premium

## 🧱 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Authentication**: Auth0
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🏗️ Project Structure

```
├── app/
│   ├── api/auth/        # Auth0 API routes
│   ├── protected/       # Dashboard and protected routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   ├── ui/             # Reusable UI components
│   └── ...             # App-specific components
├── lib/
│   ├── auth0.ts        # Auth0 configuration
│   ├── supabase/       # Database client (for user data)
│   └── utils.ts        # Utility functions
└── ...
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- A Supabase account and project (for database)
- Auth0 account (for authentication)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd naturalize
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update the following variables in `.env.local`:
   ```bash
   # Auth0 Configuration (for authentication)
   AUTH0_SECRET=your_32_byte_hex_secret
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_CLIENT_ID=your_auth0_client_id
   AUTH0_CLIENT_SECRET=your_auth0_client_secret
   APP_BASE_URL=http://localhost:3000
   
   # Supabase Configuration (for database)
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📋 Roadmap

### Phase 1: Foundation ✅
- [x] Clean up starter template
- [x] Create landing page design
- [x] Set up basic dashboard layout
- [x] Configure Auth0 authentication
- [x] Set up Supabase database client

### Phase 2: Core Features
- [ ] Quiz engine with USCIS questions
- [ ] User progress tracking (stored in Supabase)
- [ ] Daily usage limits for free users
- [ ] Reading practice section
- [ ] Writing practice section

### Phase 3: Internationalization
- [ ] Spanish language support
- [ ] Language switcher component
- [ ] Bilingual question database

### Phase 4: Premium Features
- [ ] Subscription management
- [ ] Advanced progress analytics
- [ ] Favorite questions
- [ ] Study plans

## 🏗️ Database Schema (Supabase)

The app will use these main tables:

```sql
-- Users table (synced with Auth0)
users (
  id uuid PRIMARY KEY,
  auth0_id text UNIQUE,
  email text,
  name text,
  plan text DEFAULT 'free',
  created_at timestamp
);

-- User progress tracking
user_progress (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  question_id text,
  correct boolean,
  attempts integer,
  last_attempted timestamp
);

-- Daily usage tracking
daily_usage (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  date date,
  questions_attempted integer
);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- USCIS for providing official naturalization test materials
- Auth0 for secure authentication
- Supabase for the database infrastructure
- Next.js team for excellent developer tools
- The immigrant community for inspiration

---

**Built to help you achieve your American dream** 🇺🇸
