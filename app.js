import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC-hMSencH40g6ojgPSqosj69Ixkkraf7w",
  authDomain: "microsvolta.firebaseapp.com",
  projectId: "microsvolta",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const eventosRef = ref(db, "eventos");

// ELEMENTOS
const btn = document.getElementById("btnAgregar");
const lista = document.getElementById("listaEventos");

// AGREGAR EVENTO
btn.addEventListener("click", () => {
  const nombre = document.getElementById("nombre").value;
  const lugar = document.getElementById("lugar").value;
  const fecha = document.getElementById("fecha").value;
  const precio = document.getElementById("precio").value;

  if (!nombre || !lugar || !fecha || !precio) {
    alert("Completa todo capo");
    return;
  }

  push(eventosRef, {
    nombre,
    lugar,
    fecha,
    precio: Number(precio)
  });

  // 🔥 RESET FORMULARIO
  document.getElementById("nombre").value = "";
  document.getElementById("lugar").value = "";
  document.getElementById("fecha").value = "";
  document.getElementById("precio").value = "";
});

// ESCUCHAR DATOS EN TIEMPO REAL
onValue(eventosRef, (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  let eventos = Object.values(data);

  // ORDENAR POR FECHA
  eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // LIMPIAR LISTA
  lista.innerHTML = "";

  eventos.forEach(ev => {
    const li = document.createElement("li");
    li.innerHTML = `
    <strong>${ev.nombre}</strong>
    <div>📍 ${ev.lugar}</div>
    <div>📅 ${ev.fecha}</div>
    <div>💰 $${ev.precio}</div>
  `;
    lista.appendChild(li);
  });

  renderCalendario(eventos);
});

// CALENDARIO SIMPLE
function renderCalendario(eventos) {
  const cont = document.getElementById("calendario");
  cont.innerHTML = "";

  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth();

  const primerDia = new Date(año, mes, 1).getDay();
  const diasMes = new Date(año, mes + 1, 0).getDate();

  const grid = document.createElement("div");
  grid.classList.add("calendario-grid");

  for (let i = 0; i < primerDia; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= diasMes; d++) {
    const div = document.createElement("div");
    div.classList.add("dia");
    div.textContent = d;

    const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // MARCAR SI HAY EVENTO
    if (eventos.some(ev => ev.fecha === fechaStr)) {
      div.classList.add("evento-dia");
    }

    grid.appendChild(div);
  }

  cont.appendChild(grid);
}
