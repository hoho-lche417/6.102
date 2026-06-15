/**
 * queue.test.ts
 *
 * Test suite for TaskQueue.
 *
 * Problems 1-5: write tests before implementing each part.
 */

import assert from 'assert';
import { Task } from '../src/task';
import { TaskQueue } from '../src/queue';

// ─────────────────────────────────────────────────────────────────────────────
// Problem 1: Synchronous queue operations
// ─────────────────────────────────────────────────────────────────────────────

describe('Problem 1: Synchronous TaskQueue', () => {
  
  describe('enqueue & peek', () => {
    it('enqueue adds a task', () => {
      const q = new TaskQueue();
      q.enqueue('t1', 'Do something');
      assert.strictEqual(q.length(), 1);
    });

    it('peek returns the next task', () => {
      const q = new TaskQueue();
      q.enqueue('t1', 'First task');
      q.enqueue('t2', 'Second task');
      const next = q.peek();
      assert.ok(next);
      assert.strictEqual(next.id, 't1');
      assert.strictEqual(next.status, 'pending');
    });

    it('peek does not remove the task', () => {
      const q = new TaskQueue();
      q.enqueue('t1', 'Task');
      q.peek();
      assert.strictEqual(q.length(), 1);
    });

    it('peek returns undefined when queue is empty', () => {
      const q = new TaskQueue();
      assert.strictEqual(q.peek(), undefined);
    });
  });

  describe('length', () => {
    it('length of new queue is 0', () => {
      const q = new TaskQueue();
      assert.strictEqual(q.length(), 0);
    });

    it('length increases with enqueue', () => {
      const q = new TaskQueue();
      q.enqueue('t1', 'Task 1');
      q.enqueue('t2', 'Task 2');
      assert.strictEqual(q.length(), 2);
    });
  });

  describe('complete & fail', () => {
    it('complete marks a task as completed', () => {
      const q = new TaskQueue();
      q.enqueue('t1', 'Task');
      const task = q.dequeueSynchronous('worker-1');
      assert.ok(task);
      q.complete('t1', 'worker-1', 'Done!');
      const completed = q.getTask('t1');
      assert.ok(completed);
      assert.strictEqual(completed.status, 'completed');
      assert.strictEqual(completed.result, 'Done!');
    });

    it('fail marks a task as failed', () => {
      const q = new TaskQueue();
      q.enqueue('t1', 'Task');
      const task = q.dequeueSynchronous('worker-1');
      assert.ok(task);
      q.fail('t1', 'worker-1', 'Network error');
      const failed = q.getTask('t1');
      assert.ok(failed);
      assert.strictEqual(failed.status, 'failed');
      assert.strictEqual(failed.result, 'Network error');
    });

    it('complete throws if wrong worker', () => {
      const q = new TaskQueue();
      q.enqueue('t1', 'Task');
      q.dequeueSynchronous('worker-1');
      assert.throws(() => {
        q.complete('t1', 'worker-2', 'Result');
      });
    });
  });

  describe('toString', () => {
    it('toString shows queue state', () => {
      const q = new TaskQueue();
      q.enqueue('t1', 'First');
      q.enqueue('t2', 'Second');
      const str = q.toString();
      assert(str.includes('t1'), 'should include task id t1');
      assert(str.includes('t2'), 'should include task id t2');
      assert(str.includes('pending'), 'should show pending status');
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Problem 3: Asynchronous dequeue with waiting
// ─────────────────────────────────────────────────────────────────────────────

describe('Problem 3: Async dequeue', () => {
  
  it('dequeue waits when queue is empty', async () => {
    const q = new TaskQueue();
    
    // Start a dequeue that will wait
    const dequeuedPromise = q.dequeue('worker-1');
    
    // Queue is empty, so the promise is still pending
    let resolved = false;
    dequeuedPromise.then(() => { resolved = true; });
    
    // Give async operations a moment to run
    await new Promise(r => setTimeout(r, 10));
    assert.strictEqual(resolved, false, 'dequeue should still be waiting');
    
    // Now enqueue a task
    q.enqueue('t1', 'Task');
    
    // Wait a moment for the promise to resolve
    await new Promise(r => setTimeout(r, 10));
    
    // Now the dequeue should be resolved
    const task = await dequeuedPromise;
    assert.ok(task);
    assert.strictEqual(task.id, 't1');
    assert.strictEqual(task.status, 'claimed');
    assert.strictEqual(task.worker, 'worker-1');
  });

  it('multiple workers can dequeue in parallel', async () => {
    const q = new TaskQueue();
    
    // Start three workers waiting for tasks
    const p1 = q.dequeue('worker-1');
    const p2 = q.dequeue('worker-2');
    const p3 = q.dequeue('worker-3');
    
    // Add three tasks
    q.enqueue('t1', 'Task 1');
    q.enqueue('t2', 'Task 2');
    q.enqueue('t3', 'Task 3');
    
    // Let promises settle
    await new Promise(r => setTimeout(r, 50));
    
    // All three workers should have received a task
    const task1 = await p1;
    const task2 = await p2;
    const task3 = await p3;
    
    assert.strictEqual(task1.worker, 'worker-1');
    assert.strictEqual(task2.worker, 'worker-2');
    assert.strictEqual(task3.worker, 'worker-3');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Problem 4: Map transformer function
// ─────────────────────────────────────────────────────────────────────────────

describe('Problem 4: map()', () => {
  
  it('map transforms all task descriptions', async () => {
    const q = new TaskQueue();
    q.enqueue('t1', 'hello');
    q.enqueue('t2', 'world');
    
    await q.map(async (desc) => desc.toUpperCase());
    
    const t1 = q.getTask('t1');
    const t2 = q.getTask('t2');
    assert.strictEqual(t1?.description, 'HELLO');
    assert.strictEqual(t2?.description, 'WORLD');
  });

  it('map does not affect task status or worker', async () => {
    const q = new TaskQueue();
    q.enqueue('t1', 'hello');
    const task = q.dequeueSynchronous('worker-1');
    assert.ok(task);
    
    await q.map(async (desc) => desc + '!');
    
    const updated = q.getTask('t1');
    assert.strictEqual(updated?.status, 'claimed');
    assert.strictEqual(updated?.worker, 'worker-1');
    assert.strictEqual(updated?.description, 'hello!');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Problem 5: Watch for changes
// ─────────────────────────────────────────────────────────────────────────────

describe('Problem 5: watch()', () => {
  
  it('watch waits for a change', async () => {
    const q = new TaskQueue();
    q.enqueue('t1', 'Initial task');
    
    // Start watching
    const watchPromise = q.watch();
    
    let changed = false;
    watchPromise.then(() => { changed = true; });
    
    // Give a moment for watch to start
    await new Promise(r => setTimeout(r, 10));
    assert.strictEqual(changed, false, 'should still be waiting');
    
    // Make a change
    q.enqueue('t2', 'New task');
    
    // Wait for watch to detect it
    await new Promise(r => setTimeout(r, 50));
    assert.strictEqual(changed, true, 'watch should have detected change');
  });

  it('watch detects status changes', async () => {
    const q = new TaskQueue();
    q.enqueue('t1', 'Task');
    
    const watchPromise = q.watch();
    
    // Dequeue and complete the task in a moment
    setTimeout(() => {
      const task = q.dequeueSynchronous('worker-1');
      if (task) {
        q.complete('t1', 'worker-1', 'Done');
      }
    }, 20);
    
    // watch should detect the completion
    await watchPromise;
  });
});
