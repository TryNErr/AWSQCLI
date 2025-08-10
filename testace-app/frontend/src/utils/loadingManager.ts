/**
 * LOADING MANAGER
 * 
 * Manages global loading states and ensures loading indicators
 * are properly shown and hidden to prevent stuck loading screens.
 */

class LoadingManager {
  private static instance: LoadingManager;
  private loadingStates: Map<string, boolean> = new Map();
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }
    return LoadingManager.instance;
  }

  /**
   * Set a loading state with automatic timeout protection
   */
  setLoading(key: string, isLoading: boolean, timeoutMs: number = 10000): void {
    console.log(`🔄 Loading state: ${key} = ${isLoading}`);
    
    // Clear existing timeout for this key
    const existingTimeout = this.timeouts.get(key);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
      this.timeouts.delete(key);
    }

    // Set the loading state
    this.loadingStates.set(key, isLoading);

    // If setting to loading, create a timeout to automatically clear it
    if (isLoading && timeoutMs > 0) {
      const timeout = setTimeout(() => {
        console.warn(`⚠️ Loading timeout for ${key} - automatically clearing`);
        this.setLoading(key, false, 0);
      }, timeoutMs);
      
      this.timeouts.set(key, timeout);
    }

    // Update global loading state
    this.updateGlobalLoading();
  }

  /**
   * Get loading state for a specific key
   */
  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false;
  }

  /**
   * Check if any component is loading
   */
  isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(loading => loading);
  }

  /**
   * Clear all loading states
   */
  clearAllLoading(): void {
    console.log('🧹 Clearing all loading states');
    
    // Clear all timeouts
    this.timeouts.forEach(timeout => clearTimeout(timeout));
    this.timeouts.clear();
    
    // Clear all loading states
    this.loadingStates.clear();
    
    // Update global loading
    this.updateGlobalLoading();
  }

  /**
   * Update the global HTML loading indicator
   */
  private updateGlobalLoading(): void {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      const shouldShow = this.isAnyLoading();
      indicator.style.display = shouldShow ? 'block' : 'none';
      
      if (!shouldShow) {
        console.log('✅ All loading complete - hiding global indicator');
      }
    }
  }

  /**
   * Initialize the loading manager
   */
  initialize(): void {
    console.log('🚀 Loading Manager initialized');
    
    // Hide loading indicator when page is fully loaded
    if (document.readyState === 'complete') {
      this.hideInitialLoading();
    } else {
      window.addEventListener('load', () => {
        this.hideInitialLoading();
      });
    }

    // Also hide when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this.hideInitialLoading(), 100);
      });
    } else {
      setTimeout(() => this.hideInitialLoading(), 100);
    }
  }

  /**
   * Hide the initial HTML loading indicator
   */
  private hideInitialLoading(): void {
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      indicator.style.display = 'none';
      console.log('✅ Initial loading indicator hidden');
    }
  }

  /**
   * Show a temporary loading message
   */
  showTemporaryLoading(key: string, message: string, durationMs: number = 3000): void {
    this.setLoading(key, true, durationMs);
    
    const indicator = document.getElementById('loading-indicator');
    if (indicator) {
      const originalText = indicator.textContent;
      indicator.textContent = message;
      
      setTimeout(() => {
        if (indicator.textContent === message) {
          indicator.textContent = originalText || 'Loading TestAce...';
        }
      }, durationMs);
    }
  }

  /**
   * Get debug information about current loading states
   */
  getDebugInfo(): { [key: string]: any } {
    return {
      loadingStates: Object.fromEntries(this.loadingStates),
      activeTimeouts: this.timeouts.size,
      isAnyLoading: this.isAnyLoading(),
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const loadingManager = LoadingManager.getInstance();

// Auto-initialize when module loads
loadingManager.initialize();

export default loadingManager;
