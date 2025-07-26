import { createContext } from "react";
import type { Tables } from "./database.types";

interface PublicUserContext {
  publicUserObject: Tables<"public-user">;
  setPublicUserObject: (value: Tables<"public-user">) => void;
}

export const publicUserContext = createContext<PublicUserContext>({
  publicUserObject: {
    id: 0,
    userId: "",
    Profilname: "",
    profilPicture: "",
    Statustext: "",
    AGBConsent: false,
    dataProtectionConsent: false,
    userDataConsent: false,
  },
  setPublicUserObject: () => {},
});
