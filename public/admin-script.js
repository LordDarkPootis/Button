const socket = io();

let connectedUsers = [];
let firstPressList = [];

// Восстанавливаем состояние из localStorage
window.onload = () => {
    const savedUsers = JSON.parse(localStorage.getItem('connectedUsers'));
    const savedFirstPressList = JSON.parse(localStorage.getItem('firstPressList'));

    if (savedUsers) {
        connectedUsers = savedUsers;
        updateUserList();
    }
    
    if (savedFirstPressList) {
        firstPressList = savedFirstPressList;
        updateFirstPressList();
    }
};

// Обновление списка подключенных пользователей
function updateUserList() {
    const userList = document.getElementById('connectedUsersList');
    userList.innerHTML = '';

    connectedUsers.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user.nickname;
        userList.appendChild(li);
    });

    document.getElementById('userCount').textContent = connectedUsers.length; // Обновление счётчика пользователей

    localStorage.setItem('connectedUsers', JSON.stringify(connectedUsers));
}

// Обновление списка первых нажимавших кнопку
function updateFirstPressList() {
    const firstPressListElement = document.getElementById('firstPressList');
    firstPressListElement.innerHTML = '';

    firstPressList.forEach((user, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${user}`; // Нумерация
        firstPressListElement.appendChild(li);
    });

    localStorage.setItem('firstPressList', JSON.stringify(firstPressList));
}

// Получение состояния при загрузке
socket.on('currentState', (data) => {
    connectedUsers = data.users;
    firstPressList = data.firstPressList;

    updateUserList();
    updateFirstPressList();
});

// Обновление списка подключенных пользователей
socket.on('updateConnectedUsers', (users) => {
    connectedUsers = users;
    updateUserList();
});

// Обновление списка первых нажимавших кнопку
socket.on('updateFirstPressList', (list) => {
    firstPressList = list;
    updateFirstPressList();
});

// Обработка события, когда ник уже занят
socket.on('nicknameTaken', (message) => {
    alert(message); // Показываем сообщение пользователю
});

// Проигрывание звуков
socket.on('playConnectSound', () => {
    document.getElementById('connectSound').play();
});

socket.on('playDisconnectSound', () => {
    document.getElementById('disconnectSound').play();
});
