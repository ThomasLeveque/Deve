export interface IUser {
  id: string;
  displayName: string | null;
  email?: string | null;
  createdAt?: Date | number;
  updatedAt?: Date | number;
}
