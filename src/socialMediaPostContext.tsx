import { createContext } from "react";

export interface SocialMediaPostArray {
  Date: string | null;
  id: number;
  Post: string | null;
  UserId: string;
  UserProfilname: string | null;
}

interface SocialMediaPostContext {
  socialMediaPostArray: SocialMediaPostArray[];
  setSocialMediaPostArray: React.Dispatch<
    React.SetStateAction<
      {
        Date: string | null;
        id: number;
        Post: string | null;
        UserId: string;
        UserProfilname: string | null;
      }[]
    >
  >;
}

export const socialMediaPostContext = createContext<SocialMediaPostContext>({
  socialMediaPostArray: [],
  setSocialMediaPostArray: () => {},
});
