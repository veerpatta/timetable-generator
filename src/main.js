/* ====================================
   MAIN ENTRY POINT

   This file wires up the UI and the timetable
   generation engine.

   - Sets up event listeners
   - Calls the generation engine
   - Renders results
   ==================================== */

// Global variable to store generated timetable
let currentTimetable = null;

/**
 * Initialize the application when DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== Veer Patta School Timetable Generator ===');
    console.log('Application initialized');

    // Setup UI components
    setupTabs();
    setupGenerateButton();

    // Display initial info
    displayInitialInfo();
});

/**
 * Setup the Generate Timetable button.
 */
function setupGenerateButton() {
    const generateBtn = document.getElementById('generateBtn');

    if (!generateBtn) {
        console.error('Generate button not found');
        return;
    }

    generateBtn.addEventListener('click', () => {
        handleGenerate();
    });
}

/**
 * Handle the Generate button click.
 */
function handleGenerate() {
    console.log('Generate button clicked');

    const generateBtn = document.getElementById('generateBtn');

    // Disable button during generation
    generateBtn.disabled = true;
    generateBtn.textContent = '⏳ Generating...';

    // Update status
    updateStatus('Generating timetable... This may take a few seconds.', 'loading');

    // Run generation in a setTimeout to allow UI to update
    setTimeout(() => {
        try {
            // Call the generation engine
            const assignments = generateTimetable();

            if (assignments && assignments.length > 0) {
                // Success!
                currentTimetable = assignments;

                // Get statistics
                const stats = getTimetableStats(assignments);
                displayStats(stats);

                // Update status
                updateStatus(
                    `✅ Timetable generated successfully! Created ${assignments.length} assignments across ${CLASSES.length} classes.`,
                    'success'
                );

                // Show view selector
                showViewSelector();

                // Render timetables
                renderClassTimetables(assignments);
                renderTeacherTimetables(assignments);

                console.log('Timetable rendered successfully');
            } else {
                // Failed to generate
                updateStatus(
                    '❌ Failed to generate a valid timetable. Please try adjusting the constraints in src/data.js (e.g., reduce subject demands, increase teacher availability, or reduce double periods).',
                    'error'
                );

                console.error('Generation failed - no valid solution found');
            }
        } catch (error) {
            // Error occurred
            console.error('Error during generation:', error);

            updateStatus(
                `❌ An error occurred during generation: ${error.message}`,
                'error'
            );
        } finally {
            // Re-enable button
            generateBtn.disabled = false;
            generateBtn.textContent = '⚡ Generate Timetable';
        }
    }, 100); // Small delay to allow UI to update
}

/**
 * Display initial information about the data being used.
 */
function displayInitialInfo() {
    console.log('=== School Configuration ===');
    console.log(`Days: ${CONFIG.days.join(', ')}`);
    console.log(`Periods per day: ${CONFIG.periodsPerDay}`);
    console.log(`Total classes: ${CLASSES.length}`);
    console.log(`Total subjects: ${SUBJECTS.length}`);
    console.log(`Total teachers: ${TEACHERS.length}`);
    console.log(`Total weekly demands: ${WEEKLY_DEMANDS.length}`);

    // Calculate total periods needed
    let totalPeriodsNeeded = 0;
    for (const demand of WEEKLY_DEMANDS) {
        totalPeriodsNeeded += demand.periodsPerWeek;
    }

    console.log(`Total periods to schedule: ${totalPeriodsNeeded}`);

    // Calculate total slots available
    const totalSlots = CONFIG.days.length * CONFIG.periodsPerDay * CLASSES.length;
    console.log(`Total slots available: ${totalSlots}`);

    const utilization = ((totalPeriodsNeeded / totalSlots) * 100).toFixed(1);
    console.log(`Expected utilization: ${utilization}%`);

    // Validate data
    validateConfiguration();
}

/**
 * Validate the configuration for common issues.
 */
function validateConfiguration() {
    console.log('=== Validating Configuration ===');

    let issues = [];

    // Check if all demands have eligible teachers
    for (const demand of WEEKLY_DEMANDS) {
        const eligible = getEligibleTeachers(demand.subjectId, demand.classId);
        if (eligible.length === 0) {
            issues.push(
                `No eligible teacher for ${demand.classId} - ${demand.subjectId}`
            );
        }
    }

    // Check if teacher loads are feasible
    const teacherDemands = {};
    for (const teacher of TEACHERS) {
        teacherDemands[teacher.id] = 0;
    }

    for (const demand of WEEKLY_DEMANDS) {
        const eligible = getEligibleTeachers(demand.subjectId, demand.classId);
        if (eligible.length > 0) {
            // Distribute demand equally among eligible teachers (rough estimate)
            const demandPerTeacher = demand.periodsPerWeek / eligible.length;
            for (const teacher of eligible) {
                teacherDemands[teacher.id] += demandPerTeacher;
            }
        }
    }

    for (const teacher of TEACHERS) {
        const estimatedDemand = teacherDemands[teacher.id];
        if (estimatedDemand > teacher.maxPerWeek) {
            issues.push(
                `${teacher.name} may be overloaded: ~${estimatedDemand.toFixed(1)} periods needed, max ${teacher.maxPerWeek} allowed`
            );
        }
    }

    // Check double periods feasibility
    for (const demand of WEEKLY_DEMANDS) {
        if (demand.doublePeriodsPerWeek > 0) {
            const maxDoublePeriods = CONFIG.days.length * (CONFIG.periodsPerDay - 1);
            if (demand.doublePeriodsPerWeek > maxDoublePeriods) {
                issues.push(
                    `${demand.classId} - ${demand.subjectId}: Too many double periods requested (${demand.doublePeriodsPerWeek})`
                );
            }
        }
    }

    // Report issues
    if (issues.length > 0) {
        console.warn('Configuration issues detected:');
        issues.forEach(issue => console.warn(`  - ${issue}`));
        console.warn('Generation may fail or take a long time.');
    } else {
        console.log('Configuration looks good!');
    }
}

/**
 * Export timetable to CSV (Future enhancement).
 */
function exportToCSV() {
    // TODO: Implement CSV export
    console.log('CSV export not yet implemented');
    alert('CSV export feature coming soon!');
}

/**
 * Print timetable using browser print dialog.
 */
function printTimetable() {
    window.print();
}

// Optional: Expose functions to window for debugging
if (typeof window !== 'undefined') {
    window.debugTimetable = {
        currentTimetable,
        generateTimetable,
        CONFIG,
        CLASSES,
        SUBJECTS,
        TEACHERS,
        WEEKLY_DEMANDS,
        exportToCSV,
        printTimetable,
    };
}
