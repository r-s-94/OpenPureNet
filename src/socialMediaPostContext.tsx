import { createContext } from "react";

export interface SocialMediaPostArray {
  id: number;
  Post: string | null;
  UserId: string;
  UserName: string | null;
  UserProfilName: string | null;
}

interface SocialMediaPostContext {
  socialMediaPostArray: SocialMediaPostArray[];
  setSocialMediaPostArray: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        Post: string | null;
        UserId: string;
        UserName: string | null;
        UserProfilName: string | null;
      }[]
    >
  >;
}

export const socialMediaPostContext = createContext<SocialMediaPostContext>({
  socialMediaPostArray: [],
  setSocialMediaPostArray: () => {},
});
