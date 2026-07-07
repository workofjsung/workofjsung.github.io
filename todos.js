const TODOS_STORAGE_KEY = 'jsung-todos';

function getTodos() {
  try {
    const raw = localStorage.getItem(TODOS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos) {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
}

function addTodo(text, date) {
  const todos = getTodos();
  todos.push({ id: Date.now() + Math.random(), text, done: false, date: date || null });
  saveTodos(todos);
  return todos;
}
