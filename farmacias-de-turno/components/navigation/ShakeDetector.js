import React, { useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export default function ShakeDetector({ onShake }) {
  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalForce = Math.sqrt(x * x + y * y + z * z);
      if (totalForce > 1.78) {
        // Umbral para detectar la agitación
        onShake();
      }
    });

    Accelerometer.setUpdateInterval(100); // Intervalo de actualización en milisegundos

    return () => subscription && subscription.remove();
  }, [onShake]);

  return null;
}
