// Данные мемов с вашими изображениями
const memesData = [
    { id: 1, title: "Отвлеченный парень", category: "classic", image: "https://media.wired.com/photos/59a459d3b345f64511c5e3d4/master/pass/MemeLoveTriangle_297886754.jpg", description: "Парень, оборачивающийся на другую девушку.", source: "Stock Photo", rating: 0 },
    { id: 3, title: "Doge", category: "animals", image: "https://transcode-v2.app.engoo.com/image/fetch/f_auto,c_lfill,w_300,dpr_3/https://assets.app.engoo.com/organizations/5d2656f1-9162-461d-88c7-b2505623d8cb/images/2YcjMiWiJMGI36fisbtlZJ.jpeg", description: "Шиба-ину с забавными мыслями.", source: "Tumblr", rating: 0 },
    { id: 4, title: "Лягушка Пепе", category: "classic", image: "https://ichef.bbci.co.uk/ace/standard/976/cpsprodpb/16620/production/_91408619_55df76d5-2245-41c1-8031-07a4da3f313f.jpg", description: "Лягушка с множеством эмоций.", source: "4chan", rating: 10 },
    { id: 5, title: "Дрейк", category: "classic", image: "https://ru.meming.world/images/ru/thumb/2/28/Drakeposting_meme_2.jpg/240px-Drakeposting_meme_2.jpg", description: "Дрейк, одобряющий и отвергающий.", source: "YouTube", rating: 2 },
    { id: 6, title: "Успешный мальчик", category: "classic", image: "https://s.abcnews.com/images/Health/HT_sam_griner_then_02_jef_150413_16x9_992.jpg?w=384", description: "Малыш с кулаком, символизирующий успех.", source: "Flickr", rating: 0 },
    { id: 8, title: "Плачущий котик", category: "animals", image: "https://smartlandapartments.com/media/articles/CLE-3-Blog-8.jpg", description: "Кот с грустными глазами.", source: "Twitter", rating: -5 },
    { id: 10, title: "Amogus", category: "gaming", image: "https://cdn-images.dzcdn.net/images/cover/5428172df3ee52b457ccfbfdded21fdb/1900x1900-000000-80-0-0.jpg", description: "Мем из Among Us.", source: "Twitch", rating: 123 },
];

// Загрузка сохраненных мемов из localStorage
let memes = JSON.parse(localStorage.getItem('memes')) || memesData;

// Загрузка пользовательских оценок
let userRatings = JSON.parse(localStorage.getItem('userRatings')) || {};

// Синхронизация рейтингов с userRatings при загрузке
memes = memes.map(meme => {
    const userRating = userRatings[meme.id] || 0;
    return { ...meme, rating: meme.rating + userRating };
});

// Элементы DOM
const gallery = document.getElementById('gallery');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalSource = document.getElementById('modalSource');
const ratingCount = document.getElementById('ratingCount');
const likeBtn = document.getElementById('likeBtn');
const dislikeBtn = document.getElementById('dislikeBtn');
const closeModal = document.querySelector('#modal .close');
const navLinks = document.querySelectorAll('.nav-link');
const logo = document.getElementById('logo');
const addMemeBtn = document.getElementById('addMemeBtn');
const addMemeModal = document.getElementById('addMemeModal');
const closeAddModal = document.getElementById('closeAddModal');
const submitMemeBtn = document.getElementById('submitMemeBtn');
const memeTitleInput = document.getElementById('memeTitle');
const memeImageInput = document.getElementById('memeImage');
const memeTagInput = document.getElementById('memeTag');
const memeDescriptionInput = document.getElementById('memeDescription');
const memeSourceInput = document.getElementById('memeSource');
const fullImageModal = document.getElementById('fullImageModal');
const fullImage = document.getElementById('fullImage');
const closeFullImageModal = document.getElementById('closeFullImageModal');
const easterModal = document.getElementById('easterModal');
const closeEasterModal = document.getElementById('closeEasterModal');
const rickrollVideo = document.getElementById('rickrollVideo');

// Убедимся, что все модальные окна скрыты при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    fullImageModal.style.display = 'none';
    fullImage.src = '';
    easterModal.style.display = 'none';
});

