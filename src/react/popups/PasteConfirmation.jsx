import React, {useState} from 'react';
import {Popup} from './Popup';
import {sendAndReceive} from '../utilities';

export function PasteConfirmation({cwd, clipboard, isOpen, mode, onDismiss, onFinished}) {
  const [isBusy, setBusy] = useState(false);
  const handleConfirm = () => {
    setBusy(true);
    sendAndReceive('paste', {cwd, path: clipboard, mode})
        .then(() => onFinished())
        .finally(() => setBusy(false));
  };
  return (
    <Popup
      action={(
        <button className="btn btn-primary"
          disabled={isBusy}
          onClick={handleConfirm}>
          <i className={classNames(['fas', {'fa-circle-notch fa-spin': isBusy}, {'fa-paste': !isBusy}])} />
          <span className="ms-1">Confirm</span>
        </button>
      )}
      isOpen={isOpen}
      onDismiss={onDismiss}
      title="Paste">
      <p className="text-break mb-0">
        Do you really want to {mode === 'copy' ? 'copy' : 'move'} <strong>{clipboard.length}</strong> files from clipboard into <strong>{cwd}</strong>?
      </p>
    </Popup>
  );
}
