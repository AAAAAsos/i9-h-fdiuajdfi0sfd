// Загрузка сохранённых данных из localStorage
let balance = parseInt(localStorage.getItem("balance")) || 0;
let energy = 100; // Начальное количество энергии
let maxEnergy = parseInt(localStorage.getItem("maxEnergy")) || 100; // Загружаем maxEnergy из localStorage
let clickBonus = parseInt(localStorage.getItem("clickBonus")) || 1; // Загружаем clickBonus из localStorage
let multitapLevel = parseInt(localStorage.getItem("multitapLevel")) || 1;
let energyLimitLevel = parseInt(localStorage.getItem("energyLimitLevel")) || 1;
let isRestoringEnergy = false; // Флаг для контроля восстановления энергии

// Установка начального значения баланса и энергии
document.getElementById("balance").textContent = balance;
document.getElementById("energy").textContent = `${energy} / ${maxEnergy}`;

// Функция для восстановления энергии
function restoreEnergy() {
    if (energy < maxEnergy) {
        energy += 1;
        document.getElementById("energy").textContent = `${energy} / ${maxEnergy}`;
    } else {
        isRestoringEnergy = false;
    }
}

// Таймер для восстановления энергии каждые 0,25 секунды, если энергия восстанавливается
setInterval(() => {
    if (isRestoringEnergy) {
        restoreEnergy();
    }
}, 250);

// Обработчик клика на монету
document.getElementById("coin").addEventListener("click", (event) => {
    if (energy > 0) {
        balance += clickBonus;
        energy -= 1;

        document.getElementById("balance").textContent = balance;
        document.getElementById("energy").textContent = `${energy} / ${maxEnergy}`;
        localStorage.setItem("balance", balance);

        if (energy === 0 && !isRestoringEnergy) {
            isRestoringEnergy = true;
        }

        const clickEffect = document.createElement("div");
        clickEffect.classList.add("click-effect");
        clickEffect.textContent = `+${clickBonus}`;
        
        const coinRect = event.target.getBoundingClientRect();
        clickEffect.style.left = `${event.clientX - coinRect.left - 10}px`;
        clickEffect.style.top = `${event.clientY - coinRect.top - 10}px`;

        document.getElementById("coin").appendChild(clickEffect);

        setTimeout(() => {
            clickEffect.remove();
        }, 1000);

        const clickX = event.clientX - coinRect.left;
        const clickY = event.clientY - coinRect.top;
        const coin = document.getElementById("coin");

        if (clickX < coinRect.width / 3) {
            coin.style.transform = "rotateY(-30deg)";
        } else if (clickX > (coinRect.width * 2) / 3) {
            coin.style.transform = "rotateY(30deg)";
        } else if (clickY < coinRect.height / 3) {
            coin.style.transform = "rotateX(30deg)";
        } else if (clickY > (coinRect.height * 2) / 3) {
            coin.style.transform = "rotateX(-30deg)";
        }

        setTimeout(() => {
            coin.style.transform = "rotateX(0) rotateY(0)";
        }, 100);
    }
});

