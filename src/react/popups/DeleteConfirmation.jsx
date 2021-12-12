import React, {useState} from 'react';
import {Popup} from './Popup';
import {sendAndReceive} from '../utilities';

export function DeleteConfirmation({cwd, selection, isOpen, onDismiss, onFinished}) {
  const [isBusy, setBusy] = useState(false);
  const handleConfirm = () => {
    setBusy(true);
    sendAndReceive('delete', {cwd, path: selection})
        .then(() => onFinished())
        .finally(() => setBusy(false));
  };
  return (
    <Popup
      action={(
        <button className="btn btn-danger"
          disabled={isBusy}
          onClick={handleConfirm}>
          <i className={classNames(['fas', {'fa-circle-notch fa-spin': isBusy}, {'fa-trash': !isBusy}])} />
          <span className="ms-1">Confirm</span>
        </button>
      )}
      isOpen={isOpen}
      onDismiss={onDismiss}
      title="Delete">
      <p className="text-break mb-0">
        Do you really want to delete <strong>{selection.length}</strong> selected files or folders?
      </p>
    </Popup>
  );
}
