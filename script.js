document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. BARRA DE PROGRESSO DE SCROLL & NAVBAR INTELEGENTE
    // ==========================================
    const scrollProgress = document.getElementById('scrollProgress');
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        // Barra de progresso de leitura
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolled + "%";
        }
        
        // Efeito sticky e encolhimento da navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // ==========================================
    // 2. MENU MOBILE PREMIUM (DRAWER)
    // ==========================================
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isOpened = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isOpened);
            navLinks.classList.toggle('active');
            
            // Animação das listras do menu hambúrguer
            const spans = menuToggle.querySelectorAll('span');
            if (!isOpened) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Fechar menu mobile ao clicar em links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                
                const spans = menuToggle.querySelectorAll('span');
                spans.forEach(span => span.style.transform = 'none');
                spans[1].style.opacity = '1';
            });
        });
    }

    // ==========================================
    // 3. ROLAGEM SUAVE COM DESCONTO DE NAVBAR
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = navbar.classList.contains('scrolled') ? 65 : 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ==========================================
    // 4. EFEITO REVEAL NO SCROLL (INTERSECTION OBSERVER)
    // ==========================================
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Para de observar após animar
            }
        });
    }, revealOptions);

    document.querySelectorAll('.scroll-reveal').forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================
    // 5. ANIMAÇÃO DE CONTADORES PROGRESSIVOS
    // ==========================================
    const startCounterAnimation = (counterElement) => {
        const target = +counterElement.getAttribute('data-target');
        const duration = 2000; // 2 segundos
        const stepTime = 20; // 50 updates por segundo
        const increment = target / (duration / stepTime);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counterElement.textContent = target + (target === 100 ? '%' : '+');
                clearInterval(timer);
            } else {
                counterElement.textContent = Math.floor(current) + (target === 100 ? '%' : '+');
            }
        }, stepTime);
    };

    const metricsSection = document.querySelector('.metrics-section');
    if (metricsSection) {
        const metricsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    metricsSection.querySelectorAll('.metric-number').forEach(num => {
                        startCounterAnimation(num);
                    });
                    observer.unobserve(metricsSection);
                }
            });
        }, { threshold: 0.2 });
        metricsObserver.observe(metricsSection);
    }

    // ==========================================
    // 6. TIMELINE HIGHLIGHT COM SCROLL PROGRESSIVO
    // ==========================================
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.5, rootMargin: "0px 0px -100px 0px" });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // ==========================================
    // 7. CARROSSEL DE DEPOIMENTOS (SUAVE & RESPONSIVO)
    // ==========================================
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    
    if (track && slides.length > 0) {
        let activeSlideIndex = 0;
        let slideInterval;
        
        const moveToSlide = (index) => {
            track.style.transform = `translateX(-${index * 100}%)`;
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            activeSlideIndex = index;
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moveToSlide(index);
                resetInterval();
            });
        });

        // Loop automático a cada 6 segundos
        const startAutoSlide = () => {
            slideInterval = setInterval(() => {
                const nextIndex = (activeSlideIndex + 1) % slides.length;
                moveToSlide(nextIndex);
            }, 6000);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startAutoSlide();
        };

        startAutoSlide();

        // Suporte a swipe simples no touch para celulares
        let startX = 0;
        let endX = 0;
        
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            if (Math.abs(diffX) > 50) { // Limiar de deslize
                if (diffX > 0) {
                    // Swipe para esquerda -> Próximo slide
                    moveToSlide((activeSlideIndex + 1) % slides.length);
                } else {
                    // Swipe para direita -> Slide anterior
                    moveToSlide((activeSlideIndex - 1 + slides.length) % slides.length);
                }
                resetInterval();
            }
        }, { passive: true });
    }

    // ==========================================
    // 8. FAQ ACCORDION EXPANSÍVEL & ANIMADO
    // ==========================================
    const faqCards = document.querySelectorAll('.faq-card');
    
    faqCards.forEach(card => {
        const btn = card.querySelector('.faq-header-btn');
        const body = card.querySelector('.faq-body');
        
        if (btn && body) {
            btn.addEventListener('click', () => {
                const isActive = card.classList.contains('active');
                
                // Fecha todas as outras perguntas abertas (efeito sanfona)
                faqCards.forEach(c => {
                    if (c !== card && c.classList.contains('active')) {
                        c.classList.remove('active');
                        c.querySelector('.faq-body').style.maxHeight = '0';
                        c.querySelector('.faq-header-btn').setAttribute('aria-expanded', 'false');
                    }
                });
                
                // Alterna o estado do item clicado
                if (isActive) {
                    card.classList.remove('active');
                    body.style.maxHeight = '0';
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    card.classList.add('active');
                    body.style.maxHeight = body.scrollHeight + 'px';
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    // ==========================================
    // 9. FORMULÁRIO DE LEADS & INTEGRAÇÃO WHATSAPP
    // ==========================================
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const numeroDaEmpresa = "5542999164041"; // Número cadastrado
            
            // Captura os dados do formulário
            const nome = document.getElementById('name').value;
            const whatsappDoCliente = document.getElementById('whatsapp').value;
            const situacaoSelect = document.getElementById('status');
            const situacaoTexto = situacaoSelect.options[situacaoSelect.selectedIndex].text;

            const btnSubmit = leadForm.querySelector('.submit-btn');
            const originalText = btnSubmit.textContent;
            
            // Estado visual de carregamento
            btnSubmit.textContent = 'Processando e Abrindo WhatsApp...';
            btnSubmit.disabled = true;
            btnSubmit.style.opacity = '0.8';

            // Monta a mensagem estruturada
            const mensagem = 
                `🚀 *NOVO INTERESSE - PROJETO SAIA DO ALUGUEL* 🚀\n` +
                `----------------------------------\n` +
                `👤 *Nome:* ${nome}\n` +
                `💬 *WhatsApp:* ${whatsappDoCliente}\n` +
                `🏠 *Situação do Terreno:* ${situacaoTexto}\n` +
                `----------------------------------\n` +
                `📲 _Solicitação enviada de forma automatizada pelo site._`;
            
            // Gera a URL do WhatsApp
            const urlWhatsApp = `https://wa.me/${numeroDaEmpresa}?text=${encodeURIComponent(mensagem)}`;

            // Redireciona o usuário
            window.open(urlWhatsApp, '_blank');
            
            // Reseta o estado do formulário
            setTimeout(() => {
                btnSubmit.textContent = originalText;
                btnSubmit.disabled = false;
                btnSubmit.style.opacity = '1';
                leadForm.reset();
            }, 2000);
        });
    }
});
