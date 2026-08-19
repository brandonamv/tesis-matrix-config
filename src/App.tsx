import './App.css';
import { Button, Container, Grid, Tooltip } from '@mui/material';
import { useMatrixForm } from './hooks/useMatrixForm';
import { GlobalSettingsSection } from './components/GlobalSettingsSection';
import { ClassConfigSection } from './components/ClassConfigSection';
import { generateMatrixFile } from './utils/export';

function App() {
  const { config, updateConfig, updateClass1, updateClass2, validations } = useMatrixForm();

  return (
    <Container maxWidth={"md"} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 2 }}>
      <Grid container rowSpacing={3} columnSpacing={4} sx={{ justifyContent: 'center' }}>

        <ClassConfigSection
          config={config.class1}
          otherClassName={config.class2.name}
          onChange={updateClass1}
          validations={{
            isInitialPlayersValid: validations.isClass1InitialPlayersValid,
            isFormula0Valid: validations.isClass1Formula0Valid,
            isFormula1Valid: validations.isClass1Formula1Valid,
          }}
        />

        <ClassConfigSection
          config={config.class2}
          otherClassName={config.class1.name}
          onChange={updateClass2}
          validations={{
            isInitialPlayersValid: validations.isClass2InitialPlayersValid,
            isFormula0Valid: validations.isClass2Formula0Valid,
            isFormula1Valid: validations.isClass2Formula1Valid,
          }}
        />

        <GlobalSettingsSection
          config={config}
          onChange={updateConfig}
          validations={validations}
        />

        <Grid size={12}>
          <Tooltip title="Genera la matriz de configuración (guardar en la carpeta 'Saved' del juego)" placement="top">
            <Button
              variant="contained"
              fullWidth
              onClick={() => generateMatrixFile(config)}
              disabled={!validations.isFormValid}
            >
              Generar Matriz
            </Button>
          </Tooltip>
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
