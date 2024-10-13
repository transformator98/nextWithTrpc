'use client';

import { useEffect, useState } from 'react';

import { trpc } from '../_trpc/client';

interface Todo {
  id: number;
  content: string | null;
  done: boolean | null;
  isEditing: boolean;
}

export default function TodoList() {
  const [content, setContent] = useState('');
  const { data: todos, isLoading, refetch } = trpc.todo.getTodos.useQuery();

  const [newTodos, setTodos] = useState<Todo[]>([]);
  const [editText, setEditText] = useState('');
  const utils = trpc.useUtils();

  useEffect(() => {
    if (todos) {
      setTodos(todos?.map((el) => ({ ...el, isEditing: false })));
    }
  }, [todos]);
  const addTodo = trpc.todo.addTodo.useMutation({
    onSettled: () => refetch(),
  });
  const updateTodo = trpc.todo.updateTodo.useMutation({
    async onMutate({ id, completed }) {
      await utils.todo.getTodos.cancel();
      const addTodo = utils.todo.getTodos.getData();
      if (!addTodo) {
        return;
      }
      utils.todo.getTodos.setData(
        undefined,
        addTodo.map((t) =>
          t.id === Number(id)
            ? {
                ...t,
                completed,
              }
            : t
        )
      );
    },
    onSettled: () => refetch(),
  });

  const deleteTodo = trpc.todo.deleteTodo.useMutation({
    onSettled: () => refetch(),
  });
  const editTodo = trpc.todo.editTodo.useMutation({
    onSettled: () => refetch(),
  });
  const handleEdit = (id: number, content: string) => {
    setTodos(
      newTodos?.map((todo) =>
        todo.id === id ? { ...todo, isEditing: true } : todo
      )
    );
    setEditText(content || '');
  };
  const handleSave = (id: number) => {
    setTodos(
      newTodos?.map((todo) =>
        todo.id === id ? { ...todo, isEditing: false } : todo
      )
    );
    if (editText.length) {
      editTodo.mutate({ id, content: editText });
      setEditText('');
    }
  };

  if (!newTodos || isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl">Todos</h1>
      <div>
        {newTodos?.map((todo) => (
          <div key={todo.id} className="flex gap-3 items-center">
            <label
              className="checked:line-through"
              htmlFor={`check-${todo.id}`}
            >
              <input
                id={`check-${todo.id}`}
                type="checkbox"
                checked={!!todo.done}
                // style={{ zoom: 1.5 }}
                onChange={(e) => {
                  const checked = e.currentTarget.checked;
                  updateTodo.mutate({
                    id: todo.id,
                    completed: checked,
                  });
                }}
              />
              {todo.isEditing ? (
                <input
                  type="text"
                  value={editText}
                  className="text-black border-2 h-[40px]"
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span>{todo.content}</span>
              )}
            </label>
            {!todo.isEditing ? (
              <button
                className="bg-gray-400 text-white p-2 rounded-lg"
                onClick={() => handleEdit(todo.id, todo.content)}
              >
                Edit
              </button>
            ) : (
              <button
                className="bg-gray-400 text-white p-2 rounded-lg"
                onClick={() => handleSave(todo.id)}
              >
                Save
              </button>
            )}

            <button
              className="bg-red-500 text-white p-2 rounded-lg"
              onClick={() => deleteTodo.mutate(todo.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div>
        <div className="text-2xl mb-2 mt-4">Add a todo</div>
        <div className="flex gap-3 items-center">
          <label htmlFor="content">Content: </label>
          <input
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="text-black border-2 h-[40px]"
          />
          <button
            onClick={async () => {
              if (content.length) {
                addTodo.mutate(content);
                setContent('');
              }
            }}
            className="bg-blue-500 text-white p-2 rounded-lg"
          >
            Add todo
          </button>
        </div>
      </div>
    </div>
  );
}
