import { Message } from "@/model/User";

export interface ApiResponce {
  success: boolean;
  message: string | any;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
