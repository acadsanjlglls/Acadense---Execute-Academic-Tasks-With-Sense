document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // ACADENSE
    // Main JavaScript
    //
    // This file controls:
    // - User name and onboarding
    // - Navigation
    // - Today dashboard
    // - To-do list
    // - Calendar
    // - Upcoming Notes
    // - Pomodoro
    // - Stopwatch
    // - Settings
    // - LocalStorage backup/import
    // - Automatic real-time date and greeting updates
    // - About Acadense
    // ============================================================


    // ============================================================
    // STATE INITIALIZATION
    // ============================================================

    let state = {

        username: localStorage.getItem('acadense_username') || 'User',

        // --------------------------------------------------------
        // TO-DO TASKS
        // --------------------------------------------------------

        tasks: JSON.parse(localStorage.getItem('acadense_tasks')) || [

            {
                id: 1,
                text: 'Shape the afternoon brief',
                category: 'Work',
                completed: false
            },

            {
                id: 2,
                text: 'Book a quiet table for Friday',
                category: 'Personal',
                completed: false
            },

            {
                id: 3,
                text: 'Send notes from the studio visit',
                category: 'Work',
                completed: true
            },

            {
                id: 4,
                text: 'Water the window plants',
                category: 'Home',
                completed: false
            },

            {
                id: 5,
                text: 'Read the final chapter',
                category: 'Personal',
                completed: false
            }

        ],


        // --------------------------------------------------------
        // CALENDAR NOTES
        // --------------------------------------------------------

        calendarNotes:
            JSON.parse(localStorage.getItem('acadense_cal_notes')) || {

                '2026-08-28': [

                    {
                        title: "Brian's day",
                        desc: "The context is that - today is Brian's day",
                        type: "Event"
                    }

                ]

            },


        // --------------------------------------------------------
        // SELECTED CALENDAR DATE
        // --------------------------------------------------------

        selectedDate: null

    };


    // ============================================================
    // DATE HELPERS
    // ============================================================

    function getTodayDateString() {

        const now = new Date();

        const year = now.getFullYear();

        const month =
            String(now.getMonth() + 1).padStart(2, '0');

        const day =
            String(now.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;

    }


    function getTodayDate() {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return today;

    }


    function dateFromString(dateString) {

        const [year, month, day] =
            dateString.split('-').map(Number);

        return new Date(
            year,
            month - 1,
            day
        );

    }


    function getGreeting() {

        const hour = new Date().getHours();

        if (hour < 12) {

            return 'Good morning';

        }

        if (hour < 18) {

            return 'Good afternoon';

        }

        return 'Good evening';

    }


    function formatTodayHeader() {

        const now = new Date();

        return now
            .toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
            })
            .toUpperCase();

    }


    // ============================================================
    // SAVE STATE
    // ============================================================

    function saveState() {

        localStorage.setItem(
            'acadense_username',
            state.username
        );


        localStorage.setItem(
            'acadense_tasks',
            JSON.stringify(state.tasks)
        );


        localStorage.setItem(
            'acadense_cal_notes',
            JSON.stringify(state.calendarNotes)
        );

    }


    // ============================================================
    // HTML SAFETY
    // ============================================================

    function escapeHtml(str) {

        if (!str) return '';

        return String(str).replace(
            /[&<>'"]/g,

            tag => ({

                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'

            }[tag] || tag)

        );

    }


    // ============================================================
    // ONBOARDING
    // ============================================================

    const onboardingModal =
        document.getElementById('onboarding-modal');


    if (
        onboardingModal &&
        !localStorage.getItem('acadense_username')
    ) {

        onboardingModal.classList.remove('hidden');

    }


    const saveUsernameBtn =
        document.getElementById('save-username-btn');


    if (saveUsernameBtn) {

        saveUsernameBtn.addEventListener('click', () => {

            const input =
                document.getElementById('username-input');


            if (!input) return;


            const val =
                input.value.trim();


            if (val) {

                state.username = val;

                saveState();

                updateUI();

                if (onboardingModal) {

                    onboardingModal.classList.add('hidden');

                }

            }

        });

    }


    // ============================================================
    // NAVIGATION
    // ============================================================

    const navItems =
        document.querySelectorAll('.nav-item');

    const sections =
        document.querySelectorAll('.view-section');


    function switchView(targetId) {

        navItems.forEach(nav => {

            if (
                nav.getAttribute('data-target') === targetId
            ) {

                nav.classList.add('active');

            } else {

                nav.classList.remove('active');

            }

        });


        sections.forEach(section => {

            if (section.id === targetId) {

                section.classList.add('active');

            } else {

                section.classList.remove('active');

            }

        });

    }


    navItems.forEach(item => {

        item.addEventListener('click', event => {

            event.preventDefault();

            const target =
                item.getAttribute('data-target');

            switchView(target);

        });

    });


    // ------------------------------------------------------------
    // Dashboard jump links
    // ------------------------------------------------------------

    document
        .querySelectorAll('[data-jump]')
        .forEach(element => {

            element.addEventListener('click', () => {

                switchView(
                    element.getAttribute('data-jump')
                );

            });

        });


    // ============================================================
    // REAL-TIME GREETING + TODAY DATE
    // ============================================================

    function updateGreetingAndDate() {

        const greetingElement =
            document.getElementById('greeting-title');


        const dateElement =
            document.getElementById('current-date-tag');


        if (greetingElement) {

            greetingElement.textContent =
                `${getGreeting()}, ${state.username}.`;

        }


        if (dateElement) {

            dateElement.textContent =
                formatTodayHeader();

        }

    }


    // ============================================================
    // UPDATE ALL UI
    // ============================================================

    function updateUI() {

        updateGreetingAndDate();


        const settingsNameInput =
            document.getElementById(
                'settings-name-input'
            );


        if (settingsNameInput) {

            settingsNameInput.value =
                state.username;

        }


        renderTodayDashboard();

        renderTodoList();

        renderCalendar();

        renderUpcomingNotes();

    }


    // ============================================================
    // NAME SETTINGS
    // ============================================================

    const editNameTrigger =
        document.getElementById('edit-name-trigger');


    if (editNameTrigger) {

        editNameTrigger.addEventListener('click', () => {

            switchView('settings-view');

        });

    }


    const settingsSaveBtn =
        document.getElementById('settings-save-btn');


    if (settingsSaveBtn) {

        settingsSaveBtn.addEventListener('click', () => {

            const input =
                document.getElementById(
                    'settings-name-input'
                );


            if (!input) return;


            const val =
                input.value.trim();


            if (val) {

                state.username = val;

                saveState();

                updateUI();

                alert('Name updated successfully!');

            }

        });

    }


    // ============================================================
    // TODAY DASHBOARD
    // ============================================================

    function renderTodayDashboard() {

        const miniList =
            document.getElementById(
                'mini-pending-list'
            );


        if (!miniList) return;


        miniList.innerHTML = '';


        const pendingTasks =
            state.tasks.filter(
                task => !task.completed
            );


        const pendingCount =
            document.getElementById(
                'pending-count'
            );


        if (pendingCount) {

            pendingCount.textContent =
                pendingTasks.length;

        }


        // --------------------------------------------------------
        // Show first four pending tasks
        // --------------------------------------------------------

        pendingTasks
            .slice(0, 4)
            .forEach(task => {

                const li =
                    document.createElement('li');


                li.className =
                    `mini-task-item ${
                        task.completed ? 'completed' : ''
                    }`;


                li.innerHTML = `

                    <input
                        type="checkbox"
                        ${task.completed ? 'checked' : ''}
                        data-id="${task.id}"
                    >

                    <span>
                        ${escapeHtml(task.text)}
                    </span>

                `;


                const checkbox =
                    li.querySelector('input');


                if (checkbox) {

                    checkbox.addEventListener(
                        'change',
                        () => toggleTaskCompletion(task.id)
                    );

                }


                miniList.appendChild(li);

            });


        // --------------------------------------------------------
        // Anchor progress
        // --------------------------------------------------------

        const completedCount =
            state.tasks.filter(
                task => task.completed
            ).length;


        const totalCount =
            state.tasks.length || 0;


        const percent =
            Math.round(
                (completedCount / totalCount) * 100
            );


        const progressFill =
            document.getElementById(
                'anchor-progress-fill'
            );


        const progressText =
            document.getElementById(
                'anchor-progress-text'
            );


        if (progressFill) {

            progressFill.style.width =
                `${percent}%`;

        }


        if (progressText) {

            progressText.textContent =
                `${completedCount} of ${totalCount} small wins`;

        }


        // --------------------------------------------------------
        // Today's anchor
        // --------------------------------------------------------

        const anchorText =
            document.getElementById(
                'anchor-display-text'
            );


        if (anchorText) {

            if (pendingTasks.length > 0) {

                anchorText.textContent =
                    pendingTasks[0].text;

            } else {

                anchorText.textContent =
                    'All tasks completed!';

            }

        }

    }


    // ============================================================
    // UPCOMING NOTES
    // ============================================================

    function renderUpcomingNotes() {

        const container =
            document.getElementById(
                'upcoming-notes-list'
            );


        if (!container) return;


        container.innerHTML = '';


        const today =
            getTodayDate();


        const upcomingNotes = [];


        Object.keys(state.calendarNotes)
            .forEach(dateString => {

                const noteDate =
                    dateFromString(dateString);


                if (noteDate < today) {

                    return;

                }


                const notes =
                    state.calendarNotes[
                        dateString
                    ] || [];


                notes.forEach(note => {

                    upcomingNotes.push({

                        date: noteDate,

                        dateString: dateString,

                        title: note.title,

                        desc: note.desc,

                        type: note.type

                    });

                });

            });


        // --------------------------------------------------------
        // Sort by date
        // --------------------------------------------------------

        upcomingNotes.sort(
            (a, b) => a.date - b.date
        );


        // --------------------------------------------------------
        // Only show next three
        // --------------------------------------------------------

        const notesToDisplay =
            upcomingNotes.slice(0, 3);


        // --------------------------------------------------------
        // Empty state
        // --------------------------------------------------------

        if (notesToDisplay.length === 0) {

            container.innerHTML = `

                <div class="note-item-mini">

                    <div class="note-info">

                        <h4>No upcoming notes</h4>

                        <p>
                            Your calendar is clear for now.
                        </p>

                    </div>

                </div>

            `;

            return;

        }


        // --------------------------------------------------------
        // Create each upcoming note
        // --------------------------------------------------------

        notesToDisplay.forEach((note, index) => {

            const formattedDate =
                note.date
                    .toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit'
                    })
                    .toUpperCase();


            const badgeClass =
                index === 0
                    ? 'note-date-badge'
                    : 'note-date-badge orange';


            const noteElement =
                document.createElement('div');


            noteElement.className =
                'note-item-mini';


            noteElement.innerHTML = `

                <span class="${badgeClass}">
                    ${formattedDate}
                </span>

                <div class="note-info">

                    <h4>
                        ${escapeHtml(note.title)}
                    </h4>

                    <p>
                        ${escapeHtml(
                            note.desc || note.type || ''
                        )}
                    </p>

                </div>

            `;


            container.appendChild(noteElement);

        });

    }


    // ============================================================
    // TO-DO LIST
    // ============================================================

    let currentFilter = 'all';


    function renderTodoList() {

        const listContainer =
            document.getElementById(
                'full-todo-list'
            );


        if (!listContainer) return;


        listContainer.innerHTML = '';


        let filtered =
            state.tasks;


        if (currentFilter === 'active') {

            filtered =
                state.tasks.filter(
                    task => !task.completed
                );

        }


        if (currentFilter === 'done') {

            filtered =
                state.tasks.filter(
                    task => task.completed
                );

        }


        // --------------------------------------------------------
        // Counters
        // --------------------------------------------------------

        const countAll =
            document.getElementById('count-all');


        const countActive =
            document.getElementById('count-active');


        const countDone =
            document.getElementById('count-done');


        const todoTotalCounter =
            document.getElementById(
                'todo-total-counter'
            );


        if (countAll) {

            countAll.textContent =
                state.tasks.length;

        }


        if (countActive) {

            countActive.textContent =
                state.tasks.filter(
                    task => !task.completed
                ).length;

        }


        if (countDone) {

            countDone.textContent =
                state.tasks.filter(
                    task => task.completed
                ).length;

        }


        if (todoTotalCounter) {

            todoTotalCounter.textContent =
                `${state.tasks.filter(
                    task => !task.completed
                ).length} things in motion`;

        }


        // --------------------------------------------------------
        // Render tasks
        // --------------------------------------------------------

        filtered.forEach(task => {

            const li =
                document.createElement('li');


            li.className =
                `task-item-row ${
                    task.completed ? 'completed' : ''
                }`;


            li.innerHTML = `

                <div class="task-left">

                    <input
                        type="checkbox"
                        class="task-checkbox"
                        ${task.completed ? 'checked' : ''}
                        data-id="${task.id}"
                    >

                    <div class="task-text-content">

                        <h4>
                            ${escapeHtml(task.text)}
                        </h4>

                        <span class="task-category-tag">
                            ${escapeHtml(
                                task.category.toUpperCase()
                            )}
                        </span>

                    </div>

                </div>


                <div class="task-actions">

                    <button
                        class="action-btn"
                        title="Edit"
                        onclick="editTask(${task.id})"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>


                    <button
                        class="action-btn delete"
                        title="Delete"
                        onclick="deleteTask(${task.id})"
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            `;


            const checkbox =
                li.querySelector('.task-checkbox');


            if (checkbox) {

                checkbox.addEventListener(
                    'change',
                    () => toggleTaskCompletion(task.id)
                );

            }


            listContainer.appendChild(li);

        });

    }


    // ============================================================
    // TOGGLE TASK
    // ============================================================

    function toggleTaskCompletion(id) {

        state.tasks =
            state.tasks.map(task => {

                if (task.id === id) {

                    return {
                        ...task,
                        completed: !task.completed
                    };

                }

                return task;

            });


        saveState();

        updateUI();

    }


    // ============================================================
    // DELETE TASK
    // ============================================================

    window.deleteTask = function(id) {

        state.tasks =
            state.tasks.filter(
                task => task.id !== id
            );


        saveState();

        updateUI();

    };


    // ============================================================
    // EDIT TASK
    // ============================================================

    window.editTask = function(id) {

        const task =
            state.tasks.find(
                task => task.id === id
            );


        if (!task) return;


        const inputField =
            document.getElementById(
                'new-task-input'
            );


        const categoryField =
            document.getElementById(
                'new-task-category'
            );


        if (inputField) {

            inputField.value =
                task.text;

        }


        if (categoryField) {

            categoryField.value =
                task.category;

        }


        window.deleteTask(id);

    };


    // ============================================================
    // ADD TASK
    // ============================================================

    const addTaskBtn =
        document.getElementById(
            'add-task-btn'
        );


    if (addTaskBtn) {

        addTaskBtn.addEventListener('click', () => {

            const input =
                document.getElementById(
                    'new-task-input'
                );


            const categoryElement =
                document.getElementById(
                    'new-task-category'
                );


            if (!input || !categoryElement) return;


            const category =
                categoryElement.value;


            if (input.value.trim()) {

                state.tasks.push({

                    id: Date.now(),

                    text: input.value.trim(),

                    category: category,

                    completed: false

                });


                input.value = '';

                saveState();

                updateUI();

            }

        });

    }


    // ============================================================
    // TO-DO FILTERS
    // ============================================================

    document
        .querySelectorAll('.filter-btn')
        .forEach(button => {

            button.addEventListener('click', event => {

                document
                    .querySelectorAll('.filter-btn')
                    .forEach(btn => {

                        btn.classList.remove('active');

                    });


                event.currentTarget.classList.add(
                    'active'
                );


                currentFilter =
                    event.currentTarget.getAttribute(
                        'data-filter'
                    );


                renderTodoList();

            });

        });


    // ============================================================
    // CLEAR COMPLETED
    // ============================================================

    const clearCompleted =
        document.getElementById(
            'clear-completed'
        );


    if (clearCompleted) {

        clearCompleted.addEventListener('click', () => {

            state.tasks =
                state.tasks.filter(
                    task => !task.completed
                );


            saveState();

            updateUI();

        });

    }


    // ============================================================
    // CALENDAR
    // ============================================================

    let currentDate =
        new Date();


    let currentMonth =
        currentDate.getMonth();


    let currentYear =
        currentDate.getFullYear();


    // ============================================================
    // RENDER CALENDAR
    // ============================================================

    function renderCalendar() {

        const grid =
            document.getElementById(
                'cal-days-grid'
            );


        if (!grid) return;


        grid.innerHTML = '';


        const monthNames = [

            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'

        ];


        const monthYear =
            document.getElementById(
                'cal-month-year'
            );


        if (monthYear) {

            monthYear.textContent =
                `${monthNames[currentMonth]} ${currentYear}`;

        }


        const firstDayIndex =
            new Date(
                currentYear,
                currentMonth,
                1
            ).getDay();


        const totalDays =
            new Date(
                currentYear,
                currentMonth + 1,
                0
            ).getDate();


        // --------------------------------------------------------
        // Empty spaces
        // --------------------------------------------------------

        for (
            let i = 0;
            i < firstDayIndex;
            i++
        ) {

            const div =
                document.createElement('div');


            div.className =
                'cal-day empty';


            grid.appendChild(div);

        }


        // --------------------------------------------------------
        // Calendar days
        // --------------------------------------------------------

        for (
            let day = 1;
            day <= totalDays;
            day++
        ) {

            const div =
                document.createElement('div');


            div.className =
                'cal-day';


            const formattedMonth =
                String(currentMonth + 1)
                    .padStart(2, '0');


            const formattedDay =
                String(day)
                    .padStart(2, '0');


            const dateStr =
                `${currentYear}-${formattedMonth}-${formattedDay}`;


            div.textContent =
                day;


            // ----------------------------------------------------
            // Selected date
            // ----------------------------------------------------

            if (
                dateStr === state.selectedDate
            ) {

                div.classList.add('selected');

            }


            // ----------------------------------------------------
            // Real today
            // ----------------------------------------------------

            if (
                dateStr === getTodayDateString()
            ) {

                div.classList.add('today');

            }


            // ----------------------------------------------------
            // Calendar note indicator
            // ----------------------------------------------------

            if (
                state.calendarNotes[dateStr] &&
                state.calendarNotes[dateStr].length > 0
            ) {

                const dot =
                    document.createElement('div');


                dot.className =
                    'cal-day-dot';


                div.appendChild(dot);

            }


            // ----------------------------------------------------
            // Clicking a date
            // ----------------------------------------------------

            div.addEventListener('click', () => {

                state.selectedDate =
                    dateStr;


                renderCalendar();

                renderSelectedDayNotes();

                renderUpcomingNotes();

            });


            grid.appendChild(div);

        }


        renderSelectedDayNotes();

    }


    // ============================================================
    // SELECTED DAY NOTES
    // ============================================================

    function renderSelectedDayNotes() {

        const container =
            document.getElementById(
                'selected-day-notes-container'
            );


        if (!container) return;


        container.innerHTML = '';


        if (!state.selectedDate) {

            state.selectedDate =
                getTodayDateString();

        }


        const [year, month, day] =
            state.selectedDate.split('-');


        const dateObj =
            new Date(
                Number(year),
                Number(month) - 1,
                Number(day)
            );


        const options = {

            month: 'short',

            day: 'numeric'

        };


        const selectedDateDisplay =
            document.getElementById(
                'selected-date-display'
            );


        if (selectedDateDisplay) {

            selectedDateDisplay.textContent =
                dateObj.toLocaleDateString(
                    'en-US',
                    options
                );

        }


        const notes =
            state.calendarNotes[
                state.selectedDate
            ] || [];


        // --------------------------------------------------------
        // No notes
        // --------------------------------------------------------

        if (notes.length === 0) {

            container.innerHTML = `

                <div class="cal-note-item">

                    <h4>
                        A blank square
                    </h4>

                    <p>
                        Add a note for this day.
                    </p>

                </div>

            `;

            return;

        }


        // --------------------------------------------------------
        // Display notes
        // --------------------------------------------------------

        notes.forEach((note, index) => {

            const item =
                document.createElement('div');


            item.className =
                'cal-note-item';


            item.innerHTML = `

                <div class="cal-note-content">

                    <h4>

                        <span
                            class="pulse-dot"
                            style="
                                display:inline-block;
                                margin-right:6px;
                            "
                        ></span>

                        ${escapeHtml(note.title)}

                    </h4>


                    <p>
                        ${escapeHtml(note.desc || '')}
                    </p>

                </div>


                <div
                    class="task-actions"
                    style="
                        display:flex;
                        gap:6px;
                        margin-top:8px;
                    "
                >

                    <button
                        class="action-btn"
                        title="Edit"
                        onclick="
                            editCalendarNote(
                                '${state.selectedDate}',
                                ${index}
                            )
                        "
                    >

                        <i class="fa-solid fa-pen"></i>

                    </button>


                    <button
                        class="action-btn delete"
                        title="Delete"
                        onclick="
                            deleteCalendarNote(
                                '${state.selectedDate}',
                                ${index}
                            )
                        "
                    >

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            `;


            container.appendChild(item);

        });

    }


    // ============================================================
    // DELETE CALENDAR NOTE
    // ============================================================

    window.deleteCalendarNote =
        function(dateStr, index) {

            if (!state.calendarNotes[dateStr]) {

                return;

            }


            state.calendarNotes[dateStr]
                .splice(index, 1);


            if (
                state.calendarNotes[dateStr].length === 0
            ) {

                delete state.calendarNotes[dateStr];

            }


            saveState();

            renderCalendar();

            renderUpcomingNotes();

        };


    // ============================================================
    // EDIT CALENDAR NOTE
    // ============================================================

    window.editCalendarNote =
        function(dateStr, index) {

            const note =
                state.calendarNotes[
                    dateStr
                ][index];


            if (!note) return;


            const titleInput =
                document.getElementById(
                    'cal-note-title'
                );


            const descInput =
                document.getElementById(
                    'cal-note-desc'
                );


            const typeInput =
                document.getElementById(
                    'cal-note-type'
                );


            if (titleInput) {

                titleInput.value =
                    note.title;

            }


            if (descInput) {

                descInput.value =
                    note.desc || '';

            }


            if (typeInput) {

                typeInput.value =
                    note.type || 'Event';

            }


            window.deleteCalendarNote(
                dateStr,
                index
            );

        };


    // ============================================================
    // SAVE CALENDAR NOTE
    // ============================================================

    const saveCalNote =
        document.getElementById(
            'save-cal-note'
        );


    if (saveCalNote) {

        saveCalNote.addEventListener('click', () => {

            const titleInput =
                document.getElementById(
                    'cal-note-title'
                );


            const descInput =
                document.getElementById(
                    'cal-note-desc'
                );


            const typeInput =
                document.getElementById(
                    'cal-note-type'
                );


            if (
                !titleInput ||
                !descInput ||
                !typeInput
            ) {

                return;

            }


            const title =
                titleInput.value.trim();


            const desc =
                descInput.value.trim();


            const type =
                typeInput.value;


            if (!title) {

                return;

            }


            if (!state.selectedDate) {

                state.selectedDate =
                    getTodayDateString();

            }


            if (
                !state.calendarNotes[
                    state.selectedDate
                ]
            ) {

                state.calendarNotes[
                    state.selectedDate
                ] = [];

            }


            state.calendarNotes[
                state.selectedDate
            ].push({

                title,
                desc,
                type

            });


            titleInput.value = '';

            descInput.value = '';


            saveState();


            renderCalendar();

            renderUpcomingNotes();

        });

    }


    // ============================================================
    // PREVIOUS MONTH
    // ============================================================

    const prevMonth =
        document.getElementById(
            'prev-month'
        );


    if (prevMonth) {

        prevMonth.addEventListener('click', () => {

            currentMonth--;


            if (currentMonth < 0) {

                currentMonth = 11;

                currentYear--;

            }


            renderCalendar();

        });

    }


    // ============================================================
    // NEXT MONTH
    // ============================================================

    const nextMonth =
        document.getElementById(
            'next-month'
        );


    if (nextMonth) {

        nextMonth.addEventListener('click', () => {

            currentMonth++;


            if (currentMonth > 11) {

                currentMonth = 0;

                currentYear++;

            }


            renderCalendar();

        });

    }


    // ============================================================
    // GO TO REAL TODAY
    // ============================================================

    const goToTodayBtn =
        document.getElementById(
            'go-to-today-btn'
        );


    if (goToTodayBtn) {

        goToTodayBtn.addEventListener('click', () => {

            const now =
                new Date();


            currentMonth =
                now.getMonth();


            currentYear =
                now.getFullYear();


            state.selectedDate =
                getTodayDateString();


            renderCalendar();

            renderUpcomingNotes();

        });

    }


    // ============================================================
    // REAL-TIME DATE CHECKING
    // ============================================================

    let lastKnownDate =
        getTodayDateString();


    function checkForDateChange() {

        const currentDate =
            getTodayDateString();


        if (
            currentDate !== lastKnownDate
        ) {

            lastKnownDate =
                currentDate;


            const now =
                new Date();


            currentMonth =
                now.getMonth();


            currentYear =
                now.getFullYear();


            state.selectedDate =
                currentDate;


            updateGreetingAndDate();

            renderCalendar();

            renderUpcomingNotes();

        }


        updateGreetingAndDate();

    }


    setInterval(
        checkForDateChange,
        60000
    );


    // ============================================================
    // POMODORO
    // ============================================================

    let pomoTimer = null;

    let pomoSeconds =
        20 * 60;

    let pomoRunning = false;

    let pomoMode = 'focus';


    function updatePomoDisplay() {

        const mins =
            Math.floor(
                pomoSeconds / 60
            );


        const secs =
            pomoSeconds % 60;


        const display =
            document.getElementById(
                'pomo-time-display'
            );


        if (display) {

            display.textContent =
                `${String(mins).padStart(2, '0')}:` +
                `${String(secs).padStart(2, '0')}`;

        }

    }


    // ------------------------------------------------------------
    // Pomodoro modes
    // ------------------------------------------------------------

    document
        .querySelectorAll('.pomo-mode-btn')
        .forEach(button => {

            button.addEventListener(
                'click',
                event => {

                    document
                        .querySelectorAll(
                            '.pomo-mode-btn'
                        )
                        .forEach(btn => {

                            btn.classList.remove(
                                'active'
                            );

                        });


                    event.currentTarget.classList.add(
                        'active'
                    );


                    pomoMode =
                        event.currentTarget.getAttribute(
                            'data-mode'
                        );


                    clearInterval(
                        pomoTimer
                    );


                    pomoRunning = false;


                    const toggleBtn =
                        document.getElementById(
                            'pomo-toggle-btn'
                        );


                    if (toggleBtn) {

                        toggleBtn.innerHTML =
                            `<i class="fa-solid fa-play"></i>` +
                            ` Start ${pomoMode}`;

                    }


                    if (
                        pomoMode === 'focus'
                    ) {

                        pomoSeconds =
                            20 * 60;

                    }


                    if (
                        pomoMode === 'short'
                    ) {

                        pomoSeconds =
                            5 * 60;

                    }


                    if (
                        pomoMode === 'long'
                    ) {

                        pomoSeconds =
                            15 * 60;

                    }


                    updatePomoDisplay();

                }

            );

        });


    // ------------------------------------------------------------
    // Pomodoro Start / Pause
    // ------------------------------------------------------------

    const pomoToggleBtn =
        document.getElementById(
            'pomo-toggle-btn'
        );


    if (pomoToggleBtn) {

        pomoToggleBtn.addEventListener('click', () => {

            if (!pomoRunning) {

                pomoRunning = true;


                pomoToggleBtn.innerHTML =
                    `<i class="fa-solid fa-pause"></i>` +
                    ` Pause`;


                pomoTimer =
                    setInterval(() => {

                        if (
                            pomoSeconds > 0
                        ) {

                            pomoSeconds--;

                            updatePomoDisplay();

                        } else {

                            clearInterval(
                                pomoTimer
                            );


                            pomoRunning = false;


                            alert(
                                'Pomodoro session completed!'
                            );

                        }

                    }, 1000);

            } else {

                pomoRunning = false;

                clearInterval(
                    pomoTimer
                );


                pomoToggleBtn.innerHTML =
                    `<i class="fa-solid fa-play"></i>` +
                    ` Resume`;

            }

        });

    }


    // ------------------------------------------------------------
    // Pomodoro Reset
    // ------------------------------------------------------------

    const pomoResetBtn =
        document.getElementById(
            'pomo-reset-btn'
        );


    if (pomoResetBtn) {

        pomoResetBtn.addEventListener('click', () => {

            clearInterval(
                pomoTimer
            );


            pomoRunning = false;


            if (
                pomoMode === 'focus'
            ) {

                pomoSeconds =
                    20 * 60;

            }


            if (
                pomoMode === 'short'
            ) {

                pomoSeconds =
                    5 * 60;

            }


            if (
                pomoMode === 'long'
            ) {

                pomoSeconds =
                    15 * 60;

            }


            updatePomoDisplay();


            pomoToggleBtn.innerHTML =
                `<i class="fa-solid fa-play"></i>` +
                ` Start ${pomoMode}`;

        });

    }


    // ------------------------------------------------------------
    // Pomodoro minus 5 minutes
    // ------------------------------------------------------------

    const pomoMinus =
        document.getElementById(
            'pomo-minus'
        );


    if (pomoMinus) {

        pomoMinus.addEventListener('click', () => {

            pomoSeconds =
                Math.max(
                    0,
                    pomoSeconds - 300
                );


            updatePomoDisplay();

        });

    }


    // ------------------------------------------------------------
    // Pomodoro plus 5 minutes
    // ------------------------------------------------------------

    const pomoPlus =
        document.getElementById(
            'pomo-plus'
        );


    if (pomoPlus) {

        pomoPlus.addEventListener('click', () => {

            pomoSeconds += 300;

            updatePomoDisplay();

        });

    }


    // ============================================================
    // STOPWATCH
    // ============================================================

    let swTimer = null;

    let swMilliseconds = 0;

    let swRunning = false;

    let laps = [];


    function updateSwDisplay() {

        const totalMs =
            swMilliseconds;


        const hrs =
            String(
                Math.floor(
                    totalMs / 3600000
                )
            ).padStart(2, '0');


        const mins =
            String(
                Math.floor(
                    (totalMs % 3600000) /
                    60000
                )
            ).padStart(2, '0');


        const secs =
            String(
                Math.floor(
                    (totalMs % 60000) /
                    1000
                )
            ).padStart(2, '0');


        const ms =
            String(
                totalMs % 1000
            ).padStart(3, '0');


        const display =
            document.getElementById(
                'sw-display'
            );


        if (display) {

            display.textContent =
                `${hrs}:${mins}:${secs}.${ms}`;

        }

    }


    // ------------------------------------------------------------
    // Stopwatch Start / Stop
    // ------------------------------------------------------------

    const swToggleBtn =
        document.getElementById(
            'sw-toggle-btn'
        );


    if (swToggleBtn) {

        swToggleBtn.addEventListener('click', () => {

            if (!swRunning) {

                swRunning = true;


                swToggleBtn.innerHTML =
                    `<i class="fa-solid fa-stop"></i>` +
                    ` Stop`;


                const startTime =
                    Date.now() -
                    swMilliseconds;


                swTimer =
                    setInterval(() => {

                        swMilliseconds =
                            Date.now() -
                            startTime;


                        updateSwDisplay();

                    }, 30);

            } else {

                swRunning = false;


                clearInterval(
                    swTimer
                );


                swToggleBtn.innerHTML =
                    `<i class="fa-solid fa-play"></i>` +
                    ` Start`;

            }

        });

    }


    // ------------------------------------------------------------
    // Stopwatch Lap
    // ------------------------------------------------------------

    const swLapBtn =
        document.getElementById(
            'sw-lap-btn'
        );


    if (swLapBtn) {

        swLapBtn.addEventListener('click', () => {

            if (!swRunning) {

                return;

            }


            const swDisplay =
                document.getElementById(
                    'sw-display'
                );


            if (!swDisplay) return;


            laps.push(
                swDisplay.textContent
            );


            const list =
                document.getElementById(
                    'laps-list'
                );


            if (!list) return;


            list.innerHTML = '';


            laps
                .slice()
                .reverse()
                .forEach(
                    (lap, index) => {

                        const div =
                            document.createElement(
                                'div'
                            );


                        div.className =
                            'lap-item';


                        div.innerHTML = `

                            <span>
                                Lap ${laps.length - index}
                            </span>

                            <span>
                                ${escapeHtml(lap)}
                            </span>

                        `;


                        list.appendChild(div);

                    }
                );

        });

    }


    // ------------------------------------------------------------
    // Stopwatch Reset
    // ------------------------------------------------------------

    const swResetBtn =
        document.getElementById(
            'sw-reset-btn'
        );


    if (swResetBtn) {

        swResetBtn.addEventListener('click', () => {

            clearInterval(
                swTimer
            );


            swRunning = false;


            swMilliseconds = 0;


            laps = [];


            const lapsList =
                document.getElementById(
                    'laps-list'
                );


            if (lapsList) {

                lapsList.innerHTML = '';

            }


            updateSwDisplay();


            if (swToggleBtn) {

                swToggleBtn.innerHTML =
                    `<i class="fa-solid fa-stop"></i>` +
                    ` Stop`;

            }

        });

    }


    // ============================================================
    // ABOUT ACADENSE
    // ============================================================

    /*
        This section is intentionally INSIDE the
        DOMContentLoaded function.

        Previously it was outside the function, which could cause
        getElementById() to return null if the JavaScript loaded
        before the HTML elements existed.
    */

    const aboutAcadenseBtn =
        document.getElementById(
            'about-acadense-btn'
        );


    const aboutAcadenseModal =
        document.getElementById(
            'about-acadense-modal'
        );


    const closeAboutAcadenseBtn =
        document.getElementById(
            'close-about-acadense-btn'
        );


    if (
        aboutAcadenseBtn &&
        aboutAcadenseModal &&
        closeAboutAcadenseBtn
    ) {

        // --------------------------------------------------------
        // Open About Acadense
        // --------------------------------------------------------

        aboutAcadenseBtn.addEventListener(
            'click',
            () => {

                aboutAcadenseModal.classList.remove(
                    'hidden'
                );

            }
        );


        // --------------------------------------------------------
        // Close About Acadense
        // --------------------------------------------------------

        closeAboutAcadenseBtn.addEventListener(
            'click',
            () => {

                aboutAcadenseModal.classList.add(
                    'hidden'
                );

            }
        );


        // --------------------------------------------------------
        // Close by clicking outside modal
        // --------------------------------------------------------

        aboutAcadenseModal.addEventListener(
            'click',
            event => {

                if (
                    event.target ===
                    aboutAcadenseModal
                ) {

                    aboutAcadenseModal.classList.add(
                        'hidden'
                    );

                }

            }
        );

    }


    // ============================================================
    // INITIAL DATE SETUP
    // ============================================================

    state.selectedDate =
        getTodayDateString();


    const startupDate =
        new Date();


    currentMonth =
        startupDate.getMonth();


    currentYear =
        startupDate.getFullYear();


    lastKnownDate =
        getTodayDateString();


    // ============================================================
    // INITIAL RENDER
    // ============================================================

    updatePomoDisplay();

    updateSwDisplay();

    updateUI();

});


