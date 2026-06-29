// Знаходимо наші порожні списки в HTML за їхніми ID
const bestsellersContainer = document.getElementById('bestsellers-container');
const bouquetsContainer = document.getElementById('bouquets-container');

// Адреса твого нового бекенду (переконайся, що сервер запущений на цьому порту)
const BASE_URL = 'http://localhost:3000/api';

// Асинхронна функція для отримання та відмальовування даних
async function fetchAndRenderData() {
  try {
    // 1. ПРАВКА: Повністю прибрано db.json. Робимо паралельні запити до реального беку
    const [bestsellersRes, bouquetsRes, feedbacksRes] = await Promise.all([
      axios.get(`${BASE_URL}/bestsellers`),
      axios.get(`${BASE_URL}/bouquets`),
      axios.get(`${BASE_URL}/feedbacks`)
    ]);

    const bestsellersData = bestsellersRes.data;
    const bouquetsData = bouquetsRes.data;
    const feedbacksData = feedbacksRes.data;

    // 2. Генеруємо HTML для секції Bestsellers (без зайвого тексту опису, чітко за Фігмою)
    if (bestsellersContainer && bestsellersData) {
      bestsellersContainer.innerHTML = bestsellersData.map(item => `
        <li class="bestsellers-item">
          <picture>
            <source type="image/webp" srcset="${item.image1x} 1x, ${item.image2x} 2x" />
            <img loading="lazy" src="${item.image1x}" alt="${item.title}" class="bestsellers-img" />
          </picture>
          <h3 class="bestsellers-item-title">${item.title}</h3>
          <p class="bestsellers-item-price">$${item.price}</p>
        </li>
      `).join('');
      
      // ПРАВКА №2: Рахуємо сторінки та розблоковуємо кнопки пагінації слайдера
      setupSliderPagination(bestsellersData.length, 'bestsellers-pagination');
    }

    // 3. Генеруємо HTML для секції Bouquets (Каталог)
    if (bouquetsContainer && bouquetsData) {
      bouquetsContainer.innerHTML = bouquetsData.map(item => `
        <li>
          <picture>
            <source type="image/webp" srcset="${item.image1x} 1x, ${item.image2x} 2x" />
            <img loading="lazy" src="${item.image1x}" alt="${item.title}" class="catalogue-img" />
          </picture>
          <h3 class="catalogue-item-title">${item.title}</h3>
          <p class="catalogue-item-price">$${item.price}</p>
        </li>
      `).join('');

      // ПРАВКА №3: Якщо всі букети завантажені — ховаємо кнопку "Show more"
      const showMoreBtn = document.querySelector('.show-more-btn') || document.getElementById('show-more-btn');
      if (showMoreBtn) {
        showMoreBtn.style.display = 'none';
      }
    }

    // 4. ПРАВКА №1: Завантажуємо та рендеримо фідбеки (коментарі) з бекенду
    const feedbackContainer = document.getElementById('feedback-container') || document.querySelector('.feedback-list');
    if (feedbackContainer && feedbacksData) {
      feedbackContainer.innerHTML = feedbacksData.map(item => `
        <li class="feedback-item">
          <p class="feedback-text">"${item.text}"</p>
          <h4 class="feedback-author">${item.author || item.name}</h4>
        </li>
      `).join('');
      
      // Налаштовуємо пагінацію і для відгуків
      setupSliderPagination(feedbacksData.length, 'feedback-pagination');
    }

    // Даємо браузеру коротеньку паузу на рендер HTML, після чого ініціалізуємо слайдери
    if (typeof window.initSliders === 'function') {
      setTimeout(() => {
        window.initSliders();
      }, 100);
    }

  } catch (error) {
    console.error("Помилка під час завантаження даних з бекенду:", error);
  }
}

// Допоміжна функція для динамічного налаштування крапок та активації кнопок слайдера
function setupSliderPagination(itemsCount, paginationClass) {
  const paginationBlock = document.querySelector(`.${paginationClass}`) || document.getElementById(paginationClass);
  if (!paginationBlock) return;

  const dotsContainer = paginationBlock.querySelector('.pagination-dots');
  const prevBtn = paginationBlock.querySelector('.prev-btn') || paginationBlock.querySelector('.slider-btn:first-of-type');
  const nextBtn = paginationBlock.querySelector('.next-btn') || paginationBlock.querySelector('.slider-btn:last-of-type');

  // Визначаємо кількість сторінок: на мобілці по 1 картці, на десктопі по 3
  const itemsPerPage = window.innerWidth < 768 ? 1 : 3;
  const totalPages = Math.ceil(itemsCount / itemsPerPage);

  // Малюємо крапки пагінації
  if (dotsContainer) {
    dotsContainer.innerHTML = Array.from({ length: totalPages })
      .map((_, index) => `<li class="dot ${index === 0 ? 'active' : ''}"></li>`)
      .join('');
  }

  // Знімаємо задізейбленість з кнопок, якщо сторінок більше ніж одна
  if (prevBtn && nextBtn) {
    if (totalPages <= 1) {
      prevBtn.disabled = true;
      nextBtn.disabled = true;
      prevBtn.style.opacity = '0.5';
      nextBtn.style.opacity = '0.5';
    } else {
      prevBtn.disabled = false;
      nextBtn.disabled = false;
      prevBtn.style.opacity = '1';
      nextBtn.style.opacity = '1';
    }
  }
}

// Запускаємо повний цикл завантаження даних
fetchAndRenderData();