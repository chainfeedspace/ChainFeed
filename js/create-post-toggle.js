// ============================================
// SISTEMA DE TOGGLE PARA CREAR POST
// ============================================

(function() {
    'use strict';

    // Función para hacer toggle de la sección de crear post
    window.toggleCreatePostSection = function() {
        const createSection = document.getElementById('createPostSection');
        const postInput = document.getElementById('postInput');
        
        if (!createSection) {
            console.warn('Sección de crear post no encontrada');
            return;
        }

        // Toggle de la sección
        if (createSection.classList.contains('show')) {
            // Ocultar
            createSection.classList.remove('show');
            createSection.style.display = 'none';
        } else {
            // Mostrar
            createSection.style.display = 'block';
            setTimeout(() => {
                createSection.classList.add('show');
                // Scroll suave hacia el formulario
                createSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                // Focus en el textarea
                if (postInput) {
                    setTimeout(() => postInput.focus(), 500);
                }
            }, 10);
        }
    };

    // Al cargar la página, verificar si debe mostrar el formulario
    function checkAutoShow() {
        const urlParams = new URLSearchParams(window.location.search);
        const shouldShow = urlParams.get('show');
        
        if (shouldShow === 'create') {
            // Esperar a que la página cargue completamente
            setTimeout(() => {
                window.toggleCreatePostSection();
                // Limpiar el parámetro de la URL sin recargar
                const newUrl = window.location.pathname + 
                    '?user=' + urlParams.get('user');
                window.history.replaceState({}, '', newUrl);
            }, 500);
        }
    }

    // Inicializar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkAutoShow);
    } else {
        checkAutoShow();
    }

    console.log('✅ Sistema de toggle para crear post cargado');

})();