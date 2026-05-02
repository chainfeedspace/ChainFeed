// js/cambio_credenciales.js

// ============================================
// SISTEMA DE CAMBIO DE EMAIL Y CONTRASEÑA
// ============================================

const STORAGE_KEY_EMAIL_CHANGE = 'chainfeed_email_change_data';
const STORAGE_KEY_PASSWORD_CHANGE = 'chainfeed_password_change_data';

// ========== FUNCIONES DE ALMACENAMIENTO ==========

function getEmailChangeData() {
    const data = localStorage.getItem(STORAGE_KEY_EMAIL_CHANGE);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(STORAGE_KEY_EMAIL_CHANGE);
        return null;
    }
    
    return parsed;
}

function saveEmailChangeData(attemptsRemaining, nextAllowedTimestamp, waitSeconds) {
    const data = {
        attemptsRemaining: attemptsRemaining,
        nextAllowedTimestamp: nextAllowedTimestamp,
        waitSeconds: waitSeconds,
        savedAt: Date.now(),
        expiresAt: Date.now() + (3600 * 1000)
    };
    localStorage.setItem(STORAGE_KEY_EMAIL_CHANGE, JSON.stringify(data));
}

function getPasswordChangeData() {
    const data = localStorage.getItem(STORAGE_KEY_PASSWORD_CHANGE);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(STORAGE_KEY_PASSWORD_CHANGE);
        return null;
    }
    
    return parsed;
}

function savePasswordChangeData(attemptsRemaining, nextAllowedTimestamp, waitSeconds) {
    const data = {
        attemptsRemaining: attemptsRemaining,
        nextAllowedTimestamp: nextAllowedTimestamp,
        waitSeconds: waitSeconds,
        savedAt: Date.now(),
        expiresAt: Date.now() + (3600 * 1000)
    };
    localStorage.setItem(STORAGE_KEY_PASSWORD_CHANGE, JSON.stringify(data));
}

// ========== VERIFICAR VISIBILIDAD DE SECCIONES ==========

