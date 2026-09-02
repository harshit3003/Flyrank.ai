import { validateField } from './validation.js';

document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Form interaction logic
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const submitBtn = document.getElementById('submit-btn');
        const inputs = contactForm.querySelectorAll('input, textarea');

        const applyValidationState = (input) => {
            const errorElement = document.getElementById(`${input.id}-error`);
            const { isValid, errorMessage } = validateField(input);

            if (!isValid) {
                input.setAttribute('aria-invalid', 'true');
                errorElement.textContent = errorMessage;
            } else {
                input.setAttribute('aria-invalid', 'false');
                errorElement.textContent = '';
            }

            return isValid;
        };

        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => applyValidationState(input));
            
            // Re-validate on input if already marked invalid
            input.addEventListener('input', () => {
                if (input.getAttribute('aria-invalid') === 'true') {
                    applyValidationState(input);
                }
            });
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            inputs.forEach(input => {
                if (!applyValidationState(input)) {
                    isFormValid = false;
                }
            });

            if (!isFormValid) {
                return;
            }

            // Simulate network request
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                // Simulate an API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                // Show success state
                alert('Message sent successfully!');
                contactForm.reset();
            } catch (error) {
                alert('Failed to send message.');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                submitBtn.textContent = 'Contact Me';
            }
        });
    }

    // --- Animations and Scroll Observers --- //

    // 1. Dynamic Reveal Classes
    const elementsToReveal = document.querySelectorAll('.reveal');
    
    // Add active class immediately so all content is unconditionally visible
    elementsToReveal.forEach(el => {
        el.classList.add('reveal');
        el.classList.add('active');
    });

    // Intersection Observer for Reveal
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    elementsToReveal.forEach(el => {
        revealObserver.observe(el);
    });

    // 2. Active Navigation Tracking
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserverOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is around middle of viewport
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, navObserverOptions);

    sections.forEach(section => {
        navObserver.observe(section);
    });

    // 3. Role Rotator
    const roleRotator = document.querySelector('.role-rotator');
    const roles = ["C++ Developer", "Python Developer", "Full-Stack Developer", "AI/ML Learner"];
    let roleIndex = 0;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (roleRotator && !prefersReducedMotion) {
        setInterval(() => {
            roleRotator.classList.add('fade-out');
            setTimeout(() => {
                roleIndex = (roleIndex + 1) % roles.length;
                roleRotator.textContent = roles[roleIndex];
                roleRotator.classList.remove('fade-out');
                roleRotator.classList.add('fade-in');
                
                setTimeout(() => {
                    roleRotator.classList.remove('fade-in');
                }, 400); // Matches CSS transition duration
            }, 400); // Wait for fade out
        }, 3000); // Swap every 3 seconds
    }

    // 4. Scroll Progress
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress && !prefersReducedMotion) {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
                    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                    const scrolled = (winScroll / height) * 100;
                    scrollProgress.style.width = scrolled + "%";
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // 5. Timeline Case Study Beats
    const timelineBeats = document.querySelectorAll('.case-study-beat');
    if (timelineBeats.length > 0) {
        const timelineOptions = {
            root: null,
            rootMargin: '-30% 0px -50% 0px',
            threshold: 0
        };

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-beat');
                } else {
                    entry.target.classList.remove('active-beat');
                }
            });
        }, timelineOptions);

        timelineBeats.forEach(beat => timelineObserver.observe(beat));
    }
});