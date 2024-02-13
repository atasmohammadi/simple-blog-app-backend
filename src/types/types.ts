// Defines a user in the system
export interface User {
  id: number;
  username: string;
  email: string;
  password: string; // Consider using more secure storage or methods in real applications
}

// Defines a blog post
export interface Post {
  id: number;
  author: string;
  title: string;
  text: string;
  date: string; // ISO date string format
  likes: number;
  dislikes: number;
}

// Defines a comment on a blog post
export interface Comment {
  id: number;
  postId: number;
  text: string;
  date: string; // ISO date string format
  likes: number;
  dislikes: number;
}

// For extending Express Request to include user information from JWT
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}
