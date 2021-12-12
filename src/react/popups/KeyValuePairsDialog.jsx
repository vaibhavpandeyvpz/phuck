import React from 'react';
import {Popup} from './Popup';

export function KeyValuePairsDialog({isOpen, onDismiss, title, values}) {
  return (
    <Popup isOpen={isOpen}
      isLarge
      isScrollable
      onDismiss={onDismiss}
      title={title}>
      <div className="table-responsive">
        <table className="table mb-0">
          <tbody>
            {Object.keys(values).map((x) => (
              <tr key={'kvp-' + md5(x)}>
                <th>{x}</th>
                <td className="text-break">{values[x]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Popup>
  );
}
