import { createContext } from "react";

export interface PublicUserObject {
  id: number;
  user_id: string;
  profil_name: string;
  profil_picture: string;
}

export interface PostObject {
  id: number;
  medium: string;
  public_user: PublicUserObject;
  text: string;
  time_stamp: string;
  user_id: string;
}

interface PostArrayContext {
  postsArray: PostObject[];
  setPostsArray: React.Dispatch<React.SetStateAction<PostObject[]>>;
}

export const postsContext = createContext<PostArrayContext>({
  postsArray: [],
  setPostsArray: () => {},
});
