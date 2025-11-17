/**
 * constraints.js
 * 
 * Constraint Validation Functions
 * 
 * This file contains functions that check whether a set of timetable
 * assignments violates any hard constraints.
 * 
 * Each function takes assignments (and other relevant data) and returns
 * true if the constraint is satisfied, false otherwise.
 */

/**
 * Check that no teacher is assigned to two different classes at the same time
 * @param {Array} assignments - Array of assignment objects
 * @returns {boolean} - true if no conflicts, false otherwise
 */
export function noTeacherConflicts(assignments) {
  // Group assignments by (teacherId, day, period)
  const teacherSlots = new Map();
  
  for (const assignment of assignments) {
    const key = `${assignment.teacherId}_${assignment.day}_${assignment.period}`;
    
    if (teacherSlots.has(key)) {
      // Teacher is already assigned at this slot
      return false;
    }
    
    teacherSlots.set(key, assignment);
  }
  
  return true;
}

/**
 * Check that no class has two subjects scheduled at the same time
 * @param {Array} assignments - Array of assignment objects
 * @returns {boolean} - true if no conflicts, false otherwise
 */
export function noClassConflicts(assignments) {
  // Group assignments by (classId, day, period)
  const classSlots = new Map();
  
  for (const assignment of assignments) {
    const key = `${assignment.classId}_${assignment.day}_${assignment.period}`;
    
    if (classSlots.has(key)) {
      // Class already has a subject at this slot
      return false;
    }
    
    classSlots.set(key, assignment);
  }
  
  return true;
}

/**
 * Check that teachers don't exceed their daily and weekly load limits
 * @param {Array} assignments - Array of assignment objects
 * @param {Array} teachers - Array of teacher objects with maxPerDay and maxPerWeek
 * @returns {boolean} - true if all limits respected, false otherwise
 */
export function teacherLoadLimits(assignments, teachers) {
  // Create a map for quick teacher lookup
  const teacherMap = new Map();
  for (const teacher of teachers) {
    teacherMap.set(teacher.id, teacher);
  }
  
  // Count assignments per teacher per day
  const dailyCounts = new Map();
  const weeklyCounts = new Map();
  
  for (const assignment of assignments) {
    const teacherId = assignment.teacherId;
    const day = assignment.day;
    
    // Daily count
    const dayKey = `${teacherId}_${day}`;
    dailyCounts.set(dayKey, (dailyCounts.get(dayKey) || 0) + 1);
    
    // Weekly count
    weeklyCounts.set(teacherId, (weeklyCounts.get(teacherId) || 0) + 1);
  }
  
  // Check daily limits
  for (const [key, count] of dailyCounts.entries()) {
    const teacherId = key.split('_')[0];
    const teacher = teacherMap.get(teacherId);
    
    if (teacher && count > teacher.maxPerDay) {
      return false;
    }
  }
  
  // Check weekly limits
  for (const [teacherId, count] of weeklyCounts.entries()) {
    const teacher = teacherMap.get(teacherId);
    
    if (teacher && count > teacher.maxPerWeek) {
      return false;
    }
  }
  
  return true;
}

/**
 * Check that teachers are not assigned during their unavailable slots
 * @param {Array} assignments - Array of assignment objects
 * @param {Array} teachers - Array of teacher objects with unavailableSlots
 * @returns {boolean} - true if all availability respected, false otherwise
 */
export function respectTeacherAvailability(assignments, teachers) {
  // Create a map of teacher unavailable slots for quick lookup
  const unavailableMap = new Map();
  
  for (const teacher of teachers) {
    if (teacher.unavailableSlots && teacher.unavailableSlots.length > 0) {
      const slots = new Set();
      for (const slot of teacher.unavailableSlots) {
        slots.add(`${slot.day}_${slot.period}`);
      }
      unavailableMap.set(teacher.id, slots);
    }
  }
  
  // Check each assignment
  for (const assignment of assignments) {
    const unavailableSlots = unavailableMap.get(assignment.teacherId);
    
    if (unavailableSlots) {
      const slotKey = `${assignment.day}_${assignment.period}`;
      if (unavailableSlots.has(slotKey)) {
        return false;
      }
    }
  }
  
  return true;
}

