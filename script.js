// Funcionalidades da Landing Page

document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const header = document.querySelector('.header');
    const serviceCheckboxes = document.querySelectorAll('input[name="services"]');
    const contactSelectedServicesBtn = document.getElementById('contact-selected-services');
    const serviceCards = document.querySelectorAll('.service-card');

    // Menu mobile
    if (mobileMenuToggle && nav) {
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            mobileMenuToggle.querySelector('i').classList.toggle('fa-bars');
            mobileMenuToggle.querySelector('i').classList.toggle('fa-times');
        });

        // Fechar menu ao clicar em um link
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                mobileMenuToggle.querySelector('i').classList.add('fa-bars');
                mobileMenuToggle.querySelector('i').classList.remove('fa-times');
            });
        });
    }

    // Header transparente no scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
        }
    });

    // Funcionalidade de seleção de serviços
    function updateSelectedServices() {
        const selectedServices = [];
        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                selectedServices.push(checkbox.value);
            }
        });

        // Atualizar visual dos cards selecionados
        serviceCards.forEach(card => {
            const serviceName = card.getAttribute('data-service');
            const checkbox = card.querySelector('input[type="checkbox"]');
            
            if (checkbox && checkbox.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        });

        // Atualizar botão de contato
        if (selectedServices.length > 0) {
            contactSelectedServicesBtn.style.display = 'inline-flex';
            contactSelectedServicesBtn.textContent = `Falar sobre ${selectedServices.length} serviço${selectedServices.length > 1 ? 's' : ''} selecionado${selectedServices.length > 1 ? 's' : ''}`;
            contactSelectedServicesBtn.innerHTML = `<i class="fab fa-whatsapp"></i> Falar sobre ${selectedServices.length} serviço${selectedServices.length > 1 ? 's' : ''} selecionado${selectedServices.length > 1 ? 's' : ''}`;
        } else {
            contactSelectedServicesBtn.style.display = 'none';
        }

        return selectedServices;
    }

    // Event listeners para checkboxes
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedServices);
    });

    // Event listener para o botão de contato dos serviços selecionados
    contactSelectedServicesBtn.addEventListener('click', function() {
        const selectedServices = updateSelectedServices();
        
        if (selectedServices.length > 0) {
            const servicesText = selectedServices.join(', ');
            const whatsappMessage = encodeURIComponent(
                `Olá! Tenho interesse nos seguintes serviços: ${servicesText}. Gostaria de agendar uma consulta.`
            );
            const whatsappUrl = `https://wa.me/5511999999999?text=${whatsappMessage}`;
            window.open(whatsappUrl, '_blank');
        }
    });

    // Animação de entrada dos elementos
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.service-card, .news-card, .stat, .about-text');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Scroll suave para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Efeito parallax no hero (apenas em desktop)
    if (window.innerWidth > 768) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.hero');
            if (hero) {
                const rate = scrolled * -0.5;
                hero.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    // Contador animado para estatísticas
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '') + (element.textContent.includes('%') ? '%' : '');
            }
        }, 20);
    }

    // Observar estatísticas para animação de contador
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                
                if (number && !statNumber.classList.contains('animated')) {
                    statNumber.classList.add('animated');
                    animateCounter(statNumber, number);
                }
            }
        });
    }, { threshold: 0.5 });

    const stats = document.querySelectorAll('.stat');
    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Inicializar estado dos serviços
    updateSelectedServices();

    // Adicionar classe para cards selecionados no CSS
    const style = document.createElement('style');
    style.textContent = `
        .service-card.selected {
            border-color: var(--accent-color) !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, rgba(212, 175, 55, 0.1) 100%);
            transform: translateY(-5px);
            box-shadow: 0 10px 40px rgba(212, 175, 55, 0.2);
        }
        
        .service-card.selected .service-icon {
            color: var(--accent-color);
            text-shadow: 0 0 20px rgba(212, 175, 55, 0.5);
        }
        
        @media (max-width: 768px) {
            .nav.active {
                display: block;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: rgba(26, 26, 26, 0.98);
                backdrop-filter: blur(10px);
                border-top: 1px solid var(--border-color);
                padding: 1rem 0;
            }
            
            .nav.active ul {
                flex-direction: column;
                gap: 1rem;
                padding: 0 2rem;
            }
        }
    `;
    document.head.appendChild(style);

    // Lazy loading para imagens (se houver)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Feedback visual para formulários (se houver)
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Preloader (opcional)
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    console.log('Landing page carregada com sucesso!');
});

