import Image from 'next/image';
import TodoList from '@/app/_components/TodoList';
import { Users } from '@/app/_components/Users';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <TodoList />
      <Users />
    </main>
  );
}
