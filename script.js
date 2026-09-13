document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    const siteHeader = document.getElementById("siteHeader");
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");
    const currentYear = document.getElementById("currentYear");

    /*
     * Mobile navigation
     */
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", () => {
            const isActive = mainNav.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isActive)
            );
        });

        const navLinks = mainNav.querySelectorAll("a");

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                mainNav.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );
            });
        });
    }

    /*
     * Header effect on scroll
     */
    const updateHeader = () => {
        if (!siteHeader) {
            return;
        }

        if (window.scrollY > 40) {
            siteHeader.classList.add("scrolled");
        } else {
            siteHeader.classList.remove("scrolled");
        }
    };

    updateHeader();

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    /*
     * Reveal animations
     */
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("visible");

                    observerInstance.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("visible");
        });
    }

    /*
     * Contact form demonstration
     */
    if (contactForm && formMessage) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const messageInput = document.getElementById("message");

            const name = nameInput
                ? nameInput.value.trim()
                : "";

            const email = emailInput
                ? emailInput.value.trim()
                : "";

            const message = messageInput
                ? messageInput.value.trim()
                : "";

            if (!name || !email || !message) {
                formMessage.textContent =
                    "Preencha todos os campos antes de enviar.";

                return;
            }

            formMessage.textContent =
                `Obrigado, ${name}! Esta é uma demonstração do formulário.`;

            contactForm.reset();
        });
    }

    /*
     * Current year
     */
    if (currentYear) {
        currentYear.textContent =
            String(new Date().getFullYear());
    }

    /*
     * Hero visual interaction
     */
    const hero = document.querySelector(".hero");
    const heroVisual = document.querySelector(".hero-visual");

    if (
        hero &&
        heroVisual &&
        window.matchMedia("(pointer: fine)").matches
    ) {
        hero.addEventListener("mousemove", (event) => {
            const rect = hero.getBoundingClientRect();

            const x =
                (event.clientX - rect.left) /
                rect.width -
                0.5;

            const y =
                (event.clientY - rect.top) /
                rect.height -
                0.5;

            heroVisual.style.transform =
                `translate(${x * 8}px, ${y * 8}px)`;
        });

        hero.addEventListener("mouseleave", () => {
            heroVisual.style.transform =
                "translate(0, 0)";
        });
    }

    /*
     * Close mobile menu when resizing
     */
    window.addEventListener("resize", () => {
        if (
            window.innerWidth > 760 &&
            mainNav &&
            menuToggle
        ) {
            mainNav.classList.remove("active");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    });
});