const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Funciones auxiliares
function randBetween(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function generateMotorData() {
  const rpm = randBetween(1050, 1400);
  const carga = randBetween(30, 90);
  const velocidad = Math.round((rpm - 1000) * 0.1 + randBetween(5, 15)); // proporcional al RPM
  const relacionTransmision = carga > 70 ? "4ta" : (carga > 50 ? "3ra" : "2da");

  return {
    timestamp: new Date().toISOString(),
    motor: {
      rpm,
      temperaturaAgua: randBetween(88, 96),              // 88–96 °C
      temperaturaAceite: randBetween(95, 110),           // 95–110 °C
      presionAceite: randBetween(2.2, 3.5),              // 2.2–3.5 bar
      voltajeBateria: randBetween(12.5, 13),             // 12.5–13 V
      consumoCombustibleLh: parseFloat((carga / 100 * randBetween(18, 25)).toFixed(2)), // proporcional a la carga
      cargaMotor: carga,
      tiempoEncendidoMin: randBetween(1, 120),           // 1–120 min
      velocidadVehiculo: velocidad,
      relacionTransmision,
      modoOperacion: carga > 70 ? "Carga" : (carga < 40 ? "Ralentí" : "Crucero")
    },
    bancos: {
      A1: {
        lambda: randBetween(0.98, 1.03),                  // Mezcla aire-comb.
        tiempoInyeccionMs: randBetween(2, 3),             // 2–3 ms
        tiempoEncendidoAvance: randBetween(8, 12),        // 8–12°
        temperaturaEGT: randBetween(480, 620),            // 480–620 °C
        presionCombustible: randBetween(3.5, 4.5),        // 3.5–4.5 bar
        presionTurbo: randBetween(1.0, 1.4)               // 1.0–1.4 bar
      },
      B1: {
        lambda: randBetween(0.98, 1.03),
        tiempoInyeccionMs: randBetween(2, 3),
        tiempoEncendidoAvance: randBetween(8, 12),
        temperaturaEGT: randBetween(480, 620),
        presionCombustible: randBetween(3.5, 4.5),
        presionTurbo: randBetween(1.0, 1.4)
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
