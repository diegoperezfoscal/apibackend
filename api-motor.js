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

function randBetweenInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Función para generar valores similares cuando solo hay un valor de referencia
function fluctuateAround(baseValue, percentage = 0.05) {
  const variation = baseValue * percentage;
  return parseFloat((baseValue + randBetween(-variation, variation)).toFixed(2));
}

function generateGeneratorData() {
  return {
    timestamp: new Date().toISOString(),
    
    // Parámetros principales del generador
    generator_power_factor: randBetween(0.9, 1.0),
    generator_frequency: fluctuateAround(59.900, 0.01),
    generator_voltage_average_value_ff: fluctuateAround(467, 0.02),
    speed: randBetweenInt(1700, 1820),
    general_warning: "OK",
    
    // Temperaturas de devanados del generador
    generator_winding_temperature: {
      l1: fluctuateAround(71.5, 0.05),
      l2: fluctuateAround(72.0, 0.05),
      l3: fluctuateAround(73.0, 0.05)
    },
    
    // Temperaturas de rodamientos
    generator_bearing_temperature: {
      drive_end_de: fluctuateAround(44.5, 0.1),
      non_drive_end_nde: fluctuateAround(33.5, 0.1)
    },
    
    // Voltajes línea-neutro
    generator_voltage_ln: {
      l1_n: fluctuateAround(270, 0.02),
      l2_n: fluctuateAround(270, 0.02),
      l3_n: fluctuateAround(270, 0.02)
    },
    
    // Voltajes línea-línea
    generator_voltage_ll: {
      l1_l2: fluctuateAround(468, 0.02),
      l2_l3: fluctuateAround(466, 0.02),
      l3_l1: fluctuateAround(468, 0.02)
    },
    
    // Corrientes por línea
    generator_current: {
      l1: fluctuateAround(1388, 0.03),
      l2: fluctuateAround(1457, 0.03),
      l3: randBetweenInt(1370, 1420)
    },
    
    // Potencias del generador
    generator_power: randBetweenInt(1020, 1150),
    generator_reactive_power: randBetweenInt(1, 10),
    generator_apparent_power: randBetweenInt(1020, 1150),
    
    // Parámetros del motor
    engine: {
      oil_temperature: fluctuateAround(77.5, 0.05),
      oil_pressure: fluctuateAround(45, 0.1),
      boost_pressure_actual_value: fluctuateAround(27.5, 0.1)
    },
    
    // Temperaturas de cilindros (20 cilindros)
    cylinder_temperatures: {
      cylinder_1: randBetweenInt(510, 540),
      cylinder_2: randBetweenInt(510, 540),
      cylinder_3: randBetweenInt(510, 540),
      cylinder_4: randBetweenInt(510, 540),
      cylinder_5: randBetweenInt(510, 540),
      cylinder_6: randBetweenInt(510, 540),
      cylinder_7: randBetweenInt(510, 540),
      cylinder_8: randBetweenInt(510, 540),
      cylinder_9: randBetweenInt(510, 540),
      cylinder_10: randBetweenInt(510, 540),
      cylinder_11: randBetweenInt(510, 540),
      cylinder_12: randBetweenInt(510, 540),
      cylinder_13: randBetweenInt(510, 540),
      cylinder_14: randBetweenInt(510, 540),
      cylinder_15: randBetweenInt(510, 540),
      cylinder_16: randBetweenInt(510, 540),
      cylinder_17: randBetweenInt(510, 540),
      cylinder_18: randBetweenInt(510, 540),
      cylinder_19: randBetweenInt(510, 540),
      cylinder_20: randBetweenInt(510, 540)
    },
    
    // Frecuencias de cilindros (20 cilindros)
    cylinder_frequencies: {
      cylinder_1: randBetweenInt(10, 30),
      cylinder_2: randBetweenInt(10, 30),
      cylinder_3: randBetweenInt(10, 30),
      cylinder_4: randBetweenInt(10, 30),
      cylinder_5: randBetweenInt(10, 30),
      cylinder_6: randBetweenInt(10, 30),
      cylinder_7: randBetweenInt(10, 30),
      cylinder_8: randBetweenInt(10, 30),
      cylinder_9: randBetweenInt(10, 30),
      cylinder_10: randBetweenInt(10, 30),
      cylinder_11: randBetweenInt(10, 30),
      cylinder_12: randBetweenInt(10, 30),
      cylinder_13: randBetweenInt(10, 30),
      cylinder_14: randBetweenInt(10, 30),
      cylinder_15: randBetweenInt(10, 30),
      cylinder_16: randBetweenInt(10, 30),
      cylinder_17: randBetweenInt(10, 30),
      cylinder_18: randBetweenInt(10, 30),
      cylinder_19: randBetweenInt(10, 30),
      cylinder_20: randBetweenInt(10, 30)
    }
  };
}

let generatorData = generateGeneratorData();

// Actualiza cada 1 minuto
setInterval(() => {
  generatorData = generateGeneratorData();
  console.log('Datos del generador actualizados:', new Date().toISOString());
}, 60 * 1000);

// Rutas
app.get('/api/generator', (req, res) => {
  res.json(generatorData);
});

// Ruta para obtener solo datos básicos del generador
app.get('/api/generator/basic', (req, res) => {
  const basicData = {
    timestamp: generatorData.timestamp,
    power_factor: generatorData.generator_power_factor,
    frequency: generatorData.generator_frequency,
    voltage: generatorData.generator_voltage_average_value_ff,
    speed: generatorData.speed,
    power: generatorData.generator_power,
    status: generatorData.general_warning
  };
  res.json(basicData);
});

// Ruta para obtener temperaturas de cilindros
app.get('/api/generator/cylinders', (req, res) => {
  const cylinderData = {
    timestamp: generatorData.timestamp,
    temperatures: generatorData.cylinder_temperatures,
    frequencies: generatorData.cylinder_frequencies
  };
  res.json(cylinderData);
});

// Ruta para obtener datos eléctricos
app.get('/api/generator/electrical', (req, res) => {
  const electricalData = {
    timestamp: generatorData.timestamp,
    voltages_ln: generatorData.generator_voltage_ln,
    voltages_ll: generatorData.generator_voltage_ll,
    currents: generatorData.generator_current,
    power: generatorData.generator_power,
    reactive_power: generatorData.generator_reactive_power,
    apparent_power: generatorData.generator_apparent_power,
    power_factor: generatorData.generator_power_factor
  };
  res.json(electricalData);
});

app.get('/api/actualizar', (req, res) => {
  generatorData = generateGeneratorData();
  res.json({ 
    mensaje: 'Datos del generador actualizados manualmente', 
    timestamp: generatorData.timestamp 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor del generador corriendo en http://localhost:${PORT}/api/generator`);
});