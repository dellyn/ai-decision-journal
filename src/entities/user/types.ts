export type User = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserCredentials = {
  email: string;
  password: string;
};

export type UserSession = {
  user: User;
  expires: Date;
}; 