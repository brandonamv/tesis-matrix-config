import { useState } from 'react'
import './App.css'

import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Tooltip } from '@mui/material';

const validCaracthers = "0123456789+-*/()^. ";

enum ResourceIncrementType {
  NONE = 0,
  STATIC = 1,
  DYNAMIC = 2
}

function App() {
  const [resourceGain, setResourceGain] = useState<number>(1.0);
  const [resourceCost, setResourceCost] = useState<number>(2.0);
  const [initialResources, setInitialResources] = useState<number>(1);
  const [timePenalty, setTimePenalty] = useState<number>(0.2);
  const [initialFitness, setInitialFitness] = useState<number>(0.5);
  const [maxFitness, setMaxFitness] = useState<number>(2.0);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1.5);
  const [maxInteractions, setMaxInteractions] = useState<number>(100);

  const [resourceIncrementType, setResourceIncrementType] = useState<ResourceIncrementType>(ResourceIncrementType.NONE);
  const [resourceIncrementFormula, setResourceIncrementFormula] = useState<string>("0");

  const [class1Name, setClass1Name] = useState<string>("Agresivo");
  const [class2Name, setClass2Name] = useState<string>("Pasivo");
  const [class1Formula, setClass1Formula] = useState<Array<string>>(["0.5*(v-c)", "v"]);
  const [class2Formula, setClass2Formula] = useState<Array<string>>(["0", "v/2"]);
  const [class1InitialPlayers, setClass1InitialPlayers] = useState<number>(1);
  const [class2InitialPlayers, setClass2InitialPlayers] = useState<number>(10);

  const isValidFormula = (formula: string, variables: string) => {
    if (!formula) return false;
    let balance = 0;
    for (const char of formula) {
      if (!validCaracthers.includes(char) && !variables.includes(char)) return false;
      if (char === '(') balance++;
      if (char === ')') balance--;
      if (balance < 0) return false;
    }

    if (balance !== 0) return false;

    const cleanFormula = formula.replace(/\s+/g, '');
    if (cleanFormula.length === 0) return false;

    const isOperator = (c: string) => "+-*/^".includes(c);
    const isVariable = (c: string) => variables.includes(c);
    const isNumberPart = (c: string) => "0123456789.".includes(c);
    const isOperand = (c: string) => isVariable(c) || isNumberPart(c);

    for (let i = 0; i < cleanFormula.length - 1; i++) {
      const current = cleanFormula[i];
      const next = cleanFormula[i + 1];

      if (isOperator(current)) {
        if (!isOperand(next) && next !== '(') return false;
      } else if (isVariable(current)) {
        if (!isOperator(next) && next !== ')') return false;
      } else if (isNumberPart(current)) {
        if (!isNumberPart(next) && !isOperator(next) && next !== ')') return false;
      } else if (current === '(') {
        if (!isOperand(next) && next !== '(' && next !== '-') return false;
      } else if (current === ')') {
        if (!isOperator(next) && next !== ')') return false;
      }
    }

    const firstChar = cleanFormula[0];
    const lastChar = cleanFormula[cleanFormula.length - 1];

    if (isOperator(firstChar) && firstChar !== '-') return false;
    if (isOperator(lastChar) || lastChar === '(') return false;

    return true;
  };

  const isResourceGainValid = resourceGain > 0;
  const isResourceCostValid = resourceCost > 0;
  const isInitialFitnessValid = initialFitness > 0 && initialFitness < maxFitness;
  const isMaxFitnessValid = maxFitness > 0 && maxFitness > initialFitness;
  const isInitialResourcesValid = initialResources > 0;
  const isTimePenaltyValid = timePenalty >= 0;
  const isClass1InitialPlayersValid = class1InitialPlayers > 0;
  const isClass2InitialPlayersValid = class2InitialPlayers > 0;
  const isSimulationSpeedValid = simulationSpeed > 0;
  const isMaxInteractionsValid = maxInteractions > 0;

  const isClass1Formula0Valid = isValidFormula(class1Formula[0], "vc");
  const isClass1Formula1Valid = isValidFormula(class1Formula[1], "vc");
  const isClass2Formula0Valid = isValidFormula(class2Formula[0], "vc");
  const isClass2Formula1Valid = isValidFormula(class2Formula[1], "vc");

  const isResourceIncrementFormulaValid = resourceIncrementType === ResourceIncrementType.DYNAMIC ? isValidFormula(resourceIncrementFormula, "tp") : !isNaN(Number(resourceIncrementFormula));

  const handleDownload = () => {
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
0=${class1Formula[0]};${class1Formula[1]};${class1InitialPlayers};${class1Name}
1=${class2Formula[0]};${class2Formula[1]};${class2InitialPlayers};${class2Name}`;

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

  const isFormValid = isResourceGainValid && isResourceCostValid && isInitialFitnessValid &&
    isMaxFitnessValid && isInitialResourcesValid && isTimePenaltyValid && isClass1InitialPlayersValid &&
    isClass2InitialPlayersValid && isSimulationSpeedValid && isMaxInteractionsValid &&
    isClass1Formula0Valid && isClass1Formula1Valid && isClass2Formula0Valid && isClass2Formula1Valid &&
    isResourceIncrementFormulaValid;

  return (
    <Container maxWidth={"md"} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
      <Grid container rowSpacing={3} columnSpacing={4} sx={{ justifyContent: 'center' }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Valor por Recurso (V)"
            type="number"
            value={resourceGain}
            onChange={(e) => setResourceGain(Number(e.target.value))}
            error={!isResourceGainValid}
            helperText={!isResourceGainValid ? "Debe ser > 0" : ""}
            slotProps={{
              htmlInput: {
                step: 'any',
                min: 0
              }
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Costo por Recurso (C)"
            type="number"
            value={resourceCost}
            onChange={(e) => setResourceCost(Number(e.target.value))}
            error={!isResourceCostValid}
            helperText={!isResourceCostValid ? "Debe ser > 0" : ""}
            slotProps={{
              htmlInput: {
                step: 'any',
                min: 0
              }
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Tooltip title="Fitness con el que iniciaran los jugadores de ambas estrategias">
            <TextField
              label="Fitness Inicial"
              type="number"
              value={initialFitness}
              onChange={(e) => setInitialFitness(Number(e.target.value))}
              error={!isInitialFitnessValid}
              helperText={!isInitialFitnessValid ? "Debe ser > 0 y menor al Fitness Máximo" : ""}
              slotProps={{
                htmlInput: {
                  step: 'any',
                  min: 0
                }
              }}
              variant="outlined"
              fullWidth
            />
          </Tooltip>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Tooltip title="Al alcanzar este valor de fitness el jugador podra reproducirse">
            <TextField
              label="Fitness Máximo"
              type="number"
              value={maxFitness}
              onChange={(e) => setMaxFitness(Number(e.target.value))}
              error={!isMaxFitnessValid}
              helperText={!isMaxFitnessValid ? "Debe ser mayor al Fitness Inicial" : ""}
              slotProps={{
                htmlInput: {
                  step: 'any',
                  min: 0
                }
              }}
              variant="outlined"
              fullWidth
            />
          </Tooltip>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="Nombre Clase 1"
            type="text"
            value={class1Name}
            onChange={(e) => setClass1Name(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label={`Jugadores Iniciales ${class1Name}`}
            type="number"
            value={class1InitialPlayers}
            onChange={(e) => setClass1InitialPlayers(Number(e.target.value))}
            error={!isClass1InitialPlayersValid}
            helperText={!isClass1InitialPlayersValid ? "Debe ser > 0" : ""}
            slotProps={{
              htmlInput: {
                min: 1
              }
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label={`Fórmula ${class1Name} vs ${class1Name}`}
            type="text"
            value={class1Formula[0]}
            onChange={(e) => setClass1Formula([e.target.value, class1Formula[1] || ""])}
            error={!isClass1Formula0Valid}
            helperText={!isClass1Formula0Valid ? "Fórmula inválida" : ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label={`Fórmula ${class1Name} vs ${class2Name}`}
            type="text"
            value={class1Formula[1]}
            onChange={(e) => setClass1Formula([class1Formula[0] || "", e.target.value])}
            error={!isClass1Formula1Valid}
            helperText={!isClass1Formula1Valid ? "Fórmula inválida" : ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label="Nombre Clase 2"
            type="text"
            value={class2Name}
            onChange={(e) => setClass2Name(e.target.value)}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label={`Jugadores Iniciales ${class2Name}`}
            type="number"
            value={class2InitialPlayers}
            onChange={(e) => setClass2InitialPlayers(Number(e.target.value))}
            error={!isClass2InitialPlayersValid}
            helperText={!isClass2InitialPlayersValid ? "Debe ser > 0" : ""}
            slotProps={{
              htmlInput: {
                min: 1
              }
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label={`Fórmula ${class2Name} vs ${class1Name}`}
            type="text"
            value={class2Formula[0]}
            onChange={(e) => setClass2Formula([e.target.value, class2Formula[1] || ""])}
            error={!isClass2Formula0Valid}
            helperText={!isClass2Formula0Valid ? "Fórmula inválida" : ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField
            label={`Fórmula ${class2Name} vs ${class2Name}`}
            type="text"
            value={class2Formula[1]}
            onChange={(e) => setClass2Formula([class2Formula[0] || "", e.target.value])}
            error={!isClass2Formula1Valid}
            helperText={!isClass2Formula1Valid ? "Fórmula inválida" : ""}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Velocidad de Simulación"
            type="number"
            value={simulationSpeed}
            onChange={(e) => setSimulationSpeed(Number(e.target.value))}
            error={!isSimulationSpeedValid}
            helperText={!isSimulationSpeedValid ? "Debe ser > 0" : ""}
            slotProps={{
              htmlInput: {
                step: 'any',
                min: 0.1
              }
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            label="Máximo de Interacciones (T)"
            type="number"
            value={maxInteractions}
            onChange={(e) => setMaxInteractions(Number(e.target.value))}
            error={!isMaxInteractionsValid}
            helperText={!isMaxInteractionsValid ? "Debe ser >= 0" : ""}
            slotProps={{
              htmlInput: {
                step: 'any',
                min: 0
              }
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Tooltip title="Descuento de fitness a los jugadores por cada interaccion realizada en la simulación">
            <TextField
              label="Penalización por Tiempo"
              type="number"
              value={timePenalty}
              onChange={(e) => setTimePenalty(Number(e.target.value))}
              error={!isTimePenaltyValid}
              helperText={!isTimePenaltyValid ? "Debe ser >= 0" : ""}
              slotProps={{
                htmlInput: {
                  step: 'any',
                  min: 0
                }
              }}
              variant="outlined"
              fullWidth
            />
          </Tooltip>
        </Grid>
        <Grid size={{ xs: 12, sm: resourceIncrementType === ResourceIncrementType.NONE ? 6 : 4 }}>
          <TextField
            label="Recursos Iniciales"
            type="number"
            value={initialResources}
            onChange={(e) => setInitialResources(Number(e.target.value))}
            error={!isInitialResourcesValid}
            helperText={!isInitialResourcesValid ? "Debe ser > 0" : ""}
            slotProps={{
              htmlInput: {
                min: 0
              }
            }}
            variant="outlined"
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: resourceIncrementType === ResourceIncrementType.NONE ? 6 : 4 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="resource-increment-type-label">Tipo de Incremento</InputLabel>
            <Select
              labelId="resource-increment-type-label"
              id="resource-increment-type"
              value={resourceIncrementType}
              onChange={(e) => setResourceIncrementType(Number(e.target.value) as ResourceIncrementType)}
              label="Tipo de Incremento"
              fullWidth
            >
              <MenuItem value={ResourceIncrementType.NONE}>Ninguno</MenuItem>
              <MenuItem value={ResourceIncrementType.STATIC}>Estático</MenuItem>
              <MenuItem value={ResourceIncrementType.DYNAMIC}>Dinámico</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          {resourceIncrementType !== ResourceIncrementType.NONE && (
            <Tooltip title="Fórmula de crecimiento de recursos. Estático: Número, Dinámico: t = Interacciones/tiempo, p = Población Total" placement="top">
              <TextField
                label="Fórmula de Crecimiento"
                type="text"
                value={resourceIncrementFormula}
                onChange={(e) => setResourceIncrementFormula(e.target.value)}
                error={!isResourceIncrementFormulaValid}
                helperText={!isResourceIncrementFormulaValid ? "Fórmula inválida" : ""}
                slotProps={{
                  htmlInput: {
                    step: 'any',
                    min: 0.1
                  }
                }}
                variant="outlined"
                fullWidth
              />
            </Tooltip>
          )}
        </Grid>
        <Grid size={12}>
          <Tooltip title="Genera la matriz de configuración (guardar en la carpeta 'Saved' del juego)" placement="top">
            <Button
              variant="contained"
              fullWidth
              onClick={handleDownload}
              disabled={!isFormValid}
            >
              Generar Matriz
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
