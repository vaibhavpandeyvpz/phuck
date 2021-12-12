import React, {useEffect, useRef, useState} from 'react';
import {Popup} from './Popup';
import {sendAndReceive} from '../utilities';

export function CompressPrompt({cwd, selection, isOpen, onDismiss, onFinished}) {
  const [isBusy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('');
  const nameInput = useRef();
  const handleSubmit = () => {
    setErrors({});
    const name = fileName?.trim();
    if (name) {
      setBusy(true);
      sendAndReceive('compress', {cwd, path: selection, name})
          .then(() => onFinished())
          .finally(() => setBusy(false));
    } else {
      setErrors({fileName: 'This cannot be empty.'});
    }
  };
  useEffect(() => {
    if (isOpen) {
      setFileName('');
      nameInput.current.value = '';
      nameInput.current?.focus();
    }
  }, [isOpen]);
  return (
    <Popup
      action={(
        <button className="btn btn-primary"
          disabled={isBusy}
          onClick={handleSubmit}>
          <i className={classNames(['fas', {'fa-circle-notch fa-spin': isBusy}, {'fa-box': !isBusy}])} />
          <span className="ms-1">Compress</span>
        </button>
      )}
      isOpen={isOpen}
      onDismiss={onDismiss}
      title="Compress">
      <p>Please enter a file name below:</p>
      <label className="form-label">Name <span className="text-danger">*</span></label>
      <input className={classNames('form-control', {'is-invalid': !!errors.fileName})}
        defaultValue={fileName}
        onChange={(e) => setFileName(e.target.value)}
        ref={nameInput} />
      {errors.fileName && (
        <div className="invalid-feedback">{errors.fileName}</div>
      )}
    </Popup>
  );
}
