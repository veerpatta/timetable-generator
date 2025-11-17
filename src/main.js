/**
 * main.js
 * 
 * Entry Point and Event Handlers
 * 
 * This file wires up the UI buttons and events to the timetable engine.
 */

import { config, classes, subjects, teachers, rooms, weeklyDemands } from './data.js';
import { generateTimetable } from './engine.js';
import { renderClassTimetables, renderTeacherTimetables, updateStatus, showView } from './ui.js';

// Store the current timetable assignments
let currentAssignments = null;

/**
 * Initialize the application
 */
function init() {
  console.log("Initializing Veer Patta School Timetable Generator...");
  
  // Set up event listeners
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerate);
  }
  
  const viewClassBtn = document.getElementById('viewClassBtn');
  if (viewClassBtn) {
    viewClassBtn.addEventListener('click', () => showView('classView'));
  }
  
  const viewTeacherBtn = document.getElementById('viewTeacherBtn');
  if (viewTeacherBtn) {
    viewTeacherBtn.addEventListener('click', () => showView('teacherView'));
  }
  
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', handlePrint);
  }
  
  // Show initial status
  updateStatus('Ready to generate timetable. Click "Generate Timetable" to start.');
  
  // Show class view by default
  showView('classView');
}

/**
 * Handle timetable generation
 */
async function handleGenerate() {
  console.log("Generate button clicked");
  
  // Update status
  updateStatus('⏳ Generating timetable... This may take a few seconds.');
  
  // Clear previous timetables
  const classView = document.getElementById('classView');
  const teacherView = document.getElementById('teacherView');
  if (classView) classView.innerHTML = '';
  if (teacherView) teacherView.innerHTML = '';
  
  // Disable button during generation
  const generateBtn = document.getElementById('generateBtn');
  if (generateBtn) {
    generateBtn.disabled = true;
  }
  
  // Run generation in a setTimeout to allow UI to update
  setTimeout(() => {
    try {
      // Generate timetable
      const data = { classes, subjects, teachers, rooms };
      const assignments = generateTimetable(config, classes, subjects, teachers, weeklyDemands);
      
      if (assignments) {
        // Success!
        currentAssignments = assignments;
        updateStatus('✅ Timetable generated successfully! Use the buttons below to switch views or print.');
        
        // Render both views
        renderClassTimetables(assignments, config, data);
        renderTeacherTimetables(assignments, config, data);
        
        console.log(`Successfully generated ${assignments.length} assignments`);
      } else {
        // Failed to generate
        updateStatus('❌ No valid timetable found. Please check your constraints and data, or try generating again.');
        console.error("Failed to generate timetable");
      }
    } catch (error) {
      console.error("Error during generation:", error);
      updateStatus(`❌ Error: ${error.message}`);
    } finally {
      // Re-enable button
      if (generateBtn) {
        generateBtn.disabled = false;
      }
    }
  }, 100);
}

/**
 * Handle print functionality
 */
function handlePrint() {
  if (!currentAssignments) {
    alert('Please generate a timetable first before printing.');
    return;
  }
  
  window.print();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
