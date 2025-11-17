/* ====================================
   TIMETABLE GENERATION ENGINE

   This file contains the core constraint-based
   backtracking algorithm for generating timetables.

   Algorithm Overview:
   1. Build list of all time slots (day × period combinations)
   2. Build list of tasks (subject assignments needed)
   3. Prioritize tasks (double periods first, then single)
   4. Use backtracking to assign each task:
      - Try each possible slot
      - Try each eligible teacher
      - Check constraints
      - If valid, continue; else backtrack
   5. Return complete timetable or null if no solution
   ==================================== */

/**
 * Main function to generate a complete timetable.
 *
 * @returns {Array|null} - Array of assignments if successful, null if no solution
 */
function generateTimetable() {
    console.log("=== Starting Timetable Generation ===");

    // Build time slots
    const timeSlots = buildTimeSlots();
    console.log(`Total time slots: ${timeSlots.length}`);

    // Build tasks from weekly demands
    const tasks = buildTasks();
    console.log(`Total tasks to schedule: ${tasks.length}`);

    // Prioritize tasks (heuristic: double periods first)
    const prioritizedTasks = prioritizeTasks(tasks);

    // Initialize assignments array
    const assignments = [];

    // Start backtracking
    const result = backtrack(assignments, prioritizedTasks, 0, timeSlots);

    if (result) {
        console.log("=== Timetable Generation Successful ===");
        console.log(`Total assignments: ${result.length}`);
        return result;
    } else {
        console.log("=== Timetable Generation Failed ===");
        return null;
    }
}

/**
 * Build a list of all available time slots.
 *
 * @returns {Array} - Array of {day, period} objects
 */
function buildTimeSlots() {
    const slots = [];

    for (const day of CONFIG.days) {
        for (let period = 1; period <= CONFIG.periodsPerDay; period++) {
            slots.push({ day, period });
        }
    }

    return slots;
}

/**
 * Build a list of tasks (individual period assignments needed).
 *
 * Tasks are derived from WEEKLY_DEMANDS.
 * For double periods, we create special tasks that require 2 consecutive slots.
 *
 * @returns {Array} - Array of task objects
 */
function buildTasks() {
    const tasks = [];

    for (const demand of WEEKLY_DEMANDS) {
        const { classId, subjectId, periodsPerWeek, doublePeriodsPerWeek } = demand;

        // Calculate single periods needed
        const singlePeriodsNeeded = periodsPerWeek - (doublePeriodsPerWeek * 2);

        // Add double period tasks
        for (let i = 0; i < doublePeriodsPerWeek; i++) {
            tasks.push({
                classId,
                subjectId,
                type: "double", // Requires 2 consecutive periods
                id: `${classId}-${subjectId}-D${i}`,
            });
        }

        // Add single period tasks
        for (let i = 0; i < singlePeriodsNeeded; i++) {
            tasks.push({
                classId,
                subjectId,
                type: "single",
                id: `${classId}-${subjectId}-S${i}`,
            });
        }
    }

    return tasks;
}

/**
 * Prioritize tasks to improve solving efficiency.
 *
 * Heuristics:
 * - Double periods first (harder to place)
 * - Tasks with fewer eligible teachers
 * - Random shuffle for variety
 *
 * @param {Array} tasks - Array of task objects
 * @returns {Array} - Prioritized array of tasks
 */
function prioritizeTasks(tasks) {
    // Sort: double periods first, then single
    const sorted = [...tasks].sort((a, b) => {
        // Double periods have higher priority
        if (a.type === "double" && b.type === "single") return -1;
        if (a.type === "single" && b.type === "double") return 1;

        // For same type, prioritize based on number of eligible teachers (fewer = harder)
        const aTeachers = getEligibleTeachers(a.subjectId, a.classId).length;
        const bTeachers = getEligibleTeachers(b.subjectId, b.classId).length;

        if (aTeachers < bTeachers) return -1;
        if (aTeachers > bTeachers) return 1;

        return 0;
    });

    return sorted;
}

/**
 * Backtracking algorithm to assign tasks to time slots with teachers.
 *
 * @param {Array} assignments - Current assignments (being built)
 * @param {Array} tasks - Tasks to assign
 * @param {number} taskIndex - Current task index
 * @param {Array} timeSlots - Available time slots
 * @returns {Array|null} - Complete assignments or null
 */
