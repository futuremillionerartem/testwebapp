const $clickableImage = document.querySelector('#clickable-image');
const $score = document.querySelector('#score');
const $energyBar = document.querySelector('#energy-bar');
const $energyText = document.querySelector('#energy-value');
const $multitapButton = document.querySelector('.task-button1');
const $multitapCost = document.querySelector('#multitap-cost');
const $energyButton = document.querySelector('.task-button2');
const $energyCost = document.querySelector('#energy-cost');
let energy = getEnergy();  // Инициализация глобальной переменной energy
let energyRegenInterval;  // Переменная для хранения интервала восстановления энергии
let regenDelayTimeout;  // Переменная для хранения таймера задержки
let costcliskpanda = Number(localStorage.getItem('costcliskpanda')) || 1; // Загружаем значение из localStorage или устанавливаем по умолчанию 1
let notcostcliskpanda = costcliskpanda.toString();
let energycount = 100;
let energyreset = 30;



document.addEventListener('DOMContentLoaded', () => {
    // Синхронизация данных
    setScore(getScore());
    setEnergy(getEnergy());
    loadEnergyCount();  // Загрузка значения energycount

    // Синхронизация стоимости multitap
    const savedCost = localStorage.getItem('multitapCost');
    if (savedCost) {
        $multitapCost.textContent = savedCost;
    }

    // Синхронизация стоимости energy limit
    const savedEnergyCost = localStorage.getItem('energyCost');
    if (savedEnergyCost) {
        $energyCost.textContent = savedEnergyCost;
    }

    // Проверка выполнения каждого задания
    checkTaskCompletion('youtubeTask', document.querySelector('.youtube-task'));
    checkTaskCompletion('telegramTask', document.querySelector('.telegram-task'));
    checkTaskCompletion('discordTask', document.querySelector('.discord-task'));

    // Обновление шкалы энергии
    updateEnergyBar();

    // Слушатели событий
    $multitapButton.addEventListener('click', handleMultitapButtonClick);
    $energyButton.addEventListener('click', handleEnergyButtonClick);
    $clickableImage.addEventListener('click', handleClickableImageClick);

    // Функции-обработчики
    function handleMultitapButtonClick() {
        const currentCost = Number($multitapCost.textContent);
        const currentScore = getScore();
    
        if (currentScore >= currentCost) {
            setScore(currentScore - currentCost);
            costcliskpanda += 1;
            localStorage.setItem('costcliskpanda', costcliskpanda);
            notcostcliskpanda = costcliskpanda.toString();

            const newCost = currentCost * 2;
            $multitapCost.textContent = newCost;
            localStorage.setItem('multitapCost', newCost);
        } else {
            alert('Недостаточно баланса для покупки!');
        }
    }

    function handleEnergyButtonClick() {
        const currentEnergyCost = Number($energyCost.textContent);
        const currentScore = getScore();

        if (currentScore >= currentEnergyCost) {
            setScore(currentScore - currentEnergyCost);
            energycount += 500;
            saveEnergyCount();

            const newEnergyCost = currentEnergyCost * 2;
            $energyCost.textContent = newEnergyCost;
            localStorage.setItem('energyCost', newEnergyCost);

            setEnergy(getEnergy());
        } else {
            alert('Недостаточно баланса для увеличения лимита энергии!');
        }
    }

    function handleClickableImageClick(event) {
        if (energy > 0) {
            const rect = $clickableImage.getBoundingClientRect();
            const offsetX = event.clientX - rect.left - rect.width / 2;
            const offsetY = event.clientY - rect.top - rect.height / 2;

            const DEG = 40; 
            const tiltX = (offsetY / rect.height) * DEG;
            const tiltY = (offsetX / rect.width) * -DEG;

            $clickableImage.style.setProperty('--tiltX', `${tiltX}deg`);
            $clickableImage.style.setProperty('--tiltY', `${tiltY}deg`);

            setTimeout(() => {
                $clickableImage.style.setProperty('--tiltX', `0deg`);
                $clickableImage.style.setProperty('--tiltY', `0deg`);
            }, 300);

            const plusOne = document.createElement('div');
            plusOne.classList.add('plus-one');
            plusOne.textContent = '+' + notcostcliskpanda;
            plusOne.style.left = `${event.clientX}px`;
            plusOne.style.top = `${event.clientY}px`;

            $clickableImage.parentElement.appendChild(plusOne);

            addOne();

            setTimeout(() => {
                plusOne.remove();
            }, 2000);

            setEnergy(energy - costcliskpanda);

            clearInterval(energyRegenInterval);
            energyRegenInterval = null;
            clearTimeout(regenDelayTimeout);

            regenDelayTimeout = setTimeout(() => {
                startRegenEnergy();
            }, 1000);
        }
    }
});


