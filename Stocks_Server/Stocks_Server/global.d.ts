declare global {
  namespace Express {
    interface AuthorizedUser {
      id: number;
      name: string;
      email: string;
      role: string;
    }
  }

  namespace Express {
    interface Request {
      user?: AuthorizedUser;
    }
  }
}

export {};
