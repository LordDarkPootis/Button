const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let connectedUsers = [];
let firstPressList = [];

// Отправка статических файлов
app.use(express.static('public'));

// Обработка подключения
io.on('connection', (socket) => {
    console.log('Новое соединение:', socket.id);

    // Отправляем текущее состояние при подключении
    socket.emit('currentState', {
        users: connectedUsers,
        firstPressList: firstPressList,
    });

    socket.on('registerUser', (nickname) => {
        connectedUsers.push({ id: socket.id, nickname });
        io.emit('updateConnectedUsers', connectedUsers);
        socket.broadcast.emit('userConnected', nickname); // Сообщаем всем о новом подключении
        socket.broadcast.emit('playConnectSound'); // Проигрываем звук подключения
    });

    socket.on('disconnect', () => {
        const userIndex = connectedUsers.findIndex(user => user.id === socket.id);
        if (userIndex !== -1) {
            const disconnectedUser = connectedUsers[userIndex].nickname;
            connectedUsers.splice(userIndex, 1); // Удаляем пользователя
            io.emit('updateConnectedUsers', connectedUsers);
            socket.broadcast.emit('userDisconnected', disconnectedUser); // Сообщаем всем об отключении
            socket.broadcast.emit('playDisconnectSound'); // Проигрываем звук отключения
        }
    });

    socket.on('firstButtonPress', (nickname) => {
        firstPressList.push(nickname);
        io.emit('updateFirstPressList', firstPressList);
    });
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
