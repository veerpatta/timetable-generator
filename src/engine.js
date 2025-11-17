/**
 * engine.js
 * 
 * Timetable Generation Engine
 * 
 * This file contains the core constraint-based backtracking algorithm
 * that generates valid timetables for all classes.
 * 
 * The algorithm:
 * 1. Creates a list of tasks (subject periods to schedule)
 * 2. Prioritizes tasks (double periods first, then single periods)
 * 3. Uses backtracking to find valid assignments
 * 4. Validates constraints at each step
 */

import { allHardConstraintsOk, noTeacherConflicts, noClassConflicts, teacherLoadLimits, respectTeacherAvailability } from './constraints.js';

/**
 * Main function to generate a timetable
 * @param {Object} config - Configuration object (days, periodsPerDay)
 * @param {Array} classes - Array of class objects
 * @param {Array} subjects - Array of subject objects
 * @param {Array} teachers - Array of teacher objects
 * @param {Array} demands - Array of weekly demand objects
 * @returns {Array|null} - Array of assignments if successful, null if no solution found
 */
export function generateTimetable(config, classes, subjects, teachers, demands) {
  console.log("Starting timetable generation...");
  
  // Build time slots
  const timeSlots = buildTimeSlots(config);
  
  // Build tasks from demands
  const tasks = buildTasks(demands);
  
  // Sort tasks by priority (double periods first)
  const sortedTasks = prioritizeTasks(tasks);
  
  console.log(`Total tasks to schedule: ${sortedTasks.length}`);
  
  // Initialize empty assignments array
  const assignments = [];
  
  // Start backtracking
  const result = backtrack(0, sortedTasks, assignments, timeSlots, config, teachers, subjects);
  
  if (result) {
    console.log("✅ Timetable generated successfully!");
    console.log(`Total assignments: ${result.length}`);
    return result;
  } else {
    console.log("❌ Failed to generate timetable. No valid solution found.");
    return null;
  }
}

/**
 * Build all possible time slots
 * @param {Object} config - Configuration with days and periodsPerDay
 * @returns {Array} - Array of {day, period} objects
 */
function buildTimeSlots(config) {
  const slots = [];
  
  for (const day of config.days) {
    for (let period = 1; period <= config.periodsPerDay; period++) {
      slots.push({ day, period });
    }
  }
  
  return slots;
}

/**
 * Build tasks from weekly demands
 * Each task represents one period (or one double period) to schedule
 * @param {Array} demands - Array of weekly demand objects
 * @returns {Array} - Array of task objects
 */
function buildTasks(demands) {
  const tasks = [];
  
  for (const demand of demands) {
    const classId = demand.classId;
    const subjectId = demand.subjectId;
    const periodsPerWeek = demand.periodsPerWeek;
    const doublePeriodsPerWeek = demand.doublePeriodsPerWeek || 0;
    
    // Calculate single periods needed
    const singlePeriods = periodsPerWeek - (doublePeriodsPerWeek * 2);
    
    // Add double period tasks
    for (let i = 0; i < doublePeriodsPerWeek; i++) {
      tasks.push({
        classId,
        subjectId,
        type: 'double',
        periodsNeeded: 2
      });
    }
    
    // Add single period tasks
    for (let i = 0; i < singlePeriods; i++) {
      tasks.push({
        classId,
        subjectId,
        type: 'single',
        periodsNeeded: 1
      });
    }
  }
  
  return tasks;
}

/**
 * Prioritize tasks for better solving
 * Double periods should be scheduled first as they have more constraints
 * @param {Array} tasks - Array of task objects
 * @returns {Array} - Sorted array of tasks
 */
function prioritizeTasks(tasks) {
  return tasks.sort((a, b) => {
    // Double periods first
    if (a.type === 'double' && b.type === 'single') return -1;
    if (a.type === 'single' && b.type === 'double') return 1;
    
    // Then by subject (to group similar tasks)
    if (a.subjectId !== b.subjectId) {
      return a.subjectId.localeCompare(b.subjectId);
    }
    
    // Then by class
    return a.classId.localeCompare(b.classId);
  });
}

/**
 * Backtracking algorithm to assign tasks to time slots
 * @param {number} taskIndex - Current task index
 * @param {Array} tasks - All tasks to schedule
 * @param {Array} assignments - Current assignments (mutated)
 * @param {Array} timeSlots - Available time slots
 * @param {Object} config - Configuration
 * @param {Array} teachers - All teachers
 * @param {Array} subjects - All subjects
 * @returns {Array|null} - Assignments if successful, null otherwise
 */
