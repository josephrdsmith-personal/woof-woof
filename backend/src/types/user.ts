import { Entity } from './entity';

export interface UserCredentials {
  username: string;
  password: string;
  email: string;
}

export interface User extends UserCredentials {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}