document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const sidebar = document.getElementById('sidebar');
    const mobileNavBar = document.getElementById('mobileNavBar');
    const curriculumBtn = document.getElementById('curriculumBtn');

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

    // Función para manejar el botón de curriculum
    if (curriculumBtn) {
        curriculumBtn.addEventListener('click', function(event) {
            event.preventDefault();
            
            // Abrir el CV de Google Drive en una nueva pestaña
            const cvUrl = 'https://drive.google.com/file/d/1tuRF8nT6NqoxLlsUQ-ap47_snoidbWqb/view?usp=drive_link';
            window.open(cvUrl, '_blank');
            
            // Feedback visual opcional
            const originalHTML = this.innerHTML;
            this.style.opacity = '0.7';
            this.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Abriendo...';
            
            setTimeout(() => {
                this.style.opacity = '1';
                this.innerHTML = originalHTML;
            }, 1500);
        });
    }

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

    // Funcionalidad del formulario de contacto con Google Forms
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
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
                    // Mostrar mensaje de éxito
                    showSuccessMessage();
                    
                    // Limpiar el formulario
                    this.reset();
                })
                .catch((error) => {
                    console.error('Error al enviar el formulario:', error);
                    showErrorMessage();
                })
                .finally(() => {
                    // Restaurar el botón
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    // Función para enviar datos a Google Forms
    async function sendToGoogleForms(name, email, subject, message) {
        const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSd_f6RjqXVTMzqr95M0TaS53spkL4wOcAxLqB-wsts6g3696g/formResponse';
        
        const FORM_FIELDS = {
            name: 'entry.199653076',
            email: 'entry.2001999814',
            subject: 'entry.980476970',
            message: 'entry.1210882179'
        };

        console.log('📤 Enviando datos a Google Forms:', { name, email, subject, message });

        // Crear los datos para enviar
        const formData = new FormData();
        formData.append(FORM_FIELDS.name, name);
        formData.append(FORM_FIELDS.email, email);
        formData.append(FORM_FIELDS.subject, subject);
        formData.append(FORM_FIELDS.message, message);

        try {
            console.log('🚀 Iniciando envío a:', GOOGLE_FORM_URL);
            
            // Enviar los datos usando fetch con modo no-cors
            const response = await fetch(GOOGLE_FORM_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });
            
            console.log('✅ Envío completado - modo no-cors siempre devuelve éxito');
            
            // Con modo no-cors, siempre consideramos que fue exitoso
            // porque no podemos leer la respuesta real
            return Promise.resolve();
        } catch (error) {
            console.error('❌ Error en el envío:', error);
            return Promise.reject(error);
        }
    }

    // Función para mostrar mensaje de éxito
    function showSuccessMessage() {
        console.log('✅ Mostrando mensaje de éxito');
        
        const successDiv = document.createElement('div');
        successDiv.className = 'form-message success';
        successDiv.innerHTML = `
            <div class="message-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20,6 9,17 4,12"></polyline>
                </svg>
                <span>¡Mensaje enviado exitosamente! Te contactaré pronto.</span>
            </div>
        `;
        
        showFormMessage(successDiv);
    }

    // Función para mostrar mensaje de error
    function showErrorMessage() {
        console.log('❌ Mostrando mensaje de error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-message error';
        errorDiv.innerHTML = `
            <div class="message-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
                <span>Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.</span>
            </div>
        `;
        
        showFormMessage(errorDiv);
    }

    // Función para mostrar mensajes del formulario
    function showFormMessage(messageElement) {
        console.log('📝 Insertando mensaje en el DOM');
        
        const contactFormContainer = document.querySelector('.contact-form-container');
        const contactForm = document.querySelector('.contact-form');
        
        if (!contactFormContainer || !contactForm) {
            console.error('❌ No se encontró el contenedor del formulario');
            return;
        }
        
        // Remover mensaje anterior si existe
        const existingMessage = contactFormContainer.querySelector('.form-message');
        if (existingMessage) {
            console.log('🗑️ Removiendo mensaje anterior');
            existingMessage.remove();
        }
        
        // Insertar el nuevo mensaje antes del formulario
        contactFormContainer.insertBefore(messageElement, contactForm);
        console.log('✅ Mensaje insertado correctamente');
        
        // Scroll suave hacia el mensaje
        messageElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest' 
        });
        
        // Remover el mensaje después de 8 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                console.log('🗑️ Removiendo mensaje después de 8 segundos');
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'translateY(-10px)';
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.remove();
                    }
                }, 300);
            }
        }, 8000);
    }
});