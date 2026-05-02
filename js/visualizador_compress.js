/**
 * ============================================
 * VISUALIZADOR DE COMPRESIÓN DE VIDEOS
 * Intercepta MediaRecorder + XMLHttpRequest
 * ============================================
 */

class VisualizadorCompress {
    constructor() {
        this.panel = null;
        this.isVisible = true;
        this.originalFile = null;
        this.compressedBlob = null;
        this.compressionStartTime = 0;
        this.uploadStartTime = 0;
        this.mediaRecorderActive = false;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createPanel();
                this.attachStyles();
                this.interceptMediaRecorder();
                this.interceptXHR();
            });
        } else {
            this.createPanel();
            this.attachStyles();
            this.interceptMediaRecorder();
            this.interceptXHR();
        }
        console.log('✅ Visualizador de compresión inicializado');
    }

    createPanel() {
        this.panel = document.createElement('div');
        this.panel.id = 'visualizador-compress';
        this.panel.innerHTML = `
            <div class="visualizador-header">
                <span class="visualizador-title">📊 Compresión de Video</span>
                <button class="visualizador-close" onclick="window.visualizadorCompress.toggle()">✕</button>
            </div>
            <div class="visualizador-content">
                <div class="visualizador-separator">━━━━━━━━━━━━━━━━━━━━</div>
                <div class="visualizador-row">
                    <span class="visualizador-label">📁 Original:</span>
                    <span class="visualizador-value" id="vc-original">-- MB</span>
                </div>
                <div class="visualizador-row">
                    <span class="visualizador-label">📦 Comprimido:</span>
                    <span class="visualizador-value" id="vc-compressed">-- MB</span>
                </div>
                <div class="visualizador-row highlight">
                    <span class="visualizador-label">💾 Ahorro:</span>
                    <span class="visualizador-value" id="vc-savings">-- MB (---%)</span>
                </div>
                <div class="visualizador-separator">━━━━━━━━━━━━━━━━━━━━</div>
                <div class="visualizador-progress" id="vc-progress" style="display: none;">
                    <div class="visualizador-progress-bar">
                        <div class="visualizador-progress-fill" id="vc-progress-fill"></div>
                    </div>
                    <div class="visualizador-progress-text" id="vc-progress-text">0%</div>
                </div>
                <div class="visualizador-status" id="vc-status">🔍 Esperando video...</div>
            </div>
        `;
        
        document.body.appendChild(this.panel);
    }

    attachStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #visualizador-compress {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a24 0%, #252532 100%);
                border: 2px solid rgba(99, 102, 241, 0.3);
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                z-index: 999999;
                font-family: 'Courier New', monospace;
                min-width: 340px;
                transition: all 0.3s ease;
            }

            #visualizador-compress.hidden {
                transform: translateX(400px);
                opacity: 0;
                pointer-events: none;
            }

            .visualizador-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 12px 16px;
                border-radius: 10px 10px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .visualizador-title {
                color: white;
                font-weight: 700;
                font-size: 14px;
                letter-spacing: 0.5px;
            }

            .visualizador-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .visualizador-close:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .visualizador-content {
                padding: 16px;
                color: #e0e0e0;
            }

            .visualizador-separator {
                color: rgba(99, 102, 241, 0.4);
                font-size: 10px;
                margin: 8px 0;
                text-align: center;
                letter-spacing: 1px;
            }

            .visualizador-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 4px;
                border-radius: 6px;
                margin-bottom: 4px;
                transition: all 0.2s;
            }

            .visualizador-row:hover {
                background: rgba(99, 102, 241, 0.1);
            }

            .visualizador-row.highlight {
                background: rgba(99, 102, 241, 0.15);
                font-weight: 700;
            }

            .visualizador-label {
                font-size: 13px;
                color: #a0a0b8;
            }

            .visualizador-value {
                font-size: 13px;
                color: #ffffff;
                font-weight: 600;
            }

            .visualizador-row.highlight .visualizador-value {
                color: #4ade80;
            }

            .visualizador-progress {
                margin: 12px 0;
                padding: 8px;
                background: rgba(99, 102, 241, 0.05);
                border-radius: 8px;
            }

            .visualizador-progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 6px;
            }

            .visualizador-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                width: 0%;
                transition: width 0.3s ease;
            }

            .visualizador-progress-text {
                text-align: center;
                font-size: 11px;
                color: #999;
            }

            .visualizador-status {
                text-align: center;
                padding: 8px;
                font-size: 11px;
                color: #999;
                font-style: italic;
                margin-top: 4px;
            }

            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }

            #visualizador-compress.pulse {
                animation: pulse 0.5s ease;
            }

            @media (max-width: 768px) {
                #visualizador-compress {
                    bottom: 10px;
                    right: 10px;
                    min-width: 300px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // INTERCEPTOR 1: Detectar selección de archivo
    // ============================================
    interceptFileSelection() {
        const self = this;
        
        document.addEventListener('change', function(e) {
            if (e.target.type === 'file' && e.target.files.length > 0) {
                const file = e.target.files[0];
                
                if (file.type.startsWith('video/')) {
                    self.originalFile = file;
                    self.reset();
                    self.updateOriginalSize(file.size);
                    self.setStatus('📁 Video seleccionado: ' + self.formatBytes(file.size));
                    console.log('🎥 Video detectado:', file.name, self.formatBytes(file.size));
                }
            }
        });
        
        console.log('✅ Interceptor de selección de archivo instalado');
    }

    // ============================================
    // INTERCEPTOR 2: MediaRecorder (compresión)
    // ============================================
    interceptMediaRecorder() {
        const self = this;
        
        const OriginalMediaRecorder = window.MediaRecorder;
        
        window.MediaRecorder = function(...args) {
            const recorder = new OriginalMediaRecorder(...args);
            
            // Detectar inicio de grabación
            const originalStart = recorder.start.bind(recorder);
            recorder.start = function(...startArgs) {
                if (!self.mediaRecorderActive && self.originalFile) {
                    self.mediaRecorderActive = true;
                    self.compressionStartTime = Date.now();
                    self.setStatus('🔧 Comprimiendo video...');
                    self.showProgress(10);
                    console.log('🔧 MediaRecorder: Compresión iniciada');
                }
                return originalStart(...startArgs);
            };
            
            // Detectar datos generados
            const originalOndataavailable = recorder.ondataavailable;
            Object.defineProperty(recorder, 'ondataavailable', {
                set: function(handler) {
                    originalOndataavailable = function(e) {
                        if (e.data && e.data.size > 0 && self.mediaRecorderActive) {
                            const progress = 10 + Math.min(30, Math.random() * 10);
                            self.updateProgress(progress);
                        }
                        if (handler) handler(e);
                    };
                },
                get: function() {
                    return originalOndataavailable;
                }
            });
            
            // Detectar fin de grabación
            const originalStop = recorder.stop.bind(recorder);
            recorder.stop = function(...stopArgs) {
                if (self.mediaRecorderActive) {
                    self.mediaRecorderActive = false;
                    const compressionTime = ((Date.now() - self.compressionStartTime) / 1000).toFixed(1);
                    self.updateProgress(45);
                    self.setStatus(`✅ Compresión completada en ${compressionTime}s`);
                    console.log(`✅ MediaRecorder: Compresión completada en ${compressionTime}s`);
                }
                return originalStop(...stopArgs);
            };
            
            return recorder;
        };
        
        // Copiar propiedades estáticas
        Object.setPrototypeOf(window.MediaRecorder, OriginalMediaRecorder);
        Object.setPrototypeOf(window.MediaRecorder.prototype, OriginalMediaRecorder.prototype);
        window.MediaRecorder.isTypeSupported = OriginalMediaRecorder.isTypeSupported;
        
        // También interceptar selección de archivos
        this.interceptFileSelection();
        
        console.log('✅ Interceptor MediaRecorder instalado');
    }

    // ============================================
    // INTERCEPTOR 3: XMLHttpRequest (upload)
    // ============================================
    interceptXHR() {
        const self = this;
        
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;
        
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            this._method = method;
            return originalOpen.apply(this, [method, url, ...args]);
        };
        
        XMLHttpRequest.prototype.send = function(data) {
            const xhr = this;
            
            // Detectar upload de video
            if (xhr._url && (xhr._url.includes('subir_archivo.php') || xhr._url.includes('subir_archivo_participacion.php'))) {
                
                if (data instanceof FormData) {
                    const fileEntry = data.get('file');
                    
                    if (fileEntry && fileEntry instanceof File) {
                        // Determinar si es el archivo comprimido
                        const isVideo = fileEntry.type.startsWith('video/') || 
                                      fileEntry.name.includes('compressed') ||
                                      fileEntry.name.endsWith('.webm');
                        
                        if (isVideo && self.originalFile) {
                            self.uploadStartTime = Date.now();
                            self.compressedBlob = fileEntry;
                            
                            // Actualizar tamaño comprimido
                            self.updateCompressedSize(fileEntry.size);
                            self.updateProgress(50);
                            self.setStatus('📤 Subiendo archivo...');
                            
                            console.log('📤 Upload detectado:', {
                                name: fileEntry.name,
                                size: self.formatBytes(fileEntry.size),
                                type: fileEntry.type
                            });
                            
                            // Progress del upload
                            xhr.upload.addEventListener('progress', function(e) {
                                if (e.lengthComputable) {
                                    const percent = Math.round((e.loaded / e.total) * 100);
                                    const totalProgress = 50 + (percent * 0.5);
                                    self.updateProgress(totalProgress);
                                    self.setStatus(`📤 Subiendo: ${percent}%`);
                                }
                            });
                            
                            // Respuesta
                            xhr.addEventListener('load', function() {
                                if (xhr.status === 200) {
                                    try {
                                        const response = JSON.parse(xhr.responseText);
                                        
                                        if (response.success) {
                                            const uploadTime = ((Date.now() - self.uploadStartTime) / 1000).toFixed(1);
                                            const totalTime = ((Date.now() - self.compressionStartTime) / 1000).toFixed(1);
                                            
                                            self.updateProgress(100);
                                            self.setStatus(`✅ Completado en ${totalTime}s`);
                                            
                                            self.panel.classList.add('pulse');
                                            setTimeout(() => {
                                                self.panel.classList.remove('pulse');
                                                self.hideProgress();
                                            }, 1000);
                                            
                                            self.logFinalStats(uploadTime, totalTime);
                                        }
                                    } catch (e) {
                                        console.error('Error parseando respuesta:', e);
                                    }
                                }
                            });
                        }
                    }
                }
            }
            
            return originalSend.apply(this, [data]);
        };
        
        console.log('✅ Interceptor XMLHttpRequest instalado');
    }

    updateOriginalSize(size) {
        const originalMB = (size / (1024 * 1024)).toFixed(2);
        document.getElementById('vc-original').textContent = originalMB + ' MB';
    }

    updateCompressedSize(compressedSize) {
        if (!this.originalFile) return;

        const originalSize = this.originalFile.size;
        const originalMB = (originalSize / (1024 * 1024)).toFixed(2);
        const compressedMB = (compressedSize / (1024 * 1024)).toFixed(2);
        const savingsMB = ((originalSize - compressedSize) / (1024 * 1024)).toFixed(2);
        const savingsPercent = Math.round(((originalSize - compressedSize) / originalSize) * 100);

        document.getElementById('vc-original').textContent = originalMB + ' MB';
        document.getElementById('vc-compressed').textContent = compressedMB + ' MB';
        document.getElementById('vc-savings').textContent = savingsMB + ' MB (' + savingsPercent + '%)';
    }

    logFinalStats(uploadTime, totalTime) {
        const originalSize = this.originalFile.size;
        const compressedSize = this.compressedBlob.size;
        const savings = originalSize - compressedSize;
        const percent = Math.round((savings / originalSize) * 100);
        
        console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 COMPRESIÓN Y UPLOAD COMPLETADOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📁 Original:    ${this.formatBytes(originalSize)}
📦 Comprimido:  ${this.formatBytes(compressedSize)}
💾 Ahorro:      ${this.formatBytes(savings)} (${percent}%)
⏱️ Tiempo total: ${totalTime}s
📤 Upload:      ${uploadTime}s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `);
    }

    showProgress(percent) {
        const progressEl = document.getElementById('vc-progress');
        if (progressEl) {
            progressEl.style.display = 'block';
            this.updateProgress(percent);
        }
    }

    updateProgress(percent) {
        const fillEl = document.getElementById('vc-progress-fill');
        const textEl = document.getElementById('vc-progress-text');
        
        if (fillEl) fillEl.style.width = Math.round(percent) + '%';
        if (textEl) textEl.textContent = Math.round(percent) + '%';
    }

    hideProgress() {
        const progressEl = document.getElementById('vc-progress');
        if (progressEl) {
            setTimeout(() => {
                progressEl.style.display = 'none';
            }, 2000);
        }
    }

    setStatus(message) {
        const statusEl = document.getElementById('vc-status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    toggle() {
        this.isVisible = !this.isVisible;
        if (this.isVisible) {
            this.panel.classList.remove('hidden');
        } else {
            this.panel.classList.add('hidden');
        }
    }

    reset() {
        document.getElementById('vc-original').textContent = '-- MB';
        document.getElementById('vc-compressed').textContent = '-- MB';
        document.getElementById('vc-savings').textContent = '-- MB (--%)';
        document.getElementById('vc-status').textContent = '🔍 Esperando video...';
        this.hideProgress();
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

// Auto-inicializar
if (typeof window !== 'undefined') {
    window.visualizadorCompress = new VisualizadorCompress();
    console.log('✅ Visualizador cargado - Intercepta MediaRecorder + XHR');
}