# Shared Task Queue

An equivalent of MIT 6.102 PS4, teaching **concurrent access to shared mutable state**, **asynchronous operations**, **promises**, and **change notifications**.

---

## Setup

```bash
npm install
npm test        # Run tests (most will fail with "implement me!")
npm start       # Start the HTTP server (once implemented)
```

---

## Overview

You will build a **work queue system** where multiple **workers** concurrently claim tasks, and **managers** can enqueue tasks, watch for changes, and transform them.

### The System

```
Manager                  Queue                   Workers
─────────────────────────────────────────────────────────
enqueue(task)  ──────→  [ task-1 (pending) ]  ──→ worker-1
               ──────→  [ task-2 (pending) ]  ──→ worker-2
               ──────→  [ task-3 (pending) ]  ──→ worker-3

dequeue() ←─────────────────────────┐
watch()   ←─────────────────────────┤── claimed/completed/failed
map()     ←─────────────────────────┘
```

---

## 5 Problems

### **Problem 1: Synchronous TaskQueue ADT**

**File:** `src/queue.ts` and `src/task.ts`

Implement the basic queue operations:

**1.1 - 1.7: Implement these TaskQueue methods:**
- `enqueue(id, description)` — add a pending task
- `peek()` — see next pending task without removing
- `length()` — count pending tasks
- `dequeueSynchronous(workerId)` — synchronously claim a task
- `complete(taskId, workerId, result)` — mark task as completed
- `fail(taskId, workerId, reason)` — mark task as failed
- `getTask(taskId)` — look up task by id
- `toString()` — show queue state

**Key Invariants:**
- Each task has a unique id
- Only pending tasks can be dequeued
- Only the claiming worker can complete/fail a task
- No two tasks can have the same id

**Testing Strategy (write tests first!):**
- Enqueue/peek basic operations
- Worker claiming tasks
- Task completion and failure
- Error cases (wrong worker, duplicate id, etc.)

**Commit** when Problem 1 passes all tests.

---

### **Problem 2: HTTP Server Integration**

**File:** `src/server.ts`

Implement HTTP endpoints that call TaskQueue methods:

**2.1 - 2.7: Implement these endpoints:**
- `POST /enqueue?id=ID&desc=DESCRIPTION` — call `enqueue()`
- `GET /peek` — call `peek()`
- `POST /dequeue?worker=WORKER_ID` — call `dequeueSynchronous()`
- `POST /complete?task=ID&worker=W&result=R` — call `complete()`
- `POST /fail?task=ID&worker=W&reason=R` — call `fail()`
- `GET /task?id=ID` — call `getTask()`
- `GET /state` — return full queue state (helper)

**Implementation Notes:**
- Each endpoint should be 2-3 lines of code
- Parse query parameters
- Return results as JSON
- Return errors with appropriate HTTP status codes

Run the server:
```bash
npm start 3000
```

Test with curl:
```bash
curl http://localhost:3000/peek
curl -X POST "http://localhost:3000/enqueue?id=t1&desc=hello"
curl -X POST "http://localhost:3000/dequeue?worker=alice"
```

**Commit** when HTTP endpoints work.

---

### **Problem 3: Asynchronous Dequeue with Waiting**

**File:** `src/queue.ts`

Make the queue **asynchronous** so workers can wait for tasks.

**3.1 - 3.3: Implement these methods:**
- `async dequeue(workerId)` — claim a task, **waiting** if queue is empty
  - Returns a promise that resolves when a task is available
  - Multiple workers can `await dequeue()` concurrently
- `dequeueSynchronous(workerId)` — existing synchronous method (used by Problem 2)
- `POST /dequeue` endpoint — use `await dequeue()`

**Key Technique:**
Use `Promise.withResolvers()` to create promises that resolve when tasks become available:

```typescript
// Create a promise to resolve later
const { promise, resolve } = Promise.withResolvers<Task>();

// Store the promise somewhere
// When a new task arrives, resolve it:
resolve(newTask);
```

**Waiting Pattern:**
When `dequeue()` is called but queue is empty:
1. Create a new promise
2. Store it in a "waiters" list
3. Return the promise
4. When `enqueue()` is called, resolve the waiting promise with the new task

**Testing with `timeout()`:**

For testing concurrent behavior, use a helper to let async operations run:

```typescript
async function timeout(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

// Usage in test:
const dequeuedPromise = q.dequeue('worker-1');
await timeout(10);  // let async ops run
q.enqueue('t1', 'Task');
await timeout(10);
const task = await dequeuedPromise;  // should now be resolved
```

**Concurrency Testing:**
- Multiple workers waiting for tasks
- Tasks arriving while workers wait
- New workers joining the queue
- No busy-waiting (use promises, not loops!)

**Commit** when Problem 3 passes tests.

---

### **Problem 4: Map Transformer Function**

**File:** `src/queue.ts` and `src/server.ts`

Implement a `map()` function that transforms all task descriptions.