async function checkCredentialsVisibility() {
    try {
        const response = await fetch('php/obtener_perfil.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (!response.ok) return;
        
        const data = await response.json();
        if (!data.success) return;
        
        const email = data.profile.email;
        const passwordHash = data.profile.password_hash;
        
        // Mostrar secciones solo si tiene email registrado (independiente de verificación)
        if (email && passwordHash) {
            document.getElementById('changeEmailSection').style.display = 'block';
            document.getElementById('changePasswordSection').style.display = 'block';
            
            // Mostrar email actual
            document.getElementById('currentEmailDisplay').textContent = email;
            
            // Verificar estados de botones
            checkEmailChangeButtonState();
            checkPasswordChangeButtonState();
        }
        
    } catch (error) {
        console.error('Error verificando credenciales:', error);
    }
}

// ========== MODAL DE CAMBIO DE EMAIL ==========

function openChangeEmailModal() {
    const modal = document.getElementById('changeEmailModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeChangeEmailModal() {
    const modal = document.getElementById('changeEmailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Limpiar campos
        document.getElementById('newEmailInput').value = '';
        document.getElementById('emailChangePasswordInput').value = '';
        document.getElementById('emailChangePasswordConfirmInput').value = '';
        
        clearValidationErrors('changeEmailModal');
    }
}

function validateNewEmailInput() {
    const emailInput = document.getElementById('newEmailInput');
    const emailError = document.getElementById('newEmailError');
    
    if (!emailInput || !emailError) return false;
    
    const email = emailInput.value.trim();
    
    if (!email) {
        emailError.textContent = '';
        emailError.style.display = 'none';
        emailInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        emailError.textContent = '❌ Email inválido';
        emailError.style.display = 'block';
        emailError.style.color = 'var(--error)';
        emailInput.style.borderColor = 'var(--error)';
        return false;
    }
    
    emailError.textContent = '✅ Email válido';
    emailError.style.display = 'block';
    emailError.style.color = 'var(--success)';
    emailInput.style.borderColor = 'var(--success)';
    return true;
}

function validateEmailChangePasswords() {
    const passwordInput = document.getElementById('emailChangePasswordInput');
    const confirmInput = document.getElementById('emailChangePasswordConfirmInput');
    const confirmError = document.getElementById('emailChangePasswordConfirmError');
    
    if (!passwordInput || !confirmInput || !confirmError) return false;
    
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    
    if (!confirmPassword) {
        confirmError.textContent = '';
        confirmError.style.display = 'none';
        confirmInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        return false;
    }
    
    if (password !== confirmPassword) {
        confirmError.textContent = '❌ Las contraseñas no coinciden';
        confirmError.style.display = 'block';
        confirmError.style.color = 'var(--error)';
        confirmInput.style.borderColor = 'var(--error)';
        return false;
    }
    
    confirmError.textContent = '✅ Las contraseñas coinciden';
    confirmError.style.display = 'block';
    confirmError.style.color = 'var(--success)';
    confirmInput.style.borderColor = 'var(--success)';
    return true;
}

async function submitEmailChange(event) {
    event.preventDefault();
    
    const newEmail = document.getElementById('newEmailInput').value.trim();
    const password = document.getElementById('emailChangePasswordInput').value;
    const passwordConfirm = document.getElementById('emailChangePasswordConfirmInput').value;
    
    if (!validateNewEmailInput()) {
        showNotification('❌ Por favor ingresa un email válido', 'error');
        return;
    }
    
    if (password.length < 8) {
        showNotification('❌ La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    if (password !== passwordConfirm) {
        showNotification('❌ Las contraseñas no coinciden', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('submitEmailChangeBtn');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        
        const response = await fetch('php/cambiar_email.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email_nuevo: newEmail,
                password: password,
                password_confirm: passwordConfirm
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            saveEmailChangeData(
                data.attempts_remaining,
                data.next_allowed_timestamp,
                data.wait_seconds
            );
            
            showNotification('✅ ' + data.message, 'success');
            closeChangeEmailModal();
            
            updateEmailChangeAttemptsDisplay();
            checkEmailChangeButtonState();
            
        } else {
            if (response.status === 429) {
                if (data.wait_seconds) {
                    const minutes = Math.ceil(data.wait_seconds / 60);
                    showNotification(`⏳ Debes esperar ${minutes} minuto(s) antes de intentar nuevamente`, 'warning');
                } else {
                    showNotification('⚠️ ' + data.message, 'warning');
                }
                
                if (data.attempts_used >= 3) {
                    saveEmailChangeData(0, data.next_allowed_timestamp, data.wait_seconds);
                }
            } else {
                showNotification('❌ ' + data.message, 'error');
            }
            
            updateEmailChangeAttemptsDisplay();
            checkEmailChangeButtonState();
        }
        
    } catch (error) {
        console.error('Error cambiando email:', error);
        showNotification('❌ Error al cambiar email', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.textContent = originalText;
    }
}

function checkEmailChangeButtonState() {
    const changeBtn = document.getElementById('changeEmailBtn');
    if (!changeBtn) return;
    
    const changeData = getEmailChangeData();
    
    if (!changeData) {
        changeBtn.disabled = false;
        changeBtn.textContent = 'Cambiar Email';
        changeBtn.style.opacity = '1';
        return;
    }
    
    if (changeData.nextAllowedTimestamp) {
        const nextTimeMs = changeData.nextAllowedTimestamp * 1000;
        const now = Date.now();
        const remainingMs = nextTimeMs - now;
        
        if (remainingMs > 0) {
            changeBtn.disabled = true;
            const remainingSec = Math.ceil(remainingMs / 1000);
            const minutes = Math.floor(remainingSec / 60);
            const seconds = remainingSec % 60;
            
            changeBtn.textContent = `Espera ${minutes}:${seconds.toString().padStart(2, '0')}`;
            changeBtn.style.opacity = '0.6';
            
            setTimeout(checkEmailChangeButtonState, 1000);
            return;
        }
    }
    
    if (changeData.attemptsRemaining <= 0) {
        changeBtn.disabled = true;
        changeBtn.textContent = 'Límite Alcanzado';
        changeBtn.style.opacity = '0.5';
        return;
    }
    
    changeBtn.disabled = false;
    changeBtn.textContent = 'Cambiar Email';
    changeBtn.style.opacity = '1';
}

function updateEmailChangeAttemptsDisplay() {
    const attemptsText = document.getElementById('emailChangeAttemptsText');
    if (!attemptsText) return;
    
    const changeData = getEmailChangeData();
    const remaining = changeData ? changeData.attemptsRemaining : 3;
    
    attemptsText.textContent = `Intentos restantes: ${remaining}/3`;
    
    if (remaining === 0) {
        attemptsText.style.color = 'var(--error)';
    } else if (remaining === 1) {
        attemptsText.style.color = 'var(--warning)';
    } else {
        attemptsText.style.color = 'var(--text-secondary)';
    }
}

// ========== MODAL DE CAMBIO DE CONTRASEÑA ==========

/**
 * Abrir modal de cambio de contraseña
 */
async function openChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (!modal) return;
    
    try {
        // 🆕 Obtener email actual del usuario desde la BD
        const response = await fetch('php/obtener_perfil.php', {
            method: 'GET',
            credentials: 'include'
        });
        
        const data = await response.json();
        
        if (!data.success || !data.profile.email) {
            showNotification('❌ Error al obtener el email del usuario', 'error');
            return;
        }
        
        const currentEmail = data.profile.email;
        
        // 🆕 Llenar el input de email antes de abrir el modal
        const emailInput = document.getElementById('passwordChangeEmailInput');
        if (emailInput) {
            emailInput.value = currentEmail;
        }
        
        // Abrir modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
    } catch (error) {
        console.error('Error al abrir modal de cambio de contraseña:', error);
        showNotification('❌ Error al cargar los datos', 'error');
    }
}

function closeChangePasswordModal() {
    const modal = document.getElementById('changePasswordModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        
        // Limpiar campos (excepto el email que es readonly)
        const currentPasswordInput = document.getElementById('currentPasswordInput');
        const newPasswordInput = document.getElementById('newPasswordInput');
        const newPasswordConfirmInput = document.getElementById('newPasswordConfirmInput');
        
        if (currentPasswordInput) currentPasswordInput.value = '';
        if (newPasswordInput) newPasswordInput.value = '';
        if (newPasswordConfirmInput) newPasswordConfirmInput.value = '';
        
        // Limpiar errores de validación
        clearPasswordChangeValidationErrors();
    }
}

function clearPasswordChangeValidationErrors() {
    const errors = ['newPasswordError', 'newPasswordConfirmError'];
    errors.forEach(errorId => {
        const errorEl = document.getElementById(errorId);
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
        }
    });
    
    const inputs = ['currentPasswordInput', 'newPasswordInput', 'newPasswordConfirmInput'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }
    });
}

function validateNewPasswords() {
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmInput = document.getElementById('newPasswordConfirmInput');
    const newPasswordError = document.getElementById('newPasswordError');
    const confirmError = document.getElementById('newPasswordConfirmError');
    
    if (!newPasswordInput || !confirmInput) return false;
    
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmInput.value;
    
    // Validar nueva contraseña
    if (newPassword && newPassword.length < 8) {
        if (newPasswordError) {
            newPasswordError.textContent = '❌ Mínimo 8 caracteres';
            newPasswordError.style.display = 'block';
            newPasswordError.style.color = 'var(--error)';
        }
        newPasswordInput.style.borderColor = 'var(--error)';
        return false;
    } else if (newPassword && newPasswordError) {
        newPasswordError.textContent = '✅ Contraseña válida';
        newPasswordError.style.display = 'block';
        newPasswordError.style.color = 'var(--success)';
        newPasswordInput.style.borderColor = 'var(--success)';
    }
    
    // Validar confirmación
    if (confirmPassword && newPassword !== confirmPassword) {
        if (confirmError) {
            confirmError.textContent = '❌ Las contraseñas no coinciden';
            confirmError.style.display = 'block';
            confirmError.style.color = 'var(--error)';
        }
        confirmInput.style.borderColor = 'var(--error)';
        return false;
    } else if (confirmPassword && newPassword === confirmPassword && confirmError) {
        confirmError.textContent = '✅ Las contraseñas coinciden';
        confirmError.style.display = 'block';
        confirmError.style.color = 'var(--success)';
        confirmInput.style.borderColor = 'var(--success)';
        return true;
    }
    
    return newPassword.length >= 8;
}

async function submitPasswordChange(event) {
    event.preventDefault();
    
    const email = document.getElementById('passwordChangeEmailInput').value.trim();
    const passwordActual = document.getElementById('currentPasswordInput').value;
    const passwordNueva = document.getElementById('newPasswordInput').value;
    const passwordNuevaConfirm = document.getElementById('newPasswordConfirmInput').value;
    
    if (!email) {
        showNotification('❌ Email requerido', 'error');
        return;
    }
    
    if (passwordActual.length < 8) {
        showNotification('❌ La contraseña actual debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    if (passwordNueva.length < 8) {
        showNotification('❌ La nueva contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    if (passwordNueva !== passwordNuevaConfirm) {
        showNotification('❌ Las contraseñas nuevas no coinciden', 'error');
        return;
    }
    
    const submitBtn = document.getElementById('submitPasswordChangeBtn');
    const originalText = submitBtn.textContent;
    
    try {
        submitBtn.disabled = true;
        submitBtn.classList.add('btn-loading');
        
        const response = await fetch('php/cambiar_password.php', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password_actual: passwordActual,
                password_nueva: passwordNueva,
                password_nueva_confirm: passwordNuevaConfirm
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            savePasswordChangeData(
                data.attempts_remaining,
                data.next_allowed_timestamp,
                data.wait_seconds
            );
            
            showNotification('✅ ' + data.message, 'success');
            closeChangePasswordModal();
            
            updatePasswordChangeAttemptsDisplay();
            checkPasswordChangeButtonState();
            
        } else {
            if (response.status === 429) {
                if (data.wait_seconds) {
                    const minutes = Math.ceil(data.wait_seconds / 60);
                    showNotification(`⏳ Debes esperar ${minutes} minuto(s) antes de intentar nuevamente`, 'warning');
                } else {
                    showNotification('⚠️ ' + data.message, 'warning');
                }
                
                if (data.attempts_used >= 3) {
                    savePasswordChangeData(0, data.next_allowed_timestamp, data.wait_seconds);
                }
            } else {
                showNotification('❌ ' + data.message, 'error');
            }
            
            updatePasswordChangeAttemptsDisplay();
            checkPasswordChangeButtonState();
        }
        
    } catch (error) {
        console.error('Error cambiando contraseña:', error);
        showNotification('❌ Error al cambiar contraseña', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
        submitBtn.textContent = originalText;
    }
}

function checkPasswordChangeButtonState() {
    const changeBtn = document.getElementById('changePasswordBtn');
    if (!changeBtn) return;
    
    const changeData = getPasswordChangeData();
    
    if (!changeData) {
        changeBtn.disabled = false;
        changeBtn.textContent = 'Cambiar Contraseña';
        changeBtn.style.opacity = '1';
        return;
    }
    
    if (changeData.nextAllowedTimestamp) {
        const nextTimeMs = changeData.nextAllowedTimestamp * 1000;
        const now = Date.now();
        const remainingMs = nextTimeMs - now;
        
        if (remainingMs > 0) {
            changeBtn.disabled = true;
            const remainingSec = Math.ceil(remainingMs / 1000);
            const minutes = Math.floor(remainingSec / 60);
            const seconds = remainingSec % 60;
            
            changeBtn.textContent = `Espera ${minutes}:${seconds.toString().padStart(2, '0')}`;
            changeBtn.style.opacity = '0.6';
            
            setTimeout(checkPasswordChangeButtonState, 1000);
            return;
        }
    }
    
    if (changeData.attemptsRemaining <= 0) {
        changeBtn.disabled = true;
        changeBtn.textContent = 'Límite Alcanzado';
        changeBtn.style.opacity = '0.5';
        return;
    }
    
    changeBtn.disabled = false;
    changeBtn.textContent = 'Cambiar Contraseña';
    changeBtn.style.opacity = '1';
}

function updatePasswordChangeAttemptsDisplay() {
    const attemptsText = document.getElementById('passwordChangeAttemptsText');
    if (!attemptsText) return;
    
    const changeData = getPasswordChangeData();
    const remaining = changeData ? changeData.attemptsRemaining : 3;
    
    attemptsText.textContent = `Intentos restantes: ${remaining}/3`;
    
    if (remaining === 0) {
        attemptsText.style.color = 'var(--error)';
    } else if (remaining === 1) {
        attemptsText.style.color = 'var(--warning)';
    } else {
        attemptsText.style.color = 'var(--text-secondary)';
    }
}

// ========== UTILIDADES ==========

function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = '🙈';
        } else {
            input.type = 'password';
            icon.textContent = '👁️';
        }
    }
}

function clearValidationErrors(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const errors = modal.querySelectorAll('.validation-message');
    errors.forEach(error => {
        error.textContent = '';
        error.style.display = 'none';
    });
    
    const inputs = modal.querySelectorAll('input');
    inputs.forEach(input => {
        input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
    });
}

// Cerrar modales al hacer clic fuera
document.addEventListener('click', function(e) {
    const emailModal = document.getElementById('changeEmailModal');
    const passwordModal = document.getElementById('changePasswordModal');
    
    if (emailModal && e.target === emailModal) {
        closeChangeEmailModal();
    }
    
    if (passwordModal && e.target === passwordModal) {
        closeChangePasswordModal();
    }
});