/* ====================================
   UI RENDERING FUNCTIONS

   This file contains functions to render
   timetables in the browser DOM.

   Functions:
   - renderClassTimetables(): Display class-wise views
   - renderTeacherTimetables(): Display teacher-wise views
   - updateStatus(): Update status messages
   - Helper functions for table generation
   ==================================== */

/**
 * Update the status display area.
 *
 * @param {string} message - Status message to display
 * @param {string} type - Type: 'info', 'success', 'error', 'loading'
 */
function updateStatus(message, type = 'info') {
    const statusDisplay = document.getElementById('statusDisplay');

    if (!statusDisplay) return;

    statusDisplay.innerHTML = `<p>${message}</p>`;

    // Remove all status classes
    statusDisplay.classList.remove('success', 'error', 'loading');

    // Add appropriate class
    if (type === 'success') {
        statusDisplay.classList.add('success');
    } else if (type === 'error') {
        statusDisplay.classList.add('error');
    } else if (type === 'loading') {
        statusDisplay.classList.add('loading');
    }
}

/**
 * Render timetables for all classes.
 *
 * @param {Array} assignments - Array of assignment objects
 */
function renderClassTimetables(assignments) {
    const container = document.getElementById('classView');

    if (!container) {
        console.error('Class view container not found');
        return;
    }

    // Clear previous content
    container.innerHTML = '';

    // Create a timetable for each class
    for (const classObj of CLASSES) {
        const classAssignments = assignments.filter(a => a.classId === classObj.id);

        const section = document.createElement('div');
        section.className = 'timetable-section';

        // Header
        const header = document.createElement('div');
        header.className = 'timetable-header';
        header.innerHTML = `<h3>${classObj.name}</h3>`;
        section.appendChild(header);

        // Table wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'timetable-wrapper';

        // Build table
        const table = buildClassTable(classObj.id, classAssignments);
        wrapper.appendChild(table);

        section.appendChild(wrapper);
        container.appendChild(section);
    }
}

/**
 * Build a timetable table for a specific class.
 *
 * @param {string} classId - Class ID
 * @param {Array} assignments - Assignments for this class
 * @returns {HTMLElement} - Table element
 */
function buildClassTable(classId, assignments) {
    const table = document.createElement('table');
    table.className = 'timetable';

    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // First column: Day
    const dayHeader = document.createElement('th');
    dayHeader.textContent = 'Day';
    headerRow.appendChild(dayHeader);

    // Period columns
    for (let period = 1; period <= CONFIG.periodsPerDay; period++) {
        const th = document.createElement('th');
        th.textContent = `Period ${period}`;
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');

    for (const day of CONFIG.days) {
        const row = document.createElement('tr');

        // Day cell
        const dayCell = document.createElement('td');
        dayCell.className = 'day-header';
        dayCell.textContent = day;
        row.appendChild(dayCell);

        // Period cells
        for (let period = 1; period <= CONFIG.periodsPerDay; period++) {
            const cell = document.createElement('td');

            // Find assignment for this day and period
            const assignment = assignments.find(
                a => a.day === day && a.period === period
            );

            if (assignment) {
                const subject = getSubjectById(assignment.subjectId);
                const teacher = getTeacherById(assignment.teacherId);

                cell.innerHTML = `
                    <div class="period-cell">
                        <span class="subject-name">${subject ? subject.name : 'Unknown'}</span>
                        <span class="teacher-name">${teacher ? teacher.name : 'Unknown'}</span>
                    </div>
                `;
            } else {
                cell.innerHTML = '<div class="empty-cell">—</div>';
            }

            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    return table;
}

/**
 * Render timetables for all teachers.
 *
 * @param {Array} assignments - Array of assignment objects
 */
function renderTeacherTimetables(assignments) {
    const container = document.getElementById('teacherView');

    if (!container) {
        console.error('Teacher view container not found');
        return;
    }

    // Clear previous content
    container.innerHTML = '';

    // Create a timetable for each teacher
    for (const teacher of TEACHERS) {
        const teacherAssignments = assignments.filter(a => a.teacherId === teacher.id);

        if (teacherAssignments.length === 0) {
            // Skip teachers with no assignments
            continue;
        }

        const section = document.createElement('div');
        section.className = 'timetable-section';

        // Header
        const header = document.createElement('div');
        header.className = 'timetable-header';
        header.innerHTML = `<h3>${teacher.name}</h3>`;
        section.appendChild(header);

        // Table wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'timetable-wrapper';

        // Build table
        const table = buildTeacherTable(teacher.id, teacherAssignments);
        wrapper.appendChild(table);

        section.appendChild(wrapper);
        container.appendChild(section);
    }
}

/**
 * Build a timetable table for a specific teacher.
 *
 * @param {string} teacherId - Teacher ID
 * @param {Array} assignments - Assignments for this teacher
 * @returns {HTMLElement} - Table element
 */
function buildTeacherTable(teacherId, assignments) {
    const table = document.createElement('table');
    table.className = 'timetable';

    // Create header row
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');

    // First column: Day
    const dayHeader = document.createElement('th');
    dayHeader.textContent = 'Day';
    headerRow.appendChild(dayHeader);

    // Period columns
    for (let period = 1; period <= CONFIG.periodsPerDay; period++) {
        const th = document.createElement('th');
        th.textContent = `Period ${period}`;
        headerRow.appendChild(th);
    }

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');

    for (const day of CONFIG.days) {
        const row = document.createElement('tr');

        // Day cell
        const dayCell = document.createElement('td');
        dayCell.className = 'day-header';
        dayCell.textContent = day;
        row.appendChild(dayCell);

        // Period cells
        for (let period = 1; period <= CONFIG.periodsPerDay; period++) {
            const cell = document.createElement('td');

            // Find assignment for this day and period
            const assignment = assignments.find(
                a => a.day === day && a.period === period
            );

            if (assignment) {
                const subject = getSubjectById(assignment.subjectId);
                const classObj = getClassById(assignment.classId);

                cell.innerHTML = `
                    <div class="period-cell">
                        <span class="subject-name">${subject ? subject.name : 'Unknown'}</span>
                        <span class="class-name">${classObj ? classObj.name : 'Unknown'}</span>
                    </div>
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
 * Show the view selector (tabs).
 */
function showViewSelector() {
    const viewSelector = document.getElementById('viewSelector');
    if (viewSelector) {
        viewSelector.style.display = 'block';
    }
}

/**
 * Setup tab switching functionality.
 */
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const views = document.querySelectorAll('.view-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetView = tab.getAttribute('data-view');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active view
            views.forEach(view => {
                if (view.id === `${targetView}View`) {
                    view.classList.add('active');
                } else {
                    view.classList.remove('active');
                }
            });
        });
    });
}

/**
 * Display statistics about the timetable.
 *
 * @param {Object} stats - Statistics object from engine
 */
function displayStats(stats) {
    if (!stats) return;

    console.log('=== Timetable Statistics ===');
    console.log(`Total Assignments: ${stats.totalAssignments}`);
    console.log('By Class:', stats.byClass);
    console.log('By Teacher:', stats.byTeacher);
    console.log('By Subject:', stats.bySubject);
}
