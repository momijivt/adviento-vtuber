const calendarButton = document.querySelector(".btn-start");
const calendarContainer = document.querySelector(".container");
const calendarDays = 24;
const STORAGE_KEY = "calendarCreated";
const STORAGE_ORDER = "doorOrder";
const STORAGE_OPENED = "doorsOpened";

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// SIMULAR la fecha actual para pruebas
const simulatedToday = new Date(); // Cambia a cualquier día 1..24 para probar

const openDoor = (path, doorNum, event) => {
  // Obtener la fecha actual
  const currentMonth = simulatedToday.getMonth();
  const currentDay = simulatedToday.getDate();  // día simulado que quieras probar

  // Solo abrir si estamos en diciembre y el día es >= número puerta
  if (currentMonth !== 11 || doorNum > currentDay) {
    alert("Esta casilla no se puede abrir todavía.");
    return;
  }

  // Abrir puerta
  event.target.parentNode.style.backgroundImage = `url(${path})`;
  event.target.style.opacity = "0";
  event.target.style.backgroundColor = "#15520fff";

  // Guardar que esta puerta quedó abierta
  const openedDoors = JSON.parse(localStorage.getItem(STORAGE_OPENED)) || [];
  if (!openedDoors.includes(doorNum)) {
    openedDoors.push(doorNum);
    localStorage.setItem(STORAGE_OPENED, JSON.stringify(openedDoors));
  }
};

const buildGridAreas = (doorOrder) => {
  let areas = "";
  for (let row = 0; row < 6; row++) {
    areas += `"${doorOrder.slice(row * 4, row * 4 + 4).map(num => "door" + num).join(" ")}" `;
  }
  calendarContainer.style.gridTemplateAreas = areas;
};

const createCalendarElements = (doorOrder, openedDoors = []) => {
  calendarContainer.innerHTML = "";
  buildGridAreas(doorOrder);

  const currentMonth = simulatedToday.getMonth();
  const currentDay = simulatedToday.getDate();


  for (let i = 0; i < calendarDays; i++) {
    const doorNum = i + 1;
    const calendarDoor = document.createElement("div");
    const calendarDoorText = document.createElement("div");

    calendarDoor.classList.add("image");
    calendarDoor.style.gridArea = "door" + doorNum;
    calendarContainer.appendChild(calendarDoor);

    calendarDoorText.classList.add("text");
    calendarDoorText.innerHTML = doorNum;
    calendarDoor.appendChild(calendarDoorText);

    const coursePath = `./courses/course-${doorNum}.png`;

    // Mostrar la puerta abierta si está registrada abierta
    if (openedDoors.includes(doorNum)) {
      calendarDoor.style.backgroundImage = `url(${coursePath})`;
      calendarDoorText.style.opacity = "0";
      calendarDoorText.style.backgroundColor = "#15520fff";
    }

    // Solo permitir click si es diciembre y día >= número de puerta
    if (currentMonth === 11 && doorNum <= currentDay) {
      calendarDoorText.style.cursor = "pointer";
      calendarDoorText.addEventListener("click", openDoor.bind(null, coursePath, doorNum));
    } else {
      // Casillas bloqueadas: sin cursor pointer y sin evento
      calendarDoorText.style.cursor = "not-allowed";
      calendarDoorText.addEventListener("click", (e) => {
        alert("Esta casilla no se puede abrir todavía.");
      });
    }
  }
};

const createCalendar = () => {
  if (localStorage.getItem(STORAGE_KEY)) return;

  const doorOrder = shuffleArray(Array.from({ length: calendarDays }, (_, i) => i + 1));
  localStorage.setItem(STORAGE_ORDER, JSON.stringify(doorOrder));
  localStorage.setItem(STORAGE_KEY, "true");
  localStorage.setItem(STORAGE_OPENED, JSON.stringify([]));

  createCalendarElements(doorOrder);

  calendarButton.disabled = true;
  calendarButton.classList.add("disabled");
};

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem(STORAGE_KEY)) {
    calendarButton.disabled = true;
    calendarButton.classList.add("disabled");

    const savedOrder = JSON.parse(localStorage.getItem(STORAGE_ORDER));
    const openedDoors = JSON.parse(localStorage.getItem(STORAGE_OPENED)) || [];
    createCalendarElements(savedOrder, openedDoors);
  }
});

calendarButton.addEventListener("click", createCalendar);
