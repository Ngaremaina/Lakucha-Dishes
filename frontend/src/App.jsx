import './App.css';
import { ToastProvider } from './components/ui/Toast';
import AppRoutes from './routes/Approutes';

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;
