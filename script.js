document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const mobileNavBar = document.getElementById('mobileNavBar');

    // Función para alternar el menú móvil
    function toggleMobileMenu() {
        mobileMenuToggle.classList.toggle('active');
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        
        // Controlar visibilidad de la barra flotante
        if (mobileNavBar) {
            mobileNavBar.classList.toggle('hidden', sidebar.classList.contains('active'));
        }
        
        // Cambiar el aria-label para accesibilidad
        const isOpen = sidebar.classList.contains('active');
        mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
        
        // Prevenir scroll del body cuando el menú está abierto
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    // Función para cerrar el menú móvil
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        if (mobileNavBar) {
            mobileNavBar.classList.remove('hidden');
        }
        mobileMenuToggle.setAttribute('aria-label', 'Abrir menú');
        document.body.style.overflow = '';
    }

    // Función para actualizar enlaces activos
    function updateActiveLinks(activeSection) {
        // Actualizar enlaces del sidebar
        navLinks.forEach(link => link.classList.remove('active'));
        const sidebarActiveLink = document.querySelector(`.nav-link[href="#${activeSection}"]`);
        if (sidebarActiveLink) {
            sidebarActiveLink.classList.add('active');
        }

        // Actualizar enlaces de la barra flotante móvil
        mobileNavLinks.forEach(link => link.classList.remove('active'));
        const mobileActiveLink = document.querySelector(`.mobile-nav-link[data-section="${activeSection}"]`);
        if (mobileActiveLink) {
            mobileActiveLink.classList.add('active');
        }
    }

    // Event listeners para el menú móvil
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    sidebarOverlay.addEventListener('click', closeMobileMenu);

    // Cerrar menú al presionar Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Cerrar menú al cambiar de tamaño de ventana (si se agranda)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    // Función para manejar la navegación
    function handleNavigation(event, sectionId) {
        event.preventDefault();

        // Quitar la clase 'active' de todas las secciones
        contentSections.forEach(section => section.classList.remove('active'));

        // Mostrar la sección de contenido correspondiente
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Actualizar enlaces activos
            const sectionName = sectionId.replace('#', '');
            updateActiveLinks(sectionName);

            // Cerrar el menú móvil si está abierto
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }

            // Scroll suave hacia la sección
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    // Event listeners para enlaces del sidebar
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const sectionId = this.getAttribute('href');
            handleNavigation(event, sectionId);
        });
    });

    // Event listeners para enlaces de la barra flotante móvil
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const sectionId = this.getAttribute('href');
            handleNavigation(event, sectionId);
        });
    });

    // Observador para actualizar la navegación basada en el scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                updateActiveLinks(id);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
    });

    // Observar todas las secciones
    contentSections.forEach(section => {
        observer.observe(section);
    });
});