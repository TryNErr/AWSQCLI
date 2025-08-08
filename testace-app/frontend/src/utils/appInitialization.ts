import QuestionPrePopulationSystem from './questionPrePopulationSystem';

/**
 * APP INITIALIZATION SYSTEM
 * 
 * Handles all startup tasks including question pre-population
 * to ensure optimal performance from the moment the app loads.
 */

export class AppInitialization {
  private static isInitialized = false;
  private static initializationPromise: Promise<void> | null = null;

  /**
   * Initialize the entire application
   * Call this as early as possible in the app lifecycle
   */
  static async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  private static async performInitialization(): Promise<void> {
    console.log('🚀 Initializing TestAce Application...');
    const startTime = Date.now();

    try {
      // Initialize question pre-population system
      console.log('📚 Starting question pre-population...');
      await QuestionPrePopulationSystem.initialize();
      
      // Log memory usage
      const memoryUsage = QuestionPrePopulationSystem.getMemoryUsage();
      console.log(`💾 Memory usage: ${memoryUsage.totalQuestions} questions (~${memoryUsage.estimatedMemoryMB}MB)`);
      
      // Log statistics
      const stats = QuestionPrePopulationSystem.getStatistics();
      console.log('📊 Pre-population statistics:', stats);
      
      const endTime = Date.now();
      console.log(`✅ App initialization complete in ${endTime - startTime}ms`);
      
      this.isInitialized = true;
      
    } catch (error) {
      console.error('❌ App initialization failed:', error);
      // Don't throw - app should still work with fallback generation
    }
  }

  /**
   * Check if the app is fully initialized
   */
  static isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Get initialization status for debugging
   */
  static getStatus(): {
    initialized: boolean;
    prePopulationReady: boolean;
    memoryUsage?: { combinations: number; totalQuestions: number; estimatedMemoryMB: number };
  } {
    return {
      initialized: this.isInitialized,
      prePopulationReady: QuestionPrePopulationSystem.hasQuestions('9', 'hard' as any, 'thinking skills'),
      memoryUsage: this.isInitialized ? QuestionPrePopulationSystem.getMemoryUsage() : undefined
    };
  }

  /**
   * Force re-initialization (for development/testing)
   */
  static async reinitialize(): Promise<void> {
    console.log('🔄 Re-initializing application...');
    this.isInitialized = false;
    this.initializationPromise = null;
    
    await QuestionPrePopulationSystem.refresh();
    await this.initialize();
  }
}

export default AppInitialization;
