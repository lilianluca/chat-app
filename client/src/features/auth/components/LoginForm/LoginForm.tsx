import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginFormData } from '@/features/auth/schemas';
import { useLoginMutation } from '@/features/auth/hooks';
import { Input } from '@/components/Input';
import { Button } from '@/components';

export const LoginForm = () => {
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: LoginFormData) {
    loginMutation.mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <Input label='Email' type='email' {...register('email')} error={errors.email?.message} />
      <Input
        label='Password'
        type='password'
        {...register('password')}
        error={errors.password?.message}
      />

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
