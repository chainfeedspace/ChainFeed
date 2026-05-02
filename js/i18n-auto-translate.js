(function() {
  'use strict';

  // ==========================================
  // FUNCIÓN PARA NORMALIZAR TEXTO (QUITAR TILDES)
  // ==========================================
  function normalizeText(text) {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  // ==========================================
  // DICCIONARIO DE TRADUCCIONES AMPLIADO
  // ==========================================
  const translations = {
    es: {
        "Connect Wallet": "Conectar Billetera",
"To start using ChainFeed": "Para empezar a usar ChainFeed",
"Mobile": "Móvil",
"Browser": "Navegador",
"Desktop": "Escritorio",
"By connecting, I accept XPR Network's Terms of Service": "Al conectar, acepto los Términos de Servicio de XPR Network",
"Scan the QR-Code": "Escanear el código QR",
"OR": "O",
"Open Wallet": "Abrir Billetera",
"Don't have a wallet?": "¿No tienes una billetera?",
"Download it here": "Descárgala aquí"

    }
,
    en: {
        
        "Tokens a distribuir": "Tokens to distribute",
"Tokens para preventa": "Tokens for presale",
"Bonus Preventa": "Presale Bonus",
"Gas en transacciones": "Gas in transactions",
  "Red social descentralizada - Comparte y conecta con tu comunidad": "Decentralized Social Network - Share and connect with your community",
"Cargando Chat...": "Loading Chat...",

      // Landing Page - Hero
      'Preventa en Vivo - Fase 1': 'Live Presale - Phase 1',
      '🚀 Preventa en Vivo - Fase 1': '🚀 Live Presale - Phase 1',
      'Gana tokens desde tu primer like': 'Earn tokens from your first like',
      'Gana tokens desde': 'Earn tokens from',
      'tu primer like': 'your first like',
      'Gana tokens ofsde tu primer like': 'Earn tokens from your first like', // Fix typo
      'La red social que recompensa cada interacción': 'The social network that rewards every interaction',
      'Comprar Tokens Ahora': 'Buy Tokens Now',
      'Ver Whitepaper': 'View Whitepaper',
      'Comprar CFT': 'Buy CFT',
      'CFT': ' CFT',
      // Countdown
      'Lanzamiento Oficial': 'Official Launch',
      'La preventa termina en:': 'Presale ends in:',
      'Días': 'Days',
      'Horas': 'Hours',
      'Minutos': 'Minutes',
      'Segundos': 'Seconds',
      'Tokens Disponibles': 'Available Tokens',
      'vendido': 'sold',
      'vendidos de': 'sold of',
      'vendidos de 10,000,000 CFT': 'sold of 10,000,000 CFT',
      'Conecta tu wallet para participar': 'Connect your wallet to participate',
      '🚀 Participar en la Preventa': '🚀 Join the Presale',
      'Participar en la Preventa': 'Join the Presale',
      'Tus tokens CFT': 'Your CFT tokens',
      
      // Sections
      'Recompensas automáticas por cada acción': 'Automatic rewards for every action',
      'Publica contenido, recibe likes, comenta y gana tokens CFT instantáneamente': 'Post content, receive likes, comment and earn CFT tokens instantly',
      'Sin umbrales de followers, sin aprobaciones': 'No follower thresholds, no approvals',
      'Tu actividad se monetiza desde el día 1': 'Your activity monetizes from day 1',
      'Descubrir Más': 'Discover More',
      
      // Features Cards
      '💰 Gana por Publicar': '💰 Earn by Posting',
      'Gana por Publicar': 'Earn by Posting',
      'por post': 'per post',
      '❤️ Gana por Likes': '❤️ Earn by Likes',
      'Gana por Likes': 'Earn by Likes',
      'por cada like recibido': 'for each like received',
      '💬 Gana por Comentarios': '💬 Earn by Comments',
      'Gana por Comentarios': 'Earn by Comments',
      'por interacción': 'per interaction',
      
      // Marketplace
      'Marketplace y eventos gamificados': 'Marketplace and gamified events',
      'Vende tu contenido directamente sin intermediarios': 'Sell your content directly without intermediaries',
      'Venof tu contenido directamente sin intermediarios': 'Sell your content directly without intermediaries', // Fix typo
      'Crea encuestas recompensadas, campañas creativas y desafíos de audio': 'Create rewarded polls, creative campaigns and audio challenges',
      'Los usuarios ganan, tú decides cuánto': 'Users earn, you decide how much',
      'Explorar Marketplace': 'Explore Marketplace',
      
      '🏪 Vende tu Contenido': '🏪 Sell your Content',
      'Vende tu Contenido': 'Sell your Content',
      'Comisión solo': 'Commission only',
      'Comisión solo 10%': 'Commission only 10%',
      '🎯 Sistema Chain': '🎯 Chain System',
      'Sistema Chain': 'Chain System',
      'Polls, campaigns y audio': 'Polls, campaigns and audio',
      '📈 Promociona Posts': '📈 Promote Posts',
      'Promociona Posts': 'Promote Posts',
      'Desde': 'From',
      'Desde 50 CFT/día': 'From 50 CFT/day',
      
      // Platform
      'Plataforma funcional y operativa': 'Functional and operational platform',
      'No es un concepto': "It's not a concept",
      'ChainFeed está en producción con': 'ChainFeed is in production with',
      'usuarios activos': 'active users',
      'publicaciones y': 'posts and',
      'tokens distribuidos': 'tokens distributed',
      'El MVP funciona hoy': 'The MVP works today',
      'Ver Plataforma': 'View Platform',
      
      '👥 1,000+ Usuarios': '👥 1,000+ Users',
      'Usuarios': 'Users',
      'Activos y verificados': 'Active and verified',
      '🔗 Blockchain Proton': '🔗 Proton Blockchain',
      'Blockchain Proton': 'Proton Blockchain',
      'Sin gas fees': 'No gas fees',
      '✨ 18 Meses Online': '✨ 18 Months Online',
      'Meses Online': 'Months Online',
      'uptime': 'uptime',
      
      // Stats
      'Usuarios Activos': 'Active Users',
      'Tokens Distribuidos': 'Tokens Distributed',
      'Publicaciones': 'Posts',

      // Final CTA
      'Únete a la revolución': 'Join the revolution',
      'No pierdas esta oportunidad única': "Don't miss this unique opportunity",
      'de ser parte del futuro de las redes sociales descentralizadas': 'to be part of the future of decentralized social networks',
      'No pierdas esta oportunidad única of ser parte del futuro de las redes sociales descentralizadas': "Don't miss this unique opportunity to be part of the future of decentralized social networks",
      'Participar en la Preventa': 'Join the Presale',
      
      // Footer
      '⚡ ChainFeed': '⚡ ChainFeed',
      'La primera red social completamente descentralizada y tokenizada': 'The first fully decentralized and tokenized social network',
      'La primera red social completamente ofscentralizada y tokenizada': 'The first fully decentralized and tokenized social network', // Fix typo
      'Producto': 'Product',
      'Recursos': 'Resources',
      'Legal': 'Legal',
      'Características': 'Features',
      'Tokenomics': 'Tokenomics',
      'Roadmap': 'Roadmap',
      'Whitepaper': 'Whitepaper',
      'Documentación': 'Documentation',
      'Ayuda': 'Help',
      'Blog': 'Blog',
      'FAQ': 'FAQ',
      'Términos': 'Terms',
      'Privacidad': 'Privacy',
      'Disclaimer': 'Disclaimer',
      'KYC/AML': 'KYC/AML',
      'Todos los derechos reservados': 'All rights reserved',
      'Todos los ofrechos reservados': 'All rights reserved', // Fix typo
      '© 2025 ChainFeed. Todos los derechos reservados.': '© 2025 ChainFeed. All rights reserved.',
      
      // Navigation
      'Comenzar ahora': 'Start now',
      'Participar': 'Join',
      
      // Chat System (from original)
      'Buscar chats y usuarios...': 'Search chats and users...',
      'Buscando usuarios...': 'Searching users...',
      'No se encontraron resultados': 'No results found',
      'Intenta con otro término de búsqueda': 'Try another search term',
      'Volver al inicio': 'Back to home',
      'Volver a chats': 'Back to chats',
      'ChainFeed Chat': 'ChainFeed Chat',
      'Solicitudes de Chat': 'Chat Requests',
      'Conversaciones': 'Conversations',
      'Comentarios': 'Comments',
      'En línea': 'Online',
      'Desconectado': 'Offline',
      'Aceptar': 'Accept',
      'Rechazar': 'Reject',
      'Chatear': 'Chat',
      'Solicitar Chat': 'Request Chat',
      'Enviar': 'Send',
      'Enviando...': 'Sending...',
      'Cancelar': 'Cancel',
      'Eliminar': 'Delete',
      'Guardar': 'Save',
      'Cerrar': 'Close',
      'Cargar más': 'Load more',
      'Cargando...': 'Loading...',
      
      // --- SECCIÓN DE COMPRA DE TOKENS ---
"Comprar Tokens CFT": "Buy CFT Tokens",
"Fase 1 - Bonus 20% incluido": "Phase 1 - 20% Bonus Included",
"USDT": "USDT",
"USDC": "USDC",
"Monto a invertir": "Amount to invest",
"Mínimo: $0.1 • Máximo: $100.000": "Minimum: $0.1 • Maximum: $100,000",
"Recibirás": "You will receive",
"Precio por CFT:": "Price per CFT:",
"Tokens base:": "Base tokens:",
"Bonus (20%):": "Bonus (20%):",
"Comprar Tokens": "Buy Tokens",
"¡Compra Exitosa!": "Successful Purchase!",
"Esperando confirmación en tu wallet...": "Waiting for confirmation in your wallet...",

// --- ERRORES Y MENSAJES DEL SISTEMA ---
"No se pudo obtener el Transaction ID de la transacción.": "Could not obtain the transaction ID.",
"La transferencia blockchain se completó exitosamente, pero no podemos registrarla en el sistema.": 
"The blockchain transfer was completed successfully, but we could not register it in the system.",
"Por favor contacta a soporte inmediatamente con esta información:": "Please contact support immediately with this information:",
"No se pudo conectar con Proton Wallet": "Could not connect to Proton Wallet",
"✅ Wallet conectada:": "✅ Wallet connected:",
"No se pudo obtener sesión de Proton": "Could not get Proton session",
"No se pudo conectar:": "Could not connect:",
"Transacción cancelada por el usuario": "Transaction canceled by the user",
"Saldo insuficiente de": "Insufficient balance of",
"en tu wallet.": "in your wallet.",
"No se pudo conectar con tu wallet. Intenta nuevamente.": "Could not connect to your wallet. Please try again.",
"Error desconocido.": "Unknown error.",
"Error al procesar la compra.": "Error processing the purchase.",
"RAM insuficiente en tu cuenta Proton.": "Insufficient RAM in your Proton account.",
"Necesitas adquirir más RAM para realizar esta transacción.": "You need to purchase more RAM to complete this transaction.",
"Contacta soporte si necesitas ayuda.": "Contact support if you need assistance.",
"CPU insuficiente. Tu cuenta necesita recargar recursos.": "Insufficient CPU. Your account needs to recharge resources.",
"Espera unos minutos e intenta nuevamente.": "Wait a few minutes and try again.",
"Ancho de banda (NET) insuficiente.": "Insufficient bandwidth (NET).",
"Error en la transacción blockchain:": "Blockchain transaction error:",
"Error registrando compra:": "Error registering purchase:",
"Respuesta inválida del servidor": "Invalid server response",
"Error interno del servidor": "Internal server error",
"El monto mínimo es": "The minimum amount is",
"El monto máximo es": "The maximum amount is",
"Saldo insuficiente de ${tokenConfig.symbol} en tu wallet.": "Insufficient ${tokenConfig.symbol} balance in your wallet.",
"Necesitas al menos": "You need at least",
"disponibles.": "available.",

// === AUTENTICACIÓN / UI DE USUARIO ===
"Perfil": "Profile",
"Ver inicio": "View Home",
"Conectate": "Connect",
"Conecectate": "Connect", // Fix typo
"✅ ¡Conectado!": "✅ Connected!",
"Sesión cerrada correctamente": "Session closed successfully",
"Error en el proceso de login": "Error in the login process",
"No se pudo obtener la sesión de Proton": "Could not obtain Proton session",
"Error al conectar con Proton Wallet. Verifica que esté instalado y configurado.": 
"Error connecting to Proton Wallet. Please make sure it is installed and configured.",
"¡Bienvenido a ChainFeed,": "Welcome to ChainFeed,",
"Sesión expirada, limpiando datos": "Session expired, clearing data",
"Error restaurando sesión:": "Error restoring session:",
"🔄 Sesión restaurada para:": "🔄 Session restored for:",

// === PERFIL DE USUARIO / INTERFAZ SOCIAL ===
"Editar perfil": "Edit profile",
"Guardar cambios": "Save changes",
"Cancelar edición": "Cancel edit",
"Seguir": "Follow",
"Dejar de seguir": "Unfollow",
"Siguiendo": "Following",
"Pendiente": "Pending",
"Solicitud enviada": "Request sent",
"Solicitar seguimiento": "Request follow",
"Mensaje": "Message",
"Enviar mensaje": "Send message",
"Ver mensajes": "View messages",
"Ver perfil": "View profile",
"Usuario verificado": "Verified user",
"Cuenta verificada": "Verified account",
"Mi perfil": "My profile",
"Editar biografía": "Edit bio",
"Biografía actualizada": "Bio updated",
"Actualizando perfil...": "Updating profile...",
"Perfil actualizado correctamente": "Profile updated successfully",
"Error al actualizar el perfil": "Error updating profile",

// === ESTADÍSTICAS DE PERFIL ===
"Seguidores": "Followers",
"Likes": "Likes",
"Interacciones": "Interactions",
"Recompensas": "Rewards",
"Tokens ganados": "Tokens earned",
"Ver recompensas": "View rewards",
"Sin actividad reciente": "No recent activity",

// === PUBLICACIONES / POSTS ===
"Nueva publicación": "New post",
"Crear publicación": "Create post",
"Escribe algo...": "Write something...",
"Publicar": "Post",
"Publicando...": "Posting...",
"Post publicado correctamente": "Post published successfully",
"Error al publicar": "Error publishing post",
"Editar publicación": "Edit post",
"Eliminar publicación": "Delete post",
"¿Eliminar esta publicación?": "Delete this post?",
"Publicación eliminada": "Post deleted",
"Error al eliminar publicación": "Error deleting post",
"Contenido multimedia": "Media content",
"Subir imagen": "Upload image",
"Subir video": "Upload video",
"Subiendo archivo...": "Uploading file...",
"Archivo cargado correctamente": "File uploaded successfully",
"Error al subir archivo": "Error uploading file",
"Agregar descripción": "Add description",
"Comentar": "Comment",
"Ver comentarios": "View comments",
"Escribir un comentario...": "Write a comment...",
"Enviar comentario": "Send comment",
"Comentario publicado": "Comment posted",
"Eliminar comentario": "Delete comment",
"Comentario eliminado": "Comment deleted",
"Responder": "Reply",
"Ver respuestas": "View replies",
"Me gusta": "Like",
"No me gusta": "Dislike",
"Dar like": "Give like",
"Quitar like": "Remove like",
"Compartir": "Share",
"Compartido correctamente": "Shared successfully",
"Repostear": "Repost",
"Ver publicación original": "View original post",

// === MODALES Y ACCIONES ===
"Confirmar": "Confirm",
"Sí, eliminar": "Yes, delete",
"No, cancelar": "No, cancel",
"Acción completada": "Action completed",
"Ocurrió un error": "An error occurred",
"Cargando datos...": "Loading data...",
"Procesando...": "Processing...",
"Guardando...": "Saving...",
"Guardado correctamente": "Saved successfully",
"Error al guardar": "Error saving",
"Intentar de nuevo": "Try again",
"Reintentar": "Retry",
"Salir": "Exit",
"Volver": "Back",
"Ver más": "View more",
"Ver menos": "View less",
"Mostrar más": "Show more",
"Mostrar menos": "Show less",

// === NOTIFICACIONES / ALERTAS ===
"Notificaciones": "Notifications",
"Sin notificaciones": "No notifications",
"Nuevo seguidor": "New follower",
"Nuevo comentario": "New comment",
"Nuevo like": "New like",
"Nuevo mensaje": "New message",
"Nuevo repost": "New repost",
"Marcar como leído": "Mark as read",
"Ver todas": "View all",
"Ver notificación": "View notification",
"Eliminar notificación": "Delete notification",
"Notificación eliminada": "Notification deleted",

// === MENSAJES PRIVADOS ===
"Chat": "Chat",
"Mensajes": "Messages",
"Escribe tu mensaje...": "Write your message...",
"Enviando mensaje...": "Sending message...",
"Mensaje enviado": "Message sent",
"Error al enviar mensaje": "Error sending message",
"Eliminar conversación": "Delete conversation",
"Conversación eliminada": "Conversation deleted",
"Usuario en línea": "User online",
"Usuario desconectado": "User offline",
"Última conexión": "Last seen",
"Ver conversación": "View conversation",

// === MODALES ESPECIALES ===
"Comprar publicación": "Buy post",
"Vender publicación": "Sell post",
"Precio": "Price",
"Confirmar compra": "Confirm purchase",
"Compra completada": "Purchase completed",
"Error en la compra": "Purchase error",
"Crear evento": "Create event",
"Crear campaña": "Create campaign",
"Crear encuesta": "Create poll",
"Título del evento": "Event title",
"Descripción del evento": "Event description",
"Recompensa por participación": "Participation reward",
"Duración": "Duration",
"Crear": "Create",
"Evento creado correctamente": "Event created successfully",
"Error al crear evento": "Error creating event",

// === BARRA DE NAVEGACIÓN ===
"Inicio": "Home",
"Explorar": "Explore",
"Marketplace": "Marketplace",
"Eventos": "Events",
"Ranking": "Ranking",
"Configuración": "Settings",
"Ajustes": "Settings",
"Cerrar sesión": "Log out",
"¿Seguro que deseas cerrar sesión?": "Are you sure you want to log out?",
"Sesión cerrada": "Session closed",

// === VARIOS ===
"Buscar": "Search",
"Buscar usuarios": "Search users",
"Buscar publicaciones": "Search posts",
"Resultados": "Results",
"Sin resultados": "No results found",
"Intentar otra búsqueda": "Try another search",
"Filtrar": "Filter",
"Ordenar por": "Sort by",
"Más recientes": "Most recent",
"Más populares": "Most popular",
"Más comentados": "Most commented",
"Relevantes": "Relevant",
"Aplicar filtros": "Apply filters",
"Restablecer": "Reset",
"Confirmar acción": "Confirm action",
"Copiar enlace": "Copy link",
"Enlace copiado": "Link copied",
"Ver detalles": "View details",
"Ver más información": "View more information",
"Actualizando...": "Updating...",
"Actualización completada": "Update completed",
"Error al actualizar": "Error updating",

// ==========================================
// TRADUCCIONES PARA WHITEPAPER - NUEVAS FRASES
// ==========================================

"🌐 CHAINFEED": "🌐 CHAINFEED",
"Red Social Tokenizada con Economía de Creadores Descentralizada": "Tokenized Social Network with Decentralized Creator Economy",
"Whitepaper Oficial - Versión 1.0 | Noviembre 2025": "Official Whitepaper - Version 1.0 | November 2025",

// Índice de Contenidos
"📋 Índice de Contenidos": "📋 Table of Contents",
"📊 Resumen Ejecutivo": "📊 Executive Summary",
"🚨 El Problema": "🚨 The Problem", 
"💡 La Solución": "💡 The Solution",
"🖥️ Plataforma Actual": "🖥️ Current Platform",
"💰 Modelo Económico": "💰 Economic Model",
"🪙 Tokenomics CFT": "🪙 CFT Tokenomics",
"📱 Casos de Uso": "📱 Use Cases",
"💼 Modelo de Negocio": "💼 Business Model",
"📊 Análisis de Mercado": "📊 Market Analysis",
"⚠️ Riesgos y Mitigaciones": "⚠️ Risks and Mitigations",
"🗓️ Roadmap": "🗓️ Roadmap",
"⚖️ Información Legal": "⚖️ Legal Information",

// Resumen Ejecutivo
"¿Qué es ChainFeed?": "What is ChainFeed?",
"ChainFeed es una red social funcional que recompensa automáticamente a usuarios por crear contenido y participar en la plataforma. Cada like, comentario y publicación genera tokens CFT que tienen valor económico real.": 
"ChainFeed is a functional social network that automatically rewards users for creating content and participating in the platform. Every like, comment, and post generates CFT tokens that have real economic value.",

"Estado Actual del Proyecto": "Current Project Status",
"Completamente Funcional": "Fully Functional", 
"Usuarios Activos Proyectados": "Projected Active Users",
"Interacciones Tokenizadas Proyectadas": "Projected Tokenized Interactions",
"Meses de Desarrollo": "Months of Development",

"Datos Verificables de Uso de prueba": "Verifiable Test Usage Data",
"Publicaciones creadas:": "Posts created:",
"Eventos Chain completados:": "Chain Events completed:",
"Transacciones marketplace:": "Marketplace transactions:",
"Uptime plataforma:": "Platform uptime:",

"Propuesta de Valor": "Value Proposition",
"Para Creadores:": "For Creators:",
"Monetización desde el primer día, sin requisitos de seguidores": "Monetization from day one, no follower requirements",
"Para Usuarios:": "For Users:",
"Gana tokens simplemente usando la plataforma": "Earn tokens simply by using the platform", 
"Para Inversores:": "For Investors:",
"Modelo económico sostenible con múltiples fuentes de ingreso": "Sustainable economic model with multiple revenue streams",

// El Problema
"La Economía Rota de las Redes Sociales": "The Broken Economy of Social Networks",
"Las plataformas sociales tradicionales capturan el 100% del valor generado por usuarios y creadores:": 
"Traditional social platforms capture 100% of the value generated by users and creators:",

"Twitter/X Ingresos 2024": "Twitter/X Revenue 2024",
"Meta Ingresos 2024": "Meta Revenue 2024", 
"TikTok Ingresos 2024": "TikTok Revenue 2024",
"A Creadores Orgánicos": "To Organic Creators",

"Barreras Actuales para Creadores": "Current Barriers for Creators",
"Requisitos Inalcanzables": "Unreachable Requirements",
"Necesitas miles de seguidores antes de ganar $1": "You need thousands of followers before earning $1",
"Algoritmos opacos que favorecen contenido corporativo": "Opaque algorithms that favor corporate content",
"Monetización a discreción de la plataforma": "Monetization at the platform's discretion",

"Valor Capturado por Intermediarios": "Value Captured by Intermediaries",
"30-50% de comisiones en ventas de contenido": "30-50% commissions on content sales", 
"Sin transparencia en ingresos publicitarios": "No transparency in advertising revenue",
"Cambios de reglas unilaterales sin compensación": "Unilateral rule changes without compensation",

"Falta de Propiedad Real": "Lack of Real Ownership", 
"Tu contenido pertenece a la plataforma": "Your content belongs to the platform",
"Pueden bloquearte sin derecho a apelación": "They can block you without right to appeal",
"No puedes transferir tu audiencia": "You cannot transfer your audience",

// La Solución
"LA SOLUCIÓN: CHAINFEED": "THE SOLUTION: CHAINFEED",
"Principios Fundamentales": "Fundamental Principles",
"Recompensas Automáticas Inmediatas": "Immediate Automatic Rewards",
"Cada interacción genera tokens CFT en tiempo real. No hay umbrales ni aprobaciones.": 
"Every interaction generates CFT tokens in real time. No thresholds or approvals required.",

"Economía Transparente": "Transparent Economy", 
"Todos los movimientos de tokens son públicos y verificables en blockchain.":
"All token movements are public and verifiable on the blockchain.",

"Propiedad Verificable": "Verifiable Ownership",
"El contenido que creas es tuyo. Puedes venderlo directamente sin intermediarios.":
"The content you create is yours. You can sell it directly without intermediaries.",

"Modelo Sostenible": "Sustainable Model", 
"El 90% del valor económico fluye hacia los usuarios. La plataforma retiene solo el 10% necesario para operar.":
"90% of economic value flows to users. The platform retains only the 10% needed to operate.",

"Diferenciadores Clave vs Competencia": "Key Differentiators vs Competition",
"Característica": "Feature",
"Recompensas desde día 1": "Rewards from day 1",
"Pagos instantáneos": "Instant payments", 
"Comisión plataforma": "Platform commission",
"Modelo sostenible": "Sustainable model",
"Marketplace integrado": "Integrated marketplace",
"Eventos gamificados": "Gamified events",

"Inmediatos": "Immediate",
"30-60 días": "30-60 days", 
"7 días": "7 days",
"10% compra + venta": "10% buy + sell",
"Ads": "Advertising",
"Múltiples ingresos": "Multiple revenue streams",
"Inflacionario": "Inflationary", 
"Ponzi colapsó": "Ponzi collapsed",
"Solo trading keys": "Only key trading",

// Plataforma Actual
"PLATAFORMA ACTUAL": "CURRENT PLATFORM",
"Funcionalidades Implementadas y Operativas": "Implemented and Operational Features",
"Red Social Completa": "Complete Social Network", 
"Tipos de Contenido Soportados:": "Supported Content Types:",
"Publicaciones de texto (hasta 500 caracteres)": "Text posts (up to 500 characters)",
"Imágenes (JPG, PNG)": "Images (JPG, PNG)",
"Videos (MP4, máximo 60 segundos)": "Videos (MP4, maximum 60 seconds)", 
"Enlaces con preview automático": "Links with automatic preview",

"Interacciones Sociales:": "Social Interactions:",
"Likes con recompensa automática": "Likes with automatic rewards",
"Comentarios anidados (respuestas)": "Nested comments (replies)", 
"Reposts (similar a retweets)": "Reposts (similar to retweets)",
"Compartir fuera de la plataforma": "Share outside platform",
"Sistema de seguidores/seguidos": "Follower/following system",
"Perfiles públicos y privados": "Public and private profiles", 
"Notificaciones en tiempo real": "Real-time notifications",

"Sistema de Recompensas Automático": "Automatic Reward System",
"Acción del Usuario": "User Action",
"Tokens Ganados": "Tokens Earned",
"Categoría": "Category", 
"Límite Diario": "Daily Limit",
"Crear publicación texto": "Create text post",
"Crear publicación imagen": "Create image post",
"Crear publicación video": "Create video post", 
"Recibir like en contenido": "Receive like on content",
"Recibir comentario": "Receive comment",

"Sistema de Límites Inteligentes": "Smart Limit System",
"Implementamos categorías separadas de tokens para prevenir abuso:": 
"We implement separate token categories to prevent abuse:",

"Tokens Propios (50 CFT/día):": "Own Tokens (50 CFT/day):", 
"Generados por tu actividad de publicar": "Generated by your posting activity",
"Tokens Recibidos (100 CFT/día):": "Received Tokens (100 CFT/day):",
"Generados por interacciones de otros usuarios": "Generated by other users' interactions",
"Tokens de Depósito (Ilimitado):": "Deposit Tokens (Unlimited):", 
"Comprados mediante preventas": "Purchased through presales",
"Tokens de Sistema (Ilimitado):": "System Tokens (Unlimited):",
"Recompensas de eventos Chain y premios": "Chain event rewards and prizes",

"Esta separación permite:": "This separation allows:",
"Prevenir farming con bots": "Prevent bot farming", 
"Incentivar contenido de calidad": "Incentivize quality content",
"Mantener economía sostenible": "Maintain sustainable economy",
"Permitir crecimiento orgánico": "Allow organic growth",

"Sistema Chain - Eventos Gamificados": "Chain System - Gamified Events",
"Los usuarios pueden crear tres tipos de eventos con pools de recompensas:": 
"Users can create three types of events with reward pools:",

"Polls (Encuestas Recompensadas)": "Polls (Rewarded Surveys)",
"Funcionamiento:": "Operation:",
"El creador define pregunta y opciones (2-5)": "Creator defines question and options (2-5)",
"Establece recompensa por voto (10-100 CFT)": "Sets reward per vote (10-100 CFT)", 
"Define máximo de participantes (10-1,000)": "Defines maximum participants (10-1,000)",
"Los tokens se descontan del balance del creador": "Tokens are deducted from creator's balance",
"Cada voto otorga CFT instantáneamente al votante": "Each vote grants CFT instantly to voter",

"Ejemplo real en la plataforma:": "Real example on platform:",
"Pregunta:": "Question:",
"Opciones:": "Options:",
"Recompensa:": "Reward:",
"Máximo:": "Maximum:",
"Presupuesto:": "Budget:",

"Campaigns (Campañas de Contenido)": "Campaigns (Content Campaigns)", 
"El creador define un desafío creativo": "Creator defines a creative challenge",
"Establece pool total de recompensas (mínimo 100 CFT)": "Sets total reward pool (minimum 100 CFT)",
"Define número de ganadores (1-100)": "Defines number of winners (1-100)",
"Usuarios participan con contenido (texto/imagen/video/audio)": "Users participate with content (text/image/video/audio)",
"El creador aprueba mejores participaciones manualmente": "Creator manually approves best entries",
"Recompensa se divide entre ganadores aprobados": "Reward is divided among approved winners",

"Desafío:": "Challenge:",
"Pool:": "Pool:",
"Ganadores:": "Winners:",
"Recompensa por ganador:": "Reward per winner:",
"Participaciones recibidas:": "Entries received:",
"Aprobadas:": "Approved:",

"Audio Challenges (Desafíos de Audio)": "Audio Challenges (Audio Challenges)",
"El creador sube audio de referencia (máximo 60 segundos)": "Creator uploads reference audio (maximum 60 seconds)",
"Define pool y ganadores (similar a campaigns)": "Defines pool and winners (similar to campaigns)",
"Participantes responden con su propio audio": "Participants respond with their own audio",
"Ideal para covers, beatbox, imitaciones, podcasts": "Ideal for covers, beatbox, imitations, podcasts",

"Marketplace de Contenido": "Content Marketplace",
"Poner Contenido en Venta:": "Put Content for Sale:",
"Solo el autor original puede poner su contenido en venta": "Only original author can put content for sale",
"Define precio en CFT libremente": "Freely defines price in CFT",
"El contenido se marca como \"en venta\" y aparece en marketplace": "Content is marked as \"for sale\" and appears in marketplace",
"Automáticamente se hace público para que compradores lo vean": "Automatically becomes public for buyers to see",

"Proceso de Compra:": "Purchase Process:",
"Comprador paga el precio establecido en CFT": "Buyer pays established price in CFT",
"90% va al vendedor inmediatamente": "90% goes to seller immediately",
"10% se retiene como comisión de plataforma": "10% retained as platform commission",
"La propiedad se transfiere al comprador": "Ownership transfers to buyer",
"El contenido se remueve automáticamente de la venta": "Content automatically removed from sale",

"Protección al Creador Original:": "Protection for Original Creator:",
"Los compradores NO pueden revender el contenido": "Buyers CANNOT resell the content",
"Solo el autor original tiene derecho a monetizar": "Only original author has right to monetize",
"Previene especulación y flipping": "Prevents speculation and flipping",
"El comprador obtiene \"coleccionable\" único": "Buyer gets unique \"collectible\"",

"Estadísticas en Pruebas:": "Test Statistics:",
"Publicaciones Vendidas": "Posts Sold",
"Precio Promedio": "Average Price",
"CFT en Comisiones": "CFT in Commissions",
"Precio Más Alto": "Highest Price",

"Sistema de Promoción Pagada": "Paid Promotion System",
"Plan": "Plan",
"Costo": "Cost",
"Visibilidad": "Visibility",
"Daily": "Daily",
"10 Days": "10 Days", 
"Monthly": "Monthly",
"+2,000 impresiones": "+2,000 impressions",
"+20,000 impresiones": "+20,000 impressions",
"+60,000 impresiones": "+60,000 impressions",

"Algoritmo de Distribución:": "Distribution Algorithm:",
"El contenido promocionado aparece cada 4 posts orgánicos": "Promoted content appears every 4 organic posts",
"Se mezcla de forma aleatoria para dar exposición equitativa": "Mixed randomly for equal exposure",
"El contenido sigue apareciendo en orden cronológico normal (sin badge)": "Content still appears in normal chronological order (without badge)",
"Adicionalmente aparece como \"destacado\" cada 4 posts (con badge)": "Additionally appears as \"featured\" every 4 posts (with badge)",
"No se repite el mismo contenido promocionado consecutivamente": "Same promoted content not repeated consecutively",

"Promociones Activas/Día": "Active Promotions/Day",
"Ingreso Mensual Actual": "Current Monthly Revenue",
"CTR Promedio": "Average CTR",

"Sistema de Preventas": "Presale System",
"El usuario puede comprar tokens CFT enviando USDT o USDC desde su billetera Proton a la cuenta oficial": 
"User can buy CFT tokens by sending USDT or USDC from their Proton wallet to the official account",

"Proceso:": "Process:",
"Usuario inicia compra desde interfaz web": "User initiates purchase from web interface",
"Especifica monto en USD y billetera Proton": "Specifies amount in USD and Proton wallet",
"Sistema calcula:": "System calculates:",
"CFT base = Monto USD / $0.01": "Base CFT = USD Amount / $0.01",
"CFT bonus = CFT base × 20%": "Bonus CFT = Base CFT × 20%",
"CFT total = CFT base + CFT bonus": "Total CFT = Base CFT + Bonus CFT",
"Usuario envía USDT/USDC a @chainfeed en blockchain Proton": "User sends USDT/USDC to @chainfeed on Proton blockchain",
"Sistema verifica transacción en blockchain automáticamente": "System automatically verifies blockchain transaction",
"Tokens CFT se acreditán instantáneamente en cuenta del usuario, en Chainfeed": "CFT tokens credited instantly to user's Chainfeed account",
"Registro permanente en tabla preventas con transaction_id": "Permanent record in presales table with transaction_id",

"Ejemplo Real:": "Real Example:",
"Usuario envía:": "User sends:",
"CFT base:": "Base CFT:",
"Bonus 20%:": "Bonus 20%:",
"Total recibido:": "Total received:",
"Tiempo de acreditación:": "Credit time:",

"Realiza la Compra": "Makes Purchase",
"Se Procesa": "Processed",
"Se Acredita el Saldo": "Balance Credited",
"Reflejado en su cuenta de Chainfeed": "Reflected in Chainfeed Account",

"Sistema de Moderación": "Moderation System",
"Filtro Automático de Contenido:": "Automatic Content Filter:",
"Base de datos de palabras prohibidas": "Database of prohibited words",
"Bloqueo preventivo antes de publicar": "Preventive blocking before posting",
"Protección contra spam y contenido inapropiado": "Protection against spam and inappropriate content",

"Sistema de Reportes:": "Reporting System:",
"Usuarios pueden reportar contenido inapropiado": "Users can report inappropriate content",
"Genera token único de moderación de 64 caracteres": "Generates unique 64-character moderation token",
"Moderadores revisan con token asignado": "Moderators review with assigned token",
"Si se confirma: contenido eliminado + infracción al autor": "If confirmed: content deleted + infraction to author",

"Infracciones": "Infractions",
"Sanción": "Penalty",
"Bloqueo temporal 1-3 día": "Temporary block 1-3 days",
"Bloqueo temporal 3-5 días": "Temporary block 3-5 days", 
"Bloqueo 7-10 días": "Block 7-10 days",
"Bloqueo 10+ días": "Block 10+ days",

"Wallet y Gestión de Tokens": "Wallet and Token Management",
"Dashboard de Billetera:": "Wallet Dashboard:",
"Balance CFT interno (en plataforma)": "Internal CFT balance (on platform)",
"Balance CFT externo (en billetera Proton)": "External CFT balance (in Proton wallet)",
"Balance total combinado": "Total combined balance",
"Historial completo de transacciones": "Complete transaction history",
"Gráfico de evolución temporal": "Time evolution chart",
"Estadísticas de ganancias/gastos": "Earnings/expenses statistics",

"Sistema de Retiros (Implementado con aprobación manual):": "Withdrawal System (Implemented with manual approval):",
"Mínimo de retiro escalonado:": "Tiered minimum withdrawal:",
"Balance <2,000 CFT → Mínimo 400 CFT": "Balance <2,000 CFT → Minimum 400 CFT",
"Balance 2,000-2,999 CFT → Mínimo 300 CFT": "Balance 2,000-2,999 CFT → Minimum 300 CFT", 
"Balance ≥3,000 CFT → Mínimo 200 CFT": "Balance ≥3,000 CFT → Minimum 200 CFT",
"Restricciones: Solo 1 retiro cada 3 horas por usuario": "Restrictions: Only 1 withdrawal every 3 hours per user",

"Retiros Procesados": "Withdrawals Processed",
"CFT Sin Limites": "CFT Without Limits", 
"Tiempo Aprobación": "Approval Time",

// Modelo Económico
"MODELO ECONÓMICO": "ECONOMIC MODEL",
"Flujo de Valor en la Plataforma": "Value Flow in the Platform",
"ENTRADAS DE VALOR (Ingresos)": "VALUE INPUTS (Revenue)",
"DISTRIBUCIÓN DE VALOR (Egresos)": "VALUE DISTRIBUTION (Expenses)",
"Preventas con bonus 20% → USDT/USDC": "Presales with 20% bonus → USDT/USDC",
"Comisiones marketplace 10% → CFT retenido": "Marketplace commissions 10% → CFT retained",
"Promociones pagadas → CFT retenido": "Paid promotions → CFT retained", 
"Recompensas por publicar → Hasta 50/día": "Posting rewards → Up to 50/day",
"Recompensas por likes → Hasta 100/día": "Like rewards → Up to 100/day",
"Eventos Chain (pools) → Variable": "Chain Events (pools) → Variable",
"Marketplace (90% vendedor) → Directo": "Marketplace (90% seller) → Direct",

"Análisis de Sostenibilidad Actual (perspectiva optimista)": "Current Sustainability Analysis (optimistic perspective)",
"Con 1,000 Usuarios Activos Diarios:": "With 1,000 Daily Active Users:",
"Egreso Máximo Teórico:": "Maximum Theoretical Expense:",
"1,000 usuarios × 150 CFT/día = 150,000 CFT/día": "1,000 users × 150 CFT/day = 150,000 CFT/day",
"Mensual: 4,500,000 CFT": "Monthly: 4,500,000 CFT",
"En USD (a $0.01): $45,000/mes": "In USD (at $0.01): $45,000/month",

"Con Ingresos :": "With Revenue:",
"Preventas: ~$150/mes": "Presales: ~$150/month",
"Marketplace: ~$80/mes (10% de $800 volumen)": "Marketplace: ~$80/month (10% of $800 volume)",
"Promociones: ~$80/mes": "Promotions: ~$80/month",
"Total: $310/mes": "Total: $310/month",

"Ratio Sostenibilidad:": "Sustainability Ratio:",
"¿Por Qué Esto es Viable?": "Why is This Viable?",

"No Todos Usan el Máximo Diario": "Not Everyone Uses Maximum Daily",
"Usuario promedio: 30 CFT/día (no 150)": "Average user: 30 CFT/day (not 150)",
"Egreso real: ~$9,000/mes (no $45,000)": "Real expense: ~$9,000/month (not $45,000)",
"Ratio real: $310 / $9,000 = 3.4%": "Real ratio: $310 / $9,000 = 3.4%",

"Los Límites Previenen Colapso": "Limits Prevent Collapse",
"Sin límites, bots farmerían infinitamente": "Without limits, bots would farm infinitely",
"Con límites, crecimiento es predecible": "With limits, growth is predictable",
"Escalabilidad controlada matemáticamente": "Mathematically controlled scalability",

"Tokens Permanecen en Ecosistema": "Tokens Remain in Ecosystem",
"Solo ~5% de usuarios retiran": "Only ~5% of users withdraw",
"95% reinvierten en promociones/eventos/marketplace": "95% reinvest in promotions/events/marketplace",
"Velocidad de circulación crea economía interna": "Circulation velocity creates internal economy",

"Crecimiento de Ingresos es Más Rápido": "Revenue Growth is Faster",
"A 10,000 usuarios: ~$3,100/mes ingreso (10x)": "At 10,000 users: ~$3,100/month revenue (10x)",
"Egreso solo crece ~$90,000/mes (10x)": "Expense only grows ~$90,000/month (10x)",
"Ratio mejora: $3,100 / $90,000 = 3.4% (se mantiene)": "Ratio improves: $3,100 / $90,000 = 3.4% (maintained)",

"Proyección Conservadora de Equilibrio": "Conservative Break-even Projection",
"Ingreso Mensual": "Monthly Revenue",
"Egreso Mensual": "Monthly Expense",
"Estado": "Status",
"Déficit controlado": "Controlled deficit",

"Punto de Equilibrio (Breakeven):": "Break-even Point:",
"Necesario: Ratio ~30% (asumiendo 70% reinversión interna)": "Required: Ratio ~30% (assuming 70% internal reinvestment)",
"Con mejoras de monetización y adopción creciente": "With monetization improvements and growing adoption",
"Estimado: 200,000-500,000 usuarios activos": "Estimated: 200,000-500,000 active users",

// Tokenomics
"TOKENOMICS CFT": "CFT TOKENOMICS",
"Especificaciones Técnicas del Token": "Token Technical Specifications",
"Nombre:": "Name:",
"ChainFeed Token": "ChainFeed Token",
"Símbolo:": "Symbol:",
"Blockchain:": "Blockchain:",
"Proton (XPR Network)": "Proton (XPR Network)",
"Contrato:": "Contract:",
"Decimales:": "Decimals:",
"Precio Fijo:": "Fixed Price: ",
"Tipo:": "Type:",
"Utility Token (no security)": "Utility Token (not security)",

"Supply del CFT v1 (Primera Versión)": "CFT v1 Supply (First Version)",
"Asignación": "Allocation",
"Tokens": "Tokens",
"%": "%",
"Estado Actual": "Current Status",
"Uso": "Use",
"Preventas Públicas": "Public Presales",
"Recompensas Usuarios": "User Rewards",
"Desarrollo": "Development",
"Marketing/Liquidez": "Marketing/Liquidity",
"Total Supply v1": "Total Supply v1",
"En circulación": "In circulation",
"$1M USD valoración": "$1M USD valuation",

"Tokens Actualmente en Circulación:": "Tokens Currently in Circulation:",
"Distribuidos como recompensas: ~500,000 CFT": "Distributed as rewards: ~500,000 CFT",
"Vendidos en preventas: ~150,000 CFT": "Sold in presales: ~150,000 CFT",
"En pools de eventos Chain: ~50,000 CFT": "In Chain event pools: ~50,000 CFT",
"Total circulante: ~700,000 CFT (0.7% del supply)": "Total circulating: ~700,000 CFT (0.7% of supply)",

"Sistema de Tokens Versionados": "Versioned Token System",
"Innovación de Escalabilidad:": "Scalability Innovation:",
"Cuando el supply de CFT v1 (100M) se agote por demanda, el sistema genera automáticamente una nueva versión:":
"When CFT v1 supply (100M) is exhausted by demand, the system automatically generates a new version:",

"CFT v1 (100M supply) → Se agota por demanda": "CFT v1 (100M supply) → Exhausted by demand",
"CFTA v2 (100M supply) → Nueva versión generada automáticamente": "CFTA v2 (100M supply) → New version automatically generated",
"CFTB v3 (100M supply) → Si CFTA se agota": "CFTB v3 (100M supply) → If CFTA is exhausted",
"... infinitamente escalable": "... infinitely scalable",

"Reglas de Intercambio:": "Exchange Rules:",
"Ratio fijo: 1 CFT = 1 CFTA = 1 CFTB (siempre)": "Fixed ratio: 1 CFT = 1 CFTA = 1 CFTB (always)",
"Precio fijo: Todas las versiones valen $0.01 USD": "Fixed price: All versions worth $0.01 USD",
"Compatibilidad total: Todos se aceptan en la plataforma": "Full compatibility: All accepted on platform",
"Intercambio libre: Los usuarios pueden convertir entre versiones cuando deseen": "Free exchange: Users can convert between versions when desired",
"No hay inflación: Cada versión tiene supply fijo de 100M": "No inflation: Each version has fixed 100M supply",

"Beneficios del Sistema:": "System Benefits:",
"Escalabilidad matemáticamente infinita": "Mathematically infinite scalability",
"No hay escasez artificial que frene crecimiento": "No artificial scarcity to hinder growth",
"Valor preservado para holders de versiones antiguas": "Value preserved for holders of old versions",
"Supply predecible y controlado por versión": "Predictable and controlled supply per version",
"Previene especulación destructiva": "Prevents destructive speculation",

"Mecanismos de Control de Inflación": "Inflation Control Mechanisms",
"Límites Diarios por Categoría": "Daily Limits by Category",
"Máximo teórico: 150 CFT/usuario/día": "Theoretical maximum: 150 CFT/user/day",
"Real promedio: 30 CFT/usuario/día": "Real average: 30 CFT/user/day",
"Previene farming masivo": "Prevents massive farming",
"Incentiva calidad sobre cantidad": "Incentivizes quality over quantity",

"Tokens Bloqueados en Pools": "Tokens Locked in Pools",
"Eventos Chain activos retienen CFT temporalmente": "Active Chain Events temporarily retain CFT",
"Reduce supply circulante efectivo": "Reduces effective circulating supply",
"Presión deflacionaria natural": "Natural deflationary pressure",
"Ejemplo: 50 eventos × 2,000 CFT = 100,000 CFT bloqueados": "Example: 50 events × 2,000 CFT = 100,000 CFT locked",

"Comisiones del Marketplace": "Marketplace Commissions",
"10% de cada venta se retiene (no vuelve a circular inmediatamente)": "10% of each sale retained (doesn't immediately recirculate)",
"Funciona como mini-quemado temporal": "Functions as temporary mini-burn",
"Puede ser quemado permanentemente vía DAO (futuro)": "Can be permanently burned via DAO (future)",

"Reinversión Interna": "Internal Reinvestment",
"~95% de usuarios no retiran, reinvierten": "~95% of users don't withdraw, reinvest",
"CFT circula dentro del ecosistema": "CFT circulates within ecosystem",
"Crea economía cerrada funcional": "Creates functional closed economy",
"Reduce presión vendedora externa": "Reduces external selling pressure",

"Proyección de Agotamiento del Supply v1": "v1 Supply Exhaustion Projection",
"Escenario": "Scenario",
"Tiempo Estimado": "Estimated Time",
"Transición": "Transition",
"Conservador": "Conservative",
"Moderado": "Moderate",
"Optimista": "Optimistic",
"A CFTA v2": "To CFTA v2",

"Nota: La transición es transparente y automática para los usuarios. No afecta su balance ni valor.":
"Note: Transition is transparent and automatic for users. Does not affect their balance or value.",

// ==========================================
// TRADUCCIONES PARA WHITEPAPER - PARTE 2
// ==========================================

// Casos de Uso
"📱 CASOS DE USO REALES": "📱 REAL USE CASES",
"Caso 1: Creador de Contenido Pequeño": "Case 1: Small Content Creator",
"Perfil:": "Profile:",
"150 seguidores": "150 followers",
"Publica 3-5 memes diarios": "Posts 3-5 memes daily",
"Uso: 4 meses activo": "Usage: 4 months active",

"Actividad Real:": "Real Activity:",
"Publicaciones creadas:": "Posts created:",
"Tokens ganados publicando:": "Tokens earned posting:",
"Likes recibidos:": "Likes received:",
"Tokens por likes:": "Tokens from likes:",
"Total ganado:": "Total earned:",

"Monetización:": "Monetization:",
"Vendió 5 memes virales a 200 CFT cada uno": "Sold 5 viral memes at 200 CFT each",
"Ingreso por ventas:": "Sales income:",
"Comisión plataforma:": "Platform commission:",
"Total ingreso neto:": "Total net income:",

"Balance Final:": "Final Balance:",
"Ganado:": "Earned:",
"Vendido:": "Sold:",
"Gastado en promociones:": "Spent on promotions:",
"Retirado a Proton:": "Withdrawn to Proton:",
"ROI: $30 USD en 4 meses sin inversión inicial.": "ROI: $30 USD in 4 months without initial investment.",

"Caso 2: Usuario Activo Regular": "Case 2: Regular Active User",
"Comenta y participa frecuentemente": "Comments and participates frequently",
"Uso: 6 meses activo": "Usage: 6 months active",
"Participaciones en 12 eventos Chain (polls)": "Participations in 12 Chain events (polls)",
"Tokens ganados en polls:": "Tokens earned in polls:",
"Uso de Tokens:": "Token Usage:",
"Compró 3 publicaciones en marketplace:": "Bought 3 posts in marketplace:",
"Creó 2 polls propios:": "Created 2 own polls:",
"Balance actual:": "Current balance:",
"Comportamiento: Reinvierte tokens en la plataforma, no retira.": "Behavior: Reinvests tokens in platform, doesn't withdraw.",

"Caso 3: Marca/Empresa Pequeña": "Case 3: Small Brand/Business",
"Promociona productos": "Promotes products",
"Uso: 2 meses activo": "Usage: 2 months active",
"Inversión Inicial:": "Initial Investment:",
"Compra en preventa:": "Presale purchase:",
"Recibido:": "Received:",
"Gastos en Marketing:": "Marketing Expenses:",
"6 promociones monthly:": "6 monthly promotions:",
"2 campaigns con 5,000 CFT de pool cada una:": "2 campaigns with 5,000 CFT pool each:",
"Total gastado:": "Total spent:",
"Resultados:": "Results:",
"Impresiones totales:": "Total impressions:",
"Clicks a tienda externa:": "Clicks to external store:",
"Conversiones estimadas:": "Estimated conversions:",
"Ingreso externo generado:": "External income generated:",
"ROI: Invirtió $100 USD en CFT, generó $3,000 USD en ventas externas. Ratio: 30x retorno sobre inversión.": "ROI: Invested $100 USD in CFT, generated $3,000 USD in external sales. Ratio: 30x return on investment.",

"Caso 4: Artista Digital": "Case 4: Digital Artist",
"Sube ilustraciones originales": "Uploads original illustrations",
"Uso: 5 meses activo": "Usage: 5 months active",
"Publicaciones (ilustraciones):": "Posts (illustrations):",
"Tokens ganados publicando:": "Tokens earned posting:",
"Monetización Marketplace:": "Marketplace Monetization:",
"12 ilustraciones puestas en venta": "12 illustrations put for sale",
"Precio promedio:": "Average price:",
"8 vendidas exitosamente": "8 successfully sold",
"Ingreso bruto:": "Gross income:",
"Ingreso neto ventas:": "Net sales income:",
"Balance Total:": "Total Balance:",
"Ganado orgánico:": "Organic earnings:",
"Ganado por ventas:": "Earnings from sales:",
"Retirado: 10,000 CFT ($100 USD) en 5 meses sin inversión inicial.": "Withdrawn: 10,000 CFT ($100 USD) in 5 months without initial investment.",
"Comparación con Plataformas Tradicionales:": "Comparison with Traditional Platforms:",
"Instagram: $0 (no alcanza requisitos)": "Instagram: $0 (doesn't meet requirements)",
"DeviantArt: Requiere premium + comisión 20-30%": "DeviantArt: Requires premium + 20-30% commission",
"ChainFeed: $100 en 5 meses con 220 seguidores": "ChainFeed: $100 in 5 months with 220 followers",

// Modelo de Negocio
"💼 MODELO DE NEGOCIO": "💼 BUSINESS MODEL",
"Fuentes de Ingreso Actuales": "Current Revenue Sources",
"Preventas de Tokens CFT": "CFT Token Presales",
"Datos Reales:": "Real Data:",
"Ticket promedio:": "Average ticket:",
"Frecuencia:": "Frequency:",
"Conversión:": "Conversion:",
"Ingreso mensual actual:": "Current monthly income:",
"Usuarios Totales": "Total Users",
"Conversión 3%": "3% Conversion",
"Ticket $50": "$50 Ticket",
"Ingreso Mensual": "Monthly Income",
"30 compradores": "30 buyers",
"150 compradores": "150 buyers",
"300 compradores": "300 buyers",
"1,500 compradores": "1,500 buyers",

"Comisiones del Marketplace": "Marketplace Commissions",
"Mecánica:": "Mechanics:",
"10% de cada transacción se retiene": "10% of each transaction retained",
"Vendedor recibe 90% instantáneamente": "Seller receives 90% instantly",
"Comisión queda en tesorería plataforma": "Commission remains in platform treasury",
"Transacciones/mes:": "Transactions/month:",
"Precio promedio:": "Average price:",
"Volumen mensual:": "Monthly volume:",
"Comisión mensual:": "Monthly commission:",

"Promociones Pagadas": "Paid Promotions",
"Promociones activas promedio:": "Average active promotions:",
"Plan más usado:": "Most used plan:",
"Uso mensual:": "Monthly usage:",

"Resumen de Ingresos Actuales": "Current Income Summary",
"Mes Típico (1,000 usuarios activos):": "Typical Month (1,000 active users):",
"Total Bruto:": "Total Gross:",
"Proyección 10,000 Usuarios:": "10,000 Users Projection:",
"Proyección 50,000 Usuarios:": "50,000 Users Projection:",

"Estructura de Costos Actual": "Current Cost Structure",
"Concepto": "Concept",
"Costo Mensual": "Monthly Cost",
"Servidor Web (VPS)": "Web Server (VPS)",
"Base de Datos (MySQL)": "Database (MySQL)",
"Storage (media)": "Storage (media)",
"Dominio + SSL": "Domain + SSL",
"Blockchain fees": "Blockchain fees",
"Total Infraestructura": "Total Infrastructure",
"Desarrollo:": "Development:",
"Proyecto unipersonal": "Single-person project",
"Sin salario (fundador bootstrap)": "No salary (founder bootstrap)",
"Inversión de tiempo:": "Time investment:",

"Análisis de Margen": "Margin Analysis",
"Situación Actual (1,000 usuarios):": "Current Situation (1,000 users):",
"Ingresos:": "Revenue:",
"Gastos:": "Expenses:",
"Margen:": "Margin:",
"Proyección 10,000 Usuarios:": "10,000 Users Projection:",
"Proyección 50,000 Usuarios:": "50,000 Users Projection:",
"Conclusión: El modelo es rentable incluso a pequeña escala actual. Los márgenes mejoran con crecimiento por economías de escala.": "Conclusion: The model is profitable even at current small scale. Margins improve with growth due to economies of scale.",

"Fuentes de Ingreso Futuras (Roadmap)": "Future Revenue Sources (Roadmap)",
"Próximos 12-24 Meses:": "Next 12-24 Months:",
"API Premium para Developers": "Premium API for Developers",
"Gratuita: 1,000 requests/día": "Free: 1,000 requests/day",
"Premium: $49 USD/mes por uso ilimitado": "Premium: $49 USD/month for unlimited use",
"Proyección: 50 developers pagando = $2,450/mes adicional": "Projection: 50 paying developers = $2,450/month additional",
"Staking con APY": "Staking with APY",
"Usuarios bloquean CFT por rewards": "Users lock CFT for rewards",
"Reduce supply circulante": "Reduces circulating supply",
"No genera ingreso directo, mejora tokenomics": "Doesn't generate direct income, improves tokenomics",
"Subscripciones de Creadores": "Creator Subscriptions",
"Modelo Patreon-style con CFT": "Patreon-style model with CFT",
"Comisión 15% (vs 12% de Patreon)": "15% commission (vs Patreon's 12%)",
"Proyección: 100 creadores × $20 promedio × 15% = $300/mes": "Projection: 100 creators × $20 average × 15% = $300/month",
"NFTs de Coleccionables": "Collectible NFTs",
"Publicaciones especiales como NFTs únicos": "Special posts as unique NFTs",
"Comisión 5% en secondary sales": "5% commission on secondary sales",
"Proyección: $500/mes en volumen = $25/mes": "Projection: $500/month volume = $25/month",
"White-Label para Empresas": "White-Label for Businesses",
"Versión privada de ChainFeed para corporaciones": "Private ChainFeed version for corporations",
"Licencia: $5,000 USD setup + $500/mes": "License: $5,000 USD setup + $500/month",
"Proyección: 2 clientes = $11,000 año 1": "Projection: 2 clients = $11,000 year 1",

// Análisis de Mercado
"📊 ANÁLISIS DE MERCADO": "📊 MARKET ANALYSIS",
"Tamaño del Mercado (TAM/SAM/SOM)": "Market Size (TAM/SAM/SOM)",
"TAM (Total Addressable Market):": "TAM (Total Addressable Market):",
"Economía de creadores global:": "Global creator economy:",
"Proyección 2030:": "Projection 2030:",
"CAGR:": "CAGR:",
"SAM (Serviceable Available Market):": "SAM (Serviceable Available Market):",
"Creadores de contenido digitales:": "Digital content creators:",
"Usuarios activos en social media:": "Active social media users:",
"Mercado crypto-nativo:": "Crypto-native market:",
"Intersección (creadores + crypto):": "Intersection (creators + crypto):",
"SOM (Serviceable Obtainable Market - 3 años):": "SOM (Serviceable Obtainable Market - 3 years):",
"Meta conservadora:": "Conservative goal:",
"1% del mercado crypto-creator": "1% of crypto-creator market",
"Valoración implícita:": "Implied valuation:",

"Análisis Competitivo Detallado": "Detailed Competitive Analysis",
"Competidor 1: Steemit": "Competitor 1: Steemit",
"Fortalezas:": "Strengths:",
"Pionero (2016), marca establecida": "Pioneer (2016), established brand",
"1M+ usuarios registrados": "1M+ registered users",
"Modelo probado de rewards": "Proven reward model",
"Debilidades:": "Weaknesses:",
"Interfaz anticuada (UI de 2016)": "Outdated interface (2016 UI)",
"Inflación descontrolada de tokens": "Uncontrolled token inflation",
"Complejidad técnica alta": "High technical complexity",
"Comunidad estancada": "Stagnant community",
"Ventaja ChainFeed:": "ChainFeed Advantage:",
"UI moderna, mobile-first": "Modern UI, mobile-first",
"Límites diarios previenen inflación": "Daily limits prevent inflation",
"Onboarding simplificado": "Simplified onboarding",
"Sistema Chain (gamificación única)": "Chain System (unique gamification)",

"Competidor 2: Lens Protocol": "Competitor 2: Lens Protocol",
"Respaldo de Aave ($15M fundraising)": "Backed by Aave ($15M fundraising)",
"Tecnología descentralizada avanzada": "Advanced decentralized technology",
"Enfoque en composability": "Focus on composability",
"Extremadamente técnico": "Extremely technical",
"Sin revenue model claro": "No clear revenue model",
"Adoption lenta (120K usuarios en 2 años)": "Slow adoption (120K users in 2 years)",
"Gas fees altos (Polygon)": "High gas fees (Polygon)",
"Producto simple y funcional": "Simple and functional product",
"Revenue model claro desde día 1": "Clear revenue model from day 1",
"Blockchain gratuito (Proton)": "Free blockchain (Proton)",
"Enfoque en usabilidad sobre descentralización": "Focus on usability over decentralization",

"Competidor 3: Friend.tech": "Competitor 3: Friend.tech",
"Crecimiento viral rápido (800K usuarios en 6 meses)": "Viral growth (800K users in 6 months)",
"Modelo innovador de \"keys\"": "Innovative \"keys\" model",
"COLAPSÓ en 2024": "COLLAPSED in 2024",
"Modelo Ponzi insostenible": "Unsustainable Ponzi model",
"Especulación sin utilidad real": "Speculation without real utility",
"Perdió 95% de usuarios": "Lost 95% of users",
"Modelo sostenible con utilidad real": "Sustainable model with real utility",
"No depende de especulación": "Doesn't depend on speculation",
"Enfoque en contenido, no trading": "Focus on content, not trading",
"Economía matemáticamente viable": "Mathematically viable economy",

"Competidor 4: Farcaster": "Competitor 4: Farcaster",
"Respaldo de a16z crypto": "Backed by a16z crypto",
"Tecnología descentralizada robusta": "Robust decentralized technology",
"350K usuarios (early 2024)": "350K users (early 2024)",
"Requiere pagar $5 USD para registrarse": "Requires $5 USD payment to register",
"Demasiado técnico para masas": "Too technical for masses",
"Sin sistema de rewards directo": "No direct reward system",
"Enfoque solo en descentralización": "Focus only on decentralization",
"Registro gratuito, ganas tokens desde día 1": "Free registration, earn tokens from day 1",
"Rewards automáticos por uso": "Automatic rewards for usage",
"Balance entre usabilidad y descentralización": "Balance between usability and decentralization",
"Marketplace y gamificación integrados": "Integrated marketplace and gamification",

"Posicionamiento de ChainFeed": "ChainFeed Positioning",
"Alta Descentralización": "High Decentralization",
"Baja Complejidad": "Low Complexity",
"Alta Complejidad": "High Complexity",
"Propuesta Única:": "Unique Proposition:",
"Suficientemente descentralizado para atraer Web3": "Decentralized enough to attract Web3",
"Suficientemente simple para atraer Web2": "Simple enough to attract Web2",
"Rewards inmediatos (vs competitors que requieren inversión)": "Immediate rewards (vs competitors requiring investment)",
"Modelo económico sostenible (vs Ponzis que colapsan)": "Sustainable economic model (vs collapsing Ponzis)",

"Oportunidades de Mercado": "Market Opportunities",
"Insatisfacción Creciente con Web2": "Growing Dissatisfaction with Web2",
"Creadores frustrados con algoritmos opacos": "Creators frustrated with opaque algorithms",
"Monetización cada vez más difícil": "Increasingly difficult monetization",
"Buscando alternativas activamente": "Actively seeking alternatives",
"Maduración de Web3": "Web3 Maturation",
"Billeteras más simples (Proton sin gas fees)": "Simpler wallets (Proton without gas fees)",
"Onboarding mejorado": "Improved onboarding",
"Menos fricción técnica": "Less technical friction",
"Regulación Clarificándose": "Clarifying Regulation",
"Utility tokens cada vez más aceptados": "Utility tokens increasingly accepted",
"Jurisprudencia favorable para plataformas": "Favorable jurisprudence for platforms",
"Mayor certeza legal": "Greater legal certainty",
"Timing Post-Halving Bitcoin": "Post-Bitcoin Halving Timing",
"Bull market crypto 2024-2025": "Crypto bull market 2024-2025",
"Interés renovado en aplicaciones blockchain": "Renewed interest in blockchain applications",
"Capital disponible para proyectos sólidos": "Available capital for solid projects",

// Riesgos y Mitigaciones
"⚠️ RIESGOS Y MITIGACIONES": "⚠️ RISKS AND MITIGATIONS",
"Riesgo 1: Escalabilidad Técnica": "Risk 1: Technical Scalability",
"Descripción: Con crecimiento rápido a 10,000+ usuarios, la infraestructura actual (1 servidor VPS) podría saturarse.": "Description: With rapid growth to 10,000+ users, current infrastructure (1 VPS server) could become saturated.",
"Probabilidad:": "Probability:",
"Impacto:": "Impact:",
"Alta": "High",
"Alto": "High",
"Media": "Medium",
"Crítico": "Critical",
"Mitigación Implementada:": "Implemented Mitigation:",
"Base de datos optimizada con índices": "Database optimized with indexes",
"Queries con LIMIT y paginación": "Queries with LIMIT and pagination",
"CDN para contenido multimedia (Cloudflare)": "CDN for multimedia content (Cloudflare)",
"Caché de consultas frecuentes": "Cache for frequent queries",
"Mitigación Futura:": "Future Mitigation:",
"Migración a arquitectura escalable (AWS/GCP)": "Migration to scalable architecture (AWS/GCP)",
"Balanceador de carga con múltiples servidores": "Load balancer with multiple servers",
"Base de datos distribuida (sharding)": "Distributed database (sharding)",
"Presupuesto: $500-$1,000/mes a partir de 10K usuarios": "Budget: $500-$1,000/month from 10K users",

"Riesgo 2: Farming y Abuso del Sistema": "Risk 2: Farming and System Abuse",
"Descripción: Usuarios malintencionados crean múltiples cuentas o bots para farmear tokens ilimitadamente.": "Description: Malicious users create multiple accounts or bots to farm tokens unlimitedly.",
"Límites diarios por categoría (innovación core)": "Daily limits by category (core innovation)",
"Detección de patrones sospechosos": "Detection of suspicious patterns",
"Filtro anti-spam en publicaciones": "Anti-spam filter in posts",
"Sistema de reportes comunitario": "Community reporting system",
"Cooldowns en acciones consecutivas": "Cooldowns on consecutive actions",
"Efectividad Demostrada:": "Demonstrated Effectiveness:",
"18 meses sin incidentes graves de farming": "18 months without serious farming incidents",
"Solo 2 usuarios bloqueados por abuso": "Only 2 users blocked for abuse",
"Sistema de límites funcionó como diseñado": "Limit system worked as designed",

"Riesgo 3: Regulación Crypto Adversa": "Risk 3: Adverse Crypto Regulation",
"Descripción: Gobiernos podrían clasificar CFT como security, requiriendo licencias costosas o prohibiendo operaciones.": "Description: Governments could classify CFT as security, requiring expensive licenses or prohibiting operations.",
"CFT es utility token, no security:": "CFT is utility token, not security:",
"Uso real en plataforma (no solo inversión)": "Real usage in platform (not just investment)",
"Precio fijo de $0.01 (no especulativo)": "Fixed price of $0.01 (not speculative)",
"No promesas de ganancias": "No profit promises",
"Precedentes Favorables:": "Favorable Precedents:",
"Casos como SEC vs Ripple estableciendo criterios": "Cases like SEC vs Ripple establishing criteria",
"Utility tokens generalmente no clasificados como securities": "Utility tokens generally not classified as securities",
"Proton blockchain no tiene issues regulatorios": "Proton blockchain has no regulatory issues",

"Riesgo 4: Competencia de Gigantes Tech": "Risk 4: Competition from Tech Giants",
"Descripción: Meta, Twitter/X o TikTok lanzan sistema de recompensas similar con recursos infinitamente mayores.": "Description: Meta, Twitter/X or TikTok launch similar reward system with infinitely greater resources.",
"Mitigación por Diferenciación:": "Mitigation by Differentiation:",
"Autenticidad crypto-native: Comunidad Web3 desconfía de big tech": "Crypto-native authenticity: Web3 community distrusts big tech",
"Network effects propios: Difícil replicar comunidad leal establecida": "Own network effects: Hard to replicate established loyal community",
"Velocidad: Pequeños innovan más rápido que corporaciones": "Speed: Small entities innovate faster than corporations",
"Nichos específicos: Sistema Chain único, no replicable fácilmente": "Specific niches: Unique Chain System, not easily replicable",
"Posible Resultado Positivo:": "Possible Positive Outcome:",
"Si copian bien, valida el modelo": "If they copy well, validates the model",
"Aumenta valoración para adquisición": "Increases valuation for acquisition",
"ChainFeed se vuelve \"pure play\" atractivo para compra": "ChainFeed becomes attractive \"pure play\" for purchase",

"Riesgo 5: Volatilidad del Mercado Crypto": "Risk 5: Crypto Market Volatility",
"Descripción: Bear market prolongado reduce interés en tokens y preventas caen dramáticamente.": "Description: Prolonged bear market reduces interest in tokens and presales drop dramatically.",
"Alta (cíclico)": "High (cyclical)",
"Medio": "Medium",
"Precio fijo $0.01: CFT no especula, es utility estable": "Fixed price $0.01: CFT doesn't speculate, is stable utility",
"Ingresos diversificados: Marketplace + promociones siguen funcionando": "Diversified revenue: Marketplace + promotions keep working",
"Modelo freemium: Usuarios pueden usar gratis sin comprar CFT": "Freemium model: Users can use for free without buying CFT",

"Riesgo 6: Dependencia de Fundador Único": "Risk 6: Single Founder Dependency",
"Descripción: Proyecto desarrollado por una sola persona. Si el fundador no puede continuar, proyecto se detiene.": "Description: Project developed by single person. If founder cannot continue, project stops.",
"Mitigación Necesaria:": "Required Mitigation:",
"Documentación exhaustiva de código y arquitectura": "Comprehensive code and architecture documentation",
"Repositorio GitHub privado accesible a inversores": "Private GitHub repository accessible to investors",
"Runbooks para operación y mantenimiento": "Runbooks for operation and maintenance",
"Bus factor >1: Contratar 1-2 developers en primeros $50K de funding": "Bus factor >1: Hire 1-2 developers with first $50K funding",
"Prioridad Post-Funding: Primer uso de capital debe ser contratar CTO/Senior Dev para reducir dependencia.": "Post-Funding Priority: First capital use should be hiring CTO/Senior Dev to reduce dependency.",

// Roadmap
"🗓️ ROADMAP REALISTA": "🗓️ REALISTIC ROADMAP",
"Filosofía del Roadmap: Este roadmap refleja lo que es factualmente alcanzable con los recursos actuales (1 developer) y futuros (con funding). No incluye promesas inalcanzables.": "Roadmap Philosophy: This roadmap reflects what is factually achievable with current resources (1 developer) and future ones (with funding). Does not include unattainable promises.",
"Q1 2024 - Q2 2026: Consolidación ✅ COMPLETADO": "Q1 2024 - Q2 2026: Consolidation ✅ COMPLETED",
"Objetivo: Estabilizar producto y llegar a 1,000 usuarios.": "Objective: Stabilize product and reach 1,000 users.",
"✅ Lanzamiento MVP en producción": "✅ MVP launch in production",
"✅ Sistema de recompensas automático funcional": "✅ Functional automatic reward system",
"✅ Marketplace de contenido operativo": "✅ Operational content marketplace",
"✅ Sistema Chain (polls, campaigns, audio)": "✅ Chain System (polls, campaigns, audio)",
"✅ Integración Proton blockchain": "✅ Proton blockchain integration",
"✅ Sistema de promociones pagadas": "✅ Paid promotion system",
"✅ Sistema de preventas con bonus 20%": "✅ Presale system with 20% bonus",
"✅ Dashboard de billetera completo": "✅ Complete wallet dashboard",
"✅ Sistema de moderación básico": "✅ Basic moderation system",
"✅ 1,000+ usuarios activos": "✅ 1,000+ active users",
"Resultado: ✅ Objetivos alcanzados. Plataforma estable y funcional.": "Result: ✅ Objectives achieved. Stable and functional platform.",

"Q3 2026: Mejoras y Optimización 🚧 EN PROGRESO": "Q3 2026: Improvements and Optimization 🚧 IN PROGRESS",
"Objetivo: Optimizar experiencia y reducir fricción. Meta: 2,500 usuarios.": "Objective: Optimize experience and reduce friction. Goal: 2,500 users.",
"Desarrollo (3 meses):": "Development (3 months):",
"Sistema de notificaciones mejorado (push notifications)": "Improved notification system (push notifications)",
"Búsqueda avanzada de contenido (hashtags, usuarios)": "Advanced content search (hashtags, users)",
"Mensajería directa básica (texto)": "Basic direct messaging (text)",
"Mejoras de performance y caché": "Performance and cache improvements",
"Compresión automática de imágenes/videos": "Automatic image/video compression",
"Sistema de backup automatizado": "Automated backup system",
"Documentación técnica completa": "Complete technical documentation",
"Marketing (paralelo):": "Marketing (parallel):",
"Campaña con 10 micro-influencers crypto ($500)": "Campaign with 10 crypto micro-influencers ($500)",
"Contenido educativo (YouTube, Medium)": "Educational content (YouTube, Medium)",
"Presencia en foros crypto (Reddit, Bitcointalk)": "Presence in crypto forums (Reddit, Bitcointalk)",
"Recursos Necesarios:": "Required Resources:",

"Q4 2026: Expansión de Features": "Q4 2026: Feature Expansion",
"Objetivo: Añadir features diferenciadores. Meta: 5,000 usuarios.": "Objective: Add differentiating features. Goal: 5,000 users.",
"Si se consigue funding ($50K+):": "If funding obtained ($50K+):",
"Contratar 1 developer adicional": "Hire 1 additional developer",
"Sistema de grupos/comunidades": "Groups/communities system",
"API pública beta (documentada)": "Public API beta (documented)",
"Mejoras en Sistema Chain (nuevos tipos de eventos)": "Chain System improvements (new event types)",
"Dashboard de analytics para creadores": "Analytics dashboard for creators",
"Sistema de badges y logros": "Badges and achievements system",
"Si NO se consigue funding:": "If funding NOT obtained:",
"Priorizar solo: Grupos básicos + API simple": "Priorize only: Basic groups + simple API",
"Desarrollo más lento (6 meses en vez de 3)": "Slower development (6 months instead of 3)",

"Q1 2027: Monetización Avanzada": "Q1 2027: Advanced Monetization",
"Objetivo: Diversificar ingresos. Meta: 10,000 usuarios.": "Objective: Diversify income. Goal: 10,000 users.",
"Con funding:": "With funding:",
"Staking con APY (incentiva holding)": "Staking with APY (incentivizes holding)",
"API premium para developers ($49/mes)": "Premium API for developers ($49/month)",
"Sistema de subscripciones a creadores": "Creator subscription system",
"Integración Stripe para compras fiat directas": "Stripe integration for direct fiat purchases",
"Mejoras en marketplace (subastas, ofertas)": "Marketplace improvements (auctions, offers)",
"Sin funding:": "Without funding:",
"Solo staking básico + API free tier": "Only basic staking + API free tier",

"2026: Escalamiento y Descentralización": "2026: Scaling and Decentralization",
"Objetivo: Preparar para 50,000+ usuarios y estructura DAO.": "Objective: Prepare for 50,000+ users and DAO structure.",
"Fase 1 (Q1-Q2 2026):": "Phase 1 (Q1-Q2 2026):",
"Migración a infraestructura escalable (AWS/GCP)": "Migration to scalable infrastructure (AWS/GCP)",
"Multi-chain (Ethereum, BSC, Polygon)": "Multi-chain (Ethereum, BSC, Polygon)",
"OAuth (login Google, Twitter, Discord)": "OAuth (Google, Twitter, Discord login)",
"Transmisiones en vivo beta": "Live streaming beta",
"Mobile apps (iOS, Android)": "Mobile apps (iOS, Android)",
"Fase 2 (Q3-Q4 2026):": "Phase 2 (Q3-Q4 2026):",
"Formación de DAO": "DAO formation",
"Gobernanza con CFT": "Governance with CFT",
"Programa de grants para developers": "Grants program for developers",
"Whitepaper técnico descentralización": "Technical decentralization whitepaper",
"Nota: Esta fase requiere Serie A funding o crecimiento orgánico muy fuerte.": "Note: This phase requires Series A funding or very strong organic growth.",

"Hitos de Fundraising": "Fundraising Milestones",
"Milestone 1: Seed Round ($50K-$100K)": "Milestone 1: Seed Round ($50K-$100K)",
"Desbloquea: Q3 2025 acelerado + 1 developer": "Unlocks: Q3 2025 accelerated + 1 developer",
"Uso: Salarios + marketing + infraestructura": "Use: Salaries + marketing + infrastructure",
"Milestone 2: Pre-Serie A ($500K)": "Milestone 2: Pre-Series A ($500K)",
"Desbloquea: 2026 completo + equipo 5 personas": "Unlocks: Complete 2026 + 5-person team",
"Uso: Producto maduro + escalamiento global": "Use: Mature product + global scaling",
"Milestone 3: Serie A ($2M-$5M)": "Milestone 3: Series A ($2M-$5M)",
"Desbloquea: Expansión internacional + descentralización": "Unlocks: International expansion + decentralization",
"Uso: Equipo 20+ personas + marketing agresivo": "Use: 20+ person team + aggressive marketing",

"Roadmap Conservador (Sin Funding Adicional)": "Conservative Roadmap (Without Additional Funding)",
"Si no se consigue inversión externa, el proyecto continúa así:": "If no external investment obtained, project continues like this:",
"2025:": "2025:",
"Mejoras incrementales con 1 developer": "Incremental improvements with 1 developer",
"Crecimiento orgánico lento pero sostenible": "Slow but sustainable organic growth",
"Meta: 5,000 usuarios para fin de año": "Goal: 5,000 users by year end",
"Enfoque: Rentabilidad sobre crecimiento explosivo": "Focus: Profitability over explosive growth",
"2026:": "2026:",
"Reinversión de ganancias en features prioritarias": "Reinvestment of profits in priority features",
"Posible contratación 1 developer part-time": "Possible hiring of 1 part-time developer",
"Meta: 20,000 usuarios": "Goal: 20,000 users",
"Breakeven operativo alcanzado": "Operational breakeven achieved",
"2027:": "2027:",
"Consideración de exit vía adquisición": "Consideration of exit via acquisition",
"O continuar como lifestyle business rentable": "Or continue as profitable lifestyle business",
"O abrir Serie A en ese momento con tracción probada": "Or open Series A at that time with proven traction",

// Información Legal
"⚖️ INFORMACIÓN LEGAL": "⚖️ LEGAL INFORMATION",
"Estructura Corporativa Actual": "Current Corporate Structure",
"Entidad:": "Entity:",
"Proyecto independiente (no incorporado formalmente aún)": "Independent project (not formally incorporated yet)",
"Argentina (Pehuajó, Buenos Aires)": "Argentina (Pehuajó, Buenos Aires)",
"Jurisdicción Blockchain:": "Blockchain Jurisdiction:",
"Proton (sin jurisdicción física específica)": "Proton (no specific physical jurisdiction)",
"Plan de Incorporación (Post-Funding):": "Incorporation Plan (Post-Funding):",
"Opción 1: Delaware C-Corp (USA) - Estándar para startups tech": "Option 1: Delaware C-Corp (USA) - Standard for tech startups",
"Opción 2: Cayman Islands / BVI - Común para crypto": "Option 2: Cayman Islands / BVI - Common for crypto",
"Opción 3: Singapur / Suiza - Crypto-friendly, respetado": "Option 3: Singapore / Switzerland - Crypto-friendly, respected",
"Razón Actual para No Incorporar:": "Current Reason for Not Incorporating:",
"Costos legales prohibitivos pre-revenue significativo ($5K-$15K)": "Prohibitive legal costs pre-significant revenue ($5K-$15K)",
"Complejidad regulatoria sin claridad aún": "Regulatory complexity without clarity yet",
"Enfoque en producto sobre estructura legal": "Focus on product over legal structure",
"Post-funding será prioridad inmediata": "Post-funding will be immediate priority",

"Clasificación del Token CFT": "CFT Token Classification",
"Posición Oficial:": "Official Position:",
"CFT es un Utility Token, NO un Security.": "CFT is a Utility Token, NOT a Security.",
"Justificación Legal (Howey Test):": "Legal Justification (Howey Test):",
"¿Inversión de dinero?": "Investment of money?",
"Sí, pero también se puede ganar gratis": "Yes, but can also be earned for free",
"¿En una empresa común?": "In a common enterprise?",
"No. CFT es utility para usar plataforma, no ownership de empresa": "No. CFT is utility for using platform, not company ownership",
"¿Expectativa de ganancias?": "Expectation of profits?",
"No promovida. CFT vale $0.01 fijo, no se promociona apreciación": "Not promoted. CFT worth $0.01 fixed, appreciation not promoted",
"¿Basada en esfuerzos de otros?": "Based on efforts of others?",
"No. Usuarios crean valor con su contenido, no dependiente de equipo": "No. Users create value with content, not dependent on team",
"Conclusión: CFT pasa Howey Test como utility, no security.": "Conclusion: CFT passes Howey Test as utility, not security.",
"Precedentes Similares:": "Similar Precedents:",
"BAT (Basic Attention Token) - Utility para Brave Browser": "BAT (Basic Attention Token) - Utility for Brave Browser",
"MANA (Decentraland) - Utility para mundo virtual": "MANA (Decentraland) - Utility for virtual world",
"Ambos aprobados por reguladores como utilities": "Both approved by regulators as utilities",

"Cumplimiento Regulatorio": "Regulatory Compliance",
"Actual:": "Current:",
"No KYC requerido (plataforma social, no exchange)": "No KYC required (social platform, not exchange)",
"No AML complejo (transacciones peer-to-peer verificables)": "No complex AML (verifiable peer-to-peer transactions)",
"Terms of Service publicados": "Terms of Service published",
"Privacy Policy conforme GDPR": "Privacy Policy GDPR compliant",
"Post-Funding / Escala:": "Post-Funding / Scale:",
"KYC opcional para retiros mayores ($500+ USD equivalent)": "Optional KYC for larger withdrawals ($500+ USD equivalent)",
"AML monitoring con software especializado": "AML monitoring with specialized software",
"Registro como MSB si requerido por jurisdicción": "Register as MSB if required by jurisdiction",
"Compliance officer contratado": "Compliance officer hired",

"Propiedad Intelectual": "Intellectual Property",
"Copyright:": "Copyright:",
"Todo el código es propiedad del fundador": "All code owned by founder",
"Usuarios retienen copyright de su contenido": "Users retain copyright of their content",
"Plataforma tiene licencia para mostrar/distribuir": "Platform has license to display/distribute",
"Patentes:": "Patents:",
"Posible patentar \"Sistema de Límites por Categoría\"": "Possible to patent \"Category Limit System\"",
"Posible patentar \"Tokens Versionados con Intercambio 1:1\"": "Possible to patent \"Versioned Tokens with 1:1 Exchange\"",
"Costo: $10K-$20K por patente": "Cost: $10K-$20K per patent",
"Prioridad post-funding": "Post-funding priority",
"Marca Registrada:": "Trademark:",
"ChainFeed™ - En proceso de registro": "ChainFeed™ - Registration in process",
"CFT™ - En proceso de registro": "CFT™ - Registration in process",
"Costo: $500-$1,500 por marca": "Cost: $500-$1,500 per trademark",

"Términos de Inversión (Seed Round)": "Investment Terms (Seed Round)",
"Instrumento: SAFE (Simple Agreement for Future Equity)": "Instrument: SAFE (Simple Agreement for Future Equity)",
"Estándar Y Combinator": "Y Combinator standard",
"Conversión en próxima ronda priced": "Conversion in next priced round",
"Protección para ambas partes": "Protection for both parties",

// ==========================================
// TRADUCCIONES PARA WHITEPAPER - PARTE FINAL
// ==========================================

// Términos de Inversión
"Términos Indicativos:": "Indicative Terms:",
"Valoración Cap:": "Valuation Cap:",
"Discount:": "Discount:",
"20% (primeros $100K)": "20% (first $100K)",
"Mínimo Inversión:": "Minimum Investment:",
"Máximo Ronda:": "Maximum Round:",

"Derechos de Inversores:": "Investor Rights:",
"Pro-rata rights (invertir en siguientes rondas)": "Pro-rata rights (invest in subsequent rounds)",
"Información trimestral financiera": "Quarterly financial information",
"Board observer seat (inversiones $100K+)": "Board observer seat ($100K+ investments)",
"Liquidation preference 1x (estándar)": "Liquidation preference 1x (standard)",

// Exit Strategy
"Exit Strategy y Liquidez": "Exit Strategy and Liquidity",
"Adquisición Estratégica (18-36 meses)": "Strategic Acquisition (18-36 months)",
"Potenciales Compradores:": "Potential Buyers:",
"Meta (Facebook/Instagram)": "Meta (Facebook/Instagram)",
"Twitter/X": "Twitter/X",
"Discord": "Discord",
"Reddit": "Reddit",
"TikTok (ByteDance)": "TikTok (ByteDance)",
"Exchanges crypto (Binance, Coinbase)": "Crypto exchanges (Binance, Coinbase)",
"Múltiplo Esperado:": "Expected Multiple:",
"5-10x revenue anual": "5-10x annual revenue",
"Timeline:": "Timeline:",

"Token Generation Event / ICO (12-24 meses)": "Token Generation Event / ICO (12-24 months)",
"Venta pública de CFT v1 remanente": "Public sale of remaining CFT v1",
"Listado en exchanges (Binance, Coinbase, Kraken)": "Listing on exchanges (Binance, Coinbase, Kraken)",
"Liquidez inmediata para early investors": "Immediate liquidity for early investors",
"Conversión de equity a tokens (opcional)": "Equity to tokens conversion (optional)",

"IPO (5+ años)": "IPO (5+ years)",
"Escenario:": "Scenario:",
"Listado en NASDAQ o NYSE": "Listing on NASDAQ or NYSE",
"Valoración $500M-$1B+": "Valuation $500M-$1B+",
"Modelo maduro y profitable": "Mature and profitable model",
"Comparables: Twitter, Pinterest, Snapchat": "Comparables: Twitter, Pinterest, Snapchat",
"Timeline Realista:": "Realistic Timeline:",

// Políticas de Contenido
"Políticas de Contenido": "Content Policies",
"Contenido Prohibido:": "Prohibited Content:",
"Pornografía / NSFW sin marcar": "Pornography / unmarked NSFW",
"Incitación al odio, racismo, discriminación": "Hate speech, racism, discrimination",
"Violencia gráfica explícita": "Explicit graphic violence",
"Contenido ilegal (drogas, armas, etc)": "Illegal content (drugs, weapons, etc)",
"Spam y estafas": "Spam and scams",
"Violación de copyright de terceros": "Third-party copyright violation",

"Contenido Permitido con Moderación:": "Content Allowed with Moderation:",
"Desnudos artísticos (marcados NSFW)": "Artistic nudity (marked NSFW)",
"Opiniones políticas (sin incitación)": "Political opinions (without incitement)",
"Contenido controversial pero legal": "Controversial but legal content",

// Seguridad y Auditorías
"Seguridad y Auditorías": "Security and Audits",
"Medidas de Seguridad Actuales:": "Current Security Measures:",
"Contraseñas hasheadas (bcrypt)": "Hashed passwords (bcrypt)",
"HTTPS en toda la plataforma": "HTTPS throughout platform",
"Sanitización de inputs (prevención SQL injection)": "Input sanitization (SQL injection prevention)",
"Rate limiting en APIs": "API rate limiting",
"Backups diarios automatizados": "Automated daily backups",

"Auditorías Futuras (Post-Funding):": "Future Audits (Post-Funding):",
"Smart Contract Audit:": "Smart Contract Audit:",
"CertiK o Hacken ($15K-$30K)": "CertiK or Hacken ($15K-$30K)",
"Penetration Testing:": "Penetration Testing:",
"Empresa especializada ($5K-$10K)": "Specialized company ($5K-$10K)",
"Bug Bounty Program:": "Bug Bounty Program:",
"$100-$5,000 por vulnerabilidad": "$100-$5,000 per vulnerability",

"Historial de Seguridad:": "Security History:",
"18 meses sin brechas de seguridad": "18 months without security breaches",
"0 pérdidas de fondos de usuarios": "0 user fund losses",
"2 intentos de SQL injection bloqueados automáticamente": "2 SQL injection attempts automatically blocked",

// Call to Action
"🎯 CALL TO ACTION": "🎯 CALL TO ACTION",
"¿Por Qué Invertir en ChainFeed?": "Why Invest in ChainFeed?",
"Producto Real Funcionando": "Real Working Product",
"No es vaporware ni promesas": "Not vaporware or promises",
"1,000+ usuarios reales usando la plataforma hoy": "1,000+ real users using platform today",
"18 meses de desarrollo consolidado": "18 months consolidated development",
"Modelo probado generando ingresos": "Proven model generating revenue",

"Timing de Mercado Óptimo": "Optimal Market Timing",
"Competidores colapsaron o estancados": "Competitors collapsed or stagnant",
"Frustración creciente con plataformas Web2": "Growing frustration with Web2 platforms",
"Bull market crypto 2024-2025 entrante": "Incoming crypto bull market 2024-2025",
"Ventana de oportunidad abierta": "Open window of opportunity",

"Múltiples fuentes de ingreso": "Multiple revenue sources",
"No es Ponzi ni especulación": "Not Ponzi or speculation",
"Tracción orgánica sin marketing": "Organic traction without marketing",

"Valoración Atractiva": "Attractive Valuation",
"$5M pre-money con producto y usuarios": "$5M pre-money with product and users",
"Competidores sin producto levantaron a $15M+": "Competitors without product raised at $15M+",
"Retorno potencial 10-20x en 3-4 años": "Potential return 10-20x in 3-4 years",
"Riesgo mitigado por producto existente": "Risk mitigated by existing product",

"Próximos Pasos": "Next Steps",
"Agendar Llamada": "Schedule Call",
"Acceso Data Room": "Access Data Room",
"Descargar LOI": "Download LOI",

// Resumen Ejecutivo para Inversores
"📊 RESUMEN EJECUTIVO PARA INVERSIONISTAS": "📊 EXECUTIVE SUMMARY FOR INVESTORS",
"En Una Página": "One-Page Summary",
"Red social tokenizada funcional": "Functional tokenized social network",
"MVP en producción, 18 meses desarrollo": "MVP in production, 18 months development",
"1,000+ activos, 10,000+ publicaciones": "1,000+ active, 10,000+ posts",
"Ingresos": "Revenue",
"~$395 USD/mes (preventas + marketplace + promociones)": "~$395 USD/month (presales + marketplace + promotions)",
"Blockchain": "Blockchain",
"Proton (XPR Network) - sin gas fees": "Proton (XPR Network) - no gas fees",
"Token": "Token",
"CFT - $0.01 USD fijo, 100M supply v1": "CFT - $0.01 USD fixed, 100M supply v1",
"Tracción": "Traction",
"500K+ CFT distribuidos, 200+ ventas marketplace": "500K+ CFT distributed, 200+ marketplace sales",
"Equipo": "Team",
"1 fundador (developer full-stack)": "1 founder (full-stack developer)",
"Mercado TAM": "Market TAM",
"$480B economía creadores para 2030": "$480B creator economy by 2030",
"Competencia": "Competition",
"Friend.tech colapsó, Steemit estancado, Lens sin tracción": "Friend.tech collapsed, Steemit stagnant, Lens without traction",
"Ventaja": "Advantage",
"Único con: recompensas + marketplace + gamificación funcionando": "Only one with: rewards + marketplace + gamification working",
"Valoración": "Valuation",
"$5M pre-money": "$5M pre-money",
"Buscando": "Seeking",
"$50K-$500K Seed Round": "$50K-$500K Seed Round",
"Uso Fondos": "Funds Use",
"40% desarrollo, 30% marketing, 20% equipo, 10% legal/ops": "40% development, 30% marketing, 20% team, 10% legal/ops",
"Proyección": "Projection",
"$50M-$100M valoración en 3 años con 500K usuarios": "$50M-$100M valuation in 3 years with 500K users",
"Exit": "Exit",
"Adquisición (Meta, Twitter, Discord) o ICO/listado exchanges": "Acquisition (Meta, Twitter, Discord) or ICO/exchange listing",
"ROI Esperado": "Expected ROI",
"10-20x en 3-4 años": "10-20x in 3-4 years",

// Declaración Final
"✍️ DECLARACIÓN FINAL": "✍️ FINAL STATEMENT",
"Compromiso de Transparencia": "Transparency Commitment",
"Este whitepaper representa fielmente el estado actual de ChainFeed a fecha de Noviembre 2025. No incluye promesas inalcanzables ni proyecciones fantasiosas.": "This whitepaper faithfully represents the current state of ChainFeed as of November 2025. It does not include unattainable promises or fanciful projections.",

"Transparencia Total:": "Total Transparency:",
"Los datos de usuarios, transacciones e ingresos son reales y verificables": "User, transaction, and revenue data are real and verifiable",
"Las limitaciones y riesgos están expuestos honestamente": "Limitations and risks are honestly exposed",
"El roadmap es conservador y realista para un proyecto unipersonal": "Roadmap is conservative and realistic for single-person project",
"Las proyecciones financieras asumen crecimiento orgánico posible": "Financial projections assume possible organic growth",

"Compromiso con Inversores:": "Commitment to Investors:",
"Si decides invertir en ChainFeed, recibirás:": "If you decide to invest in ChainFeed, you will receive:",
"Acceso completo a métricas en tiempo real": "Full access to real-time metrics",
"Reportes mensuales detallados": "Detailed monthly reports",
"Respuestas honestas sobre desafíos y fracasos": "Honest answers about challenges and failures",
"Participación en decisiones estratégicas clave": "Participation in key strategic decisions",

"Filosofía del Proyecto": "Project Philosophy",
"ChainFeed no es un proyecto crypto especulativo más. Es un intento genuino de construir una plataforma social que redistribuya valor hacia los creadores.": "ChainFeed is not just another speculative crypto project. It is a genuine attempt to build a social platform that redistributes value to creators.",
"El objetivo no es hacernos ricos rápidamente con un token pump-and-dump. Es construir un negocio sostenible que resuelva un problema real: la captura de valor por plataformas centralizadas.": "The goal is not to get rich quickly with a token pump-and-dump. It is to build a sustainable business that solves a real problem: value capture by centralized platforms.",
"Si esa visión resuena contigo, bienvenido a bordo.": "If that vision resonates with you, welcome aboard.",

// Cierre
"🏁 CIERRE": "🏁 CLOSING",
"ChainFeed es una oportunidad de inversión en una plataforma real, funcional y creciendo, que ataca un mercado masivo con un modelo innovador pero sostenible.": "ChainFeed is an investment opportunity in a real, functional, and growing platform that attacks a massive market with an innovative yet sustainable model.",
"No prometemos hacerte millonario de la noche a la mañana. Prometemos trabajo duro, transparencia total y una oportunidad realista de construir algo significativo.": "We don't promise to make you a millionaire overnight. We promise hard work, total transparency, and a realistic opportunity to build something meaningful.",
"Si estás buscando el próximo meme coin para especular, este no es tu proyecto.": "If you're looking for the next meme coin to speculate on, this is not your project.",
"Si estás buscando un negocio sólido con fundamentos reales, producto probado y visión a largo plazo, conversemos.": "If you're looking for a solid business with real fundamentals, proven product, and long-term vision, let's talk.",

"El futuro de las redes sociales es descentralizado.": "The future of social networks is decentralized.",
"El valor debe fluir hacia los creadores.": "Value must flow to creators.",
"ChainFeed está construyendo ese futuro, hoy.": "ChainFeed is building that future, today.",
"¿Te unes?": "Will you join?",

"Contacto Final:": "Final Contact:",
"invest@chainfeed.io": "invest@chainfeed.io",

// Footer
"Este documento no constituye oferta de valores sin documentación legal apropiada.": "This document does not constitute a securities offering without appropriate legal documentation.",
"FIN DEL WHITEPAPER": "END OF WHITEPAPER",
"Total Páginas:": "Total Pages:",
"Palabras:": "Words:",
"Enfoque: Realista, transparente, basado en datos verificables": "Focus: Realistic, transparent, based on verifiable data",
"Audiencia: Inversores Angel, VCs, Family Offices, compradores institucionales": "Audience: Angel Investors, VCs, Family Offices, institutional buyers",
"Preparado por:": "Prepared by:",
"ChainFeed Team": "ChainFeed Team",
"Fecha:": "Date:",
"Noviembre 2025": "November 2025",
"Versión:": "Version:",
"1.0 Final": "1.0 Final",
"Validez:": "Validity:",
"Información precisa a la fecha de publicación": "Information accurate as of publication date",

// Términos adicionales específicos
"$5,000,000 USD": "$5,000,000 USD",
"$10,000 USD": "$10,000 USD",
"$500,000 USD": "$500,000 USD",
"2-3 años": "2-3 years",
"12-24 meses": "12-24 months",
"5+ años": "5+ years",
"2028-2030": "2028-2030",
"$15K-$30K": "$15K-$30K",
"$5K-$10K": "$5K-$10K",
"$100-$5,000": "$100-$5,000",
"42": "42",
"~16,000": "~16,000",

// ==========================================
// TRADUCCIONES ADICIONALES PARA WHITEPAPER
// Agregar estas dentro de translations.en en i18n-auto-translate.js
// ==========================================

// Secciones principales que faltan
"COMPLETAMENTE FUNCIONAL": "FULLY FUNCTIONAL",
"10,000+": "10,000+",
"500,000+": "500,000+",
"50+": "50+",
"200+": "200+",
"99.2%": "99.2%",

"N/A": "N/A",

// Plataforma - Tipos de contenido
"Imágenes (JPG, PNG, GIF)": "Images (JPG, PNG, GIF)",


"Propios": "Own",
"Recibidos": "Received",
"50 CFT/día": "50 CFT/day",
"100 CFT/día": "100 CFT/day",

// Ejemplos reales
"¿Qué feature quieres ver próximamente?": "What feature do you want to see next?",
"[Mensajes, Grupos, Stories, NFTs]": "[Messages, Groups, Stories, NFTs]",
"20 CFT por voto": "20 CFT per vote",
"100 participantes": "100 participants",
"2,000 CFT (bloqueados del creador)": "2,000 CFT (locked from creator)",


"Mejor meme sobre ChainFeed": "Best meme about ChainFeed",
"5,000 CFT": "5,000 CFT",
"10": "10",
"500 CFT": "500 CFT",
"45": "45",

// Estadísticas marketplace
"$8": "$8",
"16,000": "16,000",
"$50": "$50",

// Promoción
"24 horas": "24 hours",
"10 días": "10 days",
"30 días": "30 days",


"15-20": "15-20",
"$80": "$80",
"4.2%": "4.2%",

// Preventas
"@chainfeed": "@chainfeed",

"$100 USDT": "$100 USDT",
"10,000 CFT ($100 / $0.01)": "10,000 CFT ($100 / $0.01)",
"2,000 CFT": "2,000 CFT",
"12,000 CFT": "12,000 CFT",
"<2 minutos": "<2 minutes",

"30+": "30+",
"$1,500": "$1,500",
"$200": "$200",


"1-2": "1-2",
"3-4": "3-4",
"5-6": "5-6",
"7+": "7+",
"Advertencia": "Warning",
"Bloqueo temporal 7 días": "Temporary block 7 days",
"Bloqueo temporal 30 días": "Temporary block 30 days",
"Bloqueo permanente": "Permanent block",

"25": "25",
"1,200": "1,200",
"2.5h": "2.5h",

"$310 / $45,000 =": "$310 / $45,000 =",
"0.69%": "0.69%",

// Tokenomics
"chainfeed": "chainfeed",
"8": "8",
"$0.01 USD": "$0.01 USD",

// Supply
"Disponible": "Available",
"Ventas con bonus 20%": "Sales with 20% bonus",
"Activo": "Active",
"Distribución progresiva": "Progressive distribution",
"Bloqueado": "Locked",
"Vesting 24 meses": "Vesting 24 months",
"Parcial": "Partial",
"Campañas + pools": "Campaigns + pools",

// Proyección agotamiento
"100K usuarios promedio": "100K average users",
"5-7 años": "5-7 years",

"500K usuarios promedio": "500K average users",
"3-4 años": "3-4 years",

"1M+ usuarios promedio": "1M+ average users",

// ==========================================
// TRADUCCIONES FALTANTES DEL WHITEPAPER
// Agregar estas dentro de translations.en en i18n-auto-translate.js
// ==========================================

// Palabras sueltas y frases cortas
"propios": "own",
"recibidos": "received",
"día": "day",
"Grupos": "Groups",
"por voto": "per vote",
"participantes": "participants",
"bloqueados del creador": "locked from creator",
"minutos": "minutes",
"Preventas Completadas": "Completed Presales",
"Volumen Total": "Total Volume",
"Ticket Promedio": "Average Ticket",
"Mayor Compra": "Largest Purchase",
"Advertencia": "Warning",
"Bloqueo temporal": "Temporary block",
"Preventas con bonus": "Presales with bonus",
"Promociones pagadas": "Paid promotions",
"retenido": "retained",
"por publicar": "for posting",
"por like": "per like",
"variable": "variable",
"Disponible": "Available",
"Activo": "Active",
"Bloqueado": "Locked",
"Parcial": "Partial",
"Ventas con bonus": "Sales with bonus",
"Distribución progresiva": "Progressive distribution",
"meses": "months",
"Campañas": "Campaigns",
"500 seguidores": "500 followers",
"220 seguidores": "220 followers",
"/mes": "/month",
"Preventas": "Presales",
"Promociones": "Promotions",

// Frases completas del HTML
"Conclusión:": "Conclusion:",
"El modelo es rentable incluso a pequeña escala actual. Los márgenes mejoran con crecimiento por economías de escala.": 
"The model is profitable even at current small scale. Margins improve with growth due to economies of scale.",

"Pequeños": "Small entities",
"Velocidad": "Speed",
"Difícil": "Difficult",
"Comunidad": "Community",
"desconfía": "distrusts",
"fijo": "fixed",
"diversificados": "diversified",
"promociones siguen funcionando": "promotions keep working",
"pueden usar gratis sin comprar CFT": "can use for free without buying CFT",

// Descripciones largas
"Descripción: Proyecto desarrollado por una sola persona. Si el fundador no puede continuar, el proyecto se detiene.": 
"Description: Project developed by a single person. If the founder cannot continue, the project stops.",

"Primer uso de capital debe ser contratar CTO/Senior Dev para reducir dependencia.": 
"First use of capital should be hiring CTO/Senior Dev to reduce dependency.",

"Filosofía del Roadmap:": "Roadmap Philosophy:",
"Este roadmap refleja lo que es factualmente alcanzable con los recursos actuales (1 developer) y futuros (con funding). No incluye promesas inalcanzables.": 
"This roadmap reflects what is factually achievable with current resources (1 developer) and future ones (with funding). Does not include unattainable promises.",

"Estabilizar producto y llegar a 1,000 usuarios": "Stabilize product and reach 1,000 users",
"Optimizar experiencia y reducir fricción. Meta: 2,500 usuarios.": "Optimize experience and reduce friction. Goal: 2,500 users.",
"Desarrollo (3 meses):": "Development (3 months):",
"Añadir features diferenciadores. Meta: 5,000 usuarios.": "Add differentiating features. Goal: 5,000 users.",
"Diversificar ingresos. Meta: 10,000 usuarios.": "Diversify income. Goal: 10,000 users.",

// Variaciones con HTML (para que funcione con o sin tags)
"<strong class=\"checkmark\">Conclusión:</strong>": "<strong class=\"checkmark\">Conclusion:</strong>",
"<p><strong>Desarrollo (3 meses):</strong></p>": "<p><strong>Development (3 months):</strong></p>",

// ==========================================
// TRADUCCIONES ADICIONALES DE CONTEXTO
// ==========================================

// Números y unidades comunes
"usuarios": "users",
"tokens": "tokens",
"días": "days",
"horas": "hours",
"semanas": "weeks",
"años": "years",

// Términos financieros comunes
"ingreso": "revenue",
"gasto": "expense",
"costo": "cost",
"ganancia": "profit",
"pérdida": "loss",
"retorno": "return",
"inversión": "investment",
" CFT otorgados de ": " CFT granted from ",

// Términos técnicos comunes
"desarrollador": "developer",
"desarrolladores": "developers",
"equipo": "team",
"plataforma": "platform",
"sistema": "system",
"funcionalidad": "functionality",
"característica": "feature",
"características": "features",

// Estados y acciones
"completado": "completed",
"pendiente": "pending",
"en proceso": "in process",
"en progreso": "in progress",
"activo": "active",
"inactivo": "inactive",
"bloqueado": "blocked",
"desbloqueado": "unlocked",

// Términos de negocio
"cliente": "client",
"clientes": "clients",
"usuario": "user",
"comprador": "buyer",
"vendedor": "seller",
"creador": "creator",
"creadores": "creators",

// Términos de tiempo
"diario": "daily",
"semanal": "weekly",
"mensual": "monthly",
"anual": "annual",
"trimestral": "quarterly",

// Términos de cantidad
"mínimo": "minimum",
"máximo": "maximum",
"promedio": "average",
"total": "total",
"parcial": "partial",
"completo": "complete",

// Términos de estado del proyecto
"funcional": "functional",
"operativo": "operational",
"estable": "stable",
"en desarrollo": "in development",
"en producción": "in production",
"en pruebas": "in testing",

// Términos relacionados con blockchain
"billetera": "wallet",
"transacción": "transaction",
"blockchain": "blockchain",
"token": "token",
"criptomoneda": "cryptocurrency",
"descentralizado": "decentralized",
"verificado": "verified",

// Términos de marketing
"campaña": "campaign",
"publicidad": "advertising",
"promoción": "promotion",
"alcance": "reach",
"impresiones": "impressions",
"conversión": "conversion",
"engagement": "engagement",

// Frases de acción
"hacer clic": "click",
"presionar": "press",
"enviar": "send",
"recibir": "receive",
"comprar": "buy",
"vender": "sell",
"intercambiar": "exchange",
"transferir": "transfer",

// Términos de redes sociales
"publicación": "post",
"comentario": "comment",
"respuesta": "reply",
"repost": "repost",
"seguidor": "follower",
"seguimiento": "following",
"notificación": "notification",
"mensaje": "message",

// Términos legales básicos
"términos": "terms",
"condiciones": "conditions",
"política": "policy",
"acuerdo": "agreement",
"contrato": "contract",
"licencia": "license",

"ChainFeed - Notificaciones": "ChainFeed - Notifications",
"🔔 Notificaciones": "🔔 Notifications",
"Notificaciones": "Notifications",

// === BOTONES DE HEADER ===
"✓ Marcar todas como leídas": "✓ Mark all as read",
"🗑️ Eliminar leídas": "🗑️ Delete read",

// === FILTROS ===
"Todas": "All",
"❤️ Likes": "❤️ Likes",
"💬 Comentarios": "💬 Comments",
"👥 Seguidores": "👥 Followers",
"🔄 Reposts": "🔄 Reposts",
"💵 Ventas": "💵 Sales",
"🛒 Compras": "🛒 Purchases",
"✅ Retiros": "✅ Withdrawals",
"💎 Depósitos": "💎 Deposits",
"⛓️ Chain": "⛓️ Chain",

// === ESTADO VACÍO ===
"No tienes notificaciones": "You have no notifications",
"Cuando alguien interactúe con tu contenido, lo verás aquí": "When someone interacts with your content, you'll see it here",

// === ACCIONES DE NOTIFICACIONES ===
"Ver comentario": "View comment",
"Ver publicación": "View post",
"Ver participación": "View participation",
"✅ Aceptar": "✅ Accept",
"❌ Rechazar": "❌ Reject",
"Ver perfil": "View profile",
"Ver evento Chain": "View Chain event",
"✅ Aprobar": "✅ Approve",
"💎 Ver en billetera": "💎 View in wallet",
"💬 Abrir chat": "💬 Open chat",
"👤 Ver perfil": "👤 View profile",
"💰 Ver en billetera": "💰 View in wallet",

// === ESTADOS DE BOTONES ===
"Verificando...": "Checking...",
"Siguiendo": "Following",
"Seguir": "Follow",
"Pendiente": "Pending",
"Procesando...": "Processing...",

// === MODAL DE COMENTARIOS ===
"💬 Comentarios": "💬 Comments",
"Comentarios": "Comments",
"Escribe un comentario...": "Write a comment...",
"Comentar": "Comment",

// === MODAL DE PARTICIPACIÓN ===
"Participación en evento Chain": "Participation in Chain event",
"Aprobada": "Approved",
"Rechazada": "Rejected",
"Ganaste": "You earned",
"Contenido:": "Content:",
"Duración:": "Duration:",
"Fecha": "Date",

// === MODAL DE POST PREVIEW ===
"Publicación": "Post",
"En venta": "For sale",
"Creado originalmente por": "Originally created by",
"Precio de venta": "Sale price",
"Comentarios": "Comments",
"Shares": "Shares",

// === MODAL DE EVENTO CHAIN ===
"participantes": "participants",
"Opciones:": "Options:",
"Recompensa": "Reward",
"Duración": "Duration",
"días": "days",
"Estado": "Status",
"Activo": "Active",
"Finalizado": "Finished",

// === CONFIRMACIONES ===
"¿Estás seguro de que quieres eliminar": "Are you sure you want to delete",
"notificaciones leídas?": "read notifications?",
"Esta acción no se puede deshacer.": "This action cannot be undone.",
"Eliminar": "Delete",
"Cancelar": "Cancel",

// === APROBACIÓN/RECHAZO ===
"✅ Aprobar participación": "✅ Approve participation",
"¿Estás seguro de aprobar esta participación?": "Are you sure you want to approve this participation?",
"El usuario recibirá los tokens de recompensa.": "The user will receive the reward tokens.",
"Aprobar": "Approve",

"❌ Rechazar participación": "❌ Reject participation",
"¿Estás seguro de rechazar esta participación?": "Are you sure you want to reject this participation?",
"Puedes agregar un motivo (opcional):": "You can add a reason (optional):",
"Rechazar": "Reject",
"Ej: No cumple con los requisitos...": "Ex: Does not meet requirements...",

// === SOLICITUDES DE SEGUIMIENTO ===
"👥 Aceptar seguidor": "👥 Accept follower",
"¿Aceptar esta solicitud de seguimiento?": "Accept this follow request?",
"Este usuario podrá ver tu contenido privado.": "This user will be able to see your private content.",
"Aceptar": "Accept",

"❌ Rechazar solicitud": "❌ Reject request",
"¿Rechazar esta solicitud de seguimiento?": "Reject this follow request?",
"El usuario no será notificado del rechazo.": "The user will not be notified of the rejection.",

// === MENSAJES DE ÉXITO/ERROR ===
"✅ Participación aprobada": "✅ Participation approved",
"❌ Participación rechazada": "❌ Participation rejected",
"✅ Solicitud aceptada": "✅ Request accepted",
"❌ Solicitud rechazada": "❌ Request rejected",
"eliminadas": "deleted",
"Abriendo chat con": "Opening chat with",
"Abriendo billetera (Stake)...": "Opening wallet (Stake)...",
"Error al cargar modal de likes": "Error loading likes modal",
"Error al cargar evento Chain": "Error loading Chain event",
"Error al cargar participación": "Error loading participation",
"Error al aprobar participación": "Error approving participation",
"Error al rechazar participación": "Error rejecting participation",
"Error al aceptar solicitud": "Error accepting request",
"Error al rechazar solicitud": "Error rejecting request",
"Error al abrir el chat": "Error opening chat",
"Error al abrir billetera": "Error opening wallet",

// === MODAL DE LIKES ===
"❤️ Likes": "❤️ Likes",
"Cargando usuarios...": "Loading users...",
"Aún no hay likes": "No likes yet",
"Error al cargar usuarios": "Error loading users",

// === NOTIFICACIONES DE NAVEGACIÓN ===
"No hay notificaciones leídas para eliminar": "No read notifications to delete",
"¿Eliminar": "Delete",
"notificaciones leídas?": "read notifications?",
"eliminadas": "deleted",

// === AGRUPACIONES ===
"📋 Expandir": "📋 Expand",
"📋 Colapsar": "📋 Collapse",
"Desplegar detalles": "Show details",
"No hay detalles para mostrar": "No details to show",
"No se pudieron cargar los detalles": "Could not load details",

// === TIEMPO ===
"ahora": "now",
"hace": "ago",

// === MODAL GENERAL ===
"Tu navegador no soporta video.": "Your browser does not support video.",
"Tu navegador no soporta audio.": "Your browser does not support audio.",
"Tu navegador no soporta el elemento de audio.": "Your browser does not support the audio element.",

// === BOTONES DE ACCIÓN GENERALES ===
"Ver más": "View more",
"Ver menos": "View less",
"Cargar más": "Load more",
"Cerrar": "Close",

// === ESTADOS DE NOTIFICACIÓN ===
"comentó en tu publicación": "commented on your post",
"le dio like a tu publicación": "liked your post",
"interactuó": "interacted",

// === TEXTO DE CONFIRMACIÓN ===
"Sí, eliminar": "Yes, delete",
"No, cancelar": "No, cancel",

// === CADENAS DE USUARIO ===
"Por": "By",
"Por @": "By @",

// Expresiones comunes
"por favor": "please",
"gracias": "thank you",
"de nada": "you're welcome",
"sí": "yes",
"no": "no",
"tal vez": "maybe",
"quizás": "perhaps",

// ==========================================
// FRASES ESPECÍFICAS DEL CONTEXTO WHITEPAPER
// ==========================================

// Análisis de mercado
"innovan más rápido que corporaciones": "innovate faster than corporations",
"replicar comunidad leal establecida": "replicate established loyal community",
"Sistema Chain único, no replicable fácilmente": "Unique Chain System, not easily replicable",

// Riesgos
"Descripción:": "Description:",
"Con crecimiento rápido a 10,000+ usuarios, la infraestructura actual (1 servidor VPS) podría saturarse.": 
"With rapid growth to 10,000+ users, current infrastructure (1 VPS server) could become saturated.",

"Usuarios malintencionados crean múltiples cuentas o bots para farmear tokens ilimitadamente.": 
"Malicious users create multiple accounts or bots to farm tokens unlimitedly.",

"Gobiernos podrían clasificar CFT como security, requiriendo licencias costosas o prohibiendo operaciones.": 
"Governments could classify CFT as security, requiring expensive licenses or prohibiting operations.",

"Meta, Twitter/X o TikTok lanzan sistema de recompensas similar con recursos infinitamente mayores.": 
"Meta, Twitter/X or TikTok launch similar reward system with infinitely greater resources.",

"Bear market prolongado reduce interés en tokens y preventas caen dramáticamente.": 
"Prolonged bear market reduces interest in tokens and presales drop dramatically.",

"Si el fundador no puede continuar, proyecto se detiene.": 
"If founder cannot continue, project stops.",

// Mitigaciones
"Base de datos optimizada con índices": "Database optimized with indexes",
"Queries con LIMIT y paginación": "Queries with LIMIT and pagination",
"CDN para contenido multimedia (Cloudflare)": "CDN for multimedia content (Cloudflare)",
"Caché de consultas frecuentes": "Cache for frequent queries",

"Migración a arquitectura escalable (AWS/GCP)": "Migration to scalable architecture (AWS/GCP)",
"Balanceador de carga con múltiples servidores": "Load balancer with multiple servers",
"Base de datos distribuida (sharding)": "Distributed database (sharding)",
"Presupuesto: $500-$1,000/mes a partir de 10K usuarios": "Budget: $500-$1,000/month from 10K users",

// Roadmap específico
"Lanzamiento MVP en producción": "MVP launch in production",
"Sistema de recompensas automático funcional": "Functional automatic reward system",
"Marketplace de contenido operativo": "Operational content marketplace",
"Sistema Chain (polls, campaigns, audio)": "Chain System (polls, campaigns, audio)",
"Integración Proton blockchain": "Proton blockchain integration",
"Sistema de promociones pagadas": "Paid promotion system",
"Sistema de preventas con bonus 20%": "Presale system with 20% bonus",
"Dashboard de billetera completo": "Complete wallet dashboard",
"Sistema de moderación básico": "Basic moderation system",

"Resultado:": "Result:",
"Objetivos alcanzados. Plataforma estable y funcional.": "Objectives achieved. Stable and functional platform.",

// Desarrollo futuro
"Sistema de notificaciones mejorado (push notifications)": "Improved notification system (push notifications)",
"Búsqueda avanzada de contenido (hashtags, usuarios)": "Advanced content search (hashtags, users)",
"Mensajería directa básica (texto)": "Basic direct messaging (text)",
"Mejoras de performance y caché": "Performance and cache improvements",
"Compresión automática de imágenes/videos": "Automatic image/video compression",
"Sistema de backup automatizado": "Automated backup system",
"Documentación técnica completa": "Complete technical documentation",

// Marketing
"Campaña con 10 micro-influencers crypto ($500)": "Campaign with 10 crypto micro-influencers ($500)",
"Contenido educativo (YouTube, Medium)": "Educational content (YouTube, Medium)",
"Presencia en foros crypto (Reddit, Bitcointalk)": "Presence in crypto forums (Reddit, Bitcointalk)",

// Recursos
"Recursos Necesarios:": "Required Resources:",
"$2,000 (desarrollo + marketing)": "$2,000 (development + marketing)",
"$25,000 (salario developer 3 meses)": "$25,000 (developer salary 3 months)",
"$15,000 (desarrollo + integraciones)": "$15,000 (development + integrations)",
"$200,000+ (equipo 5 personas)": "$200,000+ (5-person team)",

// Funding
"Si se consigue funding ($50K+):": "If funding obtained ($50K+):",
"Si NO se consigue funding:": "If funding NOT obtained:",
"Con funding:": "With funding:",
"Sin funding:": "Without funding:",

"Contratar 1 developer adicional": "Hire 1 additional developer",
"Priorizar solo: Grupos básicos + API simple": "Prioritize only: Basic groups + simple API",
"Desarrollo más lento (6 meses en vez de 3)": "Slower development (6 months instead of 3)",

// Milestones
"Desbloquea: Q3 2025 acelerado + 1 developer": "Unlocks: Q3 2025 accelerated + 1 developer",
"Uso: Salarios + marketing + infraestructura": "Use: Salaries + marketing + infrastructure",
"Desbloquea: 2026 completo + equipo 5 personas": "Unlocks: Complete 2026 + 5-person team",
"Uso: Producto maduro + escalamiento global": "Use: Mature product + global scaling",
"Desbloquea: Expansión internacional + descentralización": "Unlocks: International expansion + decentralization",
"Uso: Equipo 20+ personas + marketing agresivo": "Use: 20+ person team + aggressive marketing",

// Roadmap conservador
"Si no se consigue inversión externa, el proyecto continúa así:": 
"If no external investment obtained, project continues like this:",

"Mejoras incrementales con 1 developer": "Incremental improvements with 1 developer",
"Crecimiento orgánico lento pero sostenible": "Slow but sustainable organic growth",
"Meta: 5,000 usuarios para fin de año": "Goal: 5,000 users by year end",
"Enfoque: Rentabilidad sobre crecimiento explosivo": "Focus: Profitability over explosive growth",

"Reinversión de ganancias en features prioritarias": "Reinvestment of profits in priority features",
"Posible contratación 1 developer part-time": "Possible hiring of 1 part-time developer",
"Meta: 20,000 usuarios": "Goal: 20,000 users",
"Breakeven operativo alcanzado": "Operational breakeven achieved",

"Consideración de exit vía adquisición": "Consideration of exit via acquisition",
"O continuar como lifestyle business rentable": "Or continue as profitable lifestyle business",
"O abrir Serie A en ese momento con tracción probada": "Or open Series A at that time with proven traction",

"Ingresa para Comenzar": "Login to Get Started",
"✅ Sí": "✅ Yes",
"compras/semana": "purchases/week",
"compras/semanas": "purchases/weeks",
"Balance óptimo": "Optimal balance",
"margen)": "margin)",
"Variable": "Variable",

// Agregar estas traducciones a translations.en en i18n-auto-translate.js

"Conecta tu wallet para obtenerlos": "Connect your wallet to get them",
"🚀 Reclama tus 50 CFT!": "🚀 Claim your 50 CFT!",
"Error al conectar": "Connection error",
"¡Conectado!": "Connected!",
"🚀 ¡Reclamado!": "🚀 Claimed!",
"Conectando wallet...": "Connecting wallet...",
"No se pudo obtener sesión de Proton": "Could not get Proton session",
"ProtonWebSDK no está cargado. Recarga la página.": "ProtonWebSDK is not loaded. Reload the page.",
"🔐 Conectando con Proton Wallet...": "🔐 Connecting with Proton Wallet...",
"Ya tienes sesión activa": "You already have an active session",
"Error verificando sesión": "Error verifying session",
"No se pudo conectar con Proton Wallet.": "Could not connect with Proton Wallet.",
"¡Bienvenido! Tu wallet está conectada.": "Welcome! Your wallet is connected.",
"Ya tienes sesión activa. Puedes comprar tokens.": "You already have an active session. You can buy tokens.",

  "Tu código de referido": "Your referral code",
  "referidos": " referrals ",
  "otorgados de": "granted of",
  "¿Tienes un código?": "Do you have a code?",
  "código": "code",
  "Ambos reciben": "Both receive",
  "Por favor ingresa un código": "Please enter a code",
  "El código debe tener al menos 5 caracteres": "The code must be at least 5 characters",
  "No se pudo compartir": "Could not share",
  "Copia manualmente:": "Copy manually:",
  "Código copiado al portapapeles": "Code copied to clipboard",
  "¡Únete a ChainFeed con mi código de referido y obtén 15 CFT gratis!": "Join ChainFeed with my referral code and get 15 CFT free!",
  "ChainFeed Token - Código de Referido": "ChainFeed Token - Referral Code",
  "Código aún no disponible": "Code not yet available",
  "Código inválido": "Invalid code",
  "Error de conexión. Intenta de nuevo.": "Connection error. Try again.",
  "Conecta tu wallet para obterelos": "Connect your wallet to get them",
  
  "Configuración del Perfil": "Profile Settings",
  "Personaliza tu información y actualiza tu perfil": "Customize your information and update your profile",
  "Cargando...": "Loading...",
  "Cambiar Foto": "Change Photo",
  "Nombre de Usuario": "Username",
  "El nombre de usuario no se puede cambiar": "Username cannot be changed",
  "Nombre Público": "Public Name",
  "Este es tu nombre público que otros verán en tu perfil": "This is your public name that others will see on your profile",
  "El nombre público es requerido": "Public name is required",
  "Descripción": "Description",
  "Cuéntanos sobre ti... Puedes incluir tus intereses, profesión, o lo que te apasiona del mundo crypto y blockchain.": "Tell us about yourself... You can include your interests, profession, or what excites you about the crypto and blockchain world.",
  "Describe brevemente quién eres y qué te interesa": "Briefly describe who you are and what interests you",
  "Perfil actualizado correctamente": "Profile updated successfully",
  "Error al obtener perfil": "Error getting profile",
  "❌ Error al cargar el perfil:": "❌ Error loading profile:",
  "⚠️ Debes iniciar sesión para editar tu perfil": "⚠️ You must be logged in to edit your profile",
  "Error al cargar los datos del perfil": "Error loading profile data",
  "❌ Por favor selecciona un archivo de imagen válido": "❌ Please select a valid image file",
  "❌ La imagen es demasiado grande. El tamaño máximo es 5MB": "❌ The image is too large. Maximum size is 5MB",
  "📷 Avatar actualizado (no olvides guardar)": "📷 Avatar updated (don't forget to save)",
  "El nombre debe tener al menos 2 caracteres": "Name must be at least 2 characters",
  "Error al actualizar perfil": "Error updating profile",
  "❌ Error al guardar los cambios:": "❌ Error saving changes:",
  "Estás seguro de que quieres cancelar? Se perderán los cambios no guardados.": "Are you sure you want to cancel? Unsaved changes will be lost.",
  "Tienes cambios no guardados. ¿Estás seguro de que quieres salir?": "You have unsaved changes. Are you sure you want to leave?",
  "Editando perfil de: ": "Editing profile of: ",
"% otorgado ": "% awarded ",
"otorgado": "awarded",

// === SISTEMA DE REFERIDOS ===
"Tu código de referido": "Your referral code",
"referidos": "referrals",
"¿Tienes un código?": "Do you have a code?",
"CÓDIGO": "CODE",
"Ambos reciben": "Both receive",
"⚠️ Por favor ingresa un código": "⚠️ Please enter a code",
"⚠️ El código debe tener al menos 5 caracteres": "⚠️ The code must be at least 5 characters",
"❌ No puedes usar tu propio código": "❌ You cannot use your own code",
"⚠️ Código aún no disponible": "⚠️ Code not yet available",
"📋 Código copiado al portapapeles": "📋 Code copied to clipboard",
"⚠️ No se pudo compartir. Copia manualmente:": "⚠️ Could not share. Copy manually:",
"❌ Código inválido": "❌ Invalid code",
"❌ Error de conexión. Intenta de nuevo.": "❌ Connection error. Try again.",

// Compartir código
"ChainFeed Token - Código de Referido": "ChainFeed Token - Referral Code",
"🚀 ¡Únete a ChainFeed con mi código de referido y obtén 15 CFT gratis!": "🚀 Join ChainFeed with my referral code and get 15 CFT free!",
"Código:": "Code:",
"¡Ambos recibiremos tokens al registrarte!": "We'll both receive tokens when you sign up!",

// Éxito
"🎉 ¡Código aplicado exitosamente!": "🎉 Code applied successfully!",
"Tú y": "You and",
"recibieron": "received",
"cada uno.": "each.",

// En translations.en dentro de i18n-auto-translate.js

"⚠️ Inicia sesión para compartir tu código de referido": "⚠️ Log in to share your referral code",
"✅ Código compartido exitosamente": "✅ Code shared successfully",
"Tu código de referido:": "Your referral code:",
"Cópialo manualmente para compartir": "Copy it manually to share",

// Agregar estas dentro de translations.en

"Sistema de Referidos": "Referral System",
"Tu código de referido": "Your referral code",
"Compartir código": "Share code",
"CFT Ganados": "CFT Earned",
"¿Tienes un código de referido?": "Do you have a referral code?",
"Ingresa código": "Enter code",
"Aplicar código": "Apply code",


//PERFIL estas dentro de translations.en// Agregar estas dentro de translations.en// Agregar estas dentro de translations.en

"Compartir": "Share",
  "Compartir con": "Share with",
  "usuarios": "users",
  "usuario": "user",
  "Selecciona al menos un usuario": "Select at least one user",
  "Error: No se pudo identificar la publicación": "Error: Could not identify the post",
  "Error: Modal de compartir no encontrado": "Error: Share modal not found",
  "No se encontraron usuarios": "No users found",
  "No hay usuarios que sigas mutuamente o que coincidan con tu búsqueda": "No mutually followed users or matching your search",
  "Mensaje opcional:": "Optional message:",
  "Escribe tu mensaje aquí...": "Write your message here...",
  "Compartiendo...": "Sharing...",
  "Compartido con": "Shared with",
  "Enviado a:": "Sent to:",
  "no pudo recibir el mensaje": "could not receive the message",
  "no pudieron recibir el mensaje": "could not receive the message",
  "Error al compartir": "Error sharing",
  "Publicación compartida con": "Post shared with",
  "Evento Chain compartido con": "Chain event shared with",
  "Total disponible:": "Total available:",
  "CFT para": "CFT for",
  "participantes": "participants",
  "Encuesta": "Poll",
  "Audio": "Audio",
  "Campaña": "Campaign",
  "Activo": "Active",
  "Finalizado": "Finished",
  "votos": "votes",
  "días": "days",
  "día": "day",
  "restantes": "remaining",
  "restante": "remaining",
  "Menos de 1 día": "Less than 1 day",
  "Ver": "View",
  "respuestas": "replies",
  "respuesta": "reply",
  "Ocultar respuestas": "Hide replies",
  "Responder": "Reply",
  "Enviando...": "Sending...",
  "Respuesta publicada en tu propio post": "Reply posted on your own post",
  "Respuesta publicada! Has ganado": "Reply posted! You earned",
  "Respuesta publicada!": "Reply posted!",
  "Comentario publicado en tu propio post": "Comment posted on your own post",
  "Comentario publicado! Has ganado": "Comment posted! You earned",
  "Comentario publicado!": "Comment posted!",
  "Error al enviar respuesta": "Error sending reply",
  "Error al enviar comentario": "Error sending comment",
  "Cargando comentarios...": "Loading comments...",
  "Error al cargar comentarios": "Error loading comments",
  "Reintentar": "Retry",
  "Sin comentarios aún": "No comments yet",
  "¡Sé el primero en comentar!": "Be the first to comment!",
  "Comentar": "Comment",
  "Cancelar": "Cancel",
  "Procesando...": "Processing...",
  "Escribe tu comentario...": "Write your comment...",
  "Grabar Audio": "Record Audio",
  "Subir Audio": "Upload Audio",
  "Grabando...": "Recording...",
  "Detener": "Stop",
  "Audio grabado": "Audio recorded",
  "Audio removido": "Audio removed",
  "Imagen removida": "Image removed",
  "agregada": "added",
  "seleccionado": "selected",
  "Conectando...": "Connecting...",
  "Buffering video...": "Buffering video...",
  "Video listo": "Video ready",
  "Error cargando video": "Error loading video",
  "El video no se pudo cargar correctamente": "The video could not load correctly",
  "Crear Evento Chain": "Create Chain Event",
  "Título del evento": "Event title",
  "Descripción": "Description",
  "Duración (días)": "Duration (days)",
  "Tipo de evento": "Event type",
  "Tipo de respuesta": "Response type",
  "Imagen": "Image",
  "Video": "Video",
  "Texto": "Text",
  "Recompensa total": "Total reward",
  "Ganadores": "Winners",
  "Recompensa por voto": "Reward per vote",
  "Máximo de participantes": "Maximum participants",
  "Agregar opción": "Add option",
  "Máximo 5 opciones": "Maximum 5 options",
  "Opción": "Option",
  "Seleccionar Imagen": "Select Image",
  "Seleccionar Video": "Select Video",
  "Seleccionar media": "Select media",
  "Video seleccionado": "Video selected",
  "Imagen seleccionada": "Image selected",
  "Audio seleccionado": "Audio selected",
  "Creando evento...": "Creating event...",
  "Preparando archivos...": "Preparing files...",
  "Optimizando video...": "Optimizing video...",
  "Subiendo archivo...": "Uploading file...",
  "Registrando participación...": "Registering participation...",
  "Evento Chain creado exitosamente!": "Chain event created successfully!",
  "Has ganado": "You earned",
  "Error al crear evento": "Error creating event",
  "El título del evento es obligatorio": "Event title is required",
  "La encuesta debe tener al menos 2 opciones": "Poll must have at least 2 options",
  "El archivo seleccionado no es un audio válido": "Selected file is not a valid audio",
  "El archivo de audio es muy grande. Máximo 10MB": "Audio file is too large. Maximum 10MB",
  "El audio es muy largo. Máximo": "Audio is too long. Maximum",
  "segundos": "seconds",
  "cargado": "loaded",
  "Video muy largo para": "Video too long for",
  "Máximo": "Maximum",
  "actual:": "actual:",
  "Archivo muy grande. Máximo": "File too large. Maximum",
  "La recompensa total debe ser al menos 100 CFT": "Total reward must be at least 100 CFT",
  "Debe haber al menos 1 ganador": "There must be at least 1 winner",
  "Debes grabar o subir un audio para el evento": "You must record or upload audio for the event",
  "Participar en Evento de Audio": "Participate in Audio Event",
  "Participar en Campaña": "Participate in Campaign",
  "Instrucciones:": "Instructions:",
  "Escribe tu participación en el campo de texto. Sé creativo y original.": "Write your participation in the text field. Be creative and original.",
  "Sube una imagen relacionada con el evento. Formatos admitidos: JPG, PNG, GIF, WebP.": "Upload an image related to the event. Supported formats: JPG, PNG, GIF, WebP.",
  "Sube un video relacionado con el evento.": "Upload a video related to the event.",
  "Graba o sube un audio de respuesta.": "Record or upload an audio response.",
  "Completa tu participación según las indicaciones del evento.": "Complete your participation according to event instructions.",
  "Escribe tu participación...": "Write your participation...",
  "Enviar Participación": "Submit Participation",
  "Por favor ingresa tu participación": "Please enter your participation",
  "Por favor selecciona": "Please select",
  "una imagen": "an image",
  "un video": "a video",
  "un audio": "an audio",
  "Participación enviada! Has ganado": "Participation submitted! You earned",
  "El creador revisará tu participación pronto.": "The creator will review your participation soon.",
  "Ya has participado en este evento": "You already participated in this event",
  "Este evento ya alcanzó el máximo de participantes": "This event already reached maximum participants",
  "Sin participaciones aún": "No participations yet",
  "¡Sé el primero en participar en esta campaña!": "Be the first to participate in this campaign!",
  "Sin votos aún": "No votes yet",
  "¡Sé el primero en votar en esta encuesta!": "Be the first to vote in this poll!",
  "Resultados de la Encuesta": "Poll Results",
  "Total de votos:": "Total votes:",
  "voto": "vote",
  "Tu voto": "Your vote",
  "Pendiente": "Pending",
  "Aprobada": "Approved",
  "Rechazada": "Rejected",
  "Desconocido": "Unknown",
  "Audio de respuesta": "Audio response",
  "Participación": "Participation",
  "Ya has dado CFT a este comentario": "You already gave CFT to this comment",
  "CFT enviado! Has dado 2 CFT al comentario": "CFT sent! You gave 2 CFT to the comment",
  "Error al enviar tip": "Error sending tip",
  "Navegando al perfil de": "Navigating to profile of",
  "Cargando más comentarios...": "Loading more comments...",
  "No puedes dar like a tu propia publicación": "You cannot like your own post",
  "No puedes repost tus propios post": "You cannot repost your own posts",
  "Like removido": "Like removed",
  "Post reposteado! Aparecerá en tu sección de Reposts": "Post reposted! It will appear in your Reposts section",
  "Repost eliminado": "Repost removed",
  "Error al procesar el repost": "Error processing repost",
  "Error al procesar like": "Error processing like",
  "Debes iniciar sesión para ver el perfil": "You must log in to view the profile",
  "Error al cargar el perfil": "Error loading profile",
  "Error al cargar datos del perfil": "Error loading profile data",
  "Error inicializando perfil": "Error initializing profile",
  "Siguiendo": "Following",
  "Seguir": "Follow",
  "Pendiente": "Pending",
  "Solicitud Pendiente": "Pending Request",
  "Solicitud enviada. Espera la aprobación.": "Request sent. Wait for approval.",
  "¡Ahora sigues a este usuario!": "You now follow this user!",
  "Dejaste de seguir": "You unfollowed",
  "Solicitud cancelada": "Request canceled",
  "¿Cancelar solicitud de seguimiento?": "Cancel follow request?",
  "Error al procesar seguimiento": "Error processing follow",
  "Error cargando posts": "Error loading posts",
  "Este perfil es privado": "This profile is private",
  "Solo los seguidores aceptados pueden ver las publicaciones de": "Only accepted followers can view posts from",
  "Seguir para ver contenido": "Follow to view content",
  "Ya lo sigues": "You already follow them",
  "Sin posts aún": "No posts yet",
  "Escribe tu primer post arriba": "Write your first post above",
  "Este usuario no ha publicado nada aún": "This user hasn't posted anything yet",
  "Todas las publicaciones están ocultas": "All posts are hidden",
  "Has ocultado todas las publicaciones disponibles": "You have hidden all available posts",
  "Compra posts para construir tu colección digital": "Buy posts to build your digital collection",
  "Este usuario no ha comprado posts aún": "This user hasn't bought any posts yet",
  "No tienes posts en venta actualmente": "You don't have any posts for sale currently",
  "Este usuario no tiene posts en venta": "This user doesn't have any posts for sale",
  "Mi Colección": "My Collection",
  "En Venta": "For Sale",
  "No hay posts en esta sección": "No posts in this section",
  "Todas las publicaciones de la colección están ocultas": "All collection posts are hidden",
  "Todas las publicaciones en venta están ocultas": "All posts for sale are hidden",
  "Error al cargar colección": "Error loading collection",
  "Solo los seguidores aceptados pueden ver la colección de": "Only accepted followers can view the collection of",
  "Solo los seguidores aceptados pueden ver los eventos Chain de": "Only accepted followers can view Chain events from",
  "Solo los seguidores aceptados pueden ver los reposts de": "Only accepted followers can view reposts from",
  "Sin eventos Chain aún": "No Chain events yet",
  "Crea tu primer evento Chain arriba": "Create your first Chain event above",
  "Este usuario no ha creado eventos Chain aún": "This user hasn't created any Chain events yet",
  "Error al cargar eventos Chain": "Error loading Chain events",
  "Todos los eventos están ocultos": "All events are hidden",
  "Has ocultado todos los eventos Chain disponibles": "You have hidden all available Chain events",
  "Sin reposts aún": "No reposts yet",
  "Los posts que repostees aparecerán aquí": "Posts you repost will appear here",
  "Este usuario no ha reposteado nada aún": "This user hasn't reposted anything yet",
  "Error al cargar reposts": "Error loading reposts",
  "Reposteaste": "You reposted",
  "reposteó": "reposted",
  "Post original de": "Original post by",
  "Hacer privado": "Make private",
  "Hacer público": "Make public",
  "¿Hacer esta publicación": "Make this post",
  "Todos podrán verla aunque tu perfil sea privado": "Everyone will be able to see it even if your profile is private",
  "Solo tus seguidores podrán verla": "Only your followers will be able to see it",
  "Actualizando privacidad...": "Updating privacy...",
  "Publicación ahora es": "Post is now",
  "público": "public",
  "privado": "private",
  "Error al actualizar privacidad": "Error updating privacy",
  "¿Hacer este evento Chain": "Make this Chain event",
  "Todos podrán ver este evento aunque tu perfil sea privado": "Everyone will be able to see this event even if your profile is private",
  "Solo tus seguidores podrán ver este evento": "Only your followers will be able to see this event",
  "Evento ahora es": "Event is now",
  "Poner en venta": "Put for sale",
  "Cancelar venta": "Cancel sale",
  "Eliminar publicación": "Delete post",
  "Eliminar evento Chain": "Delete Chain event",
  "Ocultar publicación": "Hide post",
  "Ocultar evento Chain": "Hide Chain event",
  "Reportar Post": "Report Post",
  "Reportar Chain": "Report Chain",
  "¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.": "Are you sure you want to delete this post? This action cannot be undone.",
  "Eliminar": "Delete",
  "Eliminando publicación...": "Deleting post...",
  "Publicación eliminada correctamente": "Post deleted successfully",
  "Error al eliminar": "Error deleting",
  "¿Estás seguro de que quieres eliminar este evento? Esta acción no se puede deshacer.": "Are you sure you want to delete this event? This action cannot be undone.",
  "Eliminando evento...": "Deleting event...",
  "Evento eliminado correctamente": "Event deleted successfully",
  "Publicación ocultada. No volverás a verla": "Post hidden. You won't see it again",
  "Evento Chain ocultado. No volverás a verlo": "Chain event hidden. You won't see it again",
  "Error al ocultar publicación": "Error hiding post",
  "Error al ocultar evento Chain": "Error hiding Chain event",
  "Reportar publicación": "Report post",
  "Reportar comentario": "Report comment",
  "Reportar evento": "Report event",
  "Este contenido ya no está disponible": "This content is no longer available",
  "Tu reporte será revisado por nuestro equipo": "Your report will be reviewed by our team",
  "Selecciona el motivo del reporte:": "Select the reason for the report:",
  "Contenido inapropiado": "Inappropriate content",
  "Contenido sexual, violento o perturbador": "Sexual, violent or disturbing content",
  "Spam": "Spam",
  "Contenido repetitivo o irrelevante": "Repetitive or irrelevant content",
  "Acoso o bullying": "Harassment or bullying",
  "Intimidación o hostigamiento": "Intimidation or harassment",
  "Contenido violento": "Violent content",
  "Violencia gráfica o amenazas": "Graphic violence or threats",
  "Información falsa": "False information",
  "Desinformación o noticias falsas": "Misinformation or fake news",
  "Enviar reporte": "Submit report",
  "Por favor selecciona un motivo": "Please select a reason",
  "Reporte enviado. Gracias por ayudar a mantener ChainFeed seguro.": "Report submitted. Thank you for helping keep ChainFeed safe.",
  "Este contenido ya no existe o fue eliminado": "This content no longer exists or was deleted",
  "Error al enviar reporte": "Error submitting report",
  "EN VENTA": "FOR SALE",
  "Comprar": "Buy",
  "Colección": "Collection",
  "Ver historial de transacciones de esta publicación": "View transaction history for this post",
  "Comprar por": "Buy for",
  "Interacciones totales de la publicación:": "Total post interactions:",
  "Procesando compra...": "Processing purchase...",
  "Publicación comprada exitosamente! Nuevo balance:": "Post purchased successfully! New balance:",
  "Saldo insuficiente para esta compra": "Insufficient balance for this purchase",
  "Error: datos de compra no encontrados": "Error: purchase data not found",
  "Error al comprar": "Error purchasing",
  "Precio de Compra": "Purchase Price",
  "Vendedor": "Seller",
  "Tu Balance Actual": "Your Current Balance",
  "Balance después de comprar": "Balance after purchase",
  "¿Cancelar la venta de esta publicación?": "Cancel the sale of this post?",
  "Venta cancelada exitosamente": "Sale canceled successfully",
  "Error al cancelar venta": "Error canceling sale",
  "Precio de Venta": "Sale Price",
  "El precio debe ser al menos 1 CFT": "Price must be at least 1 CFT",
  "Procesando...": "Processing...",
  "Publicación puesta en venta por": "Post put for sale for",
  "Error al poner en venta": "Error putting for sale",
  "Estadísticas Actuales": "Current Stats",
  "Likes": "Likes",
  "Comentarios": "Comments",
  "Reposts": "Reposts",
  "Cargando historial de transacciones...": "Loading transaction history...",
  "Error al cargar historial de transacciones": "Error loading transaction history",
  "Historial de Transacciones": "Transaction History",
  "Sin transacciones registradas": "No transactions recorded",
  "Esta publicación aún no ha sido vendida o transferida": "This post has not been sold or transferred yet",
  "Publicación": "Post",
  "Creado por": "Created by",
  "Propietario actual:": "Current owner:",
  "Actualmente en venta por": "Currently for sale for",
  "Transacciones": "Transactions",
  "Volumen Total": "Total Volume",
  "Precio Promedio": "Average Price",
  "Comisiones plataforma:": "Platform fees:",
  "Total vendedores:": "Total to sellers:",
  "Venta": "Sale",
  "Transferencia": "Transfer",
  "Vendedor": "Seller",
  "Comprador": "Buyer",
  "Precio total:": "Total price:",
  "Fecha:": "Date:",
  "Tipo:": "Type:",
  "Venta directa": "Direct sale",
  "Comisión plataforma (5%):": "Platform fee (5%):",
  "Recibido por vendedor:": "Received by seller:",
  "Completada": "Completed",
  "Fallida": "Failed",
  "Cancelada": "Canceled",
  "Fecha inválida": "Invalid date",
  "Ahora": "Now",
  "¿Qué está pasando en el blockchain hoy?": "What's happening on the blockchain today?",
  "Publicar": "Publish",
  "Publicando...": "Publishing...",
  "¡Escribe algo o selecciona un archivo!": "Write something or select a file!",
  "Subiendo archivo...": "Uploading file...",
  "Creando publicación...": "Creating post...",
  "Post publicado exitosamente!": "Post published successfully!",
  "Error al publicar el post": "Error publishing post",
  "Tipo de archivo no válido": "Invalid file type",
  "El archivo es muy grande. Máximo": "File is too large. Maximum",
  "No se pudo optimizar el video, usando original": "Could not optimize video, using original",
  "Video optimizado:": "Video optimized:",
  "más ligero": "lighter",
  "ahorrados": "saved",
  "ahorró": "saved",
  "Optimizando video...": "Optimizing video...",
  "📂 Iniciando compresión...": "📂 Starting compression...",
  "🔧 Procesando video...": "🔧 Processing video...",
  "🗜️ Comprimiendo...": "🗜️ Compressing...",
  "📹 Codificando...": "📹 Encoding...",
  "✨ Finalizando...": "✨ Finalizing...",
  "✅ Completado": "✅ Completed",
  "Procesando...": "Processing...",
  "Cargando video...": "Loading video...",
  "Seguidores": "Followers",
  "Siguiendo": "Following",
  "NFTs": "NFTs",
  "Posts": "Posts",
  "Chain": "Chain",
  "Reposts": "Reposts",
  "Inicio": "Home",
  "Mi Perfil": "My Profile",
  "Mensaje": "Message",
  "Cartera": "Wallet",
  "Editar Perfil": "Edit Profile",
  "Cerrar sesión": "Log out",
  "Perfil Privado": "Private Profile",
  "Perfil Público": "Public Profile",
  "¿Estás seguro de que quieres cerrar tu sesión?": "Are you sure you want to log out?",
  "Cerrando sesión...": "Logging out...",
  "Sesión cerrada correctamente": "Logged out successfully",
  "Error al cerrar sesión": "Error logging out",
  "Sesión cerrada (con advertencias)": "Logged out (with warnings)",
  "Hacer perfil privado": "Make profile private",
  "Hacer perfil público": "Make profile public",
  "¿Estás seguro de que quieres hacer tu perfil privado? Solo tus seguidores aceptados podrán ver tus publicaciones.": "Are you sure you want to make your profile private? Only your accepted followers will be able to see your posts.",
  "¿Estás seguro de que quieres hacer tu perfil público? Todos los usuarios podrán ver tus publicaciones.": "Are you sure you want to make your profile public? All users will be able to see your posts.",
  "Hacer Privado": "Make Private",
  "Hacer Público": "Make Public",
  "Haciendo perfil privado...": "Making profile private...",
  "Haciendo perfil público...": "Making profile public...",
  "Perfil ahora es privado. Solo seguidores aceptados verán tus publicaciones.": "Profile is now private. Only accepted followers will see your posts.",
  "Perfil ahora es público. Todos pueden ver tus publicaciones.": "Profile is now public. Everyone can see your posts.",
  "Error al cambiar configuración de privacidad": "Error changing privacy settings",
  "Redirigiendo a editar perfil...": "Redirecting to edit profile...",
  "Abriendo editor de perfil...": "Opening profile editor...",
  "Abriendo chat...": "Opening chat...",
  "Error al cargar tu perfil": "Error loading your profile",
  "Usuario de ChainFeed 🚀": "ChainFeed User 🚀",
  "ver mas": "see more",
  
  
    "Tokens a distribuir": "Tokens to distribute",
  "Tokens para preventa": "Tokens for presale", 
  "Bonus Preventa": "Presale Bonus",
  "Gas en transacciones": "Gas in transactions",
  "Red social descentralizada - Comparte y conecta con tu comunidad": "Decentralized Social Network - Share and connect with your community",
  "ChainFeed - Perfil": "ChainFeed - Profile",
  "¿Qué está pasando en el blockchain hoy?": "What's happening in the blockchain today?",
  "Imagen": "Image",
  "Video": "Video",
  "Chain": "Chain",
  "Publicar 🚀": "Publish 🚀",
  "Posts": "Posts",
  "Reposts": "Reposts", 
  "Colección": "Collection",
  "Seguidores": "Followers",
  "Siguiendo": "Following",
  "CFT": "CFT",
  "Seguir": "Follow",
  "✉️ Mensaje": "✉️ Message",
  "Editar perfil": "Edit profile",
  "Perfil Público": "Public Profile",
  "Cerrar sesión": "Log out",
  "Optimizando video": "Optimizing video",
  "Preparando...": "Preparing...",
  "Silenciar video (sin controles de volumen)": "Mute video (no volume controls)",
  "Web3 Revolution": "Web3 Revolution",
  "DeFi Guide": "DeFi Guide",
  "NFT Collection": "NFT Collection", 
  "Blockchain Tutorial": "Blockchain Tutorial",
  "🔥 Trending": "🔥 Trending",
  "💬 Comentarios": "💬 Comments",
  "Escribe tu comentario... (usa @ para mencionar usuarios)": "Write your comment... (use @ to mention users)",
  "Comentar": "Comment",
  "📤 Compartir Post": "📤 Share Post",
  "Buscar usuarios que sigues mutuamente...": "Search for mutual followers...",
  "Compartir": "Share",
  "💰 Vender Publicación": "💰 Sell Publication",
  "Precio de Venta (CFT)": "Sale Price (CFT)",
  "Mínimo: 1 CFT. Tú recibirás el 95% (5% comisión de la plataforma)": "Minimum: 1 CFT. You'll receive 95% (5% platform fee)",
  "📊 Estadísticas actuales:": "📊 Current stats:",
  " likes": " likes",
  " comentarios": " comments",
  " reposts": " reposts",
  "⚠️ Al vender:": "⚠️ When selling:",
  "La publicación cambiará de dueño": "The publication will change ownership",
  "Los nuevos likes/comentarios beneficiarán al comprador": "New likes/comments will benefit the buyer",
  "No podrás editarla o eliminarla": "You won't be able to edit or delete it",
  "Cancelar": "Cancel",
  "💰 Poner en Venta": "💰 Put on Sale",
  "🛒 Comprar Publicación": "🛒 Buy Publication",
  "Precio:": "Price:",
  "Vendedor:": "Seller:",
  "Tu balance actual:": "Your current balance:",
  "Balance después de compra:": "Balance after purchase:",
  "Al comprar obtienes:": "When buying you get:",
  "🏆 Propiedad completa de la publicación": "🏆 Full ownership of the publication",
  "💰 Todos los CFT futuros por likes/comentarios": "💰 All future CFT from likes/comments",
  "✏️ Capacidad de editarla o eliminarla": "✏️ Ability to edit or delete it",
  "📈 Potencial de reventa a mayor precio": "📈 Potential to resell at higher price",
  "🛒 Comprar por": "🛒 Buy for",
  " CFT": " CFT",
  "⚡ Crear Evento Chain": "⚡ Create Chain Event",
  "Tipo de Evento": "Event Type",
  "Encuesta": "Poll",
  "Hasta 5 opciones": "Up to 5 options",
  "Campaña": "Campaign",
  "Con recompensas CFT": "With CFT rewards",
  "Audio": "Audio",
  "Graba o sube audio": "Record or upload audio",
  "Título del Evento": "Event Title",
  "Ej: ¿Cuál es tu criptomoneda favorita?": "Ex: What's your favorite cryptocurrency?",
  "Descripción": "Description",
  "Describe tu evento...": "Describe your event...",
  "Media Opcional (Instrucciones/Decoración)": "Optional Media (Instructions/Decoration)",
  "Agrega una imagen o video (máx. 30s). Tip: mostra cómo participar o decorar tu evento": "Add an image or video (max 30s). Tip: show how to participate or decorate your event",
  "📎 Seleccionar Imagen o Video": "📎 Select Image or Video",
  "Recompensa por Participar": "Participation Reward",
  "CFT por voto (mínimo 10 CFT)": "CFT per vote (minimum 10 CFT)",
  "Máximo participantes": "Maximum participants",
  "Opciones de la Encuesta": "Poll Options",
  "Opción 1": "Option 1",
  "Opción 2": "Option 2",
  "➕ Agregar opción": "➕ Add option",
  "Recompensa Total (CFT)": "Total Reward (CFT)",
  "Número de Ganadores": "Number of Winners",
  "Tipo de Respuesta Permitida": "Allowed Response Type",
  "📷 Imagen": "📷 Image",
  "🎥 Video": "🎥 Video",
  "📝 Texto": "📝 Text",
  "Audio Principal (máximo 1 minuto)": "Main Audio (maximum 1 minute)",
  "Graba o sube un audio describiendo tu evento": "Record or upload audio describing your event",
  "🎤 Grabar Audio": "🎤 Record Audio",
  "📁 Subir Audio": "📁 Upload Audio",
  "Detener": "Stop",
  "🎵 Audio grabado": "🎵 Recorded audio",
  "Tu navegador no soporta la reproducción de audio.": "Your browser doesn't support audio playback.",
  "Imagen Opcional": "Optional Image",
  "Agrega una imagen que acompañe tu audio (opcional)": "Add an image to accompany your audio (optional)",
  "🖼️ Seleccionar Imagen": "🖼️ Select Image",
  "🖼️ Imagen": "🖼️ Image",
  "🎵 Audio (15s)": "🎵 Audio (15s)",
  "Duración del Evento": "Event Duration",
  "1 día": "1 day",
  "3 días": "3 days", 
  "7 días": "7 days",
  "14 días": "14 days",
  "30 días": "30 days",
  "⚡ Crear Evento Chain": "⚡ Create Chain Event",
  "🎯 Participar en Campaña": "🎯 Participate in Campaign",
  "Tu Participación:": "Your Participation:",
  "Escribe tu participación...": "Write your participation...",
  "Selecciona tu archivo:": "Select your file:",
  "Seleccionar Imagen": "Select Image",
  "🎯 Enviar Participación": "🎯 Submit Participation",
  "🎨 Historial de Colección": "🎨 Collection History",
  "Instalar App": "Install App",
  
    "Usuario de ChainFeed 🚀": "ChainFeed User 🚀",
  "💼 Cartera": "💼 Wallet",
  "Silenciar video (sin controles de volumen)": "Mute video (no volume controls)",
  "Optimizando video": "Optimizing video", 
  "Perfil Privado": "Private Profile",
  
  "🔒": "🔒",
"Este perfil es privado": "This profile is private",
"Solo los seguidores aceptados pueden ver las publicaciones de": "Only accepted followers can view posts from",
"Solo los seguidores aceptados pueden ver la colección de": "Only accepted followers can view the collection of",
"Solo los seguidores aceptados pueden ver los eventos Chain de": "Only accepted followers can view Chain events from",
"Solo los seguidores aceptados pueden ver los reposts de": "Only accepted followers can view reposts from",

// Variaciones con @username
"pueden ver las publicaciones de @": "can view posts from @",
"pueden ver la colección de @": "can view the collection of @",
"pueden ver los eventos Chain de @": "can view Chain events from @",
"pueden ver los reposts de @": "can view reposts from @",

  "💼 Cartera": "💼 Wallet",
  "Usuario de ChainFeed 🚀": "ChainFeed User 🚀", 
  "Perfil Privado": "Private Profile",
  "sem": "wk",
  "mes": "mo",
  
   "ChainFeed - Inicio": "ChainFeed - Home",
  "ChainFeed": "ChainFeed",
  "🔍 Buscando posts sobre": "🔍 Searching posts about",
  "¿Qué está pasando en el blockchain hoy?": "What's happening in the blockchain today?",
  "Publicar 🚀": "Publish 🚀",
  "Imagen": "Image",
  "Video": "Video",
  "GIF": "GIF",
  "🔥 Virales": "🔥 Viral",
  " POSTS": " POSTS", 
  "⛓️ Chains": "⛓️ Chains",
  "💰 Market": "💰 Market",
  "🌐 Todos": "🌐 All",
  "👥 Seguidos": "👥 Following",
  "⏰ Últimas 24h": "⏰ Last 24h",
  "📅 7 días": "📅 7 days",
  "📆 30 días": "📆 30 days",
  "💬 Comentarios": "💬 Comments",
  "Escribe tu comentario... (usa @ para mencionar usuarios)": "Write your comment... (use @ to mention users)",
  "Comentar": "Comment",
  "📤 Compartir Post": "📤 Share Post",
  "Buscar usuarios que sigues mutuamente...": "Search for mutual followers...",
  "Compartir externamente": "Share externally",
  "Compartir por WhatsApp": "Share via WhatsApp",
  "Enviar a seguidores mutuos": "Send to mutual followers",
  "Compartir": "Share",
  "🎯 Participar en Campaña": "🎯 Participate in Campaign",
  "Tu Participación:": "Your Participation:",
  "Escribe tu participación...": "Write your participation...",
  "Selecciona tu archivo:": "Select your file:",
  "Seleccionar Imagen": "Select Image",
  "Cancelar": "Cancel",
  "🎯 Enviar Participación": "🎯 Submit Participation",
  "Cerrar": "Close",
  "Sin comentarios aún": "No comments yet",
  "¡Sé el primero en comentar!": "Be the first to comment!",
  "Cargando comentarios...": "Loading comments...",
  "Enviando...": "Sending...",
  "Responder": "Reply",
  "Ver respuestas": "View replies",
  "Ocultar respuestas": "Hide replies",
  "seg": "sec",
  "min": "min",
  "h": "h",
  "d": "d",
  "sem": "wk",
  "mes": "mo",
  "a": "y",
  "Ahora": "Now",
  "Fecha inválida": "Invalid date",
  "Error": "Error",
  "TOP": "TOP",
  "¡Increíble post! Me encanta cómo explicas los conceptos de Web3. Definitivamente el futuro es descentralizado 🚀": "Amazing post! I love how you explain Web3 concepts. Definitely the future is decentralized 🚀",
  "Totalmente de acuerdo! La descentralización es clave para el futuro 💯": "Totally agree! Decentralization is key for the future 💯",
  "Me parece fascinante cómo están tokenizando las interacciones sociales. Esto es el futuro de las redes sociales 💎": "I find it fascinating how they're tokenizing social interactions. This is the future of social networks 💎",
  "Como desarrollador, me emociona ver cómo la comunidad está adoptando estas tecnologías. ¿Alguien más está trabajando en proyectos similares?": "As a developer, I'm excited to see how the community is adopting these technologies. Is anyone else working on similar projects?",
  "¡Sí! Estoy trabajando en un protocolo similar. Me encantaría colaborar 🤝": "Yes! I'm working on a similar protocol. I'd love to collaborate 🤝",
  "¡Cuenten conmigo! Siempre busco proyectos interesantes": "Count me in! I'm always looking for interesting projects",
  "Ocultar post": "Hide post",
  "Reportar post": "Report post",
  "⚠️ Debes iniciar sesión para acceder al inicio": "⚠️ You must log in to access the home",
  "🚀 Usuario de ChainFeed | 💎 Explorando Web3": "🚀 ChainFeed User | 💎 Exploring Web3",
  "Optimizando video para participación": "Optimizing video for participation",
  "Preparando...": "Preparing...",
  "Conectando...": "Connecting...",
  "Buffering video...": "Buffering video...",
  "✅ Video listo": "✅ Video ready",
  "Error cargando video": "Error loading video",
  "El video no se pudo cargar correctamente": "The video could not load correctly",
  "✨ ¡Post publicado exitosamente! Has ganado 5 CFT": "✨ Post published successfully! You earned 5 CFT",
  "❌ Error al publicar post": "❌ Error publishing post",
  "⚠️ Error al cargar tu perfil": "⚠️ Error loading your profile",
  "💰 Abriendo cartera digital...": "💰 Opening digital wallet...",
  "⚙️ Abriendo configuración...": "⚙️ Opening settings...",
  "📤 Función de compartir - Demo": "📤 Share function - Demo",
  "✨ ¡Respuesta publicada!": "✨ Reply published!",
  "✨ ¡Comentario publicado!": "✨ Comment published!",
  "✅ ¡Ahora sigues a": "✅ You're now following",
  "❌ Has dejado de seguir a": "❌ You've unfollowed",
  "🔍 Buscando": "🔍 Searching",
  "📎 seleccionado": "selected",
  "🔄 ¡Post reposteado!": "🔄 Post reposted!",
  "❌ Repost eliminado": "❌ Repost removed",
  "❤️ ¡Like agregado": "❤️ Like added",
  "❤️ Like removido": "❤️ Like removed",
  "❌ Error al procesar like": "❌ Error processing like",
  "❌ Error al procesar repost": "❌ Error processing repost",
  "Ver": "View",
  "Ver quién dio like": "View who liked",
  "📲 Instalar App": "📲 Install App",
  "¡Escribe algo primero!": "Write something first!",
  "Publicando... ⏳": "Publishing... ⏳",
  "Promover contenido": "Promote content",

//Variaciones con @username
  'ChainFeed - Inicio': 'ChainFeed - Home',
  'chainfeed': 'chainfeed',
  '📲 Instalar App': '📲 Install App',
  '🔥 Virales': '🔥 Viral',
  'Posts': 'Posts',
  '⛓️ Chain': '⛓️ Chain',
  '💰 Market': '💰 Market',
  '⏰ Últimas 24h': '⏰ Last 24h',
  '📅 7 días': '📅 7 days',
  '📆 30 días': '📆 30 days',
  '🌐 Todos': '🌐 All',
  '👥 Seguidos': '👥 Following',
  '💬 Comentarios': '💬 Comments',
  'Escribe tu comentario... (usa @ para mencionar usuarios)': 'Write your comment... (use @ to mention users)',
  'Comentar': 'Comment',
  'Sin comentarios aún': 'No comments yet',
  '¡Sé el primero en comentar!': 'Be the first to comment!',
  'TOP': 'TOP',
  'Responder': 'Reply',
  'Ocultar respuestas': 'Hide replies',
  'Ver respuestas': 'View replies',
  'Escribe tu respuesta... (usa @ para mencionar usuarios)': 'Write your reply... (use @ to mention users)',
  'Cancelar': 'Cancel',
  '📤 Compartir Post': '📤 Share Post',
  'Compartir externamente': 'Share externally',
  'Compartir por WhatsApp': 'Share via WhatsApp',
  'Enviar a seguidores mutuos': 'Send to mutual followers',
  'Buscar usuarios que sigues mutuamente...': 'Search users you follow mutually...',
  '🎯 Participar en Campaña': '🎯 Participate in Campaign',
  'Tu Participación:': 'Your Participation:',
  'Escribe tu participación...': 'Write your participation...',
  'Selecciona tu archivo:': 'Select your file:',
  'Seleccionar Imagen': 'Select Image',
  'Optimizando video para participación': 'Optimizing video for participation',
  'Preparando...': 'Preparing...',
  '🎯 Enviar Participación': '🎯 Submit Participation',
  'Cerrar': 'Close',
  'Ocultar post': 'Hide post',
  'Compartir': 'Share',
  'Reportar post': 'Report post',
  '¿Qué está pasando en el blockchain hoy?': 'What\'s happening in the blockchain today?',
  'Publicando... ⏳': 'Publishing... ⏳',
  '✨ ¡Post publicado exitosamente! Has ganado 5 CFT': '✨ Post published successfully! You earned 5 CFT',
  '❌ Error al publicar post': '❌ Error publishing post',
  '⚠️ Debes iniciar sesión para acceder al inicio': '⚠️ You must log in to access the home',
  '🚀 Usuario de ChainFeed | 💎 Explorando Web3': '🚀 ChainFeed User | 💎 Exploring Web3',
  '✅ ¡Ahora sigues a': '✅ You are now following',
  '❌ Has dejado de seguir a': '❌ You have unfollowed',
  '🔍 Buscando posts sobre': '🔍 Searching posts about',
  '📎': '📎',
  'seleccionado': 'selected',
  '💰 Abriendo cartera digital...': '💰 Opening digital wallet...',
  '⚙️ Abriendo configuración...': '⚙️ Opening settings...',
  '📤 Función de compartir - Demo': '📤 Share function - Demo',
  '✨ ¡Comentario publicado!': '✨ Comment published!',
  '✨ ¡Respuesta publicada!': '✨ Reply published!',
  '❌ Error al procesar el repost': '❌ Error processing repost',
  '🔄 ¡Post reposteado!': '🔄 Post reposted!',
  '❌ Repost eliminado': '❌ Repost removed',
  'Cargando comentarios...': 'Loading comments...',
  'Conectando...': 'Connecting...',
  'Buffering video...': 'Buffering video...',
  '✅ Video listo': '✅ Video ready',
  'Error cargando video': 'Error loading video',
  'El video no se pudo cargar correctamente': 'The video could not be loaded correctly',
  'Más opciones': 'More options',
  'Ver': 'View',
  'Ver quién dio like': 'View who liked',
  '❤️ Like agregado': '❤️ Like added',
  '❤️ Like removido': '❤️ Like removed',
  'Error al procesar like': 'Error processing like',
  'Error al procesar repost': 'Error processing repost',
  'Fecha inválida': 'Invalid date',
  'seg': 's',
  'min': 'min',
  'h': 'h',
  'd': 'd',
  'sem': 'w',
  'mes': 'mo',
  'a': 'y',
  'Seguir': 'Follow',
  'Siguiendo': 'Following',
  'Preventa en Vivo - Fase 1': 'Live Presale - Phase 1',
  '🚀 Preventa en Vivo - Fase 1': '🚀 Live Presale - Phase 1',
  'Gana tokens desde tu primer like': 'Earn tokens from your first like',
  'Gana tokens desde': 'Earn tokens from',
  'tu primer like': 'your first like',
  'Gana tokens ofsde tu primer like': 'Earn tokens from your first like',
  'La red social que recompensa cada interacción': 'The social network that rewards every interaction',
  'Comprar Tokens Ahora': 'Buy Tokens Now',
  'Ver Whitepaper': 'View Whitepaper',
  'Comprar CFT': 'Buy CFT',
  'CFT': 'CFT',
  
    'EVENTOS CHAIN - ARCHIVO COMPLETO ACTUALIZADO': 'CHAIN EVENTS - COMPLETE UPDATED FILE',
  'Loading Chain content - UNIFIED VERSION...': 'Loading Chain content - UNIFIED VERSION...',
  'Chain container not found - sistema unificado no funcionó': 'Chain container not found - unified system did not work',
  'Cargando eventos Chain...': 'Loading Chain events...',
  'Fetching chain events...': 'Fetching chain events...',
  'No se encontró contenedor para mostrar eventos': 'No container found to display events',
  'Context:': 'Context:',
  'Profile': 'Profile',
  'Feed Inicio': 'Home Feed',
  'Username:': 'Username:',
  'FEED INICIO (todos los visibles)': 'HOME FEED (all visible)',
  'Request data:': 'Request data:',
  'Response status:': 'Response status:',
  'El archivo PHP obtener_eventos_chain.php no fue encontrado. Verifique que existe en /php/': 'The PHP file obtener_eventos_chain.php was not found. Please verify it exists in /php/',
  'Chain events response:': 'Chain events response:',
  'Error cargando eventos Chain': 'Error loading Chain events',
  'Error loading chain events:': 'Error loading chain events:',
  'Rendering': 'Rendering',
  'chain events in:': 'chain events in:',
  'No container element provided for rendering': 'No container element provided for rendering',
  'No hay eventos Chain visibles': 'No visible Chain events',
  'Los eventos Chain aparecerán aquí cuando se publiquen': 'Chain events will appear here when published',
  'Mostrar eventos ocultos': 'Show hidden events',
  'Cargar más eventos': 'Load more events',
  'Successfully rendered': 'Successfully rendered',
  'chain events': 'chain events',
  'Eventos ocultos restaurados': 'Hidden events restored',
  'Verificando propiedad:': 'Verifying ownership:',
  'Tipo de evento no reconocido': 'Unrecognized event type',
  'Encuesta sin opciones': 'Poll without options',
  'Ya votaste': 'You already voted',
  'Puedes votar': 'You can vote',
  'Votación cerrada': 'Voting closed',
  'Máximo de participantes alcanzado': 'Maximum participants reached',
  'Tokens totales': 'Total tokens',
  'Ganadores': 'Winners',
  'Por ganador': 'Per winner',
  'Tipo de respuesta:': 'Response type:',
  'Participar en campaña': 'Participate in campaign',
  'Ya participas en esta campaña': 'You already participate in this campaign',
  'Campaña finalizada': 'Campaign finished',
  'Audio Chain Event': 'Audio Chain Event',
  'Duración:': 'Duration:',
  'Audio disponible': 'Audio available',
  'Tu navegador no soporta el elemento de audio.': 'Your browser does not support the audio element.',
  'Respuesta requerida:': 'Response required:',
  'Participar en evento de audio': 'Participate in audio event',
  'Ya participas en este evento': 'You already participate in this event',
  'Evento finalizado': 'Event finished',
  'Voting in poll': 'Voting in poll',
  'option': 'option',
  '¡Voto registrado! Ganaste': 'Vote registered! You earned',
  'tokens.': 'tokens.',
  '¡Voto registrado correctamente!': 'Vote registered successfully!',
  'Error al votar': 'Error voting',
  'Error voting in poll:': 'Error voting in poll:',
  'Error al registrar el voto:': 'Error registering vote:',
  'Opening participation modal for campaign': 'Opening participation modal for campaign',
  'Error: Evento no encontrado': 'Error: Event not found',
  'Ya has participado en esta campaña': 'You already participated in this campaign',
  'Opening participation modal for audio event': 'Opening participation modal for audio event',
  'Ya has participado en este evento de audio': 'You already participated in this audio event',
  'Error: Modal de participación no encontrado': 'Error: Participation modal not found',
  'Instrucciones:': 'Instructions:',
  'Escribe tu participación en el campo de texto. Sé creativo y original.': 'Write your participation in the text field. Be creative and original.',
  'Sube una imagen relacionada con el evento. Formatos admitidos: JPG, PNG, GIF, WebP.': 'Upload an image related to the event. Supported formats: JPG, PNG, GIF, WebP.',
  'Sube un video relacionado con el evento.': 'Upload a video related to the event.',
  'Máximo 7 segundos.': 'Maximum 7 seconds.',
  'Formatos: MP4, WebM, MOV.': 'Formats: MP4, WebM, MOV.',
  'Graba o sube un audio de respuesta.': 'Record or upload an audio response.',
  'Máximo 15 segundos.': 'Maximum 15 seconds.',
  'Formatos: MP3, WAV, WebM, M4A.': 'Formats: MP3, WAV, WebM, M4A.',
  'Completa tu participación según las indicaciones del evento.': 'Complete your participation according to the event instructions.',
  'Imagen': 'Image',
  'Video': 'Video',
  'Texto': 'Text',
  'Audio (15s)': 'Audio (15s)',
  'Archivo': 'File',
  'Seleccionando media para participación, tipo:': 'Selecting media for participation, type:',
  'No hay evento actual para participación': 'No current event for participation',
  'Archivo seleccionado:': 'File selected:',
  'Tipo:': 'Type:',
  'Archivo muy grande. Máximo': 'File too large. Maximum',
  'MB': 'MB',
  'seleccionado correctamente': 'selected successfully',
  'Error refreshing event:': 'Error refreshing event:',
  'Resetting audio recording state...': 'Resetting audio recording state...',
  'Starting audio recording...': 'Starting audio recording...',
  'Tu navegador no soporta grabación de audio': 'Your browser does not support audio recording',
  'Audio data available, size:': 'Audio data available, size:',
  'Audio recorder stopped': 'Audio recorder stopped',
  'Audio recorder error:': 'Audio recorder error:',
  'Error en la grabación:': 'Error recording:',
  'Grabando audio...': 'Recording audio...',
  'Stopping audio recording, current state:': 'Stopping audio recording, current state:',
  'Not recording or no recorder available': 'Not recording or no recorder available',
  'Calculated duration:': 'Calculated duration:',
  'seconds': 'seconds',
  'Procesando grabación...': 'Processing recording...',
  'Processing recording, chunks:': 'Processing recording, chunks:',
  'duration:': 'duration:',
  'No se pudo procesar la grabación': 'Could not process recording',
  'La grabación es muy corta (mínimo 1 segundo)': 'Recording is too short (minimum 1 second)',
  'La grabación es muy larga (máximo 15 segundos)': 'Recording is too long (maximum 15 seconds)',
  'Created audio blob, size:': 'Created audio blob, size:',
  'type:': 'type:',
  'Created file:': 'Created file:',
  'File read successfully for preview': 'File read successfully for preview',
  'Audio file saved to global variables:': 'Audio file saved to global variables:',
  'Error reading file for preview:': 'Error reading file for preview:',
  'Error procesando el audio para preview': 'Error processing audio for preview',
  'Audio grabado': 'Audio recorded',
  's': 's',
  'Error procesando grabación:': 'Error processing recording:',
  'Error procesando la grabación:': 'Error processing recording:',
  'Closing participate modal...': 'Closing participate modal...',
  'Removing participation file...': 'Removing participation file...',
  'Archivo removido': 'File removed',
  'Submitting participation for event:': 'Submitting participation for event:',
  'Error: No hay evento seleccionado': 'Error: No event selected',
  'Enviando... ⏳': 'Sending... ⏳',
  'Por favor ingresa tu participación': 'Please enter your participation',
  'Checking for selected file:': 'Checking for selected file:',
  'una imagen': 'an image',
  'un video': 'a video',
  'un audio': 'an audio',
  'El archivo de audio está vacío': 'The audio file is empty',
  'El archivo debe ser de tipo audio': 'The file must be an audio type',
  'Audio file validation passed:': 'Audio file validation passed:',
  'Subiendo archivo... 📤': 'Uploading file... 📤',
  'Uploading recorded audio as base64...': 'Uploading recorded audio as base64...',
  'Uploading file via FormData...': 'Uploading file via FormData...',
  'Upload response status:': 'Upload response status:',
  'Upload error response:': 'Upload error response:',
  'Error en el servidor al subir archivo:': 'Server error uploading file:',
  'Upload response data:': 'Upload response data:',
  'Error subiendo archivo:': 'Error uploading file:',
  'No file data found in upload response:': 'No file data found in upload response:',
  'Available keys:': 'Available keys:',
  'Error: archivo no procesado correctamente en el servidor': 'Error: file not processed correctly on server',
  'Duración obtenida del archivo:': 'Duration obtained from file:',
  'Duración obtenida de recordedDuration:': 'Duration obtained from recordedDuration:',
  'Duración obtenida de variable global:': 'Duration obtained from global variable:',
  'Duración estimada por tamaño:': 'Duration estimated by size:',
  'Enviando duración de audio al servidor:': 'Sending audio duration to server:',
  'Registrando participación... ✨': 'Registering participation... ✨',
  'Sending participation data to server:': 'Sending participation data to server:',
  'Participation response status:': 'Participation response status:',
  'Participation error response:': 'Participation error response:',
  'Error del servidor:': 'Server error:',
  'Participation response data:': 'Participation response data:',
  '¡Participación enviada! Has ganado': 'Participation sent! You earned',
  'CFT. El creador revisará tu participación pronto.': 'CFT. The creator will review your participation soon.',
  '¡Participación enviada exitosamente! El creador la revisará pronto.': 'Participation sent successfully! The creator will review it soon.',
  'Error enviando participación:': 'Error sending participation:',
  'Error del servidor': 'Server error',
  'showChainError called with:': 'showChainError called with:',
  'Error message displayed successfully': 'Error message displayed successfully',
  'Failed to display error message:': 'Failed to display error message:',
  'Error cargando eventos Chain:': 'Error loading Chain events:',
  'Error cargando eventos': 'Error loading events',
  'Error desconocido': 'Unknown error',
  'Reintentar': 'Retry',
  'Compartiendo evento Chain:': 'Sharing Chain event:',
  'ShareSystem no está definido': 'ShareSystem is not defined',
  'Error del sistema. Recarga la página.': 'System error. Reload the page.',
  'No se encontró el contenedor del evento': 'Event container not found',
  'Error: No se encontró el evento': 'Error: Event not found',
  'ShareSystem configurado para Chain:': 'ShareSystem configured for Chain:',
  'Error: Modal de compartir no encontrado': 'Error: Share modal not found',
  'Compartir Evento Chain': 'Share Chain Event',
  'Cargando usuarios seguidos...': 'Loading followed users...',
  'Usuario obtenido de CHAINFEED_CONFIG:': 'User obtained from CHAINFEED_CONFIG:',
  'Usuario obtenido de CommentsSystem:': 'User obtained from CommentsSystem:',
  'Obteniendo usuario desde verificar_sesion.php...': 'Getting user from verificar_sesion.php...',
  'Usuario obtenido de sesión:': 'User obtained from session:',
  'No se pudo obtener el usuario actual. Por favor, recarga la página.': 'Could not get current user. Please reload the page.',
  'Usando username:': 'Using username:',
  'Error HTTP:': 'HTTP Error:',
  'Error al cargar usuarios seguidos': 'Error loading followed users',
  'Error cargando usuarios seguidos:': 'Error loading followed users:',
  'Error al cargar usuarios:': 'Error loading users:',
  'Usuarios seguidos cargados para Chain:': 'Followed users loaded for Chain:',
  'No se encontraron usuarios': 'No users found',
  'No hay usuarios que sigas mutuamente o que coincidan con tu búsqueda': 'No mutual followers or users matching your search',
  'Mensaje opcional:': 'Optional message:',
  'Escribe tu mensaje aquí...': 'Write your message here...',
  '/200': '/200',
  'Selecciona al menos un usuario': 'Select at least one user',
  'Error: No se encontró el evento a compartir': 'Error: Event to share not found',
  'Compartiendo... ⏳': 'Sharing... ⏳',
  'Compartiendo evento Chain:': 'Sharing Chain event:',
  'Error del servidor:': 'Server error:',
  'Error al compartir el evento': 'Error sharing event',
  'Evento Chain compartido con': 'Chain event shared with',
  'usuario': 'user',
  'Enviado a:': 'Sent to:',
  'no pudo': 'could not',
  'recibir el mensaje': 'receive the message',
  'Tu sesión ha expirado. Inicia sesión nuevamente.': 'Your session has expired. Log in again.',
  'Error al compartir evento Chain:': 'Error sharing Chain event:',
  'Tipo actual:': 'Current type:',
  'Toggle user:': 'Toggle user:',
  'Total seleccionados:': 'Total selected:',
  'Actualizando botón para Chain Event': 'Updating button for Chain Event',
  'Actualizando botón para Post Normal': 'Updating button for Normal Post',
  'no está definida': 'is not defined',
  'Filtrar usuarios por búsqueda': 'Filter users by search',
  'Sistema de compartir eventos Chain inicializado': 'Chain event sharing system initialized',
  'Dropdown no encontrado para:': 'Dropdown not found for:',
  'Toggle menu para:': 'Toggle menu for:',
  'Menú abierto para:': 'Menu opened for:',
  'Menú cerrado para:': 'Menu closed for:',
  'Cambiando privacidad de evento Chain:': 'Changing Chain event privacy:',
  '¿Hacer este evento público?': 'Make this event public?',
  '✅ Todos podrán verlo (incluso quienes no te siguen)': '✅ Everyone will see it (even those who don\'t follow you)',
  '¿Hacer este evento privado?': 'Make this event private?',
  '🔒 Solo tus seguidores podrán verlo': '🔒 Only your followers will see it',
  'Cambiando a': 'Changing to',
  'Llamando a:': 'Calling:',
  'Archivo PHP no encontrado. Verifica que "actualizar_privacidad_evento_chain.php" existe en /php/': 'PHP file not found. Verify that "actualizar_privacidad_evento_chain.php" exists in /php/',
  'Error response:': 'Error response:',
  'Error del servidor': 'Server error',
  'Response data:': 'Response data:',
  'Evento ahora es': 'Event is now',
  'Error cambiando privacidad:': 'Error changing privacy:',
  'Eliminando evento Chain:': 'Deleting Chain event:',
  '¿Estás seguro de que deseas eliminar este evento?': 'Are you sure you want to delete this event?',
  'Esta acción no se puede deshacer.': 'This action cannot be undone.',
  'Eliminando evento...': 'Deleting event...',
  'Evento eliminado correctamente': 'Event deleted successfully',
  'Ocultando evento Chain:': 'Hiding Chain event:',
  '¿Ocultar este evento?': 'Hide this event?',
  'Solo desaparecerá para ti, otros usuarios seguirán viéndolo.': 'It will only disappear for you, other users will still see it.',
  'Evento ocultado correctamente': 'Event hidden successfully',
  'Reportando evento Chain:': 'Reporting Chain event:',
  '¿Reportar este evento por contenido inapropiado?': 'Report this event for inappropriate content?',
  'Se revisará y se tomarán acciones si es necesario.': 'It will be reviewed and actions taken if necessary.',
  'Enviando reporte...': 'Sending report...',
  'Error al enviar reporte': 'Error sending report',
  'Evento reportado. Gracias por mantener la comunidad segura': 'Event reported. Thank you for keeping the community safe',
  'Error al procesar reporte': 'Error processing report',
  'Error reportando evento:': 'Error reporting event:',
  'Promocionando evento Chain:': 'Promoting Chain event:',
  '¿Promocionar este evento?': 'Promote this event?',
  'Tu evento aparecerá destacado en el feed de Chain por 24 horas.': 'Your event will be featured in the Chain feed for 24 hours.',
  'Procesando promoción...': 'Processing promotion...',
  'Evento promocionado exitosamente': 'Event promoted successfully',
  'Error promocionando evento:': 'Error promoting event:',
  'Sistema de menú para eventos Chain cargado': 'Chain event menu system loaded',
  'Sistema de eventos Chain completamente cargado': 'Chain event system fully loaded',
  'No se encontró el elemento del evento': 'Event element not found',
  'Usando sistema de promoción global': 'Using global promotion system',
  '¿Deseas promocionar este evento?': 'Do you want to promote this event?',
  'Tu evento aparecerá destacado en el feed de Chain.': 'Your event will be featured in the Chain feed.',
  
  'FUNCIÓN PRINCIPAL PARA CARGAR POSTS VIRALES': 'MAIN FUNCTION TO LOAD VIRAL POSTS',
  'Estado del feed viral': 'Viral feed state',
  'posts': 'posts',
  'currentOffset': 'currentOffset',
  'limit': 'limit',
  'isLoading': 'isLoading',
  'hasMore': 'hasMore',
  'totalPosts': 'totalPosts',
  'currentPeriod': 'currentPeriod',
  'NUEVA FUNCIÓN: Filtrar posts virales por período': 'NEW FUNCTION: Filter viral posts by period',
  'Cambiando período viral a:': 'Changing viral period to:',
  'Error al cargar posts virales': 'Error loading viral posts',
  'Error en la respuesta del servidor': 'Error in server response',
  'Posts virales cargados': 'Viral posts loaded',
  'posts': 'posts',
  'Error cargando posts virales:': 'Error loading viral posts:',
  'Renderizar posts virales en el DOM': 'Render viral posts in the DOM',
  'Crear elemento DOM para un post viral con ranking': 'Create DOM element for a viral post with ranking',
  'VERIFICAR SI EL POST ESTÁ OCULTO': 'CHECK IF POST IS HIDDEN',
  'CHAINFEED_CONFIG no está disponible todavía.': 'CHAINFEED_CONFIG is not available yet.',
  'VERIFICAR PROPIEDAD DEL POST (igual que en feed de inicio)': 'CHECK POST OWNERSHIP (same as home feed)',
  'Procesar contenido (hashtags, menciones)': 'Process content (hashtags, mentions)',
  'Formatear tiempo': 'Format time',
  'Calcular indicador de viralidad': 'Calculate virality indicator',
  'OBTENER CONTADORES REALES': 'GET REAL COUNTERS',
  'OBTENER ESTADOS DE INTERACCIÓN DEL USUARIO': 'GET USER INTERACTION STATUSES',
  'VERIFICAR SI ES POST PROMOCIONADO': 'CHECK IF POST IS PROMOTED',
  'Generar ID único para el menú': 'Generate unique ID for menu',
  'GENERAR OPCIONES DE MENÚ (IGUAL QUE EN FEED DE INICIO)': 'GENERATE MENU OPTIONS (SAME AS HOME FEED)',
  'SOLO MOSTRAR "PROMOCIONAR" SI NO ESTÁ PROMOCIONADO': 'ONLY SHOW "PROMOTE" IF NOT PROMOTED',
  'CONTENEDOR CON BADGE Y MENÚ JUNTOS': 'CONTAINER WITH BADGE AND MENU TOGETHER',
  'Promocionado': 'Promoted',
  'Más opciones': 'More options',
  'Promocionar post': 'Promote post',
  'Hacer privado': 'Make private',
  'Hacer público': 'Make public',
  'Eliminar publicación': 'Delete post',
  'Cancelar venta': 'Cancel sale',
  'Poner en venta': 'Put on sale',
  'MENÚ PARA NO PROPIETARIO (CON OCULTAR)': 'MENU FOR NON-OWNER (WITH HIDE)',
  'Ocultar post': 'Hide post',
  'Reportar post': 'Report post',
  'interacciones': 'interactions',
  'Ver': 'View',
  'Ver quién dio like': 'See who liked',
  'Controlar volumen': 'Control volume',
  'Generar opciones del menú desplegable según el estado del post': 'Generate dropdown menu options based on post status',
  'Opciones para usuarios que NO son dueños del post': 'Options for users who are NOT post owners',
  'Reportar publicación': 'Report post',
  'Opciones para el dueño del post': 'Options for post owner',
  'Opción de privacidad': 'Privacy option',
  'Opción de eliminar': 'Delete option',
  'Si está en venta, opción de cancelar venta': 'If for sale, cancel sale option',
  'Obtener icono de viralidad según interacciones': 'Get virality icon based on interactions',
  'Mostrar estadísticas especiales para posts virales': 'Show special statistics for viral posts',
  'Configurar scroll infinito para posts virales': 'Set up infinite scroll for viral posts',
  'Mostrar estado vacío para posts virales': 'Show empty state for viral posts',
  'No hay posts virales': 'No viral posts',
  'No se encontraron posts con interacciones en los últimos 7 días': 'No posts with interactions found in the last 7 days',
  'Ver todos los posts': 'View all posts',
  'Mostrar estado de error para posts virales': 'Show error state for viral posts',
  'Error al cargar posts virales': 'Error loading viral posts',
  'No pudimos cargar los posts virales. Intenta recargar.': 'We couldn\'t load viral posts. Try reloading.',
  'Reintentar': 'Retry',
  'ACTUALIZAR FUNCIONES DE NAVEGACIÓN': 'UPDATE NAVIGATION FUNCTIONS',
  'Mostrar posts virales - FUNCIÓN ACTUALIZADA': 'Show viral posts - UPDATED FUNCTION',
  'Mostrar posts normales - FUNCIÓN ACTUALIZADA': 'Show normal posts - UPDATED FUNCTION',
  'ESTILOS CSS PARA POSTS VIRALES': 'CSS STYLES FOR VIRAL POSTS',
  'Estilos para posts virales': 'Styles for viral posts',
  'Rankings especiales': 'Special rankings',
  'Responsive para indicador viral': 'Responsive for viral indicator',
  'FUNCIONES DE LOADING Y ESTADOS': 'LOADING AND STATUS FUNCTIONS',
  'Cargando posts virales...': 'Loading viral posts...',
  'Error al cargar posts virales': 'Error loading viral posts',
  'No pudimos cargar el contenido viral. Intenta recargar la página.': 'We couldn\'t load viral content. Try reloading the page.',
  'No hay posts virales en este momento': 'No viral posts at the moment',
  'Parece que no hay contenido viral disponible en este período.': 'It seems there is no viral content available in this period.',
  'Ver últimos 30 días': 'View last 30 days',
  'INTEGRACIÓN CON SISTEMA DE MODAL DE LIKES': 'INTEGRATION WITH LIKE MODAL SYSTEM',
  'Actualizar botón de likes en posts virales después de dar/quitar like': 'Update like button in viral posts after liking/unliking',
  'Integración con modal de likes para posts virales cargada': 'Integration with like modal for viral posts loaded',
  'EXPORTER FUNCIONES GLOBALMENTE': 'EXPOSE FUNCTIONS GLOBALLY',
  'Sistema de posts virales cargado correctamente': 'Viral posts system loaded correctly',
  'viral': 'viral',
  'normal': 'normal',
  '24h': '24h',
  '7d': '7d',
  '30d': '30d',
  'Últimas 24h': 'Last 24h',
  '7 días': '7 days',
  '30 días': '30 days',
  'No hay posts virales visibles': 'No visible viral posts',
  'Los posts virales aparecerán aquí cuando tengan interacciones': 'Viral posts will appear here when they have interactions',
  'Cargar más posts virales': 'Load more viral posts',
  'posts virales': 'viral posts',
  'Posts virales restaurados': 'Viral posts restored',
  'Verificando propiedad:': 'Verifying ownership:',
  'Tipo de post no reconocido': 'Unrecognized post type',
  'Post sin interacciones': 'Post without interactions',
  'Ya interactuaste': 'You already interacted',
  'Puedes interactuar': 'You can interact',
  'Interacción cerrada': 'Interaction closed',
  'Máximo de interacciones alcanzado': 'Maximum interactions reached',
  'Interacciones totales': 'Total interactions',
  'Participantes': 'Participants',
  'Por participante': 'Per participant',
  'Tipo de interacción:': 'Interaction type:',
  'Participar en viral': 'Participate in viral',
  'Ya participas en este viral': 'You already participate in this viral',
  'Viral finalizado': 'Viral finished',
  'Viral Post': 'Viral Post',
  'Duración:': 'Duration:',
  'Viral disponible': 'Viral available',
  'Tu navegador no soporta el elemento viral.': 'Your browser does not support the viral element.',
  'Interacción requerida:': 'Interaction required:',
  'Participar en evento viral': 'Participate in viral event',
  'Ya participas en este evento viral': 'You already participate in this viral event',
  'Evento viral finalizado': 'Viral event finished',
  'Votando en viral': 'Voting in viral',
  'opción': 'option',
  '¡Interacción registrada! Ganaste': 'Interaction registered! You earned',
  'tokens.': 'tokens.',
  '¡Interacción registrada correctamente!': 'Interaction registered successfully!',
  'Error al interactuar': 'Error interacting',
  'Error interactuando en viral:': 'Error interacting in viral:',
  'Error al registrar la interacción:': 'Error registering interaction:',
  'Abriendo modal de participación para viral': 'Opening participation modal for viral',
  'Error: Post viral no encontrado': 'Error: Viral post not found',
  'Ya has participado en este viral': 'You already participated in this viral',
  'Abriendo modal de participación para evento viral': 'Opening participation modal for viral event',
  'Ya has participado en este evento viral': 'You already participated in this viral event',
  'Error: Modal de participación no encontrado': 'Error: Participation modal not found',
  'Instrucciones:': 'Instructions:',
  'Escribe tu participación en el campo de texto. Sé creativo y original.': 'Write your participation in the text field. Be creative and original.',
  'Sube una imagen relacionada con el viral. Formatos admitidos: JPG, PNG, GIF, WebP.': 'Upload an image related to the viral. Supported formats: JPG, PNG, GIF, WebP.',
  'Sube un video relacionado con el viral.': 'Upload a video related to the viral.',
  'Máximo 7 segundos.': 'Maximum 7 seconds.',
  'Formatos: MP4, WebM, MOV.': 'Formats: MP4, WebM, MOV.',
  'Graba o sube un audio de respuesta.': 'Record or upload an audio response.',
  'Máximo 15 segundos.': 'Maximum 15 seconds.',
  'Formatos: MP3, WAV, WebM, M4A.': 'Formats: MP3, WAV, WebM, M4A.',
  'Completa tu participación según las indicaciones del viral.': 'Complete your participation according to the viral instructions.',
  'Imagen': 'Image',
  'Video': 'Video',
  'Texto': 'Text',
  'Audio (15s)': 'Audio (15s)',
  'Archivo': 'File',
  'Seleccionando media para participación viral, tipo:': 'Selecting media for viral participation, type:',
  'No hay viral actual para participación': 'No current viral for participation',
  'Archivo seleccionado:': 'File selected:',
  'Tipo:': 'Type:',
  'Archivo muy grande. Máximo': 'File too large. Maximum',
  'MB': 'MB',
  'seleccionado correctamente': 'selected successfully',
  'Error refrescando viral:': 'Error refreshing viral:',
  'Reiniciando estado de grabación de audio...': 'Resetting audio recording state...',
  'Iniciando grabación de audio...': 'Starting audio recording...',
  'Tu navegador no soporta grabación de audio': 'Your browser does not support audio recording',
  'Datos de audio disponibles, tamaño:': 'Audio data available, size:',
  'Grabador de audio detenido': 'Audio recorder stopped',
  'Error del grabador de audio:': 'Audio recorder error:',
  'Error en la grabación:': 'Error recording:',
  'Grabando audio...': 'Recording audio...',
  'Deteniendo grabación de audio, estado actual:': 'Stopping audio recording, current state:',
  'No grabando o grabador no disponible': 'Not recording or recorder unavailable',
  'Duración calculada:': 'Calculated duration:',
  'segundos': 'seconds',
  'Procesando grabación...': 'Processing recording...',
  'Procesando grabación, fragmentos:': 'Processing recording, chunks:',
  'duración:': 'duration:',
  'No se pudo procesar la grabación': 'Could not process recording',
  'La grabación es muy corta (mínimo 1 segundo)': 'Recording is too short (minimum 1 second)',
  'La grabación es muy larga (máximo 15 segundos)': 'Recording is too long (maximum 15 seconds)',
  'Blob de audio creado, tamaño:': 'Audio blob created, size:',
  'tipo:': 'type:',
  'Archivo creado:': 'File created:',
  'Archivo leído exitosamente para vista previa': 'File read successfully for preview',
  'Archivo de audio guardado en variables globales:': 'Audio file saved in global variables:',
  'Error leyendo archivo para vista previa:': 'Error reading file for preview:',
  'Error procesando el audio para vista previa': 'Error processing audio for preview',
  'Audio grabado': 'Audio recorded',
  's': 's',
  'Error procesando grabación:': 'Error processing recording:',
  'Error procesando la grabación:': 'Error processing recording:',
  'Cerrando modal de participación...': 'Closing participation modal...',
  'Eliminando archivo de participación...': 'Removing participation file...',
  'Archivo removido': 'File removed',
  'Enviando participación para viral:': 'Sending participation for viral:',
  'Error: No hay viral seleccionado': 'Error: No viral selected',
  'Enviando... ⏳': 'Sending... ⏳',
  'Por favor ingresa tu participación': 'Please enter your participation',
  'Verificando archivo seleccionado:': 'Checking selected file:',
  'una imagen': 'an image',
  'un video': 'a video',
  'un audio': 'an audio',
  'El archivo de audio está vacío': 'The audio file is empty',
  'El archivo debe ser de tipo audio': 'The file must be an audio type',
  'Validación de archivo de audio pasada:': 'Audio file validation passed:',
  'Subiendo archivo... 📤': 'Uploading file... 📤',
  'Subiendo audio grabado como base64...': 'Uploading recorded audio as base64...',
  'Subiendo archivo via FormData...': 'Uploading file via FormData...',
  'Estado de respuesta de subida:': 'Upload response status:',
  'Respuesta de error de subida:': 'Upload error response:',
  'Error en el servidor al subir archivo:': 'Server error uploading file:',
  'Datos de respuesta de subida:': 'Upload response data:',
  'Error subiendo archivo:': 'Error uploading file:',
  'No se encontraron datos de archivo en la respuesta de subida:': 'No file data found in upload response:',
  'Llaves disponibles:': 'Available keys:',
  'Error: archivo no procesado correctamente en el servidor': 'Error: file not processed correctly on server',
  'Duración obtenida del archivo:': 'Duration obtained from file:',
  'Duración obtenida de recordedDuration:': 'Duration obtained from recordedDuration:',
  'Duración obtenida de variable global:': 'Duration obtained from global variable:',
  'Duración estimada por tamaño:': 'Duration estimated by size:',
  'Enviando duración de audio al servidor:': 'Sending audio duration to server:',
  'Registrando participación... ✨': 'Registering participation... ✨',
  'Enviando datos de participación al servidor:': 'Sending participation data to server:',
  'Estado de respuesta de participación:': 'Participation response status:',
  'Respuesta de error de participación:': 'Participation error response:',
  'Error del servidor:': 'Server error:',
  'Datos de respuesta de participación:': 'Participation response data:',
  '¡Participación enviada! Has ganado': 'Participation sent! You earned',
  'CFT. El creador revisará tu participación pronto.': 'CFT. The creator will review your participation soon.',
  '¡Participación enviada exitosamente! El creador la revisará pronto.': 'Participation sent successfully! The creator will review it soon.',
  'Error enviando participación:': 'Error sending participation:',
  'Error del servidor': 'Server error',
  

  'SISTEMA DE MARKET - POSTS EN VENTA (CORREGIDO)': 'MARKET SYSTEM - POSTS FOR SALE (CORRECTED)',
  'FUNCIÓN PRINCIPAL PARA MOSTRAR MARKET': 'MAIN FUNCTION TO SHOW MARKET',
  'Container feedPosts no encontrado': 'Container feedPosts not found',
  'Error al mostrar market:': 'Error showing market:',
  'Error al cargar el marketplace': 'Error loading marketplace',
  'CARGAR POSTS DEL MARKET - VERSIÓN CORREGIDA CON FILTROS': 'LOAD MARKET POSTS - CORRECTED VERSION WITH FILTERS',
  'Enviando filtros al backend:': 'Sending filters to backend:',
  'Posts del market cargados:': 'Market posts loaded:',
  'Error al cargar posts del market:': 'Error loading market posts:',
  'Error al cargar posts en venta': 'Error loading posts for sale',
  'RENDERIZAR INTERFAZ DEL MARKET': 'RENDER MARKET INTERFACE',
  'CREAR POST ELEMENT COMPATIBLE - VERSIÓN CORREGIDA': 'CREATE COMPATIBLE POST ELEMENT - CORRECTED VERSION',
  'RENDERIZAR MEDIA PARA MARKET': 'RENDER MEDIA FOR MARKET',
  'CREAR HTML COMPONENTS': 'CREATE HTML COMPONENTS',
  'Posts en Venta': 'Posts for Sale',
  'ChainFeed Market': 'ChainFeed Market',
  'Descubre y compra posts únicos de la comunidad': 'Discover and buy unique posts from the community',
  'Filtros y Ordenamiento': 'Filters and Sorting',
  'Limpiar': 'Clear',
  'Ordenar': 'Sort',
  'Tipo de Post': 'Post Type',
  'Rango de Precio': 'Price Range',
  'VERIFICAR SI HAY FILTROS ACTIVOS': 'CHECK IF THERE ARE ACTIVE FILTERS',
  'FUNCIONES AUXILIARES PARA LABELS DE FILTROS': 'HELPER FUNCTIONS FOR FILTER LABELS',
  'Cualquier precio': 'Any price',
  'Desde': 'From',
  'CFT': 'CFT',
  'Hasta': 'Up to',
  'Sin filtros activos': 'No active filters',
  'Filtro de tipo eliminado': 'Type filter removed',
  'Filtro de precio eliminado': 'Price filter removed',
  'No hay posts en venta': 'No posts for sale',
  'Aún no hay publicaciones disponibles en el marketplace.': 'No posts available in the marketplace yet.',
  '¡Sé el primero en poner algo a la venta!': 'Be the first to put something up for sale!',
  'Crear Post para Vender': 'Create Post to Sell',
  'Cargando marketplace...': 'Loading marketplace...',
  'Buscando los mejores posts en venta': 'Looking for the best posts for sale',
  'Error al cargar el marketplace': 'Error loading marketplace',
  'No se pudieron cargar los posts en venta. Inténtalo de nuevo.': 'Could not load posts for sale. Please try again.',
  'Intentar de Nuevo': 'Try Again',
  'Cargar Más Posts': 'Load More Posts',
  'FUNCIONES DE FILTROS CORREGIDAS': 'CORRECTED FILTER FUNCTIONS',
  'Cambiando ordenamiento a:': 'Changing sorting to:',
  'Ordenando por:': 'Sorting by:',
  'Cambiando filtro de tipo a:': 'Changing type filter to:',
  'Filtrando por:': 'Filtering by:',
  'Restableciendo filtros del market': 'Resetting market filters',
  'Filtros restablecidos': 'Filters reset',
  'No se puede cargar más:': 'Cannot load more:',
  'Cargando más posts del market...': 'Loading more market posts...',
  'FUNCIONES AUXILIARES PARA LABELS': 'HELPER FUNCTIONS FOR LABELS',
  'Más Recientes': 'Most Recent',
  'Más Antiguos': 'Oldest',
  'Precio: Menor a Mayor': 'Price: Low to High',
  'Precio: Mayor a Menor': 'Price: High to Low',
  'Texto': 'Text',
  'Imagen': 'Image',
  'Video': 'Video',
  'GIF': 'GIF',
  'FUNCIONES DE INTERACCIÓN COMPATIBLES CON TU SISTEMA': 'INTERACTION FUNCTIONS COMPATIBLE WITH YOUR SYSTEM',
  'Post no encontrado': 'Post not found',
  '¿Estás seguro de que quieres comprar este post por': 'Are you sure you want to buy this post for',
  'De:': 'From:',
  'Contenido:': 'Content:',
  'Comprando...': 'Buying...',
  '¡Post comprado exitosamente! Has gastado': 'Post purchased successfully! You spent',
  'Error al comprar post:': 'Error buying post:',
  'Error al procesar la compra:': 'Error processing purchase:',
  'Post ocultado temporalmente': 'Post temporarily hidden',
  'FUNCIONES AUXILIARES': 'HELPER FUNCTIONS',
  'Dirigiendo a crear post...': 'Redirecting to create post...',
  'FUNCIONES GLOBALES FALTANTES PARA MARKET': 'MISSING GLOBAL FUNCTIONS FOR MARKET',
  'FUNCIONES DE MENÚ QUE FALTAN': 'MISSING MENU FUNCTIONS',
  'Enlace copiado al portapapeles': 'Link copied to clipboard',
  'Enlace copiado': 'Link copied',
  'No se pudo copiar el enlace': 'Could not copy link',
  'Reportar Post': 'Report Post',
  '¿Estás seguro de que quieres reportar este post por contenido inapropiado?': 'Are you sure you want to report this post for inappropriate content?',
  'Cancelar': 'Cancel',
  'Reportar': 'Report',
  'Post reportado. Gracias por mantener la comunidad segura': 'Post reported. Thank you for keeping the community safe',
  'MODAL DE COMPARTIR SIMPLIFICADO': 'SIMPLIFIED SHARE MODAL',
  'Compartir Post': 'Share Post',
  'Comparte este post en tus redes sociales:': 'Share this post on your social networks:',
  'Compartir en Twitter': 'Share on Twitter',
  'Compartir en WhatsApp': 'Share on WhatsApp',
  'Copiar enlace': 'Copy link',
  'Cerrar': 'Close',
  'FUNCIONES DE COMPARTIR EN REDES SOCIALES': 'SOCIAL MEDIA SHARE FUNCTIONS',
  '¡Mira este post increíble en ChainFeed!': 'Check out this amazing post on ChainFeed!',
  'FUNCIÓN PARA ENVIAR REPORTE REAL': 'FUNCTION TO SEND REAL REPORT',
  'FUNCIÓN AUXILIAR PARA MODALES DE CONFIRMACIÓN': 'HELPER FUNCTION FOR CONFIRMATION MODALS',
  'MODALES DE FILTROS MODERNOS': 'MODERN FILTER MODALS',
  'Ordenar Posts': 'Sort Posts',
  'Selecciona cómo quieres ordenar los posts del marketplace': 'Select how you want to sort marketplace posts',
  'Filtra los posts por su tipo de contenido': 'Filter posts by their content type',
  'Todos los Tipos': 'All Types',
  'Rango de Precio': 'Price Range',
  'Define el rango de precios para filtrar los posts': 'Define the price range to filter posts',
  'Precio Mínimo (CFT)': 'Minimum Price (CFT)',
  'Ej: 10': 'Ex: 10',
  'Precio Máximo (CFT)': 'Maximum Price (CFT)',
  'Ej: 1000': 'Ex: 1000',
  'Aplicar Filtro': 'Apply Filter',
  'El precio mínimo no puede ser mayor al máximo': 'Minimum price cannot be higher than maximum',
  'Filtro de precio aplicado:': 'Price filter applied:',
  'Función auxiliar para crear modales de opciones': 'Helper function to create option modals',
  'posts': 'posts',
  'loading': 'loading',
  'currentPage': 'currentPage',
  'limit': 'limit',
  'hasMore': 'hasMore',
  'totalPosts': 'totalPosts',
  'filters': 'filters',
  'tipo': 'type',
  'username': 'username',
  'precio_min': 'price_min',
  'precio_max': 'price_max',
  'sortBy': 'sortBy',
  'newest': 'newest',
  'oldest': 'oldest',
  'price_low': 'price_low',
  'price_high': 'price_high',
  'texto': 'text',
  'imagen': 'image',
  'video': 'video',
  'gif': 'gif',
  'Todos los tipos': 'All types',
  'Tu navegador no soporta video.': 'Your browser does not support video.',
  'Comprar por': 'Buy for',
  'Ocultar publicación': 'Hide post',
  'Ver quién dio like': 'See who liked',
  'Comentarios': 'Comments',
  'Compartir': 'Share',
  'Comprar': 'Buy',
  '💰': '💰',
  '🛒': '🛒',
  '👁️‍🗨️': '👁️‍🗨️',
  '⚠️': '⚠️',
  '❤️': '❤️',
  '🤍': '🤍',
  '💬': '💬',
  '🔄': '🔄',
  '📊': '📊',
  '🎯': '🎯',
  '🌐': '🌐',
  '📝': '📝',
  '🖼️': '🖼️',
  '🎥': '🎥',
  '🎭': '🎭',
  '🆕': '🆕',
  '📅': '📅',
  '💵': '💵',
  '⏳': '⏳',
  '📦': '📦',
  '🏪': '🏪',
  '🎉': '🎉',
  '❌': '❌',
  '✅': '✅',
  '🔗': '🔗',
  '🐦': '🐦',
  '💬': '💬',
  '✨': '✨',
  '🔍': '🔍',
  '🎛️': '🎛️',
  
  "Gana tokens desde tu primer like": "Earn tokens from your first like",
    "Gana tokens desde": "Earn tokens from",
    "tu primer like": "your first like",
    "La red social que recompensa cada interacción": "The social network that rewards every interaction",
    "La red social que recompensa cada interacción.": "The social network that rewards every interaction.",
    "Comprar Tokens Ahora": "Buy Tokens Now",
    "Ver Whitepaper": "View Whitepaper",
    "Lanzamiento Oficial": "Official Launch",
    "La preventa termina en:": "Presale ends in:",
    "Días": "Days",
    "Horas": "Hours",
    "Minutos": "Minutes",
    "Segundos": "Seconds",
    "Tokens Disponibles": "Available Tokens",
    "Tokens disponibles": "Available tokens",
    "otorgado": "awarded",
    "Conecta tu wallet para obtenerlos": "Connect your wallet to get them",
    "🚀 Reclama tus 50 CFT!": "🚀 Claim your 50 CFT!",
    "Reclama tus 50 CFT!": "Claim your 50 CFT!",
    
    // === PALABRAS SUELTAS IMPORTANTES ===
    "desde": "from",
    "cada": "every",
    "recompensa": "rewards",
    "red": "network",
    "social": "social",
    "tokens": "tokens",
    "primer": "first",
    "gana": "earn",
    "disponibles": "available",
    
      "🎥 Video": "🎥 Video",
  "📤 Compartir": "📤 Share",
  "días restantes": "days remaining",
  "participantes": "participants",
  "🟢 Activo": "🟢 Active",
  "🔴 Finalizado": "🔴 Ended",
  "votos totales": "total votes",
  "CFT por voto": "CFT per vote",
  "votos": "votes",
  "Poner en Venta": "Put on Sale",
  "💰 En Venta": "💰 On Sale",
  "🎨 Mi Colección": "🎨 My Collection",
  "Reposteaste": "You reposted",
  "Post original de": "Original post by",
  "No puedes comprar tu propia publicación": "You cannot buy your own post",
  "❌ No puedes dar like a tu propia publicación": "❌ You cannot like your own post",
  "ver": "view",
  "Escribe tu respuesta...": "Write your answer...",
  "Promover evento": "Promote Event",
  "Eliminar Evento": "Delete Event",
  "Repost eliminado exitosamente": "Repost deleted successfully",
  "⏳ Pendientes:": "⏳ Pending:",
  "❌ Rechazadas:": "❌ Rejected:",
  "🏆 Cupos restantes:": "🏆 Slots remaining:",
  "✅ Aprobadas:": "✅ Approved:",
  "Like agregado (+1 CFT para el autor)": "Like added (+1 CFT for author)",
  "✅": "✅",
  "Mensaje copiado al portapapeles": "Message copied to clipboard",
  "📱 Pégalo en WhatsApp, Telegram o donde quieras compartirlo": "📱 Paste it on WhatsApp, Telegram or wherever you want to share it",
  "Cerrar Sesión": "Log Out",
  "Ocultar": "Hide",
  "Report": "Report",
  "Fecha: hace": "Date:",
  "Precio:": "Price:",
  "De:": "From:",
  "A:": "To:",
  "Transacción": "Transaction",
  
  "seg": "sec",
"min": "min", 
"h": "h",
"d": "d",
"sem": "wk",      // ¡IMPORTANTE! Cambia "sem" por "wk"
"mes": "mo",      // ¡IMPORTANTE! Cambia "mes" por "mo"
"a": "y",
"Ahora": "Now",
"Fecha inválida": "Invalid date",

// También las versiones completas por si acaso:
"segundo": "second",
"segundos": "seconds", 
"minuto": "minute",
"minutos": "minutes",
"hora": "hour",
"horas": "hours",
"día": "day",
"días": "days",
"semana": "week",
"semanas": "weeks",
"mes": "month",
"meses": "months",
"año": "year",
"años": "years",

  "✨ ¡Post publicado exitosamente": "✨ Post published successfully",
  "Creando publicación... ✨": "Creating post... ✨",
  "📢 Promover Contenido": "📢 Promote Content",
  "Aumenta la visibilidad de tu contenido": "Increase the visibility of your content",
  "Tu balance actual": "Your current balance",
  "Promoción rápida por 1 día": "Quick promotion for 1 day",
  "RÁPIDO": "QUICK",
  "Promoción extendida": "Extended promotion",
  "POPULAR": "POPULAR",
  "Máxima visibilidad": "Maximum visibility",
  "MEJOR VALOR": "BEST VALUE",
  "Costo de promoción:": "Promotion cost:",
  "Balance después:": "Balance after:",
  "Interacciones Totales": "Total Interactions",
  "comisión)": "commission)",
  "⚠️ Importante:": "⚠️ Important:",
  "Al vender, la publicación cambiará de dueño y las futuras interacciones beneficiarán al comprador.": "When selling, the post will change ownership and future interactions will benefit the buyer.",
  "¡Publicación puesta en venta por": "Post put for sale for",
  "❌ Cancelar venta": "❌ Cancel sale",
  "¿Estás seguro de que quieres cancelar la venta de esta publicación? La publicación dejará de estar disponible en el marketplace.": "Are you sure you want to cancel the sale of this post? The post will no longer be available in the marketplace.",
  "No, mantener en venta": "No, keep for sale",
  "Sí, cancelar venta": "Yes, cancel sale",
  "✅ Venta cancelada exitosamente": "✅ Sale canceled successfully",
  "🗑️ Eliminar publicación": "🗑️ Delete post",
  "✅ Publicación eliminada correctamente": "✅ Post deleted successfully",
  "🔒 Hacer publicación privada": "🔒 Make post private",
  "¿Estás seguro de que quieres hacer esta publicación privada? Solo tus seguidores aceptados podrán verla.": "Are you sure you want to make this post private? Only your accepted followers will be able to see it.",
  "🔒 Publicación ahora es privada": "🔒 Post is now private",
  "🌍 Hacer publicación pública": "🌍 Make post public",
  "¿Estás seguro de que quieres hacer esta publicación pública? Todos los usuarios podrán verla, incluso si tu perfil es privado.": "Are you sure you want to make this post public? All users will be able to see it, even if your profile is private.",
  "🌍 Publicación ahora es pública": "🌍 Post is now public",
  "🎉 ¡Contenido promovido exitosamente! Plan: 1 Día Tokens pagados:": "🎉 Content promoted successfully! Plan: 1 Day Tokens paid:",
  "Balance actual:": "Current balance:",
  "🗑️ Eliminar evento Chain": "🗑️ Delete Chain event",
  "🌍 Hacer evento público": "🌍 Make event public",
  "¿Estás seguro de que quieres hacer este evento Chain público? Todos los usuarios podrán verlo, incluso si tu perfil es privado.": "Are you sure you want to make this Chain event public? All users will be able to see it, even if your profile is private.",
  "🌍 Evento ahora es público": "🌍 Event is now public",
  "🔒 Hacer evento privado": "🔒 Make event private",
  "¿Estás seguro de que quieres hacer este evento Chain privado? Solo tus seguidores aceptados podrán verlo.": "Are you sure you want to make this Chain event private? Only your accepted followers will be able to see it.",
  "🔒 Evento ahora es privado": "🔒 Event is now private",
  "Confirmar Promoción": "Confirm Promotion",
  "✅ Evento eliminado correctamente": "✅ Event deleted successfully",
  "Imagen de": "Image of",
  "📷 Imagen seleccionada": "📷 Image selected",
  "Error al publicar el post: El contenido de la publicación es requerido": "Error publishing post: Post content is required",
  "✨ ¡Post publicado exitosamente!": "✨ Post published successfully!",
  "Video de": "Video of",
  "🎥 Video seleccionado": "🎥 Video selected",
  "🎬 Optimizando video...": "🎬 Optimizing video...",
  "❌ Error al publicar el post: El contenido de la publicación es requerido": "❌ Error publishing post: Post content is required",
  "💰 Presupuesto total:": "💰 Total budget:",
  "agregado al evento": "added to event",
  "a las": "at",
  "Ej: ¿Cuál es tu comida favorita?": "Ex: What's your favorite food?",
  "❌ El título del evento es obligatorio": "❌ Event title is required",
  "❌ Error al crear evento: La encuesta debe tener al menos 2 opciones": "❌ Error creating event: Poll must have at least 2 options",
  "❌ Error al crear evento: La descripción del evento es requerida": "❌ Error creating event: Event description is required",
  "⚡ ¡Evento Chain creado exitosamente!": "⚡ Chain event created successfully!",
  "✨ Evento Campaña seleccion": "✨ Campaign event selected",
  "✨ Evento Encuesta seleccionado": "✨ Poll event selected",
  "✨ Evento Audio seleccionado": "✨ Audio event selected",
  "⏸️ Grabando...": "⏸️ Recording...",
  "🗑️ Audio removido": "🗑️ Audio removed",
  "🎤 Grabación iniciada": "🎤 Recording started",
  "✅ Audio grabado": "✅ Audio recorded",
  "agregada": "added",
  "🗑️ Imagen removida": "🗑️ Image removed",
  "agregado al evento": "added to event",
  "¿Como van tus momentos?": "How are your moments going?",
    "✏️ Redirigiendo a editar perfil...": "✏️ Redirecting to edit profile...",
  "🔒 Hacer perfil privado": "🔒 Make profile private",
  "🔒 Perfil ahora es privado. Solo seguidores aceptados verán tus publicaciones.": "🔒 Profile is now private. Only accepted followers will see your posts.",
  "🚪 Cerrar sesión": "🚪 Log out",
  "🚪 Cerrando sesión...": "🚪 Logging out...",
  "❌ No puedes comprar tu propia publicación": "❌ You cannot buy your own post",
  "✅ Sesión cerrada correctamente": "✅ Logged out successfully",

  "💬 Comentario publicado en tu propio post": "💬 Comment posted on your own post",
  "💬 Respuesta publicada en tu propio post": "💬 Reply posted on your own post",
  "Ver": "View",
  "respuesta": "reply",
  "✨ Comentario publicado! Has ganado 1 CFT": "✨ Comment posted! You earned 1 CFT",
  "✨ Respuesta publicada! Has ganado 1 CFT": "✨ Reply posted! You earned 1 CFT",
  
    "Crear Flash": "Create Flash",
  "Tu Flash": "Your Flash",
  "⛓️ Anclar Flash": "⛓️ Pin Flash",
  "🗑️ Eliminar Flash": "🗑️ Delete Flash",
  "Elige cuánto tiempo quieres destacarlo en inicio": "Choose how long you want to feature it on home",
  "2 días": "2 days",
  "Permanente en tu perfil": "Permanent on your profile",
  "Destacado en inicio por 2 días": "Featured on home for 2 days",
  "Destacado en inicio por 3 días": "Featured on home for 3 days",
  "Mayor alcance y visibilidad": "Greater reach and visibility",
  "Más Popular": "Most Popular",
  "Destacado en inicio por 5 días": "Featured on home for 5 days",
  "Máxima exposición y engagement": "Maximum exposure and engagement",
  "Confirmar Anclaje": "Confirm Pin",
  "⛓️ Flash anclado exitosamente! ✨ Permanente en tu perfil 🔥 Destacado en inicio por 2 días": "⛓️ Flash pinned successfully! ✨ Permanent on your profile 🔥 Featured on home for 2 days",
  "⛓️ Flash anclado exitosamente! ✨ Permanente en tu perfil 🔥 Destacado en inicio por 3 días": "⛓️ Flash pinned successfully! ✨ Permanent on your profile 🔥 Featured on home for 3 days",
  "⛓️ Flash anclado exitosamente! ✨ Permanente en tu perfil 🔥 Destacado en inicio por 5 días": "⛓️ Flash pinned successfully! ✨ Permanent on your profile 🔥 Featured on home for 5 days",
  "← Atrás": "← Back",
  "Vistas del Flash": "Flash Views",
  "Sin reacción": "No reaction",
  "Re-anclar Flash": "Re-pin Flash",
  "Tienes": "You have",
  "días restantes. Máximo total: 10 días": "days remaining. Maximum total: 10 days",
  "2 días (Total:": "2 days (Total:",
  "3 días (Total:": "3 days (Total:",
  "5 días (Total:": "5 days (Total:",
  "🔄 Flash re-anclado exitosamente! ✨ +2 días agregados 🔥 Total:": "🔄 Flash re-pinned successfully! ✨ +2 days added 🔥 Total:",
  "días de visibilidad 💰 Costo:": "days of visibility 💰 Cost:",
  "🔄 Flash re-anclado exitosamente! ✨ +3 días agregados 🔥 Total:": "🔄 Flash re-pinned successfully! ✨ +3 days added 🔥 Total:",
  "🔄 Flash re-anclado exitosamente! ✨ +5 días agregados 🔥 Total:": "🔄 Flash re-pinned successfully! ✨ +5 days added 🔥 Total:",
  "¿Estás seguro de que deseas eliminar este Flash? Esta acción no se puede deshacer.": "Are you sure you want to delete this Flash? This action cannot be undone.",
  "Eliminar": "Delete",
  "Error al eliminar": "Error deleting",
  "Flash eliminado correctamente": "Flash deleted successfully",
  "Eliminando...": "Deleting...",
  "Comentando...": "Commenting...",
  "Respondiendo...": "Replying...",
  "Ya reaccionaste a este Flash": "You already reacted to this Flash",
  "Crear Chain Flash": "Create Chain Flash",
  "Costo:": "Cost:",
  "Gana 0.1 CFT por vista y más con reacciones": "Earn 0.1 CFT per view and more with reactions",
  "Toca para seleccionar imagen": "Tap to select image",
  "Duración: 24 horas": "Duration: 24 hours",
  "⚡ Crear Flash (-1 CFT)": "⚡ Create Flash (-1 CFT)",
  "Toca para seleccionar video": "Tap to select video",
  "Escribe tu mensaje... Máximo 500 caracteres": "Write your message... Maximum 500 characters",
  "✨ Flash creado exitosamente! (-1 CFT)": "✨ Flash created successfully! (-1 CFT)",
  "⛓️ Volver a anclar": "⛓️ Re-pin",
  // === RE-ANCLAR FLASH MODAL ===
"🔄 Re-anclar Flash": "🔄 Re-pin Flash",
"Tienes": "You have",
"días restantes. Máximo total: 10 días": "days remaining. Maximum total: 10 days",
"días (Total:": "days (Total:",
"No disponible": "Not available",
"Procesando...": "Processing...",
  
"Selecciona una opción primero": "Select an option first",
"Error al procesar el anclaje": "Error processing the pin",
"Confirmar Anclaje": "Confirm Pin",

// === MENSAJES DE RE-ANCLAJE ===
"Flash re-anclado exitosamente!": "Flash re-pinned successfully!",
"días agregados": "days added",
"días de visibilidad": "days of visibility",
"precio incrementado": "price increased",


// === MENSAJES DE ANCLAJE FLASH ===
"Flash anclado exitosamente!": "Flash pinned successfully!",
"Flash re-anclado exitosamente!": "Flash re-pinned successfully!",
"días agregados": "days added",
"días de visibilidad": "days of visibility",
"Total:": "Total:",
"Costo:": "Cost:",
"Permanente en tu perfil": "Permanent on your profile",
"Destacado en inicio por": "Featured on home for",
"días": "days",

  "Seguidos": "Following",
  "Todos": "All",
  "❌ Error al procesar like: No puedes dar like a tu propia publicación": "❌ Error processing like: You cannot like your own post",
  "📢 Promocionado": "📢 Promoted",
  "¡Comentario publicado! Has ganado 1 CFT": "Comment posted! You earned 1 CFT",
  "¡Respuesta publicada! Has ganado 1 CFT": "Reply posted! You earned 1 CFT",
  "❌ Error al procesar repost: No puedes repostear tu propia publicación": "❌ Error processing repost: You cannot repost your own post",
  "❌ No puedes repost tus propios post": "❌ You cannot repost your own posts",
  "Repost creado exitosamente": "Repost created successfully",
  "📤 Publicación compartido con": "📤 Post shared with",
  "usuario": "user",
  "👥 Enviado a:": "👥 Sent to:",
  "Compartir con": "Share with",
  "usuario": "user",
  "📤 Compartir": "📤 Share",
  "Agregar mensaje (opcional)...": "Add message (optional)...",
  
 "🔒 Cambiar privacidad": "🔒 Change privacy",
  "¿Hacer esta publicación privada? Solo tus seguidores podrán verla.": "Make this post private? Only your followers will be able to see it.",
  "🔒 Post ahora es privado": "🔒 Post is now private",
  "🌍 Cambiar privacidad": "🌍 Change privacy",
  "¿Hacer esta publicación pública? Todos podrán verla, incluso quienes no te siguen.": "Make this post public? Everyone will be able to see it, even those who don't follow you.",
  "🌍 Post ahora es público": "🌍 Post is now public",
  "🔒 Privado": "🔒 Private",
  "comisión)": "commission)",
  "💰¡Publicación puesta en venta por": "💰 Post put for sale for",
  "¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer y perderás todos los tokens asociados.": "Are you sure you want to delete this post? This action cannot be undone and you will lose all associated tokens.",
  "🗑️ Publicación eliminada correctamente": "🗑️ Post deleted successfully",
  "👁️‍🗨️ Ocultar publicación": "👁️‍🗨️ Hide post",
  "¿Ocultar esta publicación de tu feed? Solo desaparecerá para ti, otros usuarios seguirán viéndola.": "Hide this post from your feed? It will only disappear for you, other users will still see it.",
  "👁️‍🗨️ Publicación ocultada de tu feed": "👁️‍🗨️ Post hidden from your feed",
  "📝 Tu reporte será revisado por nuestro equipo": "📝 Your report will be reviewed by our team",
  "⚠️ Contenido inapropiado": "⚠️ Inappropriate content",
  "😡 Acoso o bullying": "😡 Harassment or bullying",
  "🔪 Contenido violento": "🔪 Violent content",
  "❌ Información falsa": "❌ False information",
  "🚨 Enviar reporte": "🚨 Submit report",
  "⏳ Enviando...": "⏳ Sending...",
  "✅ Reporte enviado exitosamente. El equipo de moderación ha sido notificado.": "✅ Report submitted successfully. The moderation team has been notified.",
  "interacciones": "interactions",
  "🗳️ Puedes votar": "🗳️ You can vote",
  "tokens por voto": "tokens per vote",
  
  // Agregar DENTRO de translations.en = { ... }

"Eliminar evento": "Delete event",
"⏰ Finalizado": "⏰ Ended",
"Finalizado": "Ended",
"Total tokens": "Total tokens",
"Por ganador": "Per winner",
"Promocionar contenido": "Promote content",
"Hacer público": "Make public",
"Hacer privado": "Make private",
"🎯 Campaña": "🎯 Campaign",
"🗳️ Encuesta": "🗳️ Poll",
"🎵 Audio": "🎵 Audio",
"🟢 Activo": "🟢 Active",
"🔴 Finalizado": "🔴 Ended",
"🔴 Ended": "🔴 Ended",
"📤 Share": "📤 Share",
"📤 Compartir": "📤 Share",
"🌍 Hacer público": "🌍 Make public",
"🔒 Hacer privado": "🔒 Make private",
"🗑️ Eliminar evento": "🗑️ Delete event",
"📢 Promocionar contenido": "📢 Promote content",
"🎯 Participate in Campaign": "🎯 Participate in Campaign",
"🎯 Participar en Campaña": "🎯 Participate in Campaign",
  
// ==========================================
// AGREGAR ESTAS TRADUCCIONES A translations.en
// en tu archivo i18n-auto-translate.js
// ==========================================

// Dentro de translations.en = { ... } agregar:

// === EVENTOS CHAIN - ENCUESTAS ===
"📊 Encuesta": "📊 Poll",
"Encuesta": "Poll",
"por voto": "per vote",
"CFT por voto": "CFT per vote",
"votos totales": "total votes",
"votos": "votes",
"voto": "vote",

// === EVENTOS CHAIN - ESTADOS ===
"🟢 Activo": "🟢 Active",
"🔴 Finalizado": "🔴 Ended",
"⏰ Finalizado": "⏰ Ended",
"Activo": "Active",
"Finalizado": "Ended",

// === EVENTOS CHAIN - CAMPAÑAS ===
"🎯 Campaña": "🎯 Campaign",
"Campaña": "Campaign",
"Total tokens": "Total tokens",
"Por ganador": "Per winner",
"ganadores": "winners",
"ganador": "winner",

// === EVENTOS CHAIN - AUDIO ===
"🎵 Audio": "🎵 Audio",
"Audio": "Audio",

// === TIEMPO RESTANTE ===
"días restantes": "days remaining",
"día restante": "day remaining",
"Menos de 1 día": "Less than 1 day",

// === PARTICIPACIÓN ===
"participantes": "participants",
"participante": "participant",
"Cupos restantes": "Slots remaining",
"Aprobadas": "Approved",
"Pendientes": "Pending",
"Rechazadas": "Rejected",

// === ACCIONES DE MENÚ ===
"Promocionar contenido": "Promote content",
"Eliminar evento": "Delete event",
"Hacer público": "Make public",
"Hacer privado": "Make private",
"📢 Promocionar contenido": "📢 Promote content",
"🗑️ Eliminar evento": "🗑️ Delete event",
"🌍 Hacer público": "🌍 Make public",
"🔒 Hacer privado": "🔒 Make private",

// === COMPARTIR ===
"📤 Compartir": "📤 Share",
"📤 Share": "📤 Share",
"Compartir": "Share",

// === RESPUESTAS ===
"Respuestas": "Responses",
"Respuesta": "Response",
"📷 Imagen": "📷 Image",
"🎥 Video": "🎥 Video",
"📝 Texto": "📝 Text",
"🎵 Audio (15s)": "🎵 Audio (15s)",

// === ESTADÍSTICAS ===
"interacciones": "interactions",
"comentarios": "comments",
"likes": "likes",

// === TIEMPO RELATIVO ===
"seg": "s",
"min": "min",
"h": "h",
"d": "d",
"sem": "wk",
"mes": "mo",
"a": "y",
"hace": "ago",
"Ahora": "Now",

// === MENSAJES DE CONFIRMACIÓN ===
"¿Estás seguro de que deseas eliminar este evento?": "Are you sure you want to delete this event?",
"Esta acción no se puede deshacer.": "This action cannot be undone.",
"Evento eliminado correctamente": "Event deleted successfully",
"Evento ahora es público": "Event is now public",
"Evento ahora es privado": "Event is now private",
"📤 Compartir Evento Chain": "📤 Share Chain Event",


// Reposts
"Reposteaste": "You reposted",
"reposteó": "reposted", 
"Post original de": "Original post by",

// Encuestas
"por voto": "per vote",
"CFT por voto": "CFT per vote",
"votos totales": "total votes",
"votos": "votes",
"voto": "vote",

// Estados
"📊 Encuesta": "📊 Poll",
"🟢 Activo": "🟢 Active",
"Promocionar contenido": "Promote content",
"Eliminar evento": "Delete event",

"✅ Aprobada": "✅ Approved",
  "❌ Rechazada": "❌ Rejected", 
  "✅ Aprobar": "✅ Approve",
  "❌ Rechazar": "❌ Reject",
  "⏳ Pendiente": "⏳ Pending",
  "❌ Rechazar Participación": "❌ Reject Participation",
  "¿Estás seguro de que quieres rechazar esta participación? El usuario será notificado.": "Are you sure you want to reject this participation? The user will be notified.",
  "Motivo del rechazo (opcional):": "Reason for rejection (optional):",
  "Ej: El contenido no cumple con las reglas del evento": "Ex: The content does not comply with the event rules",
  "✅ Aprobar Participación": "✅ Approve Participation",
  "¿Estás seguro de que quieres aprobar esta participación? El usuario recibirá su recompensa en tokens.": "Are you sure you want to approve this participation? The user will receive their token reward.",
  "Aprobar": "Approve",
  
  // Eventos Chain - Variantes
"tokens por voto": "tokens per vote",
"participantes": "participants",
"participante": "participant",

// Menú (incluye el typo para que funcione)
"Primocionar evento": "Promote event",
"Promocionar evento": "Promote event",
"Promocionar contenido": "Promote content",

// Menú de eventos
"Ocultar evento": "Hide event",
"👁️‍🗨️ Ocultar evento": "👁️‍🗨️ Hide event",
"Report event": "Report event",
"⚠️ Report event": "⚠️ Report event",

// Campañas
"🚀 Participar en campaña": "🚀 Participate in campaign",
"Participar en campaña": "Participate in campaign",
"Tipo de respuesta": "Response type",
"📝 Tipo de respuesta": "📝 Response type",
 "📊 Resultados de la Encuesta": "📊 Poll Results",
 
// Estados combinados
"Activo": "Active",
"🟢 Activo": "🟢 Active",

// Typo que encontramos antes
"Primocionar evento": "Promote event",

// Modal de compra
"🛒 Comprar publicación": "🛒 Buy post",
"Comprar publicación": "Buy post",
"¿Confirmas la compra?": "Confirm purchase?",
"Precio:": "Price:",
"Comprar por": "Buy for",

// Viral
"interacciones": "interactions",
"interacción": "interaction",

  "🔒 Campaña finalizada": "🔒 Campaign finished",
  "¿Aprobar esta participación? Se otorgarán los tokens correspondientes al participante.": "Approve this participation? The corresponding tokens will be awarded to the participant.",
  "❤️ ¡Like dado! +1 CFT al participante": "❤️ Like given! +1 CFT to participant",
  "💔 Like removido": "💔 Like removed",
  "❌ Error: No se puede dar like a tu propia participación": "❌ Error: Cannot like your own participation",
  "¿Hacer este evento público? Todos podrán verlo, incluso quienes no te siguen.": "Make this event public? Everyone will be able to see it, even those who don't follow you.",
  "¿Hacer este evento privado? Solo tus seguidores podrán verlo.": "Make this event private? Only your followers will be able to see it.",
  "Evento ahora es privado - Solo tus seguidores aprobados pueden verlo": "Event is now private - Only your approved followers can see it",
  "Evento ahora es público - Todos pueden verlo": "Event is now public - Everyone can see it",
  "Error al registrar el voto: No puedes votar en tu propia encuesta": "Error registering vote: You cannot vote in your own poll",
  "¿Ocultar este evento de tu feed? Solo desaparecerá para ti, otros usuarios seguirán viéndolo.": "Hide this event from your feed? It will only disappear for you, other users will still see it.",
  "👁️‍🗨️ Evento ocultado de tu feed": "👁️‍🗨️ Event hidden from your feed",
  "✅ Reporte enviado exitosamente. El equipo de moderación ha sido notificado por email.": "✅ Report submitted successfully. The moderation team has been notified via email.",

  "📊 Ordenar": "📊 Sort",
  "🎯 Tipo de Post": "🎯 Post Type",
  "💰 Rango de Precio": "💰 Price Range",
  "📊 Ordenando por: Más Recientes": "📊 Sorting by: Most Recent",
  "📊 Ordenando por: Más Antiguos": "📊 Sorting by: Oldest",
  "🔄 Filtros restablecidos": "🔄 Filters reset",
  "📊 Ordenando por: Precio: Menor a Mayor": "📊 Sorting by: Price: Low to High",
  "📊 Ordenando por: Precio: Mayor a Menor": "📊 Sorting by: Price: High to Low",
  "🎯 Filtrando por: 📝 Texto": "🎯 Filtering by: 📝 Text",
  "🎯 Filtrando por: 🖼️ Imagen": "🎯 Filtering by: 🖼️ Image",
  "🎯 Filtrando por: 🎥 Video": "🎯 Filtering by: 🎥 Video",
  "Cancelar Venta": "Cancel Sale",
  
    "✨ Sé el primero en crear un Chain Flash": "✨ Be the first to create a Chain Flash",
  "No hay posts de tus seguidos": "No posts from your followed users",
  "Los usuarios que sigues aún no han publicado nada, o no tienes usuarios seguidos.": "The users you follow haven't posted anything yet, or you don't follow any users.",
  "Usuarios que sigue": "Users you follow",
  "No hay seguidos para mostrar": "No followed users to show",
  "No hay seguidores para mostrar": "No followers to show",
  "No tienes seguidos mutuos": "You don't have mutual follows",
  "Los seguidos mutuos son usuarios que tú sigues y que te siguen de vuelta": "Mutual follows are users you follow and who follow you back", 
  
    "De:": "From:",
    "A:": "To:",
    "Precio:": "Price:",
    "Fecha:": "Date:",
    "Transacción": "Transaction",
    "hace": "ago",
    
    
      "🔍 Descubrir Usuarios": "🔍 Discover Users",
  "Encuentra y conecta con creadores increíbles en ChainFeed": "Find and connect with amazing creators on ChainFeed",
  "  Buscar usuarios por nombre, @usuario o especialidad...": "  Search users by name, @username or specialty...",
  "No hay sugerencias de seguidos mutuos disponibles. Sigue a más usuarios para obtener mejores recomendaciones.": "No mutual follow suggestions available. Follow more users to get better recommendations.",
  "Seguidos mutuos": "Mutual follows",
  "usuarios sugeridos por tus seguidos": "users suggested by your followed users",
  "Más relevantes": "Most relevant",
  "Más seguidores": "Most followers",
  "Más tokens CFT": "Most CFT tokens",
  
    "Saldo Total": "Total Balance",
  "En ChainFeed (CFT)": "In ChainFeed (CFT)",
  "En billetera (CFT)": "In wallet (CFT)",
  "Compra CFT Directamente": "Buy CFT Directly",
  "Mi Billetera": "My Wallet",
  "Precio fijo:": "Fixed price: ",
  "por CFT • Sin comisiones adicionales": "per CFT • No additional fees",
  "💰 Comprar Ahora": "💰 Buy Now",
  "Conecta tu Billetera": "Connect your Wallet",
  "✅ Tu email está verificado. Conecta tu billetera Proton para desbloquear:": "✅ Your email is verified. Connect your Proton wallet to unlock:",
  "💰 Retirar tus ganancias": "💰 Withdraw your earnings",
  "Email verificado:": "Email verified:",
  "🔗 Ir a Conectar Billetera": "🔗 Go to Connect Wallet",
  "Sistema de Stake": "Stake System",
  "💎 Abrir Panel de Stake": "💎 Open Stake Panel",
  "Total Stakeado": "Total Staked",
  "Recompensas Ganadas": "Earned Rewards",
  "¿Tienes un código de referido? (Ambos reciben 15 CFT)": "Do you have a referral code? (Both receive 15 CFT)",
  "Total Ganado": "Total Earned",
  "Tokens ganados por ventas": "Tokens earned from sales",
  "Total Gastado": "Total Spent",
  "Tokens gastados en compras": "Tokens spent on purchases",
  "Ventas Realizadas": "Completed Sales",
  "Posts vendidos exitosamente": "Posts sold successfully",
  "Collection": "Collection",
  "Posts en tu colección": "Posts in your collection",
  "Mis Promociones": "My Promotions",
  "Activas ahora": "Active now",
  "Total realizadas": "Total completed",
  "📊 Ver Panel de Promociones": "📊 View Promotions Panel",
  "Tokens invertidos": "Tokens invested",
  "Actividad Financiera": "Financial Activity",
  "Distribución de Ventas vs Compras": "Sales vs Purchases Distribution",
  "No hay transacciones aún": "No transactions yet",
  "Las transacciones aparecerán aquí cuando compres o vendas posts": "Transactions will appear here when you buy or sell posts",
  "Posts Más Rentables": "Most Profitable Posts",
  "Cuando vendas posts, aparecerán aquí ordenados por rentabilidad": "When you sell posts, they will appear here sorted by profitability",
  "Posts con Más Interacciones": "Posts with Most Interactions",
  "No hay posts con interacciones aún": "No posts with interactions yet",
  "Cuando tus posts reciban likes, comentarios o respuestas, aparecerán aquí": "When your posts receive likes, comments or replies, they will appear here",
  "Precio fijo:  $0.01 por CFT": "Fixed price: $0.01 per CFT",
  "Pago en USDT": "Payment in USDT",
  "Pago en USDC": "Payment in USDC",
  "Tarjeta o PayPal": "Card or PayPal",
  "Mínimo: $5 • Máximo: $1.000.000": "Minimum: $5 • Maximum: $1,000,000",
  "Sin comisiones adicionales": "No additional fees",
  "Compra directa a la plataforma": "Direct purchase from platform",
  "➕ Crear Stake": "➕ Create Stake",
  "🔥 Mis Stakes": "🔥 My Stakes",
  "📜 Historial": "📜 History",
  "🔰 Plan Básico": "🔰 Basic Plan",
  "⏰ 30 días de bloqueo": "⏰ 30 day lockup",
  "💰 Mínimo: 1000 CFT": "💰 Minimum: 1000 CFT",
  "🔒 Tokens bloqueados": "🔒 Locked tokens",
  "⭐ Plan Avanzado": "⭐ Advanced Plan",
  "⏰ 60 días de bloqueo": "⏰ 60 day lockup",
  "🏆 Plan Premium": "🏆 Premium Plan",
  "⏰ 90 días de bloqueo": "⏰ 90 day lockup",
  "Configurar Stake": "Configure Stake",
  "Cantidad a Stakear (CFT)": "Amount to Stake (CFT)",
  "Mínimo: 1000 CFT": "Minimum: 1000 CFT",
  "🔒 Crear Stake": "🔒 Create Stake",
  "✕ Cerrar": "✕ Close",
  "💎 Sistema de Stake": "💎 Stake System",
  "📢 Panel de Promociones": "📢 Promotions Panel",
  "Total Promociones": "Total Promotions",
  "Activas Ahora": "Active Now",
  "Tokens Invertidos": "Tokens Invested",
  "🔥 Activas": "🔥 Active",
  "📊 Estadísticas": "📊 Statistics",
  "No tienes promociones activas": "You have no active promotions",
  "Las promociones activas aparecerán aquí": "Active promotions will appear here",
  "No hay historial de promociones": "No promotion history",
  "Tus promociones pasadas aparecerán aquí": "Your past promotions will appear here",
  "Distribución de Planes de Promoción": "Promotion Plans Distribution",
  "No hay datos de planes": "No plan data",
  
    "Acciones de Billetera": "Wallet Actions",
  "💰 Retirar Fondos": "💰 Withdraw Funds",
  "📥 Depositar Fondos": "📥 Deposit Funds",
  "Retirar Fondos": "Withdraw Funds",
  "Cuenta Proton (Destino)": "Proton Account (Destination)",
  "Tu cuenta ChainFeed se usará como destino en Proton. Los tokens se enviarán aquí.": "Your ChainFeed account will be used as destination in Proton. Tokens will be sent here.",
  "Cantidad a Retirar (CFT)": "Amount to Withdraw (CFT)",
  "CFT se enviarán directamente a tu billetera Proton": "CFT will be sent directly to your Proton wallet",
  "📧 Enviar Solicitud": "📧 Send Request",
  "Depositar Fondos": "Deposit Funds",
  "Saldo Actual en ChainFeed": "Current Balance in ChainFeed",
  "Sesión Activa": "Active Session",
  "Cuenta Proton Conectada": "Proton Account Connected",
  "Token a Depositar": "Token to Deposit",
  "Cantidad a Depositar": "Amount to Deposit",
  "Tokens CFT desde tu billetera Proton hacia ChainFeed (@chainfeed)": "CFT tokens from your Proton wallet to ChainFeed (@chainfeed)",
  "📥 Depositar CFT": "📥 Deposit CFT",
  
  // ============================================
// TRADUCCIONES WALLET.JS - ESPAÑOL A INGLÉS
// ============================================

// Mensajes de Retiro
'Retiro no disponible': 'Withdrawal not available',
'Debes esperar': 'You must wait',
'antes de poder solicitar otro retiro': 'before requesting another withdrawal',
'CFT Disponibles': 'CFT Available',
'Total:': 'Total:',
'en billetera': 'in wallet',
'Mínimo:': 'Minimum:',

// Niveles de Usuario
'🏆 Nivel Premium - Mínimo: 200 CFT': '🏆 Premium Level - Minimum: 200 CFT',
'⭐ Nivel Avanzado - Mínimo: 300 CFT': '⭐ Advanced Level - Minimum: 300 CFT',
'🔰 Nivel Básico - Mínimo: 400 CFT': '🔰 Basic Level - Minimum: 400 CFT',
'Alcanza 3000 tokens totales para mínimo de 200 CFT': 'Reach 3000 total tokens for minimum of 200 CFT',
'Alcanza 2000 tokens totales para mínimo de 300 CFT': 'Reach 2000 total tokens for minimum of 300 CFT',
'faltan': 'remaining',
'tokens': 'tokens',

// Botones de Retiro
'📧 Enviar Solicitud': '📧 Send Request',
'⏳ Enviando solicitud...': '⏳ Sending request...',

// Validaciones de Retiro
'Elementos del formulario no encontrados': 'Form elements not found',
'Ingresa una cantidad válida mayor a 0': 'Enter a valid amount greater than 0',
'El monto mínimo de retiro para tu nivel es': 'The minimum withdrawal amount for your level is',
'Cuenta Proton no configurada': 'Proton account not configured',
'Saldo Insuficiente': 'Insufficient Balance',
'Disponible:': 'Available:',
'Solicitado:': 'Requested:',
'Solo puedes retirar desde tu saldo en ChainFeed.': 'You can only withdraw from your ChainFeed balance.',

// Modal de Confirmación de Retiro
'💰 Confirmar Retiro': '💰 Confirm Withdrawal',
'Cantidad a retirar': 'Amount to withdraw',
'Cuenta destino': 'Destination account',
'Tu nivel': 'Your level',
'Nivel Premium': 'Premium Level',
'Nivel Avanzado': 'Advanced Level',
'Nivel Básico': 'Basic Level',
'Se enviará por email para revisión del equipo. Tiempo de procesamiento: hasta 1 hora. Mínimo actual:': 'Will be sent by email for team review. Processing time: up to 1 hour. Current minimum:',
'Cancelar': 'Cancel',
'✅ Confirmar Retiro': '✅ Confirm Withdrawal',

// Resultados de Retiro
'¡Solicitud Enviada!': 'Request Sent!',
'ID:': 'ID:',
'Cantidad:': 'Amount:',
'Cuenta:': 'Account:',
'Será procesada en la próxima hora.': 'Will be processed within the next hour.',
'Error en Retiro': 'Withdrawal Error',
'Error procesando la solicitud.': 'Error processing request.',
'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.': 'Your session has expired. Please log in again.',
'Problema de conexión. Verifica tu internet e intenta nuevamente.': 'Connection problem. Check your internet and try again.',
'Por favor intenta nuevamente.': 'Please try again.',

// Validación de Cuenta Proton
'Cuenta Proton inválida. Usa solo letras (a-z), números (1-5) y puntos, máximo 12 caracteres.': 'Invalid Proton account. Use only letters (a-z), numbers (1-5) and dots, maximum 12 characters.',

// Estados Vacíos
'No hay transacciones aún': 'No transactions yet',
'Las transacciones aparecerán aquí cuando compres o vendas posts': 'Transactions will appear here when you buy or sell posts',
'No hay posts vendidos aún': 'No posts sold yet',
'Cuando vendas posts, aparecerán aquí ordenados por rentabilidad': 'When you sell posts, they will appear here sorted by profitability',
'No hay posts con interacciones aún': 'No posts with interactions yet',
'Cuando tus posts reciban likes, comentarios o respuestas, aparecerán aquí': 'When your posts receive likes, comments or replies, they will appear here',
'Error cargando transacciones': 'Error loading transactions',
'Error cargando posts': 'Error loading posts',

// Tipos de Transacciones
'Promoción:': 'Promotion:',
'1 Día': '1 Day',
'10 Días': '10 Days',
'30 Días': '30 Days',
'Promoción de contenido': 'Content promotion',
'Depósito desde Billetera': 'Deposit from Wallet',
'depositados desde tu billetera Proton': 'deposited from your Proton wallet',
'Retiro Solicitado': 'Withdrawal Requested',
'Retiro en Proceso': 'Withdrawal Processing',
'Retiro Completado': 'Withdrawal Completed',
'Retiro Fallido': 'Withdrawal Failed',
'Retiro Cancelado': 'Withdrawal Cancelled',
'Retiro Procesado': 'Withdrawal Processed',
'Retiro de tokens CFT': 'CFT token withdrawal',
'Venta a': 'Sale to',
'Compra de': 'Purchase from',
'Post sin contenido': 'Post without content',

// P2P
'Venta P2P a': 'P2P Sale to',
'Compra P2P de': 'P2P Purchase from',

// Ofertas P2P
'Activa': 'Active',
'Parcialmente vendida': 'Partially sold',
'Completada': 'Completed',
'Cancelada': 'Cancelled',
'Oferta P2P:': 'P2P Offer:',
'Oferta de venta:': 'Sale offer:',
'cada uno': 'each',
'Vendidos:': 'Sold:',
'Restantes:': 'Remaining:',
'Oferta cancelada:': 'Offer cancelled:',
'devueltos': 'returned',

// Stakes
'Transacción de Stake': 'Stake Transaction',

// Preview de Posts
'Preview del post': 'Post preview',
'▶️ Video': '▶️ Video',
'🖼️ Imagen': '🖼️ Image',

// Gráficos
'Mi Saldo ChainFeed (CFT)': 'My ChainFeed Balance (CFT)',
'Sin datos': 'No data',
'Sin actividad aún': 'No activity yet',
'Sin actividad': 'No activity',
'📍 Tu saldo actual en ChainFeed': '📍 Your current ChainFeed balance',
'Saldo ChainFeed:': 'ChainFeed Balance:',
'💰 Venta de publicación': '💰 Post sale',
'🛒 Compra de publicación': '🛒 Post purchase',
'📥 Depósito desde billetera Proton': '📥 Deposit from Proton wallet',
'💸 Retiro a billetera Proton': '💸 Withdrawal to Proton wallet',
'📢 Promoción de contenido': '📢 Content promotion',
'Ingresos por Ventas': 'Sales Income',
'Gastos en Compras': 'Purchase Expenses',

// Seguridad Wallet/Email
'Verificación de Email Requerida': 'Email Verification Required',
'Tu wallet está conectada, pero debes verificar tu email para acceder a:': 'Your wallet is connected, but you must verify your email to access:',
'🚫 Retiro de fondos': '🚫 Withdraw funds',
'🚫 Depósito de fondos': '🚫 Deposit funds',
'Email registrado:': 'Registered email:',
'No disponible': 'Not available',
'📧 Verificar Email': '📧 Verify Email',
'Verifica tu Email Primero': 'Verify Your Email First',
'Antes de acceder a las funciones completas, debes verificar tu email:': 'Before accessing full features, you must verify your email:',
'Después podrás': 'Then you can',
'🔗 Conectar Billetera Proton': '🔗 Connect Proton Wallet',
'Conecta tu Billetera': 'Connect Your Wallet',
'✅ Tu email está verificado. Conecta tu billetera Proton para desbloquear:': '✅ Your email is verified. Connect your Proton wallet to unlock:',
'📥 Depositar fondos CFT': '📥 Deposit CFT funds',
'💰 Retirar tus ganancias': '💰 Withdraw your earnings',
'Email verificado:': 'Email verified:',
'Verificado': 'Verified',
'🔗 Ir a Conectar Billetera': '🔗 Go to Connect Wallet',

// Reportes/Infracciones
'reporte': 'report',
'reportes': 'reports',
'sin confirmar': 'unconfirmed',
'Primera infracción confirmada': 'First confirmed infraction',
'Infracciones confirmadas': 'Confirmed infractions',
'🔒 Tu cuenta está bloqueada por': '🔒 Your account is blocked for',
'más': 'more',
'día': 'day',
'días': 'days',
'Has alcanzado el nivel máximo de sanciones. Cualquier nueva infracción resultará en': 'You have reached the maximum sanction level. Any new infraction will result in',
'de bloqueo': 'of block',
'Faltan': 'Remaining',
'infracción': 'infraction',
'infracciones': 'infractions',
'para sanción de': 'for sanction of',

// Promociones
'No tienes promociones activas': 'You have no active promotions',
'Las promociones activas aparecerán aquí': 'Active promotions will appear here',
'Publicación': 'Post',
'Evento Chain': 'Chain Event',
'Expirando...': 'Expiring...',
'min restantes': 'min remaining',
'restantes': 'remaining',
'restante': 'remaining',
'No hay historial de promociones': 'No promotion history',
'Tus promociones pasadas aparecerán aquí': 'Your past promotions will appear here',
'Post': 'Post',
'Evento': 'Event',
'No hay datos de planes': 'No plan data',
'Cantidad de promociones': 'Number of promotions',
'Cantidad:': 'Quantity:',
'promoción': 'promotion',
'promociones': 'promotions',
'Tokens:': 'Tokens:',

// Interacciones
'interacciones': 'interactions',
'ventas': 'sales',

// Números formateados
'mill': 'M',

// Errores generales
'Error': 'Error',
'Error verificando restricciones. Intenta nuevamente.': 'Error verifying restrictions. Please try again.',
'Modal no encontrado!': 'Modal not found!',

// ============================================
// TEXTOS DEL HTML QUE FALTABAN
// ============================================

// Títulos y Headers
'Mi Billetera': 'My Wallet',
'Saldo Total': 'Total Balance',
'En ChainFeed (CFT)': 'In ChainFeed (CFT)',
'En billetera (CFT)': 'In wallet (CFT)',

// Compra Directa
'Compra CFT Directamente': 'Buy CFT Directly',
'Precio fijo:': 'Fixed price:  ',
'por CFT • Sin comisiones adicionales': 'per CFT • No additional fees',
'💰 Comprar Ahora': '💰 Buy Now',

// Cards de Estadísticas
'Acciones de Billetera': 'Wallet Actions',
'💰 Retirar Fondos': '💰 Withdraw Funds',
'📥 Depositar Fondos': '📥 Deposit Funds',
'Sistema de Stake': 'Stake System',
'Total Stakeado': 'Total Staked',
'Recompensas Ganadas': 'Rewards Earned',
'Stakes Activos': 'Active Stakes',
'💎 Abrir Panel de Stake': '💎 Open Stake Panel',
'Sistema de Referidos': 'Referral System',
'Cargando datos de referidos...': 'Loading referral data...',
'Tu código de referido': 'Your referral code',
'Referidos': 'Referrals',
'CFT Ganados': 'CFT Earned',
'¿Tienes un código de referido? (Ambos reciben 15 CFT)': 'Do you have a referral code? (Both receive 15 CFT)',
'Ingresa código': 'Enter code',
'Total Ganado': 'Total Earned',
'Tokens ganados por ventas': 'Tokens earned from sales',
'Total Gastado': 'Total Spent',
'Tokens gastados en compras': 'Tokens spent on purchases',
'Ventas Realizadas': 'Sales Made',
'Posts vendidos exitosamente': 'Posts sold successfully',
'Colección': 'Collection',
'Posts en tu colección': 'Posts in your collection',
'Estado de Cuenta': 'Account Status',
'Sin infracciones': 'No infractions',
'Sin sanciones próximas': 'No upcoming sanctions',

// Promociones
'Mis Promociones': 'My Promotions',
'Activas ahora': 'Active now',
'Total realizadas': 'Total made',
'Tokens invertidos': 'Tokens invested',
'📊 Ver Panel de Promociones': '📊 View Promotions Panel',
'📢 Panel de Promociones': '📢 Promotions Panel',
'✕ Cerrar': '✕ Close',
'Total Promociones': 'Total Promotions',
'Activas Ahora': 'Active Now',
'Completadas': 'Completed',
'Tokens Invertidos': 'Tokens Invested',
'🔥 Activas': '🔥 Active',
'📜 Historial': '📜 History',
'📊 Estadísticas': '📊 Statistics',
'Cargando promociones activas...': 'Loading active promotions...',
'Cargando historial...': 'Loading history...',
'Distribución de Planes de Promoción': 'Promotion Plan Distribution',

// Gráficos
'Actividad Financiera': 'Financial Activity',
'Distribución de Ventas vs Compras': 'Sales vs Purchases Distribution',

// Historial
'Historial de Transacciones': 'Transaction History',
'Cargando transacciones...': 'Loading transactions...',
'Posts Más Rentables': 'Most Profitable Posts',
'Cargando posts...': 'Loading posts...',
'Posts con Más Interacciones': 'Posts with Most Interactions',

// Modal Retirar
'Retirar Fondos': 'Withdraw Funds',
'Saldo Disponible': 'Available Balance',
'Cuenta Proton (Destino)': 'Proton Account (Destination)',
'Nombre del Usuario': 'User Name',
'Tu cuenta ChainFeed se usará como destino en Proton. Los tokens se enviarán aquí.': 'Your ChainFeed account will be used as destination on Proton. Tokens will be sent here.',
'Cantidad a Retirar (CFT)': 'Amount to Withdraw (CFT)',
'CFT se enviarán directamente a tu billetera Proton': 'CFT will be sent directly to your Proton wallet',
'Todo': 'All',
'🔰 Calculando nivel...': '🔰 Calculating level...',

// Modal Depositar
'Depositar Fondos': 'Deposit Funds',
'Saldo Actual en ChainFeed': 'Current Balance in ChainFeed',
'Verificando conexión...': 'Verifying connection...',
'Conectando con tu billetera Proton': 'Connecting to your Proton wallet',
'Conectar Billetera': 'Connect Wallet',
'Cuenta Proton Conectada': 'Connected Proton Account',
'Billetera Proton externa': 'External Proton wallet',
'Cantidad a Depositar': 'Amount to Deposit',
'Tokens CFT desde tu billetera Proton hacia ChainFeed (@chainfeed)': 'CFT tokens from your Proton wallet to ChainFeed (@chainfeed)',
'🔗 Conectar Primero': '🔗 Connect First',

// Sistema de Stake
'💎 Sistema de Stake': '💎 Stake System',
'➕ Crear Stake': '➕ Create Stake',
'🔥 Mis Stakes': '🔥 My Stakes',
'Configurar Stake': 'Configure Stake',
'Cantidad a Stakear (CFT)': 'Amount to Stake (CFT)',
'Mínimo: 1,000 CFT': 'Minimum: 1,000 CFT',
'📊 Resumen de tu Stake': '📊 Your Stake Summary',
'Cantidad a stakear:': 'Amount to stake:',
'Período de bloqueo:': 'Lock period:',
'APY aplicado:': 'Applied APY:',
'Recompensa estimada:': 'Estimated reward:',
'Total a recibir:': 'Total to receive:',
'🔒 Crear Stake': '🔒 Create Stake',
'Los stakes se actualizan automáticamente cada minuto': 'Stakes update automatically every minute',
'Cargando stakes...': 'Loading stakes...',

// Seguridad
'Verifica tu Email Primero': 'Verify Your Email First',
'Antes de acceder a las funciones completas, debes verificar tu email:': 'Before accessing full features, you must verify your email:',
'Después podrás': 'Then you can',
'Conecta tu Billetera': 'Connect Your Wallet',
'✅ Tu email está verificado. Conecta tu billetera Proton para desbloquear:': '✅ Your email is verified. Connect your Proton wallet to unlock:',
'📥 Depositar fondos CFT': '📥 Deposit CFT funds',
'💰 Retirar tus ganancias': '💰 Withdraw your earnings',
'🔗 Ir a Conectar Billetera': '🔗 Go to Connect Wallet',


// ============================================
// AGREGAR ESTAS TRADUCCIONES A translations.en
// en i18n-auto-translate.js
// ============================================

// === GRÁFICOS DE WALLET ===
"Mi Saldo ChainFeed (CFT)": "My ChainFeed Balance (CFT)",
"Saldo ChainFeed:": "ChainFeed Balance:",
"📍 Tu saldo actual en ChainFeed": "📍 Your current ChainFeed balance",
"💰 Venta de publicación": "💰 Post sale",
"🛒 Compra de publicación": "🛒 Post purchase",
"📥 Depósito desde billetera Proton": "📥 Deposit from Proton wallet",
"💸 Retiro a billetera Proton": "💸 Withdrawal to Proton wallet",
"📢 Promoción de contenido": "📢 Content promotion",
"Ingresos por Ventas": "Sales Income",
"Gastos en Compras": "Purchase Expenses",
"Sin actividad": "No activity",
"Sin datos": "No data",
"Saldo Total": "Total Balance",
"Sin actividad aún": "No activity yet",

// === GRÁFICO DE PROMOCIONES ===
"1 Día (500 CFT)": "1 Day (500 CFT)",
"10 Días (4,500 CFT)": "10 Days (4,500 CFT)",
"30 Días (12,000 CFT)": "30 Days (12,000 CFT)",
"Cantidad de promociones": "Number of promotions",
"No hay datos de planes": "No plan data",

// === TOOLTIPS DE TIEMPO ===
"día": "day",
"días": "days",
"hora": "hour",
"horas": "hours",
"minuto": "minute",
"minutos": "minutes",
"restante": "remaining",
"restantes": "remaining",

// === NOTIFICACIONES / AVISOS ===
"Like recibido en publicación": "Like received on post",
"Publicación creada": "Post created",
"Comentario en tu publicación": "Comment on your post",
"Nuevo seguidor": "New follower",
"Nuevo comentario": "New comment",
"Nuevo like": "New like",
"Nuevo mensaje": "New message",
"Nuevo repost": "New repost",
"Respuesta a tu comentario": "Reply to your comment",
"Te mencionaron en una publicación": "You were mentioned in a post",
"Te mencionaron en un comentario": "You were mentioned in a comment",
"Solicitud de seguimiento": "Follow request",
"Solicitud aceptada": "Request accepted",
"Tu publicación fue compartida": "Your post was shared",
"Ganaste tokens": "You earned tokens",
"Recibiste tokens": "You received tokens",
"Voto en tu encuesta": "Vote on your poll",
"Participación en tu campaña": "Participation in your campaign",
"Participación en tu evento": "Participation in your event",
"Tu participación fue aprobada": "Your participation was approved",
"Tu participación fue rechazada": "Your participation was rejected",
"Compraron tu publicación": "Someone bought your post",
"Flash visto": "Flash viewed",
"Reacción en tu Flash": "Reaction on your Flash",

// ============================================
// AGREGAR DENTRO DE translations.en = { ... }
// en i18n-auto-translate.js
// ============================================

// === HISTORIAL DE TRANSACCIONES ===
"No hay transacciones aún": "No transactions yet",
"Las transacciones aparecerán aquí cuando compres o vendas posts": "Transactions will appear here when you buy or sell posts",
"Error cargando transacciones": "Error loading transactions",

// === PROMOCIONES EN HISTORIAL ===
"Promoción: 1 Día": "Promotion: 1 Day",
"Promoción: 10 Días": "Promotion: 10 Days",
"Promoción: 30 Días": "Promotion: 30 Days",
"Promoción de contenido": "Content promotion",

// === DEPÓSITOS ===
"Depósito desde Billetera": "Deposit from Wallet",
"depositados desde tu billetera Proton": "deposited from your Proton wallet",
"CFT depositados desde tu billetera Proton": "CFT deposited from your Proton wallet",

// === RETIROS ===
"Retiro Solicitado": "Withdrawal Requested",
"Retiro en Proceso": "Withdrawal Processing",
"Retiro Completado": "Withdrawal Completed",
"Retiro Fallido": "Withdrawal Failed",
"Retiro Cancelado": "Withdrawal Cancelled",
"Retiro Procesado": "Withdrawal Processed",
"Retiro de tokens CFT": "CFT token withdrawal",

// === P2P ===
"Venta P2P a": "P2P Sale to",
"Compra P2P de": "P2P Purchase from",
"Oferta P2P:": "P2P Offer:",
"Oferta P2P: Activa": "P2P Offer: Active",
"Oferta P2P: Parcialmente vendida": "P2P Offer: Partially sold",
"Oferta P2P: Completada": "P2P Offer: Completed",
"Oferta P2P: Cancelada": "P2P Offer: Cancelled",
"Oferta de venta:": "Sale offer:",
"cada uno": "each",
"Vendidos:": "Sold:",
"Restantes:": "Remaining:",
"Oferta cancelada:": "Offer cancelled:",
"devueltos": "returned",

// === STAKES ===
"Transacción de Stake": "Stake Transaction",

// === COMPRAS/VENTAS ===
"Venta a": "Sale to",
"Compra de": "Purchase from",
"Post sin contenido": "Post without content",

// === GRÁFICOS ===
"Mi Saldo ChainFeed (CFT)": "My ChainFeed Balance (CFT)",
"Ingresos por Ventas": "Sales Income",
"Gastos en Compras": "Purchase Expenses",
"Sin actividad": "No activity",
"Sin datos": "No data",
"Saldo Total": "Total Balance",
"Sin actividad aún": "No activity yet",

// === TOOLTIPS DE GRÁFICOS ===
"Saldo ChainFeed:": "ChainFeed Balance:",
"📍 Tu saldo actual en ChainFeed": "📍 Your current ChainFeed balance",
"💰 Venta de publicación": "💰 Post sale",
"🛒 Compra de publicación": "🛒 Post purchase",
"📥 Depósito desde billetera Proton": "📥 Deposit from Proton wallet",
"💸 Retiro a billetera Proton": "💸 Withdrawal to Proton wallet",
"📢 Promoción de contenido": "📢 Content promotion",

// === ESTADOS VACÍOS ===
"No hay posts vendidos aún": "No posts sold yet",
"Cuando vendas posts, aparecerán aquí ordenados por rentabilidad": "When you sell posts, they will appear here sorted by profitability",
"No hay posts con interacciones aún": "No posts with interactions yet",
"Cuando tus posts reciban likes, comentarios o respuestas, aparecerán aquí": "When your posts receive likes, comments or replies, they will appear here",
"Error cargando posts": "Error loading posts",

// === PANEL DE PROMOCIONES ===
"No tienes promociones activas": "You have no active promotions",
"Las promociones activas aparecerán aquí": "Active promotions will appear here",
"No hay historial de promociones": "No promotion history",
"Tus promociones pasadas aparecerán aquí": "Your past promotions will appear here",
"No hay datos de planes": "No plan data",
"Evento Chain": "Chain Event",
"Expirando...": "Expiring...",
"min restantes": "min remaining",
"h restantes": "h remaining",
"día restante": "day remaining",
"días restantes": "days remaining",

// === CARDS DE ESTADÍSTICAS ===
"ventas": "sales",
"interacciones": "interactions",

// === REPORTES/INFRACCIONES ===
"reporte": "report",
"reportes": "reports",
"sin confirmar": "unconfirmed",
"Primera infracción confirmada": "First confirmed infraction",
"Infracciones confirmadas": "Confirmed infractions",
"🔒 Tu cuenta está bloqueada por": "🔒 Your account is blocked for",
"más": "more",
"Has alcanzado el nivel máximo de sanciones. Cualquier nueva infracción resultará en": "You have reached the maximum sanction level. Any new infraction will result in",
" de bloqueo": " of block",

"infracción": "infraction",
"infracciones": "infractions",
"infracciónes para sanción de": "infractions until",
"Faltan ": "Remaining ",
"infraccióne para sanción de": "infraction until",
// === RETIRO MODAL ===
"CFT Disponibles": "CFT Available",
"en billetera": "in wallet",
"🏆 Nivel Premium - Mínimo: 200 CFT": "🏆 Premium Level - Minimum: 200 CFT",
"⭐ Nivel Avanzado - Mínimo: 300 CFT": "⭐ Advanced Level - Minimum: 300 CFT",
"🔰 Nivel Básico - Mínimo: 400 CFT": "🔰 Basic Level - Minimum: 400 CFT",
"Alcanza 3000 tokens totales para mínimo de 200 CFT": "Reach 3000 total tokens for minimum of 200 CFT",
"Alcanza 2000 tokens totales para mínimo de 300 CFT": "Reach 2000 total tokens for minimum of 300 CFT",
"tokens": "tokens",

// === CONFIRMACIÓN RETIRO ===
"💰 Confirmar Retiro": "💰 Confirm Withdrawal",
"Cantidad a retirar": "Amount to withdraw",
"Cuenta destino": "Destination account",
"Tu nivel": "Your level",
"Nivel Premium": "Premium Level",
"Nivel Avanzado": "Advanced Level",
"Nivel Básico": "Basic Level",
"Se enviará por email para revisión del equipo. Tiempo de procesamiento: hasta 1 hora. Mínimo actual:": "Will be sent by email for team review. Processing time: up to 1 hour. Current minimum:",
"✅ Confirmar Retiro": "✅ Confirm Withdrawal",

// === MENSAJES DE ÉXITO/ERROR ===
"¡Solicitud Enviada!": "Request Sent!",
"Será procesada en la próxima hora.": "Will be processed within the next hour.",
"Error en Retiro": "Withdrawal Error",
"Error procesando la solicitud.": "Error processing request.",
"Tu sesión ha expirado. Por favor, inicia sesión nuevamente.": "Your session has expired. Please log in again.",
"Problema de conexión. Verifica tu internet e intenta nuevamente.": "Connection problem. Check your internet and try again.",
"Por favor intenta nuevamente.": "Please try again.",
"Retiro no disponible": "Withdrawal not available",
"Debes esperar": "You must wait",
"antes de poder solicitar otro retiro": "before requesting another withdrawal",
"Ingresa una cantidad válida mayor a 0": "Enter a valid amount greater than 0",
"El monto mínimo de retiro para tu nivel es": "The minimum withdrawal amount for your level is",
"Cuenta Proton no configurada": "Proton account not configured",
"Saldo Insuficiente": "Insufficient Balance",
"Disponible:": "Available:",
"Solicitado:": "Requested:",
"Solo puedes retirar desde tu saldo en ChainFeed.": "You can only withdraw from your ChainFeed balance.",

// Agregar a translations.en = { ... }

// === TOOLTIPS ESTÁTICOS ===
"Sin actividad": "No activity",
"Sin datos": "No data", 
"Sin actividad aún": "No activity yet",
"Tu saldo actual en ChainFeed": "Your current ChainFeed balance",
"Venta de publicación": "Post sale",
"Compra de publicación": "Post purchase",
"Depósito desde billetera Proton": "Deposit from Proton wallet",
"Retiro a billetera Proton": "Withdrawal to Proton wallet",
"Promoción de contenido": "Content promotion",
"Recompensa por publicar": "Posting reward",
"Recompensa por like": "Like reward",
"Recompensa por comentario": "Comment reward",
"Ingresos por Ventas": "Sales Income",
"Gastos en Compras": "Purchase Expenses",
"Mi Saldo ChainFeed (CFT)": "My ChainFeed Balance (CFT)",
"Saldo Total": "Total Balance",
"Primera infracción confirmada": "First confirmed infraction",
"Infracciones confirmadas": "Confirmed infractions",
"sin confirmar": "unconfirmed",
"Expirando...": "Expiring...",
"Será procesada en la próxima hora.": "Will be processed within the next hour.",
"cada uno": "each",
"devueltos": "returned",
"promoción": "promotion",
"promociones": "promotions",
"venta": "sale",
"ventas": "sales",
"interacción": "interaction",
"interacciones": "interactions",

// === HISTORIAL DE TRANSACCIONES - ESTÁTICOS ===
"Promoción de contenido": "Content promotion",
"Plan desconocido": "Unknown plan",
"Depósito desde Billetera": "Deposit from Wallet",
"depositados desde tu billetera Proton": "deposited from your Proton wallet",
"Retiro Solicitado": "Withdrawal Requested",
"Retiro en Proceso": "Withdrawal Processing",
"Retiro Completado": "Withdrawal Completed",
"Retiro Fallido": "Withdrawal Failed",
"Retiro Cancelado": "Withdrawal Cancelled",
"Retiro Procesado": "Withdrawal Processed",
"Retiro de tokens CFT": "CFT token withdrawal",
"Transacción de Stake": "Stake Transaction",
"Post sin contenido": "Post without content",
"No hay transacciones aún": "No transactions yet",
"Las transacciones aparecerán aquí cuando compres o vendas posts": "Transactions will appear here when you buy or sell posts",
"Error cargando transacciones": "Error loading transactions",
"No hay posts vendidos aún": "No posts sold yet",
"Cuando vendas posts, aparecerán aquí ordenados por rentabilidad": "When you sell posts, they will appear here sorted by profitability",
"No hay posts con interacciones aún": "No posts with interactions yet",
"Cuando tus posts reciban likes, comentarios o respuestas, aparecerán aquí": "When your posts receive likes, comments or replies, they will appear here",
"Error cargando posts": "Error loading posts",
"ventas": "sales",
"venta": "sale",
"interacciones": "interactions",
"interacción": "interaction",
"cada uno": "each",
"devueltos": "returned",
"bloqueados": "locked",
"Vendidos:": "Sold:",
"Restantes:": "Remaining:",
"Oferta cancelada:": "Offer cancelled:",
"Activa": "Active",
"Parcialmente vendida": "Partially sold",
"Completada": "Completed",
"Cancelada": "Cancelled",
"mill": "M",

// === TIPOS DE PLANES ===
"1 Día": "1 Day",
"10 Días": "10 Days",
"30 Días": "30 Days",

// === OFERTAS P2P ===
"Oferta P2P: Activa": "P2P Offer: Active",
"Oferta P2P: Parcialmente vendida": "P2P Offer: Partially sold",
"Oferta P2P: Completada": "P2P Offer: Completed",
"Oferta P2P: Cancelada": "P2P Offer: Cancelled",
"Oferta de venta:": "Sale offer:",

// === WALLET - DESCRIPCIONES DINÁMICAS ===

// Sistema
"Inicio del período": "Start of period",
"Saldo actual": "Current balance",
"Sin contenido": "No content",
"Contenido promocionado": "Promoted content",

// Entidades del sistema
"Sistema ChainFeed": "ChainFeed System",
"Sistema de Retiros": "Withdrawal System",
"Sistema de Promociones": "Promotion System",
"Sistema de Staking": "Staking System",
"Billetera Proton": "Proton Wallet",
"Tu Billetera CFT": "Your CFT Wallet",
"Marketplace P2P": "P2P Marketplace",

// Stakes
"Stake Creado": "Stake Created",
"Stake Reclamado": "Stake Claimed",
"Transacción de Stake": "Stake Transaction",
"Movimiento de stake": "Stake movement",

// Retiros (labels del historial)
"Retiro a cuenta Proton:": "Withdrawal to Proton account:",
"Retiro a:": "Withdrawal to:",
 "Ganados": "Earned",

"Marketplace P2P - ChainFeed": "P2P Marketplace - ChainFeed",
"Marketplace P2P": "P2P Marketplace",

// Botones principales
"+ Crear Oferta": "+ Create Offer",
"💎 Comprar CFT Directamente ($0.01)": "💎 Buy CFT Directly ($0.01)",

// Gráfico de mercado
"Precio de Mercado CFT": "CFT Market Price",
"Evolución del precio en el mercado P2P": "Price evolution in P2P market",
"Moneda:": "Currency:",
"Todas": "All",
"Precio Actual": "Current Price",
"Variación": "Change",
"Mínimo": "Minimum",
"Máximo": "Maximum",
"Promedio": "Average",

// Tabs
"Ofertas Disponibles": "Available Offers",
"Mis Ofertas": "My Offers",
"Historial": "History",
"Mis Estadísticas": "My Statistics",

// Filtros
"🔍 Filtros": "🔍 Filters",
"Tipo": "Type",
"Todos": "All",
"Venta": "Sell",
"Compra": "Buy",
"Moneda": "Currency",
"Precio Mínimo": "Min Price",
"Precio Máximo": "Max Price",
"Ordenar por": "Sort by",
"Más recientes": "Newest",
"Más antiguos": "Oldest",
"Precio menor": "Lowest price",
"Precio mayor": "Highest price",
"Mayor cantidad": "Highest amount",
"Menor cantidad": "Lowest amount",


// Estadísticas
"Total CFT Vendidos": "Total CFT Sold",
"Total CFT Comprados": "Total CFT Bought",
"Transacciones Completadas": "Completed Transactions",
"Tasa de Éxito": "Success Rate",

// Modal Crear Oferta
"Crear Oferta P2P": "Create P2P Offer",
"Tipo de Oferta": "Offer Type",
"Vender CFT": "Sell CFT",
"Comprar CFT": "Buy CFT",
"Cantidad de CFT": "CFT Amount",
"Precio Unitario": "Unit Price",
"Moneda de Pago": "Payment Currency",
"Monto Total:": "Total Amount:",
"* La plataforma cobra 5% de comisión al vendedor": "* Platform charges 5% commission to seller",
"Crear Oferta": "Create Offer",

// Modal Comprar
"Comprar CFT": "Buy CFT",

// Badges de ofertas
"venta": "sell",
"compra": "buy",

// Labels de ofertas
"Precio": "Price",
"Cantidad": "Amount",
"Total": "Total",

// Períodos de tiempo
"24h": "24h",
"7d": "7d",
"30d": "30d",

// Estados y mensajes
"Activo": "Active",
"Completado": "Completed",
"Cancelado": "Cancelled",
"Pendiente": "Pending",

"Cargando ofertas...": "Loading offers...",
"Cargando tus ofertas...": "Loading your offers...",
"Cargando historial...": "Loading history...",

// === ESTADOS VACÍOS ===
"No hay ofertas disponibles": "No offers available",
"No se encontraron ofertas": "No offers found",
"No tienes ofertas activas": "You have no active offers",
"No tienes transacciones P2P aún": "You have no P2P transactions yet",
"Error al cargar ofertas": "Error loading offers",
"Error al cargar tus ofertas": "Error loading your offers",
"Error al cargar historial": "Error loading history",

// === BADGES DE OFERTAS ===
"📤 VENDE": "📤 SELLING",
"📥 COMPRA": "📥 BUYING",
"📤 VENDIENDO": "📤 SELLING",
"📥 COMPRANDO": "📥 BUYING",
"(Tu oferta)": "(Your offer)",

// === BOTONES DE ACCIÓN ===
"Comprar CFT": "Buy CFT",
"Vender CFT": "Sell CFT",
"🔒 Bloqueado": "🔒 Locked",
"🗑️ Cancelar": "🗑️ Cancel",
"🗑️ Cancelar Oferta": "🗑️ Cancel Offer",

// === HISTORIAL ===
"📤 Vendiste": "📤 You sold",
"📥 Compraste": "📥 You bought",
"Comprador": "Buyer",
"Vendedor": "Seller",
"COMPLETADO": "COMPLETED",
"CANCELADO": "CANCELLED",
"ACTIVA": "ACTIVE",
"PARCIAL": "PARTIAL",

// === MODAL CANCELAR ===
"¿Cancelar oferta?": "Cancel offer?",
"Esta acción no se puede deshacer. La oferta será removida del marketplace.": "This action cannot be undone. The offer will be removed from the marketplace.",
"Sí, cancelar": "Yes, cancel",
"No, mantener": "No, keep it",

// === NOTIFICACIONES ===
"Oferta cancelada exitosamente": "Offer cancelled successfully",
"Error al cancelar oferta": "Error cancelling offer",
"✅ Oferta creada exitosamente": "✅ Offer created successfully",
"Error al crear oferta": "Error creating offer",
"Ingresa una cantidad válida de CFT": "Enter a valid CFT amount",
"Ingresa un precio válido": "Enter a valid price",

// === ACCESO RESTRINGIDO ===
"Acceso Restringido al Marketplace P2P": "Restricted Access to P2P Marketplace",
"🔒 Acceso Restringido al Marketplace P2P": "🔒 Restricted Access to P2P Marketplace",
"Puedes usar el botón \"💎 Comprar CFT Directamente\" abajo": "You can use the \"💎 Buy CFT Directly\" button below",

// === TIEMPO RELATIVO (formatDate) ===
"Ahora": "Now",

  "Comprar CFT Directamente": "Buy CFT Directly",
  "Pago en tu moneda local": "Payment in your local currency",
  "Los precios están en USD, pero puedes pagar con tu moneda local. PayPal aplicará automáticamente su tipo de cambio al procesar el pago.": "Prices are in USD, but you can pay with your local currency. PayPal will automatically apply its exchange rate when processing the payment.",
  "Realiza una compra de": "Make a purchase of",
  "mínimo 5 USD": "minimum $5 USD",
  "para desbloquear el P2P": "to unlock P2P",
"El monto mínimo es $5": "The minimum amount is $5",

"TODAS": "ALL",
"Todas": "All",
"todas": "all",

// === GRÁFICO P2P - LABELS Y TOOLTIPS ===
"Precio CFT": "CFT Price",
"Promedio Móvil": "Moving Average",
"Promedio móvil": "Moving average",
"Precio": "Price",
"Moneda": "Currency",
"Volumen": "Volume",
"Cantidad": "Amount",
"Sin datos": "No data",
"No hay transacciones en este período": "No transactions in this period",

// === ESTADÍSTICAS DEL GRÁFICO ===
"Precio Actual": "Current Price",
"Variación": "Change",
"Mínimo": "Minimum",
"Máximo": "Maximum",
"Promedio": "Average",
"Precio de Mercado CFT": "CFT Market Price",
"Evolución del precio en el mercado P2P": "Price evolution in P2P market",

// === PÁGINA DE ACCESO RESTRINGIDO ===
"ChainFeed": "ChainFeed",
"Próximamente Disponible": "Coming Soon",
"Estamos trabajando arduamente para ofrecerte": "We are working hard to bring you",
"la mejor experiencia en redes sociales descentralizadas.": "the best decentralized social media experience.",
"Nueva interfaz": "New interface",
"Más rápido": "Faster",
"Más seguro": "More secure",
"Redirigiendo en": "Redirecting in",
"segundos...": "seconds...",
"ChainFeed © 2025 - El futuro de las redes sociales": "ChainFeed © 2025 - The future of social media",

// === FEATURES BADGES ===
"✨ Nueva interfaz": "✨ New interface",
"⚡ Más rápido": "⚡ Faster",
"🔒 Más seguro": "🔒 More secure",

// === FILTROS Y PERÍODOS ===
"Moneda:": "Currency:",
"Todas": "All",
"24h": "24h",
"7d": "7d",
"30d": "30d",

// === TOOLTIPS DINÁMICOS DEL GRÁFICO (patrones) ===
// Estos se manejan con patrones dinámicos, pero agregamos versiones estáticas también
"Precio:": "Price:",
"Moneda:": "Currency:",
"Volumen:": "Volume:",
"Cantidad:": "Amount:",

// === DÍAS DE LA SEMANA (para formatDate) ===
"lunes": "Monday",
"martes": "Tuesday",
"miércoles": "Wednesday",
"jueves": "Thursday",
"viernes": "Friday",
"sábado": "Saturday",
"domingo": "Sunday",

// === MESES (para formatDate) ===
"enero": "January",
"febrero": "February",
"marzo": "March",
"abril": "April",
"mayo": "May",
"junio": "June",
"julio": "July",
"agosto": "August",
"septiembre": "September",
"octubre": "October",
"noviembre": "November",
"diciembre": "December",

// === MESES ABREVIADOS ===
"ene": "Jan",
"feb": "Feb",
"mar": "Mar",
"abr": "Apr",
"may": "May",
"jun": "Jun",
"jul": "Jul",
"ago": "Aug",
"sep": "Sep",
"oct": "Oct",
"nov": "Nov",
"dic": "Dec",

// === MARKETPLACE P2P - INTERFACE ===
"Marketplace P2P - ChainFeed": "P2P Marketplace - ChainFeed",
"Marketplace P2P": "P2P Marketplace",
"+ Crear Oferta": "+ Create Offer",
"💎 Comprar CFT Directamente ($0.01)": "💎 Buy CFT Directly ($0.01)",
"Ofertas Disponibles": "Available Offers",
"Mis Ofertas": "My Offers",
"Historial": "History",
"Mis Estadísticas": "My Statistics",

// === FILTROS P2P ===
"🔍 Filtros": "🔍 Filters",
"Tipo": "Type",
"Todos": "All",
"Venta": "Sell",
"Compra": "Buy",
"Precio Mínimo": "Min Price",
"Precio Máximo": "Max Price",
"Ordenar por": "Sort by",
"Más recientes": "Newest",
"Más antiguos": "Oldest",
"Precio menor": "Lowest price",
"Precio mayor": "Highest price",
"Mayor cantidad": "Highest amount",
"Menor cantidad": "Lowest amount",

// === ESTADÍSTICAS P2P ===
"Total CFT Vendidos": "Total CFT Sold",
"Total CFT Comprados": "Total CFT Bought",
"Transacciones Completadas": "Completed Transactions",
"Tasa de Éxito": "Success Rate",

// === MODAL CREAR OFERTA ===
"Crear Oferta P2P": "Create P2P Offer",
"Tipo de Oferta": "Offer Type",
"Vender CFT": "Sell CFT",
"Comprar CFT": "Buy CFT",
"Cantidad de CFT": "CFT Amount",
"Precio Unitario": "Unit Price",
"Moneda de Pago": "Payment Currency",
"Monto Total:": "Total Amount:",
"* La plataforma cobra 5% de comisión al vendedor": "* Platform charges 5% commission to seller",
"Crear Oferta": "Create Offer",

// === BADGES DE OFERTAS ===
"📤 VENDE": "📤 SELLING",
"📥 COMPRA": "📥 BUYING",
"📤 VENDIENDO": "📤 SELLING",
"📥 COMPRANDO": "📥 BUYING",
"(Tu oferta)": "(Your offer)",

// === BOTONES DE ACCIÓN ===
"🔒 Bloqueado": "🔒 Locked",
"🗑️ Cancelar": "🗑️ Cancel",
"🗑️ Cancelar Oferta": "🗑️ Cancel Offer",

// === HISTORIAL P2P ===
"📤 Vendiste": "📤 You sold",
"📥 Compraste": "📥 You bought",
"Comprador": "Buyer",
"Vendedor": "Seller",
"COMPLETADO": "COMPLETED",
"CANCELADO": "CANCELLED",
"ACTIVA": "ACTIVE",
"PARCIAL": "PARTIAL",

// === NOTIFICACIONES - TÍTULOS Y NAVEGACIÓN ===
"Notificaciones": "Notifications",
"Todas": "All",
"No leídas": "Unread",
"Marcar todas como leídas": "Mark all as read",
"No tienes notificaciones": "You have no notifications",
"No tienes notificaciones no leídas": "You have no unread notifications",
"Cargar más": "Load more",
"Cargando notificaciones...": "Loading notifications...",

// === TIPOS DE NOTIFICACIONES ===
"Me gusta": "Likes",
"Comentarios": "Comments",
"Seguidores": "Followers",
"Reposts": "Reposts",
"Propinas": "Tips",
"Menciones": "Mentions",
"Sistema": "System",
"Ventas": "Sales",
"Compras": "Purchases",
"Retiros": "Withdrawals",
"Depósitos": "Deposits",
"Eventos Chain": "Chain Events",
"Solicitudes": "Requests",
"Stakes": "Stakes",
"Chat": "Chat",

// === ACCIONES ===
"Marcar como leída": "Mark as read",
"Marcar como no leída": "Mark as unread",
"Eliminar notificación": "Delete notification",
"Ver publicación": "View post",
"Ver perfil": "View profile",
"Ver más detalles": "View more details",
"Ocultar detalles": "Hide details",
"Expandir grupo": "Expand group",
"Contraer grupo": "Collapse group",

// === ESTADOS ===
"Leída": "Read",
"No leída": "Unread",
"Completado": "Completed",
"Fallido": "Failed",
"Pendiente": "Pending",
"Aprobado": "Approved",
"Rechazado": "Rejected",

// === CONTADORES ===
"notificación": "notification",
"notificaciones": "notifications",
"nueva": "new",
"nuevas": "new",

// === MODAL CANCELAR ===
"¿Cancelar oferta?": "Cancel offer?",
"Esta acción no se puede deshacer. La oferta será removida del marketplace.": "This action cannot be undone. The offer will be removed from the marketplace.",
"Sí, cancelar": "Yes, cancel",
"No, mantener": "No, keep it",

// === NOTIFICACIONES P2P ===
"Oferta cancelada exitosamente": "Offer cancelled successfully",
"Error al cancelar oferta": "Error cancelling offer",
"✅ Oferta creada exitosamente": "✅ Offer created successfully",
"Error al crear oferta": "Error creating offer",
"Ingresa una cantidad válida de CFT": "Enter a valid CFT amount",
"Ingresa un precio válido": "Enter a valid price",

// === ACCESO RESTRINGIDO ===
"Acceso Restringido al Marketplace P2P": "Restricted Access to P2P Marketplace",
"🔒 Acceso Restringido al Marketplace P2P": "🔒 Restricted Access to P2P Marketplace",
"Puedes usar el botón \"💎 Comprar CFT Directamente\" abajo": "You can use the \"💎 Buy CFT Directly\" button below",

// === ESTADOS VACÍOS ===
"No hay ofertas disponibles": "No offers available",
"No se encontraron ofertas": "No offers found",
"No tienes ofertas activas": "You have no active offers",
"No tienes transacciones P2P aún": "You have no P2P transactions yet",
"Error al cargar ofertas": "Error loading offers",
"Error al cargar tus ofertas": "Error loading your offers",
"Error al cargar historial": "Error loading history",
"📭 No hay posts con videos o imágenes en esta sección": "📭 No posts with videos or images in this section",
 
// === CARGANDO ===
"Cargando ofertas...": "Loading offers...",
"Cargando tus ofertas...": "Loading your offers...",
"Cargando historial...": "Loading history...",

// === ESTADOS CON EMOJI ===
"🟢 Activa": "🟢 Active",
"🔴 Cancelada": "🔴 Cancelled",
"✅ Completada": "✅ Completed",
"⏳ Pendiente": "⏳ Pending",

// === FORMATOS DE TIEMPO RELATIVOS ===
"Hace": "ago",
"hace": "ago",

// === TOOLTIPS ADICIONALES ===
"Disponible:": "Available:",
"Recibirás:": "You'll receive:",
"Pagarás:": "You'll pay:",
"Comisión:": "Commission:",
"Límite:": "Limit:",
"Mín:": "Min:",
"Máx:": "Max:",

// === NOTIFICACIONES UI - TOASTS Y MODALES ===

// Botones principales
"Entendido": "Understood",
"Confirmar": "Confirm",
"Cancelar": "Cancel",
"Aceptar": "Accept",

// Textos por defecto de botones
"Sí": "Yes",
"No": "No",
"OK": "OK",
"Cerrar": "Close",

// Estados de procesamiento
"Procesando...": "Processing...",
"Cargando...": "Loading...",
"Guardando...": "Saving...",
"Eliminando...": "Deleting...",
"Enviando...": "Sending...",

// Mensajes de confirmación genéricos
"¿Estás seguro?": "Are you sure?",
"Esta acción no se puede deshacer": "This action cannot be undone",
"¿Deseas continuar?": "Do you want to continue?",

// Placeholders comunes
"Escribe aquí...": "Type here...",
"Ingresa un valor": "Enter a value",
"Opcional": "Optional",

// === MARKETPLACE P2P - TEXTOS GENERALES ===
"Marketplace P2P - ChainFeed": "P2P Marketplace - ChainFeed",
"Marketplace P2P": "P2P Marketplace",
"+ Crear Oferta": "+ Create Offer",
"💎 Comprar CFT Directamente ($0.01)": "💎 Buy CFT Directly ($0.01)",
"Ofertas Disponibles": "Available Offers",
"Mis Ofertas": "My Offers",
"Historial": "History",
"Mis Estadísticas": "My Statistics",

// === TIPOS DE OFERTA ===
"Venta": "Sale",
"Compra": "Purchase",
"Tipo de oferta": "Offer type",
"Quiero vender CFT": "I want to sell CFT",
"Quiero comprar CFT": "I want to buy CFT",

// === ESTADOS ===
"Activa": "Active",
"Parcial": "Partial",
"Completada": "Completed",
"Cancelada": "Cancelled",
"activa": "active",
"parcial": "partial",
"completada": "completed",
"cancelada": "cancelled",

// === FORMULARIOS ===
"Cantidad de CFT": "CFT Amount",
"Precio unitario": "Unit Price",
"Moneda de pago": "Payment Currency",
"Método de pago": "Payment Method",
"Notas adicionales": "Additional Notes",
"Crear oferta": "Create Offer",
"Cancelar": "Cancel",
"Guardar": "Save",
"Editar": "Edit",
"Eliminar": "Delete",

// === FILTROS ===
"Filtrar por": "Filter by",
"Ordenar por": "Sort by",
"Más reciente": "Newest",
"Más antiguo": "Oldest",
"Precio más bajo": "Lowest Price",
"Precio más alto": "Highest Price",
"Mayor cantidad": "Highest Amount",
"Menor cantidad": "Lowest Amount",
"Todas las ofertas": "All Offers",
"Solo ventas": "Sales Only",
"Solo compras": "Purchases Only",

// === ESTADÍSTICAS ===
"Calificación": "Rating",
"Operaciones completadas": "Completed Trades",
"Tasa de éxito": "Success Rate",
"Total de intercambios": "Total Trades",
"Vendedor verificado": "Verified Seller",
"Comprador verificado": "Verified Buyer",

"Reposteaste • 3d": "You reposted • 3d",
"Reposteaste • 2d": "You reposted • 2d",
"Reposteaste • 1d": "You reposted • 1d",
"Reposteaste • 3h": "You reposted • 3h",
"Reposteaste • 2h": "You reposted • 2h",
"Reposteaste • 1h": "You reposted • 1h",

// === REPOSTS - TEXTOS ESTÁTICOS ===
"Reposteaste": "You reposted",
"reposteó": "reposted",
"Reposteaste • Ahora": "You reposted • Now",
"reposteó • Ahora": "reposted • Now",

// === ACCIONES ===
"Ver detalles": "View Details",
"Comprar ahora": "Buy Now",
"Vender ahora": "Sell Now",
"Cancelar oferta": "Cancel Offer",
"Confirmar transacción": "Confirm Transaction",
"Marcar como pagado": "Mark as Paid",
"Liberar CFT": "Release CFT",
"Abrir disputa": "Open Dispute",

// === MENSAJES DE ERROR ===
"Método no permitido": "Method not allowed",
"No autorizado": "Unauthorized",
"Error al decodificar JSON": "Error decoding JSON",
"Tipo de oferta inválido": "Invalid offer type",
"La cantidad de CFT debe ser mayor a 0": "CFT amount must be greater than 0",
"El precio unitario debe ser mayor a 0": "Unit price must be greater than 0",
"Moneda de pago inválida": "Invalid payment currency",
"Solo se acepta USDT o USDC": "Only USDT or USDC accepted",
"Usuario no encontrado": "User not found",
"Saldo CFT insuficiente": "Insufficient CFT balance",
"Error al congelar CFT": "Error freezing CFT",
"Error al crear la oferta en la base de datos": "Error creating offer in database",
"Oferta P2P creada exitosamente": "P2P offer created successfully",
"ID de oferta inválido": "Invalid offer ID",
"Oferta no encontrada o no tienes permiso para cancelarla": "Offer not found or you don't have permission to cancel it",
"Solo se pueden cancelar ofertas activas o parciales": "Only active or partial offers can be cancelled",
"Oferta cancelada exitosamente": "Offer cancelled successfully",

// === RESTRICCIONES DE ACCESO ===
"Acceso restringido al Marketplace P2P": "Access restricted to P2P Marketplace",
"para crear ofertas": "to create offers",
"Tu balance": "Your balance",
"Te faltan": "You need",
"CFT disponibles": "CFT available",

// === MONEDAS ===
"USDT": "USDT",
"USDC": "USDC",

// === PAGINACIÓN ===
"Página": "Page",
"de": "of",
"Siguiente": "Next",
"Anterior": "Previous",
"Mostrando": "Showing",
"resultados": "results",

// === VACÍO ===
"No hay ofertas disponibles": "No offers available",
"No tienes ofertas creadas": "You have no offers created",
"Crea tu primera oferta": "Create your first offer",
"No hay historial de transacciones": "No transaction history",

// === FULLSCREEN VIEWER ===
"📄 Cargando publicación...": "📄 Loading post...",
"❌ Error al cargar publicación": "❌ Error loading post",
"📄 Publicación": "📄 Post",
"Creado originalmente por": "Originally created by",
"💰 Precio de venta": "💰 Sale Price",
"👤 Ver perfil de": "👤 View profile of",
"❤️ Te gusta": "❤️ You like",
"🤍 Me gusta": "🤍 Like",
"❤️ Like agregado": "❤️ Like added",
"💔 Like removido": "💔 Like removed",
"✅ Reposteado": "✅ Reposted",
"🔄 Repostear": "🔄 Repost",
"🔄 Post reposteado": "🔄 Post reposted",
"❌ Repost eliminado": "❌ Repost removed",
"⏳ Procesando...": "⏳ Processing...",
"Error al procesar like": "Error processing like",
"Error al procesar repost": "Error processing repost",
"Error al abrir comentarios": "Error opening comments",
"Error al cargar comentarios": "Error loading comments",
"Activar sonido": "Enable sound",
"Silenciar": "Mute",
"Tu navegador no soporta video.": "Your browser does not support video.",
"Tu navegador no soporta audio.": "Your browser does not support audio.",

// === MODAL DE COMENTARIOS ===
"💬 Comentarios": "💬 Comments",
"Escribe una respuesta...": "Write a reply...",
"Escribe un comentario...": "Write a comment...",
"Responder": "Reply",
"Cancelar": "Cancel",
"Ocultar respuestas": "Hide replies",
"Comentar": "Comment",
"Enviando...": "Sending...",
"Cargando comentarios...": "Loading comments...",
"Sin comentarios aún": "No comments yet",
"¡Sé el primero en comentar!": "Be the first to comment!",
"¡Comentario publicado!": "Comment posted!",
"¡Respuesta publicada!": "Reply posted!",
"Error al publicar comentario": "Error posting comment",
"Error al publicar respuesta": "Error posting reply",
"ahora": "now",
"hace": "ago",

// === ESTADOS Y ACCIONES ===
"Error: No se pudo identificar la publicación": "Error: Could not identify the post",
"Método no permitido": "Method not allowed",
"No autorizado": "Unauthorized",

// === PÁGINA DE CONFIGURACIÓN - TÍTULOS Y NAVEGACIÓN ===
"Configuración del Perfil": "Profile Settings",
"Personaliza tu información y actualiza tu perfil": "Customize your information and update your profile",
"Editando perfil de:": "Editing profile of:",
"Cargando...": "Loading...",

// === SELECTOR DE TEMA ===
"Claro": "Light",
"Oscuro": "Dark",

// === SECCIÓN DE WALLET ===
"Vincular Wallet WebAuth": "Link WebAuth Wallet",
"Conecta tu billetera Proton para acceder a funciones avanzadas de blockchain.": "Connect your Proton wallet to access advanced blockchain features.",
"Una vez vinculada, no podrás cambiarla.": "Once linked, you cannot change it.",
"Conectar Billetera": "Connect Wallet",
"Conectando...": "Connecting...",
"Wallet vinculada": "Wallet linked",
"Wallet vinculada exitosamente": "Wallet linked successfully",

// === SECCIÓN DE EMAIL ===
"Registrar Email y Contraseña": "Register Email and Password",
"Vincula un email a tu cuenta de wallet para poder iniciar sesión con email.": "Link an email to your wallet account to log in with email.",
"Podrás alternar entre ambos métodos de login.": "You can switch between both login methods.",
"Registrar Email": "Register Email",
"Email Pendiente de Verificación": "Email Pending Verification",
"Tu email está registrado pero aún no ha sido verificado.": "Your email is registered but not yet verified.",
"Email registrado:": "Registered email:",
"Revisa tu bandeja de entrada y haz clic en el enlace de verificación. Si no lo encuentras, revisa tu carpeta de spam.": "Check your inbox and click the verification link. If you don't find it, check your spam folder.",
"Reenviar Código": "Resend Code",
"Intentos restantes:": "Attempts remaining:",
"Cuenta Completamente Verificada": "Account Fully Verified",
"Tu cuenta tiene ambos métodos de acceso configurados:": "Your account has both access methods configured:",
"Wallet vinculada:": "Linked wallet:",
"Email registrado:": "Registered email:",
"Puedes iniciar sesión con cualquiera de los dos métodos.": "You can log in with either method.",

// === FORMULARIO DE PERFIL ===
"Cambiar Foto": "Change Photo",
"Avatar actualizado (no olvides guardar)": "Avatar updated (don't forget to save)",
"Idioma / Language": "Language / Idioma",

// === NOTIFICACIONES PUSH ===
"Notificaciones Push": "Push Notifications",
"Tu navegador no soporta notificaciones push": "Your browser doesn't support push notifications",
"Desactivar Notificaciones": "Disable Notifications",
"Recibe notificaciones en tiempo real de tu actividad en ChainFeed": "Receive real-time notifications of your ChainFeed activity",
"Activar Notificaciones": "Enable Notifications",
"Notificaciones bloqueadas": "Notifications blocked",
"Para activarlas, debes permitirlas desde la configuración de tu navegador": "To enable them, you must allow them from your browser settings",
"Notificaciones activadas correctamente": "Notifications enabled successfully",
"Notificaciones desactivadas correctamente": "Notifications disabled successfully",

// === CAMPOS DEL FORMULARIO ===
"Nombre de Usuario": "Username",
"Ej: juan_perez": "E.g.: john_doe",
"El nombre de usuario no se puede cambiar": "Username cannot be changed",
"Nombre Público": "Display Name",
"Ej: Juan Pérez": "E.g.: John Doe",
"Este es tu nombre público que otros verán en tu perfil": "This is your public name that others will see on your profile",
"El nombre público es requerido": "Display name is required",
"El nombre debe tener al menos 2 caracteres": "Name must be at least 2 characters",
"Descripción": "Bio",
"Cuéntanos sobre ti...": "Tell us about yourself...",
"Puedes incluir tus intereses, profesión, o lo que te apasiona del mundo crypto y blockchain.": "You can include your interests, profession, or what you're passionate about in the crypto and blockchain world.",
"Describe brevemente quién eres y qué te interesa": "Briefly describe who you are and what interests you",

// === CAMBIO DE CREDENCIALES ===
"Cambiar Email": "Change Email",
"Email actual:": "Current email:",
"Puedes cambiar tu email actual. Se enviará un código de verificación al nuevo email para confirmar el cambio.": "You can change your current email. A verification code will be sent to the new email to confirm the change.",
"Cambiar Contraseña": "Change Password",
"Actualiza tu contraseña para mantener tu cuenta segura. Necesitarás tu contraseña actual para confirmar el cambio.": "Update your password to keep your account secure. You'll need your current password to confirm the change.",

// === MODAL DE REGISTRO DE EMAIL ===
"Email": "Email",
"tu@email.com": "your@email.com",
"Contraseña": "Password",
"Mínimo 8 caracteres": "Minimum 8 characters",
"Confirmar Contraseña": "Confirm Password",
"Repite tu contraseña": "Repeat your password",
"Cancelar": "Cancel",
"Registrar": "Register",
"Ingresa tu nuevo email y confirma con tu contraseña": "Enter your new email and confirm with your password",
"Nuevo Email": "New Email",
"nuevo@email.com": "new@email.com",
"Contraseña Actual": "Current Password",
"Tu contraseña actual": "Your current password",
"Repite tu contraseña actual": "Repeat your current password",
"Se enviará un email de confirmación a tu nuevo correo. Deberás hacer clic en el enlace para completar el cambio.": "A confirmation email will be sent to your new address. You must click the link to complete the change.",
"Actualiza tu contraseña de acceso": "Update your access password",
"Nueva Contraseña": "New Password",
"Confirmar Nueva Contraseña": "Confirm New Password",
"Repite tu nueva contraseña": "Repeat your new password",
"La contraseña se actualizará inmediatamente después de confirmar.": "Password will be updated immediately after confirmation.",
"Este es tu email actual registrado": "This is your currently registered email",

// === BOTONES DE ACCIÓN ===
"Guardar Cambios": "Save Changes",
"Perfil actualizado correctamente": "Profile updated successfully",
"Cambios sin Guardar": "Unsaved Changes",
"Tienes cambios sin guardar en tu perfil. ¿Estás seguro de que quieres salir sin guardar?": "You have unsaved changes in your profile. Are you sure you want to exit without saving?",
"Seguir Editando": "Continue Editing",
"Salir sin Guardar": "Exit Without Saving",

// === BANNER DE NOTIFICACIONES ===
"Activa las Notificaciones": "Enable Notifications",
"Recibe alertas de likes, comentarios, nuevos seguidores y más": "Receive alerts for likes, comments, new followers and more",
"Ahora No": "Not Now",
"Activar": "Enable",
"Activando...": "Enabling...",
"Permisos denegados. Puedes activarlos desde la configuración del navegador.": "Permissions denied. You can enable them from browser settings.",

// === MENSAJES DE CONFIRMACIÓN ===
"Desactivar Notificaciones": "Disable Notifications",
"¿Estás seguro de que quieres desactivar las notificaciones push? Dejarás de recibir alertas en tiempo real.": "Are you sure you want to disable push notifications? You will stop receiving real-time alerts.",
"Desactivar": "Disable",
"Desactivando...": "Disabling...",

// === MENSAJES DE ERROR ===
"Debes iniciar sesión para editar tu perfil": "You must log in to edit your profile",
"Error al cargar el perfil": "Error loading profile",
"Error al cargar los datos del perfil": "Error loading profile data",
"Por favor selecciona un archivo de imagen válido": "Please select a valid image file",
"La imagen es demasiado grande. El tamaño máximo es 5MB": "Image is too large. Maximum size is 5MB",
"Error al actualizar perfil": "Error updating profile",
"Error al guardar los cambios:": "Error saving changes:",
"Error vinculando wallet:": "Error linking wallet:",
"ProtonWebSDK no está disponible": "ProtonWebSDK is not available",
"No se pudo obtener la sesión de Proton": "Could not get Proton session",
"Error al vincular wallet": "Error linking wallet",

// === REGISTRO DE EMAIL ===
"❌ Error: Formulario no encontrado": "❌ Error: Form not found",
"❌ Por favor ingresa un email válido": "❌ Please enter a valid email",
"❌ La contraseña debe tener al menos 8 caracteres": "❌ Password must be at least 8 characters",
"❌ Las contraseñas no coinciden": "❌ Passwords do not match",
"❌ Error: No se pudo obtener el usuario actual": "❌ Error: Could not get current user",
"Registrando...": "Registering...",
"✅ Email registrado exitosamente. Revisa tu bandeja de entrada.": "✅ Email registered successfully. Check your inbox.",
"❌ Error al registrar email": "❌ Error registering email",
"❌ Email inválido": "❌ Invalid email",
"✅ Email válido": "✅ Valid email",
"❌ Mínimo 8 caracteres": "❌ Minimum 8 characters",
"✅ Contraseña válida": "✅ Valid password",
"✅ Las contraseñas coinciden": "✅ Passwords match",
"❌ Error: No se encontró el email registrado": "❌ Error: Registered email not found",
"Enviando...": "Sending...",
"✅ Código reenviado. Revisa tu bandeja de entrada.": "✅ Code resent. Check your inbox.",
"Límite Alcanzado": "Limit Reached",
"Reenviar Código": "Resend Code",

// === CAMBIO DE EMAIL ===
"Cambiar Email": "Change Email",
"Cambiar Contraseña": "Change Password",
"❌ Por favor ingresa un email válido": "❌ Please enter a valid email",
"❌ La contraseña debe tener al menos 8 caracteres": "❌ Password must be at least 8 characters",
"❌ Las contraseñas no coinciden": "❌ Passwords do not match",
"❌ Email inválido": "❌ Invalid email",
"✅ Email válido": "✅ Valid email",
"✅ Las contraseñas coinciden": "✅ Passwords match",
"❌ Error al cambiar email": "❌ Error changing email",
"❌ Error al cambiar contraseña": "❌ Error changing password",
"Límite Alcanzado": "Limit Reached",
"❌ Error al obtener el email del usuario": "❌ Error getting user email",
"❌ Error al cargar los datos": "❌ Error loading data",
"❌ Email requerido": "❌ Email required",
"❌ La contraseña actual debe tener al menos 8 caracteres": "❌ Current password must be at least 8 characters",
"❌ La nueva contraseña debe tener al menos 8 caracteres": "❌ New password must be at least 8 characters",
"❌ Las contraseñas nuevas no coinciden": "❌ New passwords do not match",
"❌ Mínimo 8 caracteres": "❌ Minimum 8 characters",
"✅ Contraseña válida": "✅ Valid password",

// === NOTIFICACIONES PUSH ===
"⚠️ Push notifications no soportadas en este navegador": "⚠️ Push notifications not supported in this browser",
"❌ Notificaciones no soportadas": "❌ Notifications not supported",
"🔔 Solicitando permisos de notificación...": "🔔 Requesting notification permissions...",
"✅ Permiso de notificaciones concedido": "✅ Notification permission granted",
"✅ Token obtenido y guardado": "✅ Token obtained and saved",
"❌ No se pudo obtener token": "❌ Could not obtain token",
"❌ Permiso de notificaciones denegado": "❌ Notification permission denied",
"❌ Error solicitando permiso:": "❌ Error requesting permission:",
"❌ No se pudo inicializar Firebase": "❌ Could not initialize Firebase",
"🔑 Token FCM obtenido:": "🔑 FCM token obtained:",
"⚠️ No se pudo obtener token": "⚠️ Could not obtain token",
"❌ Error obteniendo token:": "❌ Error obtaining token:",
"✅ Token guardado en el servidor": "✅ Token saved on server",
"❌ Error guardando token:": "❌ Error saving token:",
"❌ Error en saveToken:": "❌ Error in saveToken:",
"ChainFeed": "ChainFeed",
"🔕 Desactivando notificaciones...": "🔕 Disabling notifications...",
"⚠️ No hay token para eliminar": "⚠️ No token to delete",
"✅ Notificaciones desactivadas correctamente": "✅ Notifications disabled successfully",
"❌ Error desactivando notificaciones:": "❌ Error disabling notifications:",
"❌ Error en disableNotifications:": "❌ Error in disableNotifications:",
"💾 Guardando estado en BD - Enabled:": "💾 Saving state to DB - Enabled:",
"Token:": "Token:",
"SI": "YES",
"NO": "NO",
"✅ Estado guardado en BD exitosamente": "✅ State saved to DB successfully",
"❌ Error guardando estado en BD:": "❌ Error saving state to DB:",
"❌ Error en saveNotificationStateToDB:": "❌ Error in saveNotificationStateToDB:",
"🔍 Cargando estado desde BD...": "🔍 Loading state from DB...",
"📊 Estado desde BD - Enabled:": "📊 State from DB - Enabled:",
"✅ localStorage sincronizado: ACTIVADO": "✅ localStorage synced: ENABLED",
"✅ localStorage sincronizado: DESACTIVADO": "✅ localStorage synced: DISABLED",
"⚠️ No se pudo obtener estado desde BD": "⚠️ Could not get state from DB",
"❌ Error en loadNotificationStateFromDB:": "❌ Error in loadNotificationStateFromDB:",
"❌ Error inicializando Firebase:": "❌ Error initializing Firebase:",
"📩 Mensaje recibido (app abierta):": "📩 Message received (app open):",

"Nuevos likes": "New likes",
"Likes en tus comentarios": "Likes on your comments",
"Nuevos comentarios": "New comments",
"Respuestas a tus comentarios": "Replies to your comments",
"Reposts": "Reposts",
"Te mencionaron": "You were mentioned",
"Nuevos seguidores": "New followers",
"Nuevas participaciones": "New participations",
"Likes en tu participación": "Likes on your participation",
"Actividad reciente": "Recent activity",
"Tienes": "You have",
"nuevas notificaciones": "new notifications",
"dio like a tu publicación": "liked your post",
"dio like a": "liked",
"de tus publicaciones": "of your posts",
"tu comentario": "your comment",
"de tus comentarios": "of your comments",
"comentó": "commented",
"en tu publicación": "on your post",
"veces en tus publicaciones": "times on your posts",
"respondió": "replied",
"veces": "times",
"a tu comentario": "to your comment",
"reposteó": "reposted",
"te mencionó": "mentioned you",
"comenzó a seguirte": "started following you",
"participó en tu Chain Event": "participated in your Chain Event",
"participaciones": "participations",
"dio like a tu participación": "liked your participation",
"likes": "likes",
"y": "and",
"más": "more",

  "No hay eventos de este tipo": "No events of this type",
  "Intenta con otro filtro": "Try another filter",
  "Cargando  posts..": "Loading posts...",

  "Sin participaciones aprobadas": "No approved participations",
  "Aún no hay participaciones aprobadas en este evento. Vuelve más tarde.": "No approved participations in this event yet. Check back later.",
  
  "💎 Recompensa:": "💎 Reward:",
"🏆 Ganadores:": "🏆 Winners:",
"👥 Participantes actuales:": "👥 Current participants:",
"📄 Tipo de respuesta:": "📄 Response type:",

 "📝 Tu reporte será revisado por nuestro equipo": "📝 Your report will be reviewed by our team",
 
 // Modal de Compra Directa CFT
'Comprar CFT Directamente': 'Buy CFT Directly',
'Precio fijo: $0.01 por CFT': 'Fixed price: $0.01 per CFT',
'Pago en USDT': 'Pay with USDT',
'Pago en USDC': 'Pay with USDC',
'Tarjeta o PayPal': 'Card or PayPal',
'Pago en tu moneda local': 'Pay in your local currency',
'Los precios están en USD, pero puedes pagar con tu moneda local. PayPal aplicará automáticamente su tipo de cambio al procesar el pago.': 'Prices are in USD, but you can pay with your local currency. PayPal will automatically apply its exchange rate when processing payment.',
'Monto a invertir': 'Amount to invest',
'Mínimo': 'Minimum',
'Máximo': 'Maximum',
'Recibirás': "You'll receive",
'Sin comisiones adicionales': 'No additional fees',
'Precio por CFT:': 'Price per CFT:',
'Total CFT:': 'Total CFT:',
'Compra directa a la plataforma': 'Direct purchase from platform',
'Comprar CFT': 'Buy CFT',

// Estados del botón de compra
'Conectando Proton Wallet...': 'Connecting Proton Wallet...',
'Verificando wallet...': 'Verifying wallet...',
'Esperando confirmación en tu wallet...': 'Waiting for confirmation in your wallet...',
'Registrando compra...': 'Registering purchase...',
'¡Compra Exitosa!': 'Purchase Successful!',
'Creando orden de pago...': 'Creating payment order...',
'Redirigiendo a PayPal...': 'Redirecting to PayPal...',
'Esperando pago en PayPal...': 'Waiting for PayPal payment...',
'Confirmando pago...': 'Confirming payment...',
'Procesando tu pago de PayPal...': 'Processing your PayPal payment...',
'Pago cancelado': 'Payment cancelled',

// Errores
'No se pudo conectar con Proton Wallet': 'Could not connect to Proton Wallet',
'No se pudo obtener sesión de Proton': 'Could not get Proton session',
'No se pudo obtener Transaction ID': 'Could not get Transaction ID',
'ProtonWebSDK no está cargado': 'ProtonWebSDK is not loaded',
'Respuesta inválida del servidor': 'Invalid server response',
'Error en el servidor': 'Server error',
'Error creando orden': 'Error creating order',
'Por favor habilita ventanas emergentes para pagar con PayPal': 'Please enable pop-ups to pay with PayPal',
'Pago cancelado o no completado': 'Payment cancelled or not completed',
'Error verificando estado del pago': 'Error verifying payment status',
'Tiempo de espera agotado': 'Timeout expired',
'Error al procesar la compra. ': 'Error processing purchase. ',
'Transacción cancelada por el usuario.': 'Transaction cancelled by user.',
'Error desconocido.': 'Unknown error.',
'Error procesando pago con PayPal': 'Error processing PayPal payment',
'Error capturando pago': 'Error capturing payment',

// === MODAL DE COMPRA P2P ===
"Cantidad a comprar (CFT)": "Amount to buy (CFT)",
"Disponible:": "Available:",
"Precio unitario:": "Unit price:",
"Total a pagar:": "Total to pay:",
"* Sin comisión para el comprador": "* No fees for buyer",
"Pago Seguro con Proton Wallet": "Secure Payment with Proton Wallet",
"operaciones": "trades",

// Botones y estados
"🔗 Conectar Wallet y Comprar": "🔗 Connect Wallet & Buy",
"¡Compra Exitosa!": "Purchase Successful!",
"Cargando oferta...": "Loading offer...",
"Conectando Proton Wallet...": "Connecting Proton Wallet...",
"Esperando confirmación en tu wallet...": "Waiting for wallet confirmation...",
"Completando compra...": "Completing purchase...",

// Errores
"Ingresa una cantidad válida": "Enter a valid amount",
"Error cargando oferta": "Error loading offer",
"Oferta no encontrada": "Offer not found",
"Error al abrir modal": "Error opening modal",
"Transacción cancelada por el usuario.": "Transaction cancelled by user.",
"Error al procesar la compra.": "Error processing purchase.",
 "hacia": "to",
 // === ERRORES P2P ===
"Error al procesar la compra.": "Error processing purchase.",
"No se pudo conectar:": "Could not connect:",
"No se pudo obtener sesión de Proton": "Could not get Proton session",
"ProtonWebSDK no está cargado": "ProtonWebSDK is not loaded",
"No se pudo conectar con Proton Wallet": "Could not connect to Proton Wallet",
"Oferta no encontrada": "Offer not found",
"Saldo insuficiente.": "Insufficient balance.",
"Disponible:": "Available:",
"Requerido:": "Required:",
"Transacción cancelada por el usuario": "Transaction cancelled by user",
"Transacción cancelada por el usuario.": "Transaction cancelled by user.",
"No se pudo obtener Transaction ID": "Could not get Transaction ID",
"Error en transacción:": "Transaction error:",
"Respuesta inválida del servidor": "Invalid server response",
"Error registrando compra:": "Error registering purchase:",
"Error desconocido.": "Unknown error.",
"No se pudo verificar saldo en ningún endpoint": "Could not verify balance on any endpoint",
"Error verificando wallet": "Error verifying wallet",
"⚠️ Wallet incorrecta detectada!": "⚠️ Wrong wallet detected!",
"Tu cuenta registrada:": "Your registered account:",
"Wallet que conectaste:": "Connected wallet:",
"Por favor cierra tu Proton Wallet y vuelve a conectar con": "Please close your Proton Wallet and reconnect with",

// En translations.en
"No se pudo obtener sesión de Proton": "Could not get Proton session",
"No se pudo conectar: No se pudo obtener sesión de Proton": "Could not connect: Could not get Proton session",
"✅ Sesión cerrada correctamente": "✅ Logged out successfully",

"✨ Evento Campaña seleccionado": "✨ Campaign event selected",
"✨ Poll event selected": "✨ Poll event selected", 
"✨ Audio event selected": "✨ Audio event selected",

  "Sin participaciones aún": "No participations yet",
  "Cuando los usuarios participen en tu evento, aparecerán aquí para que las revises": "When users participate in your event, they will appear here for you to review",
  "Error verificando primera compra:": "Error checking first purchase:",

// Textos del modal principal
"Comprar CFT Directamente": "Buy CFT Directly",
"Precio fijo: $0.01 por CFT": "Fixed price: $0.01 per CFT",

// Pestañas de moneda
"Pago en USDT": "Pay with USDT",
"Pago en USDC": "Pay with USDC",
"Tarjeta o PayPal": "Card or PayPal",

// Aviso de PayPal
"Pago en tu moneda local": "Pay in your local currency",
"Los precios están en USD, pero puedes pagar con tu moneda local. PayPal aplicará automáticamente su tipo de cambio al procesar el pago.": "Prices are in USD, but you can pay with your local currency. PayPal will automatically apply its exchange rate when processing the payment.",

// Input de monto
"Monto a invertir": "Amount to invest",
"Mínimo: $5 • Máximo: $100,000": "Minimum: $5 • Maximum: $100,000",

// Resultado de conversión
"Recibirás": "You will receive",
"Sin comisiones adicionales": "No additional fees",

// Información de compra
"Precio por CFT:": "Price per CFT:",
"Total CFT:": "Total CFT:",
"Compra directa a la plataforma": "Direct purchase from the platform",

// Botón principal
"Comprar CFT": "Buy CFT",
"¡Compra Exitosa!": "Purchase Successful!",

// Estados de procesamiento
"Conectando Proton Wallet...": "Connecting Proton Wallet...",
"Verificando wallet...": "Verifying wallet...",
"Esperando confirmación en tu wallet...": "Waiting for confirmation in your wallet...",
"Registrando compra...": "Registering purchase...",

// PayPal
"Creando orden de pago...": "Creating payment order...",
"Redirigiendo a PayPal...": "Redirecting to PayPal...",
"⏳ Esperando pago en PayPal...": "⏳ Waiting for PayPal payment...",
"Confirmando pago...": "Confirming payment...",
"Procesando tu pago de PayPal...": "Processing your PayPal payment...",

// Mensajes de éxito
"¡Compra exitosa! Recibiste {amount} CFT": "Purchase successful! You received {amount} CFT",
"¡Pago completado! Recibiste {amount} CFT": "Payment completed! You received {amount} CFT",

// Mensajes de error y validación
"El monto mínimo para tu primera compra es ${amount} USD": "The minimum amount for your first purchase is ${amount} USD",
"El monto mínimo es ${amount} USD": "The minimum amount is ${amount} USD",
"El monto máximo es $100,000": "The maximum amount is $100,000",
"No se pudo conectar con Proton Wallet": "Could not connect to Proton Wallet",
"No se pudo obtener sesión de Proton": "Could not get Proton session",
"ProtonWebSDK no está cargado": "ProtonWebSDK is not loaded",
"No se pudo obtener Transaction ID": "Could not get Transaction ID",
"Respuesta inválida del servidor": "Invalid server response",
"Error en el servidor": "Server error",

// Error de wallet incorrecta
"⚠️ Wallet incorrecta!": "⚠️ Wrong wallet!",
"Tu cuenta: @{wallet}": "Your account: @{wallet}",
"Wallet conectada: @{wallet}": "Connected wallet: @{wallet}",
"Por favor conecta con @{wallet}": "Please connect with @{wallet}",

// Errores de transacción
"Error al procesar la compra.": "Error processing purchase.",
"Transacción cancelada por el usuario.": "Transaction cancelled by user.",
"Saldo insuficiente de {currency} en tu wallet.": "Insufficient {currency} balance in your wallet.",
"Error desconocido.": "Unknown error.",

// Errores PayPal
"Por favor habilita ventanas emergentes para pagar con PayPal": "Please enable pop-ups to pay with PayPal",
"Error creando orden": "Error creating order",
"Pago cancelado o no completado": "Payment cancelled or not completed",
"Error verificando estado del pago": "Error checking payment status",
"Tiempo de espera agotado": "Timeout expired",
"Pago cancelado": "Payment cancelled",
"Error procesando pago con PayPal": "Error processing PayPal payment",
"Error procesando pago:": "Error processing payment:",
"Error capturando pago": "Error capturing payment",

// Memo de blockchain
"ChainFeed Direct Purchase - $0.01 per CFT": "ChainFeed Direct Purchase - $0.01 per CFT",

// Logs de consola (opcionales, para debugging)
"💰 Sistema de Compra Directa CFT iniciado": "💰 CFT Direct Purchase System started",
"💎 Modal de compra directa abierto": "💎 Direct purchase modal opened",
"💎 Modal de compra directa cerrado": "💎 Direct purchase modal closed",
"🔍 Verificando estado de primera compra...": "🔍 Checking first purchase status...",
"✨ Sistema de compra directa CFT cargado": "✨ CFT direct purchase system loaded",

  "📜 Términos y Condiciones": "📜 Terms and Conditions",
  "Términos y Condiciones de ChainFeed": "ChainFeed Terms and Conditions",
  "Última actualización:": "Last updated:",
  "Diciembre 2025": "December 2025",
  "1. Aceptación de Términos": "1. Acceptance of Terms",
  "Al registrarte y utilizar ChainFeed, aceptás cumplir con estos términos y condiciones.": "By registering and using ChainFeed, you agree to comply with these terms and conditions.",
  "2. Requisitos de Uso": "2. Usage Requirements",
  "Ser mayor de 18 años": "Be at least 18 years old",
  "Proporcionar información veraz": "Provide truthful information",
  "Mantener la seguridad de tu cuenta": "Maintain the security of your account",
  "3. Tokens CFT": "3. CFT Tokens",
  "Los tokens CFT son de utilidad dentro de la plataforma. No constituyen inversiones ni garantizan retornos.": "CFT tokens are for utility within the platform. They do not constitute investments nor guarantee returns.",
  "4. Conducta Prohibida": "4. Prohibited Conduct",
  "Contenido ilegal u ofensivo": "Illegal or offensive content",
  "Spam o phishing": "Spam or phishing",
  "Manipular el sistema de recompensas": "Manipulating the reward system",
  "Múltiples cuentas": "Multiple accounts",
  "5. Suspensión": "5. Suspension",
  "ChainFeed puede suspender cuentas que violen estos términos.": "ChainFeed may suspend accounts that violate these terms.",
  "He leído y acepto los Términos y Condiciones": "I have read and accept the Terms and Conditions",
  "Continuar a ChainFeed": "Continue to ChainFeed",
  "Procesando...": "Processing...",
  
    "Descargar Whitepaper": "Download Whitepaper",
  "Selecciona el idioma de tu preferencia": "Select your preferred language",
  "Español": "Spanish",

  "Características": "Features",
  "Tokenomics": "Tokenomics",
  "Whitepaper": "Whitepaper",
  "Conectate": "Connect",
  "🚀 Ingresa para Comenzar": "🚀 Get Started Now",
  "Gana tokens desde<br>tu primer like": "Earn tokens from<br>your first like",
  "La red social que recompensa cada interacción.": "The social network that rewards every interaction.",
  "Conectate a Chainfeed": "Connect to Chainfeed",
  "Ver Whitepaper": "View Whitepaper",
  "Tokens Otorgados": "Tokens Distributed",
  "Usuarios Activos": "Active Users",
  "nuevos en 7 días": "new in 7 days",
  "Conecta tu wallet para obtenerlos": "Connect your wallet to get them",
  "🚀 Reclama tus 50 CFT!": "🚀 Claim your 50 CFT!",
  "Tus tokens CFT": "Your CFT tokens",
  "Cargando...": "Loading...",
  "Recompensas automáticas por cada acción": "Automatic rewards for every action",
  "Publica contenido, recibe likes, comenta y gana tokens CFT instantáneamente. Sin umbrales de seguidores, sin aprobaciones. Tu actividad se monetiza desde el día 1.": "Post content, receive likes, comment and earn CFT tokens instantly. No follower thresholds, no approvals. Your activity is monetized from day 1.",
  "Descubrir Más": "Discover More",
  "Gana por Publicar": "Earn by Posting",
  "3-7 CFT por post": "3-7 CFT per post",
  "Gana por Likes": "Earn from Likes",
  "1 CFT por cada like recibido": "1 CFT per like received",
  "Gana por Comentarios": "Earn from Comments",
  "1 CFT por interacción": "1 CFT per interaction",
  "Marketplace y eventos gamificados": "Marketplace and gamified events",
  "Vende tu contenido directamente sin intermediarios. Crea encuestas recompensadas, campañas creativas y desafíos de audio. Los usuarios ganan, tú decides cuánto.": "Sell your content directly without intermediaries. Create rewarded polls, creative campaigns and audio challenges. Users earn, you decide how much.",
  "Explorar Marketplace": "Explore Marketplace",
  "Vende tu Contenido": "Sell your Content",
  "Comisión solo 10%": "Only 10% commission",
  "Sistema Chain": "Chain System",
  "Polls, campaigns y audio": "Polls, campaigns and audio",
  "Promociona Posts": "Promote Posts",
  "Desde 50 CFT/día": "From 50 CFT/day",
  "Tokens a distribuir": "Tokens to distribute",
  "Tokens para preventa": "Tokens for presale",
  "Bonus Preventa": "Presale Bonus",
  "Gas en transacciones": "Gas in transactions",
  "Únete a la revolución": "Join the revolution",
  "No pierdas esta oportunidad única de ser parte del futuro de las redes sociales descentralizadas.": "Don't miss this unique opportunity to be part of the future of decentralized social networks.",
  "Conectate a ChainFeed": "Connect to ChainFeed",
  "⚡ ChainFeed": "⚡ ChainFeed",
  "La primera red social completamente descentralizada y tokenizada.": "The first fully decentralized and tokenized social network.",
  "Producto": "Product",
  "Roadmap": "Roadmap",
  "Recursos": "Resources",
  "Documentación": "Documentation",
  "Ayuda": "Help",
  "Blog": "Blog",
  "FAQ": "FAQ",
  "Legal": "Legal",
  "Términos": "Terms",
  "Privacidad": "Privacy",
  "Disclaimer": "Disclaimer",
  "KYC/AML": "KYC/AML",
  "© 2025 ChainFeed. Todos los derechos reservados.": "© 2025 ChainFeed. All rights reserved.",
  "Descargar Whitepaper": "Download Whitepaper",
  "Selecciona el idioma de tu preferencia": "Select your preferred language",
  "Español": "Spanish",
  "English": "English",
  "Perfil": "Profile",
  "Ver inicio": "View Home",
  "Mi Perfil": "My Profile",
  "Conectando...": "Connecting...",
  "✅ ¡Conectado!": "✅ Connected!",
  "❌ Error de conexión": "❌ Connection error",
  "Sesión cerrada correctamente": "Session closed successfully",
  "Error al conectar con Proton Wallet. Verifica que esté instalado y configurado.": "Error connecting to Proton Wallet. Check that it is installed and configured.",
  "¿Cómo quieres conectarte?": "How do you want to connect?",
  "Elige tu método de autenticación": "Choose your authentication method",
  "Email y Contraseña": "Email and Password",
  "Login tradicional y rápido": "Traditional and fast login",
  "Wallet WebAuth": "WebAuth Wallet",
  "Proton WebAuthn (Blockchain)": "Proton WebAuthn (Blockchain)",
  "Volver": "Back",
  "← Volver": "← Back",
  "← Volver al Login": "← Back to Login",
  "Iniciar Sesión": "Sign In",
  "Ingresa con tu email": "Enter with your email",
  "Email": "Email",
  "Contraseña": "Password",
  "Por favor completa todos los campos": "Please complete all fields",
  "Crear Cuenta": "Create Account",
  "Regístrate con email": "Sign up with email",
  "Username": "Username",
  "Solo letras, números y guiones bajos": "Only letters, numbers and underscores",
  "Mínimo 8 caracteres": "Minimum 8 characters",
  "¿Ya tienes cuenta? Inicia sesión": "Already have an account? Sign in",
  "📝 ¿No tienes cuenta? Regístrate": "📝 Don't have an account? Sign up",
  "Recuperar Contraseña": "Recover Password",
  "Te enviaremos un enlace seguro a tu email": "We'll send you a secure link to your email",
  "Email Registrado": "Registered Email",
  "Enviar Enlace de Recuperación": "Send Recovery Link",
  "Nueva Contraseña": "New Password",
  "Crea una contraseña segura para tu cuenta": "Create a secure password for your account",
  "Confirmar Contraseña": "Confirm Password",
  "❌ Las contraseñas no coinciden": "❌ Passwords do not match",
  "Cambiar Contraseña": "Change Password",
  "¿Olvidaste tu Email?": "Forgot your Email?",
  "Verifica tu identidad para recuperar tu email": "Verify your identity to recover your email",
  "El username que usaste al registrarte": "The username you used when registering",
  "Tu contraseña actual para verificar tu identidad": "Your current password to verify your identity",
  "Recuperar Email": "Recover Email",
  "🔒 Por seguridad, necesitamos verificar que eres tú": "🔒 For security, we need to verify it's you",
  "¡Email Recuperado!": "Email Recovered!",
  "Tu email registrado es:": "Your registered email is:",
  "📧 También te hemos enviado una copia a tu bandeja de entrada": "📧 We've also sent a copy to your inbox",
  "Ir al Login": "Go to Login",
  "Cuenta bloqueada": "Account locked",
  "Intenta nuevamente en": "Try again in",
  "Cuenta desbloqueada": "Account unlocked",
  "Ya puedes intentar iniciar sesión": "You can now try to sign in",
  "Iniciando sesión...": "Signing in...",
  "⚠️ Último intento antes del bloqueo": "⚠️ Last attempt before lockout",
  "Credenciales incorrectas": "Incorrect credentials",
  "Error de conexión. Intenta nuevamente": "Connection error. Try again",
  "🎉 ¡Registro exitoso!": "🎉 Registration successful!",
  "✅ Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.": "✅ Account created successfully. Check your email to verify your account.",
  "Error al crear cuenta": "Error creating account",
  "Creando cuenta...": "Creating account...",
  "🔒 ¿Olvidaste tu contraseña?": "🔒 Forgot your password?",
  "📧 ¿Olvidaste tu email?": "📧 Forgot your email?",
  "✅ Te hemos enviado un email con las instrucciones para recuperar tu contraseña. Revisa tu bandeja de entrada.": "✅ We've sent you an email with instructions to recover your password. Check your inbox.",
  "Error al enviar el email de recuperación": "Error sending recovery email",
  "Enviando...": "Sending...",
  "✅ Contraseña actualizada": "✅ Password updated",
  "Ya puedes iniciar sesión con tu nueva contraseña.": "You can now sign in with your new password.",
  "Error al cambiar la contraseña": "Error changing password",
  "Cambiando contraseña...": "Changing password...",
  "Por favor ingresa tu email": "Please enter your email",
  "Por favor ingresa tu contraseña": "Please enter your password",
  "Por favor ingresa tu username": "Please enter your username",
  "Username inválido. Solo letras, números y guiones bajos": "Invalid username. Only letters, numbers and underscores",
  "La contraseña debe tener al menos 8 caracteres": "Password must be at least 8 characters",
  "Error del servidor. Intenta nuevamente.": "Server error. Try again.",
  "Verificando...": "Verifying...",
  "Tu código de referido": "Your referral code",
  "referidos": "referrals",
  "¿Tienes un código?": "Have a code?",
  "CÓDIGO": "CODE",
  "Ambos reciben": "Both receive",
  "⚠️ Código aún no disponible": "⚠️ Code not yet available",
  "ChainFeed Token - Código de Referido": "ChainFeed Token - Referral Code",
  "🚀 ¡Únete a ChainFeed con mi código de referido y obtén 15 CFT gratis!": "🚀 Join ChainFeed with my referral code and get 15 CFT free!",
  "Código:": "Code:",
  "¡Ambos recibiremos tokens al registrarte!": "We'll both receive tokens when you register!",
  "📋 Código copiado al portapapeles": "📋 Code copied to clipboard",
  "⚠️ Por favor ingresa un código": "⚠️ Please enter a code",
  "⚠️ El código debe tener al menos 5 caracteres": "⚠️ Code must be at least 5 characters",
  "❌ No puedes usar tu propio código": "❌ You can't use your own code",
  "❌ Código inválido": "❌ Invalid code",
  "❌ Error de conexión. Intenta de nuevo.": "❌ Connection error. Try again.",
  "🎯 Redirigiendo a Solución en Whitepaper...": "🎯 Redirecting to Solution in Whitepaper...",
  "🛒 Redirigiendo a Casos de Uso en Whitepaper...": "🛒 Redirecting to Use Cases in Whitepaper...",
  "⚠️ No se pudo compartir. Copia manualmente:": "⚠️ Could not share. Copy manually:",
  
    "Intentos restantes:": "Attempts remaining:",
  "Registrar Email": "Register Email",
  "Vincula un email para acceder con contraseña": "Link an email to access with password",
  "Email": "Email",
  "tu@email.com": "your@email.com",
  "Contraseña": "Password",
  "Mínimo 8 caracteres": "Minimum 8 characters",
  "Confirmar Contraseña": "Confirm Password",
  "Repite tu contraseña": "Repeat your password",
  "Cancelar": "Cancel",
  "Registrar": "Register",
  "❌ Email inválido": "❌ Invalid email",
  "✅ Email válido": "✅ Valid email",
  "❌ Mínimo 8 caracteres": "❌ Minimum 8 characters",
  "✅ Contraseña válida": "✅ Valid password",
  "❌ Las contraseñas no coinciden": "❌ Passwords do not match",
  "✅ Las contraseñas coinciden": "✅ Passwords match",
  "❌ Error: Formulario no encontrado": "❌ Error: Form not found",
  "❌ Por favor ingresa un email válido": "❌ Please enter a valid email",
  "❌ La contraseña debe tener al menos 8 caracteres": "❌ Password must be at least 8 characters",
  "❌ Las contraseñas no coinciden": "❌ Passwords do not match",
  "❌ Error: No se pudo obtener el usuario actual": "❌ Error: Could not get current user",
  "Registrando...": "Registering...",
  "✅ Email registrado exitosamente. Revisa tu bandeja de entrada.": "✅ Email registered successfully. Check your inbox.",
  "Error al registrar email": "Error registering email",
  "❌ Error: No se encontró el email registrado": "❌ Error: Registered email not found",
  "Enviando...": "Sending...",
  "✅ Código reenviado. Revisa tu bandeja de entrada.": "✅ Code resent. Check your inbox.",
  "⏳ Debes esperar": "⏳ You must wait",
  "minuto(s) antes de reenviar": "minute(s) before resending",
  "❌ Error al reenviar código": "❌ Error resending code",
  "Reenviar Código": "Resend Code",
  "Espera": "Wait",
  "Límite Alcanzado": "Limit Reached",
  
  "✅ ¡Ahora sigues a este usuario!": "✅ You now follow this user!",
  "❌ Error procesar seguimiento: Ya sigues a este usuario": "❌ Error processing follow: You already follow this user",
  
    "Tu colección está vacía": "Your collection is empty",
  "Aún no has comprado ningún post. Explora el Market para adquirir contenido exclusivo.": "You haven't bought any posts yet. Explore the Market to acquire exclusive content.",
  
  
    "Tu contenido tiene valor": "Your content has value",
  "Gana tokens por cada publicación, like y comentario. Sin umbrales mínimos, sin intermediarios.": "Earn tokens for every post, like and comment. No minimum thresholds, no intermediaries.",
  "La red social Web3": "The Web3 social network",
  "Conecta tu wallet para obtener tokens": "Connect your wallet to get tokens",
  "Reclama tus 50 CFT": "Claim your 50 CFT",
  "Funcionalidades": "Features",
  "Todo lo que necesitas": "Everything you need",
  "Una plataforma completa donde cada interacción genera recompensas reales.": "A complete platform where every interaction generates real rewards.",
  "Comparte contenido original y recibe tokens automáticamente por cada post que creas. Sin necesidad de miles de seguidores para comenzar a monetizar.": "Share original content and automatically receive tokens for every post you create. No need for thousands of followers to start monetizing.",
  "Cada like que recibes se convierte directamente en tokens para ti. Entre más engagement generas, más ganas.": "Every like you receive directly converts into tokens for you. The more engagement you generate, the more you earn.",
  "Participa en conversaciones y genera valor con cada interacción. Las conversaciones tienen valor real en ChainFeed.": "Participate in conversations and generate value with every interaction. Conversations have real value on ChainFeed.",
  "Vende contenido exclusivo, servicios o productos directamente a tu audiencia sin intermediarios tradicionales.": "Sell exclusive content, services or products directly to your audience without traditional intermediaries.",
  "Crea encuestas recompensadas, campañas creativas y desafíos de audio. Los participantes ganan, tú decides las reglas.": "Create rewarded polls, creative campaigns and audio challenges. Participants earn, you set the rules.",
  "Amplifica el alcance de tus publicaciones más importantes invirtiendo tokens. Llega a más personas.": "Amplify the reach of your most important posts by investing tokens. Reach more people.",
  "El token nativo que impulsa todo el ecosistema ChainFeed. Gana, intercambia y participa en la gobernanza.": "The native token that powers the entire ChainFeed ecosystem. Earn, trade and participate in governance.",
  "Construido sobre Proton Network": "Built on Proton Network",
  "Sin costos de transacción": "No transaction costs",
  "Distribución basada en actividad": "Activity-based distribution",
  "Preventa activa con bonus": "Active presale with bonus",
  "Bonus actual": "Current bonus",
  "Empieza a ganar hoy": "Start earning today",
  "Crea tu cuenta en menos de un minuto y comienza a monetizar tu contenido.": "Create your account in less than a minute and start monetizing your content.",
  "Crear cuenta gratis": "Create free account",
  "Conectar a ChainFeed": "Connect to ChainFeed",
  "Selecciona cómo quieres acceder": "Select how you want to access",
  "Accede con tu cuenta": "Access with your account",
  "Iniciar sesión": "Log in",
  "Ingresa tus credenciales": "Enter your credentials",
  "Continuar": "Continue",
  "Crear cuenta nueva": "Create new account",
  "Letras, números y guiones bajos": "Letters, numbers and underscores",
  "Crear cuenta": "Create account",
  "Ya tengo cuenta": "I already have an account",
  "Crear cuenta": "Create account",
  "Completa tus datos": "Complete your information",
    "Leer whitepaper": "Read whitepaper",
  "Tu contenido": "Your content",
  "tiene valor": "has value",
   "Selecciona el idioma": "Select language",
   
    "❌ Código no encontrado": "❌ Code not found",
  "Código no encontrado": "Code not found",
  "📧 Revisa tu email para verificar tu cuenta. Una vez verificado, podrás iniciar sesión.": "📧 Check your email to verify your account. Once verified, you'll be able to log in.",
  
  "✅ Contraseña actualizada": "✅ Password updated",
  "Ya puedes iniciar sesión con tu nueva contraseña.": "You can now log in with your new password.",
  "Error de conexión. Intenta nuevamente": "Connection error. Try again",
  "✅ Te hemos enviado un email con las instrucciones para recuperar tu contraseña. Revisa tu bandeja de entrada.": "✅ We've sent you an email with instructions to recover your password. Check your inbox.",
  "✅ Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta.": "✅ Account created successfully. Check your email to verify your account.",
  
  "Tu like": "Your like",
  "Tu interaccion": "Your interaction",
  "Tu like tiene valor": "Your like has value",
  "Tu interaccion tiene valor": "Your interaction has value",
  "Tu interacción tiene valor": "Your interaction has value",
  
  "Disponible en exchanges": "Available on exchanges",
  "Adquiere CFT en los principales mercados descentralizados": "Acquire CFT on major decentralized markets",
  "Disponible en Exchanges": "Available on Exchanges",
  "Acquire CFT on major decentralized markets": "Acquire CFT on major decentralized markets",
  "Descargando ChainFeed APK...": "Downloading ChainFeed APK...",
  "No puedes dar like a tu propio comentario": "You cannot like your own comment",
  
  "❌ Error procesar like: No puedes dar like a tu propia publicación": "❌ Error processing like: You cannot like your own post",
  
    "Ronda privada para inversores estratégicos": "Private round for strategic investors",
  "Contacto para inversores": "Investor contact",
  "Conecta con nosotros": "Connect with us",
  "Elige cómo contactarnos": "Choose how to contact us",
  "ChainFeed es una startup en etapa temprana con el producto ya desarrollado y operativo.": "ChainFeed is an early-stage startup with the product already developed and operational.",
  "En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en <strong>adquirir una participación en la startup, y no en la compra de tokens</strong>.": "At this stage, a private round is open for strategic investors interested in <strong>acquiring a stake in the startup, and not in purchasing tokens</strong>.",
  "Esta ronda se realiza de forma previa a cualquier preventa del token, el cual forma parte del ecosistema futuro del proyecto, pero no es el instrumento de inversión en esta etapa.": "This round takes place prior to any token presale, which is part of the project's future ecosystem, but is not the investment instrument at this stage.",
  "La participación se estructura bajo un esquema contractual claro, con foco en el crecimiento a largo plazo del proyecto y su modelo económico.": "The participation is structured under a clear contractual scheme, focused on the long-term growth of the project and its economic model.",
  
    "El correo ha sido copiado al portapapeles": "Email has been copied to clipboard",
  "Correo copiado con éxito": "Email copied successfully",
  "No se pudo copiar el email": "Could not copy email",
  
          "En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en ": 
            "Currently, a private round is open for strategic investors interested in ",
        "En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en": 
            "Currently, a private round is open for strategic investors interested in",
        
        // También asegúrate de tener esta:
        "En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en <strong>adquirir una participación en la startup, y no en la compra de tokens</strong>.": 
            "Currently, a private round is open for strategic investors interested in <strong>acquiring a stake in the startup, and not in token purchases</strong>.",
            
            "¡Únete a ChainFeed con mi código de referido y obtén 15 CFT gratis!": "Join ChainFeed with my referral code and get 15 CFT free!",
"Código:": "Code:",
"¡Ambos recibiremos tokens al registrarte!": "We'll both receive tokens when you sign up!",
"ChainFeed - Código de Referido": "ChainFeed - Referral Code",
"Código compartido exitosamente": "Code shared successfully",
"Código copiado al portapapeles": "Code copied to clipboard",
"Código aún no disponible": "Code not available yet",
"Por favor ingresa un código": "Please enter a code",
"El código debe tener al menos 5 caracteres": "Code must be at least 5 characters",
"No puedes usar tu propio código": "You cannot use your own code",
"¡Código aplicado exitosamente!": "Code applied successfully!",
"Tú y": "You and",
"recibieron": "received",
"cada uno": "each",
"Código inválido": "Invalid code",
"Error de conexión. Intenta de nuevo.": "Connection error. Try again.",

 "🔐 Confirma tu contraseña": "🔐 Confirm your password",
  "Por seguridad, confirma tu contraseña antes de comprar": "For security, confirm your password before purchasing",
  "Ingresa tu contraseña": "Enter your password",
  "Por seguridad, confirma tu contraseña antes de poner en venta": "For security, confirm your password before putting up for sale",
  "Tu cuenta fue creada con una billetera. Para confirmar acciones sensibles, primero configurá una contraseña en tu perfil.": "Your account was created with a wallet. To confirm sensitive actions, first set a password in your profile.",
  "Necesitás una contraseña": "You need a password",
  "⚙️ Ir a Editar Perfil": "⚙️ Go to Edit Profile",
  "🔐 Contraseña incorrecta": "🔐 Incorrect password",
  "🔐 Verificando... ⏳": "🔐 Verifying... ⏳",
  "🔐 Debes ingresar tu contraseña": "🔐 You must enter your password",
  "❌ Error: datos de compra no encontrados": "❌ Error: purchase data not found",
  "❌ Error poniendo en venta:": "❌ Error putting up for sale:",
  "Error al poner en venta": "Error putting up for sale",
  "⚙️ Configurá una contraseña en tu perfil primero": "⚙️ Set a password in your profile first",
  "❌ El precio debe ser al menos 1 CFT": "❌ The price must be at least 1 CFT",
  "(0 CFT - 5% comisión)": "(0 CFT - 5% commission)",
            
    // Pegar dentro de translations.en { ... } en i18n-auto-translate.js

// Hero
'🎮 Arcade ChainFeed': '🎮 ChainFeed Arcade',

// Categorías
'🌟 Todos': '🌟 All',
'Todos': 'All',
'🔥 Populares': '🔥 Popular',
'Populares': 'Popular',
'✨ Nuevos': '✨ New',
'Nuevos': 'New',
'🎯 Estrategia': '🎯 Strategy',
'Estrategia': 'Strategy',
'😊 Casual': '😊 Casual',
'⚔️ Acción': '⚔️ Action',
'Acción': 'Action',

// Badges
'Nuevo': 'New',
'Popular': 'Popular',

// Botón — con y sin espacios por si el trim falla
'🎮 Jugar Ahora': '🎮 Play Now',
'Jugar Ahora': 'Play Now',

// Stats
'Sin votos': 'No votes',

// Loading / empty
'Cargando juegos...': 'Loading games...',
'No hay juegos en esta categoría': 'No games in this category',
'Prueba con otra categoría o vuelve pronto': 'Try another category or come back soon',

// Modal
'Juego': 'Game',

// Descripciones exactas de BD
'Construye torres estratégicas y defiende tu base contra oleadas de enemigos': 'Build strategic towers and defend your base against waves of enemies',
'Juego táctico de francotirador en la jungla con recompensas CFT': 'Tactical jungle sniper game with CFT rewards',
'Excava y colecta recursos en la blockchain': 'Dig and collect resources on the blockchain',
'Clásico snake con recompensas CFT': 'Classic snake with CFT rewards',
'Gira la rueda y gana recompensas CFT': 'Spin the wheel and win CFT rewards',
'Velocidad y reflejos, corre hacia la victoria': 'Speed and reflexes, run towards victory',

  "Juega, compite y gana CFT tokens. Diviértete mientras generas recompensas en la blockchain.": "Play, compete and earn CFT tokens. Have fun while generating rewards on the blockchain.",
  "Aventura épica en las profundidades": "Epic adventure in the depths",
  "Defiende tu castillo de los invasores": "Defend your castle from invaders",
  "Construye torres estratégicas y defiende tu base con CFT tokens": "Build strategic towers and defend your base with CFT tokens",
  
    "Ir a Alcor": "Go to Alcor",
  "Ver en CoinGecko": "View on CoinGecko",
  "Ronda de Inversores": "Investor Round",
  "Entendido": "Got it",
  "CFT está disponible en los principales mercados. Intercambia sin comisiones en Alcor DEX o sigue el precio en tiempo real en CoinGecko.": "CFT is available on major markets. Trade with zero fees on Alcor DEX or track the real-time price on CoinGecko.",
  "Intercambia en": "Trade on",
  "o sigue el precio en": "or track the price on",
  "¡CFT está disponible en todas partes!": "CFT is available everywhere!",
  "¡CFT llega pronto!": "CFT coming soon!",
  "El token CFT será listado en": "The CFT token will be listed on",
  "y": "and",
  "Días": "Days",
  "⏳ CoinGecko disponible próximamente:": "⏳ CoinGecko coming soon:",
  "CFT ya está disponible en Alcor DEX. Intercambia sin comisiones de transacción, rápido y seguro.": "CFT is already available on Alcor DEX. Trade with no transaction fees, fast and secure.",
  "Prepárate para intercambiar tus tokens sin comisiones en Alcor DEX y sigue el precio en CoinGecko.": "Get ready to trade your tokens with zero fees on Alcor DEX and track the price on CoinGecko.",
  
    "Ronda de Inversores Privada": "Private Investor Round",
  "¡CFT está disponible en Alcor!": "CFT is available on Alcor!",
  "Ahora puedes intercambiar en": "Now you can trade on",
  
    "CFT se listeará en Alcor": "CFT will be listed on Alcor",
  "Próximamente en Alcor DEX": "Coming soon on Alcor DEX",
  "días restantes": "days remaining",
  "El listing está confirmado para el": "The listing is confirmed for",
  ". Sé el primero en intercambiar en Alcor DEX sin comisiones.": ". Be the first to trade on Alcor DEX with zero fees.",
  "Ronda de Inversores": "Investor Round",
  "Cerrar": "Close",
  "Próximamente en CoinGecko": "Coming soon on CoinGecko",
  "CFT se agregará a CoinGecko": "CFT will be added to CoinGecko",
  "El listado en CoinGecko está confirmado para el": "The listing on CoinGecko is confirmed for",
  ". Podrás seguir el precio y estadísticas de CFT.": ". You will be able to track CFT price and statistics.",
  
     ". Podrás seguir el precio y estadísticas de CFT.": 
        ". You will be able to track the price and statistics of CFT.",
    
    ". Sé el primero en intercambiar en Alcor DEX sin comisiones.": 
        ". Be the first to trade on Alcor DEX with no fees.",
    
    "Podrás seguir el precio y estadísticas de CFT.": 
        "You will be able to track the price and statistics of CFT.",
    
    "Sé el primero en intercambiar en Alcor DEX sin comisiones.": 
        "Be the first to trade on Alcor DEX with no fees.",
        
        
  
    }
    
  };

const translationCache = new Map();

const dynamicPatterns = [

    // ============================================
    // PATRONES PARA PROMOCIONES CON TRADUCCIÓN DE CONTENIDO
    // ============================================
    
    // "📝 Publicación • Promoción: X Día(s) (Y CFT) - Sin contenido"
    {
        pattern: /^(📝\s*)?Publicación\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*Sin\s+contenido$/i,
        replace: (match, emoji, days, cost) => `${emoji || ''}Post • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - No content`
    },
    
    // "⚡ Evento Chain • Promoción: X Día(s) (Y CFT) - Sin contenido"
    {
        pattern: /^(⚡\s*)?Evento\s+Chain\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*Sin\s+contenido$/i,
        replace: (match, emoji, days, cost) => `${emoji || ''}Chain Event • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - No content`
    },
    
    // "📝 Publicación • Promoción: X Día(s) (Y CFT) - Promoción de contenido"
    {
        pattern: /^(📝\s*)?Publicación\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*Promoción\s+de\s+contenido$/i,
        replace: (match, emoji, days, cost) => `${emoji || ''}Post • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - Content promotion`
    },
    
    // "⚡ Evento Chain • Promoción: X Día(s) (Y CFT) - Promoción de contenido"
    {
        pattern: /^(⚡\s*)?Evento\s+Chain\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*Promoción\s+de\s+contenido$/i,
        replace: (match, emoji, days, cost) => `${emoji || ''}Chain Event • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - Content promotion`
    },
    // === MENSAJES DE REPORTE/CONFIRMACIÓN ===

// "📝 Tu reporte será revisado por nuestro equipo"
{
    pattern: /^📝\s*Tu\s*reporte\s*será\s*revisado\s*por\s*nuestro\s*equipo$/i,
    replace: () => `📝 Your report will be reviewed by our team`
},

// Versión con Unicode para evitar problemas (RECOMENDADA)
{
    pattern: /^\u{1F4DD}\s*Tu\s*reporte\s*será\s*revisado\s*por\s*nuestro\s*equipo$/iu,
    replace: () => `\u{1F4DD} Your report will be reviewed by our team`
},
// "El monto mínimo es $5"
{
    pattern: /^El monto mínimo es \$(\d+(?:,\d{3})*(?:\.\d+)?)$/i,
    replace: (match, amount) => `Minimum amount is $${amount}`
},

// "El monto máximo es $100,000"
{
    pattern: /^El monto máximo es \$(\d+(?:,\d{3})*(?:\.\d+)?)$/i,
    replace: (match, amount) => `Maximum amount is $${amount}`
},
// === NOTIFICACIONES DE ERROR/VALIDACIÓN ===

// "El monto mínimo para tu primera compra es $X USD"
{
    pattern: /^El\s+monto\s+mínimo\s+para\s+tu\s+primera\s+compra\s+es\s+\$([\d,.]+)\s+USD$/i,
    replace: (match, amount) => `The minimum amount for your first purchase is $${amount} USD`
},

// "El monto mínimo es $X USD"
{
    pattern: /^El\s+monto\s+mínimo\s+es\s+\$([\d,.]+)\s+USD$/i,
    replace: (match, amount) => `The minimum amount is $${amount} USD`
},

// Versiones más flexibles (con/sin "USD", diferentes formatos de moneda)
{
    pattern: /^El\s+monto\s+mínimo\s+para\s+tu\s+primera\s+compra\s+es\s+([$\d\s,.]+)/i,
    replace: (match, amount) => `The minimum amount for your first purchase is ${amount}`
},
{
    pattern: /^El\s+monto\s+mínimo\s+es\s+([$\d\s,.]+)/i,
    replace: (match, amount) => `The minimum amount is ${amount}`
},
// Mínimo dinámico
{
    pattern: /^Mínimo:\s*\$(\d+(?:[.,]\d+)?)\s*•\s*Máximo:\s*\$([\d,]+)$/i,
    replace: (match, min, max) => `Minimum: $${min} • Maximum: $${max}`
},

// Compra exitosa con cantidad
{
    pattern: /^¡Compra exitosa!\s*Recibiste\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Purchase successful! You received ${amount} CFT`
},

// Pago completado con cantidad
{
    pattern: /^¡Pago completado!\s*Recibiste\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Payment completed! You received ${amount} CFT`
},

// Monto mínimo primera compra
{
    pattern: /^El monto mínimo para tu primera compra es \$([\d,.]+) USD$/i,
    replace: (match, amount) => `The minimum amount for your first purchase is $${amount} USD`
},

// Monto mínimo estándar
{
    pattern: /^El monto mínimo es \$([\d,.]+) USD$/i,
    replace: (match, amount) => `The minimum amount is $${amount} USD`
},

// Monto máximo
{
    pattern: /^El monto máximo es \$([\d,]+)$/i,
    replace: (match, amount) => `The maximum amount is $${amount}`
},

// Saldo insuficiente
{
    pattern: /^Saldo insuficiente de (\w+) en tu wallet\.$/i,
    replace: (match, currency) => `Insufficient ${currency} balance in your wallet.`
},

// Wallet incorrecta (multilínea)
{
    pattern: /^⚠️ Wallet incorrecta!\s*Tu cuenta:\s*@(\w+)\s*Wallet conectada:\s*@(\w+)\s*Por favor conecta con @(\w+)$/i,
    replace: (match, expected, connected, reconnect) => `⚠️ Wrong wallet!\n\nYour account: @${expected}\nConnected wallet: @${connected}\n\nPlease connect with @${reconnect}`
},

// Mensaje con moneda pagada (PayPal conversión)
{
    pattern: /^\(pagaste\s*([\d,.]+)\s*(\w+)\)$/i,
    replace: (match, amount, currency) => `(you paid ${amount} ${currency})`
},
// Patrón genérico para mensajes de monto mínimo
{
    pattern: /^El\s+monto\s+mínimo\s+(?:para\s*(.+?)\s*)?es\s+([$\d\s,.]+)/i,
    replace: (match, condicion, monto) => {
        if (condicion) {
            const condiciones = {
                'tu primera compra': 'your first purchase',
                'esta compra': 'this purchase',
                'esta transacción': 'this transaction',
                'comprar': 'purchasing',
                'vender': 'selling'
            };
            
            const condicionTraducida = condiciones[condicion.toLowerCase()] || condicion;
            return `The minimum amount for ${condicionTraducida} is ${monto}`;
        } else {
            return `The minimum amount is ${monto}`;
        }
    }
},
// Monto máximo
{
    pattern: /^El\s+monto\s+máximo\s+es\s+([$\d\s,.]+)/i,
    replace: (match, amount) => `The maximum amount is ${amount}`
},

// Monto requerido
{
    pattern: /^El\s+monto\s+requerido\s+es\s+([$\d\s,.]+)/i,
    replace: (match, amount) => `The required amount is ${amount}`
},

// Saldo insuficiente
{
    pattern: /^Saldo\s+insuficiente\.\s+Necesitas\s+([$\d\s,.]+)/i,
    replace: (match, amount) => `Insufficient balance. You need ${amount}`
},

// Mensaje genérico de error de monto
{
    pattern: /^El\s+monto\s+debe\s+ser\s+(.+)/i,
    replace: (match, condicion) => `The amount must be ${condicion}`
},
// "Wallet incorrecta! Tu cuenta: @xxx Wallet conectada: @yyy"
{
    pattern: /^⚠️ Wallet incorrecta!\s*\n*Tu cuenta: @(\S+)\s*\n*Wallet conectada: @(\S+)\s*\n*Por favor conecta con @(\S+)$/i,
    replace: (match, expected, connected, reconnect) => `⚠️ Wrong wallet!\n\nYour account: @${expected}\nConnected wallet: @${connected}\n\nPlease connect with @${reconnect}`
},

// "Saldo insuficiente de USDT en tu wallet."
{
    pattern: /^Saldo insuficiente de (\S+) en tu wallet\.$/i,
    replace: (match, currency) => `Insufficient ${currency} balance in your wallet.`
},
// === P2P MARKETPLACE ===

// "Disponible: 1,234.56 CFT"
{
    pattern: /^Disponible:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Available: ${amount} CFT`
},

// "X operaciones" 
{
    pattern: /^(\d+)\s*operaciones$/i,
    replace: (match, num) => `${num} trades`
},

// Texto del pago seguro con monto dinámico
{
    pattern: /^Al hacer clic en "Comprar", se abrirá tu billetera Proton para confirmar el pago de$/i,
    replace: () => `By clicking "Buy", your Proton wallet will open to confirm the payment of`
},

// "hacia @usuario"
{
    pattern: /^hacia\s+(@[\w.]+)$/i,
    replace: (match, user) => `to ${user}`
},

// "Verificando saldo XUSDT..."
{
    pattern: /^Verificando saldo\s+(\w+)\.{3}$/i,
    replace: (match, token) => `Checking ${token} balance...`
},

// Errores con saldo
{
    pattern: /^Saldo insuficiente\.$/i,
    replace: () => `Insufficient balance.`
},

{
    pattern: /^Disponible:\s*([\d,.]+)\s*(\w+)$/i,
    replace: (match, amount, token) => `Available: ${amount} ${token}`
},

{
    pattern: /^Requerido:\s*([\d,.]+)\s*(\w+)$/i,
    replace: (match, amount, token) => `Required: ${amount} ${token}`
},

// Wallet incorrecta
{
    pattern: /^⚠️\s*Wallet incorrecta detectada!$/i,
    replace: () => `⚠️ Wrong wallet detected!`
},

{
    pattern: /^Tu cuenta registrada:\s*(@[\w.]+)$/i,
    replace: (match, wallet) => `Your registered account: ${wallet}`
},
// === ERRORES P2P DINÁMICOS ===

// "No se pudo conectar: [mensaje]"
{
    pattern: /^No se pudo conectar:\s*(.+)$/i,
    replace: (match, msg) => `Could not connect: ${msg}`
},

// "Configuración de token X no encontrada"
{
    pattern: /^Configuración de token\s+(\w+)\s+no encontrada$/i,
    replace: (match, token) => `Token configuration for ${token} not found`
},

// "Saldo insuficiente de X"
{
    pattern: /^Saldo insuficiente de\s+(\w+)$/i,
    replace: (match, token) => `Insufficient ${token} balance`
},

// "creó una nueva [tipo] Chain: [título] [evento:X]"
{
    pattern: /^creó una nueva (.+?) Chain: (.+?) \[evento:(\d+)\]$/i,
    replace: (match, tipo, titulo, eventoId) => {
        const tipoTraducido = tipo.toLowerCase() === 'evento' ? 'Event' : tipo;
        return `created a new ${tipoTraducido} Chain: ${titulo} [event:${eventoId}]`;
    }
},

// Con tipos específicos predefinidos
{
    pattern: /^creó una nueva (.+?) Chain: (.+?)$/i,
    replace: (match, tipo, titulo) => {
        const tipoMap = {
            'evento': 'Event',
            'audio': 'Audio',
            'imagen': 'Image', 
            'video': 'Video',
            'texto': 'Text',
            'encuesta': 'Poll',
            'multimedia': 'Multimedia'
        };
        
        const tipoTraducido = tipoMap[tipo.toLowerCase()] || tipo;
        return `created a new ${tipoTraducido} Chain: ${titulo}`;
    }
},

// Sin "Chain" (por si varía)
{
    pattern: /^creó una nueva (.+?): (.+?) \[evento:(\d+)\]$/i,
    replace: (match, tipo, titulo, eventoId) => {
        const tipoMap = {
            'evento chain': 'Event Chain',
            'audio chain': 'Audio Chain',
            'imagen chain': 'Image Chain'
        };
        
        const tipoTraducido = tipoMap[tipo.toLowerCase()] || tipo;
        return `created a new ${tipoTraducido}: ${titulo} [event:${eventoId}]`;
    }
},

// Versión sin ID de evento
{
    pattern: /^creó una nueva (.+?) Chain: (.+?)$/i,
    replace: (match, tipo, titulo) => {
        return `created a new ${tipo} Chain: ${titulo}`;
    }
},

// Patrón más general para actividades
{
    pattern: /^creó una nueva (.+?)$/i,
    replace: (match, contenido) => `created a new ${contenido}`
},
// "Saldo insuficiente de X en tu wallet."
{
    pattern: /^Saldo insuficiente de\s+(\w+)\s+en tu wallet\.?$/i,
    replace: (match, token) => `Insufficient ${token} balance in your wallet.`
},

// "Error en transacción: [mensaje]"
{
    pattern: /^Error en transacción:\s*(.+)$/i,
    replace: (match, msg) => `Transaction error: ${msg}`
},

// "Error registrando compra: [mensaje]"
{
    pattern: /^Error registrando compra:\s*(.+)$/i,
    replace: (match, msg) => `Error registering purchase: ${msg}`
},

// "Verificando saldo XUSDT..."
{
    pattern: /^Verificando saldo\s+(\w+)\.{3}$/i,
    replace: (match, token) => `Checking ${token} balance...`
},
{
    pattern: /^Wallet que conectaste:\s*(@[\w.]+)$/i,
    replace: (match, wallet) => `Connected wallet: ${wallet}`
},

{
    pattern: /^Por favor cierra tu Proton Wallet y vuelve a conectar con\s+(@[\w.]+)$/i,
    replace: (match, wallet) => `Please close your Proton Wallet and reconnect with ${wallet}`
},
// "hacia" suelto (con salto de línea antes)
{
    pattern: /^hacia$/i,
    replace: () => `to`
},

// "hacia @usuario" 
{
    pattern: /^hacia\s+(@[\w.]+)$/i,
    replace: (match, user) => `to ${user}`
},
// Saldo insuficiente de token específico
{
    pattern: /^Saldo insuficiente de\s+(\w+)\s+en tu wallet\.$/i,
    replace: (match, token) => `Insufficient ${token} balance in your wallet.`
},
// "¡Compra exitosa! Recibiste 5,000 CFT"
{
    pattern: /^¡Compra exitosa! Recibiste ([\d,\.]+) CFT$/i,
    replace: (match, amount) => `Purchase successful! You received ${amount} CFT`
},

// "¡Compra exitosa! Recibiste 5,000 CFT (pagaste 50.00 ARS)"
{
    pattern: /^¡Compra exitosa! Recibiste ([\d,\.]+) CFT \(pagaste ([\d,\.]+) (\w+)\)$/i,
    replace: (match, cft, paid, currency) => `Purchase successful! You received ${cft} CFT (paid ${paid} ${currency})`
},

// "¡Pago completado! Recibiste 5000 CFT"
{
    pattern: /^¡Pago completado! Recibiste ([\d,\.]+) CFT$/i,
    replace: (match, amount) => `Payment completed! You received ${amount} CFT`
},

// "Error procesando pago: [mensaje]"
{
    pattern: /^Error procesando pago: (.+)$/i,
    replace: (match, error) => `Error processing payment: ${error}`
},

// "Mínimo: $5 • Máximo: $100,000"
{
    pattern: /^Mínimo: \$(\d+(?:,\d{3})*) • Máximo: \$(\d+(?:,\d{3})*)$/i,
    replace: (match, min, max) => `Minimum: $${min} • Maximum: $${max}`
},
// Versión flexible (captura cualquier emoji o carácter al inicio)
{
    pattern: /^.\s*Tu\s*reporte\s*será\s*revisado\s*por\s*nuestro\s*equipo$/i,
    replace: (match) => {
        // Forzar el emoji correcto independientemente del input
        return `📝 Your report will be reviewed by our team`;
    }
},

// Patrón más específico para cuando ya está marcado como traducido pero necesita actualización
{
    pattern: /^[📝�]\s*Tu\s*reporte\s*será\s*revisado\s*por\s*nuestro\s*equipo$/i,
    replace: () => `📝 Your report will be reviewed by our team`
},
    // ============================================
    // PATRONES GENÉRICOS (deben ir DESPUÉS de los específicos)
    // ============================================
    
    // "📝 Publicación • Promoción: X Día(s) (Y CFT) - [Cualquier contenido]"
    {
        pattern: /^(📝\s*)?Publicación\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*(.+)$/i,
        replace: (match, emoji, days, cost, content) => {
            // Traducir frases comunes en el contenido
            const contentTranslations = {
                'Sin contenido': 'No content',
                'Promoción de contenido': 'Content promotion',
                'Contenido promocionado': 'Promoted content'
            };
            
            const translatedContent = contentTranslations[content] || content;
            return `${emoji || ''}Post • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - ${translatedContent}`;
        }
    },
    
    // "⚡ Evento Chain • Promoción: X Día(s) (Y CFT) - [Cualquier contenido]"
    {
        pattern: /^(⚡\s*)?Evento\s+Chain\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*(.+)$/i,
        replace: (match, emoji, days, cost, content) => {
            // Traducir frases comunes en el contenido
            const contentTranslations = {
                'Sin contenido': 'No content',
                'Promoción de contenido': 'Content promotion',
                'Contenido promocionado': 'Promoted content'
            };
            
            const translatedContent = contentTranslations[content.trim()] || content;
            return `${emoji || ''}Chain Event • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - ${translatedContent}`;
        }
    },
    
    // "@usuario • Promoción: X Día(s) (Y CFT) - Contenido"
    {
        pattern: /^(@[\w.]+)\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*(.+)$/i,
        replace: (match, user, days, cost, content) => `${user} • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - ${content}`
    },
    
    // "@usuario • Contenido de publicación..."
    {
        pattern: /^(@[\w.]+)\s*•\s*(.{0,50})$/i,  // Limitar a 50 caracteres para evitar capturar todo
        replace: (match, user, desc) => `${user} • ${desc}`
    },
    
    // === CONTINUAR CON LOS PATRONES EXISTENTES ===
    // (Tus otros patrones van después de estos)
    
    // "⏳ Solicitud enviada a @username"
    {
        pattern: /^(⏳\s*)?Solicitud\s+enviada\s+a\s+(@[\w\.]+)$/i,
        replace: (match, emoji, username) => `${emoji || ''}Request sent to ${username}`
    },

// "✅ Ahora sigues a @username"
{
    pattern: /^(✅\s*)?Ahora\s+sigues\s+a\s+(@[\w\.]+)$/i,
    replace: (match, emoji, username) => `${emoji || ''}You're now following ${username}`
},

// "❌ Has dejado de seguir a @username"
{
    pattern: /^(❌\s*)?Has\s+dejado\s+de\s+seguir\s+a\s+(@[\w\.]+)$/i,
    replace: (match, emoji, username) => `${emoji || ''}You've unfollowed ${username}`
},
// "✉️ Abriendo chat con @username"
{
    pattern: /^(✉️\s*)?Abriendo\s+chat\s+con\s+(@[\w\.]+)\.?$/i,
    replace: (match, emoji, username) => `${emoji || ''}Opening chat with ${username}`
},

// === WALLET - PATRONES DINÁMICOS ===

// "Retiro a cuenta Proton: @usuario"
{
    pattern: /^Retiro\s+a\s+cuenta\s+Proton:\s*(.+)$/i,
    replace: (match, account) => `Withdrawal to Proton account: ${account}`
},

// "Retiro a: @usuario"
{
    pattern: /^Retiro\s+a:\s*(.+)$/i,
    replace: (match, account) => `Withdrawal to: ${account}`
},

// "Vendiste X CFT a @usuario por Y MONEDA"
{
    pattern: /^Vendiste\s+([\d,.]+)\s*CFT\s+a\s+(@?[\w.]+)\s+por\s+([\d,.]+)\s*(\w+)$/i,
    replace: (match, cft, user, amount, currency) => `You sold ${cft} CFT to ${user} for ${amount} ${currency}`
},
// === MARKETPLACE P2P - PATRONES DINÁMICOS ===

// "Necesitas al menos X CFT para crear ofertas"
{
    pattern: /^Necesitas\s+al\s+menos\s+([\d,.]+)\s*CFT\s+para\s+crear\s+ofertas$/i,
    replace: (match, amount) => `You need at least ${amount} CFT to create offers`
},

// "Tienes X CFT disponibles"
{
    pattern: /^Tienes\s+([\d,.]+)\s*CFT\s+disponibles$/i,
    replace: (match, amount) => `You have ${amount} CFT available`
},

// "Saldo CFT insuficiente. Tienes X CFT disponibles"
{
    pattern: /^Saldo\s+CFT\s+insuficiente\.\s+Tienes\s+([\d,.]+)\s*CFT\s+disponibles$/i,
    replace: (match, amount) => `Insufficient CFT balance. You have ${amount} CFT available`
},

// "Cancelaste tu oferta P2P. X CFT han sido devueltos a tu saldo"
{
    pattern: /^Cancelaste\s+tu\s+oferta\s+P2P\.\s+([\d,.]+)\s*CFT\s+han\s+sido\s+devueltos\s+a\s+tu\s+saldo$/i,
    replace: (match, amount) => `You cancelled your P2P offer. ${amount} CFT has been returned to your balance`
},

// "Creaste una oferta de venta de X CFT por Y MONEDA cada uno"
{
    pattern: /^Creaste\s+una\s+oferta\s+de\s+venta\s+de\s+([\d,.]+)\s*CFT\s+por\s+([\d,.]+)\s*(\w+)\s+cada\s+uno$/i,
    replace: (match, cft, price, currency) => `You created a sale offer of ${cft} CFT for ${price} ${currency} each`
},

// "Creaste una oferta de compra de X CFT por Y MONEDA cada uno"
{
    pattern: /^Creaste\s+una\s+oferta\s+de\s+compra\s+de\s+([\d,.]+)\s*CFT\s+por\s+([\d,.]+)\s*(\w+)\s+cada\s+uno$/i,
    replace: (match, cft, price, currency) => `You created a purchase offer of ${cft} CFT for ${price} ${currency} each`
},

// "X CFT restantes"
{
    pattern: /^([\d,.]+)\s*CFT\s+restantes?$/i,
    replace: (match, amount) => `${amount} CFT remaining`
},

// "X CFT vendidos"
{
    pattern: /^([\d,.]+)\s*CFT\s+vendidos?$/i,
    replace: (match, amount) => `${amount} CFT sold`
},
// === BOTONES DE COMPARTIR ===

// "📤 Compartir con X usuario(s)" - Botón de acción
{
    pattern: /^📤\s*Compartir\s*con\s*(\d+)\s*usuario(s)?$/i,
    replace: (match, count, plural) => `📤 Share with ${count} user${count == 1 ? '' : 's'}`
},

// Con Unicode (📤 = \u{1F4E4})
{
    pattern: /^\u{1F4E4}\s*Compartir\s*con\s*(\d+)\s*usuario(s)?$/iu,
    replace: (match, count, plural) => `\u{1F4E4} Share with ${count} user${count == 1 ? '' : 's'}`
},

// Versión sin número específico
{
    pattern: /^📤\s*Compartir\s*con\s*usuario(s)?$/i,
    replace: (match, plural) => `📤 Share with user${plural ? 's' : ''}`
},

// Patrón más flexible para diferentes formatos
{
    pattern: /^📤\s*Compartir\s*(?:con\s*)?(\d+)?\s*usuario(s)?$/i,
    replace: (match, count, plural) => {
        if (count) {
            return `📤 Share with ${count} user${count == 1 ? '' : 's'}`;
        } else {
            return `📤 Share with user${plural ? 's' : ''}`;
        }
    }
},

// Sin emoji
{
    pattern: /^Compartir\s*con\s*(\d+)\s*usuario(s)?$/i,
    replace: (match, count, plural) => `Share with ${count} user${count == 1 ? '' : 's'}`
},
// Diferentes emojis para compartir
{
    pattern: /^🔗\s*Compartir\s*con\s*(\d+)\s*usuario(s)?$/i,
    replace: (match, count, plural) => `🔗 Share with ${count} user${count == 1 ? '' : 's'}`
},
{
    pattern: /^📎\s*Compartir\s*con\s*(\d+)\s*usuario(s)?$/i,
    replace: (match, count, plural) => `📎 Share with ${count} user${count == 1 ? '' : 's'}`
},

// Patrón genérico para cualquier emoji de compartir
{
    pattern: /^[📤🔗📎📩]\s*Compartir\s*con\s*(\d+)\s*usuario(s)?$/i,
    replace: (match, count, plural) => {
        const emoji = match.charAt(0); // Captura el emoji original
        return `${emoji} Share with ${count} user${count == 1 ? '' : 's'}`;
    }
},

// "Compartir en redes sociales"
{
    pattern: /^📤\s*Compartir\s*en\s*redes\s*sociales$/i,
    replace: () => `📤 Share on social networks`
},
{
    pattern: /^🌐\s*Compartir\s*en\s*redes\s*sociales$/i,
    replace: () => `🌐 Share on social networks`
},
// "Precio: X MONEDA por CFT"
{
    pattern: /^Precio:\s+([\d,.]+)\s*(\w+)\s+por\s+CFT$/i,
    replace: (match, price, currency) => `Price: ${price} ${currency} per CFT`
},

// "Total: X MONEDA"
{
    pattern: /^Total:\s+([\d,.]+)\s*(\w+)$/i,
    replace: (match, amount, currency) => `Total: ${amount} ${currency}`
},

// "@usuario compró X CFT de tu oferta"
{
    pattern: /^(@?[\w.]+)\s+compró\s+([\d,.]+)\s*CFT\s+de\s+tu\s+oferta$/i,
    replace: (match, user, amount) => `${user} bought ${amount} CFT from your offer`
},

// "@usuario vendió X CFT en tu oferta"
{
    pattern: /^(@?[\w.]+)\s+vendió\s+([\d,.]+)\s*CFT\s+en\s+tu\s+oferta$/i,
    replace: (match, user, amount) => `${user} sold ${amount} CFT in your offer`
},
// === FULLSCREEN VIEWER - PATRONES DINÁMICOS ===

// "Ver perfil de @usuario"
{
    pattern: /^Ver\s+perfil\s+de\s+(@?[\w.]+)$/i,
    replace: (match, user) => `View profile of ${user}`
},

// "👤 Ver perfil de @usuario"
{
    pattern: /^👤\s+Ver\s+perfil\s+de\s+(@?[\w.]+)$/i,
    replace: (match, user) => `👤 View profile of ${user}`
},

// "Creado originalmente por @usuario"
{
    pattern: /^Creado\s+originalmente\s+por\s+(@?[\w.]+)$/i,
    replace: (match, user) => `Originally created by ${user}`
},

// === COMENTARIOS - PATRONES DINÁMICOS ===

// "Ver respuestas (X)"
{
    pattern: /^Ver\s+respuestas\s+\((\d+)\)$/i,
    replace: (match, count) => `View replies (${count})`
},

// "¡Comentario publicado! Has ganado X CFT"
{
    pattern: /^¡Comentario\s+publicado!\s+Has\s+ganado\s+([\d,.]+)\s*CFT$/i,
    replace: (match, tokens) => `Comment posted! You earned ${tokens} CFT`
},

// "¡Respuesta publicada! Has ganado X CFT"
{
    pattern: /^¡Respuesta\s+publicada!\s+Has\s+ganado\s+([\d,.]+)\s*CFT$/i,
    replace: (match, tokens) => `Reply posted! You earned ${tokens} CFT`
},

// "❤️ Like agregado! El autor ganó X CFT"
{
    pattern: /^❤️\s+Like\s+agregado!\s+El\s+autor\s+ganó\s+([\d,.]+)\s*CFT$/i,
    replace: (match, tokens) => `❤️ Like added! The author earned ${tokens} CFT`
},

// "hace Xm" (minutos)
{
    pattern: /^hace\s+(\d+)m$/i,
    replace: (match, minutes) => `${minutes}m ago`
},

// "hace Xh" (horas)
{
    pattern: /^hace\s+(\d+)h$/i,
    replace: (match, hours) => `${hours}h ago`
},
 {
        pattern: /Intentos restantes:\s*(\d+)\/(\d+)/gi,
        replace: (match, current, total) => `Attempts remaining: ${current}/${total}`
      },
      {
        pattern: /⏳\s*Debes esperar\s*(\d+)\s*minuto\(s\)\s*antes de reenviar/gi,
        replace: (match, minutes) => `⏳ You must wait ${minutes} minute(s) before resending`
      },
      {
        pattern: /Espera\s*(\d+):(\d+)/gi,
        replace: (match, min, sec) => `Wait ${min}:${sec}`
      },
// "hace Xd" (días)
{
    pattern: /^hace\s+(\d+)d$/i,
    replace: (match, days) => `${days}d ago`
},
{
        pattern: /¡Bienvenido a ChainFeed,\s*([^!]+)!/gi,
        replace: (match, name) => `Welcome to ChainFeed, ${name}!`
      },
      {
        pattern: /🎉\s*¡Código aplicado exitosamente!\s*\n\s*\n\s*Tú y\s*@([^\s]+)\s*recibieron\s*([\d.]+)\s*CFT cada uno\./gi,
        replace: (match, username, tokens) => `🎉 Code applied successfully!\n\nYou and @${username} each received ${tokens} CFT.`
      },
      {
        pattern: /📧\s*Revisa tu email para verificar tu cuenta\.\s*\n\s*\n\s*Una vez verificado,\s*podrás iniciar sesión\./gi,
        replace: (match) => `📧 Check your email to verify your account.\n\nOnce verified, you can sign in.`
      },
      {
        pattern: /([\d,]+)\s*CFT otorgados en total/gi,
        replace: (match, amount) => `${amount} CFT distributed in total`
      },
      {
        pattern: /(\d+)\s*nuevos? en 7 días/gi,
        replace: (match, count) => `${count} new in 7 days`
      },
      {
        pattern: /👥\s*<strong[^>]*>\s*(\d+)\s*<\/strong>\s*referidos/gi,
        replace: (match, count) => `👥 <strong>${count}</strong> referrals`
      },
      {
        pattern: /💰\s*<strong[^>]*>\s*([\d.]+)\s*<\/strong>\s*CFT/gi,
        replace: (match, amount) => `💰 <strong>${amount}</strong> CFT`
      },
// "hace X semanas"
{
    pattern: /^hace\s+(\d+)\s+semanas?$/i,
    replace: (match, weeks) => `${weeks} week${weeks > 1 ? 's' : ''} ago`
},

// "hace X meses"
{
    pattern: /^hace\s+(\d+)\s+meses?$/i,
    replace: (match, months) => `${months} month${months > 1 ? 's' : ''} ago`
},
// === MENSAJES DE CONFIRMACIÓN DEL SISTEMA ===

// "✅ Contraseña actualizada , Ya puedes iniciar sesión con tu nueva contraseña."
{
    pattern: /^✅\s*Contraseña\s*actualizada\s*,\s*Ya\s*puedes\s*iniciar\s*sesión\s*con\s*tu\s*nueva\s*contraseña\.$/i,
    replace: () => `✅ Password updated, You can now log in with your new password.`
},

// "✅ Te hemos enviado un email con las instrucciones para recuperar tu contraseña. Revisa tu bandeja de entrada."
{
    pattern: /^✅\s*Te\s*hemos\s*enviado\s*un\s*email\s*con\s*las\s*instrucciones\s*para\s*recuperar\s*tu\s*contraseña\.\s*Revisa\s*tu\s*bandeja\s*de\s*entrada\.$/i,
    replace: () => `✅ We have sent you an email with instructions to recover your password. Check your inbox.`
},

// "✅ Cuenta creada exitosamente. Revisa tu email para verificar tu cuenta."
{
    pattern: /^✅\s*Cuenta\s*creada\s*exitosamente\.\s*Revisa\s*tu\s*email\s*para\s*verificar\s*tu\s*cuenta\.$/i,
    replace: () => `✅ Account created successfully. Check your email to verify your account.`
},

// Con Unicode (✅ = \u2705)
{
    pattern: /^\u2705\s*Contraseña\s*actualizada\s*,\s*Ya\s*puedes\s*iniciar\s*sesión\s*con\s*tu\s*nueva\s*contraseña\.$/iu,
    replace: () => `\u2705 Password updated, You can now log in with your new password.`
},
{
    pattern: /^\u2705\s*Te\s*hemos\s*enviado\s*un\s*email\s*con\s*las\s*instrucciones\s*para\s*recuperar\s*tu\s*contraseña\.\s*Revisa\s*tu\s*bandeja\s*de\s*entrada\.$/iu,
    replace: () => `\u2705 We have sent you an email with instructions to recover your password. Check your inbox.`
},
{
    pattern: /^\u2705\s*Cuenta\s*creada\s*exitosamente\.\s*Revisa\s*tu\s*email\s*para\s*verificar\s*tu\s*cuenta\.$/iu,
    replace: () => `\u2705 Account created successfully. Check your email to verify your account.`
},

// Versiones separadas (por si aparecen en partes diferentes)

// Parte 1: Contraseña actualizada
{
    pattern: /^✅\s*Contraseña\s*actualizada$/i,
    replace: () => `✅ Password updated`
},

// Parte 2: Mensaje de login
{
    pattern: /^Ya\s*puedes\s*iniciar\s*sesión\s*con\s*tu\s*nueva\s*contraseña\.$/i,
    replace: () => `You can now log in with your new password.`
},

// Email de recuperación (parte 1)
{
    pattern: /^✅\s*Te\s*hemos\s*enviado\s*un\s*email\s*con\s*las\s*instrucciones\s*para\s*recuperar\s*tu\s*contraseña\.$/i,
    replace: () => `✅ We have sent you an email with instructions to recover your password.`
},

// Email de recuperación (parte 2)
{
    pattern: /^Revisa\s*tu\s*bandeja\s*de\s*entrada\.$/i,
    replace: () => `Check your inbox.`
},

// Cuenta creada (parte 1)
{
    pattern: /^✅\s*Cuenta\s*creada\s*exitosamente\.$/i,
    replace: () => `✅ Account created successfully.`
},

// Cuenta creada (parte 2)
{
    pattern: /^Revisa\s*tu\s*email\s*para\s*verificar\s*tu\s*cuenta\.$/i,
    replace: () => `Check your email to verify your account.`
},

// Patrón genérico para mensajes de éxito
{
    pattern: /^✅\s*(.+?)\s*exitosamente\.?\s*(.+)?$/i,
    replace: (match, accion, adicional) => {
        const acciones = {
            'contraseña actualizada': 'Password updated',
            'cuenta creada': 'Account created',
            'perfil actualizado': 'Profile updated',
            'configuración guardada': 'Settings saved',
            'cambios guardados': 'Changes saved'
        };
        
        const accionTraducida = acciones[accion.toLowerCase()] || accion;
        
        if (adicional) {
            const adicionales = {
                'revisa tu email para verificar tu cuenta': 'Check your email to verify your account',
                'ya puedes iniciar sesión con tu nueva contraseña': 'You can now log in with your new password'
            };
            
            const adicionalTraducido = adicionales[adicional.toLowerCase().trim()] || adicional;
            return `✅ ${accionTraducida} successfully. ${adicionalTraducido}`;
        }
        
        return `✅ ${accionTraducida} successfully`;
    }
},

// === CONTENIDO DE PÁGINA (CTA/INVERSIONES) ===

// Títulos y encabezados
{
    pattern: /^Ronda privada para inversores estratégicos$/i,
    replace: () => `Private round for strategic investors`
},

// Párrafos individuales
{
    pattern: /^ChainFeed es una startup en etapa temprana con el producto ya desarrollado y operativo\.$/i,
    replace: () => `ChainFeed is an early-stage startup with the product already developed and operational.`
},

{
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en <strong>adquirir una participación en la startup, y no en la compra de tokens<\/strong>\.$/i,
    replace: () => `Currently, a private round is open for strategic investors interested in <strong>acquiring a stake in the startup, and not in token purchases</strong>.`
},

{
    pattern: /^Esta ronda se realiza de forma previa a cualquier preventa del token, el cual forma parte del ecosistema futuro del proyecto, pero no es el instrumento de inversión en esta etapa\.$/i,
    replace: () => `This round takes place prior to any token presale, which is part of the project's future ecosystem but is not the investment instrument at this stage.`
},

{
    pattern: /^La participación se estructura bajo un esquema contractual claro, con foco en el crecimiento a largo plazo del proyecto y su modelo económico\.$/i,
    replace: () => `Participation is structured under a clear contractual scheme, focusing on the long-term growth of the project and its economic model.`
},

// === ENLACES Y ETIQUETAS DE INVERSIÓN ===

// "Entrar a la ronda privada para inversores"
{
    pattern: /^Entrar\s+a\s+la\s+ronda\s+privada\s+para\s+inversores$/i,
    replace: () => `Enter the private round for investors`
},

// Con Unicode para caracteres especiales
{
    pattern: /^Entrar\s+a\s+la\s+ronda\s+privada\s+para\s+inversores$/iu,
    replace: () => `Enter the private round for investors`
},

// Versiones alternativas/variantes
{
    pattern: /^Acceder\s+a\s+la\s+ronda\s+privada\s+para\s+inversores$/i,
    replace: () => `Access the private round for investors`
},
{
    pattern: /^Ver\s+ronda\s+privada\s+para\s+inversores$/i,
    replace: () => `View private round for investors`
},
{
    pattern: /^Información\s+para\s+inversores$/i,
    replace: () => `Information for investors`
},

// Patrón genérico para enlaces de inversión
{
    pattern: /^(.+?)\s*ronda\s+privada\s+(?:para\s+)?inversores$/i,
    replace: (match, accion) => {
        const acciones = {
            'entrar a la': 'Enter the',
            'acceder a la': 'Access the',
            'ver': 'View',
            'información de': 'Information about',
            'detalles de': 'Details of',
            'participar en': 'Participate in'
        };
        
        const accionTraducida = acciones[accion.toLowerCase()] || accion;
        return `${accionTraducida} private round for investors`;
    }
},

// Versión corta
{
    pattern: /^Ronda\s+privada\s+para\s+inversores$/i,
    replace: () => `Private round for investors`
},
// Botón de acción
{
    pattern: /^Contacto para inversores$/i,
    replace: () => `Contact for investors`
},

// === FORMATO DE FECHA ===

// Meses en español a inglés
{
    pattern: /(\d+)\s+de\s+ene(?:ro)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Jan ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+feb(?:rero)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Feb ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+mar(?:zo)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Mar ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+abr(?:il)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Apr ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+may(?:o)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `May ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+jun(?:io)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Jun ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+jul(?:io)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Jul ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+ago(?:sto)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Aug ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+sep(?:tiembre)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Sep ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+oct(?:ubre)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Oct ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+nov(?:iembre)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Nov ${day}, ${year}`
},
{
    pattern: /(\d+)\s+de\s+dic(?:iembre)?\.?\s+de\s+(\d{4})/i,
    replace: (match, day, year) => `Dec ${day}, ${year}`
},
// "Editando perfil de: @usuario"
{
    pattern: /^Editando\s+perfil\s+de:\s+(@?[\w.]+)$/i,
    replace: (match, user) => `Editing profile of: ${user}`
},

// "Avatar actualizado (no olvides guardar)"
{
    pattern: /^Avatar\s+actualizado\s+\(no\s+olvides\s+guardar\)$/i,
    replace: () => `Avatar updated (don't forget to save)`
},
{
    pattern: /Faltan\s*<strong([^>]*)>(\d+)<\/strong>\s*infracci[oó]nes\s+para\s+sanci[oó]n\s+de\s*<strong([^>]*)>(\d+)\s*d[ií]as<\/strong>\s*de\s+bloqueo/i,
    replace: (match, attr1, num, attr2, days) => 
        `Remaining <strong${attr1}>${num}</strong> infractions until <strong${attr2}>${days} days</strong> block`
},
// "Intentos restantes: X/Y"
{
    pattern: /^Intentos\s+restantes:\s+(\d+)\/(\d+)$/i,
    replace: (match, current, total) => `Attempts remaining: ${current}/${total}`
},

// "Wallet vinculada exitosamente. Tu nuevo username es @usuario. Redirigiendo..."
{
    pattern: /^Wallet\s+vinculada\s+exitosamente\.\s+Tu\s+nuevo\s+username\s+es\s+(@?[\w.]+)\.\s+Redirigiendo\.\.\.$/i,
    replace: (match, username) => `Wallet linked successfully. Your new username is ${username}. Redirecting...`
},

// "Email actual: correo@ejemplo.com"
{
    pattern: /^Email\s+actual:\s+(.+)$/i,
    replace: (match, email) => `Current email: ${email}`
},

// "Wallet vinculada: dirección"
{
    pattern: /^Wallet\s+vinculada:\s+(.+)$/i,
    replace: (match, address) => `Linked wallet: ${address}`
},

// "Email registrado: correo@ejemplo.com"
{
    pattern: /^Email\s+registrado:\s+(.+)$/i,
    replace: (match, email) => `Registered email: ${email}`
},

// Instrucciones de navegadores para notificaciones
{
    pattern: /^Chrome\/Edge:\s+Click\s+en\s+el\s+candado.*→\s+Permisos\s+→\s+Notificaciones\s+→\s+Permitir$/i,
    replace: () => `Chrome/Edge: Click on the lock 🔒 → Permissions → Notifications → Allow`
},

{
    pattern: /^Firefox:\s+Click\s+en\s+el\s+candado.*→\s+Permisos\s+→\s+Notificaciones\s+→\s+Permitir$/i,
    replace: () => `Firefox: Click on the lock 🔒 → Permissions → Notifications → Allow`
},

{
    pattern: /^Safari:\s+Preferencias\s+→\s+Sitios\s+web\s+→\s+Notificaciones$/i,
    replace: () => `Safari: Preferences → Websites → Notifications`
},

// Contadores de caracteres
{
    pattern: /^(\d+)\/(\d+)$/,
    replace: (match, current, max) => `${current}/${max}`
},
// Versiones abreviadas sin "de"
{
    pattern: /(\d+)\s+ene\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Jan ${year}`
},
{
    pattern: /(\d+)\s+feb\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Feb ${year}`
},
{
    pattern: /(\d+)\s+mar\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Mar ${year}`
},
{
    pattern: /(\d+)\s+abr\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Apr ${year}`
},
{
    pattern: /(\d+)\s+may\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} May ${year}`
},
{
    pattern: /(\d+)\s+jun\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Jun ${year}`
},
{
    pattern: /(\d+)\s+jul\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Jul ${year}`
},
{
    pattern: /(\d+)\s+ago\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Aug ${year}`
},
{
    pattern: /(\d+)\s+sep\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Sep ${year}`
},
{
    pattern: /(\d+)\s+oct\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Oct ${year}`
},
{
    pattern: /(\d+)\s+nov\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Nov ${year}`
},
{
    pattern: /(\d+)\s+dic\.?\s+(\d{4})/i,
    replace: (match, day, year) => `${day} Dec ${year}`
},
// "Tu oferta de X CFT se completó"
{
    pattern: /^Tu\s+oferta\s+de\s+([\d,.]+)\s*CFT\s+se\s+completó$/i,
    replace: (match, amount) => `Your offer of ${amount} CFT was completed`
},

// "Compraste X CFT a @usuario por Y MONEDA"
{
    pattern: /^Compraste\s+([\d,.]+)\s*CFT\s+a\s+(@?[\w.]+)\s+por\s+([\d,.]+)\s*(\w+)$/i,
    replace: (match, cft, user, amount, currency) => `You bought ${cft} CFT from ${user} for ${amount} ${currency}`
},

// "Vendiste X CFT a @usuario por Y MONEDA"
{
    pattern: /^Vendiste\s+([\d,.]+)\s*CFT\s+a\s+(@?[\w.]+)\s+por\s+([\d,.]+)\s*(\w+)$/i,
    replace: (match, cft, user, amount, currency) => `You sold ${cft} CFT to ${user} for ${amount} ${currency}`
},

// "Tu balance: X CFT. Te faltan: Y CFT"
{
    pattern: /^Tu\s+balance:\s+([\d,.]+)\s*CFT\.\s+Te\s+faltan:\s+([\d,.]+)\s*CFT$/i,
    replace: (match, balance, needed) => `Your balance: ${balance} CFT. You need: ${needed} CFT`
},

// "Acceso restringido al Marketplace P2P. Necesitas al menos X CFT para crear ofertas. Tu balance: Y CFT. Te faltan: Z CFT."
{
    pattern: /^Acceso\s+restringido\s+al\s+Marketplace\s+P2P\.\s+Necesitas\s+al\s+menos\s+([\d,.]+)\s*CFT\s+para\s+crear\s+ofertas\.\s+Tu\s+balance:\s+([\d,.]+)\s*CFT\.\s+Te\s+faltan:\s+([\d,.]+)\s*CFT\.?$/i,
    replace: (match, required, balance, needed) => `Access restricted to P2P Marketplace. You need at least ${required} CFT to create offers. Your balance: ${balance} CFT. You need: ${needed} CFT.`
},

// "Oferta: X CFT por Y MONEDA"
{
    pattern: /^Oferta:\s+([\d,.]+)\s*CFT\s+por\s+([\d,.]+)\s*(\w+)$/i,
    replace: (match, cft, price, currency) => `Offer: ${cft} CFT for ${price} ${currency}`
},

// "Debe ser venta o compra"
{
    pattern: /^Debe\s+ser\s+"?venta"?\s+o\s+"?compra"?$/i,
    replace: () => `Must be "sale" or "purchase"`
},

// "X operaciones completadas"
{
    pattern: /^([\d,.]+)\s+operaci(?:ón|ones)\s+completadas?$/i,
    replace: (match, count) => `${count} completed trade${count > 1 ? 's' : ''}`
},

// "Tasa de éxito: X%"
{
    pattern: /^Tasa\s+de\s+éxito:\s+([\d,.]+)%$/i,
    replace: (match, rate) => `Success rate: ${rate}%`
},

// "Calificación: X/5"
{
    pattern: /^Calificación:\s+([\d,.]+)\/5$/i,
    replace: (match, rating) => `Rating: ${rating}/5`
},

// "Compraste X CFT de @usuario por Y MONEDA"
{
    pattern: /^Compraste\s+([\d,.]+)\s*CFT\s+de\s+(@?[\w.]+)\s+por\s+([\d,.]+)\s*(\w+)$/i,
    replace: (match, cft, user, amount, currency) => `You bought ${cft} CFT from ${user} for ${amount} ${currency}`
},
// === NOTIFICACIONES - PATRONES DINÁMICOS ===

// "@usuario dio like a tu publicación"
{
    pattern: /^(@?[\w.]+)\s+dio\s+like\s+a\s+tu\s+publicación$/i,
    replace: (match, user) => `${user} liked your post`
},

// "@usuario comentó en tu publicación"
{
    pattern: /^(@?[\w.]+)\s+comentó\s+en\s+tu\s+publicación$/i,
    replace: (match, user) => `${user} commented on your post`
},

// "@usuario comenzó a seguirte"
{
    pattern: /^(@?[\w.]+)\s+comenzó\s+a\s+seguirte$/i,
    replace: (match, user) => `${user} started following you`
},

// "@usuario te envió una solicitud de seguimiento"
{
    pattern: /^(@?[\w.]+)\s+te\s+envió\s+una\s+solicitud\s+de\s+seguimiento$/i,
    replace: (match, user) => `${user} sent you a follow request`
},

// "@usuario reposteó tu publicación"
{
    pattern: /^(@?[\w.]+)\s+reposteó\s+tu\s+publicación$/i,
    replace: (match, user) => `${user} reposted your post`
},

// "@usuario te mencionó en una publicación"
{
    pattern: /^(@?[\w.]+)\s+te\s+mencionó\s+en\s+una\s+publicación$/i,
    replace: (match, user) => `${user} mentioned you in a post`
},

// "@usuario te envió X CFT"
{
    pattern: /^(@?[\w.]+)\s+te\s+envió\s+([\d,.]+)\s*CFT$/i,
    replace: (match, user, amount) => `${user} sent you ${amount} CFT`
},

// "@usuario compró tu publicación por X CFT"
{
    pattern: /^(@?[\w.]+)\s+compró\s+tu\s+publicación\s+por\s+([\d,.]+)\s*CFT$/i,
    replace: (match, user, amount) => `${user} bought your post for ${amount} CFT`
},

// "Compraste una publicación de @usuario por X CFT"
{
    pattern: /^Compraste\s+una\s+publicación\s+de\s+(@?[\w.]+)\s+por\s+([\d,.]+)\s*CFT$/i,
    replace: (match, user, amount) => `You bought a post from ${user} for ${amount} CFT`
},

// "Tu retiro de X CFT fue completado"
{
    pattern: /^Tu\s+retiro\s+de\s+([\d,.]+)\s*CFT\s+fue\s+completado$/i,
    replace: (match, amount) => `Your withdrawal of ${amount} CFT was completed`
},
// === MENSAJES DE VENTA/COMPRA ===

// "💰 ¡Publicación puesta en venta por X CFT!"
{
    pattern: /^💰\s*¡Publicación\s*puesta\s*en\s*venta\s*por\s*([\d,.]+)\s*CFT!$/i,
    replace: (match, amount) => `💰 Post put up for sale for ${amount} CFT!`
},

// Versión con Unicode (💰 = \u{1F4B0})
{
    pattern: /^\u{1F4B0}\s*¡Publicación\s*puesta\s*en\s*venta\s*por\s*([\d,.]+)\s*CFT!$/iu,
    replace: (match, amount) => `\u{1F4B0} Post up for sale for ${amount} CFT!`
},

// Versión flexible (maneja variaciones de formato)
{
    pattern: /^💰\s*¡?Publicación\s*puesta\s*en\s*venta\s*por\s*([\d,.]+)\s*CFT!?$/i,
    replace: (match, amount) => `💰 post put up for sale for ${amount} CFT!`
},

// Sin emoji
{
    pattern: /^¡Publicación\s*puesta\s*en\s*venta\s*por\s*([\d,.]+)\s*CFT!$/i,
    replace: (match, amount) => `Post put up for sale for ${amount} CFT!`
},

// Patrones relacionados
{
    pattern: /^💰\s*¡Oferta\s*realizada\s*por\s*([\d,.]+)\s*CFT!$/i,
    replace: (match, amount) => `💰 Offer made for ${amount} CFT!`
},
{
    pattern: /^💰\s*¡Compra\s*realizada\s*por\s*([\d,.]+)\s*CFT!$/i,
    replace: (match, amount) => `💰 Purchase made for ${amount} CFT!`
},
{
    pattern: /^💰\s*¡Venta\s*realizada\s*por\s*([\d,.]+)\s*CFT!$/i,
    replace: (match, amount) => `💰 Sale made for ${amount} CFT!`
},

// Patrón genérico para transacciones
{
    pattern: /^💰\s*¡(.+?)\s*por\s*([\d,.]+)\s*CFT!$/i,
    replace: (match, action, amount) => {
        const translations = {
            'publicación puesta en venta': 'Publication put up for sale',
            'oferta realizada': 'Offer made',
            'compra realizada': 'Purchase made',
            'venta realizada': 'Sale made',
            'subasta ganada': 'Auction won',
            'puja realizada': 'Bid placed'
        };
        
        const translatedAction = translations[action.toLowerCase()] || action;
        return `💰 ${translatedAction} for ${amount} CFT!`;
    }
},
// === MENSAJES DE CONFIRMACIÓN/ESTADO ===

// "✅ Venta cancelada exitosamente"
{
    pattern: /^✅\s*Venta\s*cancelada\s*exitosamente$/i,
    replace: () => `✅ Sale cancelled successfully`
},

// Con Unicode (✅ = \u2705)
{
    pattern: /^\u2705\s*Venta\s*cancelada\s*exitosamente$/iu,
    replace: () => `\u2705 Sale cancelled successfully`
},

// "✅ Compra cancelada exitosamente"
{
    pattern: /^✅\s*Compra\s*cancelada\s*exitosamente$/i,
    replace: () => `✅ Purchase cancelled successfully`
},

// "✅ Publicación eliminada exitosamente"
{
    pattern: /^✅\s*Publicación\s*eliminada\s*exitosamente$/i,
    replace: () => `✅ Publication deleted successfully`
},

// "✅ Operación completada exitosamente"
{
    pattern: /^✅\s*Operación\s*completada\s*exitosamente$/i,
    replace: () => `✅ Operation completed successfully`
},

// Patrón genérico para mensajes de éxito
{
    pattern: /^✅\s*(.+?)\s*exitosamente$/i,
    replace: (match, action) => {
        const translations = {
            'venta cancelada': 'Sale cancelled',
            'compra cancelada': 'Purchase cancelled',
            'publicación eliminada': 'Publication deleted',
            'operación completada': 'Operation completed',
            'transacción completada': 'Transaction completed',
            'acción completada': 'Action completed',
            'proceso finalizado': 'Process completed',
            'cambio realizado': 'Change made',
            'actualización realizada': 'Update made'
        };
        
        const lowerAction = action.toLowerCase();
        const translatedAction = translations[lowerAction] || action;
        
        return `✅ ${translatedAction} successfully`;
    }
},

// === FRASES PARA LISTING (con estructura de span) ===

// Para el texto dentro del span de CoinGecko
{
    pattern: /^\. Podrás seguir el precio y estadísticas de CFT\.$/i,
    replace: () => `. You will be able to track the price and statistics of CFT.`
},

// Para el texto dentro del span de Alcor DEX
{
    pattern: /^\. Sé el primero en intercambiar en Alcor DEX sin comisiones\.$/i,
    replace: () => `. Be the first to trade on Alcor DEX with no fees.`
},

// Versión sin el punto inicial (por si acaso)
{
    pattern: /^Podrás seguir el precio y estadísticas de CFT\.$/i,
    replace: () => `You will be able to track the price and statistics of CFT.`
},

{
    pattern: /^Sé el primero en intercambiar en Alcor DEX sin comisiones\.$/i,
    replace: () => `Be the first to trade on Alcor DEX with no fees.`
},

// Patrón genérico para el texto dentro del span
{
    pattern: /^\. (.+)$/i,
    replace: (match, frase) => {
        const translations = {
            'Podrás seguir el precio y estadísticas de CFT.': 'You will be able to track the price and statistics of CFT.',
            'Sé el primero en intercambiar en Alcor DEX sin comisiones.': 'Be the first to trade on Alcor DEX with no fees.'
        };
        
        const translatedFrase = translations[frase] || frase;
        return `. ${translatedFrase}`;
    }
},


// Sin emoji
{
    pattern: /^Venta\s*cancelada\s*exitosamente$/i,
    replace: () => `Sale cancelled successfully`
},

// Versión flexible (maneja cualquier checkmark)
{
    pattern: /^[✅✔✓]\s*Venta\s*cancelada\s*exitosamente$/i,
    replace: () => `✅ Sale cancelled successfully`
},
// Mensajes de error
{
    pattern: /^❌\s*(.+?)\s*falló$/i,
    replace: (match, action) => `❌ ${action} failed`
},

// Mensajes de advertencia
{
    pattern: /^⚠️\s*(.+?)\s*requerido$/i,
    replace: (match, item) => `⚠️ ${item} required`
},
// === MENSAJES DE COMPARTIR/REDES SOCIALES ===

// "Compartir con X usuario(s)" - Texto del botón
{
    pattern: /^Compartir\s*con\s*(\d+)\s*usuario(s)?$/i,
    replace: (match, count, plural) => `Share with ${count} user${count == 1 ? '' : 's'}`
},
// Mensaje de confirmación - POST (corregido)
{
    pattern: /^📤\s*Publicación\s*compartida\s*con\s*(\d+)\s*usuario(s)?$/i,
    replace: (match, count, plural) => `📤 Post shared with ${count} user${count == 1 ? '' : 's'}`
},

// Con Unicode
{
    pattern: /^\u{1F4E4}\s*Publicación\s*compartida\s*con\s*(\d+)\s*usuario(s)?$/iu,
    replace: (match, count, plural) => `\u{1F4E4} Post shared with ${count} user${count == 1 ? '' : 's'}`
},

// Detalle del envío
{
    pattern: /^👥\s*(?:Enviado\s*a:|Sent\s*to:)\s*(.+)$/i,
    replace: (match, username) => `👥 Sent to: ${username}`
},

// Patrón completo (mensaje combinado)
{
    pattern: /^📤\s*Publicación\s*compartida\s*con\s*(\d+)\s*usuario(s)?\s*👥\s*(?:Enviado\s*a:|Sent\s*to:)\s*(.+)$/i,
    replace: (match, count, plural, username) => `📤 Post shared with ${count} user${count == 1 ? '' : 's'} 👥 Sent to: ${username}`
},

// Patrón flexible para el mensaje combinado
{
    pattern: /^(📤\s*Publicación\s*compartida\s*con\s*\d+\s*usuario(?:s)?)\s*(👥\s*.+)$/i,
    replace: (match, part1, part2) => {
        // Traducir la primera parte a "Post"
        const translatedPart1 = part1.replace(
            /^📤\s*Publicación\s*compartida\s*con\s*(\d+)\s*usuario(s)?$/i,
            '📤 Post shared with $1 user$2'
        );
        
        // Asegurar que la segunda parte esté en inglés
        const translatedPart2 = part2.replace(
            /^👥\s*(Enviado\s*a:|Sent\s*to:)\s*(.+)$/i,
            '👥 Sent to: $2'
        );
        
        return `${translatedPart1} ${translatedPart2}`;
    }
},

// Patrón genérico para diferentes tipos de contenido
{
    pattern: /^📤\s*(.+?)\s*compartid[ao]\s*con\s*(\d+)\s*usuario(s)?$/i,
    replace: (match, itemType, count, plural) => {
        const contentTypes = {
            'publicación': 'Post',
            'post': 'Post',
            'historia': 'Story',
            'reel': 'Reel',
            'video': 'Video',
            'imagen': 'Image',
            'archivo': 'File',
            'contenido': 'Content'
        };
        
        const translatedType = contentTypes[itemType.toLowerCase()] || itemType;
        return `📤 ${translatedType} shared with ${count} user${count == 1 ? '' : 's'}`;
    }
},
// Mensajes de información
{
    pattern: /^ℹ️\s*(.+)$/i,
    replace: (match, info) => `ℹ️ ${info}`
},
// "Tu retiro de X CFT falló"
{
    pattern: /^Tu\s+retiro\s+de\s+([\d,.]+)\s*CFT\s+falló$/i,
    replace: (match, amount) => `Your withdrawal of ${amount} CFT failed`
},

// "Recibiste un depósito de X CFT"
{
    pattern: /^Recibiste\s+un\s+depósito\s+de\s+([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `You received a deposit of ${amount} CFT`
},

// "Nuevo evento Chain: [título]"
{
    pattern: /^Nuevo\s+evento\s+Chain:\s*(.+)$/i,
    replace: (match, title) => `New Chain Event: ${title}`
},
// === ACCESO RESTRINGIDO - PATRONES DINÁMICOS ===

// "Redirigiendo en X segundos..."
{
    pattern: /^Redirigiendo\s+en\s+(\d+)\s+segundos?\.\.\.$/i,
    replace: (match, seconds) => `Redirecting in ${seconds} second${seconds > 1 ? 's' : ''}...`
},
// "Debes esperar X minuto(s) antes de intentar nuevamente"
{
    pattern: /^⏳\s+Debes\s+esperar\s+(\d+)\s+minutos?\s+antes\s+de\s+intentar\s+nuevamente$/i,
    replace: (match, minutes) => `⏳ You must wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again`
},
// "Debes esperar X minuto(s) antes de reenviar"
{
    pattern: /^⏳\s+Debes\s+esperar\s+(\d+)\s+minutos?\s+antes\s+de\s+reenviar$/i,
    replace: (match, minutes) => `⏳ You must wait ${minutes} minute${minutes > 1 ? 's' : ''} before resending`
},

// "Espera M:SS"
{
    pattern: /^Espera\s+(\d+):(\d{2})$/i,
    replace: (match, min, sec) => `Wait ${min}:${sec}`
},

// "Intentos restantes: X/3"
{
    pattern: /^Intentos\s+restantes:\s+(\d+)\/3$/i,
    replace: (match, remaining) => `Attempts remaining: ${remaining}/3`
},
// "Espera M:SS" (para botones)
{
    pattern: /^Espera\s+(\d+):(\d{2})$/i,
    replace: (match, min, sec) => `Wait ${min}:${sec}`
},

// "Intentos restantes: X/3"
{
    pattern: /^Intentos\s+restantes:\s+(\d+)\/3$/i,
    replace: (match, remaining) => `Attempts remaining: ${remaining}/3`
},
// Versión simplificada sin puntos suspensivos
{
    pattern: /^Redirigiendo\s+en\s+(\d+)\s+segundos?$/i,
    replace: (match, seconds) => `Redirecting in ${seconds} second${seconds > 1 ? 's' : ''}`
},
// "Tu evento '[título]' fue aprobado"
{
    pattern: /^Tu\s+evento\s+'([^']+)'\s+fue\s+aprobado$/i,
    replace: (match, title) => `Your event '${title}' was approved`
},

// "Tu evento '[título]' fue rechazado"
{
    pattern: /^Tu\s+evento\s+'([^']+)'\s+fue\s+rechazado$/i,
    replace: (match, title) => `Your event '${title}' was rejected`
},

// "Tu participación en '[título]' está pendiente de revisión"
{
    pattern: /^Tu\s+participación\s+en\s+'([^']+)'\s+está\s+pendiente\s+de\s+revisión$/i,
    replace: (match, title) => `Your participation in '${title}' is pending review`
},

// "Creaste un stake de X CFT por Y días"
{
    pattern: /^Creaste\s+un\s+stake\s+de\s+([\d,.]+)\s*CFT\s+por\s+(\d+)\s+días?$/i,
    replace: (match, amount, days) => `You created a stake of ${amount} CFT for ${days} day${days > 1 ? 's' : ''}`
},

// "Tu stake de X CFT ha completado su período"
{
    pattern: /^Tu\s+stake\s+de\s+([\d,.]+)\s*CFT\s+ha\s+completado\s+su\s+período$/i,
    replace: (match, amount) => `Your stake of ${amount} CFT has completed its period`
},

// "Reclamaste tu stake: X CFT + Y CFT de recompensa"
{
    pattern: /^Reclamaste\s+tu\s+stake:\s+([\d,.]+)\s*CFT\s+\+\s+([\d,.]+)\s*CFT\s+de\s+recompensa$/i,
    replace: (match, principal, reward) => `You claimed your stake: ${principal} CFT + ${reward} CFT reward`
},

// "@usuario te envió una solicitud de chat"
{
    pattern: /^(@?[\w.]+)\s+te\s+envió\s+una\s+solicitud\s+de\s+chat$/i,
    replace: (match, user) => `${user} sent you a chat request`
},

// === NOTIFICACIONES AGRUPADAS ===

// "@user1, @user2 dieron like a tu publicación"
{
    pattern: /^(.+)\s+dieron\s+like\s+a\s+tu\s+publicación$/i,
    replace: (match, users) => `${users} liked your post`
},

// "@user1, @user2 comentaron en tu publicación"
{
    pattern: /^(.+)\s+comentaron\s+en\s+tu\s+publicación$/i,
    replace: (match, users) => `${users} commented on your post`
},

// "@user1, @user2 y X más dieron like a tu publicación"
{
    pattern: /^(.+)\s+y\s+(\d+)\s+más\s+dieron\s+like\s+a\s+tu\s+publicación$/i,
    replace: (match, users, count) => `${users} and ${count} more liked your post`
},

// "@user1, @user2 y X más comentaron en tu publicación"
{
    pattern: /^(.+)\s+y\s+(\d+)\s+más\s+comentaron\s+en\s+tu\s+publicación$/i,
    replace: (match, users, count) => `${users} and ${count} more commented on your post`
},

// "X usuarios compraron tus publicaciones"
{
    pattern: /^(\d+)\s+usuario[s]?\s+compraron?\s+tus\s+publicaciones$/i,
    replace: (match, count) => `${count} user${count > 1 ? 's' : ''} bought your posts`
},

// "X seguidores fueron notificados sobre tu evento"
{
    pattern: /^(\d+)\s+seguidor(?:es)?\s+fueron?\s+notificados?\s+sobre\s+tu\s+evento$/i,
    replace: (match, count) => `${count} follower${count > 1 ? 's were' : ' was'} notified about your event`
},

// "X notificaciones"
{
    pattern: /^(\d+)\s+notificaciones?$/i,
    replace: (match, count) => `${count} notification${count > 1 ? 's' : ''}`
},

// === MENSAJES DE ERROR ===

// "Error al cargar notificaciones"
{
    pattern: /^Error\s+al\s+cargar\s+notificaciones$/i,
    replace: () => `Error loading notifications`
},

// "Error al marcar como leída"
{
    pattern: /^Error\s+al\s+marcar\s+como\s+leída$/i,
    replace: () => `Error marking as read`
},

// "No se pudo eliminar la notificación"
{
    pattern: /^No\s+se\s+pudo\s+eliminar\s+la\s+notificación$/i,
    replace: () => `Could not delete notification`
},
// "Compraste X CFT de @usuario con Y MONEDA"
{
    pattern: /^Compraste\s+([\d,.]+)\s*CFT\s+de\s+(@?[\w.]+)\s+con\s+([\d,.]+)\s*(\w+)$/i,
    replace: (match, cft, user, amount, currency) => `You bought ${cft} CFT from ${user} for ${amount} ${currency}`
},

// "Oferta de venta: X CFT a Y MONEDA cada uno"
{
    pattern: /^Oferta\s+de\s+venta:\s*([\d,.]+)\s*CFT\s+a\s+([\d,.]+)\s*(\w+)\s+cada\s+uno$/i,
    replace: (match, cft, price, currency) => `Sale offer: ${cft} CFT at ${price} ${currency} each`
},
{
    pattern: /Precio fijo:\s*<strong([^>]*)>\s*\$?([\d,.]+)\s*USD\s*<\/strong>\s*por CFT/i,
    replace: (match, attrs, price) => `Fixed price: <strong${attrs}>$${price} USD</strong> per CFT`
},
// "Oferta de venta: X CFT a Y MONEDA cada uno (Vendidos: Z CFT, Restantes: W CFT)"
{
    pattern: /^Oferta\s+de\s+venta:\s*([\d,.]+)\s*CFT\s+a\s+([\d,.]+)\s*(\w+)\s+cada\s+uno\s*\(Vendidos:\s*([\d,.]+)\s*CFT,\s*Restantes:\s*([\d,.]+)\s*CFT\)$/i,
    replace: (match, cft, price, currency, sold, remaining) => `Sale offer: ${cft} CFT at ${price} ${currency} each (Sold: ${sold} CFT, Remaining: ${remaining} CFT)`
},

// "Error cargando juegos: <mensaje>"
{
    pattern: /^Error\s+cargando\s+juegos:\s*(.+)$/i,
    replace: (match, msg) => `Error loading games: ${msg}`
},

// "<N> votos"  →  "<N> votes"   (resultado del rating)
{
    pattern: /^([\d,.]+)\s+votos$/i,
    replace: (match, n) => `${n} votes`
},

// Plays formateados: "1.2K" / "3.5M" / número puro — no necesitan traducción,
// pero el tooltip accesible si lo usaras:
// "<N>K jugadores" / "<N>M jugadores"
{
    pattern: /^([\d,.]+[KM]?)\s+jugadores$/i,
    replace: (match, n) => `${n} players`
},
// === MENSAJES DE ERROR ===

// "❌ Código no encontrado"
{
    pattern: /^❌\s*Código\s*no\s*encontrado$/i,
    replace: () => `❌ Code not found`
},

// Con Unicode (❌ = \u274C)
{
    pattern: /^\u274C\s*Código\s*no\s*encontrado$/iu,
    replace: () => `\u274C Code not found`
},

// Variantes similares
{
    pattern: /^❌\s*Código\s*inválido$/i,
    replace: () => `❌ Invalid code`
},
{
    pattern: /^❌\s*Código\s*expirado$/i,
    replace: () => `❌ Code expired`
},
{
    pattern: /^❌\s*Código\s*ya\s*utilizado$/i,
    replace: () => `❌ Code already used`
},

// Patrón genérico para errores de código
{
    pattern: /^❌\s*Código\s*(.+)$/i,
    replace: (match, problema) => {
        const problemas = {
            'no encontrado': 'not found',
            'inválido': 'invalid',
            'expirado': 'expired',
            'ya utilizado': 'already used',
            'incorrecto': 'incorrect',
            'no válido': 'not valid'
        };
        
        const problemaTraducido = problemas[problema.toLowerCase()] || problema;
        return `❌ Code ${problemaTraducido}`;
    }
},

// Sin emoji
{
    pattern: /^Código\s*no\s*encontrado$/i,
    replace: () => `Code not found`
},

// Para otros errores similares
{
    pattern: /^❌\s*(.+?)\s*no\s*encontrad[oa]$/i,
    replace: (match, item) => `❌ ${item} not found`
},

// "Oferta cancelada: devueltos X CFT"
{
    pattern: /^Oferta\s+cancelada:\s*devueltos?\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Offer cancelled: ${amount} CFT returned`
},

// "Bloqueaste X CFT por Y días (APY Z%)"
{
    pattern: /^Bloqueaste\s+([\d,.]+)\s*CFT\s+por\s+(\d+)\s*días?\s*\(APY\s+([\d,.]+)%\)$/i,
    replace: (match, amount, days, apy) => `You locked ${amount} CFT for ${days} days (APY ${apy}%)`
},

// "Recibiste X CFT (capital) + Y CFT (recompensa). Total: Z CFT"
{
    pattern: /^Recibiste\s+([\d,.]+)\s*CFT\s*\(capital\)\s*\+\s*([\d,.]+)\s*CFT\s*\(recompensa\)\.\s*Total:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, capital, reward, total) => `You received ${capital} CFT (principal) + ${reward} CFT (reward). Total: ${total} CFT`
},

// "Promoción: 1 Día (500 CFT) - Contenido"
{
    pattern: /^Promoción:\s*1\s*Día\s*\(500\s*CFT\)\s*-\s*(.+)$/i,
    replace: (match, content) => `Promotion: 1 Day (500 CFT) - ${content}`
},

// "Promoción: 10 Días (4,500 CFT) - Contenido"
{
    pattern: /^Promoción:\s*10\s*Días\s*\(4,?500\s*CFT\)\s*-\s*(.+)$/i,
    replace: (match, content) => `Promotion: 10 Days (4,500 CFT) - ${content}`
},

// "Promoción: 30 Días (12,000 CFT) - Contenido"
{
    pattern: /^Promoción:\s*30\s*Días\s*\(12,?000\s*CFT\)\s*-\s*(.+)$/i,
    replace: (match, content) => `Promotion: 30 Days (12,000 CFT) - ${content}`
},

// "Depósito de X CFT desde billetera Proton - TX: hash"
{
    pattern: /^Depósito\s+de\s+([\d,.]+)\s*CFT\s+desde\s+billetera\s+Proton\s*-\s*TX:\s*(.+)$/i,
    replace: (match, amount, txHash) => `Deposit of ${amount} CFT from Proton wallet - TX: ${txHash}`
},

// "Post ID: X"
{
    pattern: /^Post\s+ID:\s*(\d+)$/i,
    replace: (match, id) => `Post ID: ${id}`
},

// === ESTADÍSTICAS DE USUARIO ===
// "X seguidores"
{
    pattern: /^(\d+)\s+seguidores?$/i,
    replace: (match, num) => `${num} followers`
},
// "10 CFT por ganador" (el valor suelto después del strong)
{
    pattern: /^\s*([\d,.]+)\s*CFT\s*por\s*ganador\s*$/i,
    replace: (match, amount) => ` ${amount} CFT per winner`
},

// "10 usuarios" (el valor suelto después de "Ganadores:")
{
    pattern: /^\s*(\d+)\s*usuarios?\s*$/i,
    replace: (match, count) => ` ${count} user${count == 1 ? '' : 's'}`
},
// "💾 Tamaño: X.XX KB/MB/GB"
{
    pattern: /^(💾\s*)?Tamaño:\s*([\d,.]+)\s*(KB|MB|GB|B)$/i,
    replace: (match, emoji, size, unit) => `${emoji || ''}Size: ${size} ${unit}`
},

// Versión sin emoji
{
    pattern: /^Tamaño:\s*([\d,.]+)\s*(KB|MB|GB|B)$/i,
    replace: (match, size, unit) => `Size: ${size} ${unit}`
},
// "📁 Archivo: nombre.ext"
{
    pattern: /^(📁\s*)?Archivo:\s*(.+)$/i,
    replace: (match, emoji, filename) => `${emoji || ''}File: ${filename}`
},

// "📅 Fecha: XX/XX/XXXX"
{
    pattern: /^(📅\s*)?Fecha:\s*(.+)$/i,
    replace: (match, emoji, date) => `${emoji || ''}Date: ${date}`
},

// "⏱️ Duración: X:XX" o "Duración: Xs"
{
    pattern: /^(⏱️\s*)?Duración:\s*([\d:]+s?)$/i,
    replace: (match, emoji, duration) => `${emoji || ''}Duration: ${duration}`
},

// "📐 Dimensiones: WxH" o "Resolución: WxH"
{
    pattern: /^(📐\s*)?(Dimensiones|Resolución):\s*(\d+)\s*[xX×]\s*(\d+)$/i,
    replace: (match, emoji, label, width, height) => `${emoji || ''}Dimensions: ${width}x${height}`
},
// ============================================
// PATRONES DINÁMICOS PARA HISTORIAL DE TRANSACCIONES
// Agregar estos al array dynamicPatterns
// ============================================

// === PROMOCIONES ===

// "Promoción: 1 Día" / "Promoción: 10 Días" / "Promoción: 30 Días"
{
    pattern: /^Promoción:\s*(\d+)\s*Días?$/i,
    replace: (match, num) => `Promotion: ${num} Day${num > 1 ? 's' : ''}`
},
{  
pattern: /^([\d,.]+)\s*(USDT|USDC)\/CFT$/i,
    replace: (match, price, currency) => `${price} ${currency}/CFT`
},

// === FRASES PARA LISTING (deben ir ANTES de patrones genéricos)

// Para el texto completo con HTML
{
    pattern: /^The listing is confirmed for <strong[^>]*>.*<\/strong>\. Sé el primero en intercambiar en Alcor DEX sin comisiones\.$/i,
    replace: (match) => {
        // Extraer la fecha del strong
        const dateMatch = match.match(/<strong[^>]*>(.*?)<\/strong>/);
        const date = dateMatch ? dateMatch[1] : '';
        return `The listing is confirmed for <strong>${date}</strong>. Be the first to trade on Alcor DEX with no fees.`;
    }
},

// Para la frase específica en español
{
    pattern: /^Sé el primero en intercambiar en Alcor DEX sin comisiones\.$/i,
    replace: () => `Be the first to trade on Alcor DEX with no fees.`
},

{
    pattern: /^Sé el primero en intercambiar en Alcor DEX sin comisiones$/i,
    replace: () => `Be the first to trade on Alcor DEX with no fees`
},

// Para la otra frase
{
    pattern: /^Podrás seguir el precio y estadísticas de CFT\.$/i,
    replace: () => `You will be able to track the price and statistics of CFT.`
},

// Total con moneda: "1.00 USDT"
{
    pattern: /^([\d,.]+)\s*(USDT|USDC)$/i,
    replace: (match, amount, currency) => `${amount} ${currency}`
},

// Estadísticas: "X operaciones • Y% éxito"
{
    pattern: /^(\d+)\s*operaciones?\s*•\s*([\d,.]+)%\s*éxito$/i,
    replace: (match, ops, rate) => `${ops} operation${ops > 1 ? 's' : ''} • ${rate}% success`
},

// "Hace Xmin" / "Hace Xh" / "Hace Xd"
{
    pattern: /^Hace\s+(\d+)(min|h|d)$/i,
    replace: (match, num, unit) => `${num}${unit} ago`
},

// "⭐ X ops"
{
    pattern: /^⭐\s*(\d+)\s*ops$/i,
    replace: (match, num) => `⭐ ${num} ops`
},

// Mensaje de acceso restringido
{
    pattern: /^Realiza\s+una\s+compra\s+de\s+mínimo\s+([\d,.]+)\s*USD\s+para\s+desbloquear\s+el\s+P2P$/i,
    replace: (match, amount) => `Make a purchase of at least ${amount} USD to unlock P2P`
},

// "Volumen: X CFT"
{
    pattern: /^Volumen:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, vol) => `Volume: ${vol} CFT`
},

// Tooltip del gráfico: "Fecha: X, Precio: Y"
{
    pattern: /^Fecha:\s*(.+),\s*Precio:\s*([\d,.]+)$/i,
    replace: (match, date, price) => `Date: ${date}, Price: ${price}`
},
// "Plan desconocido"
{
    pattern: /^Plan\s*desconocido$/i,
    replace: () => `Unknown plan`
},

// "@username • Descripción de contenido..."
{
    pattern: /^(@?[\w.]+)\s*•\s*(.+)$/i,
    replace: (match, user, desc) => `${user} • ${desc}`
},

// === DEPÓSITOS ===

// "X CFT depositados desde tu billetera Proton"
{
    pattern: /^([\d,.]+)\s*CFT\s*depositados?\s*desde\s*tu\s*billetera\s*Proton$/i,
    replace: (match, amount) => `${amount} CFT deposited from your Proton wallet`
},

// "Depósito desde Billetera"
{
    pattern: /^Depósito\s*desde\s*Billetera$/i,
    replace: () => `Deposit from Wallet`
},

// === RETIROS ===

// "Retiro Solicitado" / "Retiro en Proceso" / etc.
{
    pattern: /^Retiro\s*Solicitado$/i,
    replace: () => `Withdrawal Requested`
},
{
    pattern: /^Retiro\s*en\s*Proceso$/i,
    replace: () => `Withdrawal Processing`
},
{
    pattern: /^Retiro\s*Completado$/i,
    replace: () => `Withdrawal Completed`
},
{
    pattern: /^Retiro\s*Fallido$/i,
    replace: () => `Withdrawal Failed`
},
{
    pattern: /^Retiro\s*Cancelado$/i,
    replace: () => `Withdrawal Cancelled`
},
{
    pattern: /^Retiro\s*Procesado$/i,
    replace: () => `Withdrawal Processed`
},

// "Retiro de tokens CFT"
{
    pattern: /^Retiro\s*de\s*tokens?\s*CFT$/i,
    replace: () => `CFT token withdrawal`
},

// === P2P ===

// "Venta P2P a @username"
{
    pattern: /^Venta\s*P2P\s*a\s*(@?[\w.]+)$/i,
    replace: (match, username) => `P2P Sale to ${username}`
},

// "Compra P2P de @username"
{
    pattern: /^Compra\s*P2P\s*de\s*(@?[\w.]+)$/i,
    replace: (match, username) => `P2P Purchase from ${username}`
},

// "X CFT • Y USD" (formato P2P)
{
    pattern: /^([\d,.]+)\s*CFT\s*•\s*([\d,.]+)\s*(USD|USDT|USDC|ARS|EUR)$/i,
    replace: (match, cft, amount, currency) => `${cft} CFT • ${amount} ${currency}`
},

// === OFERTAS P2P ===

// "Oferta P2P: Activa" / "Oferta P2P: Parcialmente vendida" / etc.
{
    pattern: /^Oferta\s*P2P:\s*Activa$/i,
    replace: () => `P2P Offer: Active`
},
{
    pattern: /^Oferta\s*P2P:\s*Parcialmente\s*vendida$/i,
    replace: () => `P2P Offer: Partially sold`
},
{
    pattern: /^Oferta\s*P2P:\s*Completada$/i,
    replace: () => `P2P Offer: Completed`
},
{
    pattern: /^Oferta\s*P2P:\s*Cancelada$/i,
    replace: () => `P2P Offer: Cancelled`
},

// "Oferta de venta: X CFT a Y MONEDA cada uno"
{
    pattern: /^Oferta\s*de\s*venta:\s*([\d,.]+)\s*CFT\s*a\s*([\d,.]+)\s*(USD|USDT|USDC|ARS|EUR)\s*cada\s*uno$/i,
    replace: (match, cft, price, currency) => `Sale offer: ${cft} CFT at ${price} ${currency} each`
},

// "(Vendidos: X CFT, Restantes: Y CFT)"
{
    pattern: /^\(Vendidos:\s*([\d,.]+)\s*CFT,\s*Restantes:\s*([\d,.]+)\s*CFT\)$/i,
    replace: (match, sold, remaining) => `(Sold: ${sold} CFT, Remaining: ${remaining} CFT)`
},

// "Oferta cancelada: X CFT devueltos"
{
    pattern: /^Oferta\s*cancelada:\s*([\d,.]+)\s*CFT\s*devueltos$/i,
    replace: (match, amount) => `Offer cancelled: ${amount} CFT returned`
},

// === STAKES ===

// "Transacción de Stake"
{
    pattern: /^Transacción\s*de\s*Stake$/i,
    replace: () => `Stake Transaction`
},

// "Stake creado: X CFT bloqueados por Y días"
{
    pattern: /^Stake\s*creado:\s*([\d,.]+)\s*CFT\s*bloqueados?\s*por\s*(\d+)\s*días?$/i,
    replace: (match, amount, days) => `Stake created: ${amount} CFT locked for ${days} days`
},

// === FRASES PARA LISTING DE COINGECKO ===

// "Podrás seguir el precio y estadísticas de CFT."
{
    pattern: /^Podrás\s+seguir\s+el\s+precio\s+y\s+estadísticas\s+de\s+CFT\.$/i,
    replace: () => `You will be able to track the price and statistics of CFT.`
},

// "Sé el primero en intercambiar en Alcor DEX sin comisiones."
{
    pattern: /^Sé\s+el\s+primero\s+en\s+intercambiar\s+en\s+Alcor\s+DEX\s+sin\s+comisiones\.$/i,
    replace: () => `Be the first to trade on Alcor DEX with no fees.`
},

// Versión con "Sé" acentuado
{
    pattern: /^S[eé]\s+el\s+primero\s+en\s+intercambiar\s+en\s+Alcor\s+DEX\s+sin\s+comisiones\.$/i,
    replace: () => `Be the first to trade on Alcor DEX with no fees.`
},

// === PATRONES GENÉRICOS PARA FRASES SIMILARES ===

// "Podrás seguir el precio y estadísticas de [token]."
{
    pattern: /^Podrás\s+seguir\s+el\s+precio\s+y\s+estadísticas\s+de\s+([A-Z]+)\.$/i,
    replace: (match, token) => `You will be able to track the price and statistics of ${token}.`
},

// "Sé el primero en intercambiar en [exchange] sin comisiones."
{
    pattern: /^S[eé]\s+el\s+primero\s+en\s+intercambiar\s+en\s+([\w\s]+)\s+sin\s+comisiones\.$/i,
    replace: (match, exchange) => `Be the first to trade on ${exchange} with no fees.`
},

// "Sin comisiones"
{
    pattern: /^sin\s+comisiones\.?$/i,
    replace: () => `with no fees.`
},

// "Sé el primero"
{
    pattern: /^S[eé]\s+el\s+primero$/i,
    replace: () => `Be the first`
},

// "Recompensa reclamada: X CFT"
{
    pattern: /^Recompensa\s*reclamada:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Reward claimed: ${amount} CFT`
},

// === COMPRAS/VENTAS DE POSTS ===

// "Venta a DisplayName"
{
    pattern: /^Venta\s*a\s*(.+)$/i,
    replace: (match, name) => `Sale to ${name}`
},

// "Compra de DisplayName"
{
    pattern: /^Compra\s*de\s*(.+)$/i,
    replace: (match, name) => `Purchase from ${name}`
},

// "@username • Contenido del post..."
{
    pattern: /^@([\w.]+)\s*•\s*(.*)$/i,
    replace: (match, username, content) => `@${username} • ${content}`
},

// "Post sin contenido"
{
    pattern: /^Post\s*sin\s*contenido$/i,
    replace: () => `Post without content`
},

// === MONTOS CON SIGNO ===

// "+X CFT" (ingreso)
{
    pattern: /^\+([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `+${amount} CFT`
},

// "-X CFT" (egreso)
{
    pattern: /^-([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `-${amount} CFT`
},

// === FECHAS ===

// Formato de fecha corta: "12/12/2025" o "12-12-2025"
{
    pattern: /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/,
    replace: (match, day, month, year) => `${month}/${day}/${year}`
},

// === ESTADOS VACÍOS ===

// "No hay transacciones aún"
{
    pattern: /^No\s*hay\s*transacciones\s*aún$/i,
    replace: () => `No transactions yet`
},

// "Las transacciones aparecerán aquí cuando compres o vendas posts"
{
    pattern: /^Las\s*transacciones\s*aparecerán\s*aquí\s*cuando\s*compres\s*o\s*vendas\s*posts$/i,
    replace: () => `Transactions will appear here when you buy or sell posts`
},

// "Error cargando transacciones"
{
    pattern: /^Error\s*cargando\s*transacciones$/i,
    replace: () => `Error loading transactions`
},

// === POSTS RENTABLES ===

// "No hay posts vendidos aún"
{
    pattern: /^No\s*hay\s*posts\s*vendidos\s*aún$/i,
    replace: () => `No posts sold yet`
},

// "Cuando vendas posts, aparecerán aquí ordenados por rentabilidad"
{
    pattern: /^Cuando\s*vendas\s*posts,\s*aparecerán\s*aquí\s*ordenados\s*por\s*rentabilidad$/i,
    replace: () => `When you sell posts, they will appear here sorted by profitability`
},

// "+X CFT" con número grande
{
    pattern: /^\+([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `+${amount} CFT`
},

// "X ventas"
{
    pattern: /^(\d+)\s*ventas?$/i,
    replace: (match, num) => `${num} sale${num !== '1' ? 's' : ''}`
},

// === POSTS CON INTERACCIONES ===

// "No hay posts con interacciones aún"
{
    pattern: /^No\s*hay\s*posts\s*con\s*interacciones\s*aún$/i,
    replace: () => `No posts with interactions yet`
},

// "Cuando tus posts reciban likes, comentarios o respuestas, aparecerán aquí"
{
    pattern: /^Cuando\s*tus\s*posts\s*reciban\s*likes,\s*comentarios\s*o\s*respuestas,\s*aparecerán\s*aquí$/i,
    replace: () => `When your posts receive likes, comments or replies, they will appear here`
},

// "X interacciones"
{
    pattern: /^(\d+)\s*interacciones?$/i,
    replace: (match, num) => `${num} interaction${num !== '1' ? 's' : ''}`
},

// "X🤍 Y💬 Z↔ W📤" (formato de stats de interacciones)
{
    pattern: /^(\d+)🤍\s*(\d+)💬\s*(\d+).+\s*(\d+).+$/i,
    replace: (match, likes, comments, reposts, shares) => `${likes}🤍 ${comments}💬 ${reposts}↔ ${shares}📤`
},

// === NÚMEROS FORMATEADOS ===

// "X mill" (millones)
{
    pattern: /^([\d,.]+)\s*mill$/i,
    replace: (match, num) => `${num}M`
},

// Números con separador de miles español (1.234,56) - convertir a formato inglés
{
    pattern: /^([\d.]+),([\d]+)$/,
    replace: (match, integer, decimal) => `${integer.replace(/\./g, ',')}.${decimal}`
},
// "X siguiendo"
{
    pattern: /^(\d+)\s+siguiendo$/i,
    replace: (match, num) => `${num} following`
},

// "X CFT"
{
    pattern: /^(\d+)\s+CFT$/i,
    replace: (match, num) => `${num} CFT`
},
        {
        pattern: /^Mostrando\s+(\d+)\s+de\s+(\d+)\s+usuarios?$/i,
        replace: (match, shown, total) => `Showing ${shown} of ${total} users`
    },
    
    // "X usuarios sugeridos por tus seguidos"
    {
        pattern: /^(\d+)\s+usuarios?\s+sugeridos?\s+por\s+tus\s+seguidos?$/i,
        replace: (match, num) => `${num} users suggested by your followed users`
    },
    
    // "0 usuarios sugeridos"
    {
        pattern: /^(\d+)\s+usuarios?\s+sugeridos?$/i,
        replace: (match, num) => `${num} suggested users`
    },
    // Participantes
    { 
        pattern: /^(👤\s*)?(\d+)\s*participantes?$/i,
        replace: (match, emoji, num) => `${emoji || ''}${num} participants`
    },
    

// Reposteaste • Xh/Xd/Xmin/etc
{
    pattern: /^Reposteaste\s*•\s*(\d+)(seg|min|h|d|sem|mes|a)$/i,
    replace: (match, num, unit) => {
        const units = { 'seg': 's', 'min': 'min', 'h': 'h', 'd': 'd', 'sem': 'wk', 'mes': 'mo', 'a': 'y' };
        return `You reposted • ${num}${units[unit.toLowerCase()] || unit}`;
    }
},

// ¿Confirmas la compra? Precio: X CFT (con salto de línea)
{
    pattern: /^¿Confirmas\s*la\s*compra\?\s*[\n\r]*\s*Precio:\s*(\d+)\s*CFT$/i,
    replace: (match, num) => `Confirm purchase?\nPrice: ${num} CFT`
},

// Comprar por X CFT
{
    pattern: /^Comprar\s*por\s*(\d+)\s*CFT$/i,
    replace: (match, num) => `Buy for ${num} CFT`
},

// X interacciones / X interactions
{
    pattern: /^(\d+)\s*interacciones?$/i,
    replace: (match, num) => `${num} interactions`
},

// Precio: X CFT
{
    pattern: /^Precio:\s*(\d+)\s*CFT$/i,
    replace: (match, num) => `Price: ${num} CFT`
},
// reposteó • Xh (tercera persona)
{
    pattern: /^reposteó\s*•\s*(\d+)(seg|min|h|d|sem|mes|a)$/i,
    replace: (match, num, unit) => {
        const units = { 'seg': 's', 'min': 'min', 'h': 'h', 'd': 'd', 'sem': 'wk', 'mes': 'mo', 'a': 'y' };
        return `reposted • ${num}${units[unit.toLowerCase()] || unit}`;
    }
},

// 🟢 Activo • X participantes (texto combinado)
{
    pattern: /^(🟢\s*)?Activo\s*•\s*(\d+)\s*participantes?$/i,
    replace: (match, emoji, num) => `${emoji || ''}Active • ${num} participants`
},

// 🔴 Finalizado • X participantes
{
    pattern: /^(🔴\s*)?Finalizado\s*•\s*(\d+)\s*participantes?$/i,
    replace: (match, emoji, num) => `${emoji || ''}Ended • ${num} participants`
},

// ⏰ Finalizado • X participantes
{
    pattern: /^(⏰\s*)?Finalizado\s*•\s*(\d+)\s*participantes?$/i,
    replace: (match, emoji, num) => `${emoji || ''}Ended • ${num} participants`
},

// 📝 Tipo de respuesta: X
{
    pattern: /^(📝\s*)?Tipo\s*de\s*respuesta:\s*(.+)$/i,
    replace: (match, emoji, type) => {
        const types = {
            'imagen': 'Image', 'image': 'Image',
            'video': 'Video',
            'texto': 'Text', 'text': 'Text',
            'audio': 'Audio'
        };
        return `${emoji || ''}Response type: ${types[type.toLowerCase()] || type}`;
    }
},

// @username • Xh/Xd/Xmin (formato de usuario con tiempo)
{
    pattern: /^(@\w+)\s*•\s*(\d+)(seg|min|h|d|sem|mes|a)$/i,
    replace: (match, username, num, unit) => {
        const units = { 'seg': 's', 'min': 'min', 'h': 'h', 'd': 'd', 'sem': 'wk', 'mes': 'mo', 'a': 'y' };
        return `${username} • ${num}${units[unit.toLowerCase()] || unit}`;
    }
},

// Post original de @username
{
    pattern: /^Post\s*original\s*de\s*(@\w+)$/i,
    replace: (match, username) => `Original post by ${username}`
},

// 💎 X CFT por voto
{
    pattern: /^(💎\s*)?(\d+)\s*CFT\s*por\s*voto$/i,
    replace: (match, emoji, num) => `${emoji || ''}${num} CFT per vote`
},

// 📊 X votos totales
{
    pattern: /^(📊\s*)?(\d+)\s*votos?\s*totales?$/i,
    replace: (match, emoji, num) => `${emoji || ''}${num} total votes`
},

// 👤 X votos
{
    pattern: /^(👤\s*)?(\d+)\s*votos?$/i,
    replace: (match, emoji, num) => `${emoji || ''}${num} votes`
},

    // 💎 X CFT por voto
    {
        pattern: /^(💎\s*)?(\d+)\s*CFT\s*por\s*voto$/i,
        replace: (match, emoji, num) => `${emoji || ''}${num} CFT per vote`
    },
    
    // 📊 X votos totales
    {
        pattern: /^(📊\s*)?(\d+)\s*votos?\s*totales?$/i,
        replace: (match, emoji, num) => `${emoji || ''}${num} total votes`
    },
    
    // 👤 X votos (sin "totales")
    {
        pattern: /^(👤\s*)?(\d+)\s*votos?$/i,
        replace: (match, emoji, num) => `${emoji || ''}${num} votes`
    },
    
    // 👥 X/Y (formato participantes actuales/máximo)
    {
        pattern: /^(👥\s*)?(\d+)\/(\d+)$/i,
        replace: (match, emoji, current, max) => `${emoji || ''}${current}/${max}`
    },
    
    // ⏰ X días restantes / days remaining
    {
        pattern: /^(⏰\s*)?(\d+)\s*días?\s*restantes?$/i,
        replace: (match, emoji, num) => `${emoji || ''}${num} days remaining`
    },
    
    // Menos de X día(s)
    {
        pattern: /^Menos\s*de\s*(\d+)\s*días?$/i,
        replace: (match, num) => `Less than ${num} day${num > 1 ? 's' : ''}`
    },
    
    // 📊 Encuesta (con emoji)
    {
        pattern: /^(📊\s*)?Encuesta$/i,
        replace: (match, emoji) => `${emoji || ''}Poll`
    },
    
    // 🎯 Campaña (con emoji)
    {
        pattern: /^(🎯\s*)?Campaña$/i,
        replace: (match, emoji) => `${emoji || ''}Campaign`
    },
    // "@usuario dio like a X de tus publicaciones"
{
  pattern: /^@([\w.]+)\s+dio like a\s+(\d+)\s+de tus publicaciones$/i,
  replace: (match, user, count) => `@${user} liked ${count} of your posts`
},

// "@usuario y X más dieron like a tu publicación"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más dieron like a tu publicación$/i,
  replace: (match, user, count) => `@${user} and ${count} more liked your post`
},

// "@usuario y X más dieron like a tus publicaciones"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más dieron like a tus publicaciones$/i,
  replace: (match, user, count) => `@${user} and ${count} more liked your posts`
},

// "@usuario dio like a X de tus comentarios"
{
  pattern: /^@([\w.]+)\s+dio like a\s+(\d+)\s+de tus comentarios$/i,
  replace: (match, user, count) => `@${user} liked ${count} of your comments`
},

// "@usuario y X más dieron like a tus comentarios"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más dieron like a tus comentarios$/i,
  replace: (match, user, count) => `@${user} and ${count} more liked your comments`
},

// "@usuario comentó X veces en tus publicaciones"
{
  pattern: /^@([\w.]+)\s+comentó\s+(\d+)\s+veces en tus publicaciones$/i,
  replace: (match, user, count) => `@${user} commented ${count} times on your posts`
},

// "@usuario y X más comentaron en tus publicaciones"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más comentaron en tus publicaciones$/i,
  replace: (match, user, count) => `@${user} and ${count} more commented on your posts`
},

// "@usuario respondió X veces a tu comentario"
{
  pattern: /^@([\w.]+)\s+respondió\s+(\d+)\s+veces a tu comentario$/i,
  replace: (match, user, count) => `@${user} replied ${count} times to your comment`
},

// "@usuario y X más respondieron a tus comentarios"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más respondieron a tus comentarios$/i,
  replace: (match, user, count) => `@${user} and ${count} more replied to your comments`
},

// "@usuario reposteó X de tus publicaciones"
{
  pattern: /^@([\w.]+)\s+reposteó\s+(\d+)\s+de tus publicaciones$/i,
  replace: (match, user, count) => `@${user} reposted ${count} of your posts`
},

// "@usuario y X más repostearon tus publicaciones"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más repostearon tus publicaciones$/i,
  replace: (match, user, count) => `@${user} and ${count} more reposted your posts`
},

// "@usuario te mencionó X veces"
{
  pattern: /^@([\w.]+)\s+te mencionó\s+(\d+)\s+veces$/i,
  replace: (match, user, count) => `@${user} mentioned you ${count} times`
},

// "@usuario y X más te mencionaron"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más te mencionaron$/i,
  replace: (match, user, count) => `@${user} and ${count} more mentioned you`
},

// "@usuario y X más comenzaron a seguirte"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más comenzaron a seguirte$/i,
  replace: (match, user, count) => `@${user} and ${count} more started following you`
},

// "@usuario participó en tu Chain Event (X participaciones)"
{
  pattern: /^@([\w.]+)\s+participó en tu Chain Event\s+\((\d+)\s+participaciones\)$/i,
  replace: (match, user, count) => `@${user} participated in your Chain Event (${count} participations)`
},

// "@usuario y X más participaron en tu Chain Event"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más participaron en tu Chain Event$/i,
  replace: (match, user, count) => `@${user} and ${count} more participated in your Chain Event`
},

// "@usuario dio like (X likes) a tu participación"
{
  pattern: /^@([\w.]+)\s+dio like\s+\((\d+)\s+likes\)\s+a tu participación$/i,
  replace: (match, user, count) => `@${user} liked (${count} likes) your participation`
},

// "@usuario y X más dieron like a tu participación"
{
  pattern: /^@([\w.]+)\s+y\s+(\d+)\s+más dieron like a tu participación$/i,
  replace: (match, user, count) => `@${user} and ${count} more liked your participation`
},

// "Tienes X nuevas notificaciones"
{
  pattern: /^Tienes\s+(\d+)\s+nuevas notificaciones$/i,
  replace: (match, count) => `You have ${count} new notifications`
},
    // 🎵 Audio (con emoji)
    {
        pattern: /^(🎵\s*)?Audio$/i,
        replace: (match, emoji) => `${emoji || ''}Audio`
    },
    
    // 🟢 Activo
    {
        pattern: /^(🟢\s*)?Activo$/i,
        replace: (match, emoji) => `${emoji || ''}Active`
    },
    
    // 🔴 Finalizado
    {
        pattern: /^(🔴\s*)?Finalizado$/i,
        replace: (match, emoji) => `${emoji || ''}Ended`
    },
    
    // ⏰ Finalizado
    {
        pattern: /^(⏰\s*)?Finalizado$/i,
        replace: (match, emoji) => `${emoji || ''}Ended`
    },
    
    // 💎 X tokens
    {
        pattern: /^(💎\s*)?(\d+)\s*tokens?$/i,
        replace: (match, emoji, num) => `${emoji || ''}${num} tokens`
    },
    
    // 🏆 X ganadores / Por ganador
    {
        pattern: /^(🏆\s*)?(\d+)\s*ganadores?$/i,
        replace: (match, emoji, num) => `${emoji || ''}${num} winners`
    },
    {
        pattern: /^Por\s*ganador$/i,
        replace: () => `Per winner`
    },
    
    // Total tokens: X
    {
        pattern: /^Total\s*tokens:?\s*(\d+)$/i,
        replace: (match, num) => `Total tokens: ${num}`
    },
    
    // X CFT para Y participantes
    {
        pattern: /^([\d,.]+)\s*CFT\s*para\s*(\d+)\s*participantes?$/i,
        replace: (match, cft, num) => `${cft} CFT for ${num} participants`
    },
    
    // Respuestas: Tipo
    {
        pattern: /^Respuestas?:?\s*(📷\s*Imagen|🎥\s*Video|📝\s*Texto|🎵\s*Audio|Imagen|Video|Texto|Audio)$/i,
        replace: (match, type) => {
            const types = {
                '📷 imagen': '📷 Image', '📷 Imagen': '📷 Image',
                '🎥 video': '🎥 Video', '🎥 Video': '🎥 Video',
                '📝 texto': '📝 Text', '📝 Texto': '📝 Text',
                '🎵 audio': '🎵 Audio', '🎵 Audio': '🎵 Audio',
                'imagen': 'Image', 'Imagen': 'Image',
                'video': 'Video', 'Video': 'Video',
                'texto': 'Text', 'Texto': 'Text',
                'audio': 'Audio', 'Audio': 'Audio'
            };
            return `Responses: ${types[type] || type}`;
        }
    },
    
    // Cupos restantes: X
    {
        pattern: /^(🏆\s*)?Cupos?\s*restantes:?\s*(\d+)$/i,
        replace: (match, emoji, num) => `${emoji || ''}Slots remaining: ${num}`
    },
    
    // Aprobadas: X
    {
        pattern: /^(✅\s*)?Aprobadas?:?\s*(\d+)$/i,
        replace: (match, emoji, num) => `${emoji || ''}Approved: ${num}`
    },
    
    // Pendientes: X
    {
        pattern: /^(⏳\s*)?Pendientes?:?\s*(\d+)$/i,
        replace: (match, emoji, num) => `${emoji || ''}Pending: ${num}`
    },
    
    // Rechazadas: X
    {
        pattern: /^(❌\s*)?Rechazadas?:?\s*(\d+)$/i,
        replace: (match, emoji, num) => `${emoji || ''}Rejected: ${num}`
    },
    
    // X días restantes (sin emoji)
    {
        pattern: /^(\d+)\s*días?\s*restantes?$/i,
        replace: (match, num) => `${num} days remaining`
    },
    
    // X día restante (singular)
    {
        pattern: /^(\d+)\s*día\s*restante$/i,
        replace: (match, num) => `${num} day remaining`
    },
    
    // Ver X respuestas
    {
        pattern: /^Ver\s*(\d+)\s*respuestas?$/i,
        replace: (match, num) => `View ${num} replies`
    },
    
    // X comentarios
    {
        pattern: /^(\d+)\s*comentarios?$/i,
        replace: (match, num) => `${num} comments`
    },
    {
    pattern: /^⚡\s*(\d+)\s*posts?\s*multimedia\s*encontrados$/i,
    replace: (match, count) => `⚡ ${count} multimedia post${count == 1 ? '' : 's'} found`
},

// Versión genérica (sin emoji)
{
    pattern: /^(\d+)\s*posts?\s*multimedia\s*encontrados$/i,
    replace: (match, count) => `${count} multimedia post${count == 1 ? '' : 's'} found`
},
    
    // X likes
    {
        pattern: /^(\d+)\s*likes?$/i,
        replace: (match, num) => `${num} likes`
    },
    
    // X interacciones
    {
        pattern: /^(\d+)\s*interacciones?$/i,
        replace: (match, num) => `${num} interactions`
    },
    // 💎 X tokens por voto (variante sin CFT)
{
    pattern: /^(💎\s*)?(\d+)\s*tokens?\s*por\s*voto$/i,
    replace: (match, emoji, num) => `${emoji || ''}${num} tokens per vote`
},

// 👥 X participantes
{
    pattern: /^(👥\s*)?(\d+)\s*participantes?$/i,
    replace: (match, emoji, num) => `${emoji || ''}${num} participants`
},

// 👤 X participantes (variante con emoji diferente)
{
    pattern: /^(👤\s*)?(\d+)\s*participantes?$/i,
    replace: (match, emoji, num) => `${emoji || ''}${num} participants`
},

    // De: @username
    {
        pattern: /^De:\s*(@[\w\.]+)$/i,
        replace: (match, username) => `From: ${username}`
    },
    
    // A: @username
    {
        pattern: /^A:\s*(@[\w\.]+)$/i,
        replace: (match, username) => `To: ${username}`
    },
    
    // Precio: X.XX CFT
    {
        pattern: /^Precio:\s*([\d,.]+)\s*CFT$/i,
        replace: (match, price) => `Price: ${price} CFT`
    },

        {
        pattern: /^Transacción\s*#(\d+)$/i,
        replace: (match, num) => `Transaction #${num}`
    },

    // Tiempo relativo mejorado
    {
        pattern: /^(\d+)\s*(seg|min|h|d|sem|mes|a)$/i,
        replace: (match, num, unit) => {
            const units = { 
                'seg': 's', 
                'min': 'min', 
                'h': 'h', 
                'd': 'd', 
                'sem': 'wk', 
                'mes': 'mo', 
                'a': 'y' 
            };
            return `${num}${units[unit.toLowerCase()] || unit}`;
        }
    },
    
    // hace X minutos/horas/días
    {
        pattern: /^hace\s*(\d+)\s*(segundos?|minutos?|horas?|días?|semanas?|meses?|años?)$/i,
        replace: (match, num, unit) => {
            const units = {
                'segundo': 'second', 'segundos': 'seconds',
                'minuto': 'minute', 'minutos': 'minutes',
                'hora': 'hour', 'horas': 'hours',
                'día': 'day', 'dias': 'days', 'días': 'days',
                'semana': 'week', 'semanas': 'weeks',
                'mes': 'month', 'meses': 'months',
                'año': 'year', 'años': 'years'
            };
            return `${num} ${units[unit.toLowerCase()] || unit} ago`;
        }
    },
    
    // === BALANCE Y MONTOS CFT ===
    
    // "X.XXX CFT Disponibles" (con números decimales)
    {
        pattern: /^([\d,.]+)\s*CFT\s*Disponibles?$/i,
        replace: (match, amount) => `${amount} CFT Available`
    },
    
    // "Total: X.XXX CFT (Y en billetera)"
    {
        pattern: /^Total:\s*([\d,.]+)\s*CFT\s*\(([\d,.]+)\s*en\s*billetera\)$/i,
        replace: (match, total, wallet) => `Total: ${total} CFT (${wallet} in wallet)`
    },
    
    // === NIVELES Y MÍNIMOS ===
    
    // "🏆 Nivel X - Mínimo: Y CFT"
    {
        pattern: /^(🏆\s*)?Nivel\s+(.+?)\s*-\s*Mínimo:\s*([\d,.]+)\s*CFT$/i,
        replace: (match, emoji, level, amount) => `${emoji || ''}${level} Level - Minimum: ${amount} CFT`
    },
    
    // "Mínimo: X CFT"
    {
        pattern: /^Mínimo:\s*([\d,.]+)\s*CFT$/i,
        replace: (match, amount) => `Minimum: ${amount} CFT`
    },
    
    // "Máximo: X CFT"
    {
        pattern: /^Máximo:\s*([\d,.]+)\s*CFT$/i,
        replace: (match, amount) => `Maximum: ${amount} CFT`
    },
    
    // === EVENTOS/DISPLAY ===

// "Mostrando: X evento/eventos" (con emojis específicos)
{
    pattern: /^🔗\s*Mostrando:\s*(\d+)\s*evento?s?$/i,
    replace: (match, count) => `🔗 Showing: ${count} event${count == 1 ? '' : 's'}`
},
{
    pattern: /^📊\s*Mostrando:\s*(\d+)\s*evento?s?$/i,
    replace: (match, count) => `📊 Showing: ${count} event${count == 1 ? '' : 's'}`
},
{
    pattern: /^🎯\s*Mostrando:\s*(\d+)\s*evento?s?$/i,
    replace: (match, count) => `🎯 Showing: ${count} event${count == 1 ? '' : 's'}`
},
{
    pattern: /^🎵\s*Mostrando:\s*(\d+)\s*evento?s?\s*(?:necesitamos\s*traducirlos\s*de\s*manera\s*dinamica)?$/i,
    replace: (match, count) => `🎵 Showing: ${count} event${count == 1 ? '' : 's'}${match.includes('necesitamos') ? ' need to be translated dynamically' : ''}`
},

// Versión genérica (sin emoji específico)
{
    pattern: /^Mostrando:\s*(\d+)\s*evento?s?$/i,
    replace: (match, count) => `Showing: ${count} event${count == 1 ? '' : 's'}`
},
    
    // === ESTADOS DE USUARIO ===
    
    // "@username - Estado"
    {
        pattern: /^(@[\w.]+)\s*-\s*(.+)$/i,
        replace: (match, username, status) => {
            const statusTranslations = {
                'listo para depositar': 'Ready to deposit',
                'listo para retirar': 'Ready to withdraw',
                'verificado': 'Verified',
                'pendiente': 'Pending',
                'activo': 'Active',
                'inactivo': 'Inactive',
                'conectado': 'Connected',
                'desconectado': 'Disconnected'
            };
            
            const translatedStatus = statusTranslations[status.toLowerCase()] || status;
            return `${username} - ${translatedStatus}`;
        }
    },
    
    // === RANGOS DE MONTOS ===
    
    // "Entre X y Y CFT"
    {
        pattern: /^Entre\s*([\d,.]+)\s*y\s*([\d,.]+)\s*CFT$/i,
        replace: (match, min, max) => `Between ${min} and ${max} CFT`
    },
    
    // "Desde X CFT hasta Y CFT"
    {
        pattern: /^Desde\s*([\d,.]+)\s*CFT\s*hasta\s*([\d,.]+)\s*CFT$/i,
        replace: (match, min, max) => `From ${min} CFT to ${max} CFT`
    },
    
    // === BALANCE Y DISPONIBILIDAD ===
    
    // "X CFT disponibles"
    {
        pattern: /^([\d,.]+)\s*CFT\s*disponibles?$/i,
        replace: (match, amount) => `${amount} CFT available`
    },
    
    // "X CFT en billetera"
    {
        pattern: /^([\d,.]+)\s*CFT\s*en\s*billetera$/i,
        replace: (match, amount) => `${amount} CFT in wallet`
    },
    
    // "X CFT bloqueados"
    {
        pattern: /^([\d,.]+)\s*CFT\s*bloqueados?$/i,
        replace: (match, amount) => `${amount} CFT locked`
    },
    
    // === PLANES Y NIVELES ===
    
    // "Plan X - Costo: Y CFT"
    {
        pattern: /^Plan\s+(.+?)\s*-\s*Costo:\s*([\d,.]+)\s*CFT$/i,
        replace: (match, plan, cost) => `${plan} Plan - Cost: ${cost} CFT`
    },
    
    // "Nivel X de Y"
    {
        pattern: /^Nivel\s+(\d+)\s+de\s+(\d+)$/i,
        replace: (match, current, total) => `Level ${current} of ${total}`
    },
    
    // === TRANSACCIONES ===
    
    // "Enviado: X CFT"
    {
        pattern: /^Enviado:\s*([\d,.]+)\s*CFT$/i,
        replace: (match, amount) => `Sent: ${amount} CFT`
    },

    // ============================================
// PATRONES DINÁMICOS PARA TOOLTIPS DE WALLET
// Agregar estos al array dynamicPatterns
// ============================================

// === TOOLTIPS DE GRÁFICOS ===

// "Saldo ChainFeed: X CFT"
{
    pattern: /^Saldo\s*ChainFeed:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `ChainFeed Balance: ${amount} CFT`
},

// "Reposteaste • 3d" (con cualquier unidad de tiempo al final)
{
    pattern: /^Reposteaste\s*•\s*(\d+)(seg|min|h|d|sem|mes|a|s)$/i,
    replace: (match, num, unit) => {
        const units = { 
            'seg': 's', 
            'min': 'min', 
            'h': 'h', 
            'd': 'd', 
            'sem': 'wk', 
            'mes': 'mo', 
            'a': 'y',
            's': 's'  // Por si viene ya en inglés
        };
        return `You reposted • ${num}${units[unit.toLowerCase()] || unit}`;
    }
},

// "📍 Tu saldo actual en ChainFeed"
{
    pattern: /^(📍\s*)?Tu\s*saldo\s*actual\s*en\s*ChainFeed$/i,
    replace: (match, emoji) => `${emoji || ''}Your current ChainFeed balance`
},

// "📝 Descripción del movimiento"
{
    pattern: /^(📝\s*)(.+)$/i,
    replace: (match, emoji, desc) => {
        const descriptions = {
            'Venta de publicación': 'Post sale',
            'Compra de publicación': 'Post purchase',
            'Depósito desde billetera Proton': 'Deposit from Proton wallet',
            'Retiro a billetera Proton': 'Withdrawal to Proton wallet',
            'Promoción de contenido': 'Content promotion',
            'Recompensa por publicar': 'Posting reward',
            'Recompensa por like': 'Like reward',
            'Recompensa por comentario': 'Comment reward',
            'Participación en evento': 'Event participation',
            'Stake creado': 'Stake created',
            'Recompensa de stake': 'Stake reward'
        };
        return `${emoji || ''}${descriptions[desc] || desc}`;
    }
},

// "📈 +X CFT" (ganancia)
{
    pattern: /^(📈\s*)\+([\d,.]+)\s*CFT$/i,
    replace: (match, emoji, amount) => `${emoji}+${amount} CFT`
},

// "📉 -X CFT" o "📉 X CFT" (gasto)
{
    pattern: /^(📉\s*)-?([\d,.]+)\s*CFT$/i,
    replace: (match, emoji, amount) => `${emoji}-${amount} CFT`
},

// Añade esto AL PRINCIPIO de tu array dynamicPatterns
{
    // Patrón ESPECÍFICO para tu caso exacto
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en <strong[^>]*>acquire a stake in the startup, and not in token purchases<\/strong>\.$/i,
    replace: () => `Currently, a private round is open for strategic investors interested in <strong>acquire a stake in the startup, and not in token purchases</strong>.`
},

// Y este patrón más genérico después
{
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en (.+?)\.?$/i,
    replace: (match, contenido) => `Currently, a private round is open for strategic investors interested in ${contenido}`
},

// === TOOLTIPS DE TRANSACCIONES ===

// "Promoción: X Día(s)"
{
    pattern: /^Promoción:\s*(\d+)\s*Días?$/i,
    replace: (match, num) => `Promotion: ${num} Day${num > 1 ? 's' : ''}`
},

// "X CFT depositados desde tu billetera Proton"
{
    pattern: /^([\d,.]+)\s*CFT\s*depositados?\s*desde\s*tu\s*billetera\s*Proton$/i,
    replace: (match, amount) => `${amount} CFT deposited from your Proton wallet`
},

// "Venta a @username" / "Compra de @username"
{
    pattern: /^Venta\s*a\s*(@?[\w.]+)$/i,
    replace: (match, username) => `Sale to ${username}`
},
{
    pattern: /^Compra\s*de\s*(@?[\w.]+)$/i,
    replace: (match, username) => `Purchase from ${username}`
},

// "Venta P2P a @username"
{
    pattern: /^Venta\s*P2P\s*a\s*(@?[\w.]+)$/i,
    replace: (match, username) => `P2P Sale to ${username}`
},

// "Compra P2P de @username"
{
    pattern: /^Compra\s*P2P\s*de\s*(@?[\w.]+)$/i,
    replace: (match, username) => `P2P Purchase from ${username}`
},

// === PÁRRAFOS DE INVERSIÓN (con etiquetas HTML) ===

// "En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en <strong>adquirir una participación en la startup, y no en la compra de tokens</strong>."
{
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en <strong>adquirir una participación en la startup, y no en la compra de tokens<\/strong>\.$/i,
    replace: () => `Currently, a private round is open for strategic investors interested in <strong>acquiring a stake in the startup, and not in token purchases</strong>.`
},

// Versión con Unicode para caracteres especiales
{
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en <strong>adquirir una participación en la startup, y no en la compra de tokens<\/strong>\.$/iu,
    replace: () => `Currently, a private round is open for strategic investors interested in <strong>acquiring a stake in the startup, and not in token purchases</strong>.`
},

// Versión separada para el texto dentro del strong
{
    pattern: /^adquirir una participación en la startup, y no en la compra de tokens$/i,
    replace: () => `acquire a stake in the startup, and not in token purchases`
},

// Patrón que maneja solo el texto exterior (sin strong)
{
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en (.+)$/i,
    replace: (match, resto) => `Currently, a private round is open for strategic investors interested in ${resto}`
},
// 🔥 AÑADE ESTE PATRÓN EN TU ARRAY dynamicPatterns (al principio, antes de patrones genéricos)

// Patrón ESPECÍFICO para el párrafo de inversiones (ya con el strong traducido)
{
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en <strong[^>]*>acquire a stake in the startup, and not in token purchases<\/strong>\.$/i,
    replace: () => `Currently, a private round is open for strategic investors interested in <strong>acquire a stake in the startup, and not in token purchases</strong>.`
},

// Versión más flexible
{
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en <strong[^>]*>(.+?)<\/strong>\.$/i,
    replace: (match, contenidoStrong) => {
        // Si el contenido del strong ya está en inglés
        if (contenidoStrong.includes('acquire a stake') || contenidoStrong.includes('token purchases')) {
            return `Currently, a private round is open for strategic investors interested in <strong>${contenidoStrong}</strong>.`;
        }
        // Si no está traducido, traducirlo también
        const translatedStrong = contenidoStrong
            .replace('adquirir una participación en la startup, y no en la compra de tokens',
                     'acquire a stake in the startup, and not in token purchases');
        return `Currently, a private round is open for strategic investors interested in <strong>${translatedStrong}</strong>.`;
    }
},

// Patrón para el texto sin etiquetas strong (fallback)
{
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en (.+?)\.$/i,
    replace: (match, contenido) => `Currently, a private round is open for strategic investors interested in ${contenido}.`
},

// === TOOLTIPS DE FECHAS EN GRÁFICOS ===

// Fechas en formato español: "lunes, 12 de diciembre de 2025"
{
    pattern: /^(lunes|martes|miércoles|jueves|viernes|sábado|domingo),?\s*(\d{1,2})\s*de\s*(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre)\s*de\s*(\d{4})$/i,
    replace: (match, day, date, month, year) => {
        const days = {
            'lunes': 'Monday', 'martes': 'Tuesday', 'miércoles': 'Wednesday',
            'jueves': 'Thursday', 'viernes': 'Friday', 'sábado': 'Saturday', 'domingo': 'Sunday'
        };
        const months = {
            'enero': 'January', 'febrero': 'February', 'marzo': 'March',
            'abril': 'April', 'mayo': 'May', 'junio': 'June',
            'julio': 'July', 'agosto': 'August', 'septiembre': 'September',
            'octubre': 'October', 'noviembre': 'November', 'diciembre': 'December'
        };
        return `${days[day.toLowerCase()]}, ${months[month.toLowerCase()]} ${date}, ${year}`;
    }
},

// Fechas cortas: "12 dic" o "12 dic."
{
    pattern: /^(\d{1,2})\s*(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\.?$/i,
    replace: (match, date, month) => {
        const months = {
            'ene': 'Jan', 'feb': 'Feb', 'mar': 'Mar', 'abr': 'Apr',
            'may': 'May', 'jun': 'Jun', 'jul': 'Jul', 'ago': 'Aug',
            'sep': 'Sep', 'oct': 'Oct', 'nov': 'Nov', 'dic': 'Dec'
        };
        return `${months[month.toLowerCase()]} ${date}`;
    }
},

// === TOOLTIPS DE NIVELES Y RETIROS ===

// "🏆 Nivel Premium - Mínimo: X CFT"
{
    pattern: /^(🏆\s*)?Nivel\s*Premium\s*-\s*Mínimo:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, emoji, amount) => `${emoji || ''}Premium Level - Minimum: ${amount} CFT`
},
{
    pattern: /^📥\s*Compraste\s+([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `📥 You bought ${amount} CFT`
},

// "📤 Vendiste X CFT"
{
    pattern: /^📤\s*Vendiste\s+([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `📤 You sold ${amount} CFT`
},
// "⭐ Nivel Avanzado - Mínimo: X CFT"
{
    pattern: /^(⭐\s*)?Nivel\s*Avanzado\s*-\s*Mínimo:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, emoji, amount) => `${emoji || ''}Advanced Level - Minimum: ${amount} CFT`
},

// "🔰 Nivel Básico - Mínimo: X CFT"
{
    pattern: /^(🔰\s*)?Nivel\s*Básico\s*-\s*Mínimo:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, emoji, amount) => `${emoji || ''}Basic Level - Minimum: ${amount} CFT`
},
// 🔥 AÑADE ESTO AL PRINCIPIO DE TU ARRAY dynamicPatterns
{
    // Patrón para texto MIXTO (texto + HTML)
    pattern: /^En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en /i,
    replace: () => `Currently, a private round is open for strategic investors interested in `
},
// === NOTIFICACIONES - PATRONES DINÁMICOS ===

// "X notificaciones leídas"
{
    pattern: /^(\d+)\s*notificaciones?\s*leídas?$/i,
    replace: (match, num) => `${num} read notification${num > 1 ? 's' : ''}`
},

// "🗑️ X eliminadas"
{
    pattern: /^🗑️\s*(\d+)\s*eliminadas?$/i,
    replace: (match, num) => `🗑️ ${num} deleted`
},

// "Solicitud enviada a @username"
{
    pattern: /^(📩\s*)?Solicitud\s+enviada\s+a\s+(@[\w.]+)$/i,
    replace: (match, emoji, username) => `${emoji || ''}Request sent to ${username}`
},

// "✅ Ahora sigues a @username"
{
    pattern: /^(✅\s*)?Ahora\s+sigues\s+a\s+(@[\w.]+)$/i,
    replace: (match, emoji, username) => `${emoji || ''}You're now following ${username}`
},

// "❌ Dejaste de seguir a @username"
{
    pattern: /^(❌\s*)?Dejaste\s+de\s+seguir\s+a\s+(@[\w.]+)$/i,
    replace: (match, emoji, username) => `${emoji || ''}You unfollowed ${username}`
},

// "Solicitud cancelada a @username"
{
    pattern: /^(❌\s*)?Solicitud\s+cancelada\s+a\s+(@[\w.]+)$/i,
    replace: (match, emoji, username) => `${emoji || ''}Request canceled to ${username}`
},

// "✉️ Abriendo chat con @username..."
{
    pattern: /^(✉️\s*)?Abriendo\s+chat\s+con\s+(@[\w.]+)\.{0,3}$/i,
    replace: (match, emoji, username) => `${emoji || ''}Opening chat with ${username}...`
},
// === NOTIFICACIONES PUSH - PATRONES DINÁMICOS ===

// "HTTP XXX" (códigos de error HTTP)
{
    pattern: /^HTTP\s+(\d{3})$/i,
    replace: (match, code) => `HTTP ${code}`
},

// "Enabled: true/false, Token: SI/NO"
{
    pattern: /^Enabled:\s+(true|false),\s+Token:\s+(SI|NO)$/i,
    replace: (match, enabled, hasToken) => {
        const enabledText = enabled === 'true' ? 'true' : 'false';
        const tokenText = hasToken === 'SI' ? 'YES' : 'NO';
        return `Enabled: ${enabledText}, Token: ${tokenText}`;
    }
},
// "te envió una solicitud de chat"
{
    pattern: /^(.+?)\s+te\s+envió\s+una\s+solicitud\s+de\s+chat$/i,
    replace: (match, user) => `${user} sent you a chat request`
},

// "X participantes"
{
    pattern: /^(\d+)\s+participantes?$/i,
    replace: (match, num) => `${num} participant${num > 1 ? 's' : ''}`
},

// "Ganaste X CFT"
{
    pattern: /^Ganaste\s+([\d,.]+)\s+CFT$/i,
    replace: (match, amount) => `You earned ${amount} CFT`
},

// "💎 Ganaste X CFT"
{
    pattern: /^💎\s+Ganaste\s+([\d,.]+)\s+CFT$/i,
    replace: (match, amount) => `💎 You earned ${amount} CFT`
},

// "Duración: X:XX"
{
    pattern: /^Duración:\s*(\d+:\d+)$/i,
    replace: (match, time) => `Duration: ${time}`
},

// "Por @username"
{
    pattern: /^Por\s+(@[\w.]+)$/i,
    replace: (match, username) => `By ${username}`
},
// === NOTIFICACIONES DEL SISTEMA ===

// "Abriendo perfil de @username..."
{
    pattern: /^Abriendo\s*perfil\s*de\s*@(.+?)\.{3}$/i,
    replace: (match, username) => `Opening profile of @${username}...`
},

// Variante sin puntos suspensivos
{
    pattern: /^Abriendo\s*perfil\s*de\s*@(.+?)$/i,
    replace: (match, username) => `Opening profile of @${username}...`
},

// "Cargando perfil de @username..."
{
    pattern: /^Cargando\s*perfil\s*de\s*@(.+?)\.{3}$/i,
    replace: (match, username) => `Loading profile of @${username}...`
},

// Notificaciones genéricas de carga
{
    pattern: /^Cargando\s*(.+?)\.{3}$/i,
    replace: (match, contenido) => `Loading ${contenido}...`
},
{
    pattern: /^Abriendo\s*(.+?)\.{3}$/i,
    replace: (match, contenido) => `Opening ${contenido}...`
},

// Patrón para diferentes acciones con perfiles
{
    pattern: /^(.+?)\s*perfil\s*de\s*@(.+?)\.{3}$/i,
    replace: (match, accion, username) => {
        const acciones = {
            'abriendo': 'Opening',
            'cargando': 'Loading',
            'buscando': 'Searching',
            'visitando': 'Visiting',
            'accediendo': 'Accessing',
            'mostrando': 'Showing'
        };
        
        const accionTraducida = acciones[accion.toLowerCase()] || accion;
        return `${accionTraducida} profile of @${username}...`;
    }
},
// Notificaciones de éxito
{
    pattern: /^✅\s*(.+?)\s*exitosamente$/i,
    replace: (match, accion) => `✅ ${accion} successfully`
},

// Notificaciones de error
{
    pattern: /^❌\s*Error\s*al\s*(.+)$/i,
    replace: (match, accion) => `❌ Error ${accion}`
},

// Notificaciones de información
{
    pattern: /^ℹ️\s*(.+?)\.{3}$/i,
    replace: (match, mensaje) => `ℹ️ ${mensaje}...`
},
// "X días"
{
    pattern: /^(\d+)\s+días?$/i,
    replace: (match, num) => `${num} day${num > 1 ? 's' : ''}`
},

// "hace Xm" / "hace Xh" / "hace Xd"
{
    pattern: /^hace\s+(\d+)(m|h|d)$/i,
    replace: (match, num, unit) => {
        const units = { 'm': 'm', 'h': 'h', 'd': 'd' };
        return `${num}${units[unit]} ago`;
    }
},

// Fecha con mes en español: "12 ene" / "5 feb"
{
    pattern: /^(\d{1,2})\s+(ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic)\.?$/i,
    replace: (match, day, month) => {
        const months = {
            'ene': 'Jan', 'feb': 'Feb', 'mar': 'Mar', 'abr': 'Apr',
            'may': 'May', 'jun': 'Jun', 'jul': 'Jul', 'ago': 'Aug',
            'sep': 'Sep', 'oct': 'Oct', 'nov': 'Nov', 'dic': 'Dec'
        };
        return `${months[month.toLowerCase()]} ${day}`;
    }
},

// "X comentó en tu publicación"
{
    pattern: /^(.+?)\s+comentó\s+en\s+tu\s+publicación$/i,
    replace: (match, user) => `${user} commented on your post`
},

// "X le dio like a tu publicación"
{
    pattern: /^(.+?)\s+le\s+dio\s+like\s+a\s+tu\s+publicación$/i,
    replace: (match, user) => `${user} liked your post`
},

// "X interactuó con tu contenido"
{
    pattern: /^(.+?)\s+interactuó\s+con\s+tu\s+contenido$/i,
    replace: (match, user) => `${user} interacted with your content`
},

// "No se pudieron cargar los detalles"
{
    pattern: /^No\s+se\s+pudieron\s+cargar\s+los\s+detalles$/i,
    replace: () => `Could not load details`
},

// "Sin detalles para mostrar"
{
    pattern: /^Sin\s+detalles\s+para\s+mostrar$/i,
    replace: () => `No details to show`
},

// "Alcanza X tokens totales para mínimo de Y CFT (faltan Z tokens)"
{
    pattern: /^Alcanza\s*([\d,.]+)\s*tokens?\s*totales?\s*para\s*mínimo\s*de\s*([\d,.]+)\s*CFT\s*\(faltan\s*([\d,.]+)\s*tokens?\)$/i,
    replace: (match, target, min, remaining) => `Reach ${target} total tokens for minimum of ${min} CFT (${remaining} tokens remaining)`
},

// === TOOLTIPS DE PROMOCIONES ===

// "⏰ X días restantes" / "⏰ Xh restantes" / "⏰ X min restantes"
{
    pattern: /^(⏰\s*)?(\d+)\s*días?\s*restantes?$/i,
    replace: (match, emoji, num) => `${emoji || ''}${num} day${num > 1 ? 's' : ''} remaining`
},
{
    pattern: /^(⏰\s*)?(\d+)h\s*restantes?$/i,
    replace: (match, emoji, num) => `${emoji || ''}${num}h remaining`
},
{
    pattern: /^(⏰\s*)?(\d+)\s*min\s*restantes?$/i,
    replace: (match, emoji, num) => `${emoji || ''}${num} min remaining`
},

// "Expirando..."
{
    pattern: /^Expirando\.{0,3}$/i,
    replace: () => `Expiring...`
},

// === TOOLTIPS DE STAKES ===

// "Bloqueado hasta: fecha"
{
    pattern: /^Bloqueado\s*hasta:\s*(.+)$/i,
    replace: (match, date) => `Locked until: ${date}`
},

// "Recompensa estimada: X CFT"
{
    pattern: /^Recompensa\s*estimada:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Estimated reward: ${amount} CFT`
},

// "APY: X%"
{
    pattern: /^APY:\s*([\d,.]+)%$/i,
    replace: (match, percent) => `APY: ${percent}%`
},

// "Período: X días"
{
    pattern: /^Período:\s*(\d+)\s*días?$/i,
    replace: (match, num) => `Period: ${num} day${num > 1 ? 's' : ''}`
},
// "No se pudo conectar: [cualquier mensaje en español]"
{
    pattern: /^No se pudo conectar:\s*No se pudo obtener sesión de Proton$/i,
    replace: () => `Could not connect: Could not get Proton session`
},

// Versión genérica para otros mensajes
{
    pattern: /^No se pudo conectar:\s*(.+)$/i,
    replace: (match, msg) => {
        // Traducir el mensaje interno si es conocido
        const msgTranslations = {
            'no se pudo obtener sesión de proton': 'Could not get Proton session',
            'protonwebsdk no está cargado': 'ProtonWebSDK is not loaded',
            'usuario canceló la conexión': 'User cancelled connection',
            'tiempo de espera agotado': 'Connection timed out'
        };
        
        const translatedMsg = msgTranslations[msg.toLowerCase().trim()] || msg;
        return `Could not connect: ${translatedMsg}`;
    }
},
// === TOOLTIPS DE REPORTES/INFRACCIONES ===

// "X reporte(s) sin confirmar"
{
    pattern: /^(\d+)\s*reportes?\s*sin\s*confirmar$/i,
    replace: (match, num) => `${num} unconfirmed report${num > 1 ? 's' : ''}`
},

// "Primera infracción confirmada"
{
    pattern: /^Primera\s*infracción\s*confirmada$/i,
    replace: () => `First confirmed infraction`
},
// Patrón que ya tienes (para cuando YA tiene el @usuario en contenido)
{
    pattern: /^(@?[\w.]+)\s+comentó\s+en\s+tu\s+publicación$/i,
    replace: (match, user) => `${user} commented on your post`
},

// AGREGAR: Patrón para cuando solo dice "Comentó tu publicación"
{
    pattern: /^Comentó\s+(?:en\s+)?tu\s+publicación$/i,
    replace: () => `Commented on your post`
},

// Para likes también
{
    pattern: /^Dio\s+like\s+a\s+tu\s+publicación$/i,
    replace: () => `Liked your post`
},
// "Infracciones confirmadas"
{
    pattern: /^Infracciones\s*confirmadas$/i,
    replace: () => `Confirmed infractions`
},

// "Faltan X infracción(es) para sanción de Y días de bloqueo"
{
    pattern: /^Faltan\s*(\d+)\s*infracciones?\s*para\s*sanción\s*de\s*(\d+)\s*días?\s*de\s*bloqueo$/i,
    replace: (match, remaining, days) => `${remaining} infraction${remaining > 1 ? 's' : ''} remaining for ${days} day${days > 1 ? 's' : ''} block sanction`
},

// "🔒 Tu cuenta está bloqueada por X día(s) más"
{
    pattern: /^(🔒\s*)?Tu\s*cuenta\s*está\s*bloqueada\s*por\s*(\d+)\s*días?\s*más$/i,
    replace: (match, emoji, days) => `${emoji || ''}Your account is blocked for ${days} more day${days > 1 ? 's' : ''}`
},

// === TOOLTIPS DE HISTORIAL DE TRANSACCIONES ===

// "ID: X"
{
    pattern: /^ID:\s*([\w-]+)$/i,
    replace: (match, id) => `ID: ${id}`
},

// "Cantidad: X CFT"
{
    pattern: /^Cantidad:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Amount: ${amount} CFT`
},

// "Cuenta: @username"
{
    pattern: /^Cuenta:\s*(@?[\w.]+)$/i,
    replace: (match, account) => `Account: ${account}`
},

// "Será procesada en la próxima hora."
{
    pattern: /^Será\s*procesada\s*en\s*la\s*próxima\s*hora\.?$/i,
    replace: () => `Will be processed within the next hour.`
},

// === TOOLTIPS DE OFERTAS P2P ===

// "Oferta de venta: X CFT a Y USD cada uno"
{
    pattern: /^Oferta\s*de\s*venta:\s*([\d,.]+)\s*CFT\s*a\s*([\d,.]+)\s*(USD|USDT|USDC)\s*cada\s*uno$/i,
    replace: (match, cft, price, currency) => `Sale offer: ${cft} CFT at ${price} ${currency} each`
},

// "(Vendidos: X CFT, Restantes: Y CFT)"
{
    pattern: /^\(Vendidos:\s*([\d,.]+)\s*CFT,\s*Restantes:\s*([\d,.]+)\s*CFT\)$/i,
    replace: (match, sold, remaining) => `(Sold: ${sold} CFT, Remaining: ${remaining} CFT)`
},

// "Oferta cancelada: X CFT devueltos"
{
    pattern: /^Oferta\s*cancelada:\s*([\d,.]+)\s*CFT\s*devueltos$/i,
    replace: (match, amount) => `Offer cancelled: ${amount} CFT returned`
},

// === TOOLTIPS DE GRÁFICO DE DISTRIBUCIÓN ===

// "Ingresos por Ventas: X CFT"
{
    pattern: /^Ingresos\s*por\s*Ventas:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Sales Income: ${amount} CFT`
},

// "Gastos en Compras: X CFT"
{
    pattern: /^Gastos\s*en\s*Compras:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Purchase Expenses: ${amount} CFT`
},

// === TOOLTIPS DE PLANES DE PROMOCIÓN ===

// "1 Día (500 CFT)" etc
{
    pattern: /^(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)$/i,
    replace: (match, days, cost) => `${days} Day${days > 1 ? 's' : ''} (${cost} CFT)`
},

// "Cantidad: X promoción(es)"
{
    pattern: /^Cantidad:\s*(\d+)\s*promociones?$/i,
    replace: (match, num) => `Quantity: ${num} promotion${num > 1 ? 's' : ''}`
},

// "Tokens: X CFT"
{
    pattern: /^Tokens:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Tokens: ${amount} CFT`
},
// Permitir etiquetas HTML opcionales alrededor
{
    pattern: /💎\s*Recompensa:\s*([\d,.]+)\s*CFT\s*por\s*ganador/i,
    replace: (match, amount) => `💎 Reward: ${amount} CFT per winner`
},
{
    pattern: /🏆\s*Ganadores:\s*(\d+)\s*usuarios?/i,
    replace: (match, count) => `🏆 Winners: ${count} user${count == 1 ? '' : 's'}`
},
{
    pattern: /👥\s*Participantes\s*actuales:\s*(\d+)\/(\d+)/i,
    replace: (match, current, total) => `👥 Current participants: ${current}/${total}`
},
{
    pattern: /📄\s*Tipo\s*de\s*respuesta:\s*([^<\n]+)/i,
    replace: (match, type) => {
        const typeMap = {
            'image': 'Image',
            'texto': 'Text',
            'video': 'Video',
            'audio': 'Audio'
        };
        const translatedType = typeMap[type.trim().toLowerCase()] || type.trim();
        return `📄 Response type: ${translatedType}`;
    }
},
// === TOOLTIPS COMBINADOS CON MÚLTIPLES LÍNEAS ===

// Para tooltips que tienen saltos de línea, necesitas procesarlos línea por línea
// Esto se maneja mejor con una función especial

// "💰 Venta de publicación" / "🛒 Compra de publicación" etc (con emoji)
{
    pattern: /^(💰\s*)Venta\s*de\s*publicación$/i,
    replace: (match, emoji) => `${emoji}Post sale`
},
{
    pattern: /^(🛒\s*)Compra\s*de\s*publicación$/i,
    replace: (match, emoji) => `${emoji}Post purchase`
},
{
    pattern: /^(📥\s*)Depósito\s*desde\s*billetera\s*Proton$/i,
    replace: (match, emoji) => `${emoji}Deposit from Proton wallet`
},
{
    pattern: /^(💸\s*)Retiro\s*a\s*billetera\s*Proton$/i,
    replace: (match, emoji) => `${emoji}Withdrawal to Proton wallet`
},
{
    pattern: /^(📢\s*)Promoción\s*de\s*contenido$/i,
    replace: (match, emoji) => `${emoji}Content promotion`
},

// === TOOLTIPS DE POSTS RENTABLES/INTERACCIONES ===

// "+X CFT"
{
    pattern: /^\+([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `+${amount} CFT`
},

// "X ventas"
{
    pattern: /^(\d+)\s*ventas?$/i,
    replace: (match, num) => `${num} sale${num > 1 ? 's' : ''}`
},

// "X interacciones"
{
    pattern: /^(\d+)\s*interacciones?$/i,
    replace: (match, num) => `${num} interaction${num > 1 ? 's' : ''}`
},

// === NÚMEROS CON "mill" (millones) ===

// "X mill" o "X.X mill"
{
    pattern: /^([\d,.]+)\s*mill$/i,
    replace: (match, num) => `${num}M`
},

// ============================================
// AGREGAR ESTOS PATRONES AL ARRAY dynamicPatterns
// Buscar la sección de patrones y agregar ANTES del cierre del array
// ============================================

// === DESCRIPCIONES DE TRANSACCIONES COMPLEJAS ===

// "📝 Publicación • Promoción: X Día(s) (Y CFT) - Contenido"
{
    pattern: /^(📝\s*)?Publicación\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*(.+)$/i,
    replace: (match, emoji, days, cost, content) => `${emoji || ''}Post • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - ${content}`
},

// "📝 Evento Chain • Promoción: X Día(s) (Y CFT) - Contenido"
{
    pattern: /^(📝\s*)?Evento\s*Chain\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*(.+)$/i,
    replace: (match, emoji, days, cost, content) => `${emoji || ''}Chain Event • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - ${content}`
},

// "Publicación • Promoción: X Día(s) (Y CFT) - Contenido" (sin emoji)
{
    pattern: /^Publicación\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*(.+)$/i,
    replace: (match, days, cost, content) => `Post • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - ${content}`
},

// "Evento Chain • Promoción: X Día(s) (Y CFT) - Contenido" (sin emoji)
{
    pattern: /^Evento\s*Chain\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*(.+)$/i,
    replace: (match, days, cost, content) => `Chain Event • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - ${content}`
},

// === VARIANTES MÁS GENÉRICAS ===

// "📝 Publicación • Descripción"
{
    pattern: /^(📝\s*)?Publicación\s*•\s*(.+)$/i,
    replace: (match, emoji, desc) => `${emoji || ''}Post • ${desc}`
},

// "Publicación • Descripción" (sin emoji)
{
    pattern: /^Publicación\s*•\s*(.+)$/i,
    replace: (match, desc) => `Post • ${desc}`
},

// "📝 Evento Chain • Descripción"
{
    pattern: /^(📝\s*)?Evento\s*Chain\s*•\s*(.+)$/i,
    replace: (match, emoji, desc) => `${emoji || ''}Chain Event • ${desc}`
},

// "Evento Chain • Descripción" (sin emoji)
{
    pattern: /^Evento\s*Chain\s*•\s*(.+)$/i,
    replace: (match, desc) => `Chain Event • ${desc}`
},

// === PATRONES PARA CONTENIDO CON USUARIO ===

// "@usuario • Promoción: X Día(s) (Y CFT) - Contenido"
{
    pattern: /^(@[\w.]+)\s*•\s*Promoción:\s*(\d+)\s*Días?\s*\(([\d,.]+)\s*CFT\)\s*-\s*(.+)$/i,
    replace: (match, user, days, cost, content) => `${user} • Promotion: ${days} Day${days > 1 ? 's' : ''} (${cost} CFT) - ${content}`
},
{
    pattern: /^([\d,.]+)\s*(USDT|USDC)\/CFT$/i,
    replace: (match, price, currency) => `${price} ${currency}/CFT`
},

// Cantidad CFT: "100 CFT"
{
    pattern: /^([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `${amount} CFT`
},

// Total con moneda: "1.00 USDT"
{
    pattern: /^([\d,.]+)\s*(USDT|USDC)$/i,
    replace: (match, amount, currency) => `${amount} ${currency}`
},

// Transacciones completadas: "X transacciones"
{
    pattern: /^(\d+)\s*transacciones?$/i,
    replace: (match, num) => `${num} transaction${num > 1 ? 's' : ''}`
},

// Tasa de éxito: "X% éxito"
{
    pattern: /^([\d,.]+)%\s*éxito$/i,
    replace: (match, rate) => `${rate}% success`
},

// Estadísticas de usuario: "X operaciones • Y% éxito"
{
    pattern: /^(\d+)\s*operaciones?\s*•\s*([\d,.]+)%\s*éxito$/i,
    replace: (match, ops, rate) => `${ops} operation${ops > 1 ? 's' : ''} • ${rate}% success`
},

// Variación positiva: "+X.XX%"
{
    pattern: /^([+-][\d,.]+)%$/i,
    replace: (match, change) => `${change}%`
},

// Fecha relativa: "hace X minutos/horas/días"
{
    pattern: /^hace\s+(\d+)\s+(minutos?|horas?|días?|semanas?|meses?)$/i,
    replace: (match, num, unit) => {
        const unitMap = {
            'minuto': 'minute', 'minutos': 'minutes',
            'hora': 'hour', 'horas': 'hours',
            'día': 'day', 'días': 'days',
            'semana': 'week', 'semanas': 'weeks',
            'mes': 'month', 'meses': 'months'
        };
        return `${num} ${unitMap[unit] || unit} ago`;
    }
},

// Oferta creada: "Oferta creada hace X"
{
    pattern: /^Oferta\s+creada\s+hace\s+(.+)$/i,
    replace: (match, time) => `Offer created ${time} ago`
},

// Monto mínimo/máximo: "Mín: X USDT" / "Máx: X USDT"
{
    pattern: /^Mín:\s*([\d,.]+)\s*(USDT|USDC)$/i,
    replace: (match, amount, currency) => `Min: ${amount} ${currency}`
},
{
    pattern: /^Máx:\s*([\d,.]+)\s*(USDT|USDC)$/i,
    replace: (match, amount, currency) => `Max: ${amount} ${currency}`
},

// Disponible: "Disponible: X CFT"
{
    pattern: /^Disponible:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `Available: ${amount} CFT`
},

// Vendedor/Comprador con rating: "@usuario ⭐ X.X"
{
    pattern: /^(@[\w.]+)\s*⭐\s*([\d.]+)$/i,
    replace: (match, user, rating) => `${user} ⭐ ${rating}`
},

// Comisión: "Comisión: X%"
{
    pattern: /^Comisión:\s*([\d,.]+)%$/i,
    replace: (match, rate) => `Commission: ${rate}%`
},

// Recibirás: "Recibirás: X CFT"
{
    pattern: /^Recibirás:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, amount) => `You'll receive: ${amount} CFT`
},

// Pagarás: "Pagarás: X USDT"
{
    pattern: /^Pagarás:\s*([\d,.]+)\s*(USDT|USDC)$/i,
    replace: (match, amount, currency) => `You'll pay: ${amount} ${currency}`
},

// Sin ofertas: "No hay ofertas disponibles"
{
    pattern: /^No\s+hay\s+ofertas\s+disponibles$/i,
    replace: () => `No offers available`
},

// Sin historial: "No tienes transacciones"
{
    pattern: /^No\s+tienes\s+transacciones$/i,
    replace: () => `You have no transactions`
},

// Límites de compra: "Límite: X - Y USDT"
{
    pattern: /^Límite:\s*([\d,.]+)\s*-\s*([\d,.]+)\s*(USDT|USDC)$/i,
    replace: (match, min, max, currency) => `Limit: ${min} - ${max} ${currency}`
},

// Estado de oferta con emoji
{
    pattern: /^🟢\s*Activa?$/i,
    replace: () => `🟢 Active`
},
{
    pattern: /^🔴\s*Cancelada?$/i,
    replace: () => `🔴 Cancelled`
},
{
    pattern: /^✅\s*Completada?$/i,
    replace: () => `✅ Completed`
},
{
    pattern: /^⏳\s*Pendiente$/i,
    replace: () => `⏳ Pending`
},
// Tooltip del gráfico: "Fecha: X, Precio: Y"
{
    pattern: /^Fecha:\s*(.+),\s*Precio:\s*([\d,.]+)$/i,
    replace: (match, date, price) => `Date: ${date}, Price: ${price}`
},
{
    pattern: /^Hace\s+(\d+)min$/i,
    replace: (match, mins) => `${mins}min ago`
},

// Patrón: "Hace Xh"
{
    pattern: /^Hace\s+(\d+)h$/i,
    replace: (match, hours) => `${hours}h ago`
},

// Patrón: "Hace Xd"
{
    pattern: /^Hace\s+(\d+)d$/i,
    replace: (match, days) => `${days}d ago`
},
// "Reposteaste • Xh/Xd/Xmin/etc"
{
    pattern: /^Reposteaste\s*•\s*(\d+)(seg|min|h|d|sem|mes|a)$/i,
    replace: (match, num, unit) => {
        const units = { 'seg': 's', 'min': 'min', 'h': 'h', 'd': 'd', 'sem': 'wk', 'mes': 'mo', 'a': 'y' };
        return `You reposted • ${num}${units[unit.toLowerCase()] || unit}`;
    }
},

// "Reposteaste • Ahora"
{
    pattern: /^Reposteaste\s*•\s*Ahora$/i,
    replace: () => `You reposted • Now`
},

// "Reposteaste" (solo)
{
    pattern: /^Reposteaste$/i,
    replace: () => `You reposted`
},

// "reposteó • Xh" (tercera persona)
{
    pattern: /^reposteó\s*•\s*(\d+)(seg|min|h|d|sem|mes|a)$/i,
    replace: (match, num, unit) => {
        const units = { 'seg': 's', 'min': 'min', 'h': 'h', 'd': 'd', 'sem': 'wk', 'mes': 'mo', 'a': 'y' };
        return `reposted • ${num}${units[unit.toLowerCase()] || unit}`;
    }
},

// "@usuario reposteó • Xh"
{
    pattern: /^(@\w+)\s+reposteó\s*•\s*(\d+)(seg|min|h|d|sem|mes|a)$/i,
    replace: (match, user, num, unit) => {
        const units = { 'seg': 's', 'min': 'min', 'h': 'h', 'd': 'd', 'sem': 'wk', 'mes': 'mo', 'a': 'y' };
        return `${user} reposted • ${num}${units[unit.toLowerCase()] || unit}`;
    }
},
// === MENSAJES DE VERIFICACIÓN/EMAIL ===

// "📧 Revisa tu email para verificar tu cuenta. Una vez verificado, podrás iniciar sesión."
{
    pattern: /^📧\s*Revisa\s*tu\s*email\s*para\s*verificar\s*tu\s*cuenta\.\s*Una\s*vez\s*verificado,\s*podrás\s*iniciar\s*sesión\.$/i,
    replace: () => `📧 Check your email to verify your account. Once verified, you will be able to log in.`
},

// Con Unicode (📧 = \u{1F4E7})
{
    pattern: /^\u{1F4E7}\s*Revisa\s*tu\s*email\s*para\s*verificar\s*tu\s*cuenta\.\s*Una\s*vez\s*verificado,\s*podrás\s*iniciar\s*sesión\.$/iu,
    replace: () => `\u{1F4E7} Check your email to verify your account. Once verified, you will be able to log in.`
},

// Versión más flexible (maneja variaciones de puntuación)
{
    pattern: /^📧\s*Revisa\s*tu\s*email\s*para\s*verificar\s*tu\s*cuenta\.?\s*(?:Una\s*vez\s*verificado,?\s*podrás\s*iniciar\s*sesión\.?)?$/i,
    replace: () => `📧 Check your email to verify your account. Once verified, you will be able to log in.`
},

// Mensaje dividido en dos partes (por si aparece en líneas separadas)
{
    pattern: /^📧\s*Revisa\s*tu\s*email\s*para\s*verificar\s*tu\s*cuenta\.$/i,
    replace: () => `📧 Check your email to verify your account.`
},
{
    pattern: /^Una\s*vez\s*verificado,\s*podrás\s*iniciar\s*sesión\.$/i,
    replace: () => `Once verified, you will be able to log in.`
},

// Patrón genérico para mensajes de verificación
{
    pattern: /^📧\s*(.+)$/i,
    replace: (match, mensaje) => {
        const traducciones = {
            'revisa tu email para verificar tu cuenta. una vez verificado, podrás iniciar sesión.': 
                'Check your email to verify your account. Once verified, you will be able to log in.',
            'verifica tu cuenta a través del email enviado.':
                'Verify your account through the email sent.',
            'email de verificación enviado.':
                'Verification email sent.'
        };
        
        const lowerMensaje = mensaje.toLowerCase();
        const mensajeTraducido = traducciones[lowerMensaje] || mensaje;
        return `📧 ${mensajeTraducido}`;
    }
},

// Sin emoji
{
    pattern: /^Revisa\s*tu\s*email\s*para\s*verificar\s*tu\s*cuenta\.\s*Una\s*vez\s*verificado,\s*podrás\s*iniciar\s*sesión\.$/i,
    replace: () => `Check your email to verify your account. Once verified, you will be able to log in.`
},
// "@usuario reposteó • Ahora"
{
    pattern: /^(@\w+)\s+reposteó\s*•\s*Ahora$/i,
    replace: (match, user) => `${user} reposted • Now`
},

// "reposteó • Ahora"
{
    pattern: /^reposteó\s*•\s*Ahora$/i,
    replace: () => `reposted • Now`
},

// "reposteó" (solo)
{
    pattern: /^reposteó$/i,
    replace: () => `reposted`
},
// === ESTADÍSTICAS DE USUARIO ===
// Patrón: "⭐ X ops"
{
    pattern: /^⭐\s*(\d+)\s*ops$/i,
    replace: (match, num) => `⭐ ${num} ops`
},
{
    pattern: /^Cancelaste\s+tu\s+oferta\s+P2P\.\s+([\d,.]+)\s*CFT\s+han\s+sido\s+devueltos?\s+a\s+tu\s+saldo$/i,
    replace: (match, amount) => `You cancelled your P2P offer. ${amount} CFT has been returned to your balance`
},
// === BADGE DE ACCESO RESTRINGIDO (dinámico) ===
// Patrón: "Realiza una compra de mínimo X USD para desbloquear el P2P"
{
    pattern: /^Realiza\s+una\s+compra\s+de\s+mínimo\s+([\d,.]+)\s*USD\s+para\s+desbloquear\s+el\s+P2P$/i,
    replace: (match, amount) => `Make a purchase of at least ${amount} USD to unlock P2P`
},

// Patrón mensaje completo de acceso denegado
{
    pattern: /^Para\s+operar\s+en\s+el\s+P2P,\s+necesitas\s+realizar\s+al\s+menos\s+una\s+compra\s+de\s+([\d,.]+)\s*USD\s+o\s+más\.$/i,
    replace: (match, amount) => `To operate in P2P, you need to make at least one purchase of ${amount} USD or more.`
},

// Patrón: "Compras realizadas: X"
{
    pattern: /^Compras\s+realizadas:\s*(\d+)$/i,
    replace: (match, num) => `Purchases made: ${num}`
},
// === BOTONES DE ESTADO DE EVENTO ===

// "✅ Ya participaste"
{
    pattern: /^\u2705\s*Ya\s*participaste$/i,
    replace: () => `\u2705 Already participated`
},

// "⏰ Evento finalizado"
{
    pattern: /^\u23F0\s*Evento\s*finalizado$/i,
    replace: () => `\u23F0 Event finished`
},

// "🎯 Participar en Campaña"
{
    pattern: /^\u{1F3AF}\s*Participar\s*en\s*Campa\u00F1a$/iu,
    replace: () => `\u{1F3AF} Participate in Campaign`
},

// Posibles variantes (sin emojis o con diferentes emojis)
{
    pattern: /^Ya\s*participaste$/i,
    replace: () => `Already participated`
},
{
    pattern: /^Evento\s*finalizado$/i,
    replace: () => `Event finished`
},
{
    pattern: /^Participar\s*en\s*Campa\u00F1a$/i,
    replace: () => `Participate in Campaign`
},

// Patrón genérico para botones de estado
{
    pattern: /^[\u2705\u23F0\u{1F3AF}\u{1F512}\u{1F513}]\s*(.+)$/iu,
    replace: (match, text) => {
        const emoji = [...match][0];
        const translations = {
            'ya participaste': 'Already participated',
            'evento finalizado': 'Event finished',
            'participar en campaña': 'Participate in Campaign',
            'evento cerrado': 'Event closed',
            'participación cerrada': 'Participation closed',
            'inscribirse': 'Sign up',
            'unirse al evento': 'Join event'
        };
        
        const lowerText = text.toLowerCase();
        const translatedText = translations[lowerText] || text;
        
        return `${emoji} ${translatedText}`;
    }
},

// === BOTONES DE PARTICIPACIÓN ESPECÍFICOS ===

// "🎵 Participar en Evento de Audio"
{
    pattern: /^\u{1F3B5}\s*Participar\s*en\s*Evento\s*de\s*Audio$/iu,
    replace: () => `\u{1F3B5} Participate in Audio Event`
},

// "📷 Participar en Evento de Imagen"
{
    pattern: /^\u{1F4F7}\s*Participar\s*en\s*Evento\s*de\s*Imagen$/iu,
    replace: () => `\u{1F4F7} Participate in Image Event`
},

// "🎥 Participar en Evento de Video"
{
    pattern: /^\u{1F3A5}\s*Participar\s*en\s*Evento\s*de\s*Video$/iu,
    replace: () => `\u{1F3A5} Participate in Video Event`
},

// "📝 Participar en Evento de Texto"
{
    pattern: /^\u{1F4DD}\s*Participar\s*en\s*Evento\s*de\s*Texto$/iu,
    replace: () => `\u{1F4DD} Participate in Text Event`
},

// Patrón genérico para cualquier tipo de evento multimedia
{
    pattern: /^([\u{1F3B5}\u{1F4F7}\u{1F3A5}\u{1F4DD}\u{1F4CA}\u{1F517}\u{1F3AF}])\s*Participar\s*en\s*Evento\s*de\s*(.+)$/iu,
    replace: (match, emoji, eventType) => {
        const typeTranslations = {
            'audio': 'Audio',
            'imagen': 'Image', 
            'video': 'Video',
            'texto': 'Text',
            'multimedia': 'Multimedia',
            'encuesta': 'Poll',
            'selección múltiple': 'Multiple Choice',
            'seleccion multiple': 'Multiple Choice',
            'votación': 'Voting',
            'votacion': 'Voting'
        };
        
        const translatedType = typeTranslations[eventType.toLowerCase()] || eventType;
        return `${emoji} Participate in ${translatedType} Event`;
    }
},

// Versión sin emoji específico
{
    pattern: /^Participar\s*en\s*Evento\s*de\s*(.+)$/i,
    replace: (match, eventType) => {
        const typeTranslations = {
            'audio': 'Audio',
            'imagen': 'Image',
            'video': 'Video',
            'texto': 'Text'
        };
        
        const translatedType = typeTranslations[eventType.toLowerCase()] || eventType;
        return `Participate in ${translatedType} Event`;
    }
},
// === BOTONES DE INTERFAZ ===

// "📷 Seleccionar Imagen"
{
    pattern: /^📷\s*Seleccionar\s*Imagen$/i,
    replace: () => `📷 Select Image`
},

// "🎥 Seleccionar Video"
{
    pattern: /^🎥\s*Seleccionar\s*Video$/i,
    replace: () => `🎥 Select Video`
},

// "🎤 Seleccionar Audio" (por si acaso)
{
    pattern: /^🎤\s*Seleccionar\s*Audio$/i,
    replace: () => `🎤 Select Audio`
},

// "📁 Seleccionar Archivo" (genérico)
{
    pattern: /^📁\s*Seleccionar\s*Archivo$/i,
    replace: () => `📁 Select File`
},

// Versión genérica para cualquier tipo de medio
{
    pattern: /^[📷🎥🎤📁🔊📄]\s*Seleccionar\s*(.+)$/i,
    replace: (match, mediaType) => {
        const emoji = match.charAt(0); // Captura el primer carácter (emoji)
        // Traducción de tipos comunes
        const typeMap = {
            'imagen': 'Image',
            'video': 'Video',
            'audio': 'Audio',
            'archivo': 'File',
            'documento': 'Document',
            'multimedia': 'Media'
        };
        const translatedType = typeMap[mediaType.toLowerCase()] || mediaType;
        return `${emoji} Select ${translatedType}`;
    }
},

// Versión sin emoji
{
    pattern: /^Seleccionar\s*(.+)$/i,
    replace: (match, mediaType) => {
        const typeMap = {
            'imagen': 'Image',
            'video': 'Video',
            'audio': 'Audio',
            'archivo': 'File',
            'documento': 'Document'
        };
        const translatedType = typeMap[mediaType.toLowerCase()] || mediaType;
        return `Select ${translatedType}`;
    }
},
// Patrón: "Usa el botón "💎 Comprar CFT Directamente" para desbloquear el acceso."
{
    pattern: /^Usa\s+el\s+botón\s+"💎\s*Comprar\s+CFT\s+Directamente"\s+para\s+desbloquear(\s+el\s+acceso)?\.?$/i,
    replace: () => `Use the "💎 Buy CFT Directly" button to unlock access.`
},
// Volumen: "Volumen: X CFT"
{
    pattern: /^Volumen:\s*([\d,.]+)\s*CFT$/i,
    replace: (match, vol) => `Volume: ${vol} CFT`
},
// "@usuario • Contenido de publicación..."
{
    pattern: /^(@[\w.]+)\s*•\s*(.{0,50})$/i,  // Limitar a 50 caracteres para evitar capturar todo
    replace: (match, user, desc) => `${user} • ${desc}`
},
    
    // "Recibido: X CFT"
    {
        pattern: /^Recibido:\s*([\d,.]+)\s*CFT$/i,
        replace: (match, amount) => `Received: ${amount} CFT`
    }
    
];

function translateWithPatterns(text) {
    for (const {pattern, replace} of dynamicPatterns) {
        const match = text.match(pattern);
        if (match) {
            return text.replace(pattern, replace);
        }
    }
    return null;
}

function handleSpecificTranslations(text, targetLang) {
    if (targetLang !== 'en') return text;
    
    const specificTranslations = {
        'En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en ': 
            'Currently, a private round is open for strategic investors interested in ',
        'En esta instancia se encuentra abierta una ronda privada destinada a inversores estratégicos interesados en': 
            'Currently, a private round is open for strategic investors interested in'
    };
    
    for (const [es, en] of Object.entries(specificTranslations)) {
        if (text.includes(es)) {
            return text.replace(es, en);
        }
    }
    
    return text;
}

function translateText(text, targetLang) {
    if (!text || typeof text !== 'string' || targetLang === 'es') return text;
    
    const trimmedText = text.trim().replace(/\s+/g, ' ');
    
    if (!trimmedText || trimmedText.length < 2) return text;
    
    // Verificar cache
    const cacheKey = trimmedText;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }
    
    const translation = translations[targetLang];
    if (!translation) {
        translationCache.set(cacheKey, text);
        return text;
    }
    
    // Probar patrones PRIMERO
    const patternResult = translateWithPatterns(trimmedText);
    if (patternResult) {
        translationCache.set(cacheKey, patternResult);
        return patternResult;
    }
    
    // Búsqueda exacta
    if (translation[trimmedText]) {
        const result = translation[trimmedText];
        translationCache.set(cacheKey, result);
        return result;
    }
    
    // ⭐ FIX: Manejar textos con emojis al inicio
    const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*/u;
    const emojiMatch = trimmedText.match(emojiRegex);
    
    if (emojiMatch) {
        const emoji = emojiMatch[0];
        const textSinEmoji = trimmedText.replace(emojiRegex, '').trim();
        
        // Intentar traducir el texto sin emoji
        if (translation[textSinEmoji]) {
            const result = emoji + translation[textSinEmoji];
            translationCache.set(cacheKey, result);
            return result;
        }
        
        // También intentar con lowercase
        const textSinEmojiLower = textSinEmoji.toLowerCase();
        if (translation[textSinEmojiLower]) {
            const result = emoji + translation[textSinEmojiLower];
            translationCache.set(cacheKey, result);
            return result;
        }
    }
    
    // Búsqueda lowercase
    const lowerText = trimmedText.toLowerCase();
    if (translation[lowerText]) {
        const result = translation[lowerText];
        translationCache.set(cacheKey, result);
        return result;
    }
    
// 🔥 NUEVO: Si tiene saltos de línea, traducir cada línea por separado
if (text.includes('\n')) {
    const lines = text.split('\n');
    const translatedLines = lines.map(line => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return line;
        
        // Intentar patrón
        const patternResult = translateWithPatterns(trimmedLine);
        if (patternResult) return patternResult;
        
        // Intentar traducción directa
        if (translation[trimmedLine]) return translation[trimmedLine];
        
        // 🔥 NUEVO: Traducir partes separadas por ":"
        if (trimmedLine.includes(':')) {
            const colonIndex = trimmedLine.indexOf(':');
            const prefix = trimmedLine.substring(0, colonIndex + 1).trim();
            const suffix = trimmedLine.substring(colonIndex + 1).trim();
            
            // Traducir prefijo
            let translatedPrefix = translateWithPatterns(prefix) || translation[prefix] || prefix;
            
            // Traducir sufijo
            let translatedSuffix = translateWithPatterns(suffix) || translation[suffix] || suffix;
            
            if (translatedPrefix !== prefix || translatedSuffix !== suffix) {
                return `${translatedPrefix} ${translatedSuffix}`;
            }
        }
        
        return line;
    });
    
    const result = translatedLines.join('\n');
    translationCache.set(cacheKey, result);
    return result;
}
    
    // No encontrado
    translationCache.set(cacheKey, text);
    return text;
}

function translateElement(element, targetLang, force = false) {
    if (!element || !element.tagName) return;
    
    // Skip scripts, styles, y elementos ya traducidos
    if (element.tagName === 'SCRIPT' || 
        element.tagName === 'STYLE' ||
        (element.hasAttribute('data-translated') && !force) ||
        element.hasAttribute('data-no-translate') ||
        element.classList.contains('amount-date')) {
      return;
    }

    // 🔥🔥🔥 CAMBIO CRÍTICO: PRIMERO procesar los hijos, LUEGO marcar como traducido
    // Esto asegura que el <strong> se traduzca primero

    // Traducir atributos
    const attributesToTranslate = ['placeholder', 'title', 'aria-label', 'alt', 'data-tooltip'];
    attributesToTranslate.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value && value.trim()) {
        const translated = translateText(value, targetLang);
        if (translated !== value) {
          element.setAttribute(attr, translated);
        }
      }
    });

    // 🔥 MEJORADO: Traducir nodos de texto directos
    Array.from(element.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent;
        if (text && text.trim()) {
          let translated = translateText(text, targetLang);
          
          if (translated === text && text.includes(':')) {
            const parts = text.split(':');
            if (parts.length === 2) {
              const label = parts[0].trim() + ':';
              const value = parts[1].trim();
              const translatedLabel = translateText(label, targetLang);
              
              if (translatedLabel !== label) {
                translated = `${translatedLabel} ${value}`;
              }
            }
          }
          
          if (translated !== text) {
            node.textContent = translated;
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        translateElement(node, targetLang, force);
      }
    });

    // 🔥 NUEVO: Corregir espacios alrededor de <strong>, <span>, <b>, <em>, <i>
    fixInlineElementSpacing(element);

    // 🔥🔥🔥 MARCA COMO TRADUCIDO AL FINAL - DESPUÉS de procesar hijos
    element.setAttribute('data-translated', 'true');
}

function fixInlineElementSpacing(element) {
    const inlineTags = ['STRONG', 'B', 'EM', 'I', 'SPAN', 'A'];
    const hasInlineChildren = Array.from(element.children).some(child => 
        inlineTags.includes(child.tagName)
    );
    
    if (!hasInlineChildren) return;
    
    let html = element.innerHTML;
    let originalHtml = html;
    
    html = html.replace(/([a-zA-Z0-9:])(<(?:strong|b|em|i|span)[^>]*>)/gi, '$1 $2');
    html = html.replace(/(<\/(?:strong|b|em|i|span)>)([a-zA-Z])/gi, '$1 $2');
    
    if (html !== originalHtml) {
        // 🔥 Pausar observer temporalmente
        if (observer) observer.disconnect();
        
        element.innerHTML = html;
        
        // 🔥 Reactivar observer después
        if (observer) {
            setTimeout(() => {
                startObserver(window.getLanguage());
            }, 100);
        }
    }
}

  // ==========================================
  // TRADUCIR TODA LA PÁGINA MEJORADO
  // ==========================================
  function translatePage(targetLang = 'en', force = false) {
    console.log(`🌐 Iniciando traducción a: ${targetLang}`);
    
    if (force) {
      // Limpiar marcadores de traducción
      document.querySelectorAll('[data-translated]').forEach(el => {
        el.removeAttribute('data-translated');
      });
    }

    // Traducir todo el body
    translateElement(document.body, targetLang, force);

    console.log('✅ Traducción completada');
  }

  // ==========================================
  // OBSERVADOR DE MUTACIONES MEJORADO
  // ==========================================
  let observer = null;
  let translationQueue = [];
  let translationTimer = null;

  function processTranslationQueue(targetLang) {
    if (translationQueue.length === 0) return;
    
    const nodesToTranslate = [...translationQueue];
    translationQueue = [];
    
    nodesToTranslate.forEach(node => {
      if (node.isConnected) {
        translateElement(node, targetLang);
      }
    });
  }

function startObserver(targetLang) {
    if (observer) {
        observer.disconnect();
    }

    let pendingTranslations = new Set();
    let translationTimeout = null;

    function queueTranslation(element) {
        if (!element || !element.isConnected) return;
        if (pendingTranslations.has(element)) return;
        
        pendingTranslations.add(element);
        
        clearTimeout(translationTimeout);
        translationTimeout = setTimeout(() => {
            pendingTranslations.forEach(el => {
                if (el.isConnected) {
                    el.removeAttribute('data-translated');
                    translateElement(el, targetLang, true);
                }
            });
            pendingTranslations.clear();
        }, 50);
    }

    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        queueTranslation(node);
                    } else if (node.nodeType === Node.TEXT_NODE && node.parentElement) {
                        queueTranslation(node.parentElement);
                    }
                });
            }
            
            if (mutation.type === 'characterData') {
                const parent = mutation.target.parentElement;
                if (parent) {
                    queueTranslation(parent);
                }
            }
            
            if (mutation.type === 'attributes') {
                const attrName = mutation.attributeName;
                if (['placeholder', 'title', 'aria-label', 'alt', 'data-tooltip'].includes(attrName)) {
                    queueTranslation(mutation.target);
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: true,
        attributes: true,
        attributeFilter: ['placeholder', 'title', 'aria-label', 'alt', 'data-tooltip']
    });

    console.log('👁️ Observer mejorado activo - detecta contenido dinámico');
}

// ==========================================
  // FUNCIÓN PÚBLICA PARA CAMBIAR IDIOMA
  // ==========================================

window.setLanguage = function(lang) {
    if (!translations[lang]) {
        console.warn(`❌ Idioma ${lang} no soportado`);
        return;
    }

    const currentLang = window.getLanguage();
    
    // 🔥 CRÍTICO: Si ya estamos en el idioma correcto, no hacer nada
    if (currentLang === lang) {
        console.log(`ℹ️ Ya estás en ${lang}, no se requiere acción`);
        updateLanguageButtons(); // Solo actualizar botones
        return;
    }
    
    // 🔥 Actualizar HTML lang INMEDIATAMENTE
    document.documentElement.lang = lang;
    console.log('📍 HTML lang actualizado a:', lang);
    
    // Guardar preferencia
    localStorage.setItem('app_language', lang);
    localStorage.setItem('preferred_language', lang);
    
    // Actualizar usuario en localStorage si existe
    try {
        const savedUser = localStorage.getItem('chainfeed_user');
        if (savedUser) {
            const userData = JSON.parse(savedUser);
            userData.language = lang;
            localStorage.setItem('chainfeed_user', JSON.stringify(userData));
            console.log('✅ Usuario actualizado con idioma:', lang);
        }
    } catch (e) {
        console.error('Error actualizando usuario:', e);
    }
    
    // Actualizar appState si existe
    if (window.appState) {
        window.appState.language = lang;
    }
    
    // Disparar evento
    window.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang }
    }));
    
    if (lang === 'es') {
        // 🔥 FIX: Cancelar todos los timers pendientes antes de recargar
        for (let i = 1; i < 99999; i++) {
            window.clearTimeout(i);
        }
        
        // 🔥 FIX: Usar requestAnimationFrame para asegurar que el reload se ejecute
        requestAnimationFrame(() => {
            console.log('🔄 Recargando página para volver a español...');
            location.reload();
        });
    } else {
        // Traducir todo forzando re-traducción
        translatePage(lang, true);
        startObserver(lang);
        
        // Actualizar botones una sola vez después de traducir
        setTimeout(() => {
            if (typeof updateLanguageButtons === 'function') {
                updateLanguageButtons();
            }
        }, 100);
    }
    
    console.log(`✅ Idioma cambiado a: ${lang}`);
};

  // ==========================================
  // OBTENER IDIOMA ACTUAL
  // ==========================================
  window.getLanguage = function() {
    return localStorage.getItem('app_language') || 'es';
  };

  // ==========================================
  // RE-TRADUCIR (útil para debugging)
  // ==========================================
  window.retranslate = function() {
    const lang = window.getLanguage();
    if (lang !== 'es') {
      console.log('🔄 Re-traduciendo página...');
      translatePage(lang, true);
    }
  };

  // ==========================================
  // AUTO-INICIALIZAR
  // ==========================================
  function init() {
    const savedLang = window.getLanguage();
    console.log(`🚀 Inicializando sistema de traducción (idioma: ${savedLang})`);
    
    if (savedLang !== 'es') {
      const doTranslation = () => {
        translatePage(savedLang);
        startObserver(savedLang);
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', doTranslation);
      } else {
        // Ejecutar inmediatamente y después de un delay por si hay contenido dinámico
        doTranslation();
        setTimeout(doTranslation, 1000);
      }
    }
  }

  init();

  // Exponer funciones para debugging
window.translationSystem = {
    translate: translateText,
    translatePage,
    setLanguage: window.setLanguage,
    getLanguage: window.getLanguage,
    retranslate: window.retranslate,
    addTranslation: function(es, en) {
      translations.en[es] = en;
      console.log(`✅ Traducción agregada: "${es}" → "${en}"`);
    }
};
window.translateElement = translateElement;

console.log('✅ Sistema de traducción cargado correctamente');

// ==========================================
// FIX: TRADUCIR CONTENIDO DINÁMICO DE FLASHES
// ==========================================
function forceTranslateFlashContainer() {
    const lang = window.getLanguage();
    if (!lang || lang === 'es') return;
    
    const container = document.getElementById('flashesScrollContainer');
    if (!container) return;
    
    const manualTranslations = {
        'Crear Flash': 'Create Flash',
        '✨ Sé el primero en crear un Chain Flash': '✨ Be the first to create a Chain Flash',
        'Sé el primero en crear un Chain Flash': 'Be the first to create a Chain Flash'
    };
    
    let translated = 0;
    
    container.querySelectorAll('span:not([data-translated])').forEach(function(span) {
        const text = span.textContent.trim();
        if (!text) return;
        
        let newText = text;
        
        // 1. Intentar traducción automática
        if (window.translationSystem && window.translationSystem.translate) {
            newText = window.translationSystem.translate(text, lang);
        }
        
        // 2. Si no funcionó, usar traducciones manuales
        if (newText === text && manualTranslations[text]) {
            newText = manualTranslations[text];
        }
        
        // 3. Aplicar traducción
        if (newText !== text) {
            span.textContent = newText;
            span.setAttribute('data-translated', 'true');
            translated++;
        }
    });
    
    if (translated > 0) {
        console.log('✅ Flashes traducidos:', translated);
    }
}

// Ejecutar inmediatamente y en diferentes momentos
forceTranslateFlashContainer(); // ← Sin delay
setTimeout(forceTranslateFlashContainer, 100);
setTimeout(forceTranslateFlashContainer, 300);
setTimeout(forceTranslateFlashContainer, 800);
setTimeout(forceTranslateFlashContainer, 2000);

// Al cambiar idioma
window.addEventListener('languageChanged', function() {
    setTimeout(forceTranslateFlashContainer, 300);
    setTimeout(forceTranslateFlashContainer, 1000);
});

// Al cambiar tema
window.addEventListener('themeChanged', function() {
    setTimeout(forceTranslateFlashContainer, 500);
});

// Exponer globalmente para uso manual
window.forceTranslateFlashContainer = forceTranslateFlashContainer;

console.log('🔄 Sistema de traducción de flashes activado');

})();

// ==========================================
// FIX: TRADUCIR FORMATOS DE TIEMPO EN POST-META
// ==========================================
function translatePostTimes() {
    const lang = window.getLanguage();
    if (!lang || lang === 'es') return;
    
    const timeTranslations = {
        'sem': 'wk',
        'd': 'd',
        'h': 'h',
        'min': 'min',
        's': 's'
    };
    
    let translated = 0;
    
    document.querySelectorAll('.post-meta:not([data-time-translated])').forEach(function(meta) {
        let modified = false;
        
        meta.childNodes.forEach(function(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                
                // ✅ FIX: Regex más simple que busca solo el tiempo (sin username)
                // Busca: número + unidad de tiempo en español
                const timeMatch = text.match(/(\d+)(sem|min|h|d|s)\b/);
                
                if (timeMatch) {
                    const numero = timeMatch[1];
                    const unidad = timeMatch[2];
                    const unidadTraducida = timeTranslations[unidad];
                    
                    if (unidadTraducida && unidadTraducida !== unidad) {
                        // Reemplazar solo la unidad de tiempo
                        node.textContent = text.replace(
                            new RegExp(`(\\d+)${unidad}\\b`),
                            `$1${unidadTraducida}`
                        );
                        modified = true;
                        console.log(`⏰ Traducido: ${numero}${unidad} → ${numero}${unidadTraducida}`);
                    }
                }
            }
        });
        
        if (modified) {
            meta.setAttribute('data-time-translated', 'true');
            translated++;
        }
    });
    
    if (translated > 0) {
        console.log('✅ Tiempos traducidos:', translated);
    }
    
    return translated;
}

// Reemplazar la función global
window.translatePostTimes = translatePostTimes;

// Ejecutar inmediatamente
translatePostTimes();

console.log('🔧 Función translatePostTimes actualizada');

// ==========================================
// OBSERVAR NUEVOS POSTS
// ==========================================
function observePostTimes() {
    const lang = window.getLanguage();
    if (!lang || lang === 'es') return;
    
    const observer = new MutationObserver(function(mutations) {
        let hasNewPosts = false;
        
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.classList && (node.classList.contains('post-card') || 
                        node.classList.contains('post-meta') ||
                        node.querySelector('.post-meta'))) {
                        hasNewPosts = true;
                    }
                }
            });
        });
        
        if (hasNewPosts) {
            setTimeout(translatePostTimes, 100);
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('👁️ Observer de tiempos activado');
}

// ==========================================
// EJECUTAR TRADUCCIÓN DE TIEMPOS
// ==========================================

// Inmediato
translatePostTimes();

// Múltiples delays
[50, 150, 300, 600, 1000, 2000, 3000].forEach(function(delay) {
    setTimeout(translatePostTimes, delay);
});

// DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        translatePostTimes();
        setTimeout(translatePostTimes, 100);
        setTimeout(translatePostTimes, 500);
    });
}

// Window load
window.addEventListener('load', function() {
    setTimeout(translatePostTimes, 100);
    setTimeout(translatePostTimes, 500);
});

// Al cambiar idioma
window.addEventListener('languageChanged', function(e) {
    // Limpiar marcadores
    document.querySelectorAll('[data-time-translated]').forEach(function(el) {
        el.removeAttribute('data-time-translated');
    });
    
    setTimeout(translatePostTimes, 200);
    setTimeout(translatePostTimes, 800);
});

// Al cambiar tema
window.addEventListener('themeChanged', function() {
    setTimeout(translatePostTimes, 300);
});

// Al hacer scroll
let timeTranslationTimeout;
window.addEventListener('scroll', function() {
    clearTimeout(timeTranslationTimeout);
    timeTranslationTimeout = setTimeout(translatePostTimes, 300);
}, { passive: true });

// Iniciar observer
setTimeout(observePostTimes, 1000);

// Exponer globalmente
window.translatePostTimes = translatePostTimes;

console.log('⏰ Sistema de traducción de tiempos activado');

// 🔥 FORZAR ACTUALIZACIÓN DE BOTONES AL CARGAR LA PÁGINA
window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof updateLanguageButtons === 'function') {
            updateLanguageButtons();
            console.log('🎯 Botones sincronizados al cargar página');
        }
    }, 1000);
});

// ==========================================
// OBSERVADOR MEJORADO PARA ELEMENTOS DINÁMICOS
// ==========================================
function startDynamicTranslationObserver(targetLang) {
    if (targetLang === 'es') return;
    
    const dynamicObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // Detectar cambios de texto en elementos ya traducidos
            if (mutation.type === 'characterData' || mutation.type === 'childList') {
                let targetElement = mutation.target;
                
                // Si es un nodo de texto, obtener su elemento padre
                if (targetElement.nodeType === Node.TEXT_NODE) {
                    targetElement = targetElement.parentElement;
                }
                
                // Si el elemento tiene data-translated, quitarlo para re-traducir
                if (targetElement && targetElement.hasAttribute && targetElement.hasAttribute('data-translated')) {
                    targetElement.removeAttribute('data-translated');
                    window.translateElement(targetElement, targetLang, true);
                }
            }
            
            // Detectar nuevos elementos agregados
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Traducir el nuevo elemento y sus hijos
                    setTimeout(() => {
                        if (node.isConnected) {
                            node.removeAttribute('data-translated');
                            window.translateElement(node, targetLang, true);
                        }
                    }, 50);
                }
            });
        });
    });
    
    dynamicObserver.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        characterDataOldValue: true
    });
    
    // ============================================
  // INTERCEPTOR DE innerHTML PARA CONTENIDO DINÁMICO
  // ============================================
  (function() {
    const originalInnerHTMLDescriptor = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');
    
    Object.defineProperty(Element.prototype, 'innerHTML', {
      set: function(value) {
        originalInnerHTMLDescriptor.set.call(this, value);
        
        const lang = window.getLanguage?.();
        if (lang && lang !== 'es') {
          setTimeout(() => {
            if (this.isConnected && !this.closest('script') && !this.closest('style')) {
              this.removeAttribute('data-translated');
              window.translateElement(this, lang, true);
            }
          }, 10);
        }
      },
      get: function() {
        return originalInnerHTMLDescriptor.get.call(this);
      },
      configurable: true
    });
    
    console.log('🔌 Interceptor de innerHTML activo');
  })();

  window.translateDynamicContent = function(containerSelector) {
    const lang = window.getLanguage();
    if (lang === 'es') return;
    
    const container = typeof containerSelector === 'string' 
      ? document.querySelector(containerSelector) 
      : containerSelector;
    
    if (container) {
      container.querySelectorAll('[data-translated]').forEach(el => {
        el.removeAttribute('data-translated');
      });
      container.removeAttribute('data-translated');
      window.translateElement(container, lang, true);
    }
  };
  
    console.log('🔥 Observador dinámico activado - detectará TODOS los cambios');
}