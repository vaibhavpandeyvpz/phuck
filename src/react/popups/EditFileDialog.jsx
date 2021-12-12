import React, {useEffect, useRef, useState} from 'react';
import {Popup} from './Popup';
import {sendAndReceive} from '../utilities';

export function EditFileDialog({cwd, isOpen, selection, onDismiss, onFinished}) {
  const [isBusy, setBusy] = useState(false);
  const [contents, setContents] = useState('');
  const contentsInput = useRef();
  const handleSubmit = () => {
    const trimmed = contents?.trim();
    setBusy(true);
    sendAndReceive('write', {cwd, path: selection[0], contents: trimmed})
        .then(() => onFinished())
        .finally(() => setBusy(false));
  };
  useEffect(() => {
    if (isOpen) {
      setContents('');
      contentsInput.current.value = '';
      contentsInput.current?.focus();
      setBusy(true);
      sendAndReceive('read', {cwd, path: selection[0]})
          .then(({contents}) => {
            setContents(contents);
            contentsInput.current.value = contents;
            contentsInput.current?.focus();
          })
          .finally(() => setBusy(false));
    }
  }, [isOpen]);
  const name = selection[0]?.split(/[\/\\]/).pop();
  return (
    <Popup
      action={(
        <button className="btn btn-success"
          disabled={isBusy}
          onClick={handleSubmit}>
          <i className={classNames(['fas', {'fa-circle-notch fa-spin': isBusy}, {'fa-check': !isBusy}])} />
          <span className="ms-1">Update</span>
        </button>
      )}
      isLarge
      isOpen={isOpen}
      isScrollable
      onDismiss={onDismiss}
      title={`Edit ${name}`}>
      <label className="form-label">Contents <span className="text-danger">*</span></label>
      <textarea className="form-control"
        defaultValue={contents}
        onChange={(e) => setContents(e.target.value)}
        ref={contentsInput}
        rows={15}>
      </textarea>
    </Popup>
  );
}
