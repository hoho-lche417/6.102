/**
 * server.ts
 *
 * HTTP server for the shared task queue.
 *
 * Problem 2: implement endpoints that use TaskQueue.
 *
 * The server provides a REST API:
 *   POST /enqueue?id=ID&desc=DESCRIPTION   - add a task
 *   GET  /peek                              - see next pending task
 *   POST /dequeue?worker=WORKER_ID          - claim a task
 *   POST /complete?task=ID&worker=W&result=R
 *   POST /fail?task=ID&worker=W&reason=R
 *   GET  /task?id=ID                        - look up a task
 *   POST /map                               - transform all tasks
 *   GET  /watch                             - wait for changes
 */

import express from 'express';
import { TaskQueue } from './queue';

/**
 * Create and start an HTTP server for the task queue.
 *
 * Problem 2.1: implement
 *
 * The server should parse query parameters and request bodies,
 * call the appropriate TaskQueue methods, and respond with JSON.
 *
 * @param queue the task queue to serve
 * @param port port number to listen on
 * @returns the running express server
 */
export function createServer(queue: TaskQueue, port: number): void {
  const app = express();
  
  app.use(express.json());

  /**
   * POST /enqueue?id=ID&desc=DESCRIPTION
   *
   * Problem 2.2: implement
   */
  app.post('/enqueue', (req, res) => {
    throw new Error('implement me! (Problem 2.2)');
  });

  /**
   * GET /peek
   *
   * Problem 2.3: implement
   */
  app.get('/peek', (req, res) => {
    throw new Error('implement me! (Problem 2.3)');
  });

  /**
   * POST /dequeue?worker=WORKER_ID
   *
   * Problem 3.3: implement asynchronously
   */
  app.post('/dequeue', async (req, res) => {
    throw new Error('implement me! (Problem 3.3)');
  });

  /**
   * POST /complete?task=ID&worker=WORKER_ID&result=RESULT
   *
   * Problem 2.4: implement
   */
  app.post('/complete', (req, res) => {
    throw new Error('implement me! (Problem 2.4)');
  });

  /**
   * POST /fail?task=ID&worker=WORKER_ID&reason=REASON
   *
   * Problem 2.5: implement
   */
  app.post('/fail', (req, res) => {
    throw new Error('implement me! (Problem 2.5)');
  });

  /**
   * GET /task?id=ID
   *
   * Problem 2.6: implement
   */
  app.get('/task', (req, res) => {
    throw new Error('implement me! (Problem 2.6)');
  });

  /**
   * POST /map (with transformer function in body)
   *
   * Problem 4.2: implement
   *
   * The request body should be a transformer function as a string.
   * For simplicity, you might accept a simple transformation like "upper" -> uppercase.
   */
  app.post('/map', async (req, res) => {
    throw new Error('implement me! (Problem 4.2)');
  });

  /**
   * GET /watch
   *
   * Problem 5.5: implement
   *
   * This endpoint waits for the queue to change, then responds.
   */
  app.get('/watch', async (req, res) => {
    throw new Error('implement me! (Problem 5.5)');
  });

  /**
   * GET /state
   *
   * Problem 2.7: implement (helper endpoint to see full queue state)
   */
  app.get('/state', (req, res) => {
    throw new Error('implement me! (Problem 2.7)');
  });

  app.listen(port, () => {
    console.log(`Task queue server listening on port ${port}`);
  });
}