**4.1 - 4.2: Implement:**
- `async map(transformer)` — apply transformer function to each task description
  - The transformer is `async (desc: string) => string`
  - Must handle all tasks, even those being dequeued
  - Other operations may interleave with `map()`
- `POST /map` endpoint — call `map()` with a simple transformer

**Key Requirements:**
- **Atomic consistency:** if two tasks match before `map()`, they must still match after
- **Non-blocking:** other operations can happen while `map()` is running
- **All tasks transformed:** every task gets the transformation applied

**Implementation Approach:**
1. Iterate through all tasks
2. Call `transformer()` on each description
3. Update each task with new description
4. Notify listeners of changes (Problem 5)

**Example Transformer:**
```typescript
// Uppercase transformer
await q.map(async (desc) => desc.toUpperCase());

// Or with HTTP: POST /map with body {"type": "uppercase"}
```

**Commit** when Problem 4 tests pass.

---

### **Problem 5: Change Notifications**

**File:** `src/queue.ts` and `src/server.ts`

Implement a **notification system** so clients can watch for changes.

**5.1 - 5.5: Implement:**
- `async watch()` — return a promise that resolves on next change
  - Change = task status change, description change, or task added/removed
  - Control changes (worker claim) do NOT count as changes
- `notifyChange()` — notify all listeners (internal)
- `addListener(callback)` — register a listener (internal)
- `removeListener(callback)` — unregister a listener (internal)
- `GET /watch` endpoint — call `watch()`

**Implementation Approach:**

Option A: **Promise-based** (simpler)
```typescript
// When watch() is called, create a promise
// Store the resolve function in a list
// When a change happens, call all stored resolve functions

private changeResolvers: Array<() => void> = [];

async watch(): Promise<void> {
  const { promise, resolve } = Promise.withResolvers<void>();
  this.changeResolvers.push(resolve);
  return promise;
}

notifyChange(): void {
  for (const resolve of this.changeResolvers) {
    resolve();
  }
  this.changeResolvers = [];
}
```

Option B: **Callback-based** (more flexible)
```typescript
// Clients register callbacks
// Queue calls them on each change

private listeners: Array<() => void> = [];

addListener(listener: () => void): void {
  this.listeners.push(listener);
}

notifyChange(): void {
  for (const listener of this.listeners) {
    listener();
  }
}

// In watch():
async watch(): Promise<void> {
  return new Promise((resolve) => {
    const listener = () => {
      this.removeListener(listener);
      resolve();
    };
    this.addListener(listener);
  });
}
```

**What Counts as a Change:**
- Task enqueued (added to queue)
- Task status changes (pending → claimed → completed/failed)
- Task description changed (by map())

**What Does NOT Count:**
- Worker taking control of a task (status stays "pending" → "claimed", but is this a change? You decide!)
- Failed operations (e.g., trying to dequeue empty queue)

**Testing:**
```typescript
it('watch waits for change', async () => {
  const q = new TaskQueue();
  q.enqueue('t1', 'task');
  
  const watchPromise = q.watch();
  let changed = false;
  watchPromise.then(() => { changed = true; });
  
  await timeout(10);
  assert.strictEqual(changed, false);
  
  q.enqueue('t2', 'another');
  await timeout(10);
  assert.strictEqual(changed, true);
});
```

**Commit** when Problem 5 tests pass.

---

## Before You're Done

**For each class and method:**
- ✓ TypeDoc specs with `@param` and `@returns`
- ✓ Abstraction Function (AF) documented
- ✓ Representation Invariant (RI) documented
- ✓ Safety from Rep Exposure (SRE) explained
- ✓ `checkRep()` on mutable operations
- ✓ `toString()` implemented

**Testing:**
- ✓ Comprehensive test suite for TaskQueue
- ✓ Tests for concurrent operations (multiple workers)
- ✓ Tests for waiting behavior
- ✓ Tests for error cases
- ✓ No busy-waiting (use promises)

**Code Quality:**
- ✓ No `console.log()` except in main/server
- ✓ All methods return appropriate types
- ✓ Error handling with meaningful messages
- ✓ HTTP endpoints are simple glue code (2-3 lines each)

---

## Skills Practised (Maps to PS4)

| PS4 Concept | This Exercise |
|---|---|
| Mutable ADTs | TaskQueue with state |
| Concurrency | Multiple workers |
| Promises & async/await | dequeue() waits, map() is async |
| Waiting/blocking | dequeue() when queue empty |
| Atomic operations | Task claim, complete, fail |
| Change notifications | watch() and notifyChange() |
| HTTP integration | /enqueue, /dequeue, /watch endpoints |
| Consistent state | Queue invariants maintained |
| Transformer functions | map() with async transformer |

---

## Iterative Development Path

1. **Problems 1 & 2** first (synchronous, simple)
   - Get basic enqueue/dequeue working
   - Connect to HTTP
   - Test with curl

2. **Problem 3** next (concurrency)
   - Make dequeue() asynchronous
   - Test multiple workers
   - Verify waiting behavior

3. **Problems 4 & 5** last (advanced)
   - Add map() transformer
   - Add watch() notifications
   - Full integration testing
