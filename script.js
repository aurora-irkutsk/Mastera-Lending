// ============================================
// АНИМАЦИЯ НАБЕГАЮЩИХ ЦИФР
// ============================================

function animateCounter(element, target, duration = 6000) {
    let start = 0;
    const startTime = performance.now();
    const isPlus = target === 500 || target === 50;
    
    // Функция плавного замедления к концу
    function easeOutQuad(t) {
        return t * (2 - t);
    }
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuad(progress);
        
        start = Math.floor(easedProgress * target);
        
        if (progress < 1) {
            element.textContent = isPlus ? `${start}+` : start;
            requestAnimationFrame(animate);
        } else {
            element.textContent = isPlus ? `${target}+` : target;
        }
    }
    
    requestAnimationFrame(animate);
}

// ============================================
// НАБЛЮДАТЕЛЬ ДЛЯ МОБИЛЬНЫХ И ДЕСКТОП
// ============================================

// Улучшенные настройки для мобильных устройств
const observerOptions = {
    threshold: 0.1, // Уменьшаем с 0.3 до 0.1 для мобильных
    rootMargin: '0px 0px -20px 0px' // Уменьшаем отступ
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Если это stat-number, запускаем анимацию цифр
            if (entry.target.classList.contains('stat-number')) {
                const text = entry.target.textContent.trim();
                let targetNumber;
                
                // Проверяем содержимое более надёжно
                if (text === '500+' || text.includes('500')) {
                    targetNumber = 500;
                } else if (text === '50+' || text.includes('50')) {
                    targetNumber = 50;
                } else if (text === '24/7' || text.includes('24')) {
                    // Для 24/7 не анимируем, оставляем как есть
                    return;
                }
                
                // Запускаем анимацию только один раз
                if (!entry.target.dataset.animated && targetNumber) {
                    entry.target.dataset.animated = 'true';
                    
                    // Небольшая задержка для мобильных устройств
                    setTimeout(() => {
                        animateCounter(entry.target, targetNumber, 6000);
                    }, 100);
                }
            }
        }
    });
}, observerOptions);

// ============================================
// ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Небольшая задержка для корректной работы на мобильных
    setTimeout(() => {
        // Наблюдаем за статистикой для анимации цифр
        document.querySelectorAll('.stat-number').forEach(stat => {
            observer.observe(stat);
            
            // Debug для проверки (можно удалить после тестирования)
            console.log('Наблюдаем за:', stat.textContent);
        });
    }, 300);
});

// ============================================
// ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА ДЛЯ iOS
// ============================================

// На iOS иногда нужен дополнительный триггер
window.addEventListener('load', () => {
    setTimeout(() => {
        // Принудительно проверяем видимость элементов
        document.querySelectorAll('.stat-number').forEach(stat => {
            const rect = stat.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !stat.dataset.animated) {
                const text = stat.textContent.trim();
                let targetNumber;
                
                if (text === '500+' || text.includes('500')) {
                    targetNumber = 500;
                } else if (text === '50+' || text.includes('50')) {
                    targetNumber = 50;
                }
                
                if (targetNumber) {
                    stat.dataset.animated = 'true';
                    setTimeout(() => {
                        animateCounter(stat, targetNumber, 6000);
                    }, 100);
                }
            }
        });
    }, 500);
});