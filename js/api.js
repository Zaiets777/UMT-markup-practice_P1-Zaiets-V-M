// Знаходимо наші порожні списки в HTML за їхніми ID
const bestsellersContainer = document.getElementById('bestsellers-container');
const bouquetsContainer = document.getElementById('bouquets-container');

// Асинхронна функція для отримання та відмальовування даних
async function fetchAndRenderBouquets() {
  try {
    // 1. Робимо запит до нашої "бази даних" за допомогою axios
    const response = await axios.get('./db.json');
    const data = response.data;

    // 2. Генеруємо HTML для секції Bestsellers
    if (bestsellersContainer) {
      const bestsellersHTML = data.bestsellers.map(item => `
        <li class="bestsellers-item">
          <picture>
            <source type="image/webp" srcset="${item.image1x} 1x, ${item.image2x} 2x" />
            <img loading="lazy" src="${item.image1x}" alt="${item.title}" class="bestsellers-img" />
          </picture>
          <h3 class="bestsellers-item-title">${item.title}</h3>
          <p class="text bestsellers-item-text">${item.description}</p>
          <p class="bestsellers-item-price">$${item.price}</p>
        </li>
      `).join('');

      // Вставляємо згенерований код у контейнер
      bestsellersContainer.insertAdjacentHTML('beforeend', bestsellersHTML);
    }

    // 3. Генеруємо HTML для секції Bouquets (Каталог)
    if (bouquetsContainer) {
      const bouquetsHTML = data.bouquets.map(item => `
        <li>
          <picture>
            <source type="image/webp" srcset="${item.image1x} 1x, ${item.image2x} 2x" />
            <img loading="lazy" src="${item.image1x}" alt="${item.title}" class="catalogue-img" />
          </picture>
          <h3 class="catalogue-item-title">${item.title}</h3>
          <p class="text bestsellers-item-text">${item.description}</p>
          <p class="catalogue-item-price">$${item.price}</p>
        </li>
      `).join('');

      // Вставляємо згенерований код у контейнер
      bouquetsContainer.insertAdjacentHTML('beforeend', bouquetsHTML);
    }

  // Даємо браузеру 100 мілісекунд на відмальовку HTML, а потім "будимо" слайдер!
    if (typeof window.initSliders === 'function') {
      setTimeout(() => {
        window.initSliders();
      }, 100);
    }

  } catch (error) {
    console.error("Помилка під час завантаження букетів:", error);
  }
}

// Запускаємо функцію, коли скрипт завантажився
fetchAndRenderBouquets();