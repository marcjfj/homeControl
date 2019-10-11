const url = 'http://10.0.0.169:3000/assistant';
let onOff;
let msg;
let message;

const buttons = document.querySelectorAll('button');
async function sendMsg(message) {
  try {
    const response = await fetch(url, {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(message), // data can be `string` or {object}!
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    console.log('Success:', JSON.stringify(json));
  } catch (error) {
    console.error('Error:', error);
  }
}

buttons.forEach(button => {
  button.addEventListener('click', e => {
    const group = e.target.parentElement.parentElement;
    console.log(group);
    if (e.target.classList.contains('on')) {
      onOff = 'Turn on';
      console.log(onOff);
    } else if (e.target.classList.contains('off')) {
      onOff = 'Turn off';
    }
    switch (group.dataset.group) {
      case 'sink':
        msg = 'sink light';
        break;

      case 'lrLamp':
        msg = 'living room lamp';
        break;

      case 'bedroom':
        msg = 'bedroom lights';
        break;

      case 'hall':
        msg = 'hall light';
        break;

      default:
        break;
    }
    message = { user: 'marc', command: `${onOff} ${msg}` };
    sendMsg(message);
  });
});
