import './App.css';
import { Authentication } from './context/Authentication';
import { GlobalProvider } from './context/GlobalContext';
import AppRoutes from './routes/Approutes';
import { Analytics } from "@vercel/analytics/next"

function App() {

  return (
    <>
      <Analytics/>
      <Authentication>
        <GlobalProvider>
          <AppRoutes/>
        </GlobalProvider>
      </Authentication>
    </>
  );
}

export default App;
