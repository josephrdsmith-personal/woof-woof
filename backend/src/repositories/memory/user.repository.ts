import { v4 as uuidv4 } from 'uuid';
import { Repository } from '../interfaces/repository';
import { User, UserCredentials } from '../../types/user';
import { hash, compare } from 'bcrypt';

export class UserRepository implements Repository<User> {
  private users: Map<string, User> = new Map();

  async create(data: UserCredentials): Promise<User> {
    const id = uuidv4();
    const hashedPassword = await hash(data.password, 10);
    
    const user: User = {
      id,
      username: data.username,
      email: data.email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.users.set(id, user);
    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async update(id: string, data: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updatedUser = {
      ...user,
      ...data,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async findByCredentials(username: string, password: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find(u => u.username === username);
    if (!user) return null;

    const isValid = await compare(password, user.password);
    return isValid ? user : null;
  }
}