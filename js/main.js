/* Thuessence — main.js */

const WA_NUMBER = '554399767665';

let productsData = [];
let currentModalPhotos = [];
let currentPhotoIndex = 0;
/* ── Produtos fallback (exibidos enquanto Firebase não está configurado) ── */
const FALLBACK_PRODUCTS = [
    {
        nome: 'Amber Oud Gold Edition',
        marca: 'Al Haramain',
        tipo: 'Eau de Parfum', volume: '60ml',
        notas: ['Âmbar', 'Oud', 'Baunilha'],
        foto: 'https://images.unsplash.com/photo-1705936119725-f893c63ce939?w=600&q=80&fit=crop',
        preco: 0, ativo: true,
    },
    {
        nome: "Bade'e Al Oud for Glory",
        marca: 'Lattafa',
        tipo: 'Eau de Parfum', volume: '100ml',
        notas: ['Oud', 'Incenso', 'Madeira'],
        foto: 'https://images.unsplash.com/photo-1705936119495-574eeecde4e3?w=600&q=80&fit=crop',
        preco: 0, ativo: true,
    },
    {
        nome: 'Yara',
        marca: 'Lattafa',
        tipo: 'Eau de Parfum', volume: '100ml',
        notas: ['Rosa', 'Jasmim', 'Almíscar'],
        foto: 'https://images.unsplash.com/photo-1709662369957-0cbf9f8452fc?w=600&q=80&fit=crop',
        preco: 0, ativo: true,
    },
    {
        nome: 'Wardi',
        marca: 'Swiss Arabian',
        tipo: 'Eau de Parfum', volume: '50ml',
        notas: ['Rosa', 'Oud', 'Âmbar'],
        foto: 'https://images.unsplash.com/photo-1636503461005-4f7dd6081d27?w=600&q=80&fit=crop',
        preco: 0, ativo: true,
    },
];

/* ── Particle canvas (hero bokeh) ── */
function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    const ctx    = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: 75 }, () => ({
        x:     Math.random() * canvas.width,
        y:     Math.random() * canvas.height,
        r:     Math.random() * 1.6 + 0.3,
        alpha: Math.random() * 0.38 + 0.05,
        vx:    (Math.random() - 0.5) * 0.18,
        vy:    (Math.random() - 0.5) * 0.18,
        gold:  Math.random() > 0.38,
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle   = p.gold ? '#c9a84c' : '#f0ece4';
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    draw();
}

/* ── Navbar scroll behaviour ── */
function initNavbar() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });
}

/* ── Scroll reveal (.reveal elements) ── */
function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                observer.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── Staggered product cards (chamado após render dinâmico) ── */
function initCards() {
    const cards    = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay, 10) || 0;
                setTimeout(() => entry.target.classList.add('card-visible'), delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    cards.forEach((card, i) => {
        card.dataset.delay = i * 110;
        observer.observe(card);
    });
}

/* ── Mobile menu ── */
function initMenu() {
    const btn   = document.querySelector('.menu-toggle');
    const links = document.querySelector('.nav-links');

    btn.addEventListener('click', () => {
        const open = links.classList.toggle('open');
        btn.classList.toggle('open', open);
    });

    links.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            links.classList.remove('open');
            btn.classList.remove('open');
        });
    });
}

