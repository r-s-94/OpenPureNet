import { createContext } from "react";

interface FunctionContext {
  consentPopUp: boolean;
  setConsentPopUp: (value: boolean) => void;
  checkUserSession: () => void;
  loadFirstUserData: () => void;
  logOut: () => void;
}

export const functionContext = createContext<FunctionContext>({
  consentPopUp: false,
  setConsentPopUp: () => {},
  checkUserSession: () => {},
  loadFirstUserData: () => {},
  logOut: () => {},
});
