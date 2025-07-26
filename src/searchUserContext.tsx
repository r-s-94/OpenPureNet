import { createContext } from "react";

export interface SearchUserObject {
  id: number;
  userId: string;
  Profilname: string;
  profilPicture: string;
  AGBConsent: boolean;
  dataProtectionConsent: boolean;
  userDataConsent: boolean;
  Statustext: string;
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
    Profilname: "",
    profilPicture: "",
    AGBConsent: false,
    dataProtectionConsent: false,
    userDataConsent: false,
    Statustext: "",
    searchStatus: false,
    fromMessage: false,
  },
  setSearchUserObject: () => {},
});
