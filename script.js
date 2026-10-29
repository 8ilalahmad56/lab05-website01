/**
 * Bilal Ahmad - Computer Science Portfolio & CV
 * Interactive Scrolling, Scroll Spy, Live Project Demos & UI Engine
 * Qureshi University, Lahore
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const header = document.querySelector('header');
  const scrollProgressBar = document.getElementById('scroll-progress');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const contactForm = document.getElementById('contact-form');
  const downloadCvBtns = document.querySelectorAll('[data-action="download-cv"]');
  const flashcardElement = document.getElementById('interactive-flashcard');

  /**
   * 1. Dynamic Scroll Progress Bar & Header Glass Effect
   */
  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Top Progress Bar
    if (scrollProgressBar) {
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, scrollPercent))}%`;
    }

    // Header glass elevation
    if (header) {
      if (scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Floating Back-to-Top Button Visibility
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Update Active Navigation Item (Scroll Spy)
    updateActiveNav();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial invocation

  /**
   * 2. Scroll Spy: Active Section Navigation Highlight
   */
  function updateActiveNav() {
    const headerHeight = header ? header.offsetHeight : 68;
    const scrollPosition = (window.scrollY || window.pageYOffset) + headerHeight + 60;

    let currentSectionId = '';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    // Handle end-of-page contact section
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 60) {
      currentSectionId = 'contact';
    }

    // Default to about when near top
    if (!currentSectionId && window.scrollY < 300) {
      currentSectionId = 'about';
    }

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const targetId = href.substring(1);
      const isMatch = targetId === currentSectionId;

      if (isMatch) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /**
   * 3. Smooth Anchor Scrolling with Header Height Offset
   */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '') return;

      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 68;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });

        // Close mobile drawer if open
        if (mobileNav && mobileNav.classList.contains('open')) {
          closeMobileNav();
        }

        // Update browser URL hash without jumping
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });

  /**
   * 4. Floating Back-to-Top Button Click
   */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /**
   * 5. Responsive Mobile Drawer Navigation
   */
  function toggleMobileNav() {
    if (!mobileNav) return;
    const isOpen = mobileNav.classList.contains('open');
    if (isOpen) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function openMobileNav() {
    mobileNav.classList.add('open');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'close';
    }
  }

  function closeMobileNav() {
    mobileNav.classList.remove('open');
    if (mobileMenuBtn) {
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
      const icon = mobileMenuBtn.querySelector('.material-symbols-outlined');
      if (icon) icon.textContent = 'menu';
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileNav);
  }

  // Auto-close on click outside
  document.addEventListener('click', (e) => {
    if (
      mobileNav &&
      mobileNav.classList.contains('open') &&
      !mobileNav.contains(e.target) &&
      mobileMenuBtn &&
      !mobileMenuBtn.contains(e.target)
    ) {
      closeMobileNav();
    }
  });

  /**
   * 6. Download CV / Print Actions
   */
  downloadCvBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.print();
    });
  });

  /**
   * 7. Interactive Skill Bar Animation
   */
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  if ('IntersectionObserver' in window && skillBars.length > 0) {
    const skillsObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            skillBars.forEach((bar) => {
              const targetWidth = bar.getAttribute('data-width') || bar.style.width;
              bar.style.width = '0%';
              setTimeout(() => {
                bar.style.width = targetWidth;
              }, 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
      skillsObserver.observe(skillsSection);
    }
  }

  /**
   * 8. Interactive Flashcard Demo (Project Feature Preview)
   */
  if (flashcardElement) {
    flashcardElement.addEventListener('click', () => {
      flashcardElement.classList.toggle('flipped');
    });
  }

  /**
   * 9. Interactive Contact Form Submission & Feedback
   */
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const subjectInput = document.getElementById('contact-subject');
      const messageInput = document.getElementById('contact-message');
      const feedback = document.getElementById('form-feedback');
      const submitBtn = document.getElementById('submit-btn');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const subject = subjectInput ? subjectInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!name || !email || !subject || !message) {
        if (feedback) {
          feedback.className = 'p-3.5 rounded-xl text-xs font-medium bg-red-950/80 border border-red-500/50 text-red-200 block';
          feedback.innerText = '⚠️ Please fill out all required fields before sending.';
          feedback.classList.remove('hidden');
        }
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (feedback) {
          feedback.className = 'p-3.5 rounded-xl text-xs font-medium bg-red-950/80 border border-red-500/50 text-red-200 block';
          feedback.innerText = '⚠️ Please enter a valid email address.';
          feedback.classList.remove('hidden');
        }
        return;
      }

      // Submitting State
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined text-[18px] animate-spin">refresh</span>
          <span>Preparing Message...</span>
        `;
      }

      setTimeout(() => {
        if (feedback) {
          feedback.className = 'p-3.5 rounded-xl text-xs font-medium bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 block';
          feedback.innerHTML = `✅ Thank you, <strong>${escapeHtml(name)}</strong>! Launching your email client to send your message directly to Bilal Ahmad.`;
          feedback.classList.remove('hidden');
        }

        const mailtoUrl = `mailto:bilal.ahmad.cs@gmail.com?subject=${encodeURIComponent(`[Portfolio Inquiry] ${subject} - from ${name}`)}&body=${encodeURIComponent(`Hi Bilal,\n\nMy name is ${name} (${email}).\n\n${message}\n\nBest regards,\n${name}`)}`;

        window.location.href = mailtoUrl;

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span class="material-symbols-outlined text-[18px]">done_all</span>
            <span>Message Prepared</span>
          `;
        }
      }, 500);
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }
});
