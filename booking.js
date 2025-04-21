const bookings = {};
const availableList = document.getElementById("availableDatesList");
const eventList = document.getElementById("eventList");

function generateAvailableDates() {
  availableList.innerHTML = "";
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const formattedDate = date.toISOString().split("T")[0];

    if (!bookings[formattedDate]) {
      const li = document.createElement("li");
      li.textContent = formattedDate;
      availableList.appendChild(li);
    }
  }
}

generateAvailableDates();

document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("eventName").value.trim();
  const date = document.getElementById("eventDate").value;
  const duration = parseInt(document.getElementById("eventDuration").value);
  const startTime = document.getElementById("startTime").value;

  if (!bookings[date]) bookings[date] = [];

  const [startHour, startMin] = startTime.split(":").map(Number);
  const endHour = startHour + duration;
  const endTime = `${String(endHour).padStart(2, "0")}:${String(startMin).padStart(2, "0")}`;

  const conflict = bookings[date].some(event => {
    const [evStart, evEnd] = event.timeRange;
    return !(endTime <= evStart || startTime >= evEnd);
  });

  if (conflict) {
    alert("This time slot is already booked on this date.");
    return;
  }

  bookings[date].push({ name, timeRange: [startTime, endTime] });

  const li = document.createElement("li");
  li.textContent = `📅 ${date} | 🕒 ${startTime} - ${endTime} | "${name}"`;
  eventList.appendChild(li);

  generateAvailableDates();
  document.getElementById("bookingForm").reset();
});
