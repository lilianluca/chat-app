import z from 'zod';

export const messageSchema = z.object({
  text: z.string().trim().min(1).max(1000),
});

export type MessagePayload = z.infer<typeof messageSchema>;
