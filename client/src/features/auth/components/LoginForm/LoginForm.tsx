import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginPayload } from '@/features/auth/schemas';
import { useLoginMutation } from '@/features/auth/hooks';
import { Button, Input } from '@/components';
import { handleFormErrors } from '@/utils';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export const LoginForm = () => {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginPayload) {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate('/');
        toast.success('Login successful! Redirecting...');
      },
      onError: (error) => {
        handleFormErrors<LoginPayload>(error, setError);
      },
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input
        label='Email'
        type='email'
        {...register('email')}
        autoComplete='email'
        error={errors.email?.message}
      />
      <Input
        label='Password'
        type='password'
        {...register('password')}
        autoComplete='current-password'
        error={errors.password?.message}
      />

      {errors.root && <div className='text-red-500 text-sm'>{errors.root.message}</div>}

      <Button
        type='submit'
        variant='primary'
        isLoading={loginMutation.isPending}
        className='w-full'
      >
        {loginMutation.isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
