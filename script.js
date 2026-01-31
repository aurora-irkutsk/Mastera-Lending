// ============================================
// АНИМАЦИЯ НАБЕГАЮЩИХ ЦИФР
// ============================================

function animateCounter(element, target, duration = 2000, suffix = '') {
    let start = 0;
    const startTime = performance.now();
    
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
            element.textContent = `${start}${suffix}`;
            requestAnimationFrame(animate);
        } else {
            element.textContent = `${target}${suffix}`;
        }
    }
    
    requestAnimationFrame(animate);
}

// ============================================
// ПОДГОТОВКА ЭЛЕМЕНТОВ ДЛЯ АНИМАЦИИ
// ============================================

function prepareStatsForAnimation() {
    document.querySelectorAll('.stat-number').forEach(stat => {
        const text = stat.textContent.trim();
        
        // Сохраняем оригинальное значение
        stat.dataset.originalValue = text;
        
        // Определяем целевое число и суффикс
        if (text.includes('500') || text === '500+') {
            stat.dataset.target = '500';
            stat.dataset.suffix = '+';
            stat.textContent = '0+'; // Начинаем с 0
            
        } else if (text.includes('2000') || text === '2000+') {
            stat.dataset.target = '2000';
            stat.dataset.suffix = '+';
            stat.textContent = '0+'; // Начинаем с 0
            
        } else if (text.includes('15')) {
            stat.dataset.target = '15';
            stat.dataset.suffix = ' мин';
            stat.textContent = '0 мин'; // Начинаем с 0
            
        } else if (text.includes('4.8') || text.includes('★')) {
            stat.dataset.target = 'rating';
            // Для рейтинга просто скрываем
            stat.style.opacity = '0';
            stat.style.transform = 'scale(0.8)';
        }
    });
}

// ============================================
// АНИМАЦИЯ ИКОНОК В КАРТОЧКАХ
// ============================================

function animateIcons() {
    const icons = document.querySelectorAll('.section-icon');
    
    icons.forEach((icon, index) => {
        // Добавляем задержку для каждой иконки
        setTimeout(() => {
            icon.style.animation = 'bounce 2s ease-in-out infinite';
        }, index * 200);
    });
}

// ============================================
// НАБЛЮДАТЕЛЬ ДЛЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ
// ============================================

const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            
            // Если это stat-number - запускаем анимацию цифр
            if (entry.target.classList.contains('stat-number')) {
                const target = entry.target.dataset.target;
                const suffix = entry.target.dataset.suffix || '';
                
                if (target === '500') {
                    setTimeout(() => {
                        animateCounter(entry.target, 500, 2000, suffix);
                    }, 100);
                    
                } else if (target === '2000') {
                    setTimeout(() => {
                        animateCounter(entry.target, 2000, 2500, suffix);
                    }, 100);
                    
                } else if (target === '15') {
                    setTimeout(() => {
                        animateCounter(entry.target, 15, 1500, suffix);
                    }, 100);
                    
                } else if (target === 'rating') {
                    // Для рейтинга - плавное появление
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, 300);
                }
            }
            
            // Если это section-card - добавляем анимацию появления
            if (entry.target.classList.contains('section-card')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);

// ============================================
// ПЛАВНАЯ ПРОКРУТКА ДЛЯ ЯКОРНЫХ ССЫЛОК
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Игнорируем пустые якори
        if (href === '#' || href === '#!') {
            return;
        }
        
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

// ============================================
// АНИМАЦИЯ КНОПОК ПРИ НАВЕДЕНИИ
// ============================================

document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
});

// ============================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // ВАЖНО: Сначала подготавливаем элементы (заменяем цифры на 0)
    prepareStatsForAnimation();
    
    // Запускаем анимацию иконок
    setTimeout(() => {
        animateIcons();
    }, 500);
    
    // Наблюдаем за статистикой
    setTimeout(() => {
        document.querySelectorAll('.stat-number').forEach(stat => {
            observer.observe(stat);
        });
        
        // Наблюдаем за карточками
        document.querySelectorAll('.section-card').forEach(card => {
            observer.observe(card);
        });
    }, 300);
    
    // Добавляем начальное состояние для карточек
    document.querySelectorAll('.section-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
});

// ============================================
// ДОПОЛНИТЕЛЬНАЯ ПРОВЕРКА ДЛЯ iOS И SAFARI
// ============================================

window.addEventListener('load', () => {
    // Проверяем, подготовлены ли элементы
    const firstStat = document.querySelector('.stat-number');
    if (firstStat && !firstStat.dataset.target) {
        prepareStatsForAnimation();
    }
    
    setTimeout(() => {
        // Принудительно проверяем видимость элементов
        document.querySelectorAll('.stat-number').forEach(stat => {
            const rect = stat.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !stat.dataset.animated) {
                const target = stat.dataset.target;
                const suffix = stat.dataset.suffix || '';
                stat.dataset.animated = 'true';
                
                if (target === '500') {
                    setTimeout(() => {
                        animateCounter(stat, 500, 2000, suffix);
                    }, 100);
                    
                } else if (target === '2000') {
                    setTimeout(() => {
                        animateCounter(stat, 2000, 2500, suffix);
                    }, 100);
                    
                } else if (target === '15') {
                    setTimeout(() => {
                        animateCounter(stat, 15, 1500, suffix);
                    }, 100);
                    
                } else if (target === 'rating') {
                    setTimeout(() => {
                        stat.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                        stat.style.opacity = '1';
                        stat.style.transform = 'scale(1)';
                    }, 300);
                }
            }
        });
        
        // Проверяем карточки
        document.querySelectorAll('.section-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible && !card.dataset.animated) {
                card.dataset.animated = 'true';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }
        });
    }, 500);
});

// ============================================
// ОТСЛЕЖИВАНИЕ КЛИКОВ ДЛЯ ЯНДЕКС.МЕТРИКИ
// ============================================

document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        const buttonText = this.querySelector('.cta-main')?.textContent || 'unknown';
        console.log('Клик по кнопке:', buttonText);
        
        // Дополнительная аналитика (опционально)
        if (typeof ym !== 'undefined') {
            if (this.classList.contains('cta-masters')) {
                ym(106537206, 'reachGoal', 'click_masters');
            } else if (this.classList.contains('cta-clients')) {
                ym(106537206, 'reachGoal', 'click_clients');
            } else if (this.classList.contains('cta-footer')) {
                ym(106537206, 'reachGoal', 'click_footer');
            }
        }
    });
});

// ============================================
// АНИМАЦИЯ ПРИ ПРОКРУТКЕ
// ============================================

let lastScrollTop = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Анимация для элементов при скролле вниз
    if (scrollTop > lastScrollTop) {
        document.querySelectorAll('.stat-item, .section-card').forEach(element => {
            const rect = element.getBoundingClientRect();
            
            if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
                if (!element.dataset.scrollAnimated) {
                    element.dataset.scrollAnimated = 'true';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            }
        });
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
}, false);

console.log('🚀 JavaScript загружен! Анимация цифр активирована.');