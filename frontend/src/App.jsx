import './App.css';
import { Authentication } from './context/Authentication';
import { GlobalProvider } from './context/GlobalContext';
import AppRoutes from './routes/Approutes';

function App() {

  return (
    <>
      <Authentication>
        <GlobalProvider>
          <AppRoutes/>
        </GlobalProvider>
      </Authentication>'
    </>
  );
}

export default App;
