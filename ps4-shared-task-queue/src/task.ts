/**
 * task.ts
 *
 * An immutable Task type representing a unit of work in the queue.
 */

/**
 * An immutable task in the work queue.
 *
 * A task has:
 *   - `id`: unique identifier
 *   - `description`: what work needs to be done
 *   - `status`: current state (pending, claimed, completed, failed)
 *   - `worker`: which worker claimed it (if any)
 *   - `result`: outcome if completed
 */
export class Task {
  public constructor(
    readonly id: string,
    readonly description: string,
    readonly status: 'pending' | 'claimed' | 'completed' | 'failed',
    readonly worker?: string,
    readonly result?: string
  ) {
    this.checkRep();
  }

  private checkRep(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('task id must be non-empty');
    }
    if (!this.description || this.description.trim() === '') {
      throw new Error('task description must be non-empty');
    }
    if (this.status === 'pending' && this.worker) {
      throw new Error('pending task cannot have a worker');
    }
    if ((this.status === 'completed' || this.status === 'failed') && !this.worker) {
      throw new Error('completed/failed task must have a worker');
    }
  }

  public static newPending(id: string, description: string): Task {
    return new Task(id, description, 'pending');
  }

  public withStatus(status: Task['status'], worker?: string, result?: string): Task {
    return new Task(this.id, this.description, status, worker, result);
  }

  public equalValue(other: unknown): boolean {
    if (!(other instanceof Task)) return false;
    return this.id === other.id && 
           this.status === other.status &&
           this.worker === other.worker;
  }

  public toString(): string {
    let s = `Task(${this.id}:${this.status}`;
    if (this.worker) s += `,worker=${this.worker}`;
    if (this.result) s += `,result=${this.result}`;
    s += ')';
    return s;
  }
}
