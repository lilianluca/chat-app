import { Button, Input } from '@/components';
import { useForm } from 'react-hook-form';
import { registerSchema, type RegisterPayload } from '@/features/auth/schemas';
import { useRegisterMutation } from '@/features/auth/hooks';
import { useNavigate } from 'react-router';
import { handleFormErrors } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect } from 'react';

export const RegisterForm = () => {
  const navigate = useNavigate();
  const registerMutation = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterPayload>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => console.log('RegisterForm errors:', errors), [errors]);

  const onSubmit = (data: RegisterPayload) => {
    clearErrors('root');

    registerMutation.mutate(data, {
      onSuccess: () => {
        navigate('/login');
        toast.success('Registration successful! Please log in.');
      },
      onError: (error) => {
        handleFormErrors<RegisterPayload>(error, setError);
      },
    });
  };

  function onChange() {
    // Clear root-level errors on any change to give immediate feedback
    if (errors.root) {
      clearErrors('root');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} onChange={onChange} className='space-y-4'>
      <Input
        label='First Name'
        error={errors.firstName?.message}
        autoComplete='given-name'
        {...register('firstName')}
      />
      <Input
        label='Last Name'
        error={errors.lastName?.message}
        autoComplete='family-name'
        {...register('lastName')}
      />
      <Input
        label='Email'
        type='email'
        error={errors.email?.message}
        autoComplete='email'
        {...register('email')}
      />
      <Input
        label='Password'
        type='password'
        error={errors.password?.message}
        autoComplete='new-password'
        {...register('password')}
      />
      <Input
        label='Confirm Password'
        type='password'
        error={errors.confirmPassword?.message}
        autoComplete='new-password'
        {...register('confirmPassword')}
      />

      {errors.root && <div className='text-red-500 text-sm'>{errors.root.message}</div>}

      <Button
        type='submit'
        variant='primary'
        isLoading={registerMutation.isPending}
        className='w-full'
      >
        {registerMutation.isPending ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};
