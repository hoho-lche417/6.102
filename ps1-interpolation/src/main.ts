/**
 * main.ts
 *
 * Runs the two text animations and prints them to the console.
 * Run with:  npm start
 *
 * You are free to modify this file.  It is not used for grading.
 */

import { handoutExampleOne, handoutExampleTwo } from './toolbox';

function printAnimation(title: string, frames: string[]): void {
  console.log(`\n${'─'.repeat(50)}`);
  console.log(title);
  console.log('─'.repeat(50));
  for (const frame of frames) {
    console.log(frame);
  }
}

printAnimation('Animation 1: Eased Progress Bar', handoutExampleOne());
printAnimation('Animation 2: Cycle Walk',         handoutExampleTwo());
