document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const eventList = document.getElementById("eventList");
  const availableDatesList = document.getElementById("availableDatesList");

  let bookings = [];

  // Utility function to format time
  function formatTime(date) {
    return date.toTimeString().slice(0, 5);
  }

  // Check if slot is available
  function isSlotAvailable(dateStr, startTime, duration) {
    const start = new Date(${dateStr}T${startTime});
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    return !bookings.some((b) => {
      const bStart = new Date(${b.date}T${b.time});
      const bEnd = new Date(bStart.getTime() + b.duration * 60 * 60 * 1000);
      return dateStr === b.date && start < bEnd && end > bStart;
    });
  }

  // Add event to the list
  function addEventToList(eventName, date, time, duration) {
    const li = document.createElement("li");
    li.textContent = ${eventName} - ${date} at ${time} for ${duration} hour(s);
    eventList.appendChild(li);
  }

  // Generate available slots for next 7 days
  function generateAvailableSlots() {
    availableDatesList.innerHTML = "";
    const now = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      for (let hour = 9; hour < 17; hour++) {
        const time = ${hour.toString().padStart(2, "0")}:00;
        if (isSlotAvailable(dateStr, time, 1)) {
          const li = document.createElement("li");
          li.textContent = ${dateStr} - ${time};
          availableDatesList.appendChild(li);
        }
      }
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;
    const startTime = document.getElementById("startTime").value;
    const duration = parseInt(document.getElementById("eventDuration").value);

    if (!isSlotAvailable(eventDate, startTime, duration)) {
      alert("Slot not available! Please choose a different time.");
      return;
    }

    bookings.push({ eventName, date: eventDate, time: startTime, duration });
    addEventToList(eventName, eventDate, startTime, duration);
    generateAvailableSlots();
    form.reset();
  });

  generateAvailableSlots(); // Initial call
});
