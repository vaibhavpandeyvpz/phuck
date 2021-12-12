import React from 'react';

export function Popup({ action, children, isLarge, isOpen, isScrollable, onDismiss, title }) {
  return (
    <>
      <div className={classNames('modal fade', { show: isOpen })}
           style={{ display: isOpen ? 'block' : 'none' }}
           tabIndex="-1">
        <div className={classNames(['modal-dialog', 'modal-dialog-centered', { 'modal-dialog-scrollable': isScrollable, 'modal-lg': isLarge }])}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button className="btn-close"
                      onClick={onDismiss}>
              </button>
            </div>
            <div className="modal-body">
              {children}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary"
                      onClick={onDismiss}>
                Close
              </button>
              {action}
            </div>
          </div>
        </div>
      </div>
      <div className={classNames('modal-backdrop fade', { show: isOpen })}
           onClick={onDismiss}
           style={{ display: isOpen ? 'block' : 'none' }}>
      </div>
    </>
  );
}
