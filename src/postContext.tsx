import { createContext } from "react";

export interface PublicUserObject {
  Profilname: string;
  id: number;
  profilPicture: string;
  userId: string;
}

export interface PostObject {
  id: number;
  medium: string;
  public_user: PublicUserObject;
  text: string;
  timestamp: string;
  userId: string;
}

interface PostArrayContext {
  postsArray: PostObject[];
  setPostsArray: React.Dispatch<React.SetStateAction<PostObject[]>>;
}

export const postsContext = createContext<PostArrayContext>({
  postsArray: [],
  setPostsArray: () => {},
});
