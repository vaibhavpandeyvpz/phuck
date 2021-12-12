import React, { useState } from 'react';
import { Popup } from './Popup';
import { sendAndReceive } from '../utilities';

export function UploadDialog({ cwd, isOpen, onDismiss, onFinished }) {
  const [errors, setErrors] = useState({});
  const [isBusy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selection, setSelection] = useState();
  const handleUpload = () => {
    setErrors({});
    if (selection) {
      setBusy(true);
      setProgress(0);
      const data = new FormData();
      data.append('cwd', cwd);
      data.append('attachment', selection);
      sendAndReceive('upload', data, {
        onUploadProgress(e) {
          const percentage = Math.round((e.loaded * 100) / e.total);
          setProgress(percentage);
        }
      })
        .then(() => onFinished())
        .finally(() => setBusy(false));
    } else {
      setErrors({ selection: 'This cannot be empty.' });
    }
  };
  return (
    <Popup
      action={(
        <button className="btn btn-success"
                disabled={isBusy}
                onClick={handleUpload}>
          <i className={classNames(['fas', { 'fa-circle-notch fa-spin': isBusy }, { 'fa-upload': !isBusy }])} />
          <span className="ms-1">Upload</span>
        </button>
      )}
      isOpen={isOpen}
      onDismiss={onDismiss}
      title="Upload">
      <div className="mb-3">
        <label className="form-label">File <span className="text-danger">*</span></label>
        <input className={classNames('form-control', { 'is-invalid': !!errors.selection })}
               onChange={e => setSelection(e.target.files[0])}
               type="file" />
        {errors.selection && (
          <div className="invalid-feedback">{errors.selection}</div>
        )}
      </div>
      <div className="progress rounded-0">
        {isBusy && (
          <div className="progress-bar progress-bar-striped progress-bar-animated"
               role="progressbar"
               aria-valuenow={progress}
               aria-valuemin="0"
               aria-valuemax="100"
               style={{ width: `${progress}%` }}>
          </div>
        )}
      </div>
    </Popup>
  );
}
