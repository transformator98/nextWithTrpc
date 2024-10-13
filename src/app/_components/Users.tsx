'use client';
import { useState } from 'react';
import { trpc } from '../_trpc/client';

export const Users = () => {
  const [userId, setUserId] = useState('0');
  const [userName, setUserName] = useState('Some Body');
  const {
    data: usersData,
    isLoading: isUsersLoading,
    refetch,
  } = trpc.users.getUsers.useQuery();
  const {
    data: userData,
    isLoading: isUserLoading,
    error,
  } = trpc.users.getUserById.useQuery(userId, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  const createUserMutation = trpc.users.createUser.useMutation({
    onSuccess: () => refetch(),
  });

  if (isUsersLoading || !usersData) return <div>Loading...</div>;

  // Мутация для создания пользователя

  const getUserById: React.FormEventHandler = (e) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements[0] as HTMLInputElement;
    const userId = input.value.replace(/\s+/g, '');
    if (userId) {
      // обновление состояния ID пользователя приводит к выполнению нового/повторного запроса
      setUserId(userId);
    }
  };
  const createUser: React.FormEventHandler = (e) => {
    e.preventDefault();
    const name = userName.trim();
    if (name) {
      createUserMutation.mutate({ name });
      setUserName('');
    }
  };

  return (
    <div>
      <div>
        <ul>
          {(usersData ?? []).map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      </div>
      <div className="text-cyan-600">
        <form onSubmit={getUserById}>
          <label>
            Get user by ID <input type="text" defaultValue={userId} />
          </label>
          <button>Get</button>
        </form>
        {/* Если пользователь найден */}
        {userData && <div>{userData.name}</div>}
        {/* Если пользователь не найден */}
        {error && <div>{error.message}</div>}
      </div>
      <div className="text-cyan-600">
        <form onSubmit={createUser}>
          <label>
            Create new user{' '}
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </label>
          <button>Create</button>
        </form>
      </div>
    </div>
  );
};
