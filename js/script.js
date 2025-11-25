class GranaZero {
    constructor() {
        this.init();
    }

    init() {
        this.setupLoading();
        this.setupParticles();
        this.setupTheme();
        this.setupNavigation();
        this.setupTypingEffect();
        this.setupCharts();
        this.setupAnimations();
        this.setupCounters();
    }

    setupLoading() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loading').classList.add('hidden');
            }, 1500);
        });
    }

    setupParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 6;
            const duration = Math.random() * 4 + 4;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
        }
    }

    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
        }
        
        this.applyTheme(localStorage.getItem('theme'));
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    setupNavigation() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileNav = document.getElementById('mobileNav');
        const navLinks = document.querySelectorAll('.nav-link');

        mobileToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                mobileNav.classList.remove('active');
                
                target.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
        });
    }

    setupTypingEffect() {
        const typingElement = document.getElementById('typing');
        const words = ['Finanças', 'Economias', 'Investimentos', 'Orçamentos'];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                charIndex--;
            } else {
                charIndex++;
            }

            typingElement.textContent = currentWord.substring(0, charIndex);

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentWord.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        };

        setTimeout(type, 1000);
    }

    setupCharts() {
        this.createHeroChart();
        this.createMainChart();
        this.createPredictionChart();
    }

    createHeroChart() {
        const ctx = document.getElementById('heroChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Alimentação', 'Transporte', 'Entretenimento', 'Estudos', 'Moradia'],
                datasets: [{
                    data: [25, 20, 30, 15, 10],
                    backgroundColor: [
                        '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'
                    ],
                    borderWidth: 0,
                    hoverOffset: 20
                }]
            },
            options: {
                responsive: true,
                cutout: '70%',
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}%`;
                            }
                        }
                    }
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            }
        });
    }

    createMainChart() {
        const ctx = document.getElementById('mainChart3D').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Gastos',
                    data: [120, 190, 130, 170, 220, 280, 190],
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: 'rgba(99, 102, 241, 1)',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeOutQuart'
                }
            }
        });
    }

    createPredictionChart() {
        const ctx = document.getElementById('predictionChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Previsão',
                    data: [1200, 1300, 1250, 1400, 1600, 1550, 1700],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Realizado',
                    data: [1150, 1250, 1300, 1350, 1500, 1450, null],
                    borderColor: '#10b981',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                },
                scales: {
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: 'rgba(255, 255, 255, 0.7)'
                        }
                    }
                }
            }
        });
    }

    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.dashboard-card, .ai-card, .metric-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    setupCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new GranaZero();
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.glass-header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
        header.style.backdropFilter = 'blur(20px)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.8)';
        header.style.backdropFilter = 'blur(20px)';
    }
});