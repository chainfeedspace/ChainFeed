// Función actualizada para manejar el menú de tres puntos con position: fixed
function togglePostMenu(postId) {
    const dropdown = document.getElementById(`postDropdown-${postId}`);
    const button = document.querySelector(`[onclick*="togglePostMenu('${postId}')"]`);
    
    if (!dropdown || !button) {
        console.error('Dropdown o botón no encontrado para:', postId);
        return;
    }
    
    // Si este menú ya está activo, cerrarlo
    if (activePostMenu === postId) {
        closePostMenu(postId);
        return;
    }
    
    // Cerrar cualquier menú abierto
    closeAllPostMenus();
    
    // Calcular posición correcta para position: fixed
    const buttonRect = button.getBoundingClientRect();
    const dropdownWidth = 200; // Ancho mínimo del dropdown
    const dropdownHeight = 300; // Altura estimada máxima del dropdown
    
    // Calcular posición X (horizontal)
    let leftPosition = buttonRect.right - dropdownWidth;
    
    // Ajustar si se sale por la izquierda
    if (leftPosition < 10) {
        leftPosition = buttonRect.left;
    }
    
    // Ajustar si se sale por la derecha
    if (leftPosition + dropdownWidth > window.innerWidth - 10) {
        leftPosition = window.innerWidth - dropdownWidth - 10;
    }
    
    // Calcular posición Y (vertical)
    let topPosition = buttonRect.bottom + 5;
    
    // Ajustar si se sale por abajo
    if (topPosition + dropdownHeight > window.innerHeight - 10) {
        topPosition = buttonRect.top - dropdownHeight - 5;
        
        // Si tampoco cabe arriba, posicionar en el centro visible
        if (topPosition < 10) {
            topPosition = Math.max(10, (window.innerHeight - dropdownHeight) / 2);
        }
    }
    
    // Aplicar posicionamiento
    dropdown.style.left = `${leftPosition}px`;
    dropdown.style.top = `${topPosition}px`;
    
    // Mostrar el dropdown
    dropdown.classList.remove('hidden');
    dropdown.classList.add('active');
    dropdown.style.opacity = '1';
    dropdown.style.visibility = 'visible';
    dropdown.style.transform = 'scale(1)';
    
    activePostMenu = postId;
    
    // Agregar listener para cerrar al hacer clic fuera
    setTimeout(() => {
        document.addEventListener('click', closeMenuOnOutsideClick);
        // También cerrar al hacer scroll (opcional)
        window.addEventListener('scroll', closeAllPostMenus, { once: true });
    }, 10);
    
    console.log(`Menú abierto para post ${postId} en posición:`, {
        left: leftPosition,
        top: topPosition,
        buttonRect: buttonRect,
        viewport: { width: window.innerWidth, height: window.innerHeight }
    });
}

// Función mejorada para cerrar menú
function closePostMenu(postId) {
    const dropdown = document.getElementById(`postDropdown-${postId}`);
    
    if (dropdown) {
        dropdown.classList.remove('active');
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            dropdown.classList.add('hidden');
            // Limpiar posicionamiento
            dropdown.style.left = '';
            dropdown.style.top = '';
        }, 300);
    }
    
    if (activePostMenu === postId) {
        activePostMenu = null;
    }
    
    // Remover listeners
    document.removeEventListener('click', closeMenuOnOutsideClick);
    window.removeEventListener('scroll', closeAllPostMenus);
}

// Función para cerrar todos los menús
function closeAllPostMenus() {
    if (activePostMenu) {
        closePostMenu(activePostMenu);
    }
    
    // Por seguridad, cerrar cualquier menú que esté abierto
    const allActiveDropdowns = document.querySelectorAll('.post-dropdown.active');
    allActiveDropdowns.forEach(dropdown => {
        const postId = dropdown.id.replace('postDropdown-', '');
        closePostMenu(postId);
    });
}

// Función mejorada para detectar clics fuera
function closeMenuOnOutsideClick(event) {
    const clickedElement = event.target;
    
    // Verificar si el clic fue dentro de un menú o botón de menú
    const isInsideMenu = clickedElement.closest('.post-dropdown') || 
                        clickedElement.closest('.post-menu-btn');
    
    if (!isInsideMenu) {
        closeAllPostMenus();
    }
}

// Cerrar menús al redimensionar la ventana
window.addEventListener('resize', closeAllPostMenus);

// Opcional: Reposicionar dropdown si está abierto durante scroll
function handleScrollRepositioning() {
    if (activePostMenu) {
        // Opción 1: Cerrar el menú
        closeAllPostMenus();
        
        // Opción 2: Reposicionar (comentado, pero disponible)
        // togglePostMenu(activePostMenu);
    }
}

window.addEventListener('scroll', handleScrollRepositioning);

// Función auxiliar para debug del posicionamiento
function debugDropdownPosition(postId) {
    const dropdown = document.getElementById(`postDropdown-${postId}`);
    const button = document.querySelector(`[onclick*="togglePostMenu('${postId}')"]`);
    
    if (dropdown && button) {
        const buttonRect = button.getBoundingClientRect();
        const dropdownRect = dropdown.getBoundingClientRect();
        
        console.log('Debug posicionamiento:', {
            postId: postId,
            button: {
                top: buttonRect.top,
                left: buttonRect.left,
                bottom: buttonRect.bottom,
                right: buttonRect.right,
                width: buttonRect.width,
                height: buttonRect.height
            },
            dropdown: {
                top: dropdownRect.top,
                left: dropdownRect.left,
                bottom: dropdownRect.bottom,
                right: dropdownRect.right,
                width: dropdownRect.width,
                height: dropdownRect.height
            },
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                scrollX: window.scrollX,
                scrollY: window.scrollY
            },
            visible: dropdown.classList.contains('active'),
            zIndex: window.getComputedStyle(dropdown).zIndex
        });
    }
}