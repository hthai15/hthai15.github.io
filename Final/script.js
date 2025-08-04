document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }
    updateCartCount();

    // Load profile and cart if on respective pages
    if (window.location.pathname.includes('profile.html')) {
        displayProfile();
    }
    if (window.location.pathname.includes('cart.html')) {
        displayCart();
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Tin nhắn đã được gửi! (Đây là bản demo, không có tin nhắn thực sự được gửi.)');
            contactForm.reset();
        });
    }

    // Login Form Submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const errorDiv = document.getElementById('loginError');

            if (!validateEmail(email)) {
                errorDiv.textContent = 'Định dạng email không hợp lệ';
                errorDiv.classList.remove('hidden');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'profile.html';
            } else {
                errorDiv.textContent = 'Email hoặc mật khẩu không đúng';
                errorDiv.classList.remove('hidden');
            }
        });
    }

    // Register Form Submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorDiv = document.getElementById('registerError');

            if (!validateEmail(email)) {
                errorDiv.textContent = 'Định dạng email không hợp lệ';
                errorDiv.classList.remove('hidden');
                return;
            }
            if (password.length < 6) {
                errorDiv.textContent = 'Mật khẩu phải có ít nhất 6 ký tự';
                errorDiv.classList.remove('hidden');
                return;
            }
            if (password !== confirmPassword) {
                errorDiv.textContent = 'Mật khẩu không khớp';
                errorDiv.classList.remove('hidden');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users') || '[]');
            if (users.some(u => u.email === email)) {
                errorDiv.textContent = 'Email đã được đăng ký';
                errorDiv.classList.remove('hidden');
                return;
            }

            const newUser = { name, email, password };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            window.location.href = 'profile.html';
        });
    }

    // Product Filter
    const filterSelect = document.getElementById("productFilter");
    const products = document.querySelectorAll(".product-item");
    if (filterSelect) {
        filterSelect.addEventListener("change", function () {
            const selectedCategory = this.value;
            products.forEach(product => {
                const productCategory = product.getAttribute("data-category");
                product.style.display = (selectedCategory === "all" || productCategory === selectedCategory) ? "block" : "none";
            });
        });
    }
});

// Email Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add to Cart (kiểm tra đăng nhập)
function addToCart(name, price) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert("Vui lòng đăng nhập hoặc đăng ký để thêm sản phẩm vào giỏ hàng.");
        window.location.href = 'register.html';
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`${name} đã được thêm vào giỏ hàng!`);
}

// Buy Now (kiểm tra đăng nhập)
function buyNow(productName, price) {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    const selectedProduct = {
        name: productName,
        price: price
    };
    localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));

    if (user) {
        window.location.href = "checkout.html";
    } else {
        alert("Vui lòng đăng nhập hoặc đăng ký để tiếp tục mua hàng.");
        window.location.href = "register.html";
    }
}

// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.length;
        cartCount.classList.add('updated');
        setTimeout(() => cartCount.classList.remove('updated'), 500);
    }
}

// Hiển thị giỏ hàng
// Hiển thị giỏ hàng
function displayCart() {
    const cartItemsDiv = document.getElementById('cartItems');
    const cartTotalDiv = document.getElementById('cartTotal');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p class="text-gray-700">Giỏ hàng của bạn đang trống.</p>';
        cartTotalDiv.textContent = '';
        return;
    }

    let total = 0;
    cartItemsDiv.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
            <div class="flex justify-between items-center mb-4 border-b pb-2">
                <div>
                    <p class="font-semibold">${item.name}</p>
                    <p class="text-sm text-gray-600">${item.price.toLocaleString('vi-VN')} VNĐ</p>
                </div>
                <button onclick="removeItem(${index})" class="text-red-500 hover:underline">Xóa</button>
            </div>
        `;
    }).join('');
    cartTotalDiv.textContent = `Tổng cộng: ${total.toLocaleString('vi-VN')} VNĐ`;
}

// Xoá 1 sản phẩm khỏi giỏ hàng
function removeItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
}

// Mua hàng
function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
        alert("Giỏ hàng của bạn đang trống.");
        return;
    }

    let total = 0;
    let message = "🛍️ Bạn đã mua:\n\n";

    cart.forEach(item => {
        message += `- ${item.name}: ${item.price.toLocaleString('vi-VN')} VNĐ\n`;
        total += item.price;
    });

    message += `\nTổng cộng: ${total.toLocaleString('vi-VN')} VNĐ\n`;
    message += "🎉 Cảm ơn bạn đã mua hàng tại Thai Sport!";

    alert(message);

    localStorage.removeItem('cart');
    updateCartCount();
    displayCart();
}



// Xoá giỏ hàng
function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    displayCart();
}

// Hiển thị thông tin người dùng
function displayProfile() {
    const profileInfo = document.getElementById('profileInfo');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user) {
        profileInfo.innerHTML = `
            <p><strong>Họ Tên:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
        `;
    } else {
        profileInfo.innerHTML = '<p>Vui lòng đăng nhập để xem hồ sơ.</p>';
    }
}

// Đăng xuất
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}