// Пагинация
const memesPerPage = 6;
let currentPage = 1;

// Отображение мемов
function displayMemes(memesToShow, page = 1) {
    gallery.innerHTML = '';
    const start = (page - 1) * memesPerPage;
    const end = start + memesPerPage;
    const paginatedMemes = memesToShow.slice(start, end);

    if (paginatedMemes.length === 0 && page === 1) {
        gallery.innerHTML = '<p>Мемы не найдены.</p>';
        pagination.innerHTML = '';
        return;
    }

    paginatedMemes.forEach(meme => {
        const memeCard = document.createElement('div');
        memeCard.classList.add('meme-card');
        memeCard.innerHTML = `
            <img src="${meme.image}" alt="${meme.title}" onerror="this.src='https://via.placeholder.com/300x200.png?text=Нет+изображения'">
            <h3>${meme.title}</h3>
            <div class="rating">
                <button class="card-like-btn" data-id="${meme.id}">👍</button>
                <span>${meme.rating}</span>
                <button class="card-dislike-btn" data-id="${meme.id}">👎</button>
            </div>
        `;
        memeCard.addEventListener('click', (e) => {
            if (e.target.tagName.toLowerCase() !== 'img' && !e.target.classList.contains('card-like-btn') && !e.target.classList.contains('card-dislike-btn')) {
                openModal(meme);
            }
        });
        memeCard.querySelector('.card-like-btn').addEventListener('click', () => updateRating(meme, 1));
        memeCard.querySelector('.card-dislike-btn').addEventListener('click', () => updateRating(meme, -1));
        updateButtonStates(memeCard, meme.id);
        gallery.appendChild(memeCard);
    });

    updatePagination(memesToShow, page);
}

// Обновление состояния кнопок лайка/дизлайка
function updateButtonStates(memeCard, memeId) {
    const likeBtn = memeCard.querySelector('.card-like-btn');
    const dislikeBtn = memeCard.querySelector('.card-dislike-btn');
    const userRating = userRatings[memeId] || 0;

    likeBtn.disabled = userRating === 1;
    dislikeBtn.disabled = userRating === -1;
}

// Обновление пагинации
function updatePagination(memesToShow, page) {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(memesToShow.length / memesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        if (i === page) button.classList.add('active');
        button.addEventListener('click', () => {
            currentPage = i;
            displayMemes(memesToShow, i);
        });
        pagination.appendChild(button);
    }
}

// Открытие модального окна с деталями
function openModal(meme) {
    modal.style.display = 'flex';
    modalImage.src = meme.image;
    modalImage.onerror = () => {
        modalImage.src = 'https://via.placeholder.com/300x200.png?text=Нет+изображения';
    };
    modalTitle.value = meme.title; // Устанавливаем название в поле ввода
    modalDescription.value = meme.description || '';
    modalSource.value = meme.source || '';
    ratingCount.textContent = meme.rating;
    likeBtn.dataset.id = meme.id;
    dislikeBtn.dataset.id = meme.id;
    likeBtn.disabled = userRatings[meme.id] === 1;
    dislikeBtn.disabled = userRatings[meme.id] === -1;
    likeBtn.onclick = () => updateRating(meme, 1);
    dislikeBtn.onclick = () => updateRating(meme, -1);

    // Сохранение изменений
    modalTitle.onchange = () => {
        meme.title = modalTitle.value.trim();
        if (!meme.title) {
            alert('Название не может быть пустым!');
            meme.title = 'Без названия';
            modalTitle.value = meme.title;
        }
        localStorage.setItem('memes', JSON.stringify(memes));
        displayMemes(getFilteredMemes(), currentPage);
    };
    modalDescription.onchange = () => {
        meme.description = modalDescription.value;
        localStorage.setItem('memes', JSON.stringify(memes));
    };
    modalSource.onchange = () => {
        meme.source = modalSource.value;
        localStorage.setItem('memes', JSON.stringify(memes));
    };

    // Увеличение изображения
    modalImage.onclick = () => {
        openFullImageModal(modalImage.src);
    };
}