// Функция для показа уведомления
function showNotification(message, type) {
    const notificationContainer = document.getElementById("notification-container");
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    
    const icon = document.createElement("span");
    icon.className = "icon";
    icon.innerHTML = type === "success" ? "✔️" : "❌";
    notification.appendChild(icon);

    const text = document.createElement("span");
    text.textContent = message;
    notification.appendChild(text);

    const closeIcon = document.createElement("span");
    closeIcon.className = "close-icon";
    closeIcon.textContent = "✖";
    closeIcon.onclick = () => notification.remove();
    notification.appendChild(closeIcon);

    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Функция для покупки "МультиРобукс"
function buyMultitap() {
    const cost = 200 * multitapLevel; // Увеличиваем стоимость
    if (balance >= cost && multitapLevel < 8) {
        balance -= cost;
        clickBonus += multitapLevel; // Увеличиваем бонус клика
        multitapLevel += 1; // Увеличиваем уровень
        localStorage.setItem("balance", balance);
        localStorage.setItem("clickBonus", clickBonus);
        localStorage.setItem("multitapLevel", multitapLevel);
        closeUpgradeDetails();
        showNotification("МультиРобукс успешно улучшен!", "success");
    } else if (multitapLevel >= 8) {
        showNotification("Достигнут максимальный уровень!", "error");
    } else {
        showNotification("Недостаточно средств!", "error");
    }
}

// Функция для покупки "Лимит энергии"
function buyEnergyLimit() {
    const cost = 200 * energyLimitLevel; // Увеличиваем стоимость
    if (balance >= cost && energyLimitLevel < 8) {
        balance -= cost;
        maxEnergy += 50 * energyLimitLevel; // Увеличиваем максимальный запас энергии
        energyLimitLevel += 1; // Увеличиваем уровень
        localStorage.setItem("balance", balance);
        localStorage.setItem("maxEnergy", maxEnergy);
        localStorage.setItem("energyLimitLevel", energyLimitLevel);
        document.getElementById("energy").textContent = `${energy} / ${maxEnergy}`;
        closeUpgradeDetails();
        showNotification("Лимит энергии успешно улучшен!", "success");
    } else if (energyLimitLevel >= 8) {
        showNotification("Достигнут максимальный уровень!", "error");
    } else {
        showNotification("Недостаточно средств!", "error");
    }
}

// Функция для покупки восстановления энергии
function buyEnergyRestore() {
    if (balance >= 500) {
        balance -= 500;
        energy = maxEnergy; // Восстанавливаем энергию до максимума
        localStorage.setItem("balance", balance);
        document.getElementById("energy").textContent = `${energy} / ${maxEnergy}`;
        closeUpgradeDetails();
        showNotification("Энергия полностью восстановлена!", "success");
    } else {
        showNotification("Недостаточно средств!", "error");
    }
}

// Функция для обновления информации о стоимости и уровне в панели прокачки
function updateUpgradePanelInfo() {
    const multitapCost = 200 * multitapLevel;
    const energyLimitCost = 200 * energyLimitLevel;

    // Обновляем информацию для МультиРобукс
    document.querySelector("#multitap-cost").textContent = `${multitapCost}`;
    document.querySelector("#multitap-level").textContent = `${multitapLevel} уровень`;

    // Обновляем информацию для Лимит энергии
    document.querySelector("#energy-limit-cost").textContent = `${energyLimitCost}`;
    document.querySelector("#energy-limit-level").textContent = `${energyLimitLevel} уровень`;
}

// Функция для показа/скрытия панели прокачки с обновлением информации
function togglePanel() {
    const panel = document.getElementById("upgrade-panel");
    panel.classList.toggle("open");

    // Обновляем информацию о стоимости и уровне для каждого улучшения
    updateUpgradePanelInfo();
}

// Функция для открытия окна с описанием улучшения
function openUpgradeDetails(upgrade) {
    const details = document.getElementById("upgrade-details");
    const content = document.getElementById("upgrade-details-content");
    const upgradeButton = document.querySelector(".get-upgrade");

    // Сброс состояния кнопки перед настройкой
    upgradeButton.disabled = false;
    upgradeButton.classList.remove("locked");

    details.style.display = "flex";

    if (upgrade === "multitap") {
        const cost = 200 * multitapLevel;
        content.innerHTML = `
            <h2>МультиРобукс</h2>
            <p>Увеличивает количество тапов за одно нажатие.</p>
            <p>+${multitapLevel} тап за уровень.</p>
            <p><img src="coin.png" class="coin-icon"> ${cost} | ${multitapLevel} уровень</p>
        `;
        upgradeButton.textContent = `Купить за ${cost}`;
        upgradeButton.onclick = buyMultitap;
        if (multitapLevel >= 8) {
            upgradeButton.disabled = true;
            upgradeButton.classList.add("locked");
            upgradeButton.innerHTML = "🔒 Максимальный уровень";
        }
    } else if (upgrade === "energy") {
        const cost = 200 * energyLimitLevel;
        content.innerHTML = `
            <h2>Лимит энергии</h2>
            <p>Увеличивает максимальный лимит энергии.</p>
            <p>+${50 * energyLimitLevel} к максимальной энергии за уровень.</p>
            <p><img src="coin.png" class="coin-icon"> ${cost} | ${energyLimitLevel} уровень</p>
        `;
        upgradeButton.textContent = `Купить за ${cost}`;
        upgradeButton.onclick = buyEnergyLimit;
        if (energyLimitLevel >= 8) {
            upgradeButton.disabled = true;
            upgradeButton.classList.add("locked");
            upgradeButton.innerHTML = "🔒 Максимальный уровень";
        }
    } else if (upgrade === "restore") {
        content.innerHTML = `
            <h2>Восстановить энергию</h2>
            <p>Полностью восстанавливает запас энергии.</p>
            <p><img src="coin.png" class="coin-icon"> 500</p>
        `;
        upgradeButton.textContent = "Купить за 500";
        upgradeButton.onclick = buyEnergyRestore;
    }
}

// Функция для инициализации Telegram Web App
function initTelegramUser() {
    const user = Telegram.WebApp.initDataUnsafe?.user;

    if (user) {
        // Получаем элементы для отображения аватара и имени
        const userAvatar = document.getElementById("user-avatar");
        const userName = document.getElementById("user-name");

        // Устанавливаем аватар (или дефолтный, если нет URL)
        userAvatar.src = user.photo_url || "https://avatars.mds.yandex.net/i?id=9e5034f9f00e1fdedb4c9712c99df899ba4bedc7-6994888-images-thumbs&n=13"; // Замените "default_avatar.png" на URL к дефолтной аватарке
        userName.textContent = user.username || "Пользователь";
    }
}

// Открытие и закрытие панели "Друзья"
function toggleReferralPanel() {
    const panel = document.getElementById("referral-panel");
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
}

// Обработчик для кнопки "Друзья"
document.getElementById("friends-button").addEventListener("click", toggleReferralPanel);

// Функция генерации реферальной ссылки
function generateReferralLink(ownerId) {
    return `https://t.me/RobuxTapBot?start=${ownerId}`;
}

// Получение ID пользователя из Telegram Mini App
const ownerId = Telegram.WebApp.initDataUnsafe?.user?.id;
const referralLink = generateReferralLink(ownerId);
document.getElementById("invite-link").value = referralLink;

// Обработчик для копирования ссылки
document.getElementById("copy-link").addEventListener("click", () => {
    navigator.clipboard.writeText(referralLink).then(() => {
        showNotification("Ссылка успешно скопирована!", "success");
    }).catch(() => {
        showNotification("Ошибка копирования!", "error");
    });
});

// Функция для запроса бонуса и списка рефералов с сервера
async function fetchReferralData() {
    try {
        const response = await fetch(`https://yourserver.com/referral-data?user_id=${ownerId}`);
        const data = await response.json();

        // Отображаем бонус и список рефералов
        document.getElementById("ref-bonus").textContent = data.bonus || 0;
        document.getElementById("ref-count").textContent = data.referrals.length;

        const referralList = document.getElementById("referral-list");
        referralList.innerHTML = ""; // Очищаем текущий список

        data.referrals.forEach(referral => {
            const newReferral = document.createElement("li");
            newReferral.textContent = `Реферал ID: ${referral.id}`;
            referralList.appendChild(newReferral);
        });
    } catch (error) {
        console.error("Ошибка при загрузке данных рефералов:", error);
    }
}

// Инициализация панели "Друзья" при загрузке
document.addEventListener("DOMContentLoaded", () => {
    fetchReferralData(); // Загрузка данных о бонусах и рефералах
});


document.getElementById("boost-button").addEventListener("click", togglePanel);