// ================================================================
// DATA EXPORT
// ================================================================

function exportLocalStorageData() {

    const dataObj = {};


    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const key =
            localStorage.key(i);


        try {

            dataObj[key] =
                JSON.parse(
                    localStorage.getItem(key)
                );

        } catch (e) {

            dataObj[key] =
                localStorage.getItem(key);

        }

    }


    const dataStr =
        'data:text/json;charset=utf-8,' +
        encodeURIComponent(
            JSON.stringify(
                dataObj,
                null,
                2
            )
        );


    const downloadAnchor =
        document.createElement('a');


    downloadAnchor.setAttribute(
        'href',
        dataStr
    );


    downloadAnchor.setAttribute(
        'download',
        `acadense_backup_${
            new Date()
                .toISOString()
                .slice(0, 10)
        }.json`
    );


    document.body.appendChild(
        downloadAnchor
    );


    downloadAnchor.click();


    downloadAnchor.remove();

}


// ================================================================
// DATA IMPORT
// ================================================================

function importLocalStorageData(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload = function(e) {

        try {

            const importedData =
                JSON.parse(
                    e.target.result
                );


            for (
                const key in importedData
            ) {

                if (
                    Object.prototype.hasOwnProperty
                        .call(
                            importedData,
                            key
                        )
                ) {

                    const val =
                        typeof importedData[key] === 'object'

                            ? JSON.stringify(
                                importedData[key]
                            )

                            : importedData[key];


                    localStorage.setItem(
                        key,
                        val
                    );

                }

            }


            alert(
                'Data imported successfully! Reloading...'
            );


            location.reload();


        } catch (err) {

            alert(
                'Invalid JSON backup file.'
            );

        }

    };


    reader.readAsText(file);

}