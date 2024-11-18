// PharmacyContext.js
import React, { createContext, useState, useContext } from 'react';

// Crear el contexto
export const PharmacyContext = createContext();

// Proveedor del contexto
export const PharmacyProvider = ({ children }) => {
  const [pharmacies, setPharmacies] = useState([]);

  return (
    <PharmacyContext.Provider value={{ pharmacies, setPharmacies }}>
      {children}
    </PharmacyContext.Provider>
  );
};

// Hook para acceder al contexto
export const usePharmacy = () => useContext(PharmacyContext);
