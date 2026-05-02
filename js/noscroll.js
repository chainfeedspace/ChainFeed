// Prevenir SOLO el pull-to-refresh en el body, NO en modales
(function() {
  let touchStartY = 0;
  let touchStartElement = null;
  
  document.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
    touchStartElement = e.target;
  }, { passive: true });
  
  document.addEventListener('touchmove', function(e) {
    const touchY = e.touches[0].clientY;
    const touchElement = e.target;
    
    // IGNORAR si el touch está dentro de cualquier modal (AGREGADO .chain-modal)
    const isInsideModal = touchElement.closest('#compra-directa-modal, #preventa-modal, .transactions-modal, .submissions-modal, .participate-modal, .comments-modal, .share-modal, .chain-modal, .sell-modal, .buy-modal');
    
    if (isInsideModal) {
      // NO bloquear el scroll dentro de los modales
      return;
    }
    
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    
    // SOLO bloquear pull-to-refresh en el body principal
    if (scrollTop <= 0 && (touchY - touchStartY) > 5) {
      e.preventDefault();
    }
  }, { passive: false });
})();