// Функции для работы с энергией
function getEnergy() {
    return Number(localStorage.getItem('energy')) || energycount;
}

function setEnergy(newEnergy) {
    energy = Math.min(newEnergy, energycount);
    localStorage.setItem('energy', energy);
    updateEnergyBar();
}

// Обновление интерфейса энергии
function updateEnergyBar() {
    $energyBar.style.width = `${(energy / energycount) * 100}%`;
    $energyText.textContent = `${energy}/${energycount}`;
}
function getScore() {
    return Number(localStorage.getItem('score')) || 0;
}

function setScore(score) {
    localStorage.setItem('score', score);
    document.querySelectorAll('#score').forEach(el => el.textContent = score); // Обновление счёта на всех страницах
}




function addOne() {
    setScore(getScore() + costcliskpanda);
}

$clickableImage.addEventListener('click', (event) => {
    if (energy > 0) {
        const rect = $clickableImage.getBoundingClientRect();
        const offsetX = event.clientX - rect.left - rect.width / 2;
        const offsetY = event.clientY - rect.top - rect.height / 2;

        const DEG = 40; // Степень наклона
        const tiltX = (offsetY / rect.height) * DEG;
        const tiltY = (offsetX / rect.width) * -DEG;

        // Установка CSS переменных
        $clickableImage.style.setProperty('--tiltX', `${tiltX}deg`);
        $clickableImage.style.setProperty('--tiltY', `${tiltY}deg`);

        // Сброс наклона после задержки
        setTimeout(() => {
            $clickableImage.style.setProperty('--tiltX', `0deg`);
            $clickableImage.style.setProperty('--tiltY', `0deg`);
        }, 300);

        const plusOne = document.createElement('div');
        plusOne.classList.add('plus-one');
        plusOne.textContent = '+'+notcostcliskpanda;
        plusOne.style.left = `${event.clientX}px`;
        plusOne.style.top = `${event.clientY}px`;

        $clickableImage.parentElement.appendChild(plusOne);

        addOne();

        setTimeout(() => {
            plusOne.remove();
        }, 2000);

        // Уменьшение энергии при клике
        setEnergy(energy - costcliskpanda);  // Обновление энергии при клике

        // Остановка восстановления при клике
        clearInterval(energyRegenInterval);
        energyRegenInterval = null;
        clearTimeout(regenDelayTimeout);

        // Установка таймера на возобновление восстановления через 1 секунду после последнего клика
        regenDelayTimeout = setTimeout(() => {
            startRegenEnergy();
        }, 1000);
    }
});

// Логика для шкалы энергии
function updateEnergyBar() {
    $energyBar.style.width = `${(energy / energycount) * 100}%`;  // Показать процентное значение
    $energyText.textContent = `${energy}/`+ energycount;  // Обновите текстовое отображение
}

function regenEnergy() {
    if (energy < energycount) {
        setEnergy(energy + energyreset);
    } else {
        clearInterval(energyRegenInterval);
        energyRegenInterval = null;
    }
}

function startRegenEnergy() {
    if (!energyRegenInterval && energy < energycount) {
        energyRegenInterval = setInterval(regenEnergy, 1900);
    }
}

// Функция для выполнения задания
function completeTask(element, url, taskKey) {
    // Проверяем, выполнено ли задание
    if (localStorage.getItem(taskKey)) {
        showMessage('Task Completed', event.clientX, event.clientY);
        return;
    }

    const rewardText = element.querySelector('.task-reward').textContent.trim().replace(/\s/g, '');
    const reward = parseInt(rewardText, 10);

    // Добавление награды к балансу через 3 секунды
    setTimeout(() => {
        const currentScore = getScore();
        setScore(currentScore + reward);

        // Устанавливаем флаг выполнения задания
        localStorage.setItem(taskKey, 'completed');

        // Перенаправление по ссылке
        window.location.href = url;
    }, 3000);  // Задержка на 3 секунды
}

// Функция для проверки выполнения задания
function checkTaskCompletion(taskKey, element) {
    // Если задание выполнено, отключаем кнопку или скрываем её
    if (localStorage.getItem(taskKey)) {
        element.style.pointerEvents = 'none';
        element.style.opacity = '0.5'; // Делаем кнопку полупрозрачной
    }
}

// Функция для отображения сообщения на странице
function showMessage(message, x, y) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('task-message');
    messageElement.textContent = message;

    // Устанавливаем позицию сообщения
    messageElement.style.left = `${x}px`;
    messageElement.style.top = `${y}px`;

    document.body.appendChild(messageElement);

    setTimeout(() => {
        messageElement.remove();
    }, 2000);  // Убираем сообщение через 2 секунды
}

