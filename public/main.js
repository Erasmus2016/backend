const socket = io('http://localhost:5000');

socket.io.on('packet', (data) => {
    if (data.type == 2)
        console.log(data.data);
});

const playerNO = location.hash == '#2' ? 2 : 1;

socket.on('login', () => {
    console.clear();
    socket.emit('login', {
        color: playerNO == 1 ? 'red' : 'blue',
        name: 'player_' + playerNO,
        category: 0
    });
});

socket.on('roll-the-dice', () => {
    socket.emit('roll-the-dice');
});

socket.on('set-difficulty', () => {
    socket.emit('set-difficulty', 3);
});

socket.on('mode', () => {
    socket.emit('mode', {
        type: 'friend',
        room: 'fisch',
    })
});