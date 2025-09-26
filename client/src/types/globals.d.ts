/**
 * Type augmentation file to fix AbortSignal conflicts between Node.js and DOM
 */

// This prevents TS from complaining about duplicate declarations
// between Node.js and DOM types for AbortSignal
export {};

declare global {
  // Make TypeScript use only one AbortSignal definition and ignore conflicts
  interface AbortSignalStatic {
    timeout(ms: number): AbortSignal;
    any(signals: AbortSignal[]): AbortSignal;
    abort(reason?: any): AbortSignal;
  }

  // Ensure AbortSignal is properly declared as a global
  var AbortSignal: AbortSignalStatic;
}