// Image Gallery
function changeImage(thumb) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = thumb.src.replace('w=200', 'w=800');
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
}

// Image Zoom on hover
const mainWrapper = document.querySelector('.main-image-wrapper');
const mainImg = document.getElementById('mainImage');
const zoomOverlay = document.getElementById('zoomOverlay');
const zoomImg = document.getElementById('zoomImage');

mainWrapper.addEventListener('mouseenter', () => {
    zoomOverlay.style.display = 'block';
    zoomImg.src = mainImg.src;
});
mainWrapper.addEventListener('mouseleave', () => {
    zoomOverlay.style.display = 'none';
});
mainWrapper.addEventListener('mousemove', (e) => {
    const rect = mainWrapper.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoomImg.style.transform = `translate(-${x}%, -${y}%)`;
    zoomImg.style.transformOrigin = `${x}% ${y}%`;
});

// Color selection
document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('selectedColor').textContent = btn.dataset.color;
    });
});

// Size selection
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Quantity
function changeQty(delta) {
    const input = document.getElementById('quantity');
    let val = parseInt(input.value) + delta;
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    input.value = val;
}

// Tabs
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// Cart
function addToCart() {
    showToast('✓ Bidhaa imeongezwa kwenye kikapu!');
}

function buyNow() {
    showToast('⚡ Unaelekezwa kwenye malipo...');
}

// Wishlist
function toggleWishlist(btn) {
    btn.classList.toggle('active');
    btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    showToast(btn.classList.contains('active') ? '♥ Imeongezwa kwenye Wishlist' : 'Imetolewa kwenye Wishlist');
}

// Toast
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Mobile menu
document.getElementById('menuToggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
});

// ===== MOBILE SWIPE GALLERY =====
(function() {
    const images = [
        'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80',
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&q=80',
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80'
    ];
    let currentIdx = 0;
    const wrapper = document.getElementById('mainImageWrapper');
    const mainImg = document.getElementById('mainImage');
    const dotsContainer = document.getElementById('swipeDots');

    // Create dots
    images.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
    });

    function goTo(idx) {
        currentIdx = idx;
        mainImg.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
        mainImg.style.opacity = '0.5';
        mainImg.style.transform = 'scale(0.95)';
        setTimeout(() => {
            mainImg.src = images[idx];
            mainImg.style.opacity = '1';
            mainImg.style.transform = 'scale(1)';
        }, 150);
        dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
            d.classList.toggle('active', i === idx);
        });
        // Sync thumbnails too
        document.querySelectorAll('.thumbnail').forEach((t, i) => {
            t.classList.toggle('active', i === idx);
        });
    }

    // Touch swipe
    let startX = 0, startY = 0, isDragging = false;
    const THRESHOLD = 50;

    wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dx = Math.abs(e.touches[0].clientX - startX);
        const dy = Math.abs(e.touches[0].clientY - startY);
        // If horizontal swipe is dominant, prevent vertical scroll
        if (dx > dy && dx > 10) {
            e.preventDefault();
        }
    }, { passive: false });

    wrapper.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        if (Math.abs(diff) > THRESHOLD) {
            if (diff > 0 && currentIdx < images.length - 1) {
                goTo(currentIdx + 1);
            } else if (diff < 0 && currentIdx > 0) {
                goTo(currentIdx - 1);
            }
        }
    }, { passive: true });
})();
