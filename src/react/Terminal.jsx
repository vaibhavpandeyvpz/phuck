import React, {useRef, useState} from 'react';
import {sendAndReceive} from './utilities';

const banner =
  ' /$$$$$$$  /$$                           /$$\n' +
  '| $$__  $$| $$                          | $$\n' +
  '| $$  \\ $$| $$$$$$$  /$$   /$$  /$$$$$$$| $$   /$$\n' +
  '| $$$$$$$/| $$__  $$| $$  | $$ /$$_____/| $$  /$$/\n' +
  '| $$____/ | $$  \\ $$| $$  | $$| $$      | $$$$$$/\n' +
  '| $$      | $$  | $$| $$  | $$| $$      | $$_  $$\n' +
  '| $$      | $$  | $$|  $$$$$$/|  $$$$$$$| $$ \\  $$\n' +
  '|__/      |__/  |__/ \\______/  \\_______/|__/  \\__/';

export function Terminal({env}) {
  const [cwd, setCwd] = useState(env.cwd);
  const [command, setCommand] = useState('ls -al');
  const commandInput = useRef(null);
  const commandOutput = useRef(null);
  const [executions, setExecutions] = useState([]);
  const [isRunning, setRunning] = useState(false);
  function executeCommand(command) {
    setRunning(true);
    sendAndReceive('command', {cwd, cmd: command})
        .then(({cwd, ...result}) => {
          pushExecution({...result, command});
          setCwd(cwd);
        })
        .finally(() => {
          setRunning(false);
          commandOutput.current.scrollTop = commandOutput.current.scrollHeight;
          commandInput.current.focus();
        });
  }
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      const cmd = command?.trim();
      if (cmd) {
        executeCommand(command);
      }

      setCommand('');
      commandInput.current.value = '';
    }
  }
  function pushExecution(item) {
    setExecutions(executions.concat(item));
  }
  const directory = cwd.split(/[\/\\]/).pop();
  return (
    <div className="d-flex flex-column gap-1 w-100 h-100">
      <div className="w-100 h-100 flex-grow-1 overflow-auto" ref={commandOutput}>
        <pre className="text-white-50">{banner}</pre>
        {executions.map(({command, code, stdout}, i) => (
          <div className="w-100" key={`terminal-execution-${i}`}>
            <pre className="text-white">{command}</pre>
            {stdout ? <pre className="text-white-50">{stdout}</pre> : ''}
            {code !== 0 ? <pre className="text-danger">Command exited with code {code}.</pre> : null}
          </div>
        ))}
      </div>
      <div className="d-flex w-100 gap-1">
        <strong className="align-self-center">
          <span className="text-primary">{env.user}</span>
          <span className="text-white-50">@</span>
          <span className="text-success">{env.hostname}</span>
          <span className="text-white-50">:</span>
          <span className="text-white">{directory}</span>
          <span className="text-white-50">$</span>
        </strong>
        <input autoFocus
          className="align-self-center bg-transparent border-0 flex-grow-1 text-white-50"
          defaultValue={command}
          disabled={isRunning}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleKeyDown}
          ref={commandInput} />
      </div>
      <div className="bg-black progress rounded-0">
        {isRunning && (
          <div className="progress-bar progress-bar-striped progress-bar-animated"
            role="progressbar"
            aria-valuenow="100"
            aria-valuemin="0"
            aria-valuemax="100"
            style={{width: '100%'}}>
          </div>
        )}
      </div>
    </div>
  );
}
