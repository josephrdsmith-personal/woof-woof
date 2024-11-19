export interface User {
  id: string
  email: string
  token: string
  createdAt: Date
  updatedAt: Date
}

export interface UserDTO {
  id: string
  email: string
  token: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  user: UserDTO
} 