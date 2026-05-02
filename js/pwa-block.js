// Bloquear banner nativo de Chrome (sin mostrar nada)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
});