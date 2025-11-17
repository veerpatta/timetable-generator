/**
 * data.js
 * 
 * School Configuration Data for Veer Patta School Timetable Generator
 * 
 * This file contains all the data needed to generate timetables:
 * - Global settings (days, periods per day)
 * - Classes/Sections
 * - Subjects
 * - Teachers with their capabilities
 * - Weekly subject demands per class
 * 
 * TO CUSTOMIZE: Edit the arrays and objects below to match your school's needs.
 */

// Global Configuration
export const config = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  periodsPerDay: 7,
  schoolName: "Veer Patta School"
};

// Class Sections
// Each class has an ID, name, and optional room assignment
export const classes = [
  { id: "6A", name: "Class 6A", roomId: "ROOM_6A" },
  { id: "6B", name: "Class 6B", roomId: "ROOM_6B" },
  { id: "7A", name: "Class 7A", roomId: "ROOM_7A" },
  { id: "7B", name: "Class 7B", roomId: "ROOM_7B" }
];

// Subjects
// Each subject has an ID, name, and type (theory/lab/activity)
export const subjects = [
  { id: "MATH", name: "Mathematics", type: "theory" },
  { id: "SCI", name: "Science", type: "theory" },
  { id: "ENG", name: "English", type: "theory" },
  { id: "HINDI", name: "Hindi", type: "theory" },
  { id: "SST", name: "Social Science", type: "theory" },
  { id: "COMP", name: "Computer", type: "lab" },
  { id: "GAMES", name: "Games", type: "activity" },
  { id: "ART", name: "Art", type: "activity" }
];

// Teachers
// Each teacher has:
// - id: unique identifier
// - name: display name
// - subjects: array of subject IDs they can teach
// - teachesClasses: array of class IDs they teach
// - maxPerDay: maximum periods per day
// - maxPerWeek: maximum periods per week
// - unavailableSlots: optional array of {day, period} where they cannot teach
export const teachers = [
  {
    id: "T1",
    name: "Mr. Sharma",
    subjects: ["MATH"],
    teachesClasses: ["6A", "6B", "7A", "7B"],
    maxPerDay: 6,
    maxPerWeek: 36,
    unavailableSlots: []
  },
  {
    id: "T2",
    name: "Mrs. Gupta",
    subjects: ["SCI"],
    teachesClasses: ["6A", "6B", "7A", "7B"],
    maxPerDay: 6,
    maxPerWeek: 36,
    unavailableSlots: []
  },
  {
    id: "T3",
    name: "Ms. Verma",
    subjects: ["ENG", "HINDI"],
    teachesClasses: ["6A", "6B", "7A", "7B"],
    maxPerDay: 6,
    maxPerWeek: 36,
    unavailableSlots: []
  },
  {
    id: "T4",
    name: "Mr. Kumar",
    subjects: ["SST"],
    teachesClasses: ["6A", "6B", "7A", "7B"],
    maxPerDay: 6,
    maxPerWeek: 36,
    unavailableSlots: []
  },
  {
    id: "T5",
    name: "Ms. Patel",
    subjects: ["COMP"],
    teachesClasses: ["6A", "6B", "7A", "7B"],
    maxPerDay: 5,
    maxPerWeek: 30,
    unavailableSlots: [{ day: "Saturday", period: 6 }, { day: "Saturday", period: 7 }]
  },
  {
    id: "T6",
    name: "Mr. Singh",
    subjects: ["GAMES"],
    teachesClasses: ["6A", "6B", "7A", "7B"],
    maxPerDay: 6,
    maxPerWeek: 30,
    unavailableSlots: []
  },
  {
    id: "T7",
    name: "Mrs. Reddy",
    subjects: ["ART"],
    teachesClasses: ["6A", "6B", "7A", "7B"],
    maxPerDay: 5,
    maxPerWeek: 24,
    unavailableSlots: []
  },
  {
    id: "T8",
    name: "Mr. Mehta",
    subjects: ["HINDI"],
    teachesClasses: ["6A", "6B"],
    maxPerDay: 5,
    maxPerWeek: 24,
    unavailableSlots: []
  }
];

