// formSchema.ts
import { z } from "zod";

export const formSchema = z.object({
  channelName: z.string().min(2, { message: "Channel Name must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
});