function backtrack(assignments, tasks, taskIndex, timeSlots) {
    // Base case: all tasks assigned
    if (taskIndex >= tasks.length) {
        return assignments;
    }

    const task = tasks[taskIndex];

    // Get eligible teachers for this task
    const eligibleTeachers = getEligibleTeachers(task.subjectId, task.classId);

    if (eligibleTeachers.length === 0) {
        console.error(`No eligible teachers for ${task.classId} - ${task.subjectId}`);
        return null;
    }

    // Try to assign this task
    if (task.type === "single") {
        // Single period assignment
        for (const slot of timeSlots) {
            for (const teacher of eligibleTeachers) {
                // Try this assignment
                const newAssignment = {
                    classId: task.classId,
                    subjectId: task.subjectId,
                    teacherId: teacher.id,
                    day: slot.day,
                    period: slot.period,
                    type: "single",
                };

                // Check if this assignment is valid
                if (isValidAssignment(newAssignment, assignments)) {
                    // Add assignment and continue
                    assignments.push(newAssignment);

                    const result = backtrack(assignments, tasks, taskIndex + 1, timeSlots);

                    if (result) {
                        return result; // Solution found
                    }

                    // Backtrack: remove assignment
                    assignments.pop();
                }
            }
        }
    } else if (task.type === "double") {
        // Double period assignment (2 consecutive periods)
        for (const day of CONFIG.days) {
            for (let period = 1; period < CONFIG.periodsPerDay; period++) {
                // Try consecutive periods
                const period1 = period;
                const period2 = period + 1;

                for (const teacher of eligibleTeachers) {
                    // Create two assignments
                    const assignment1 = {
                        classId: task.classId,
                        subjectId: task.subjectId,
                        teacherId: teacher.id,
                        day: day,
                        period: period1,
                        type: "double",
                    };

                    const assignment2 = {
                        classId: task.classId,
                        subjectId: task.subjectId,
                        teacherId: teacher.id,
                        day: day,
                        period: period2,
                        type: "double",
                    };

                    // Check if both assignments are valid
                    if (
                        isValidAssignment(assignment1, assignments) &&
                        isValidAssignment(assignment2, [...assignments, assignment1])
                    ) {
                        // Add both assignments
                        assignments.push(assignment1);
                        assignments.push(assignment2);

                        const result = backtrack(assignments, tasks, taskIndex + 1, timeSlots);

                        if (result) {
                            return result; // Solution found
                        }

                        // Backtrack: remove both assignments
                        assignments.pop();
                        assignments.pop();
                    }
                }
            }
        }
    }

    // No valid assignment found for this task
    return null;
}

/**
 * Check if a new assignment is valid given current assignments.
 *
 * @param {Object} newAssignment - The assignment to check
 * @param {Array} currentAssignments - Existing assignments
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidAssignment(newAssignment, currentAssignments) {
    // Create temporary assignments array with new assignment
    const tempAssignments = [...currentAssignments, newAssignment];

    // Check teacher conflict (teacher can't be in two places at once)
    if (!noTeacherConflicts(tempAssignments)) {
        return false;
    }

    // Check class conflict (class can't have two subjects at once)
    if (!noClassConflicts(tempAssignments)) {
        return false;
    }

    // Check teacher load limits
    if (!teacherLoadLimits(tempAssignments, TEACHERS)) {
        return false;
    }

    // Check teacher availability
    if (!respectTeacherAvailability(tempAssignments, TEACHERS)) {
        return false;
    }

    // Check room conflicts
    if (!roomConflicts(tempAssignments, ROOMS)) {
        return false;
    }

    // All checks passed
    return true;
}

/**
 * Get statistics about the generated timetable.
 *
 * @param {Array} assignments - Array of assignments
 * @returns {Object} - Statistics object
 */
function getTimetableStats(assignments) {
    if (!assignments) {
        return null;
    }

    const stats = {
        totalAssignments: assignments.length,
        byClass: {},
        byTeacher: {},
        bySubject: {},
    };

    // Count assignments by class
    for (const cls of CLASSES) {
        stats.byClass[cls.id] = assignments.filter(a => a.classId === cls.id).length;
    }

    // Count assignments by teacher
    for (const teacher of TEACHERS) {
        stats.byTeacher[teacher.id] = assignments.filter(a => a.teacherId === teacher.id).length;
    }

    // Count assignments by subject
    for (const subject of SUBJECTS) {
        stats.bySubject[subject.id] = assignments.filter(a => a.subjectId === subject.id).length;
    }

    return stats;
}
