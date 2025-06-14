# AI Decision Journal


## 🚀 Quick Start

```bash
# Install dependencies
pnpm install
pnpm run dev
or 
vercel --prod

cp .env.example .env.local

```

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, React Query, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **AI**: OpenAI GPT
- **Auth**: Supabase Auth

```
app // app and api routes
src/
├── app/                    # Pages and layouts
├── entities/              # Business entities
├── features/             # All features
├── shared/              # Shared resources
└── widgets/            # Combination of features
```

## 🌟 Core Features

- **Authentication**: Secure email/password auth
- **Decision Management**: Create and track decisions
- **AI Analysis**: Automatic decision analysis with OpenAI
- **Dashboard**: View and analyze decision history
- **Real-time Updates**: Status tracking and notifications

MIT License
