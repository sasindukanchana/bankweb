document.addEventListener('DOMContentLoaded', () => {
    // --- Sticky Header & Scroll Spy ---
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Sticky Header class
        if (window.scrollY > 50) {
            header.style.boxShadow = 'var(--shadow-md)';
            header.style.background = 'rgba(255, 255, 255, 0.95)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
            header.style.background = 'rgba(255, 255, 255, 0.85)';
        }

        // Active Nav Link highlight on scroll
        let currentSection = '';
        sections.forEach(sec => {
            const secTop = sec.offsetTop - 120;
            const secHeight = sec.offsetHeight;
            if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
                currentSection = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // --- Mobile Navigation Menu ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    mobileMenuBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (navMenu.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Close mobile menu on nav-link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });

    // --- Hero Slider / Carousel ---
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.control-btn.prev');
    const nextBtn = document.querySelector('.control-btn.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    if (slides.length > 0) {
        // Initial setup
        showSlide(currentSlide);
        
        // Auto slide change
        startSlideShow();

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideShow();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideShow();
        });
    }

    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 6000);
    }

    function resetSlideShow() {
        clearInterval(slideInterval);
        startSlideShow();
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Animated Stats Counters ---
    const statsSection = document.querySelector('.stats-section');
    const statNums = document.querySelectorAll('.stat-num');
    let countersStarted = false;

    function startCounters() {
        statNums.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000; // 2 seconds
            const stepTime = Math.max(Math.floor(duration / 100), 15);
            let current = 0;
            const increment = target / (duration / stepTime);

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    stat.textContent = target.toLocaleString();
                } else {
                    stat.textContent = Math.floor(current).toLocaleString();
                }
            }, stepTime);
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersStarted) {
                countersStarted = true;
                startCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // --- Interactive Loan Calculator ---
    const loanAmountInput = document.getElementById('calc-amount');
    const loanAmountVal = document.getElementById('amount-val');
    const loanRateInput = document.getElementById('calc-rate');
    const loanRateVal = document.getElementById('rate-val');
    const loanTenureSelect = document.getElementById('calc-tenure');

    const emiResult = document.getElementById('emi-result');
    const interestResult = document.getElementById('interest-result');
    const totalResult = document.getElementById('total-result');

    function calculateLoan() {
        if (!loanAmountInput) return;
        const principal = parseFloat(loanAmountInput.value);
        const annualRate = parseFloat(loanRateInput.value);
        const years = parseInt(loanTenureSelect.value, 10);

        // Update displays
        loanAmountVal.textContent = 'Rs. ' + principal.toLocaleString();
        loanRateVal.textContent = annualRate + '%';

        // Math
        const monthlyRate = (annualRate / 12) / 100;
        const totalMonths = years * 12;

        let monthlyPayment = 0;
        if (monthlyRate === 0) {
            monthlyPayment = principal / totalMonths;
        } else {
            monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
        }

        const totalRepayment = monthlyPayment * totalMonths;
        const totalInterest = totalRepayment - principal;

        // Render Results
        emiResult.textContent = 'Rs. ' + Math.round(monthlyPayment).toLocaleString();
        interestResult.textContent = 'Rs. ' + Math.round(totalInterest).toLocaleString();
        totalResult.textContent = 'Rs. ' + Math.round(totalRepayment).toLocaleString();
    }

    if (loanAmountInput) {
        loanAmountInput.addEventListener('input', calculateLoan);
        loanRateInput.addEventListener('input', calculateLoan);
        loanTenureSelect.addEventListener('change', calculateLoan);
        
        // Initial execution
        calculateLoan();
    }

    // --- Testimonials Slider ---
    const testSlides = document.querySelectorAll('.testimonial-slide');
    const testDotsContainer = document.querySelector('.test-controls');
    let currentTestSlide = 0;

    if (testSlides.length > 0 && testDotsContainer) {
        // Generate dots
        testSlides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = `test-dot ${idx === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => showTestimonial(idx));
            testDotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.test-dot');

        function showTestimonial(index) {
            testSlides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));

            currentTestSlide = index;
            testSlides[currentTestSlide].classList.add('active');
            dots[currentTestSlide].classList.add('active');

            // Slide translation
            const track = document.querySelector('.testimonial-track');
            track.style.transform = `translateX(-${currentTestSlide * 100}%)`;
        }

        // Automatic interval for testimonials
        setInterval(() => {
            let nextIndex = (currentTestSlide + 1) % testSlides.length;
            showTestimonial(nextIndex);
        }, 5000);
    }

    // --- Modals Controller (Quick Menu items) ---
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.modal-close-btn');

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock scrolling
        }
    }

    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            closeModal(e.target.closest('.modal'));
        });
    });

    // Close modal on background click
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Connect Quick Menu links to Modals
    const quickLinks = document.querySelectorAll('.dropdown-item');
    quickLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const action = link.getAttribute('data-action');
            if (action === 'products') {
                openModal('products-modal');
            } else if (action === 'branches') {
                openModal('branches-modal');
            } else if (action === 'projects') {
                openModal('projects-modal');
            } else if (action === 'chatbot') {
                toggleChatbot(true);
            }
        });
    });

    // --- Floating Online Assistant Chatbot ---
    const chatbotWidget = document.getElementById('chatbot');
    const chatBtn = document.querySelector('.chatbot-btn');
    const chatWindow = document.querySelector('.chat-window');
    const chatCloseBtn = document.querySelector('.chat-close-btn');
    const chatBody = document.querySelector('.chat-body');
    const chatInput = document.querySelector('.chat-input');
    const chatSendBtn = document.querySelector('.chat-send-btn');
    const chatNotification = chatBtn.querySelector('.badge');

    function toggleChatbot(forceOpen = false) {
        if (forceOpen) {
            chatWindow.classList.add('active');
            chatNotification.style.display = 'none';
        } else {
            chatWindow.classList.toggle('active');
            if (chatWindow.classList.contains('active')) {
                chatNotification.style.display = 'none';
            }
        }
        if (chatWindow.classList.contains('active')) {
            chatInput.focus();
        }
    }

    if (chatBtn) {
        chatBtn.addEventListener('click', () => toggleChatbot());
        chatCloseBtn.addEventListener('click', () => toggleChatbot(false));
    }

    // Send messages
    function appendMessage(text, sender) {
        const msg = document.createElement('div');
        msg.className = `chat-msg chat-msg-${sender}`;
        msg.textContent = text;
        chatBody.appendChild(msg);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg chat-msg-bot typing-indicator';
        typing.innerHTML = '<span style="opacity:0.6">Assistant is typing...</span>';
        chatBody.appendChild(typing);
        chatBody.scrollTop = chatBody.scrollHeight;
        return typing;
    }

    function processBotReply(userMsg) {
        const cleanMsg = userMsg.toLowerCase().trim();
        const indicator = showTypingIndicator();

        setTimeout(() => {
            indicator.remove();
            let reply = "I am sorry, I did not catch that. Please type 'loans', 'deposits', 'branches', or 'contact' for instant assistance!";

            if (cleanMsg.includes('loan') || cleanMsg.includes('naya')) {
                reply = "Wealth Co-Op offers tailored Loan Products, including: 1. Personal & Business Loans, 2. Gold Loans (රන් ණය) with low interest rates, 3. Daily Deposit Loans for micro-business. Call us at +94 112 081 281 for quick approval!";
            } else if (cleanMsg.includes('deposit') || cleanMsg.includes('thampathu') || cleanMsg.includes('rate') || cleanMsg.includes('interest')) {
                reply = "Our deposit options include: 1. Fixed Deposits (highest security and high interest rates), 2. Minor Savings (ළමා ගිණුම්), 3. Daily Deposit Accounts. Interest rates go up to 14% p.a. depending on terms.";
            } else if (cleanMsg.includes('branch') || cleanMsg.includes('location') || cleanMsg.includes('office') || cleanMsg.includes('place')) {
                reply = "Our main office is at: 251/41, Kirula Rd, Narahenpita, Colombo 05. We also have active branches in Gampaha, Galle, and Kandy. Type 'contact' to get call details.";
            } else if (cleanMsg.includes('contact') || cleanMsg.includes('phone') || cleanMsg.includes('number') || cleanMsg.includes('email') || cleanMsg.includes('mail')) {
                reply = "You can contact Wealth Co-Op support at: Phone: +94 112 081 281 | Email: info@wealthcoop.lk. We are open Mon - Sat from 8:30 AM to 5:00 PM.";
            } else if (cleanMsg.includes('hello') || cleanMsg.includes('hi') || cleanMsg.includes('hey') || cleanMsg.includes('halow')) {
                reply = "Hello! Welcome to Wealth Co-Op Online Assistant. How can I help you today? You can ask about our loans, deposits, rates or branch locations.";
            }

            appendMessage(reply, 'bot');
        }, 1000);
    }

    function sendMessage() {
        const txt = chatInput.value.trim();
        if (txt === '') return;
        
        appendMessage(txt, 'user');
        chatInput.value = '';
        processBotReply(txt);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Quick Replies buttons
    const quickReplyBtns = document.querySelectorAll('.quick-reply-btn');
    quickReplyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const query = btn.textContent;
            appendMessage(query, 'user');
            processBotReply(query);
        });
    });
});
