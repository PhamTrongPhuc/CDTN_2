const API_BASE = 'http://localhost:3000/api';

// ======================
// 🔹 TẢI DANH SÁCH BÀI VIẾT
// ======================
async function loadPosts() {
    console.log("📡 Đang tải bài viết...");
    try {
        const res = await fetch(`${API_BASE}/posts`);
        const posts = await res.json();
        console.log("✅ Dữ liệu nhận được:", posts);

        const container = document.getElementById('post-list');
        if (!container) return;

        if (!posts || posts.length === 0) {
            container.innerHTML = "<p>Chưa có bài viết nào.</p>";
            return;
        }

        container.innerHTML = posts.map(p => `
            <div class="post-card">
                <h2><a href="post.html?id=${p._id}">${p.title || 'Không có tiêu đề'}</a></h2>
                ${p.image ? `<img src="${p.image}" alt="Ảnh bài viết" class="post-img" width="300"/>` : ''}
                <p>${(p.content || '').slice(0, 120)}...</p>
                <small>👤 ${p.author?.username || 'Ẩn danh'} | 🕒 ${new Date(p.createdAt).toLocaleString()}</small>
            </div>
        `).join('');

    } catch (err) {
        console.error('❌ Lỗi khi tải bài viết:', err);
        const container = document.getElementById('post-list');
        container.innerHTML = "<p>Lỗi khi tải bài viết!</p>";
    }
}


// ======================
// 🟢 ĐĂNG KÝ
// ======================
async function register(form) {
    const data = {
        username: form.username.value,
        email: form.email.value,
        password: form.password.value
    };

    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
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

// ======================
// 🔐 ĐĂNG NHẬP
// ======================
async function login(form) {
    const body = Object.fromEntries(new FormData(form));
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
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

// ======================
// 📝 TẠO BÀI VIẾT (CÓ HÌNH ẢNH)
// ======================
async function createPost(form) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("Vui lòng đăng nhập trước khi đăng bài!");
        window.location.href = "login.html";
        return;
    }

    const formData = new FormData();
    formData.append("title", form.title.value.trim());
    formData.append("content", form.content.value.trim());
    if (form.image && form.image.files[0]) {
        formData.append("image", form.image.files[0]);
    }

    try {
        const res = await fetch(`${API_BASE}/posts`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        const data = await res.json();
        if (res.ok) {
            alert("✅ Đăng bài thành công!");
            form.reset();
            window.location.href = "index.html"; // quay lại trang chủ
        } else {
            alert("❌ " + (data.message || "Không thể tạo bài viết!"));
        }
    } catch (err) {
        console.error("Lỗi:", err);
        alert("⚠️ Lỗi kết nối đến server!");
    }
}


// ======================
// 🚪 ĐĂNG XUẤT
// ======================
function logout() {
    localStorage.removeItem('token');
    alert('Đã đăng xuất!');
    window.location.href = 'login.html';
}

// ======================
// 👀 CẬP NHẬT MENU THEO TRẠNG THÁI
// ======================
function updateAuthLinks() {
    const authLinks = document.getElementById('auth-links');
    if (!authLinks) return;

    const token = localStorage.getItem('token');

    if (token) {
        authLinks.innerHTML = `
            <a href="create.html">✍️ Viết bài</a>
            <button onclick="logout()" class="logout-btn">Đăng xuất</button>
        `;
    } else {
        authLinks.innerHTML = `
            <a href="login.html">Đăng nhập</a>
            <a href="register.html">Đăng ký</a>
        `;
    }
}

// ======================
// 🚀 KHỞI TẠO
// ======================
document.addEventListener('DOMContentLoaded', () => {
    updateAuthLinks();
    if (document.getElementById('post-list')) loadPosts();
});

document.querySelectorAll('.react-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
        const type = btn.dataset.type;
        const res = await fetch(`/api/posts/${postId}/react`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ reaction: type })
        });
        const data = await res.json();
        alert(data.message);
    });
});
