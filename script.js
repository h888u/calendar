
const monthYear = document.getElementById("monthYear");
const calendarDays = document.getElementById("calendarDays");

const modal = document.getElementById("eventModal");
const eventInput = document.getElementById("eventInput");
const selectedDateText = document.getElementById("selectedDate");

let currentDate = new Date();
let selectedDate = null;

let events = JSON.parse(localStorage.getItem("calendarEvents")) || {};

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    monthYear.textContent = currentDate.toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
    );

    calendarDays.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        calendarDays.appendChild(document.createElement("div"));
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${month + 1}-${day}`;

        const dayElement = document.createElement("div");
        dayElement.className = "day";
        dayElement.textContent = day;

        const today = new Date();

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dayElement.classList.add("today");
        }

        if (events[dateKey]) {
            events[dateKey].forEach(event => {
                const eventElement = document.createElement("div");
                eventElement.className = "event";
                eventElement.textContent = event;
                dayElement.appendChild(eventElement);
            });
        }

        dayElement.addEventListener("click", () => {
            selectedDate = dateKey;
            selectedDateText.textContent = dateKey;
            eventInput.value = "";
            modal.classList.remove("hidden");
            eventInput.focus();
        });

        calendarDays.appendChild(dayElement);
    }
}

document.getElementById("prevMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
};

document.getElementById("nextMonth").onclick = () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
};

document.getElementById("saveEvent").onclick = () => {
    const eventName = eventInput.value.trim();

    if (!eventName) return;

    if (!events[selectedDate]) {
        events[selectedDate] = [];
    }

    events[selectedDate].push(eventName);

    localStorage.setItem(
        "calendarEvents",
        JSON.stringify(events)
    );

    modal.classList.add("hidden");
    renderCalendar();
};

document.getElementById("closeModal").onclick = () => {
    modal.classList.add("hidden");
};

renderCalendar();
