/**
 * Video Manager class
 * Handles video/screen capture and frame extraction
 */
export class VideoManager {
    constructor() {
      this.videoStream = null;
      this.videoElement = document.getElementById('videoElem');
      this.canvasElement = document.getElementById('canvasElem');
      this.videoInterval = null;
      this.onImageData = null;
    }
    
    /**
     * Start video or screen capture
     * @param {string} mode - Capture mode: 'camera' or 'screen'
     * @param {Function} onImageData - Callback for captured frames
     * @returns {Promise} - Resolves when capture is initialized
     */
    async startCapture(mode, onImageData) {
      if (mode !== 'camera' && mode !== 'screen') {
        throw new Error('Invalid capture mode. Must be "camera" or "screen"');
      }
      
      this.onImageData = onImageData;
      
      try {
        // Acquire video stream based on mode
        if (mode === 'camera') {
          this.videoStream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 320 }, height: { ideal: 240 } }
          });
        } else {
          this.videoStream = await navigator.mediaDevices.getDisplayMedia({
            video: { width: { ideal: 1920 }, height: { ideal: 1080 } }
          });
        }
        
        // Set video source
        this.videoElement.srcObject = this.videoStream;
        
        // Periodically capture and send frames
        this.videoInterval = setInterval(() => {
          this.captureAndSendFrame();
        }, 1000); // Send a frame every second
        
      } catch (error) {
        console.error('Error initializing video capture:', error);
        throw new Error(`Video capture failed: ${error.message}`);
      }
    }
    
    /**
     * Stop video capture and release resources
     */
    stopCapture() {
      // Clear capture interval
      if (this.videoInterval) {
        clearInterval(this.videoInterval);
        this.videoInterval = null;
      }
      
      // Stop all video tracks
      if (this.videoStream) {
        this.videoStream.getTracks().forEach(track => track.stop());
        this.videoStream = null;
      }
      
      // Clear video source
      if (this.videoElement) {
        this.videoElement.srcObject = null;
      }
    }
    
    /**
     * Capture current video frame and send through callback
     * @private
     */
    captureAndSendFrame() {
      if (!this.videoStream || !this.onImageData) return;
      
      const ctx = this.canvasElement.getContext('2d');
      
      // Set canvas size to match video dimensions
      this.canvasElement.width = this.videoElement.videoWidth;
      this.canvasElement.height = this.videoElement.videoHeight;
      
      // Draw video frame to canvas
      ctx.drawImage(this.videoElement, 0, 0, this.videoElement.videoWidth, this.videoElement.videoHeight);
      
      // Get JPEG image as base64
      const base64Image = this.canvasElement.toDataURL('image/jpeg').split(',')[1];
      
      // Send through callback
      this.onImageData(base64Image);
    }
  }