const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Función para generar datos simulados
function generateMotorData() {
  const timestamp = new Date().toISOString();
  
  return {
    timestamp,
    motor: {
      rpm: Math.floor(Math.random() * 5000 + 800), // 800–5800 RPM
      temperaturaAgua: parseFloat((Math.random() * 40 + 70).toFixed(2)), // 70–110°C
      temperaturaAceite: parseFloat((Math.random() * 40 + 80).toFixed(2)), // 80–120°C
      presionAceite: parseFloat((Math.random() * 4 + 1).toFixed(2)), // 1–5 bar
      voltajeBateria: parseFloat((Math.random() * 2 + 12).toFixed(2)), // 12–14V
      consumoCombustibleLh: parseFloat((Math.random() * 10 + 5).toFixed(2)), // 5–15 L/h
      cargaMotor: parseFloat((Math.random() * 100).toFixed(2)), // 0–100%
      tiempoEncendidoMin: parseFloat((Math.random() * 60).toFixed(2)), // 0–60 minutos
      velocidadVehiculo: parseFloat((Math.random() * 150).toFixed(2)), // 0–150 km/h
      relacionTransmision: ["1ra", "2da", "3ra", "4ta", "5ta", "6ta", "N", "R"][Math.floor(Math.random() * 8)],
      modoOperacion: ["Ralentí", "Crucero", "Aceleración", "Freno motor", "Carga"][Math.floor(Math.random() * 5)]
    },
    bancos: {
      A1: {
        lambda: parseFloat((Math.random() * 0.2 + 0.9).toFixed(2)), // 0.9–1.1
        tiempoInyeccionMs: parseFloat((Math.random() * 3 + 1).toFixed(2)), // 1–4 ms
        tiempoEncendidoAvance: parseFloat((Math.random() * 20).toFixed(2)), // 0–20°
        temperaturaEGT: parseFloat((Math.random() * 400 + 400).toFixed(2)), // 400–800°C
        presionCombustible: parseFloat((Math.random() * 2 + 2).toFixed(2)), // 2–4 bar
        presionTurbo: parseFloat((Math.random() * 1 + 0.5).toFixed(2)) // 0.5–1.5 bar
      },
      B1: {
        lambda: parseFloat((Math.random() * 0.2 + 0.9).toFixed(2)),
        tiempoInyeccionMs: parseFloat((Math.random() * 3 + 1).toFixed(2)),
        tiempoEncendidoAvance: parseFloat((Math.random() * 20).toFixed(2)),
        temperaturaEGT: parseFloat((Math.random() * 400 + 400).toFixed(2)),
        presionCombustible: parseFloat((Math.random() * 2 + 2).toFixed(2)),
        presionTurbo: parseFloat((Math.random() * 1 + 0.5).toFixed(2))
      }
    }
  };
}

let motorData = generateMotorData();

// Actualiza cada 1 minuto
setInterval(() => {
  motorData = generateMotorData();
  console.log('Datos actualizados:', new Date().toISOString());
}, 60 * 1000);

// Rutas
app.get('/api/motor', (req, res) => {
  res.json(motorData);
});

app.get('/api/actualizar', (req, res) => {
  motorData = generateMotorData();
  res.json({ mensaje: 'Datos actualizados manualmente', timestamp: motorData.timestamp });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/api/motor`);
});
