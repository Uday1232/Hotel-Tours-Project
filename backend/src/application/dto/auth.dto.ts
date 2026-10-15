export interface RegisterInput {
  email: string
  password: string
  name: string
  phone?: string
}

export interface RegisterOutput {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginOutput {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}