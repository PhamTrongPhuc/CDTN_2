// js/main.js
const API_URL = '/api';

function showSection(id) {
    document.querySelectorAll('main section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}

// Xử lý đăng ký
document.getElementById('registerForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
        username: document.getElementById('registerUsername').value,
        email: document.getElementById('registerEmail').value,
        password: document.getElementById('registerPassword').value,
    };
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    alert('Đăng ký thành công!');
});

// Xử lý đăng nhập
document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const data = {
        username: document.getElementById('loginUsername').value,
        password: document.getElementById('loginPassword').value,
    };
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.token) {
        localStorage.setItem('token', result.token);
        alert('Đăng nhập thành công');
        loadPosts();
        showSection('posts');
    } else {
        alert('Sai thông tin đăng nhập');
    }
});

// Tải bài viết
async function loadPosts() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const posts = await res.json();
    const list = document.getElementById('postList');
    list.innerHTML = posts.map(p => `
    <div class="post">
      <h3>${p.title}</h3>
      <p>${p.content}</p>
      ${p.image ? `<img src="/uploads/${p.image}" width="100">` : ''}
    </div>
  `).join('');
}
