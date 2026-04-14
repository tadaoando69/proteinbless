document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations logic
    const observerOptions = {
        threshold: 0.01 // Trigger faster as soon as it enters viewport
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-mask').forEach(el => {
        revealObserver.observe(el);
    });

    // Header scroll logic
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Favorites Product Data
    const productsData = {
        'ai-waffle': { 
            title: 'Gourmet Protein Waffle', 
            price: 'S/ 24.00', 
            image: 'assets/ai_waffle_v2.png', 
            description: 'Waffle premium de proteína aislada con una textura crujiente por fuera y suave por dentro. El desayuno ideal para campeones.',
            macros: { prot: 28, carb: 35, fat: 10, cal: 340 },
            benefits: ['Recuperación Muscular', 'Saciedad Prolongada'],
            goal: 'musculo'
        },
        'ai-bowl': { 
            title: 'Açai Protein Bowl', 
            price: 'S/ 20.00', 
            image: 'assets/ai_bowl_v2.png', 
            description: 'Un superfood bowl cargado de energía. Base de açai orgánico con proteína, coronado con semillas de chía y frutas tropicales.',
            macros: { prot: 15, carb: 48, fat: 12, cal: 360 },
            benefits: ['Bombeo Antioxidante', 'Energía Natural'],
            goal: 'energia'
        },
        'ai-toast': { 
            title: 'Protein Avocado Toast', 
            price: 'S/ 22.00', 
            image: 'assets/ai_toast_v2.png', 
            description: 'Tostada de pan de masa madre con aguacate cremoso, semillas de girasol y un huevo poché perfecto.',
            macros: { prot: 18, carb: 28, fat: 22, cal: 390 },
            benefits: ['Grasas Saludables', 'Balance Nutricional'],
            goal: 'recuperacion'
        },
        'ai-tart': { 
            title: 'Berry Protein Tart', 
            price: 'S/ 18.00', 
            image: 'assets/ai_tart.png', 
            description: 'Tarta artesanal elaborada con una base de almendras y proteína, rellena de una crema suave de vainilla.',
            macros: { prot: 12, carb: 24, fat: 14, cal: 270 },
            benefits: ['Bajo en Azúcar', 'Frutos Rojos'],
            goal: 'energia'
        },
        'ai-brownie': { 
            title: 'Warm Choco Brownie', 
            price: 'S/ 18.00', 
            image: 'assets/ai_brownie.png', 
            description: 'Brownie denso de chocolate amargo al 70%, enriquecido con proteína Bless y trozos de nueces seleccionadas.',
            macros: { prot: 10, carb: 22, fat: 18, cal: 290 },
            benefits: ['70% Cacao Puro', 'Gluten Free'],
            goal: 'recuperacion'
        }
    };

    // Swiper Carousel Initialization
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1, centeredSlides: true, spaceBetween: 100, speed: 800, loop: true, parallax: true,
        pagination: { el: '.swiper-pagination', clickable: true, dynamicBullets: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
        breakpoints: { 1024: { slidesPerView: 1.2 } }
    });

    // Modal Logic
    const modal = document.getElementById('quick-view-modal');
    const closeBtn = document.getElementById('close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDesc = document.getElementById('modal-desc');

    function updateModalData(data) {
        modalImg.src = data.image;
        modalImg.classList.add('parallax-img');
        modalTitle.textContent = data.title;
        modalPrice.textContent = data.price;
        modalDesc.textContent = data.description;
        
        // Inject Macros
        const macroContainer = document.getElementById('modal-macros');
        if (macroContainer && data.macros) {
            macroContainer.innerHTML = `
                <div class="macro-item">
                    <span>Proteína</span>
                    <div class="macro-bar"><div class="fill" id="prot-fill"></div></div>
                    <span class="macro-val">${data.macros.prot}g</span>
                </div>
                <div class="macro-item">
                    <span>Carbos</span>
                    <div class="macro-bar"><div class="fill" id="carb-fill"></div></div>
                    <span class="macro-val">${data.macros.carb}g</span>
                </div>
                <div class="macro-item">
                    <span>Grasas</span>
                    <div class="macro-bar"><div class="fill" id="fat-fill"></div></div>
                    <span class="macro-val">${data.macros.fat}g</span>
                </div>
            `;
            // Trigger animation after a brief moment to ensure modal is visible
            setTimeout(() => {
                const prot = document.getElementById('prot-fill');
                const carb = document.getElementById('carb-fill');
                const fat = document.getElementById('fat-fill');
                if (prot) prot.style.width = `${data.macros.prot * 2.5}%`;
                if (carb) carb.style.width = `${data.macros.carb * 1.5}%`;
                if (fat) fat.style.width = `${data.macros.fat * 3}%`;
            }, 100);
        }

        // Inject Benefits
        const benefitContainer = document.getElementById('modal-benefits');
        if (benefitContainer && data.benefits) {
            benefitContainer.innerHTML = data.benefits.map((b, i) => 
                `<span class="benefit-pill" style="animation-delay: ${i * 0.1}s">${b}</span>`
            ).join('');
        }
    }

    let currentModalProduct = null;
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('click', () => {
            const productId = slide.getAttribute('data-product');
            const data = productsData[productId];
            if (data) {
                currentModalProduct = { ...data, id: productId };
                updateModalData(data);
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });

    // --- PREMIUM INTERACTVITY: Filtering, Magnetic & Parallax ---

    // 1. Wellness Goal Filter
    const goalBtns = document.querySelectorAll('.goal-btn');
    const productCards = document.querySelectorAll('.product-card');

    goalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const goal = btn.getAttribute('data-goal');
            goalBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            productCards.forEach(card => {
                const cardGoal = card.getAttribute('data-goal');
                if (goal === 'all' || cardGoal === goal) {
                    card.style.display = 'block';
                    setTimeout(() => card.classList.add('active'), 50);
                } else {
                    card.classList.remove('active');
                    setTimeout(() => card.style.display = 'none', 400);
                }
            });
        });
    });

    // Magnetic effect removed — it shifts visual position but NOT the click hitbox,
    // making links and buttons unreliable to click.


    // 3. Modal Image Parallax
    modal.addEventListener('mousemove', (e) => {
        const img = modal.querySelector('.parallax-img');
        if (!img) return;
        const x = (window.innerWidth / 2 - e.pageX) / 40;
        const y = (window.innerHeight / 2 - e.pageY) / 40;
        img.style.transform = `translate(${x}px, ${y}px) rotateY(${x}deg)`;
    });

    // --- SHOPPING CART LOGIC ---
    let cart = JSON.parse(localStorage.getItem('pb_cart')) || [];
    const cartFloat = document.getElementById('cart-float');
    const cartBadge = document.getElementById('cart-count');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');
    const closeCartBtn = document.getElementById('close-cart');

    function saveCart() {
        localStorage.setItem('pb_cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = totalCount;
        if (totalCount > 0) cartFloat.classList.add('visible');
        else {
            cartFloat.classList.remove('visible');
            if (cartDrawer.classList.contains('open')) toggleCart();
        }

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Tu pedido está vacío.</div>';
            checkoutBtn.disabled = true;
            cartTotalPrice.textContent = 'S/ 0.00';
            return;
        }

        checkoutBtn.disabled = false;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price * item.qty;
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <div class="cart-item-info"><div class="cart-item-title">${item.name}</div><div class="cart-item-price">S/ ${item.price.toFixed(2)}</div></div>
                <div class="cart-item-qty"><button class="qty-btn minus" data-index="${index}">-</button><span>${item.qty}</span><button class="qty-btn plus" data-index="${index}">+</button></div>
                <button class="remove-item" data-index="${index}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg></button>`;
            cartItemsContainer.appendChild(itemEl);
        });
        cartTotalPrice.textContent = `S/ ${total.toFixed(2)}`;

        cartItemsContainer.querySelectorAll('.plus').forEach(btn => btn.onclick = () => { cart[btn.dataset.index].qty++; saveCart(); });
        cartItemsContainer.querySelectorAll('.minus').forEach(btn => btn.onclick = () => {
            const idx = btn.dataset.index;
            if (cart[idx].qty > 1) cart[idx].qty--; else cart.splice(idx, 1);
            saveCart();
        });
        cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => btn.onclick = () => { cart.splice(btn.dataset.index, 1); saveCart(); });
    }

    function toggleCart() {
        cartDrawer.classList.toggle('open');
        document.body.style.overflow = cartDrawer.classList.contains('open') ? 'hidden' : '';
    }

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const { id, name, price } = btn.dataset;
            const existing = cart.find(item => item.id === id);
            if (existing) existing.qty++; else cart.push({ id, name, price: parseFloat(price), qty: 1 });
            const originalText = btn.textContent;
            btn.textContent = '¡Añadido!'; btn.style.background = '#25D366';
            setTimeout(() => { btn.textContent = originalText; btn.style.background = ''; }, 1000);
            saveCart();
        });
    });

    const modalAddBtn = document.getElementById('modal-add-btn');
    if (modalAddBtn) {
        modalAddBtn.addEventListener('click', () => {
            if (currentModalProduct) {
                const priceVal = parseFloat(currentModalProduct.price.replace('S/ ', ''));
                const existing = cart.find(item => item.id === currentModalProduct.id);
                if (existing) existing.qty++; else cart.push({ id: currentModalProduct.id, name: currentModalProduct.title, price: priceVal, qty: 1 });
                modalAddBtn.textContent = '¡Añadido!'; modalAddBtn.style.background = '#25D366';
                setTimeout(() => { modalAddBtn.textContent = 'Añadir al Pedido'; modalAddBtn.style.background = ''; }, 1000);
                saveCart();
            }
        });
    }

    cartFloat.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);

    checkoutBtn.addEventListener('click', () => {
        let message = `*NUEVO PEDIDO - PROTEIN BLESS*\n\nHola! Me gustaría pedir los siguientes productos:\n\n`;
        let total = 0;
        cart.forEach(item => { total += item.price * item.qty; message += `• *${item.qty}x* ${item.name} (S/ ${(item.price * item.qty).toFixed(2)})\n`; });
        message += `\n*TOTAL ESTIMADO: S/ ${total.toFixed(2)}*`;
        window.open(`https://wa.me/51980052531?text=${encodeURIComponent(message)}`, '_blank');
    });

    // --- PROMO POPUP LOGIC ---
    const promoPopup = document.getElementById('promo-popup');
    const closePromoBtn = document.getElementById('close-promo');

    function showPromo() {
        if (!sessionStorage.getItem('pb_promo_shown')) {
            setTimeout(() => {
                if (promoPopup) {
                    promoPopup.classList.add('active');
                    promoPopup.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    sessionStorage.setItem('pb_promo_shown', 'true');
                }
            }, 2000);
        }
    }

    function closePromo() {
        promoPopup.classList.remove('active');
        setTimeout(() => {
            promoPopup.style.display = 'none';
            if (!cartDrawer.classList.contains('open') && modal.style.display !== 'flex') document.body.style.overflow = '';
        }, 300);
    }

    if (promoPopup && closePromoBtn) {
        closePromoBtn.addEventListener('click', closePromo);
        promoPopup.addEventListener('click', (e) => { if (e.target === promoPopup) closePromo(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && promoPopup.classList.contains('active')) closePromo(); });
        showPromo();
    }

    updateCartUI();
});
