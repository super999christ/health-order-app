import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { getProductCatalog } from './apis/products';
import { submitOrder } from './apis/orders';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    getProductCatalog(178804).then(res => console.log({ res }));
    submitOrder({
      facilityCode: 'string',
      department: 'string',
      patientRoom: 'string',
      bed: 'string',
      orderCreatorFirstName: 'string',
      orderCreatorLastName: 'string',
      orderCreatorPhoneNumber: 'string',
      orderType: 'string',
      orderID: 'string',
      patientID: 'string',
      patientFirstName: 'string',
      patientLastName: 'string',
      requestedItem: 'string',
      specialInstructions: 'string',
      facility: 'string',
      orderStatus: 'string',
      admissionDateTime: '2024-01-29T06:21:53.354Z'
    }).then(res => console.log({ res }));
  }, []);

  return (
    <>
      <div className="flex justify-center">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
