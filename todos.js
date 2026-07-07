const firebaseConfig = {
  apiKey: "AIzaSyBHrAvfSNS8pet9sy1afcl6waMvs4YPecE",
  authDomain: "workofjsung.firebaseapp.com",
  databaseURL: "https://workofjsung-default-rtdb.firebaseio.com",
  projectId: "workofjsung",
  storageBucket: "workofjsung.firebasestorage.app",
  messagingSenderId: "154766994690",
  appId: "1:154766994690:web:cd0429e2cfd7821deca61b"
};

firebase.initializeApp(firebaseConfig);
const todosRef = firebase.database().ref('todos');

function showFirebaseError(label, err) {
  console.error(label, err);
  let banner = document.getElementById('firebase-error-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'firebase-error-banner';
    banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#fee2e2;color:#991b1b;' +
      'font-family:monospace;font-size:12px;padding:10px;white-space:pre-wrap;word-break:break-word;' +
      'z-index:9999;border-top:2px solid #991b1b;max-height:40vh;overflow:auto;';
    document.body.appendChild(banner);
  }
  banner.textContent = `${label}: ${err && err.message ? err.message : err}`;
}

function addTodo(text, date) {
  todosRef.push({ text, done: false, date: date || null, createdAt: Date.now() })
    .catch((err) => showFirebaseError('addTodo failed', err));
}

function updateTodo(id, changes) {
  todosRef.child(id).update(changes)
    .catch((err) => showFirebaseError('updateTodo failed', err));
}

function removeTodo(id) {
  todosRef.child(id).remove()
    .catch((err) => showFirebaseError('removeTodo failed', err));
}

const TODOS_CACHE_KEY = 'jsung-todos-cache';

function getCachedTodos() {
  try {
    const raw = localStorage.getItem(TODOS_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setCachedTodos(todos) {
  try {
    localStorage.setItem(TODOS_CACHE_KEY, JSON.stringify(todos));
  } catch {}
}

function subscribeTodos(callback) {
  const cached = getCachedTodos();
  if (cached) callback(cached);

  todosRef.on('value', (snapshot) => {
    const val = snapshot.val() || {};
    const todos = Object.entries(val).map(([id, data]) => ({ id, ...data }));
    setCachedTodos(todos);
    callback(todos);
  }, (err) => showFirebaseError('subscribeTodos failed', err));
}
