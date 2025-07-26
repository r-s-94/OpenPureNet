import { createContext } from "react";

export interface MessageObject {
  public_user: FollowerInfoObject;
}

export interface FollowerInfoObject {
  id: number;
  userId: string;
  Profilname: string;
  profilPicture: string;
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
