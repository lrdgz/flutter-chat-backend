
const { io } = require('../index');

//Socket Messages
io.on('connection', client => {
    console.log('cliente conectado');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('cliente desconectado');
    });

    client.on('mensaje', (payload) => {
        console.log('Mensake', payload);

        io.emit('mensaje', { nomnbre: 'Admin' });
    });

    client.on('emitir-mensaje', (payload) => {
        // io.emit('nuevo-mensaje', payload);
        client.broadcast.emit('nuevo-mensaje', payload);
        // console.log(payload);
    });

    client.on('vote-band', (payload) => {
        bands.voteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });


    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });
});