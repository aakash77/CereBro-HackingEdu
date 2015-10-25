function establishSocketConnection(){
  Muse.connect({
      host: 'http://127.0.0.1',
      port: 5000,
      socket: {
        host: '127.0.0.1',
        ports: {
          client: 3334,
          server: 3333
        }
      }
    });
}

function closeConnection(){
  Muse.disconnect({
      host: 'http://127.0.0.1',
      port: 5000,
      socket: {
        host: '127.0.0.1',
        ports: {
          client: 3334,
          server: 3333
        }
      }
    });
}

function resumeConnection(){
  Muse.resconnect({
      host: 'http://127.0.0.1',
      port: 5000,
      socket: {
        host: '127.0.0.1',
        ports: {
          client: 3334,
          server: 3333
        }
      }
    });
}