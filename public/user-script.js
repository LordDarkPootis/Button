const socket = io();
let nickname = '';
let hasPressed = false;

// Установим время задержки в 3 секунды
const delayTime = 3000;

document.getElementById('enterButton').addEventListener('click', () => {
    nickname = document.getElementById('nickname').value;
    if (nickname.trim() !== '') {
        socket.emit('registerUser', nickname); // Отправляем ник на сервер
        document.getElementById('nicknamePrompt').style.display = 'none';
        document.getElementById('nickname').style.display = 'none';
        document.getElementById('enterButton').style.display = 'none';

        document.getElementById('welcomeMessage').style.display = 'block';
        document.getElementById('userNickname').textContent = nickname;

        document.getElementById('statusMessage').style.display = 'block';
        document.getElementById('statusMessage').textContent = 'Будьте готовы нажать на кнопку!';

        document.getElementById('actionButton').style.display = 'block';
    }
});

const button = document.getElementById('actionButton');

// Когда пользователь нажимает на кнопку
button.addEventListener('click', () => {
    if (!button.disabled) {
        socket.emit('firstButtonPress', nickname);
        button.textContent = 'Ответьте на вопрос!';
        document.getElementById('statusMessage').textContent = 'Ответьте на вопрос!';
        document.getElementById('sound').play();
        
        // Блокируем кнопку на 3 секунды
        button.disabled = true;
        setTimeout(() => {
            button.disabled = false;
            button.textContent = 'Нажми меня!';
            document.getElementById('statusMessage').textContent = 'Будьте готовы нажать на кнопку!';
        }, delayTime);
    }
});

// Когда сервер сообщает, что пользователь был первым
socket.on('firstButtonPressed', (data) => {
    if (data.firstUser === nickname) {
        document.getElementById('statusMessage').textContent = 'Вы первым нажали на кнопку!';
    } else {
        document.getElementById('statusMessage').textContent = 'Кто-то другой уже нажал первым.';
    }
});

// Когда сервер сообщает, что другой пользователь нажал позже
socket.on('laterButtonPressed', (data) => {
    if (data.pressedBy !== nickname) {
        document.getElementById('statusMessage').textContent = 'Вы не были первым, но всё равно ответьте на вопрос.';
    }
});
