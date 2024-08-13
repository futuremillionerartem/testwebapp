const $clickableImage = document.querySelector('#clickable-image');
const $score = document.querySelector('#score');
const $energyBar = document.querySelector('#energy-bar');
const $energyText = document.querySelector('#energy-value');
let energy = getEnergy();  // Инициализация глобальной переменной energy
let energyRegenInterval;  // Переменная для хранения интервала восстановления энергии
let regenDelayTimeout;  // Переменная для хранения таймера задержки

function getScore() {
    return Number(localStorage.getItem('score')) || 0;
}

function setScore(score) {
    localStorage.setItem('score', score);
    $score.textContent = score;
}

function getEnergy() {
    return Number(localStorage.getItem('energy')) || 100;  // по умолчанию 100
}

function setEnergy(newEnergy) {
    energy = newEnergy;  // Обновляем глобальную переменную energy
    localStorage.setItem('energy', energy);
    updateEnergyBar();
}

function addOne() {
    setScore(getScore() + 1);
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
        plusOne.textContent = '+1';
        plusOne.style.left = `${event.clientX}px`;
        plusOne.style.top = `${event.clientY}px`;

        $clickableImage.parentElement.appendChild(plusOne);

        addOne();

        setTimeout(() => {
            plusOne.remove();
        }, 2000);

        // Уменьшение энергии при клике
        setEnergy(energy - 1);  // Обновление энергии при клике

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

document.addEventListener('DOMContentLoaded', () => {
    setScore(getScore());
    setEnergy(getEnergy());
});

// Логика для шкалы энергии
function updateEnergyBar() {
    $energyBar.style.width = `${energy}%`;
    $energyText.textContent = `${energy}/100`;
}

function startRegenEnergy() {
    if (!energyRegenInterval && energy < 100) {
        energyRegenInterval = setInterval(regenEnergy, 1900);
    }
}

function regenEnergy() {
    if (energy < 100) {
        setEnergy(energy + 1);
    } else {
        clearInterval(energyRegenInterval);
        energyRegenInterval = null;
    }
}
