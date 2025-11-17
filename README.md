# Veer Patta School Timetable Generator

A browser-based, constraint-based timetable generation system inspired by ASC Timetables, built entirely with HTML, CSS, and vanilla JavaScript. This application runs 100% in the browser with no backend required, making it perfect for hosting on GitHub Pages.

## 🌟 Features

- **Fully Browser-Based**: No server required - runs entirely in your web browser
- **Constraint-Based Generation**: Uses backtracking algorithm to satisfy complex scheduling constraints
- **Multiple Views**: 
  - Class-wise timetable view
  - Teacher-wise timetable view
- **Comprehensive Constraint Handling**:
  - No teacher conflicts (teacher can't be in two places at once)
  - No class conflicts (class can't have two subjects simultaneously)
  - Teacher daily and weekly load limits
  - Teacher availability constraints
  - Double/consecutive period support (for labs, games, etc.)
- **Print-Friendly**: Clean, printable timetables for easy distribution
- **Customizable**: Easy-to-edit data structure for your school's needs
- **Modular Code**: Clean, well-documented, beginner-friendly code structure

## 🚀 Getting Started

### Option 1: Run Locally

1. Clone or download this repository
2. Open `index.html` in a modern web browser (Chrome, Firefox, Safari, Edge)
3. Click "Generate Timetable" to create timetables

### Option 2: Host on GitHub Pages

1. **Create a GitHub repository**:
   - Go to GitHub and create a new repository (e.g., `timetable-generator`)
   
2. **Upload the code**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/timetable-generator.git
   cd timetable-generator
   # Copy all files from this project into the repository
   git add .
   git commit -m "Initial commit: Timetable generator"
   git push origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "main" branch
   - Click "Save"
   - Your site will be live at `https://YOUR_USERNAME.github.io/timetable-generator/`

## 📁 Project Structure

```
timetable-generator/
├── index.html          # Main HTML page
├── style.css           # Styling and layout
├── README.md           # This file
└── src/
    ├── data.js         # School configuration (classes, teachers, subjects, demands)
    ├── engine.js       # Core timetable generation algorithm
    ├── constraints.js  # Constraint validation functions
    ├── ui.js           # DOM rendering and UI helpers
    └── main.js         # Application entry point and event handlers
```

## 🎓 Customizing for Your School

All school-specific data is stored in `src/data.js`. You can customize:

### 1. Global Configuration

```javascript
export const config = {
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  periodsPerDay: 7,
  schoolName: "Veer Patta School"
};
```

- `days`: Array of working days
- `periodsPerDay`: Number of periods per day
- `schoolName`: Your school's name

### 2. Classes

```javascript
export const classes = [
  { id: "6A", name: "Class 6A", roomId: "ROOM_6A" },
  // Add more classes as needed
];
```

### 3. Subjects

```javascript
export const subjects = [
  { id: "MATH", name: "Mathematics", type: "theory" },
  { id: "SCI", name: "Science", type: "theory" },
  // Add more subjects as needed
];
```

- `type`: Can be "theory", "lab", or "activity"

### 4. Teachers

```javascript
export const teachers = [
  {
    id: "T1",
    name: "Mr. Sharma",
    subjects: ["MATH"],                    // Subjects this teacher can teach
    teachesClasses: ["6A", "6B", "7A"],    // Classes this teacher teaches
    maxPerDay: 6,                          // Maximum periods per day
    maxPerWeek: 36,                        // Maximum periods per week
    unavailableSlots: []                   // Times when teacher is unavailable
  },
  // Add more teachers as needed
];
```

To mark a teacher unavailable at specific times:
```javascript
unavailableSlots: [
  { day: "Saturday", period: 6 },
  { day: "Saturday", period: 7 }
]
```

### 5. Weekly Demands

```javascript
export const weeklyDemands = [
  {
    classId: "6A",
    subjectId: "MATH",
    periodsPerWeek: 6,           // Total periods needed per week
    doublePeriodsPerWeek: 0,     // Number of double periods needed
    preferredDays: []            // Optional (not used in v1)
  },
  // Add more demands as needed
];
```

**Double Periods**: For subjects like labs or games that need consecutive periods, set `doublePeriodsPerWeek`. For example:
```javascript
{ classId: "6A", subjectId: "COMP", periodsPerWeek: 2, doublePeriodsPerWeek: 1 }
```
This means Computer needs 2 periods total, both consecutive (1 double period).

## 🔧 How the Algorithm Works

The timetable generator uses a **constraint-based backtracking algorithm**:

1. **Task Building**: Converts weekly demands into individual scheduling tasks
   - Single period tasks (1 slot needed)
   - Double period tasks (2 consecutive slots needed)

2. **Prioritization**: Sorts tasks to schedule harder constraints first
   - Double periods are scheduled first (more constrained)
   - Then single periods

3. **Backtracking Search**: For each task:
   - Try each day and period combination
   - Try each suitable teacher (who teaches that subject to that class)
   - Check all constraints:
     - No teacher conflicts
     - No class conflicts
     - Teacher load limits respected
     - Teacher availability respected
   - If valid, continue to next task
   - If invalid, backtrack and try different choices

4. **Solution**: Returns complete timetable if all tasks are scheduled, or null if impossible

### Hard Constraints

The algorithm enforces these hard constraints (must be satisfied):

- **No Teacher Conflicts**: A teacher cannot teach two classes simultaneously
- **No Class Conflicts**: A class cannot have two subjects at the same time
- **Teacher Load Limits**: Teachers cannot exceed their daily/weekly maximum periods
- **Teacher Availability**: Teachers are not scheduled during their unavailable slots
- **Double Period Integrity**: Double periods must be consecutive on the same day

### Soft Constraints (Future)

Future versions could optimize for:
- Minimizing gaps in teacher schedules
- Balancing subject distribution across days
- Preferred time slots for certain subjects

## 🎯 Usage Tips

1. **Start Simple**: Begin with a small number of classes and subjects, then expand
2. **Balanced Demands**: Ensure total demands don't exceed available time slots
3. **Teacher Capacity**: Make sure you have enough teachers to cover all subjects
4. **Regenerate**: If generation fails, try clicking "Generate" again (backtracking explores different paths)
5. **Adjust Constraints**: If consistently failing, consider:
   - Reducing weekly demands
   - Adding more teachers
   - Increasing teacher max loads
   - Reducing double period requirements

## 📊 Sample Data

The application comes with sample data for:
- **4 Classes**: 6A, 6B, 7A, 7B
- **8 Subjects**: Mathematics, Science, English, Hindi, Social Science, Computer, Games, Art
- **8 Teachers**: With various subject specializations
- **Realistic Demands**: 32 periods per class per week (4 classes × 32 = 128 total periods)

This should generate successfully in a few seconds on most modern computers.

## 🚧 Known Limitations

- **Performance**: Very large schools (20+ classes) may take longer to generate
- **Complexity**: Extremely constrained scenarios might not find a solution
- **Browser-Based**: For very complex schools, consider server-based solutions like OR-Tools
- **No Persistence**: Timetables are not saved (print or screenshot to save)

## 🔮 Future Improvements

Potential enhancements for future versions:

- [ ] GUI editor for data (instead of editing JavaScript)
- [ ] Export timetable as CSV/PDF
- [ ] Import data from Excel/CSV
- [ ] Soft constraint optimization (minimize gaps, etc.)
- [ ] Special room/lab scheduling with capacity constraints
- [ ] Timetable comparison (try multiple generations)
- [ ] Save/load timetables to browser storage
- [ ] Multi-week or term-based scheduling

## 🛠️ Technical Details

- **Language**: Pure JavaScript (ES6 modules)
- **No Dependencies**: No frameworks or libraries required
- **Browser Support**: Modern browsers with ES6 module support
- **Mobile Responsive**: Works on tablets and phones (though desktop recommended)

## 📝 License

This project is open source and available for educational purposes.

## 🤝 Contributing

To contribute:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📧 Support

For questions or issues:
- Check existing issues on GitHub
- Create a new issue with detailed description
- Include sample data that reproduces the problem

## 🙏 Acknowledgments

Inspired by professional timetabling software like ASC Timetables, but simplified for browser-based use and educational purposes.

---

**Built with ❤️ for Veer Patta School**

Happy Scheduling! 🎓📅