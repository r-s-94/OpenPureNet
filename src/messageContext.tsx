import { createContext } from "react";
import type { PublicUserObject } from "./postContext";

export interface MessageObject {
  id: number;
  public_user: PublicUserObject;
}

interface MessageContext {
  messageArray: MessageObject[];
  setMessageArray: React.Dispatch<React.SetStateAction<MessageObject[]>>;
  messageCount: number;
  setMessageCount: (value: number) => void;
}

export const messageContext = createContext<MessageContext>({
  messageArray: [],
  setMessageArray: () => {},
  messageCount: 0,
  setMessageCount: () => {},
});
