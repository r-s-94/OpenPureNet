import { createContext } from "react";
import type { Tables } from "./database.types";

interface PublicUserContext {
  publicUserObject: Tables<"public_user">;
  setPublicUserObject: (value: Tables<"public_user">) => void;
}

export const publicUserContext = createContext<PublicUserContext>({
  publicUserObject: {
    id: 0,
    user_id: "",
    profil_name: "",
    profil_picture: "",
    status_text: "",
    agb_consent: false,
    data_protection_consent: false,
    user_consent: false,
  },
  setPublicUserObject: () => {},
});
