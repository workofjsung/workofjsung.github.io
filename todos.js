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

function addTodo(text, date) {
  todosRef.push({ text, done: false, date: date || null, createdAt: Date.now() })
    .catch((err) => console.error('addTodo failed:', err));
}

function updateTodo(id, changes) {
  todosRef.child(id).update(changes)
    .catch((err) => console.error('updateTodo failed:', err));
}

function removeTodo(id) {
  todosRef.child(id).remove()
    .catch((err) => console.error('removeTodo failed:', err));
}

function subscribeTodos(callback) {
  todosRef.on('value', (snapshot) => {
    const val = snapshot.val() || {};
    const todos = Object.entries(val).map(([id, data]) => ({ id, ...data }));
    callback(todos);
  }, (err) => console.error('subscribeTodos failed:', err));
}
