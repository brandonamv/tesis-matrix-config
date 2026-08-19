import { useState } from 'react';
import { ResourceIncrementType } from '../types';
import type { MatrixConfig } from '../types';
import { isValidFormula } from '../utils/validation';

export const useMatrixForm = () => {
  const [config, setConfig] = useState<MatrixConfig>({
    resourceGain: 1.0,
    resourceCost: 2.0,
    initialResources: 1,
    timePenalty: 0.2,
    initialFitness: 0.5,
    maxFitness: 2.0,
    simulationSpeed: 1.5,
    maxInteractions: 100,
    resourceIncrementType: ResourceIncrementType.NONE,
    resourceIncrementFormula: "0",
    class1: {
      name: "Agresivo",
      initialPlayers: 1,
      formulas: ["0.5*(v-c)", "v"]
    },
    class2: {
      name: "Pasivo",
      initialPlayers: 10,
      formulas: ["0", "v/2"]
    }
  });

  // --- FUNCIONES DE ACTUALIZACIÓN DE ESTADO ---
  // Estas funciones utilizan una característica de TypeScript llamada "Genéricos" (<K extends keyof...>).
  // Esto simplemente le dice a TypeScript: "Asegúrate de que 'key' sea el nombre exacto de una 
  // propiedad que existe en MatrixConfig, y que 'value' sea del tipo correcto para esa propiedad".
  // Por ejemplo, si intentas actualizar 'resourceGain' con la palabra "hola", TypeScript dará error porque espera un número.

  const updateConfig = <K extends keyof MatrixConfig>(key: K, value: MatrixConfig[K]) => {
    // Usamos el operador "spread" (...) para hacer una copia de toda la configuración anterior (prev)
    // y solo sobrescribimos la propiedad específica ([key]) con el nuevo valor.
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Como class1 y class2 son objetos dentro del objeto principal (config), necesitamos hacer
  // una doble copia para no borrar las otras propiedades de la clase (como 'name' o 'initialPlayers').
  const updateClass1 = <K extends keyof MatrixConfig['class1']>(key: K, value: MatrixConfig['class1'][K]) => {
    setConfig(prev => ({ ...prev, class1: { ...prev.class1, [key]: value } }));
  };

  const updateClass2 = <K extends keyof MatrixConfig['class2']>(key: K, value: MatrixConfig['class2'][K]) => {
    setConfig(prev => ({ ...prev, class2: { ...prev.class2, [key]: value } }));
  };

  const isResourceGainValid = config.resourceGain >= 0;
  const isResourceCostValid = config.resourceCost >= 0;
  const isInitialFitnessValid = config.initialFitness >= 0 && config.initialFitness < config.maxFitness;
  const isMaxFitnessValid = config.maxFitness > 0 && config.maxFitness > config.initialFitness;
  const isInitialResourcesValid = config.initialResources >= 0;
  const isTimePenaltyValid = config.timePenalty >= 0;
  const isSimulationSpeedValid = config.simulationSpeed > 0;
  const isMaxInteractionsValid = config.maxInteractions > 0;

  const isClass1InitialPlayersValid = config.class1.initialPlayers > 0;
  const isClass2InitialPlayersValid = config.class2.initialPlayers > 0;

  const formulaValues = {
    v: config.resourceGain,
    c: config.resourceCost,
    t: 1, // La interacción inicia en 1
    p: config.class1.initialPlayers + config.class2.initialPlayers
  };

  const isClass1Formula0Valid = isValidFormula(config.class1.formulas[0], "vc", formulaValues);
  const isClass1Formula1Valid = isValidFormula(config.class1.formulas[1], "vc", formulaValues);
  const isClass2Formula0Valid = isValidFormula(config.class2.formulas[0], "vc", formulaValues);
  const isClass2Formula1Valid = isValidFormula(config.class2.formulas[1], "vc", formulaValues);

  const isResourceIncrementFormulaValid = config.resourceIncrementType === ResourceIncrementType.DYNAMIC
    ? isValidFormula(config.resourceIncrementFormula, "tp", formulaValues)
    : !isNaN(Number(config.resourceIncrementFormula));

  const isFormValid = isResourceGainValid && isResourceCostValid && isInitialFitnessValid &&
    isMaxFitnessValid && isInitialResourcesValid && isTimePenaltyValid && isClass1InitialPlayersValid &&
    isClass2InitialPlayersValid && isSimulationSpeedValid && isMaxInteractionsValid &&
    isClass1Formula0Valid && isClass1Formula1Valid && isClass2Formula0Valid && isClass2Formula1Valid &&
    isResourceIncrementFormulaValid;

  return {
    config,
    updateConfig,
    updateClass1,
    updateClass2,
    validations: {
      isResourceGainValid,
      isResourceCostValid,
      isInitialFitnessValid,
      isMaxFitnessValid,
      isInitialResourcesValid,
      isTimePenaltyValid,
      isSimulationSpeedValid,
      isMaxInteractionsValid,
      isClass1InitialPlayersValid,
      isClass2InitialPlayersValid,
      isClass1Formula0Valid,
      isClass1Formula1Valid,
      isClass2Formula0Valid,
      isClass2Formula1Valid,
      isResourceIncrementFormulaValid,
      isFormValid
    }
  };
};
