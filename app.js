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
    <div class="evento-nombre">${ev.nombre}</div>
    <div class="evento-info">📍 ${ev.lugar}</div>
    <div class="evento-info">📅 ${ev.fecha}</div>
    <div class="evento-info">💰 $${ev.precio}</div>
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

  // Espacios vacíos
  for (let i = 0; i < primerDia; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= diasMes; d++) {
    const div = document.createElement("div");
    div.classList.add("dia");

    const fechaStr = `${año}-${String(mes + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // Número del día
    const numero = document.createElement("div");
    numero.classList.add("numero-dia");
    numero.textContent = d;
    div.appendChild(numero);

    // Eventos de ese día
    const eventosDelDia = eventos.filter(ev => ev.fecha === fechaStr);

    eventosDelDia.forEach(ev => {
      const e = document.createElement("div");
      e.classList.add("evento-cal");
      e.textContent = ev.nombre;
      div.appendChild(e);
    });

    grid.appendChild(div);
  }

  cont.appendChild(grid);
}
