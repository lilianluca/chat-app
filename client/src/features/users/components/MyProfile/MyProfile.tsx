import { useMe } from '@/features/users/hooks';

export const MyProfile = () => {
  const { data: me, isLoading, isError } = useMe();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error occurred while fetching user data.</div>;
  }

  return <div>{me?.email}</div>;
};