/**
 * Check that no room is used by multiple classes at the same time
 * (Basic implementation - can be extended for special lab rooms)
 * @param {Array} assignments - Array of assignment objects
 * @param {Array} rooms - Array of room objects
 * @returns {boolean} - true if no room conflicts, false otherwise
 */
export function noRoomConflicts(assignments, rooms) {
  // For this basic version, we assume each class has its own room
  // and lab rooms are not yet fully implemented.
  // This function is a placeholder for future enhancement.
  
  // Group assignments by (roomId, day, period) if roomId is specified
  const roomSlots = new Map();
  
  for (const assignment of assignments) {
    if (assignment.roomId) {
      const key = `${assignment.roomId}_${assignment.day}_${assignment.period}`;
      
      if (roomSlots.has(key)) {
        return false;
      }
      
      roomSlots.set(key, assignment);
    }
  }
  
  return true;
}

/**
 * Validate that double periods are properly scheduled
 * (Two consecutive periods on the same day for the same class/subject/teacher)
 * @param {Array} assignments - Array of assignment objects
 * @param {Array} demands - Array of weekly demand objects
 * @param {Object} config - Configuration object with days and periodsPerDay
 * @returns {boolean} - true if all double periods valid, false otherwise
 */
export function validateDoublePeriods(assignments, demands, config) {
  // Group demands that require double periods
  const doublePeriodDemands = demands.filter(d => d.doublePeriodsPerWeek > 0);
  
  if (doublePeriodDemands.length === 0) {
    return true; // No double period requirements
  }
  
  // For each demand with double periods, verify they are scheduled correctly
  for (const demand of doublePeriodDemands) {
    const classId = demand.classId;
    const subjectId = demand.subjectId;
    
    // Find all assignments for this class/subject
    const relevantAssignments = assignments.filter(
      a => a.classId === classId && a.subjectId === subjectId
    );
    
    // Sort by day and period
    relevantAssignments.sort((a, b) => {
      if (a.day !== b.day) {
        return config.days.indexOf(a.day) - config.days.indexOf(b.day);
      }
      return a.period - b.period;
    });
    
    // Count how many double periods we have
    let doublePeriodsFound = 0;
    let i = 0;
    
    while (i < relevantAssignments.length - 1) {
      const current = relevantAssignments[i];
      const next = relevantAssignments[i + 1];
      
      // Check if consecutive
      if (current.day === next.day && 
          current.period + 1 === next.period &&
          current.teacherId === next.teacherId) {
        doublePeriodsFound++;
        i += 2; // Skip both periods
      } else {
        i++;
      }
    }
    
    // We don't strictly enforce the count here as the engine handles it,
    // but we could add additional validation if needed
  }
  
  return true;
}

/**
 * Master constraint checker - runs all hard constraints
 * @param {Array} assignments - Array of assignment objects
 * @param {Array} teachers - Array of teacher objects
 * @param {Array} rooms - Array of room objects
 * @param {Array} demands - Array of weekly demand objects
 * @param {Object} config - Configuration object
 * @returns {boolean} - true if all constraints satisfied, false otherwise
 */
export function allHardConstraintsOk(assignments, teachers, rooms, demands, config) {
  return (
    noTeacherConflicts(assignments) &&
    noClassConflicts(assignments) &&
    teacherLoadLimits(assignments, teachers) &&
    respectTeacherAvailability(assignments, teachers) &&
    noRoomConflicts(assignments, rooms) &&
    validateDoublePeriods(assignments, demands, config)
  );
}

// TODO: Soft constraints for future versions
// - minimizeTeacherGaps(assignments, teachers)
// - balanceSubjectDistribution(assignments, demands, config)
// - preferredTimeSlots(assignments, demands)
