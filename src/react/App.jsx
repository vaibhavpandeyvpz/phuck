import React, { useEffect, useState } from 'react';
import { FileBrowser } from './FileBrowser';
import { ServerInformation } from './ServerInformation';
import { Terminal } from './Terminal';
import { sendAndReceive } from './utilities';

export function App() {
  const [env, setEnv] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    sendAndReceive('env')
      .then(data => setEnv(data))
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <div className="text-center my-3">
        <i className="fas fa-circle-notch fa-spin" /> Loading…
      </div>
    );
  }

  return (
    <div className='App d-flex flex-column gap-1 p-1'>
      <div className='d-flex flex-grow-1 gap-1'>
        <div className='ServerInformation'>
          <ServerInformation env={env} />
        </div>
        <div className='FileBrowser flex-grow-1'>
          <FileBrowser env={env} />
        </div>
      </div>
      <div className='Terminal bg-black font-monospace p-1'>
        <Terminal env={env} />
      </div>
    </div>
  );
}
