// ============================================
// ОПТИМИЗИРОВАННЫЙ SCRIPT.JS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация всех модулей
    initStatsAnimation();
    initScrollAnimation();
    initSmoothScroll();
    initButtonHoverEffects();
    initOnlineCounter();
});

// ============================================
// 1. АНИМАЦИЯ ЦИФР (УНИВЕРСАЛЬНАЯ)
// ============================================

function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length === 0) return;

    // Настройка наблюдателя
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const element = entry.target;
                const target = parseInt(element.dataset.target, 10);
                const suffix = element.dataset.suffix || '';
                
                // Отмечаем как анимированный
                element.dataset.animated = 'true';
                
                // Запускаем анимацию
                animateCounter(element, target, 2500, suffix);
                
                // Перестаем следить после запуска
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Подготовка и наблюдение за элементами
    stats.forEach(stat => {
        // Если data-target уже есть, используем его
        if (!stat.dataset.target) {
            // Иначе извлекаем из текста
            const rawText = stat.textContent.trim();
            const match = rawText.match(/^(\d+)(.*)$/);
            
            if (match) {
                stat.dataset.target = match[1];
                stat.dataset.suffix = match[2];
            } else {
                return; // Пропускаем элементы без чисел
            }
        }

        // Сбрасываем визуальное значение
        stat.textContent = '0' + (stat.dataset.suffix || '');
        
        // Начинаем наблюдение
        observer.observe(stat);
    });
}

function animateCounter(element, target, duration, suffix) {
    const startTime = performance.now();

    // Функция плавности (Ease Out Quint)
    function easeOutQuint(t) {
        return 1 - Math.pow(1 - t, 5);
    }

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuint(progress);
        const current = Math.floor(easedProgress * target);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            element.textContent = target + suffix;
        }
    }

    requestAnimationFrame(animate);
}

// ============================================
// 2. АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ
// ============================================

function initScrollAnimation() {
    const elementsToAnimate = document.querySelectorAll('.section-card');
    
    if (!window.IntersectionObserver) {
        // Fallback для старых браузеров
        elementsToAnimate.forEach(el => el.style.opacity = 1);
        return;
    }

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.scrollAnimated) {
                entry.target.dataset.scrollAnimated = 'true';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    // Подготовка элементов
    elementsToAnimate.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        scrollObserver.observe(card);
    });
}

// ============================================
// 3. ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК
// ============================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// 4. ЭФФЕКТЫ НАВЕДЕНИЯ НА КНОПКИ
// ============================================

function initButtonHoverEffects() {
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
}

// ============================================
// 5. АНИМАЦИЯ ИКОНОК
// ============================================

function animateIcons() {
    const icons = document.querySelectorAll('.section-icon');
    icons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.animation = 'bounce 2s ease-in-out infinite';
        }, index * 200);
    });
}

// Запуск анимации иконок после загрузки
window.addEventListener('load', () => {
    setTimeout(animateIcons, 500);
});

// ============================================
// 6. СЧЕТЧИК ОНЛАЙН МАСТЕРОВ (ЖИВАЯ СТАТИСТИКА)
// ============================================

function initOnlineCounter() {
    const counterElement = document.querySelector('.online-count');
    if (!counterElement) return;

    const minCount = 3;   // Минимальное количество мастеров
    const maxCount = 58;  // Максимальное количество мастеров
    
    // Генерируем случайное начальное значение при каждой загрузке страницы (от 1 до 12)
    const initialCount = Math.floor(Math.random() * 12) + 1;
    counterElement.textContent = initialCount;
    let currentCount = initialCount;
    
    // Функция обновления счетчика
    function updateCounter() {
        // Генерируем небольшое изменение от текущего значения (от -8 до +8)
        const minChange = -8;
        const maxChange = 8;
        const change = Math.floor(Math.random() * (maxChange - minChange + 1)) + minChange;
        
        // Применяем изменение, но остаёмся в пределах от 3 до 58
        let targetCount = currentCount + change;
        targetCount = Math.max(minCount, Math.min(maxCount, targetCount));
        
        // Добавляем визуальный эффект
        counterElement.classList.add('updating');
        
        // Мгновенная смена числа (без анимации набегания)
        setTimeout(() => {
            counterElement.textContent = targetCount;
            counterElement.classList.remove('updating');
            currentCount = targetCount;
        }, 150);
    }
    
    // Обновляем каждые 12-20 секунд
    function scheduleNextUpdate() {
        const delay = Math.random() * 8000 + 12000; // 12-20 секунд
        setTimeout(() => {
            updateCounter();
            scheduleNextUpdate();
        }, delay);
    }
    
    // Запускаем через 5 секунд после загрузки
    setTimeout(() => {
        scheduleNextUpdate();
    }, 5000);
}

// ============================================
// FAQ АККОРДЕОН
// ============================================

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Закрываем все остальные FAQ
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий FAQ
            item.classList.toggle('active');
        });
    });
}

// Инициализация FAQ при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initFAQ();
});
