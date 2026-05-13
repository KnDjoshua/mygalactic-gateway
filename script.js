// Advanced JavaScript for Cosmic Observatory

// ==================== PARTICLE SYSTEM ====================
class StarParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = [];
        this.init();
        this.animate();
    }

    init() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2,
                alpha: Math.random(),
                speed: Math.random() * 0.5
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
            this.ctx.fill();
            
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

// ==================== ADVANCED FACTS DATABASE ====================
const spaceFacts = [
    { text: "The largest known star, UY Scuti, is 1,700 times larger than our Sun!", category: "stars", source: "Astronomy Today" },
    { text: "Venus is the only planet that rotates clockwise in our solar system.", category: "planets", source: "NASA" },
    { text: "A day on Mars is just 37 minutes longer than a day on Earth.", category: "planets", source: "Mars Exploration" },
    { text: "The Hubble Telescope has made over 1.5 million observations since 1990.", category: "missions", source: "ESA" },
    { text: "Black holes can spin at nearly the speed of light!", category: "physics", source: "Astrophysics Journal" },
    { text: "The Milky Way galaxy is on a collision course with Andromeda galaxy.", category: "stars", source: "HubbleSite" },
    { text: "One teaspoon of a neutron star would weigh 10 million tons.", category: "physics", source: "Physics Today" },
    { text: "Jupiter's Great Red Spot is shrinking but still twice Earth's size.", category: "planets", source: "NASA" },
    { text: "The first animal in space was a dog named Laika in 1957.", category: "missions", source: "Space History" },
    { text: "There are more trees on Earth than stars in our galaxy.", category: "physics", source: "Nature" },
    { text: "Saturn's moon Titan has liquid methane lakes and rivers.", category: "planets", source: "Cassini Mission" },
    { text: "The Sun contains 99.86% of all mass in our solar system.", category: "stars", source: "Solar Physics" },
    { text: "Voyager 1 is the farthest human-made object from Earth.", category: "missions", source: "NASA" },
    { text: "A year on Mercury is just 88 Earth days.", category: "planets", source: "Planetary Science" }
];

let currentPage = 0;
const factsPerPage = 6;
let currentFilter = "all";

// ==================== LOADING SCREEN ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }, 2000);
});

// ==================== CUSTOM CURSOR ====================
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorFollower.style.opacity = '1';
});

// Hover effect on clickable elements
const clickables = document.querySelectorAll('button, a, .fact-item, .stat-card, .card-3d');
clickables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// ==================== SCROLL REVEAL ANIMATION ====================
const revealElements = document.querySelectorAll('.reveal');

const revealOnScroll = () => {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// ==================== STATS COUNTER ANIMATION ====================
const animateNumbers = () => {
    const statCards = document.querySelectorAll('.stat-card');
    
    statCards.forEach(card => {
        const target = parseInt(card.getAttribute('data-count'));
        const counter = card.querySelector('.stat-number');
        let current = 0;
        const increment = target / 50;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
};

// Trigger counter when stats section is in view
const statsSection = document.querySelector('.stats-section');
let counted = false;

window.addEventListener('scroll', () => {
    const statsPosition = statsSection.getBoundingClientRect().top;
    if (statsPosition < window.innerHeight - 100 && !counted) {
        animateNumbers();
        counted = true;
    }
});

// ==================== LOAD MORE FACTS ====================
const loadFacts = () => {
    const factsGrid = document.getElementById('factsGrid');
    const filteredFacts = currentFilter === "all" 
        ? spaceFacts 
        : spaceFacts.filter(fact => fact.category === currentFilter);
    
    const start = currentPage * factsPerPage;
    const end = start + factsPerPage;
    const factsToShow = filteredFacts.slice(start, end);
    
    factsToShow.forEach(fact => {
        const factElement = document.createElement('div');
        factElement.className = 'fact-item';
        factElement.style.animation = 'fadeInUp 0.6s ease';
        factElement.innerHTML = `
            <div class="fact-category">${fact.category}</div>
            <div class="fact-text">${fact.text}</div>
            <div class="fact-source">📖 ${fact.source}</div>
        `;
        factsGrid.appendChild(factElement);
    });
    
    if (end >= filteredFacts.length) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    }
};

// Reset facts display
const resetFacts = () => {
    currentPage = 0;
    document.getElementById('factsGrid').innerHTML = '';
    document.getElementById('loadMoreBtn').style.display = 'block';
    loadFacts();
};

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        resetFacts();
    });
});

// Load more button
document.getElementById('loadMoreBtn').addEventListener('click', () => {
    currentPage++;
    loadFacts();
});

// Initial load
resetFacts();

// ==================== RANDOM FACT BUTTON ====================
document.getElementById('factBtn').addEventListener('click', () => {
    const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
    alert(`🌟 Random Space Discovery:\n\n${randomFact.text}\n\nSource: ${randomFact.source}`);
    
    // Smooth scroll to facts section
    document.getElementById('facts').scrollIntoView({ behavior: 'smooth' });
});

// Explore button
document.getElementById('exploreBtn').addEventListener('click', () => {
    document.getElementById('facts').scrollIntoView({ behavior: 'smooth' });
});

// ==================== FORM HANDLING WITH AJAX ====================
const contactForm = document.getElementById('advancedContactForm');
const formFeedback = document.getElementById('formFeedback');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Generate random CAPTCHA
        const captchaInput = document.getElementById('captcha');
        const captchaQuestion = document.getElementById('captchaQuestion');
        const expectedAnswer = 8; // 5+3=8
        
        if (parseInt(captchaInput.value) !== expectedAnswer) {
            formFeedback.innerHTML = '<div class="form-message error">❌ Incorrect CAPTCHA. Please try again.</div>';
            return;
        }
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch('contact.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.text();
            formFeedback.innerHTML = result;
            
            if (result.includes('success') || result.includes('Thanks')) {
                contactForm.reset();
                setTimeout(() => {
                    formFeedback.innerHTML = '';
                }, 5000);
            }
        } catch (error) {
            formFeedback.innerHTML = '<div class="form-message error">❌ Connection error. Please try again.</div>';
        }
    });
}

// ==================== 3D TILT EFFECT ON CARDS ====================
const cards3d = document.querySelectorAll('.card-3d');
cards3d.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
});

// ==================== PARALLAX SCROLL EFFECT ====================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ==================== NAVIGATION ACTIVE LINK ====================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ==================== MOBILE MENU ====================
const navToggle = document.querySelector('.nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        navToggle.classList.toggle('active');
    });
}

// ==================== SMOOTH SCROLLING ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            // Close mobile menu if open
            if (navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
            }
        }
    });
});

// ==================== INITIALIZE PARTICLE SYSTEM ====================
const canvas = document.getElementById('starCanvas');
if (canvas) {
    const particleSystem = new StarParticleSystem(canvas);
    window.addEventListener('resize', () => particleSystem.resize());
}

// ==================== GLASS NAVIGATION SCROLL EFFECT ====================
const glassNav = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        glassNav.classList.add('scrolled');
    } else {
        glassNav.classList.remove('scrolled');
    }
});

// ==================== ADD TYPING EFFECT TO HERO ====================
const heroTitle = document.querySelector('.glitch-text');
if (heroTitle) {
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    let i = 0;
    
    const typeWriter = () => {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    setTimeout(typeWriter, 500);
}

console.log('🚀 Cosmic Observatory fully loaded! Advanced features active.');