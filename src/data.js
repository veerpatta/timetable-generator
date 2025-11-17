/* ====================================
   SCHOOL DATA CONFIGURATION

   This file contains all school-specific data:
   - Global settings (days, periods)
   - Classes/Sections
   - Subjects
   - Teachers
   - Rooms
   - Weekly subject demands per class

   TO CUSTOMIZE: Edit the data structures below
   to match your school's requirements.
   ==================================== */

// ====================================
// GLOBAL CONFIGURATION
// ====================================

const CONFIG = {
    // Days of the week when classes are held
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],

    // Number of periods per day
    periodsPerDay: 7,

    // School name (for display purposes)
    schoolName: "Veer Patta School",
};

// ====================================
// CLASS/SECTION DEFINITIONS
// ====================================

const CLASSES = [
    {
        id: "6A",
        name: "Class 6A",
        roomId: "ROOM_6A", // Dedicated classroom
    },
    {
        id: "6B",
        name: "Class 6B",
        roomId: "ROOM_6B",
    },
    {
        id: "7A",
        name: "Class 7A",
        roomId: "ROOM_7A",
    },
    {
        id: "7B",
        name: "Class 7B",
        roomId: "ROOM_7B",
    },
];

// ====================================
// SUBJECT DEFINITIONS
// ====================================

const SUBJECTS = [
    {
        id: "MATH",
        name: "Mathematics",
        type: "theory", // theory, lab, or activity
    },
    {
        id: "SCI",
        name: "Science",
        type: "theory",
    },
    {
        id: "ENG",
        name: "English",
        type: "theory",
    },
    {
        id: "HINDI",
        name: "Hindi",
        type: "theory",
    },
    {
        id: "SST",
        name: "Social Science",
        type: "theory",
    },
    {
        id: "COMP",
        name: "Computer",
        type: "lab",
    },
    {
        id: "PE",
        name: "Physical Education",
        type: "activity",
    },
    {
        id: "ART",
        name: "Art & Craft",
        type: "activity",
    },
];

// ====================================
// TEACHER DEFINITIONS
// ====================================

const TEACHERS = [
    {
        id: "T1",
        name: "Mr. Sharma",
        subjects: ["MATH"], // Subjects this teacher can teach
        teachesClasses: ["6A", "6B", "7A", "7B"], // Which classes they teach
        maxPerDay: 6, // Maximum periods per day
        maxPerWeek: 35, // Maximum periods per week
        unavailableSlots: [], // Optional: [{day: "Monday", period: 1}, ...]
    },
    {
        id: "T2",
        name: "Ms. Gupta",
        subjects: ["SCI"],
        teachesClasses: ["6A", "6B", "7A", "7B"],
        maxPerDay: 6,
        maxPerWeek: 35,
        unavailableSlots: [],
    },
    {
        id: "T3",
        name: "Mrs. Verma",
        subjects: ["ENG"],
        teachesClasses: ["6A", "6B", "7A", "7B"],
        maxPerDay: 6,
        maxPerWeek: 35,
        unavailableSlots: [],
    },
    {
        id: "T4",
        name: "Mr. Patel",
        subjects: ["HINDI"],
        teachesClasses: ["6A", "6B", "7A", "7B"],
        maxPerDay: 6,
        maxPerWeek: 35,
        unavailableSlots: [],
    },
    {
        id: "T5",
        name: "Dr. Khan",
        subjects: ["SST"],
        teachesClasses: ["6A", "6B", "7A", "7B"],
        maxPerDay: 5,
        maxPerWeek: 30,
        unavailableSlots: [
            { day: "Saturday", period: 6 },
            { day: "Saturday", period: 7 },
        ],
    },
    {
        id: "T6",
        name: "Mr. Singh",
        subjects: ["COMP"],
        teachesClasses: ["6A", "6B", "7A", "7B"],
        maxPerDay: 5,
        maxPerWeek: 25,
        unavailableSlots: [],
    },
    {
        id: "T7",
        name: "Coach Reddy",
        subjects: ["PE"],
        teachesClasses: ["6A", "6B", "7A", "7B"],
        maxPerDay: 5,
        maxPerWeek: 25,
        unavailableSlots: [],
    },
    {
        id: "T8",
        name: "Ms. Mehta",
        subjects: ["ART"],
        teachesClasses: ["6A", "6B", "7A", "7B"],
        maxPerDay: 4,
        maxPerWeek: 20,
        unavailableSlots: [],
    },
];

// ====================================
// ROOM DEFINITIONS
// (For future use with lab/special room constraints)
// ====================================

