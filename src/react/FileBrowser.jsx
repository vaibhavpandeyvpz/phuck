import React, {useEffect, useRef, useState} from 'react';
import {sendAndReceive, submitPaths} from './utilities';
import {CompressPrompt} from './popups/CompressPrompt';
import {DecompressConfirmation} from './popups/DecompressConfirmation';
import {DeleteConfirmation} from './popups/DeleteConfirmation';
import {PasteConfirmation} from './popups/PasteConfirmation';
import {NewFileFolderDialog} from './popups/NewFileFolderDialog';
import {UploadDialog} from './popups/UploadDialog';
import {EditFileDialog} from './popups/EditFileDialog';

export function FileBrowser({env}) {
  const [clipboard, setClipboard] = useState([]);
  const [clipboardMode, setClipboardMode] = useState('cut');
  const [cwd, setCwd] = useState(env.cwd);
  const [files, setFiles] = useState([]);
  const [isCompressPromptOpen, setCompressPromptOpen] = useState(false);
  const [isDecompressConfirmationOpen, setDecompressConfirmationOpen] = useState(false);
  const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [isEditFileDialogOpen, setEditFileDialogOpen] = useState(false);
  const [isNewFileFolderDialogOpen, setNewFileFolderDialogOpen] = useState(false);
  const [isPasteConfirmationOpen, setPasteConfirmationOpen] = useState(false);
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [newType, setNewType] = useState('file');
  const pathInput = useRef();
  const [refresh, setRefresh] = useState(1);
  const [selection, setSelection] = useState([]);
  function handleCutCopyClick(mode) {
    setClipboardMode(mode);
    setClipboard(selection.map((x) => x));
  }
  const handleDeSelectAllClick = () => setSelection([]);
  const handleDownloadClick = () => submitPaths('download', cwd, selection);
  function handleFileClick(e, file) {
    e.preventDefault();
    if (file.type_real === 'dir') {
      setCwd(file.path);
      pathInput.current.value = file.path;
    }
  }
  function handleHomeClick(e) {
    e.preventDefault();
    setCwd(env.cwd);
    pathInput.current.value = env.cwd;
  }
  function handlePathChange(e) {
    if (e.key === 'Enter') {
      setCwd(pathInput.current?.value);
    }
  }
  const handleRefreshClick = () => setRefresh(refresh + 1);
  function handleSelectionToggle(e) {
    if (e.target.checked) {
      setSelection(selection.concat(e.target.value));
    } else {
      setSelection(selection.filter((x) => x !== e.target.value));
    }
  }
  function handleSelectAllClick() {
    setSelection(
        files.filter((x) => x.name !== '..')
            .map((x) => x.path),
    );
  }
  useEffect(() => {
    setSelection([]);
  }, [cwd]);
  useEffect(() => {
    setLoading(true);
    sendAndReceive('files', {cwd})
        .then((data) => setFiles(data))
        .finally(() => setLoading(false));
  }, [cwd, refresh]);
  return (
    <div className="d-flex w-100 h-100">
      <CompressPrompt cwd={cwd}
        isOpen={isCompressPromptOpen}
        onDismiss={() => setCompressPromptOpen(false)}
        onFinished={() => {
          setCompressPromptOpen(false);
          handleRefreshClick();
        }}
        selection={selection} />
      <DecompressConfirmation cwd={cwd}
        isOpen={isDecompressConfirmationOpen}
        onDismiss={() => setDecompressConfirmationOpen(false)}
        onFinished={() => {
          setDecompressConfirmationOpen(false);
          handleRefreshClick();
        }}
        selection={selection} />
      <DeleteConfirmation cwd={cwd}
        isOpen={isDeleteConfirmationOpen}
        onDismiss={() => setDeleteConfirmationOpen(false)}
        onFinished={() => {
          setDeleteConfirmationOpen(false);
          setSelection([]);
          handleRefreshClick();
        }}
        selection={selection} />
      <EditFileDialog cwd={cwd}
        isOpen={isEditFileDialogOpen}
        onDismiss={() => setEditFileDialogOpen(false)}
        onFinished={() => {
          setEditFileDialogOpen(false);
          handleRefreshClick();
        }}
        selection={selection} />
      <NewFileFolderDialog cwd={cwd}
        isOpen={isNewFileFolderDialogOpen}
        onDismiss={() => setNewFileFolderDialogOpen(false)}
        onFinished={() => {
          setNewFileFolderDialogOpen(false);
          handleRefreshClick();
        }}
        type={newType} />
      <PasteConfirmation clipboard={clipboard}
        cwd={cwd}
        isOpen={isPasteConfirmationOpen}
        mode={clipboardMode}
        onDismiss={() => setPasteConfirmationOpen(false)}
        onFinished={() => {
          setPasteConfirmationOpen(false);
          setClipboard([]);
          handleRefreshClick();
        }} />
      <UploadDialog cwd={cwd}
        isOpen={isUploadDialogOpen}
        onDismiss={() => setUploadDialogOpen(false)}
        onFinished={() => {
          setUploadDialogOpen(false);
          handleRefreshClick();
        }} />
      <div className="card w-100">
        <div className="card-body">
          <h5 className="card-title">File browser</h5>
          <p className="card-text">
            Browse and manage files on server.
          </p>
        </div>
        <div className="bg-light p-2">
          <div className="btn-toolbar gap-2">
            <button className="btn btn-light" disabled={isLoading} onClick={handleHomeClick}>
              <i className="fas fa-home" />
            </button>
            <button className="btn btn-light" disabled={isLoading} onClick={handleRefreshClick}>
              <i className={classNames(['fas', 'fa-sync', {'fa-spin': isLoading}])} />
            </button>
            <div className="btn-group">
              <button className="btn btn-secondary"
                disabled={isLoading}
                onClick={() => {
                  setNewType('file');
                  setNewFileFolderDialogOpen(true);
                }}>
                <i className="fas fa-plus fa-fw" />
                <span className="d-none d-md-inline ms-1">File</span>
              </button>
              <button className="btn btn-secondary"
                disabled={isLoading}
                onClick={() => {
                  setNewType('folder');
                  setNewFileFolderDialogOpen(true);
                }}>
                <i className="fas fa-plus fa-fw" />
                <span className="d-none d-md-inline ms-1">Folder</span>
              </button>
            </div>
            <div className="btn-group">
              <button className="btn btn-secondary"
                disabled={isLoading}
                onClick={handleSelectAllClick}>
                <i className="far fa-check-square" />
              </button>
              <button className="btn btn-secondary"
                disabled={isLoading || selection.length <= 0}
                onClick={handleDeSelectAllClick}>
                <i className="far fa-square" />
              </button>
            </div>
            <div className="btn-group">
              <button className="btn btn-secondary"
                disabled={isLoading || selection.length <= 0}
                onClick={() => handleCutCopyClick('cut')}>
                <i className="fas fa-cut" />
              </button>
              <button className="btn btn-secondary"
                disabled={isLoading || selection.length <= 0}
                onClick={() => handleCutCopyClick('copy')}>
                <i className="fas fa-copy" />
              </button>
              <button className="btn btn-secondary"
                disabled={isLoading || clipboard.length <= 0}
                onClick={() => setPasteConfirmationOpen(true)}>
                <i className="fas fa-paste" />
              </button>
            </div>
            <div className="btn-group">
              <button className="btn btn-secondary"
                disabled={isLoading || selection.length <= 0}
                onClick={handleDownloadClick}>
                <i className="fas fa-download" />
              </button>
              <button className="btn btn-secondary"
                disabled={isLoading}
                onClick={() => setUploadDialogOpen(true)}>
                <i className="fas fa-upload" />
              </button>
            </div>
            <div className="btn-group">
              <button className="btn btn-secondary"
                disabled={isLoading || selection.length !== 1 || !files.find((x) => x.path === selection[0] && x.type_real === 'file')}
                onClick={() => setEditFileDialogOpen(true)}>
                <i className="fas fa-pencil-alt" />
              </button>
              <button className="btn btn-secondary"
                disabled={isLoading || selection.length <= 0}
                onClick={() => setDeleteConfirmationOpen(true)}>
                <i className="fas fa-trash" />
              </button>
            </div>
            <div className="btn-group">
              <button className="btn btn-secondary"
                disabled={isLoading || selection.length <= 0}
                onClick={() => setCompressPromptOpen(true)}>
                <i className="fas fa-box" />
              </button>
              <button className="btn btn-secondary"
                disabled={isLoading || selection.length !== 1}
                onClick={() => setDecompressConfirmationOpen(true)}>
                <i className="fas fa-box-open" />
              </button>
            </div>
          </div>
        </div>
        <div className="bg-light p-2">
          <input className="form-control"
            defaultValue={cwd}
            disabled={isLoading}
            ref={pathInput}
            onKeyUp={handlePathChange} />
        </div>
        <div className="progress rounded-0">
          {isLoading && (
            <div className="progress-bar progress-bar-striped progress-bar-animated"
              role="progressbar"
              aria-valuenow="100"
              aria-valuemin="0"
              aria-valuemax="100"
              style={{width: '100%'}}>
            </div>
          )}
        </div>
        <div className="position-relative h-100">
          <div className="table-responsive position-absolute w-100 h-100">
            <table className="table table-hover mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="sticky-top" />
                  <th className="sticky-top" />
                  <th className="sticky-top">Name</th>
                  <th className="sticky-top">Size</th>
                  <th className="sticky-top">Last modified</th>
                  <th className="sticky-top">Type</th>
                  <th className="sticky-top">Permissions</th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {files.map((file) => {
                  const key = md5(file.path);
                  return (
                    <tr key={`file-${key}`}>
                      <td>
                        {file.name !== '..' && (
                          <div className="form-check">
                            <input className="form-check-input"
                              checked={selection.indexOf(file.path) >= 0}
                              id={`file-${key}-checkbox`}
                              onChange={handleSelectionToggle}
                              type="checkbox"
                              value={file.path} />
                            <label className="form-check-label" htmlFor={`file-${key}`} />
                          </div>
                        )}
                      </td>
                      <td className="text-center">
                        {file.name !== '..' && (
                          <>
                            {file.type === 'file' && <i className="fa fa-file" />}
                            {file.type === 'dir' && <i className="fa fa-folder text-warning" />}
                            {file.type === 'link' && <i className="fa fa-link" />}
                          </>
                        )}
                      </td>
                      <td>
                        <a className="text-white text-decoration-none"
                          href={file.name}
                          onClick={(e) => handleFileClick(e, file)}>
                          {file.name}
                        </a>
                        {file.type === 'link' && (
                          <span className="text-muted ms-1">-&gt; {file.path_real}</span>
                        )}
                      </td>
                      <td>{file.size ? filesize(file.size) : '-'}</td>
                      <td>{moment.unix(file.modified).format('DD/MM/YYYY HH:mm')}</td>
                      <td>{file.mime || '-'}</td>
                      <td>{file.permissions || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
