/**
 * ui.js
 * 
 * UI Rendering Functions
 * 
 * This file contains functions to render timetables in the DOM:
 * - Class-wise timetable view
 * - Teacher-wise timetable view
 * - Status messages
 */

/**
 * Update status message
 * @param {string} message - Status message to display
 */
export function updateStatus(message) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
  }
}

/**
 * Render class-wise timetables
 * @param {Array} assignments - All timetable assignments
 * @param {Object} config - Configuration (days, periodsPerDay)
 * @param {Object} data - School data (classes, subjects, teachers)
 */
export function renderClassTimetables(assignments, config, data) {
  const container = document.getElementById('classView');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Create a timetable for each class
  for (const classObj of data.classes) {
    const classDiv = document.createElement('div');
    classDiv.className = 'timetable-card';
    
    // Title
    const title = document.createElement('h3');
    title.textContent = classObj.name;
    classDiv.appendChild(title);
    
    // Build timetable grid
    const table = buildClassTable(classObj.id, assignments, config, data);
    classDiv.appendChild(table);
    
    container.appendChild(classDiv);
  }
}

/**
 * Build a timetable table for a specific class
 * @param {string} classId - Class ID
 * @param {Array} assignments - All assignments
 * @param {Object} config - Configuration
 * @param {Object} data - School data
 * @returns {HTMLElement} - Table element
 */
function buildClassTable(classId, assignments, config, data) {
  const table = document.createElement('table');
  table.className = 'timetable';
  
  // Header row with periods
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  const dayHeader = document.createElement('th');
  dayHeader.textContent = 'Day';
  headerRow.appendChild(dayHeader);
  
  for (let period = 1; period <= config.periodsPerDay; period++) {
    const th = document.createElement('th');
    th.textContent = `P${period}`;
    headerRow.appendChild(th);
  }
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Body rows for each day
  const tbody = document.createElement('tbody');
  
  for (const day of config.days) {
    const row = document.createElement('tr');
    
    // Day cell
    const dayCell = document.createElement('td');
    dayCell.className = 'day-cell';
    dayCell.textContent = day;
    row.appendChild(dayCell);
    
    // Period cells
    for (let period = 1; period <= config.periodsPerDay; period++) {
      const cell = document.createElement('td');
      cell.className = 'period-cell';
      
      // Find assignment for this class, day, period
      const assignment = assignments.find(
        a => a.classId === classId && a.day === day && a.period === period
      );
      
      if (assignment) {
        const subject = data.subjects.find(s => s.id === assignment.subjectId);
        const teacher = data.teachers.find(t => t.id === assignment.teacherId);
        
        cell.innerHTML = `
          <div class="subject-name">${subject ? subject.name : assignment.subjectId}</div>
          <div class="teacher-name">${teacher ? teacher.name : assignment.teacherId}</div>
        `;
      } else {
        cell.innerHTML = '<div class="empty-cell">-</div>';
      }
      
      row.appendChild(cell);
    }
    
    tbody.appendChild(row);
  }
  
  table.appendChild(tbody);
  return table;
}

/**
 * Render teacher-wise timetables
 * @param {Array} assignments - All timetable assignments
 * @param {Object} config - Configuration (days, periodsPerDay)
 * @param {Object} data - School data (classes, subjects, teachers)
 */
export function renderTeacherTimetables(assignments, config, data) {
  const container = document.getElementById('teacherView');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Create a timetable for each teacher
  for (const teacher of data.teachers) {
    const teacherDiv = document.createElement('div');
    teacherDiv.className = 'timetable-card';
    
    // Title
    const title = document.createElement('h3');
    title.textContent = teacher.name;
    teacherDiv.appendChild(title);
    
    // Subjects taught
    const subjectsInfo = document.createElement('p');
    subjectsInfo.className = 'teacher-info';
    const subjectNames = teacher.subjects
      .map(subId => {
        const subj = data.subjects.find(s => s.id === subId);
        return subj ? subj.name : subId;
      })
      .join(', ');
    subjectsInfo.textContent = `Subjects: ${subjectNames}`;
    teacherDiv.appendChild(subjectsInfo);
    
    // Build timetable grid
    const table = buildTeacherTable(teacher.id, assignments, config, data);
    teacherDiv.appendChild(table);
    
    container.appendChild(teacherDiv);
  }
}

/**
 * Build a timetable table for a specific teacher
 * @param {string} teacherId - Teacher ID
 * @param {Array} assignments - All assignments
 * @param {Object} config - Configuration
 * @param {Object} data - School data
 * @returns {HTMLElement} - Table element
 */
function buildTeacherTable(teacherId, assignments, config, data) {
  const table = document.createElement('table');
  table.className = 'timetable';
  
  // Header row with periods
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  const dayHeader = document.createElement('th');
  dayHeader.textContent = 'Day';
  headerRow.appendChild(dayHeader);
  
  for (let period = 1; period <= config.periodsPerDay; period++) {
    const th = document.createElement('th');
    th.textContent = `P${period}`;
    headerRow.appendChild(th);
  }
  
  thead.appendChild(headerRow);
  table.appendChild(thead);
  
  // Body rows for each day
  const tbody = document.createElement('tbody');
  
  for (const day of config.days) {
    const row = document.createElement('tr');
    
    // Day cell
    const dayCell = document.createElement('td');
    dayCell.className = 'day-cell';
    dayCell.textContent = day;
    row.appendChild(dayCell);
    
    // Period cells
    for (let period = 1; period <= config.periodsPerDay; period++) {
      const cell = document.createElement('td');
      cell.className = 'period-cell';
      
      // Find assignment for this teacher, day, period
      const assignment = assignments.find(
        a => a.teacherId === teacherId && a.day === day && a.period === period
      );
      
      if (assignment) {
        const subject = data.subjects.find(s => s.id === assignment.subjectId);
        const classObj = data.classes.find(c => c.id === assignment.classId);
        
        cell.innerHTML = `
          <div class="subject-name">${subject ? subject.name : assignment.subjectId}</div>
          <div class="class-name">${classObj ? classObj.name : assignment.classId}</div>
        `;
      } else {
        cell.innerHTML = '<div class="empty-cell">Free</div>';
      }
      
      row.appendChild(cell);
    }
    
    tbody.appendChild(row);
  }
  
  table.appendChild(tbody);
  return table;
}

/**
 * Show or hide a view
 * @param {string} viewId - ID of the view to show
 */
export function showView(viewId) {
  const classView = document.getElementById('classView');
  const teacherView = document.getElementById('teacherView');
  
  if (viewId === 'classView') {
    if (classView) classView.style.display = 'block';
    if (teacherView) teacherView.style.display = 'none';
  } else if (viewId === 'teacherView') {
    if (classView) classView.style.display = 'none';
    if (teacherView) teacherView.style.display = 'block';
  }
  
  // Update button states
  const classBtn = document.getElementById('viewClassBtn');
  const teacherBtn = document.getElementById('viewTeacherBtn');
  
  if (classBtn && teacherBtn) {
    if (viewId === 'classView') {
      classBtn.classList.add('active');
      teacherBtn.classList.remove('active');
    } else {
      teacherBtn.classList.add('active');
      classBtn.classList.remove('active');
    }
  }
}
