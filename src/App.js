import { BrowserRouter } from 'react-router-dom'
import Main from './components/Main'
import { StateProvider } from './StateProvider';

function App() {
  return (
    <BrowserRouter>
      <StateProvider>
        <Main />
      </StateProvider>
    </BrowserRouter>
  );
}

export default App;
