export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // Sensitive information, should not be exposed in frontend
  role: string;
  imageUrl: string;
  api_token: string;
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
  statusDeleted?: number;
}

export class User {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    public password: string,
    public role: string,
    public imageUrl: string,
    public api_token: string,
    public status: boolean,
    public statusDeleted?: number,
    public createdBy?: number,
    public updatedBy?: number,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}
}