// Открытие модального окна с увеличенным изображением
function openFullImageModal(imageSrc) {
    fullImageModal.style.display = 'flex';
    fullImage.src = imageSrc;
    fullImage.onerror = () => {
        fullImage.src = 'https://via.placeholder.com/300x200.png?text=Нет+изображения';
    };
}

// Открытие модального окна для пасхалки (Rickroll)
function openEasterModal() {
    easterModal.style.display = 'flex';
    rickrollVideo.play().catch(error => {
        console.error('Ошибка воспроизведения видео:', error);
    });
}

// Обновление рейтинга
function updateRating(meme, value) {
    let userRating = userRatings[meme.id] || 0;

    if (userRating === value) return; // Нельзя поставить ту же оценку

    // Откатываем старую оценку
    if (userRating !== 0) {
        meme.rating -= userRating;
    }

    // Применяем новую оценку
    userRating = value;
    meme.rating += value;

    // Сохраняем изменения
    userRatings[meme.id] = userRating;
    localStorage.setItem('userRatings', JSON.stringify(userRatings));
    localStorage.setItem('memes', JSON.stringify(memes));

    // Обновляем интерфейс
    ratingCount.textContent = meme.rating;
    likeBtn.disabled = userRating === 1;
    dislikeBtn.disabled = userRating === -1;
    displayMemes(getFilteredMemes(), currentPage);
}

// Закрытие модальных окон
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

closeAddModal.addEventListener('click', () => {
    addMemeModal.style.display = 'none';
});

closeFullImageModal.addEventListener('click', () => {
    fullImageModal.style.display = 'none';
});

closeEasterModal.addEventListener('click', () => {
    easterModal.style.display = 'none';
    rickrollVideo.pause();
    rickrollVideo.currentTime = 0;
});

fullImageModal.addEventListener('click', (e) => {
    if (e.target === fullImageModal) {
        fullImageModal.style.display = 'none';
    }
});

easterModal.addEventListener('click', (e) => {
    if (e.target === easterModal) {
        easterModal.style.display = 'none';
        rickrollVideo.pause();
        rickrollVideo.currentTime = 0;
    }
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

// Фильтрация по категориям
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        currentPage = 1;
        displayMemes(getFilteredMemes(), currentPage);
    });
});

// Поиск мемов
searchInput.addEventListener('input', () => {
    currentPage = 1;
    displayMemes(getFilteredMemes(), currentPage);
});

function getFilteredMemes() {
    const query = searchInput.value.toLowerCase();
    const activeCategory = document.querySelector('.nav-link.active').dataset.category;
    return memes.filter(meme =>
        (activeCategory === 'all' || meme.category === activeCategory) &&
        (meme.title.toLowerCase().includes(query) ||
         (meme.description && meme.description.toLowerCase().includes(query)) ||
         meme.category.toLowerCase().includes(query))
    );
}

// Добавление нового мема
addMemeBtn.addEventListener('click', () => {
    addMemeModal.style.display = 'flex';
});

submitMemeBtn.addEventListener('click', () => {
    const title = memeTitleInput.value.trim();
    const image = memeImageInput.value.trim();
    const category = memeTagInput.value;
    const description = memeDescriptionInput.value.trim();
    const source = memeSourceInput.value.trim();

    if (!title || !image || !category) {
        alert('Заполните обязательные поля: название, изображение и категорию!');
        return;
    }

    const newMeme = {
        id: memes.length + 1,
        title,
        category,
        image,
        description: description || 'Добавлено пользователем',
        source: source || 'Пользователь',
        rating: 0
    };

    memes.push(newMeme);
    localStorage.setItem('memes', JSON.stringify(memes));
    memeTitleInput.value = '';
    memeImageInput.value = '';
    memeTagInput.value = '';
    memeDescriptionInput.value = '';
    memeSourceInput.value = '';
    addMemeModal.style.display = 'none';
    displayMemes(getFilteredMemes(), currentPage);
});

// Пасхалка (Rickroll)
let clickCount = 0;
logo.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 3) {
        openEasterModal();
        clickCount = 0;
    }
});

// Инициализация
displayMemes(memes, currentPage);