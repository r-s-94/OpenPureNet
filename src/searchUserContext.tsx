import { createContext } from "react";

export interface SearchUserObject {
  id: number;
  userId: string;
  profilName: string;
  profilPicture: string;
  agbConsent: boolean;
  dataProtectionConsent: boolean;
  userConsent: boolean;
  statusText: string;
  searchStatus: boolean;
  fromMessage: boolean;
}

interface SearchUserContext {
  searchUserObject: SearchUserObject;
  setSearchUserObject: (value: SearchUserObject) => void;
}

export const serachUserContext = createContext<SearchUserContext>({
  searchUserObject: {
    id: 0,
    userId: "",
    profilName: "",
    profilPicture: "",
    agbConsent: false,
    dataProtectionConsent: false,
    userConsent: false,
    statusText: "",
    searchStatus: false,
    fromMessage: false,
  },
  setSearchUserObject: () => {},
});
