export const RPC_URL = process.env.RPC_URL || '';

/**
 * @param {string} action
 * @param {FormData|Object} data
 * @param {Object} config
 * @return {*}
 */
export function sendAndReceive(action, data, config = {}) {
  const headers = {'Content-Type': 'application/x-www-form-urlencoded'};
  if (!data?.append) {
    data = new URLSearchParams(data || {});
  }

  return axios.post(RPC_URL, data, {headers, params: {action}, ...config})
      .then(({data}) => data);
}

/**
 * @param {string} action
 * @param {string} cwd
 * @param {Array<string>} paths
 */
export function submitPaths(action, cwd, paths) {
  let form = document.getElementById('form-download');
  if (!form) {
    form = document.createElement('form');
    form.action = RPC_URL + '?action=' + action;
    form.method = 'post';
    document.body.appendChild(form);
  }

  form.innerHTML = '';
  const input1 = document.createElement('input');
  input1.name = 'cwd';
  input1.type = 'hidden';
  input1.value = cwd;
  form.appendChild(input1);
  (paths || []).forEach((x) => {
    const input2 = document.createElement('input');
    input2.name = 'path[]';
    input2.type = 'hidden';
    input2.value = x;
    form.appendChild(input2);
  });

  form.submit();
}
