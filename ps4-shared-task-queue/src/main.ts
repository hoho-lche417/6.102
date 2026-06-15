/**
 * main.ts
 *
 * Entry point for the task queue server.
 *
 * Run with: npm start
 * Or with a port: npm start 3000
 */

import { TaskQueue } from './queue';
import { createServer } from './server';

async function main(): Promise<void> {
  const port = parseInt(process.argv[2] || '3000', 10);
  
  // Create a new task queue
  const queue = new TaskQueue();
  
  // Add some example tasks
  queue.enqueue('task-1', 'Process payment for order #123');
  queue.enqueue('task-2', 'Send confirmation email');
  queue.enqueue('task-3', 'Update inventory');
  
  console.log(`Starting task queue server on port ${port}...`);
  console.log(`Initial queue: ${queue.toString()}`);
  
  // Start the server
  createServer(queue, port);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
