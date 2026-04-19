import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be at most 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be at most 50 characters'),
  avatar: z.instanceof(File, { error: 'Avatar must be a valid image file' }).optional(),
  bio: z.string(),
  statusEmoji: z
    .emoji('Status emoji must be a valid emoji character')
    .refine(
      (val) => {
        // Splits string into visual "graphemes" (single symbols)
        const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });
        const segments = Array.from(segmenter.segment(val));
        return segments.length === 1;
      },
      {
        message: 'Must be exactly one emoji',
      },
    )
    .or(z.literal('')), // Allow empty string for no emoji
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
