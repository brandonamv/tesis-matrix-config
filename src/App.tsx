import './App.css';
import { Box, Button, Container, Grid, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useMatrixForm } from './hooks/useMatrixForm';
import { GlobalSettingsSection } from './components/GlobalSettingsSection';
import { ClassConfigSection } from './components/ClassConfigSection';
import { generateMatrixFile } from './utils/export';

function App() {
  const { config, updateConfig, updateClass1, updateClass2, validations } = useMatrixForm();
  const isCompact = useMediaQuery('(max-width:1400px)');

  return (
    <Container maxWidth={"md"} disableGutters>
      <Box sx={{ width: '100%', textAlign: 'center', color: 'rgba(0, 27, 57, 1)', marginBottom: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
          TACTIC INVASORS
        </Typography>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Configuración de Simulación
        </Typography>
      </Box>
      <Container maxWidth={"md"}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 4,
          paddingBottom: 3,
          paddingX: 2,
          backgroundColor: 'rgba(0, 61, 38, 1)',
          borderRadius: 3,
        }}>
        <Grid container rowSpacing={isCompact ? 2 : 3} columnSpacing={4} sx={{ justifyContent: 'center' }}>

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

          <Grid size={12} sx={{ justifyContent: 'center', display: 'flex' }}>
            <Tooltip title="Genera la matriz de configuración (guardar en la carpeta 'Saved' del juego)" placement="top">
              <Button
                variant="contained"
                size={isCompact ? "small" : "medium"}
                onClick={() => generateMatrixFile(config)}
                disabled={!validations.isFormValid}
              >
                Generar Matriz
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}

export default App;
