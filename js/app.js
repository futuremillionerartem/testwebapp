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
    setScore(getScore());  // Синхронизировать счёт сразу после загрузки страницы
    setEnergy(getEnergy());  // Синхронизировать энергию

    // Проверка выполнения каждого задания
    checkTaskCompletion('youtubeTask', document.querySelector('.youtube-task'));
    checkTaskCompletion('telegramTask', document.querySelector('.telegram-task'));
    checkTaskCompletion('discordTask', document.querySelector('.discord-task'));
    // Загрузка сохранённой стоимости multitap и синхронизация с интерфейсом
    const savedCost = localStorage.getItem('multitapCost');
    if (savedCost) {
        $multitapCost.textContent = savedCost;
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Загрузка сохранённой стоимости multitap и синхронизация с интерфейсом
    const savedCost = localStorage.getItem('multitapCost');
    if (savedCost) {
        $multitapCost.textContent = savedCost;
    }

    $multitapButton.addEventListener('click', () => {
        const currentCost = Number($multitapCost.textContent);
        const currentScore = getScore();
    
        if (currentScore >= currentCost) {
            // Уменьшаем баланс на стоимость multitap
            setScore(currentScore - currentCost);
    
            // Увеличиваем переменную costcliskpanda на 1
            costcliskpanda += 1;
            localStorage.setItem('costcliskpanda', costcliskpanda); // Сохраняем значение в localStorage
            notcostcliskpanda = costcliskpanda.toString();
    
            // Увеличиваем стоимость multitap и сохраняем её
            const newCost = currentCost * 2;
            $multitapCost.textContent = newCost;
            localStorage.setItem('multitapCost', newCost);
        } else {
            alert('Недостаточно баланса для покупки!');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    // Загрузка сохранённой стоимости energy limit и синхронизация с интерфейсом
    const savedEnergyCost = localStorage.getItem('energyCost');
    if (savedEnergyCost) {
        $energyCost.textContent = savedEnergyCost;
    }

    $energyButton.addEventListener('click', () => {
        const currentEnergyCost = Number($energyCost.textContent);
        const currentScore = getScore();

        if (currentScore >= currentEnergyCost) {
            // Уменьшаем баланс на стоимость Energy Limit
            setScore(currentScore - currentEnergyCost);

            // Увеличиваем переменную energycount на 500
            energycount += 500;

            // Увеличиваем стоимость Energy Limit и сохраняем её
            const newEnergyCost = currentEnergyCost * 2;
            $energyCost.textContent = newEnergyCost;
            localStorage.setItem('energyCost', newEnergyCost);
        } else {
            alert('Недостаточно баланса для увеличения лимита энергии!');
        }
    });
});


// Функция для загрузки и установки сохранённого значения energycount
function loadEnergyCount() {
    const savedEnergyCount = localStorage.getItem('energyCount');
    if (savedEnergyCount) {
        energycount = Number(savedEnergyCount);
    }
}

// Функция для сохранения значения energycount
function saveEnergyCount() {
    localStorage.setItem('energyCount', energycount);
}

// Обновляем интерфейс после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    loadEnergyCount(); // Загрузка значения energycount при загрузке страницы

    // Загрузка сохранённой стоимости energy limit и синхронизация с интерфейсом
    const savedEnergyCost = localStorage.getItem('energyCost');
    if (savedEnergyCost) {
        $energyCost.textContent = savedEnergyCost;
    }

    $energyButton.addEventListener('click', () => {
        const currentEnergyCost = Number($energyCost.textContent);
        const currentScore = getScore();

        if (currentScore >= currentEnergyCost) {
            // Уменьшаем баланс на стоимость Energy Limit
            setScore(currentScore - currentEnergyCost);

            // Увеличиваем переменную energycount на 500
            energycount += 500;
            saveEnergyCount(); // Сохраняем новое значение energycount

            // Увеличиваем стоимость Energy Limit и сохраняем её
            const newEnergyCost = currentEnergyCost * 2;
            $energyCost.textContent = newEnergyCost;
            localStorage.setItem('energyCost', newEnergyCost);

            // Обновляем интерфейс (например, шкалу энергии)
            setEnergy(getEnergy()); // Пересчитываем энергию с новым лимитом
        } else {
            alert('Недостаточно баланса для увеличения лимита энергии!');
        }
    });

    // Обновление шкалы энергии и текста на основе загруженного лимита
    updateEnergyBar();
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

