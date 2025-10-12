const API_BASE = 'http://localhost:3000/api';


// Giả sử bạn đang lấy bài viết theo id trên URL:
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get("id");
const token = localStorage.getItem("token");

// Hàm load bài viết chi tiết
async function loadPost() {
    try {
        const res = await fetch(`/api/posts/${postId}`);
        const post = await res.json();

        document.getElementById("post-title").innerText = post.title;
        document.getElementById("post-content").innerText = post.content;
        document.getElementById("post-image").src = post.imageUrl;

        // ✅ Kiểm tra quyền (chỉ tác giả mới thấy nút xóa)
        const userRes = await fetch("/api/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const userData = await userRes.json();

        if (userData.id === post.author._id) {
            document.getElementById("delete-post-btn").style.display = "inline-block";
        }

    } catch (err) {
        console.error("Lỗi khi load bài viết:", err);
    }
}

loadPost();

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
// ======================
// 👤 CẬP NHẬT MENU THEO TRẠNG THÁI NGƯỜI DÙNG
// ======================
// ======================
// 👤 CẬP NHẬT MENU THEO TRẠNG THÁI NGƯỜI DÙNG
// ======================
// ======================
// 👤 CẬP NHẬT MENU THEO TRẠNG THÁI NGƯỜI DÙNG
// ======================
async function updateAuthLinks() {
    const authLinks = document.getElementById('auth-links');
    if (!authLinks) return;

    const token = localStorage.getItem('token');

    if (token) {
        try {
            // Decode token để lấy username hoặc email
            const payload = JSON.parse(atob(token.split('.')[1]));
            const userDisplay =
                payload.username ||
                payload.email ||
                payload.name ||
                "Người dùng";

            authLinks.innerHTML = `
                <a href="create.html">✍️ Viết bài</a>
                <span style="margin-left: 10px;">👤 <strong>${userDisplay}</strong></span>
                <button onclick="logout()" class="logout-btn">Đăng xuất</button>
            `;
        } catch (err) {
            console.error('Lỗi khi đọc token:', err);
            // Nếu token lỗi thì quay về login
            localStorage.removeItem('token');
            authLinks.innerHTML = `
                <a href="login.html">Đăng nhập</a>
                <a href="register.html">Đăng ký</a>
            `;
        }
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
// =========================
// Hàm load bài viết
// =========================
async function loadPost() {
    try {
        const res = await fetch(`/api/posts/${postId}`);
        const post = await res.json();

        document.getElementById("post-title").innerText = post.title;
        document.getElementById("post-content").innerText = post.content;
        document.getElementById("post-image").src = post.imageUrl;

        // Kiểm tra quyền hiển thị nút xóa
        const userRes = await fetch("/api/auth/me", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const userData = await userRes.json();

        if (userData.id === post.author._id) {
            document.getElementById("delete-post-btn").style.display = "inline-block";
        }

    } catch (err) {
        console.error("Lỗi khi load bài viết:", err);
    }
}

loadPost();

// =========================
// ⚙️ Bước 3: Xử lý sự kiện khi bấm nút xóa
// =========================

document.getElementById('delete-post-btn').addEventListener('click', async () => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này không?")) return;

    try {
        const res = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const data = await res.json();
        alert(data.message);

        if (res.ok) {
            window.location.href = 'index.html';
        }
    } catch (err) {
        console.error("Lỗi khi xóa bài viết:", err);
    }
});

