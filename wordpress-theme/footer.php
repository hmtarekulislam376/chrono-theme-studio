<footer class="site-footer">
    <div class="footer-content">
        <div class="footer-section">
            <h4>Productivity Hub</h4>
            <p>Your daily productivity companion with beautiful themes and music integration.</p>
        </div>
        
        <div class="footer-section">
            <h4>Quick Links</h4>
            <ul>
                <li><a href="<?php echo esc_url(home_url('/')); ?>">Home</a></li>
                <li><a href="#blog">Blog</a></li>
                <li><a href="#apps">Recommended Apps</a></li>
                <li><a href="#music">Music Playlists</a></li>
            </ul>
        </div>
        
        <div class="footer-section">
            <h4>Features</h4>
            <ul>
                <li>Pomodoro Timer</li>
                <li>Stopwatch & Countdown</li>
                <li>Dynamic Backgrounds</li>
                <li>Music Integration</li>
            </ul>
        </div>
        
        <div class="footer-section">
            <h4>Themes</h4>
            <div class="theme-quick-switch">
                <button class="mini-theme-btn" data-theme="anime" title="Anime Theme">🌸</button>
                <button class="mini-theme-btn" data-theme="minimal" title="Minimal Theme">⚪</button>
                <button class="mini-theme-btn" data-theme="tech" title="Tech Theme">🔷</button>
                <button class="mini-theme-btn" data-theme="music" title="Music Theme">🎵</button>
            </div>
        </div>
    </div>
    
    <div class="footer-bottom">
        <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved. | 
        Built with ❤️ for productivity enthusiasts.</p>
    </div>
</footer>

<!-- Notification Container -->
<div id="notification-container" class="notification-container"></div>

<!-- Audio Elements for Timer Notifications -->
<audio id="timer-audio" preload="auto">
    <source src="<?php echo get_template_directory_uri(); ?>/assets/sounds/timer-end.mp3" type="audio/mpeg">
    <source src="<?php echo get_template_directory_uri(); ?>/assets/sounds/timer-end.wav" type="audio/wav">
</audio>

<audio id="tick-audio" preload="auto">
    <source src="<?php echo get_template_directory_uri(); ?>/assets/sounds/tick.mp3" type="audio/mpeg">
</audio>

<style>
/* Footer Styles */
.site-footer {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--blur));
    border-top: 1px solid var(--glass-border);
    padding: 3rem 2rem 1rem;
    margin-top: 5rem;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-section h4 {
    color: var(--primary);
    margin-bottom: 1rem;
    font-size: 1.2rem;
}

.footer-section ul {
    list-style: none;
}

.footer-section ul li {
    margin-bottom: 0.5rem;
}

.footer-section a {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    transition: var(--transition);
}

.footer-section a:hover {
    color: var(--primary);
}

.theme-quick-switch {
    display: flex;
    gap: 0.5rem;
}

.mini-theme-btn {
    width: 35px;
    height: 35px;
    border: 2px solid var(--glass-border);
    border-radius: 50%;
    background: var(--glass-bg);
    color: #fff;
    cursor: pointer;
    transition: var(--transition);
    font-size: 1rem;
}

.mini-theme-btn:hover {
    border-color: var(--primary);
    transform: scale(1.1);
}

.footer-bottom {
    text-align: center;
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid var(--glass-border);
    color: rgba(255, 255, 255, 0.6);
}

/* Notification Styles */
.notification-container {
    position: fixed;
    top: 2rem;
    right: 2rem;
    z-index: 10000;
    max-width: 400px;
}

.notification {
    background: var(--glass-bg);
    backdrop-filter: blur(var(--blur));
    border: 1px solid var(--glass-border);
    border-left: 4px solid var(--primary);
    border-radius: 10px;
    padding: 1rem;
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
    animation: slideInRight 0.3s ease-out;
}

.notification.success {
    border-left-color: #00ff88;
}

.notification.warning {
    border-left-color: #fdcb6e;
}

.notification.error {
    border-left-color: #ff3366;
}

.notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.notification-title {
    font-weight: 600;
    color: var(--primary);
}

.notification-close {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.6);
    cursor: pointer;
    font-size: 1.2rem;
    transition: var(--transition);
}

.notification-close:hover {
    color: #fff;
}

.notification-message {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

/* Mobile Footer Adjustments */
@media (max-width: 768px) {
    .site-footer {
        padding: 2rem 1rem 1rem;
    }
    
    .footer-content {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }
    
    .notification-container {
        right: 1rem;
        left: 1rem;
        max-width: none;
    }
}
</style>

<script>
// Footer quick theme switch functionality
document.addEventListener('DOMContentLoaded', function() {
    const quickThemeBtns = document.querySelectorAll('.mini-theme-btn');
    
    quickThemeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            switchTheme(theme);
        });
    });
});

// Notification system
function showNotification(title, message, type = 'info', duration = 5000) {
    const container = document.getElementById('notification-container');
    const notification = document.createElement('div');
    
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-header">
            <div class="notification-title">${title}</div>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-message">${message}</div>
    `;
    
    container.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after duration
    if (duration > 0) {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }
}

// Service Worker Registration (for offline functionality)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('<?php echo get_template_directory_uri(); ?>/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
</script>

<?php wp_footer(); ?>
</body>
</html>