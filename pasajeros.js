import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC-hMSencH40g6ojgPSqosj69Ixkkraf7w",
  authDomain: "microsvolta.firebaseapp.com",
  projectId: "microsvolta",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const lista = document.getElementById("listaGlobal");
const buscador = document.getElementById("buscadorGlobal");

let pasajerosGlobal = [];

// 🔥 TRAER TODOS LOS EVENTOS
onValue(ref(db, "eventos"), (snapshot) => {
  const data = snapshot.val();
  if (!data) return;

  pasajerosGlobal = [];

  Object.entries(data).forEach(([idEvento, ev]) => {
    if (!ev.pasajeros) return;

    Object.values(ev.pasajeros).forEach(p => {
      pasajerosGlobal.push({
        ...p,
        evento: ev.nombre
      });
    });
  });

  render(pasajerosGlobal);
});

// RENDER
function render(listaDatos) {
  lista.innerHTML = "";

  listaDatos.forEach(p => {
    let tipoViaje = "";

    if (p.viaje === "ida_vuelta") tipoViaje = "🟢 Ida y Vuelta";
    if (p.viaje === "ida") tipoViaje = "🔵 Ida";
    if (p.viaje === "vuelta") tipoViaje = "🟡 Vuelta";

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.nombre}</strong><br>
      DNI: ${p.dni}<br>
      📞 ${p.telefono}<br>
      📍 ${p.subida}<br>
      🎟️ ${p.evento}<br>
      ${tipoViaje}
    `;

    lista.appendChild(li);
  });
}

// 🔍 BUSCADOR GLOBAL
buscador.addEventListener("input", (e) => {
  const texto = e.target.value.toLowerCase();

  const filtrados = pasajerosGlobal.filter(p => {
    return (
      String(p.nombre).toLowerCase().includes(texto) ||
      String(p.dni).toLowerCase().includes(texto) ||
      String(p.telefono).toLowerCase().includes(texto) ||
      String(p.subida).toLowerCase().includes(texto) ||
      String(p.evento).toLowerCase().includes(texto) ||
      String(p.viaje).toLowerCase().includes(texto)
    );
  });

  render(filtrados);
});