import React, {useState} from 'react';
import {Popup} from './Popup';
import {sendAndReceive} from '../utilities';

export function DecompressConfirmation({cwd, selection, isOpen, onDismiss, onFinished}) {
  const [isBusy, setBusy] = useState(false);
  const handleConfirm = () => {
    setBusy(true);
    sendAndReceive('decompress', {cwd, path: selection[0]})
        .then(() => onFinished())
        .finally(() => setBusy(false));
  };
  const name = selection[0]?.split(/[\/\\]/).pop();
  return (
    <Popup
      action={(
        <button className="btn btn-primary"
          disabled={isBusy}
          onClick={handleConfirm}>
          <i className={classNames(['fas', {'fa-circle-notch fa-spin': isBusy}, {'fa-box-open': !isBusy}])} />
          <span className="ms-1">Confirm</span>
        </button>
      )}
      isOpen={isOpen}
      onDismiss={onDismiss}
      title="Decompress">
      <p className="text-break mb-0">
        Do you really want to unpack <strong>{name}</strong> into <strong>{cwd}</strong>?
      </p>
    </Popup>
  );
}
