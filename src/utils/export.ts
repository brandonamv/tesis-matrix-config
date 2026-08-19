import type { MatrixConfig } from '../types';

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
    class2
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

  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'matrix.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); // Free up memory
};
