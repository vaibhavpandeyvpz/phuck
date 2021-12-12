import React, { useState } from 'react';
import { KeyValuePairsDialog } from './popups/KeyValuePairsDialog';

export function ServerInformation({ env }) {
  const [isEnvironmentVariablesDialogOpen, setEnvironmentVariablesDialogOpen] = useState(false);
  const [isPhpIniValuesDialogOpen, setPhpIniValuesDialogOpen] = useState(false);
  return (
    <div className="d-flex w-100 h-100">
      <KeyValuePairsDialog isOpen={isEnvironmentVariablesDialogOpen}
                           onDismiss={() => setEnvironmentVariablesDialogOpen(false)}
                           title="Environment"
                           values={env.variables} />
      <KeyValuePairsDialog isOpen={isPhpIniValuesDialogOpen}
                           onDismiss={() => setPhpIniValuesDialogOpen(false)}
                           title={env.php.ini.path}
                           values={env.php.ini.values} />
      <div className="card w-100">
        <div className="card-body">
          <h5 className="card-title">Server information</h5>
          <p className="card-text">
            Below is the server and PHP setup information.
          </p>
        </div>
        <div className="position-relative h-100">
          <div className="table-responsive position-absolute w-100 h-100">
            <table className="table mb-0">
              <tbody>
              <tr className="bg-light">
                <th colSpan={2}>OS</th>
              </tr>
              <tr>
                <th>Platform</th>
                <td>{env.platform.name} {env.platform.version} ({env.arch})</td>
              </tr>
              <tr>
                <th>Hostname</th>
                <td>{env.hostname}</td>
              </tr>
              <tr>
                <th>User</th>
                <td>{env.user}</td>
              </tr>
              <tr>
                <th>Environment</th>
                <td>
                  <a
                    className="text-white"
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      setEnvironmentVariablesDialogOpen(true);
                    }}>
                    See {Object.keys(env.variables).length} variables
                  </a>
                </td>
              </tr>
              <tr>
                <th>Home</th>
                <td>{env.home}</td>
              </tr>
              <tr className="bg-light">
                <th colSpan={2}>PHP</th>
              </tr>
              <tr>
                <th>Release</th>
                <td>{env.php.version} ({env.php.sapi})</td>
              </tr>
              <tr>
                <th>INI file</th>
                <td>{env.php.ini.path}</td>
              </tr>
              <tr>
                <th>Modules</th>
                <td>{env.php.extensions.map(x => x.toLowerCase()).join(', ')}</td>
              </tr>
              <tr>
                <th>Configuration</th>
                <td>
                  <a
                    className="text-white"
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      setPhpIniValuesDialogOpen(true);
                    }}>
                    See {Object.keys(env.php.ini.values).length} values
                  </a>
                </td>
              </tr>
              <tr>
                <th>Timezone</th>
                <td>{env.tz}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
