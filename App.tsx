/**
 * App 3 - Centro de Acopio.
 * Recibe los residuos ya recolectados por App 2 (Logística) vía Android
 * Intent y confirma su recepción final en la planta.
 *
 * @format
 */

import { StatusBar } from 'react-native';

import DashboardScreen from './src/screens/DashboardScreen';
import { colors } from './src/theme/colors';

function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <DashboardScreen />
    </>
  );
}

export default App;
