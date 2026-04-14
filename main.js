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
            description: 'Waffle premium de proteína aislada con una textura crujiente por fuera y suave por dentro. Decorado con bayas frescas del huerto, rodajas de banano y un toque de miel orgánica. El desayuno ideal para campeones.'
        },
        'ai-bowl': {
            title: 'Açai Protein Bowl',
            price: 'S/ 20.00',
            image: 'assets/ai_bowl_v2.png',
            description: 'Un superfood bowl cargado de energía. Base de açai orgánico con proteína, coronado con semillas de chía, granola artesanal y frutas tropicales. Una explosión de antioxidantes para tu día.'
        },
        'ai-toast': {
            title: 'Protein Avocado Toast',
            price: 'S/ 22.00',
            image: 'assets/ai_toast_v2.png',
            description: 'Tostada de pan de masa madre con aguacate cremoso, semillas de girasol y un huevo poché perfecto. Cargado de grasas saludables y proteína de alta calidad para un rendimiento máximo.'
        },
        'ai-tart': {
            title: 'Berry Protein Tart',
            price: 'S/ 18.00',
            image: 'assets/ai_tart.png',
            description: 'Tarta artesanal elaborada con una base de almendras y proteína, rellena de una crema suave de vainilla y coronada con una selección premium de frutos rojos frescos. Un postre sofisticado y nutritivo.'
        },
        'ai-brownie': {
            title: 'Warm Choco Brownie',
            price: 'S/ 18.00',
            image: 'assets/ai_brownie.png',
            description: 'Brownie denso de chocolate amargo al 70%, enriquecido con proteína Bless y trozos de nueces seleccionadas. Servido con un toque de sal marina para realzar la pureza del cacao.'
        }
    };

    // Swiper Carousel Initialization
    const swiper = new Swiper('.swiper-container', {
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 100,
        speed: 800,
        loop: true,
        parallax: true,
        mousewheel: {
            forceToAxis: true,
            releaseOnEdges: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            1024: {
                slidesPerView: 1.2,
            }
        }
    });

    // Modal Logic
    const modal = document.getElementById('quick-view-modal');
    const closeBtn = document.getElementById('close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalDesc = document.getElementById('modal-desc');

    let currentModalProduct = null;

    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('click', () => {
            const productId = slide.getAttribute('data-product');
            const data = productsData[productId];

            if (data) {
                currentModalProduct = { ...data, id: productId }; // Capture for add to cart
                modalImg.src = data.image;
                modalTitle.textContent = data.title;
                modalPrice.textContent = data.price;
                modalDesc.textContent = data.description;
                
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Stop scrolling
            }
        });
    });

    const modalAddBtn = document.getElementById('modal-add-btn');
    modalAddBtn.addEventListener('click', () => {
        if (currentModalProduct) {
            const priceVal = parseFloat(currentModalProduct.price.replace('S/ ', ''));
            const existing = cart.find(item => item.id === currentModalProduct.id);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ 
                    id: currentModalProduct.id, 
                    name: currentModalProduct.title, 
                    price: priceVal, 
                    qty: 1 
                });
            }

            // Feedback
            modalAddBtn.textContent = '¡Añadido al Pedido!';
            modalAddBtn.style.background = '#25D366';
            setTimeout(() => {
                modalAddBtn.textContent = 'Añadir al Pedido';
                modalAddBtn.style.background = '';
            }, 1000);

            saveCart();
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
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
        // Update total count and visibility
        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        cartBadge.textContent = totalCount;
        
        if (totalCount > 0) {
            cartFloat.classList.add('visible');
        } else {
            cartFloat.classList.remove('visible');
            if (cartDrawer.classList.contains('open')) {
                toggleCart();
            }
        }

        // Render items
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
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">S/ ${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-qty">
                    <button class="qty-btn minus" data-index="${index}">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn plus" data-index="${index}">+</button>
                </div>
                <button class="remove-item" data-index="${index}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                </button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });

        cartTotalPrice.textContent = `S/ ${total.toFixed(2)}`;

        // Attach event listeners to new buttons
        cartItemsContainer.querySelectorAll('.plus').forEach(btn => {
            btn.onclick = () => { cart[btn.dataset.index].qty++; saveCart(); };
        });
        cartItemsContainer.querySelectorAll('.minus').forEach(btn => {
            btn.onclick = () => {
                const idx = btn.dataset.index;
                if (cart[idx].qty > 1) {
                    cart[idx].qty--;
                } else {
                    cart.splice(idx, 1);
                }
                saveCart();
            };
        });
        cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
            btn.onclick = () => { cart.splice(btn.dataset.index, 1); saveCart(); };
        });
    }

    function toggleCart() {
        cartDrawer.classList.toggle('open');
        if (cartDrawer.classList.contains('open')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Avoid triggering card and grid actions
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = parseFloat(btn.dataset.price);

            const existing = cart.find(item => item.id === id);
            if (existing) {
                existing.qty++;
            } else {
                cart.push({ id, name, price, qty: 1 });
            }

            // Feedback: Change button temporarily
            const originalText = btn.textContent;
            btn.textContent = '¡Añadido!';
            btn.style.background = '#25D366';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1000);

            saveCart();
        });
    });

    // Toggle Cart UI events
    cartFloat.addEventListener('click', toggleCart);
    closeCartBtn.addEventListener('click', toggleCart);

    // WhatsApp Final Order Generator
    checkoutBtn.addEventListener('click', () => {
        let message = `*NUEVO PEDIDO - PROTEIN BLESS*\n\nHola! Me gustaría pedir los siguientes productos:\n\n`;
        let total = 0;

        cart.forEach(item => {
            const subtotal = item.price * item.qty;
            message += `• *${item.qty}x* ${item.name} (S/ ${subtotal.toFixed(2)})\n`;
            total += subtotal;
        });

        message += `\n*TOTAL ESTIMADO: S/ ${total.toFixed(2)}*\n\n_Por favor confirmar disponibilidad y tiempo de entrega._`;
        
        const encodedMsg = encodeURIComponent(message);
        window.open(`https://wa.me/51980052531?text=${encodedMsg}`, '_blank');
    });

    // Quick View Modal Update: Add to Cart from modal (Optional enhancement)
    // For now, modal is informational only as planned.

    // Initial UI Sync
    updateCartUI();

});
