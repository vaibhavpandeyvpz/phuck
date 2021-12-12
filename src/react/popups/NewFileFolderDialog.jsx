import React, { useEffect, useRef, useState } from 'react';
import { Popup } from './Popup';
import { sendAndReceive } from '../utilities';

export function NewFileFolderDialog({ cwd, isOpen, type, onDismiss, onFinished }) {
  const [isBusy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [name, setName] = useState('');
  const nameInput = useRef();
  const handleSubmit = () => {
    setErrors({});
    const trimmed = name?.trim();
    if (trimmed) {
      setBusy(true);
      sendAndReceive('new', { cwd, type, name: trimmed })
        .then(() => onFinished())
        .finally(() => setBusy(false));
    } else {
      setErrors({ name: 'This cannot be empty.' });
    }
  };
  useEffect(() => {
    if (isOpen) {
      setName('');
      nameInput.current.value = '';
      nameInput.current?.focus();
    }
  }, [isOpen]);
  return (
    <Popup
      action={(
        <button className="btn btn-success"
                disabled={isBusy}
                onClick={handleSubmit}>
          <i className={classNames(['fas', { 'fa-circle-notch fa-spin': isBusy }, { 'fa-plus': !isBusy }])} />
          <span className="ms-1">Create</span>
        </button>
      )}
      isOpen={isOpen}
      onDismiss={onDismiss}
      title={`New ${type}`}>
      <p>Please enter the {type} name to create:</p>
      <label className="form-label">Name <span className="text-danger">*</span></label>
      <input className={classNames('form-control', { 'is-invalid': !!errors.name })}
             defaultValue={name}
             onChange={e => setName(e.target.value)}
             ref={nameInput} />
      {errors.name && (
        <div className="invalid-feedback">{errors.name}</div>
      )}
    </Popup>
  );
}
