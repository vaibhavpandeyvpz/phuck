import React from 'react';

export function ServerInformation({ env }) {
  return (
    <div className="d-flex w-100 h-100">
      <div className="card w-100">
        <div className="card-body">
          <h5 className="card-title">Server information</h5>
          <p className="card-text">
            Below is the server and PHP setup information.
          </p>
        </div>
        <div className="table-responsive h-100">
          <table className="table">
            <tbody>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
