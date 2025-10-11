const API_BASE = 'http://localhost:3000/api';
const token = localStorage.getItem('token');

async function loadPosts() {
    try {
        const res = await fetch(`${API_BASE}/posts`);
        const posts = await res.json();
        const container = document.getElementById('post-list');
        if (!container) return; // ✅ tránh lỗi khi không có phần tử này

        container.innerHTML = posts.map(p => `
            <div class="post-card">
                <h2><a href="post.html?id=${p._id}">${p.title}</a></h2>
                <p>${p.content.slice(0, 120)}...</p>
                <small>By ${p.author?.username || 'Ẩn danh'}</small>
            </div>
        `).join('');
    } catch (err) {
        console.error('Lỗi khi tải bài viết:', err);
    }
}

async function register(form) {
    const data = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
    };

    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const json = await res.json();
        alert(json.message);

        if (res.ok) window.location.href = 'login.html';

    } catch (err) {
        console.error('Lỗi khi đăng ký:', err);
        alert('Không thể kết nối đến server.');
    }
}


async function login(form) {
    const body = Object.fromEntries(new FormData(form));
    try {
        const res = await fetch(`http://localhost:3000/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        if (res.ok && data.token) {
            localStorage.setItem('token', data.token);
            alert('Đăng nhập thành công!');
            location.href = 'index.html';
        } else {
            alert(data.message || 'Sai tài khoản hoặc mật khẩu!');
        }
    } catch (err) {
        console.error('Lỗi đăng nhập:', err);
        alert('Không thể kết nối đến server.');
    }
}


async function createPost(form) {
    const title = form.title.value.trim();
    const content = form.content.value.trim();
    const category = form.category.value.trim();

    const token = localStorage.getItem("token"); // 🔥 lấy token sau khi đăng nhập

    if (!token) {
        alert("Vui lòng đăng nhập trước khi đăng bài!");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token  // 🔥 Gửi token kèm request
            },
            body: JSON.stringify({ title, content, category }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Đăng bài thành công!");
            form.reset();
            window.location.href = "index.html";
        } else {
            alert(data.message || "Không tạo được bài viết!");
        }
    } catch (err) {
        console.error("Lỗi:", err);
        alert("Đã xảy ra lỗi khi gửi bài viết!");
    }
}

