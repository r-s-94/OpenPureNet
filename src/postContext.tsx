import { createContext } from "react";

export interface PublicUserObject {
  id: number;
  userId: string;
  profilName: string;
  profilPicture: string;
}

export interface PostObject {
  id: number;
  medium: string;
  public_user: PublicUserObject;
  text: string;
  timeStamp: string;
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