// Special Rooms (for future lab/room constraints)
// Each room has an ID, name, type, and capacity
export const rooms = [
  { id: "LAB_SCI", name: "Science Lab", type: "lab", capacity: 30 },
  { id: "LAB_COMP", name: "Computer Lab", type: "lab", capacity: 30 },
  { id: "ROOM_6A", name: "Classroom 6A", type: "classroom", capacity: 40 },
  { id: "ROOM_6B", name: "Classroom 6B", type: "classroom", capacity: 40 },
  { id: "ROOM_7A", name: "Classroom 7A", type: "classroom", capacity: 40 },
  { id: "ROOM_7B", name: "Classroom 7B", type: "classroom", capacity: 40 }
];

// Weekly Subject Demands
// Defines how many periods of each subject each class needs per week
// - classId: which class
// - subjectId: which subject
// - periodsPerWeek: total periods needed per week
// - doublePeriodsPerWeek: number of those that must be consecutive (double periods)
// - preferredDays: optional array of preferred days (not used in v1)
export const weeklyDemands = [
  // Class 6A
  { classId: "6A", subjectId: "MATH", periodsPerWeek: 6, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6A", subjectId: "SCI", periodsPerWeek: 5, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6A", subjectId: "ENG", periodsPerWeek: 5, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6A", subjectId: "HINDI", periodsPerWeek: 4, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6A", subjectId: "SST", periodsPerWeek: 4, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6A", subjectId: "COMP", periodsPerWeek: 2, doublePeriodsPerWeek: 1, preferredDays: [] },
  { classId: "6A", subjectId: "GAMES", periodsPerWeek: 4, doublePeriodsPerWeek: 2, preferredDays: [] },
  { classId: "6A", subjectId: "ART", periodsPerWeek: 2, doublePeriodsPerWeek: 0, preferredDays: [] },
  
  // Class 6B
  { classId: "6B", subjectId: "MATH", periodsPerWeek: 6, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6B", subjectId: "SCI", periodsPerWeek: 5, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6B", subjectId: "ENG", periodsPerWeek: 5, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6B", subjectId: "HINDI", periodsPerWeek: 4, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6B", subjectId: "SST", periodsPerWeek: 4, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "6B", subjectId: "COMP", periodsPerWeek: 2, doublePeriodsPerWeek: 1, preferredDays: [] },
  { classId: "6B", subjectId: "GAMES", periodsPerWeek: 4, doublePeriodsPerWeek: 2, preferredDays: [] },
  { classId: "6B", subjectId: "ART", periodsPerWeek: 2, doublePeriodsPerWeek: 0, preferredDays: [] },
  
  // Class 7A
  { classId: "7A", subjectId: "MATH", periodsPerWeek: 6, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7A", subjectId: "SCI", periodsPerWeek: 5, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7A", subjectId: "ENG", periodsPerWeek: 5, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7A", subjectId: "HINDI", periodsPerWeek: 4, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7A", subjectId: "SST", periodsPerWeek: 4, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7A", subjectId: "COMP", periodsPerWeek: 2, doublePeriodsPerWeek: 1, preferredDays: [] },
  { classId: "7A", subjectId: "GAMES", periodsPerWeek: 4, doublePeriodsPerWeek: 2, preferredDays: [] },
  { classId: "7A", subjectId: "ART", periodsPerWeek: 2, doublePeriodsPerWeek: 0, preferredDays: [] },
  
  // Class 7B
  { classId: "7B", subjectId: "MATH", periodsPerWeek: 6, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7B", subjectId: "SCI", periodsPerWeek: 5, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7B", subjectId: "ENG", periodsPerWeek: 5, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7B", subjectId: "HINDI", periodsPerWeek: 4, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7B", subjectId: "SST", periodsPerWeek: 4, doublePeriodsPerWeek: 0, preferredDays: [] },
  { classId: "7B", subjectId: "COMP", periodsPerWeek: 2, doublePeriodsPerWeek: 1, preferredDays: [] },
  { classId: "7B", subjectId: "GAMES", periodsPerWeek: 4, doublePeriodsPerWeek: 2, preferredDays: [] },
  { classId: "7B", subjectId: "ART", periodsPerWeek: 2, doublePeriodsPerWeek: 0, preferredDays: [] }
];
