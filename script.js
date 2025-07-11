document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    // Función para actualizar enlaces activos
    function updateActiveLinks(activeSection) {
        // Actualizar enlaces del sidebar
        navLinks.forEach(link => link.classList.remove('active'));
        const sidebarActiveLink = document.querySelector(`.nav-link[href="#${activeSection}"]`);
        sidebarActiveLink?.classList.add('active');

        // Actualizar enlaces de la barra flotante móvil
        mobileNavLinks.forEach(link => link.classList.remove('active'));
        const mobileActiveLink = document.querySelector(`.mobile-nav-link[data-section="${activeSection}"]`);
        mobileActiveLink?.classList.add('active');
    }

    // Función para manejar la navegación
    function handleNavigation(event, sectionId) {
        event.preventDefault();

        // Quitar la clase 'active' de todas las secciones
        contentSections.forEach(section => section.classList.remove('active'));

        // Mostrar la sección de contenido correspondiente
        const targetSection = document.querySelector(sectionId);
        targetSection?.classList.add('active');
        
        // Actualizar enlaces activos
        const sectionName = sectionId.replace('#', '');
        updateActiveLinks(sectionName);

        // Scroll suave hacia la sección
        targetSection?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Event listeners para todos los enlaces de navegación
    [...navLinks, ...mobileNavLinks].forEach(link => {
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

    // Funcionalidad del formulario de contacto
    const contactForm = document.querySelector('.contact-form');
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtener los datos del formulario
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        
        // Cambiar el texto del botón para mostrar que se está procesando
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Enviar a Google Forms
        sendToGoogleForms(name, email, subject, message)
            .then(() => {
                showMessage('success', '¡Mensaje enviado exitosamente! Te contactaré pronto.');
                this.reset();
            })
            .catch(() => {
                showMessage('error', 'Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
    });

    // Función para enviar datos a Google Forms
    async function sendToGoogleForms(name, email, subject, message) {
        const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd_f6RjqXVTMzqr95M0TaS53spkL4wOcAxLqB-wsts6g3696g/formResponse';
        
        const FORM_FIELDS = {
            name: 'entry.199653076',
            email: 'entry.2001999814',
            subject: 'entry.980476970',
            message: 'entry.1210882179'
        };

        const formData = new FormData();
        formData.append(FORM_FIELDS.name, name);
        formData.append(FORM_FIELDS.email, email);
        formData.append(FORM_FIELDS.subject, subject);
        formData.append(FORM_FIELDS.message, message);

        return fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        });
    }

    // Función unificada para mostrar mensajes
    function showMessage(type, text) {
        const icons = {
            success: '<polyline points="20,6 9,17 4,12"></polyline>',
            error: '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
        };

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    ${icons[type]}
                </svg>
                <span>${text}</span>
            </div>
        `;
        
        const contactFormContainer = document.querySelector('.contact-form-container');
        const contactForm = document.querySelector('.contact-form');
        
        // Remover mensaje anterior si existe
        const existingMessage = contactFormContainer.querySelector('.form-message');
        existingMessage?.remove();
        
        // Insertar el nuevo mensaje antes del formulario
        contactFormContainer.insertBefore(messageDiv, contactForm);
        
        // Scroll suave hacia el mensaje
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Remover el mensaje después de 8 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.style.opacity = '0';
                messageDiv.style.transform = 'translateY(-10px)';
                setTimeout(() => messageDiv.remove(), 300);
            }
        }, 8000);
    }
});