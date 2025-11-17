# 🎓 Veer Patta School Timetable Generator

A complete, browser-based intelligent timetable generator for schools, inspired by ASC Timetables. Built with **vanilla HTML, CSS, and JavaScript** — no backend required! Perfect for deployment on **GitHub Pages**.

## ✨ Features

- **🌐 100% Browser-Based**: Runs entirely in the browser with no server needed
- **🧠 Intelligent Constraint Solver**: Uses backtracking algorithm to satisfy complex scheduling constraints
- **👥 Multi-Entity Support**: Handles multiple classes, teachers, subjects, and time slots
- **📅 Flexible Scheduling**: Supports single and double periods (consecutive periods for labs/activities)
- **👨‍🏫 Dual Views**: View timetables organized by class or by teacher
- **🎯 Constraint Validation**:
  - No teacher conflicts (teachers can't be in two places at once)
  - No class conflicts (classes can't have two subjects simultaneously)
  - Teacher workload limits (daily and weekly maximums)
  - Teacher availability windows
  - Room conflict prevention
  - Double period validation
- **🖨️ Print-Ready**: Optimized CSS for printing or saving as PDF
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **⚙️ Easy Customization**: Simple JavaScript data structures for school configuration

## 🚀 Quick Start

### Option 1: Run Locally

1. **Download or clone this repository**
   ```bash
   git clone https://github.com/yourusername/timetable-generator.git
   cd timetable-generator
   ```

2. **Open in browser**
   - Simply open `index.html` in any modern web browser
   - No build process or dependencies required!

3. **Generate timetable**
   - Click the "⚡ Generate Timetable" button
   - View by class or by teacher using the tabs
   - Print using Ctrl+P (Cmd+P on Mac)

### Option 2: Deploy to GitHub Pages

1. **Create a new GitHub repository**
   - Go to [GitHub](https://github.com) and create a new repository
   - Name it something like `school-timetable-generator`

2. **Push this code to your repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Timetable generator"
   git branch -M main
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository Settings
   - Navigate to "Pages" section
   - Under "Source", select `main` branch
   - Click "Save"
   - Your site will be live at `https://yourusername.github.io/your-repo-name/`

## 📚 How to Customize School Data

All school-specific data is centralized in **`src/data.js`**. You can edit this file to match your school's requirements.

### 1. Global Configuration

```javascript
const CONFIG = {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    periodsPerDay: 7,
    schoolName: "Veer Patta School",
};
```

**To customize:**
- Change `days` array to include/exclude days (e.g., remove Saturday for 5-day week)
- Change `periodsPerDay` to your school's period count
- Update `schoolName` for display purposes

### 2. Classes/Sections

```javascript
const CLASSES = [
    {
        id: "6A",
        name: "Class 6A",
        roomId: "ROOM_6A",
    },
    // Add more classes...
];
```

**To customize:**
- Add or remove class objects
- Set unique `id` for each class
- Set descriptive `name` for display
- Set `roomId` to link with a room (optional, for future features)

### 3. Subjects

```javascript
const SUBJECTS = [
    {
        id: "MATH",
        name: "Mathematics",
        type: "theory",  // theory, lab, or activity
    },
    // Add more subjects...
];
```

**To customize:**
- Add or remove subjects
- Use short `id` (used internally)
- Set full `name` (displayed in timetable)
- Set `type` to categorize (for future enhancements)

### 4. Teachers

```javascript
const TEACHERS = [
    {
        id: "T1",
        name: "Mr. Sharma",
        subjects: ["MATH"],              // Subjects this teacher can teach
        teachesClasses: ["6A", "6B"],    // Which classes they teach
        maxPerDay: 6,                    // Max periods per day
        maxPerWeek: 35,                  // Max periods per week
        unavailableSlots: [],            // Times they can't teach
    },
    // Add more teachers...
];
```

**To customize:**
- Add or remove teachers
- Set `subjects` array with subject IDs they can teach
- Set `teachesClasses` with class IDs they can teach
- Adjust `maxPerDay` and `maxPerWeek` based on workload policies
- Add unavailable slots: `[{day: "Monday", period: 1}, ...]`

### 5. Weekly Subject Demands

```javascript
const WEEKLY_DEMANDS = [
    {
        classId: "6A",
        subjectId: "MATH",
        periodsPerWeek: 6,
        doublePeriodsPerWeek: 0,  // Number of double-period blocks
    },
    // Add more demands...
];
```

**To customize:**
- Add an entry for each class-subject combination
- Set `periodsPerWeek` to total periods needed
- Set `doublePeriodsPerWeek` for subjects needing consecutive periods (labs, etc.)
  - Example: `doublePeriodsPerWeek: 1` means 1 double period (2 consecutive periods)
  - The remaining periods will be single periods
  - Total periods = (doublePeriodsPerWeek × 2) + single periods

## 🧮 How the Algorithm Works

The timetable generator uses a **constraint-based backtracking algorithm**, similar to solving a Sudoku puzzle.

### High-Level Process

1. **Build Task List**
   - Parse weekly demands into individual "tasks" (periods to schedule)
   - Separate tasks into single periods and double periods

2. **Prioritize Tasks**
   - Schedule harder tasks first (double periods, subjects with few teachers)
   - This improves the chances of finding a solution

3. **Backtracking Search**
   - For each task:
     - Try each possible time slot (day + period)
     - Try each eligible teacher
     - Check all constraints
     - If valid, continue to next task
     - If invalid, backtrack and try different assignment
   - Continue until all tasks are assigned or no solution exists

4. **Constraint Checking**
   - **No teacher conflicts**: Each teacher in only one place at a time
   - **No class conflicts**: Each class has only one subject at a time
   - **Teacher loads**: Respect daily and weekly maximums
   - **Availability**: Don't schedule teachers during unavailable slots
   - **Room conflicts**: Rooms not double-booked
   - **Double periods**: Consecutive periods on same day

### Algorithm Complexity

- **Time Complexity**: Exponential in worst case (O(b^d) where b = branching factor, d = depth)
- **Space Complexity**: O(n) where n = number of tasks
- **Performance**: Works well for small to medium schools (up to ~20 classes, ~30 teachers)

### Limitations

- **Large Schools**: Very large schools (50+ classes) may experience slow generation or failures
- **Over-Constrained Problems**: If constraints are too tight, no solution may exist
- **No Soft Constraints**: Current version only handles hard constraints (future: minimize gaps, preferred times, etc.)

### When Generation Fails

If the generator can't find a solution:

1. **Relax constraints**:
   - Reduce weekly subject demands
   - Increase teacher `maxPerDay` or `maxPerWeek`
   - Add more teachers
   - Remove some unavailable slots

2. **Reduce double periods**:
   - Double periods are harder to place
   - Try reducing `doublePeriodsPerWeek` values

3. **Check for conflicts**:
   - Ensure all class-subject combinations have at least one eligible teacher
   - Verify teacher loads are feasible

## 🏗️ Project Structure

```
timetable-generator/
├── index.html              # Main HTML page
├── style.css               # Styling (responsive & print-friendly)
├── README.md               # This file
└── src/
    ├── data.js             # School configuration data
    ├── constraints.js      # Constraint checking functions
    ├── engine.js           # Core backtracking algorithm
    ├── ui.js               # DOM rendering functions
    └── main.js             # Entry point & event handling
```

### File Responsibilities

- **`data.js`**: All school-specific data (easy to edit for customization)
- **`constraints.js`**: Pure functions that validate constraints (reusable, testable)
- **`engine.js`**: Backtracking solver logic (the "brain")
- **`ui.js`**: DOM manipulation and table rendering (presentation layer)
- **`main.js`**: Wires everything together, handles user interactions

## 🎨 Customizing the UI

### Changing Colors

Edit `style.css` to change the color scheme:

```css
/* Main gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Change to your school colors, e.g.: */
background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
```

### Changing Fonts

```css
body {
    font-family: 'Your Font', Arial, sans-serif;
}
```

### Adding School Logo

Edit `index.html` header section:

```html
<header class="app-header">
    <img src="logo.png" alt="School Logo" style="width: 100px;">
    <h1>🎓 Your School Name</h1>
</header>
```

## 🔮 Future Enhancements

Potential features for future versions:

- [ ] **GUI Data Editor**: Edit classes, teachers, and demands through forms instead of editing JS
- [ ] **Soft Constraints**: Minimize teacher gaps, preferred time slots, balanced daily loads
- [ ] **Export Options**: Download timetables as CSV, Excel, or PDF
- [ ] **Multiple Timetables**: Generate and compare multiple valid solutions
- [ ] **Conflict Resolution**: Interactive mode to resolve conflicts manually
- [ ] **Save/Load**: Save configurations and timetables to browser storage
- [ ] **Advanced Features**: Room allocation for labs, teacher preferences, subject clustering
- [ ] **Performance**: Web Workers for faster generation, progressive updates
- [ ] **Import**: Load data from CSV/Excel files

## 🐛 Troubleshooting

### Generation Takes Too Long

- **Reduce complexity**: Fewer classes, subjects, or demands
- **Increase teacher availability**: More teachers or higher `maxPerWeek`
- **Reduce double periods**: They're harder to place

### Generation Always Fails

- **Check console**: Open browser DevTools (F12) and check Console for error messages
- **Validate data**: The app logs validation warnings on page load
- **Over-constrained**: Too many demands for available slots/teachers

### Timetable Looks Wrong

- **Check data.js**: Ensure IDs match between classes, subjects, teachers, and demands
- **Check browser console**: Look for errors or warnings

### Print Looks Bad

- **Use browser print preview**: Adjust margins and scaling
- **Print to PDF**: Better control than direct printing
- **Landscape mode**: Often better for wide timetables

## 📄 License

This project is open source and available for educational purposes. Feel free to use, modify, and distribute.

## 🤝 Contributing

Contributions are welcome! Some ways to contribute:

- Report bugs or issues
- Suggest new features
- Improve documentation
- Optimize the algorithm
- Add test cases

## 📞 Support

For questions or support:

- Check browser console for detailed error messages
- Review the code comments (extensively documented)
- Open an issue on GitHub

## 🙏 Acknowledgments

Inspired by professional timetabling software like ASC Timetables, but simplified for browser-based use and school IT administrators.

---

**Made with ❤️ for Veer Patta School and schools everywhere**

*Last Updated: November 2025*