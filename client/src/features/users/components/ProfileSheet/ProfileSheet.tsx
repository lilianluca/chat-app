import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useMe, useUpdateProfileMutation } from '@/features/users/hooks';
import { Controller, useForm } from 'react-hook-form';
import { updateProfileSchema, type UpdateProfileFormData } from '@/features/users/schemas';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { CalendarDays, Clock, Mail, Save } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface ProfileSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateString));
}

export const ProfileSheet = ({ isOpen, onOpenChange }: ProfileSheetProps) => {
  const { data: user } = useMe();
  const updateProfileMutation = useUpdateProfileMutation();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    values: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      avatar: undefined,
      bio: user?.bio || '',
      statusEmoji: user?.statusEmoji || '',
    },
  });

  function handleSubmit(payload: UpdateProfileFormData) {
    const updatePromise = updateProfileMutation.mutateAsync(payload, {
      onSuccess: () => {
        onOpenChange(false);
      },
    });

    toast.promise(updatePromise, {
      loading: 'Updating profile...',
      success: 'Profile updated successfully!',
      error: (err) => `Failed to update profile: ${err.message}`,
    });
  }

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      form.reset();
    }
    onOpenChange(isOpen);
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>Update your profile information here.</SheetDescription>
        </SheetHeader>

        {user && (
          <div className='m-4 rounded-lg bg-muted/50 p-4 space-y-3 border border-border/50'>
            <h4 className='text-sm font-medium tracking-tight'>Account Detail</h4>

            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Mail className='h-4 w-4 opacity-70' />
                <span className='truncate'>{user.email}</span>
              </div>

              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <CalendarDays className='h-4 w-4 opacity-70' />
                <span>Joined {formatDate(user.joinedAt)}</span>
              </div>

              <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                <Clock className='h-4 w-4 opacity-70' />
                <span>Last updated {formatDate(user.updatedAt)}</span>
              </div>
            </div>
          </div>
        )}

        <form
          id='update-profile-form'
          onSubmit={form.handleSubmit(handleSubmit, (errors) =>
            console.error('Validation errors:', errors),
          )}
          className='px-4'
        >
          <FieldGroup>
            <Controller
              name='firstName'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder='First Name'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='lastName'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder='Last Name'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='avatar'
              control={form.control}
              render={({ field: { value: _value, onChange, ...restField }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={restField.name}>Avatar</FieldLabel>
                  <Input
                    {...restField}
                    id={restField.name}
                    type='file'
                    accept='image/jpeg, image/png, image/webp'
                    aria-invalid={fieldState.invalid}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      onChange(file);
                    }}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name='bio'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Bio</FieldLabel>
                    <FieldDescription>Tell us a little about yourself</FieldDescription>
                    <Textarea
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      placeholder='Bio'
                      rows={4}
                    />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name='statusEmoji'
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Status Emoji</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder='Status Emoji'
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Field orientation='horizontal' className='justify-end'>
              <Button type='button' variant='outline' onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              <Button type='submit' disabled={updateProfileMutation.isPending}>
                <Save />
                <span>Save changes</span>
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  );
};
