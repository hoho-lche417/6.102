/**
 * queue.ts
 *
 * TaskQueue ADT: a mutable queue of tasks with concurrent access.
 *
 * Problems 1-5 will build this ADT incrementally.
 */

import { Task } from './task';

/**
 * A mutable queue of tasks for concurrent workers.
 *
 * Multiple workers can dequeue tasks concurrently, and managers can
 * enqueue tasks, watch for changes, or transform all tasks.
 *
 * AF: represents the sequence of tasks in the queue, indexed by position.
 *     The first element is the next task to be dequeued.
 * RI: 
 *   - tasks is never null
 *   - all task ids are unique within the queue
 *   - no pending/claimed task appears more than once
 *   - if a task is claimed, exactly one worker claims it
 * SRE: tasks array is private; clients cannot modify it directly.
 *      All mutations go through public methods.
 *
 * Problem 1: implement synchronous methods (enqueue, peek, length, toString)
 * Problem 3: add async methods (dequeue with waiting, watch)
 * Problem 4: add map() for transforming all tasks
 * Problem 5: add change notifications
 */
export class TaskQueue {
  private tasks: Task[] = [];
  private changeListeners: Array<() => void> = [];

  /**
   * Create an empty task queue.
   */
  public constructor() {
    this.checkRep();
  }

  private checkRep(): void {
    const ids = new Set<string>();
    for (const task of this.tasks) {
      if (ids.has(task.id)) {
        throw new Error(`duplicate task id: ${task.id}`);
      }
      ids.add(task.id);
    }
  }

  /**
   * Add a new pending task to the queue.
   *
   * Problem 1.1: implement
   *
   * @param id unique task identifier
   * @param description what work needs to be done
   * @throws Error if a task with this id already exists
   */
  public enqueue(id: string, description: string): void {
    this.tasks.push(Task.newPending(id, description));
    this.checkRep();
  }

  /**
   * Look at the next pending task without removing it.
   *
   * Problem 1.2: implement
   *
   * @returns the next pending task, or undefined if queue is empty
   */
  public peek(): Task | undefined {
    return this.tasks[0];
  }

  /**
   * Return the number of pending tasks in the queue.
   *
   * Problem 1.3: implement
   *
   * @returns count of pending tasks
   */
  public length(): number {
    let pendingCount: number = 0;
    for (const t of this.tasks) {
      if (t.status == "pending") {
        ++pendingCount;
      }
    }
    return pendingCount;
  }

  /**
   * Dequeue the next pending task for a worker to claim.
   *
   * If the queue is empty, this promise waits until a task is available.
   * Once a task is dequeued, it is marked as "claimed" by this worker.
   *
   * Problem 3.1: implement asynchronously with waiting
   *
   * @param workerId the worker claiming the task
   * @returns promise of the claimed task
   */
  public async dequeue(workerId: string): Promise<Task> {
    throw new Error('implement me! (Problem 3.1)');
  }

  /**
   * Claim a task immediately without waiting (used in peek path).
   *
   * Problem 3.2: implement synchronously
   *
   * @param workerId the worker claiming the task
   * @returns the claimed task, or undefined if queue is empty
   */
  public dequeueSynchronous(workerId: string): Task | undefined {
    throw new Error('implement me! (Problem 3.2)');
  }

  /**
   * Mark a task as completed by a worker.
   *
   * Problem 1.4: implement
   *
   * @param taskId the completed task
   * @param workerId the worker who completed it
   * @param result the work result
   * @throws Error if task not found or not claimed by this worker
   */
  public complete(taskId: string, workerId: string, result: string): void {
    let ids: Array<string> = this.tasks.map((task: Task) => task.id);
    if (!ids.includes(taskId)) {
      throw new Error('task not found!');
    }

    let i = 0;
    for (; i < this.length(); ++i) {
      if (this.tasks[i].id == taskId) {
        break;
      }
    }
    if (this.tasks[i]!.worker !== workerId) {
      throw new Error('task not not claimed by this worker!');
    }

    this.tasks[i] = this.tasks[i]!
      .withStatus("completed", workerId, result);

    this.checkRep();
  }

  /**
   * Mark a task as failed.
   *
   * Problem 1.5: implement
   *
   * @param taskId the failed task
   * @param workerId the worker
   * @param reason why it failed
   * @throws Error if task not found or not claimed by this worker
   */
  public fail(taskId: string, workerId: string, reason: string): void {
    let ids: Array<string> = this.tasks.map((task: Task) => task.id);
    if (!ids.includes(taskId)) {
      throw new Error('task not found!');
    }

    let i = 0;
    for (; i < this.length(); ++i) {
      if (this.tasks[i].id == taskId) {
        break;
      }
    }
    if (this.tasks[i]!.worker !== workerId) {
      throw new Error('task not not claimed by this worker!');
    }

    this.tasks[i] = this.tasks[i]!
      .withStatus("failed", workerId, reason);

    this.checkRep();
  }

  /**
   * Look up a task by id.
   *
   * Problem 1.6: implement
   *
   * @param taskId the task to find
   * @returns the task, or undefined if not found
   */
  public getTask(taskId: string): Task | undefined {
    for (const task of this.tasks) {
      if (task.id === taskId) {
        return task;
      }
    }
  }

  /**
   * Apply a transformer function to every task.
   *
   * The transformer function is called for each task and may transform
   * the description. The function is asynchronous and may take time.
   *
   * While map() is running, other operations may interleave with it,
   * but the queue must remain consistent.
   *
   * Problem 4.1: implement
   *
   * @param transformer async function that takes a description and returns a new one
   * @returns promise that resolves when all tasks have been transformed
   */
  public async map(transformer: (desc: string) => Promise<string>): Promise<void> {
    throw new Error('implement me! (Problem 4.1)');
  }

  /**
   * Wait for the next change to the queue.
   *
   * A change is: a task's status changing, a task being added/removed,
   * or a task's description changing.
   *
   * Control changes (worker claiming a card) do not count as a change.
   *
   * Problem 5.1: implement
   *
   * @returns promise that resolves when the queue changes
   */
  public async watch(): Promise<void> {
    throw new Error('implement me! (Problem 5.1)');
  }

  /**
   * Notify all listeners that the queue has changed.
   *
   * Problem 5.2: implement (internal use)
   *
   * Call this from within any method that modifies card status or description.
   */
  protected notifyChange(): void {
    throw new Error('implement me! (Problem 5.2)');
  }

  /**
   * Add a listener to be called when the queue changes.
   *
   * Problem 5.3: implement (internal use)
   *
   * @param listener callback to invoke on change
   */
  private addListener(listener: () => void): void {
    this.changeListeners.push(listener);
  }

  /**
   * Remove a listener.
   *
   * Problem 5.4: implement (internal use)
   */
  private removeListener(listener: () => void): void {
    const idx = this.changeListeners.indexOf(listener);
    if (idx >= 0) {
      this.changeListeners.splice(idx, 1);
    }
  }

  /**
   * Human-readable representation of queue state.
   *
   * Problem 1.7: implement
   *
   * @returns string showing all tasks and their status
   */
  public toString(): string {
    let result: string = "tasks:\n";
    for (const task of this.tasks) {
      result += `${task.id}, ${task.status}\n`;
    }
    return result;
  }
}
