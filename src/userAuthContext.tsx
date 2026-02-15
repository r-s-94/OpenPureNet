import type { AuthSession, Session } from "@supabase/supabase-js";
import { createContext } from "react";

/*export interface CurrentSessionDatatype {
  access_token: string;
  expires_at: number;
  refresh_token: string;
  user: UserDatatype;
  weak_password: null;
}

interface UserDatatype {
  app_metadata: AppMetadataDatatype;
  aud: string;
  confirmed_at: string;
  created_at: string;
  email: string;
  email_confirmed_at: string;
  id: string;
  identities: [];
  is_anonymous: boolean;
  last_sign_in_at: string;
  phone: string;
  role: string;
  updated_at: string;
  user_metadata: UserMetadataDatatype;
}

interface AppMetadataDatatype {
  provider: string;
  providers: string[];
}

interface UserMetadataDatatype {
  email_verified: boolean;
}*/

export interface UserAuthObject {
  accessToken: string | null;
  //isAuthenticated: boolean;
}

export interface UserAuthSessionContext {
  userAuthObject: Session | null;
  setUserAuthObject: (value: AuthSession | null) => void;
}

export const userAuthContext = createContext<UserAuthSessionContext>({
  userAuthObject: {
    access_token: "",
    expires_at: 0,
    expires_in: 0,
    refresh_token: "",
    token_type: "",
    user: {
      app_metadata: {
        provider: "",
        providers: [""],
      },
      aud: "",
      confirmed_at: "",
      created_at: "",
      email: "",
      email_confirmed_at: "",
      id: "",
      identities: [],
      is_anonymous: false,
      last_sign_in_at: "",
      phone: "",
      role: "",
      updated_at: "",
      user_metadata: {
        email_verified: false,
      },
    },
  },
  setUserAuthObject: () => {},
});
