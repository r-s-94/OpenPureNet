import { createContext } from "react";
import type { Tables } from "./database.types";

interface PublicUserContext {
  publicUserObject: Tables<"public_user">;
  setPublicUserObject: (value: Tables<"public_user">) => void;
}

export const publicUserContext = createContext<PublicUserContext>({
  publicUserObject: {
    id: 0,
    userId: "",
    profilName: "",
    profilPicture: "",
    statusText: "",
    agbConsent: false,
    dataProtectionConsent: false,
    userConsent: false,
  },
  setPublicUserObject: () => {},
});
