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

    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('click', () => {
            const productId = slide.getAttribute('data-product');
            const data = productsData[productId];

            if (data) {
                modalImg.src = data.image;
                modalTitle.textContent = data.title;
                modalPrice.textContent = data.price;
                modalDesc.textContent = data.description;
                
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden'; // Stop scrolling
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

});
