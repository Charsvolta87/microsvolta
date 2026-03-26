import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyC-hMSencH40g6ojgPSqosj69Ixkkraf7w",
  authDomain: "microsvolta.firebaseapp.com",
  projectId: "microsvolta",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔥 OBTENER ID DESDE URL
const params = new URLSearchParams(window.location.search);
const idEvento = params.get("id");

const eventoRef = ref(db, "eventos/" + idEvento);
const pasajerosRef = ref(db, `eventos/${idEvento}/pasajeros`);

// ELEMENTOS
const titulo = document.getElementById("titulo");
const info = document.getElementById("info");
const lista = document.getElementById("listaPasajeros");

// MOSTRAR EVENTO
onValue(eventoRef, (snap) => {
  const ev = snap.val();
  if (!ev) return;

  titulo.textContent = ev.nombre;
  info.textContent = `📍 ${ev.lugar} | 📅 ${ev.fecha} | 💰 $${ev.precio}`;
});

// AGREGAR PASAJERO
document.getElementById("btnPasajero").addEventListener("click", () => {
  const nombre = document.getElementById("pNombre").value;
  const dni = document.getElementById("pDni").value;
  const subida = document.getElementById("pSubida").value;
  const telefono = document.getElementById("pTelefono").value;

  if (!nombre || !dni || !subida|| !telefono) {
    alert("Completa todo");
    return;
  }

  push(pasajerosRef, {
    nombre,
    dni,
    subida,
    telefono
  });

  // reset
  document.getElementById("pNombre").value = "";
  document.getElementById("pDni").value = "";
  document.getElementById("pSubida").value = "";
  document.getElementById("pTelefono").value = "";
  
});

// LISTAR PASAJEROS
onValue(pasajerosRef, (snap) => {
  const data = snap.val();
  lista.innerHTML = "";

  if (!data) return;

  Object.values(data).forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.nombre} - DNI: ${p.dni} - 📍 ${p.subida}- Teléfono: ${p.telefono}`;
    lista.appendChild(li);
  });
});