function backtrack(taskIndex, tasks, assignments, timeSlots, config, teachers, subjects) {
  // Base case: all tasks assigned
  if (taskIndex >= tasks.length) {
    return assignments;
  }
  
  const task = tasks[taskIndex];
  
  // Try each day
  for (const day of config.days) {
    // Try each period (or period pair for double periods)
    const maxPeriod = task.type === 'double' 
      ? config.periodsPerDay - 1 
      : config.periodsPerDay;
    
    for (let period = 1; period <= maxPeriod; period++) {
      // Find suitable teachers for this subject and class
      const suitableTeachers = findSuitableTeachers(
        task.classId,
        task.subjectId,
        teachers
      );
      
      // Try each suitable teacher
      for (const teacher of suitableTeachers) {
        // Try to assign
        const newAssignments = tryAssignment(
          task,
          day,
          period,
          teacher.id,
          assignments,
          teachers,
          config
        );
        
        if (newAssignments) {
          // Valid assignment found, continue with next task
          const result = backtrack(
            taskIndex + 1,
            tasks,
            newAssignments,
            timeSlots,
            config,
            teachers,
            subjects
          );
          
          if (result) {
            return result;
          }
          
          // Backtrack: remove the assignments we just added
          if (task.type === 'double') {
            newAssignments.pop();
            newAssignments.pop();
          } else {
            newAssignments.pop();
          }
        }
      }
    }
  }
  
  // No valid assignment found for this task
  return null;
}

/**
 * Find teachers who can teach a given subject to a given class
 * @param {string} classId - Class ID
 * @param {string} subjectId - Subject ID
 * @param {Array} teachers - All teachers
 * @returns {Array} - Array of suitable teacher objects
 */
function findSuitableTeachers(classId, subjectId, teachers) {
  return teachers.filter(teacher => 
    teacher.subjects.includes(subjectId) &&
    teacher.teachesClasses.includes(classId)
  );
}

/**
 * Try to assign a task to a specific time slot with a specific teacher
 * @param {Object} task - Task to assign
 * @param {string} day - Day
 * @param {number} period - Period (start period for double periods)
 * @param {string} teacherId - Teacher ID
 * @param {Array} currentAssignments - Current assignments
 * @param {Array} teachers - All teachers
 * @param {Object} config - Configuration
 * @returns {Array|null} - New assignments array if valid, null otherwise
 */
function tryAssignment(task, day, period, teacherId, currentAssignments, teachers, config) {
  const newAssignments = [...currentAssignments];
  
  if (task.type === 'single') {
    // Single period assignment
    const assignment = {
      classId: task.classId,
      subjectId: task.subjectId,
      teacherId: teacherId,
      day: day,
      period: period
    };
    
    newAssignments.push(assignment);
    
    // Validate constraints
    if (isValidPartialAssignment(newAssignments, teachers, config)) {
      return newAssignments;
    }
    
  } else if (task.type === 'double') {
    // Double period assignment (consecutive)
    const assignment1 = {
      classId: task.classId,
      subjectId: task.subjectId,
      teacherId: teacherId,
      day: day,
      period: period
    };
    
    const assignment2 = {
      classId: task.classId,
      subjectId: task.subjectId,
      teacherId: teacherId,
      day: day,
      period: period + 1
    };
    
    newAssignments.push(assignment1);
    newAssignments.push(assignment2);
    
    // Validate constraints
    if (isValidPartialAssignment(newAssignments, teachers, config)) {
      return newAssignments;
    }
  }
  
  return null;
}

/**
 * Check if a partial assignment is valid (doesn't violate constraints)
 * @param {Array} assignments - Assignments to check
 * @param {Array} teachers - All teachers
 * @param {Object} config - Configuration
 * @returns {boolean} - true if valid, false otherwise
 */
function isValidPartialAssignment(assignments, teachers, config) {
  // Check the critical constraints that would fail immediately
  return (
    noTeacherConflicts(assignments) &&
    noClassConflicts(assignments) &&
    teacherLoadLimits(assignments, teachers) &&
    respectTeacherAvailability(assignments, teachers)
  );
}
