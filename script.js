
// CONFIGURATION
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE';

// ===================================
// PRELOADER
// ===================================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 300);
    }, 1000);
});

// ===================================
// MOBILE MENU TOGGLE
// ===================================
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
mainContent.addEventListener('click', () => {
    if (window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
    }
});

// ===================================
// SMOOTH SCROLLING & ACTIVE NAV
// ===================================
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Close mobile menu
        if (window.innerWidth <= 1024) {
            sidebar.classList.remove('active');
        }
        
        // Smooth scroll
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Update active nav on scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
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

// ===================================
// COUNTER ANIMATION (About Stats)
// ===================================
const counters = document.querySelectorAll('.stat-number');
const speed = 200;
let counted = false;

const runCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText;
            const increment = target / speed;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target + '+';
            }
        };
        updateCount();
    });
};

// Trigger counter when About section is visible
const aboutSection = document.getElementById('about');
const aboutObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
            runCounters();
            counted = true;
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    aboutObserver.observe(aboutSection);
}

// ===================================
// SKILL BAR ANIMATION
// ===================================
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkills = () => {
    skillBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.width = progress + '%';
    });
};

// Trigger skills animation when Resume section is visible
const resumeSection = document.getElementById('resume');
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkills();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (resumeSection) {
    skillsObserver.observe(resumeSection);
}

// ===================================
// PORTFOLIO FILTER
// ===================================
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        portfolioItems.forEach(item => {
            if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Initialize portfolio items with transition
portfolioItems.forEach(item => {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
});

// ===================================
// CONTACT FORM SUBMISSION
// ===================================
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        timestamp: new Date().toISOString()
    };
    
    // Disable button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    formMessage.style.display = 'none';
    
    try {
        // Send to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        // Show success message
        formMessage.style.display = 'block';
        formMessage.className = 'form-message success';
        formMessage.textContent = '✓ Thank you! Your message has been sent successfully.';
        
        // Reset form
        form.reset();
        
        // Run unit tests
        runContactFormTest(data);
        
    } catch (error) {
        // Show error message
        formMessage.style.display = 'block';
        formMessage.className = 'form-message error';
        formMessage.textContent = '✗ Oops! Something went wrong. Please try again.';
        console.error('Form submission error:', error);
    } finally {
        // Re-enable button
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});

// ===================================
// UNIT TESTING FUNCTIONS
// ===================================

/**
 * Main test runner
 */
function runContactFormTest(data) {
    console.log('🧪 Running Unit Tests...');
    console.log('='.repeat(50));
    
    const tests = {
        testFormDataValidation: testFormDataValidation(data),
        testEmailFormat: testEmailFormat(data.email),
        testRequiredFields: testRequiredFields(data),
        testDataTypes: testDataTypes(data),
        testNameLength: testNameLength(data.name),
        testMessageLength: testMessageLength(data.message)
    };
    
    const results = Object.entries(tests);
    const passed = results.filter(([_, result]) => result.passed).length;
    const total = results.length;
    
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Tests Passed: ${passed}/${total}`);
    console.log(`❌ Tests Failed: ${total - passed}/${total}`);
    console.log('='.repeat(50));
    
    results.forEach(([testName, result]) => {
        if (result.passed) {
            console.log(`✓ ${testName}: PASSED - ${result.message}`);
        } else {
            console.error(`✗ ${testName}: FAILED - ${result.message}`);
        }
    });
    
    console.log('='.repeat(50));
    
    return { passed, total, results: tests };
}

/**
 * Test 1: Validate form data
 */
function testFormDataValidation(data) {
    try {
        if (!data || typeof data !== 'object') {
            return { passed: false, message: 'Data object is invalid' };
        }
        return { passed: true, message: 'Form data validation successful' };
    } catch (error) {
        return { passed: false, message: error.message };
    }
}

/**
 * Test 2: Validate email format
 */
function testEmailFormat(email) {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { passed: false, message: 'Invalid email format' };
        }
        return { passed: true, message: 'Email format is valid' };
    } catch (error) {
        return { passed: false, message: error.message };
    }
}

/**
 * Test 3: Check required fields
 */
function testRequiredFields(data) {
    try {
        const requiredFields = ['name', 'email', 'subject', 'message'];
        for (const field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                return { passed: false, message: `Required field '${field}' is missing` };
            }
        }
        return { passed: true, message: 'All required fields are present' };
    } catch (error) {
        return { passed: false, message: error.message };
    }
}

/**
 * Test 4: Validate data types
 */
function testDataTypes(data) {
    try {
        if (typeof data.name !== 'string' || 
            typeof data.email !== 'string' || 
            typeof data.subject !== 'string' || 
            typeof data.message !== 'string') {
            return { passed: false, message: 'Invalid data types' };
        }
        return { passed: true, message: 'All data types are correct' };
    } catch (error) {
        return { passed: false, message: error.message };
    }
}

/**
 * Test 5: Validate name length
 */
function testNameLength(name) {
    try {
        if (name.length < 2) {
            return { passed: false, message: 'Name too short (min 2 chars)' };
        }
        if (name.length > 100) {
            return { passed: false, message: 'Name too long (max 100 chars)' };
        }
        return { passed: true, message: 'Name length is valid' };
    } catch (error) {
        return { passed: false, message: error.message };
    }
}

/**
 * Test 6: Validate message length
 */
function testMessageLength(message) {
    try {
        if (message.length < 10) {
            return { passed: false, message: 'Message too short (min 10 chars)' };
        }
        if (message.length > 5000) {
            return { passed: false, message: 'Message too long (max 5000 chars)' };
        }
        return { passed: true, message: 'Message length is valid' };
    } catch (error) {
        return { passed: false, message: error.message };
    }
}

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.querySelectorAll('.service-card, .portfolio-item, .blog-card, .timeline-item').forEach(el => {
    fadeObserver.observe(el);
});

// ===================================
// TYPING EFFECT (Optional Enhancement)
// ===================================
const typedTextElement = document.querySelector('.typed-text');
if (typedTextElement) {
    const texts = [
        'Full Stack Developer',
        'UI/UX Designer',
        'Problem Solver',
        'Creative Thinker'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typedTextElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedTextElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    // Start typing effect after page load
    setTimeout(type, 1000);
}

// ===================================
// CONSOLE WELCOME MESSAGE
// ===================================
console.log('%c👋 Welcome to my portfolio!', 'font-size: 20px; color: #ff6b6b; font-weight: bold;');
console.log('%cMicrox Style Portfolio - Built with HTML, CSS & JavaScript', 'font-size: 14px; color: #4ecdc4;');
console.log('%cInterested in the code? Check out the unit tests!', 'font-size: 12px; color: #636e72;');

// ===================================
// EXPORT FOR TESTING (Optional)
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testFormDataValidation,
        testEmailFormat,
        testRequiredFields,
        testDataTypes,
        testNameLength,
        testMessageLength,
        runContactFormTest
    };
}