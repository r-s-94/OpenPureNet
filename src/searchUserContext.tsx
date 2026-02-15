import { createContext } from "react";

export interface SearchUserObject {
  id: number;
  user_id: string;
  profil_name: string;
  profil_picture: string;
  agb_consent: boolean;
  data_protection_consent: boolean;
  user_consent: boolean;
  status_text: string;
  search_status: boolean;
  from_message: boolean;
}

interface SearchUserContext {
  globalSearchUserObject: SearchUserObject;
  setGlobalSearchUserObject: (value: SearchUserObject) => void;
}

export const searchUserContext = createContext<SearchUserContext>({
  globalSearchUserObject: {
    id: 0,
    user_id: "",
    profil_name: "",
    profil_picture: "",
    agb_consent: false,
    data_protection_consent: false,
    user_consent: false,
    status_text: "",
    search_status: false,
    from_message: false,
  },
  setGlobalSearchUserObject: () => {},
});