/* ── Modal Produto com Galeria ── */
function openProductModal(index) {
    const p       = productsData[index];
    const overlay = document.getElementById('product-modal-overlay');

    currentPhotoIndex = 0;
    currentModalPhotos = Array.isArray(p.fotos) ? p.fotos : (p.foto ? [p.foto] : []);

    document.getElementById('pmodal-brand').textContent = p.marca;
    document.getElementById('pmodal-name').textContent  = p.nome;

    const typeStr = [p.tipo, p.volume].filter(Boolean).join(' · ');
    document.getElementById('pmodal-type').textContent = typeStr;

    const priceEl = document.getElementById('pmodal-price');
    priceEl.textContent = p.preco > 0
        ? `R$ ${Number(p.preco).toFixed(2).replace('.', ',')}`
        : '';

    const descEl = document.getElementById('pmodal-desc');
    descEl.textContent = p.descricao || '';
    descEl.style.display = p.descricao ? 'block' : 'none';

    document.getElementById('pmodal-notes').innerHTML =
        (p.notas || []).map(n => `<span>${n}</span>`).join('');

    const msg = encodeURIComponent(
        `Olá! Vi o site da Thuessence e tenho interesse no perfume *${p.nome}*. Poderia me dar mais informações?`
    );
    document.getElementById('pmodal-whatsapp').href =
        `https://wa.me/${WA_NUMBER}?text=${msg}`;

    updateModalPhoto();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function updateModalPhoto() {
    const img     = document.getElementById('pmodal-img');
    const counter = document.getElementById('pmodal-counter');
    const prevBtn  = document.getElementById('pmodal-prev');
    const nextBtn  = document.getElementById('pmodal-next');

    img.src = currentModalPhotos[currentPhotoIndex] || '';
    counter.textContent = `${currentPhotoIndex + 1}/${currentModalPhotos.length}`;

    prevBtn.style.display = currentModalPhotos.length > 1 ? 'flex' : 'none';
    nextBtn.style.display = currentModalPhotos.length > 1 ? 'flex' : 'none';
}

function prevPhoto() {
    if (currentModalPhotos.length > 1) {
        currentPhotoIndex = (currentPhotoIndex - 1 + currentModalPhotos.length) % currentModalPhotos.length;
        updateModalPhoto();
    }
}

function nextPhoto() {
    if (currentModalPhotos.length > 1) {
        currentPhotoIndex = (currentPhotoIndex + 1) % currentModalPhotos.length;
        updateModalPhoto();
    }
}

function closeProductModal() {
    document.getElementById('product-modal-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

/* ── Renderizar produtos no grid ── */
function renderProducts(products) {
    const grid    = document.getElementById('products-grid');
    const loading = document.getElementById('products-loading');

    productsData  = products.filter(p => p.ativo !== false);

    grid.innerHTML = productsData.map((p, i) => {
        const typeStr   = [p.tipo, p.volume].filter(Boolean).join(' · ');
        const notasHtml = (p.notas || []).map(n => `<span>${n}</span>`).join('');
        const precoHtml = p.preco > 0
            ? `<div class="product-price">R$ ${Number(p.preco).toFixed(2).replace('.', ',')}</div>`
            : '';

        // Pega primeira foto do array, ou foto única (compatibilidade)
        const fotoUrl  = (Array.isArray(p.fotos) && p.fotos[0]) || p.foto || '';
        const badgeHtml = p.badge ? `<span class="product-badge product-badge--${p.badge.toLowerCase().replace(' ', '-')}">${p.badge}</span>` : '';

        return `
            <div class="product-card" onclick="openProductModal(${i})">
                <div class="product-visual">
                    <img src="${fotoUrl}" alt="${p.nome}" loading="lazy">
                    <div class="visual-overlay"></div>
                    <span class="product-brand">${p.marca}</span>
                    ${badgeHtml}
                </div>
                <div class="product-info">
                    ${typeStr ? `<span class="product-type">${typeStr}</span>` : ''}
                    <h3 class="product-name">${p.nome}</h3>
                    <div class="product-line"></div>
                    ${precoHtml}
                    <div class="product-notes">${notasHtml}</div>
                </div>
                <div class="card-hover-overlay">
                    <span class="overlay-btn">Explorar</span>
                </div>
            </div>
        `;
    }).join('');

    if (loading) loading.style.display = 'none';
    grid.style.display = 'grid';
    initCards();
    initFiltros();
}

/* ── Filtros de categoria ── */
function initFiltros() {
    const btns = document.querySelectorAll('.filtro-btn');
    if (!btns.length) return;

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filtro = btn.dataset.filtro;
            const cards  = document.querySelectorAll('.product-card');

            cards.forEach((card, i) => {
                const categoria = productsData[i]?.categoria || '';
                const visivel   = filtro === 'todos' || categoria === filtro;
                card.style.display = visivel ? '' : 'none';
            });
        });
    });
}

/* ── Carregar produtos (Firebase ou fallback) ── */
async function loadProducts() {
    const configured =
        typeof firebaseConfig !== 'undefined' &&
        firebaseConfig.apiKey &&
        firebaseConfig.apiKey !== 'COLE_SUA_API_KEY_AQUI';

    if (!configured) {
        renderProducts(FALLBACK_PRODUCTS);
        return;
    }

    try {
        if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
        const snap = await firebase.firestore()
            .collection('produtos')
            .orderBy('ordem')
            .get();
        const list = snap.docs.map(d => d.data());
        renderProducts(list.length ? list : FALLBACK_PRODUCTS);
    } catch {
        renderProducts(FALLBACK_PRODUCTS);
    }
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initNavbar();
    initReveal();
    initMenu();
    loadProducts();

    document.getElementById('pmodal-close').addEventListener('click', closeProductModal);
    document.getElementById('pmodal-prev').addEventListener('click', prevPhoto);
    document.getElementById('pmodal-next').addEventListener('click', nextPhoto);
    document.getElementById('product-modal-overlay').addEventListener('click', e => {
        if (e.target.id === 'product-modal-overlay') closeProductModal();
    });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeProductModal();
        if (e.key === 'ArrowLeft') prevPhoto();
        if (e.key === 'ArrowRight') nextPhoto();
    });
});
