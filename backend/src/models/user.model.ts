// Simple in-memory user model for demo
// In production, replace with Prisma or Mongoose

interface User {
  id: string
  name: string
  email: string
  password: string
  createdAt: Date
}

class UserModel {
  private users: Map<string, User> = new Map()
  private idCounter = 1

  async create(data: {
    name: string
    email: string
    password: string
  }): Promise<User> {
    const user: User = {
      id: (this.idCounter++).toString(),
      name: data.name,
      email: data.email,
      password: data.password,
      createdAt: new Date(),
    }
    this.users.set(user.id, user)
    return user
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((u) => u.email === email)
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.get(id)
  }
}

export const userModel = new UserModel()
