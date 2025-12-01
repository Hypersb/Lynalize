# Database Setup Guide

## PostgreSQL Setup

### Using Prisma

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create `.env` file:
```env
DATABASE_URL=postgresql://lynalyze:lynalyze_password@localhost:5432/lynalyze
```

3. Run migrations:
```bash
npx prisma migrate dev
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. (Optional) Open Prisma Studio:
```bash
npx prisma studio
```

### Using Docker

```bash
# Start PostgreSQL container
docker run -d \
  --name lynalyze-postgres \
  -e POSTGRES_USER=lynalyze \
  -e POSTGRES_PASSWORD=lynalyze_password \
  -e POSTGRES_DB=lynalyze \
  -p 5432:5432 \
  postgres:15-alpine
```

## MongoDB Setup

### Local Installation

1. Install MongoDB:
```bash
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

2. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/lynalyze
```

3. The schemas will be created automatically on first use.

### Using Docker

```bash
# Start MongoDB container
docker run -d \
  --name lynalyze-mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=lynalyze \
  -e MONGO_INITDB_ROOT_PASSWORD=lynalyze_password \
  -e MONGO_INITDB_DATABASE=lynalyze \
  -p 27017:27017 \
  mongo:6
```

## Schema Documentation

### User Model

```typescript
{
  id: string          // UUID
  name: string        // User's full name
  email: string       // Unique email address
  password: string    // Hashed password
  createdAt: Date     // Account creation date
  updatedAt: Date     // Last update date
}
```

### Analysis Model

```typescript
{
  id: string                    // UUID
  url: string                   // Analyzed URL
  title: string                 // Page title
  description: string           // Meta description
  images: string[]              // Image URLs
  metadata: {
    favicon?: string
    author?: string
    keywords?: string[]
  }
  textAnalysis?: {
    wordCount: number
    wordFrequency: Record<string, number>
    sentiment: {
      score: number             // -1 to 1
      label: string             // Positive/Negative/Neutral
      positive: number
      negative: number
      neutral: number
    }
  }
  mediaAnalysis?: {
    dominantColors?: string[]   // Hex color codes
    audioFeatures?: {
      tempo?: number            // BPM
      energy?: number           // 0-1
      danceability?: number     // 0-1
      valence?: number          // 0-1
    }
  }
  trends?: {
    interest: number[]          // Interest over time
    timestamps: string[]        // Corresponding dates
  }
  userId: string                // Foreign key to User
  createdAt: Date
  updatedAt: Date
}
```

## Switching Between Databases

The application supports both PostgreSQL and MongoDB. Choose based on your preference:

### PostgreSQL (Recommended for production)
- Structured data with strong relationships
- Full ACID compliance
- Better for complex queries
- Use Prisma ORM

### MongoDB (Recommended for flexibility)
- Flexible schema
- Better for rapidly changing data structures
- Easier horizontal scaling
- Use Mongoose ODM

## Migrations

### Prisma (PostgreSQL)

Create a new migration:
```bash
npx prisma migrate dev --name migration_name
```

Apply migrations:
```bash
npx prisma migrate deploy
```

### Mongoose (MongoDB)

MongoDB doesn't require explicit migrations. Schema changes are applied automatically.

## Backup and Restore

### PostgreSQL

Backup:
```bash
pg_dump lynalyze > backup.sql
```

Restore:
```bash
psql lynalyze < backup.sql
```

### MongoDB

Backup:
```bash
mongodump --db lynalyze --out backup/
```

Restore:
```bash
mongorestore --db lynalyze backup/lynalyze/
```
