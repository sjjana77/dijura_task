import Router from "./routes/Router";
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <Router />
      {/* <div className="App">
      <Transactions />
      <TransactionForm />
    </div> */}
    </Provider>
  );
}

export default App; 
