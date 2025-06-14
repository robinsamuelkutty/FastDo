import React, { useEffect, useState } from 'react';
import { FiEdit2, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

const App = () => {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${API_BASE}/`);
        setTodos(response.data);
      } catch (error) {
        console.error("Failed to fetch todos", error);
      }
    };
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!title.trim() || !description.trim()) return;

    const timestamp = Math.floor(Date.now() / 1000);

    if (editIndex !== null) {
      const todoToUpdate = todos[editIndex];
      const updatedTask = {
        ...todoToUpdate,
        title,
        description,
        updated_at: timestamp,
      };

      try {
        await axios.put(`${API_BASE}/${todoToUpdate.id}`, updatedTask);
        const updatedTodos = [...todos];
        updatedTodos[editIndex] = updatedTask;
        setTodos(updatedTodos);
        setEditIndex(null);
      } catch (error) {
        console.error("Failed to update task", error);
      }
    } else {
      const newTodo = {
        title,
        description,
        is_completed: false,
        is_deleted: false,
        created_at: timestamp,
        updated_at: timestamp,
      };

      try {
        const res = await axios.post(`${API_BASE}/`, newTodo);
        setTodos([...todos, { ...newTodo, id: res.data.id }]);
      } catch (error) {
        console.error("Failed to create task", error);
      }
    }

    setTitle('');
    setDescription('');
  };

  const handleDelete = async (index) => {
    const { id } = todos[index];
    try {
      await axios.delete(`${API_BASE}/${id}`);
      setTodos(todos.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const handleEdit = (index) => {
    setTitle(todos[index].title);
    setDescription(todos[index].description);
    setEditIndex(index);
  };

  const toggleComplete = async (index) => {
    const updated = [...todos];
    updated[index].is_completed = !updated[index].is_completed;
    updated[index].updated_at = Math.floor(Date.now() / 1000);

    try {
      await axios.put(`${API_BASE}/${updated[index].id}`, updated[index]);
      setTodos(updated);
    } catch (error) {
      console.error("Failed to toggle completion", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Todo App
        </h1>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            className="flex-grow px-5 py-3 border-2 border-gray-300 rounded-2xl shadow-inner transition focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-400"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="flex-grow px-5 py-3 border-2 border-gray-300 rounded-2xl shadow-inner transition focus:outline-none focus:ring-4 focus:ring-pink-400 focus:border-pink-400"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTodo()}
          />
          <button
            onClick={handleAddTodo}
            className="bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white px-6 rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
          >
            {editIndex !== null ? 'Update' : 'Add'}
          </button>
        </div>

        <ul className="space-y-4 max-h-96 overflow-y-auto">
          {todos.map((todo, index) => (
            <li
              key={index}
              className="flex justify-between items-start bg-purple-50 rounded-2xl shadow-sm px-5 py-3 hover:shadow-md transition"
            >
              <button
                onClick={() => toggleComplete(index)}
                className={`flex items-start gap-3 flex-grow cursor-pointer select-none focus:outline-none text-left ${
                  todo.is_completed
                    ? 'text-gray-400 line-through'
                    : 'text-gray-800 hover:text-purple-600'
                }`}
                aria-label={`Mark task "${todo.title}" as ${
                  todo.is_completed ? 'incomplete' : 'complete'
                }`}
              >
                {todo.is_completed ? (
                  <FiCheckCircle className="text-purple-500 mt-1" size={20} />
                ) : (
                  <div className="w-5 h-5 mt-1 border-2 border-gray-400 rounded-full" />
                )}
                <div>
                  <p className="text-lg font-semibold">{todo.title}</p>
                  <p className="text-sm text-gray-500">{todo.description}</p>
                </div>
              </button>

              <div className="flex gap-3 ml-4 mt-1">
                <button
                  onClick={() => handleEdit(index)}
                  className="text-purple-500 hover:text-purple-700 focus:outline-none"
                  aria-label={`Edit task: ${todo.title}`}
                >
                  <FiEdit2 size={20} />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none"
                  aria-label={`Delete task: ${todo.title}`}
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="mt-8 text-center text-gray-500 italic">
            No tasks yet. Add your first todo!
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
