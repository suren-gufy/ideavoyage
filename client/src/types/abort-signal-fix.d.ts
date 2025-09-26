/**
 * This is a custom type definition file to resolve conflicts between
 * DOM and Node.js AbortSignal implementations.
 */

// Tell TypeScript this is a module
export {};

declare global {
  // Define a namespace for Node.js specific AbortSignal features
  namespace NodeJS {
    interface AbortSignalConstructor {
      // Static methods on AbortSignal in Node.js
      timeout(ms: number): AbortSignal;
      any(signals: AbortSignal[]): AbortSignal;
      abort(reason?: any): AbortSignal;
    }
    
    // Extend the global AbortSignal with Node.js specific features
    interface AbortSignal {
      reason?: any;
      throwIfAborted(): void;
    }
  }
  
  // Make the global AbortSignal constructor include Node.js extensions
  var AbortSignal: {
    prototype: AbortSignal;
    new(): AbortSignal;
  } & NodeJS.AbortSignalConstructor;
}