const ROOMS = [
    {
        id: "ROOM_6A",
        name: "Room 6A",
        type: "classroom",
    },
    {
        id: "ROOM_6B",
        name: "Room 6B",
        type: "classroom",
    },
    {
        id: "ROOM_7A",
        name: "Room 7A",
        type: "classroom",
    },
    {
        id: "ROOM_7B",
        name: "Room 7B",
        type: "classroom",
    },
    {
        id: "LAB_COMP",
        name: "Computer Lab",
        type: "lab",
    },
    {
        id: "FIELD",
        name: "Sports Field",
        type: "activity",
    },
];

// ====================================
// WEEKLY SUBJECT DEMANDS
//
// Define how many periods of each subject
// each class needs per week.
//
// doublePeriodsPerWeek: number of double-period
// blocks needed (e.g., for lab work)
// ====================================

const WEEKLY_DEMANDS = [
    // Class 6A Demands
    { classId: "6A", subjectId: "MATH", periodsPerWeek: 6, doublePeriodsPerWeek: 0 },
    { classId: "6A", subjectId: "SCI", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "6A", subjectId: "ENG", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "6A", subjectId: "HINDI", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "6A", subjectId: "SST", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "6A", subjectId: "COMP", periodsPerWeek: 2, doublePeriodsPerWeek: 1 }, // 1 double + 0 single = 2 periods
    { classId: "6A", subjectId: "PE", periodsPerWeek: 2, doublePeriodsPerWeek: 1 }, // 1 double period
    { classId: "6A", subjectId: "ART", periodsPerWeek: 2, doublePeriodsPerWeek: 1 }, // 1 double period

    // Class 6B Demands
    { classId: "6B", subjectId: "MATH", periodsPerWeek: 6, doublePeriodsPerWeek: 0 },
    { classId: "6B", subjectId: "SCI", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "6B", subjectId: "ENG", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "6B", subjectId: "HINDI", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "6B", subjectId: "SST", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "6B", subjectId: "COMP", periodsPerWeek: 2, doublePeriodsPerWeek: 1 },
    { classId: "6B", subjectId: "PE", periodsPerWeek: 2, doublePeriodsPerWeek: 1 },
    { classId: "6B", subjectId: "ART", periodsPerWeek: 2, doublePeriodsPerWeek: 1 },

    // Class 7A Demands
    { classId: "7A", subjectId: "MATH", periodsPerWeek: 6, doublePeriodsPerWeek: 0 },
    { classId: "7A", subjectId: "SCI", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "7A", subjectId: "ENG", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "7A", subjectId: "HINDI", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "7A", subjectId: "SST", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "7A", subjectId: "COMP", periodsPerWeek: 2, doublePeriodsPerWeek: 1 },
    { classId: "7A", subjectId: "PE", periodsPerWeek: 2, doublePeriodsPerWeek: 1 },
    { classId: "7A", subjectId: "ART", periodsPerWeek: 2, doublePeriodsPerWeek: 1 },

    // Class 7B Demands
    { classId: "7B", subjectId: "MATH", periodsPerWeek: 6, doublePeriodsPerWeek: 0 },
    { classId: "7B", subjectId: "SCI", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "7B", subjectId: "ENG", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "7B", subjectId: "HINDI", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "7B", subjectId: "SST", periodsPerWeek: 5, doublePeriodsPerWeek: 0 },
    { classId: "7B", subjectId: "COMP", periodsPerWeek: 2, doublePeriodsPerWeek: 1 },
    { classId: "7B", subjectId: "PE", periodsPerWeek: 2, doublePeriodsPerWeek: 1 },
    { classId: "7B", subjectId: "ART", periodsPerWeek: 2, doublePeriodsPerWeek: 1 },
];

// ====================================
// HELPER FUNCTIONS
// ====================================

/**
 * Get teacher object by ID
 */
function getTeacherById(teacherId) {
    return TEACHERS.find(t => t.id === teacherId);
}

/**
 * Get class object by ID
 */
function getClassById(classId) {
    return CLASSES.find(c => c.id === classId);
}

/**
 * Get subject object by ID
 */
function getSubjectById(subjectId) {
    return SUBJECTS.find(s => s.id === subjectId);
}

/**
 * Get room object by ID
 */
function getRoomById(roomId) {
    return ROOMS.find(r => r.id === roomId);
}

/**
 * Find all teachers who can teach a specific subject to a specific class
 */
function getEligibleTeachers(subjectId, classId) {
    return TEACHERS.filter(teacher =>
        teacher.subjects.includes(subjectId) &&
        teacher.teachesClasses.includes(classId)
    );
}
