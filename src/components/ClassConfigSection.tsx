import React from 'react';
import { Grid, TextField } from '@mui/material';
import type { ClassConfig } from '../types';

interface ClassConfigSectionProps {
  config: ClassConfig;
  otherClassName: string;
  onChange: <K extends keyof ClassConfig>(key: K, value: ClassConfig[K]) => void;
  validations: {
    isInitialPlayersValid: boolean;
    isFormula0Valid: boolean;
    isFormula1Valid: boolean;
  };
}

export const ClassConfigSection: React.FC<ClassConfigSectionProps> = ({ config, otherClassName, onChange, validations }) => {
  return (
    <>
      <Grid size={{ xs: 6, sm: 3 }}>
        <TextField
          label={`Nombre Clase`}
          type="text"
          value={config.name}
          onChange={(e) => onChange('name', e.target.value)}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <TextField
          label={`Jugadores Iniciales ${config.name}`}
          type="number"
          value={config.initialPlayers}
          onChange={(e) => onChange('initialPlayers', Number(e.target.value))}
          error={!validations.isInitialPlayersValid}
          helperText={!validations.isInitialPlayersValid ? "Debe ser > 0" : ""}
          slotProps={{ htmlInput: { min: 1 } }}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <TextField
          label={`Fórmula ${config.name} vs ${config.name}`}
          type="text"
          value={config.formulas[0]}
          onChange={(e) => onChange('formulas', [e.target.value, config.formulas[1]])}
          error={!validations.isFormula0Valid}
          helperText={!validations.isFormula0Valid ? "Fórmula inválida" : ""}
          variant="outlined"
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
        <TextField
          label={`Fórmula ${config.name} vs ${otherClassName}`}
          type="text"
          value={config.formulas[1]}
          onChange={(e) => onChange('formulas', [config.formulas[0], e.target.value])}
          error={!validations.isFormula1Valid}
          helperText={!validations.isFormula1Valid ? "Fórmula inválida" : ""}
          variant="outlined"
          fullWidth
        />
      </Grid>
    </>
  );
};
