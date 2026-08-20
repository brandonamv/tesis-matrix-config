import React from 'react';
import { Grid, TextField, Tooltip, FormControl, InputLabel, Select, MenuItem, useMediaQuery } from '@mui/material';
import { ResourceIncrementType } from '../types';
import type { MatrixConfig } from '../types';

interface GlobalSettingsSectionProps {
  config: MatrixConfig;
  onChange: <K extends keyof MatrixConfig>(key: K, value: MatrixConfig[K]) => void;
  validations: {
    isResourceGainValid: boolean;
    isResourceCostValid: boolean;
    isInitialFitnessValid: boolean;
    isMaxFitnessValid: boolean;
    isSimulationSpeedValid: boolean;
    isMaxInteractionsValid: boolean;
    isTimePenaltyValid: boolean;
    isInitialResourcesValid: boolean;
    isResourceIncrementFormulaValid: boolean;
  };
}

export const GlobalSettingsSection: React.FC<GlobalSettingsSectionProps> = ({ config, onChange, validations }) => {
  const isCompact = useMediaQuery('(max-width:1400px)');
  const inputSize = isCompact ? "small" : "medium";

  return (
    <>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Valor por Recurso (V)"
          type="number"
          value={config.resourceGain}
          onChange={(e) => onChange('resourceGain', Number(e.target.value))}
          error={!validations.isResourceGainValid}
          helperText={!validations.isResourceGainValid ? "Debe ser > 0" : ""}
          slotProps={{ htmlInput: { step: 'any', min: 0 } }}
          variant="outlined"
          fullWidth
          size={inputSize}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          label="Costo por Recurso (C)"
          type="number"
          value={config.resourceCost}
          onChange={(e) => onChange('resourceCost', Number(e.target.value))}
          error={!validations.isResourceCostValid}
          helperText={!validations.isResourceCostValid ? "Debe ser > 0" : ""}
          slotProps={{ htmlInput: { step: 'any', min: 0 } }}
          variant="outlined"
          fullWidth
          size={inputSize}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Tooltip title="Fitness con el que iniciaran los jugadores de ambas estrategias">
          <TextField
            label="Fitness Inicial"
            type="number"
            value={config.initialFitness}
            onChange={(e) => onChange('initialFitness', Number(e.target.value))}
            error={!validations.isInitialFitnessValid}
            helperText={!validations.isInitialFitnessValid ? "Debe ser > 0 y menor al Fitness Máximo" : ""}
            slotProps={{ htmlInput: { step: 'any', min: 0 } }}
            variant="outlined"
            fullWidth
            size={inputSize}
          />
        </Tooltip>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <Tooltip title="Al alcanzar este valor de fitness el jugador podra reproducirse">
          <TextField
            label="Fitness Máximo"
            type="number"
            value={config.maxFitness}
            onChange={(e) => onChange('maxFitness', Number(e.target.value))}
            error={!validations.isMaxFitnessValid}
            helperText={!validations.isMaxFitnessValid ? "Debe ser mayor al Fitness Inicial" : ""}
            slotProps={{ htmlInput: { step: 'any', min: 0 } }}
            variant="outlined"
            fullWidth
            size={inputSize}
          />
        </Tooltip>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Velocidad de Simulación"
          type="number"
          value={config.simulationSpeed}
          onChange={(e) => onChange('simulationSpeed', Number(e.target.value))}
          error={!validations.isSimulationSpeedValid}
          helperText={!validations.isSimulationSpeedValid ? "Debe ser > 0" : ""}
          slotProps={{ htmlInput: { step: 'any', min: 0.1 } }}
          variant="outlined"
          fullWidth
          size={inputSize}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField
          label="Máximo de Interacciones (T)"
          type="number"
          value={config.maxInteractions}
          onChange={(e) => onChange('maxInteractions', Number(e.target.value))}
          error={!validations.isMaxInteractionsValid}
          helperText={!validations.isMaxInteractionsValid ? "Debe ser >= 0" : ""}
          slotProps={{ htmlInput: { step: 'any', min: 0 } }}
          variant="outlined"
          fullWidth
          size={inputSize}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Tooltip title="Descuento de fitness a los jugadores por cada interaccion realizada en la simulación">
          <TextField
            label="Penalización por Tiempo"
            type="number"
            value={config.timePenalty}
            onChange={(e) => onChange('timePenalty', Number(e.target.value))}
            error={!validations.isTimePenaltyValid}
            helperText={!validations.isTimePenaltyValid ? "Debe ser >= 0" : ""}
            slotProps={{ htmlInput: { step: 'any', min: 0 } }}
            variant="outlined"
            fullWidth
            size={inputSize}
          />
        </Tooltip>
      </Grid>
      <Grid size={{ xs: 12, sm: config.resourceIncrementType === ResourceIncrementType.NONE ? 6 : 4 }}>
        <TextField
          label="Recursos Iniciales"
          type="number"
          value={config.initialResources}
          onChange={(e) => onChange('initialResources', Number(e.target.value))}
          error={!validations.isInitialResourcesValid}
          helperText={!validations.isInitialResourcesValid ? "Debe ser > 0" : ""}
          slotProps={{ htmlInput: { min: 0 } }}
          variant="outlined"
          fullWidth
          size={inputSize}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: config.resourceIncrementType === ResourceIncrementType.NONE ? 6 : 4 }}>
        <FormControl fullWidth variant="outlined" size={inputSize}>
          <InputLabel id="resource-increment-type-label">Tipo de Incremento</InputLabel>
          <Select
            labelId="resource-increment-type-label"
            id="resource-increment-type"
            value={config.resourceIncrementType}
            onChange={(e) => onChange('resourceIncrementType', Number(e.target.value) as ResourceIncrementType)}
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
        {config.resourceIncrementType !== ResourceIncrementType.NONE && (
          <Tooltip title="Fórmula de crecimiento de recursos. Estático: Número, Dinámico: t = Interacciones/tiempo, p = Población Total" placement="top">
            <TextField
              label="Fórmula de Crecimiento"
              type="text"
              value={config.resourceIncrementFormula}
              onChange={(e) => onChange('resourceIncrementFormula', e.target.value)}
              error={!validations.isResourceIncrementFormulaValid}
              helperText={!validations.isResourceIncrementFormulaValid ? "Fórmula inválida" : ""}
              slotProps={{ htmlInput: { step: 'any', min: 0.1 } }}
              variant="outlined"
              fullWidth
              size={inputSize}
            />
          </Tooltip>
        )}
      </Grid>
    </>
  );
};
