import type { MatrixConfig } from "../types";

export const generateMatrixFile = (config: MatrixConfig) => {
  const {
    resourceGain,
    resourceCost,
    timePenalty,
    initialFitness,
    initialResources,
    maxFitness,
    simulationSpeed,
    maxInteractions,
    resourceIncrementType,
    resourceIncrementFormula,
    class1,
    class2,
  } = config;

  const fileContent = `v=${resourceGain}
c=${resourceCost}
m=${timePenalty}
i=${initialFitness}
r=${initialResources}
u=${maxFitness}
s=${simulationSpeed}
p=${maxInteractions}
t=${resourceIncrementType}
f=${resourceIncrementFormula}
0=${class1.formulas[0]};${class1.formulas[1]};${class1.initialPlayers};${class1.name}
1=${class2.formulas[0]};${class2.formulas[1]};${class2.initialPlayers};${class2.name}`;

  const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "matrix.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Free up memory
};

export const saveMatrixFile = async (config: MatrixConfig) => {
  const { class1, class2, ...rest } = config;

  const matrix = {
    class1: {
      name: class1.name,
      initialPlayers: class1.initialPlayers,
      formulas: class1.formulas,
    },
    class2: {
      name: class2.name,
      initialPlayers: class2.initialPlayers,
      formulas: class2.formulas,
    },
    ...rest,
  };

  const jsonString = JSON.stringify(matrix, null, 2);

  try {
    await fetch("/api/save-matrix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonString,
    });
    window.alert("Matriz guardada exitosamente");
  } catch (err) {
    window.alert("Error al guardar la matriz");
    console.warn("Could not save to local dev server file", err);
  }
};

export const readMatrixFile = async () => {
  try {
    const response = await fetch("/api/read-matrix");
    const data = await response.json();

    return data;
  } catch (err) {
    console.warn("Could not read from local dev server file", err);
    return null;
  }
};
