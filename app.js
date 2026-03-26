import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

function toggleSeleccion(ev) {
  const eventoRef = ref(db, "eventos/" + ev.id);

  update(eventoRef, {
    seleccionado: !ev.seleccionado
  });
}
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

/// CONFIGURACIÓN DE MESES
const meses = [
  "Enero", "Febrero", "Marzo", "Abril",
  "Mayo", "Junio", "Julio", "Agosto",
  "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

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
    precio: Number(precio),
    seleccionado: false // 🔥 nuevo
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

  let eventos = Object.entries(data).map(([id, ev]) => ({
  id,
  ...ev
}));

  // ORDENAR POR FECHA
  eventos.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  // LIMPIAR LISTA
  lista.innerHTML = "";

  eventos.forEach((ev) => {
  const li = document.createElement("li");

  if (ev.seleccionado) {
    li.classList.add("seleccionado");
  }

  li.innerHTML = `
    <div class="evento-nombre">${ev.nombre}</div>
    <div class="evento-info">📍 ${ev.lugar}</div>
    <div class="evento-info">📅 ${ev.fecha}</div>
    <div class="evento-info">💰 $${ev.precio}</div>
    <button class="btn-ver">Ver más</button>
  `;

  // 🔥 CLICK EN TARJETA (selección)
  li.addEventListener("click", () => {
    toggleSeleccion(ev);
  });

  // 🔥 CLICK EN BOTÓN (ir a detalle)
  const btnVer = li.querySelector(".btn-ver");

  btnVer.addEventListener("click", (e) => {
    e.stopPropagation(); // evita que seleccione el evento
    window.location.href = `evento.html?id=${ev.id}`;
  });

  lista.appendChild(li);
});

  renderCalendario(eventos);
});

// CALENDARIO SIMPLE
let mesActual = new Date().getMonth();
let añoActual = new Date().getFullYear();

function renderCalendario(eventos) {
  const cont = document.getElementById("calendario");
  cont.innerHTML = "";

  // HEADER (mes + botones)
  const header = document.createElement("div");
header.style.display = "flex";
header.style.justifyContent = "space-between";
header.style.alignItems = "center";
header.style.marginBottom = "10px";

// Botón anterior
const btnPrev = document.createElement("button");
btnPrev.textContent = "←";
btnPrev.classList.add("cal-btn");

// Título
const titulo = document.createElement("span");
titulo.textContent = `${meses[mesActual]} ${añoActual}`;
titulo.classList.add("cal-titulo");

// Botón siguiente
const btnNext = document.createElement("button");
btnNext.textContent = "→";
btnNext.classList.add("cal-btn");

header.appendChild(btnPrev);
header.appendChild(titulo);
header.appendChild(btnNext);

  cont.appendChild(header);

  btnPrev.onclick = () => {
    mesActual--;
    if (mesActual < 0) {
      mesActual = 11;
      añoActual--;
    }
    renderCalendario(eventos);
  };

  btnNext.onclick = () => {
    mesActual++;
    if (mesActual > 11) {
      mesActual = 0;
      añoActual++;
    }
    renderCalendario(eventos);
  };

  // GRID
  const grid = document.createElement("div");
  grid.classList.add("calendario-grid");

  const primerDia = new Date(añoActual, mesActual, 1).getDay();
  const diasMes = new Date(añoActual, mesActual + 1, 0).getDate();

  // espacios vacíos
  for (let i = 0; i < primerDia; i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= diasMes; d++) {
    const div = document.createElement("div");
    div.classList.add("dia");

    const fechaStr = `${añoActual}-${String(mesActual + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    const numero = document.createElement("div");
    numero.classList.add("numero-dia");
    numero.textContent = d;
    div.appendChild(numero);

    // 🔥 EVENTOS DEL DÍA
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
li.querySelector(".btn-ver").addEventListener("click", (e) => {
  e.stopPropagation(); // evita conflicto con selección

  window.location.href = `evento.html?id=${ev.id}`;
});