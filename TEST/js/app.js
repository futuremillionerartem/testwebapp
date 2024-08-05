const $clickableImage = document.querySelector('#clickable-image');
const $score = document.querySelector('#score');

function getScore() {
    return Number(localStorage.getItem('score')) || 0;
}

function setScore(score) {
    localStorage.setItem('score', score);
    $score.textContent = score;
}

function updateImage() {
    if (getScore() >= 50) {
        $clickableImage.src = 'templates/Token.png'; // Обнови путь, если нужно
    }
}

function addOne() {
    setScore(getScore() + 1);
    updateImage();
}

$clickableImage.addEventListener('click', (event) => {
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
    plusOne.style.left = `${event.clientX - rect.left + 50}px`;
    plusOne.style.top = `${event.clientY - rect.top + 300}px`;

    $clickableImage.parentElement.appendChild(plusOne);

    addOne();

    setTimeout(() => {
        plusOne.remove();
    }, 2000);
});

document.addEventListener('DOMContentLoaded', () => {
    setScore(getScore());
    updateImage();
});
