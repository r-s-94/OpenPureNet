import { createContext } from "react";

export interface NavContentDatatype {
  currentActiveNavArea: string;
  setCurrentActiveNavArea: (currentActiveNavArea: string) => void;
}

/*export interface NavObjectDatatype {

  searchUserName: string;
  searchProfilPicture: string;
  searchUserStatus: boolean;
}*/

export const navContext = createContext<NavContentDatatype>({
  currentActiveNavArea: "",
  setCurrentActiveNavArea: () => {},
});
