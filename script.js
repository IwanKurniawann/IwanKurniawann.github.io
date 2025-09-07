document.addEventListener('DOMContentLoaded', () => {
    // [REVISI KEAMANAN] Obfuscate (samarkan) info kontak untuk mencegah scraping oleh bot sederhana.
    // Bot akan melihat href="#" pada HTML awal, dan JavaScript akan mengisinya untuk pengguna.
    const contactInfo = {
        email: 'iwankurniawans@outlook.com',
        whatsapp: '+6282277984180'
    };

    const contactBtnNav = document.getElementById('contact-button-nav');
    const contactBtnMain = document.getElementById('contact-button-main');
    const whatsappLink = document.getElementById('whatsapp-link');

    if (contactBtnNav) {
        contactBtnNav.setAttribute('href', `mailto:${contactInfo.email}`);
    }
    if (contactBtnMain) {
        contactBtnMain.setAttribute('href', `mailto:${contactInfo.email}`);
    }
    if (whatsappLink) {
        whatsappLink.setAttribute('href', `https://wa.me/${contactInfo.whatsapp}`);
    }

    // Panggil lucide.createIcons() setelah DOM siap dan setelah potensi modifikasi.
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // --- Script untuk Navbar & Animasi Scroll ---
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('bg-white/90', 'backdrop-blur-sm', 'shadow-md');
            } else {
                navbar.classList.remove('bg-white/90', 'backdrop-blur-sm', 'shadow-md');
            }
        });
    }

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const activateNavLink = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.pageYOffset >= sectionTop - 100) {
                currentSection = section.getAttribute('id');
            }
        });
        
        if (!currentSection && window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            currentSection = 'contact';
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if(link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateNavLink);
    activateNavLink();

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section-fade-in').forEach(section => {
        observer.observe(section);
    });

    // --- Script untuk Testimonial Slider ---
    const track = document.getElementById('testimonial-track');
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.getElementById('nextBtn');
        const prevButton = document.getElementById('prevBtn');
        const dotsContainer = document.getElementById('dots-container');

        if (slides.length > 0) {
            let slideWidth = slides[0].getBoundingClientRect().width;
        
            slides.forEach((_, index) => {
                const button = document.createElement('button');
                button.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
                button.classList.add('dot', 'w-3', 'h-3', 'bg-slate-300', 'rounded-full', 'transition-colors', 'duration-300');
                if (index === 0) {
                    button.classList.remove('bg-slate-300');
                    button.classList.add('bg-blue-600');
                }
                button.addEventListener('click', () => {
                    moveToSlide(index);
                    resetInterval();
                });
                dotsContainer.appendChild(button);
            });
            const dots = Array.from(dotsContainer.children);

            let currentIndex = 0;

            const moveToSlide = (targetIndex) => {
                if (!track) return;
                track.style.transform = `translateX(-${slideWidth * targetIndex}px)`;
                
                dots.forEach((dot, index) => {
                    dot.classList.toggle('bg-blue-600', index === targetIndex);
                    dot.classList.toggle('bg-slate-300', index !== targetIndex);
                });

                currentIndex = targetIndex;
            };
            
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
                    moveToSlide(prevIndex);
                    resetInterval();
                });
            }

            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    const nextIndex = (currentIndex + 1) % slides.length;
                    moveToSlide(nextIndex);
                    resetInterval();
                });
            }

            let slideInterval;
            const startInterval = () => {
                slideInterval = setInterval(() => {
                    const nextIndex = (currentIndex + 1) % slides.length;
                    moveToSlide(nextIndex);
                }, 7000);
            };
            
            const resetInterval = () => {
                clearInterval(slideInterval);
                startInterval();
            };

            startInterval();
            
            window.addEventListener('resize', () => {
                if (slides.length > 0) {
                    slideWidth = slides[0].getBoundingClientRect().width;
                    track.style.transition = 'none';
                    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
                    setTimeout(() => {
                        track.style.transition = 'transform 0.5s ease-in-out';
                    }, 50);
                }
            });
        }
    }
});
