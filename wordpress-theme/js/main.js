/**
 * Productivity Homepage Main JavaScript
 * Handles all interactive features and functionality
 */

(function() {
    'use strict';
    
    // Global variables
    let currentTheme = localStorage.getItem('productivity-theme') || 'anime';
    let backgroundImages = [];
    let currentBgIndex = 0;
    let bgInterval;
    let youtubePlayer;
    let currentPlaylist = '';
    
    // Timer variables
    let pomodoroTimer = {
        isRunning: false,
        timeLeft: 25 * 60, // 25 minutes in seconds
        workDuration: 25 * 60,
        breakDuration: 5 * 60,
        longBreakDuration: 15 * 60,
        sessionsCompleted: 0,
        sessionsUntilLongBreak: 4,
        isBreak: false,
        interval: null
    };
    
    let stopwatch = {
        isRunning: false,
        time: 0,
        interval: null,
        lapTimes: []
    };
    
    let countdown = {
        isRunning: false,
        timeLeft: 0,
        interval: null
    };

    // Initialize everything when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeClock();
        initializeBackgroundSlider();
        initializeThemeSwitcher();
        initializeNavigation();
        initializePomodoro();
        initializeStopwatch();
        initializeCountdown();
        initializeMusicPlayer();
        initializeKeyboardShortcuts();
        initializeNotifications();
        loadUserPreferences();
    });

    // Clock functionality
    function initializeClock() {
        updateClock();
        setInterval(updateClock, 1000);
        getUserLocation();
    }

    function updateClock() {
        const now = new Date();
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('date');
        
        if (timeElement) {
            const hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
            
            timeElement.textContent = `${displayHours}:${minutes}:${seconds} ${ampm}`;
        }
        
        if (dateElement) {
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('en-US', options);
        }
    }

    function getUserLocation() {
        // Try to get user's timezone and location
        if (productivity_ajax && productivity_ajax.ajax_url) {
            fetch(productivity_ajax.ajax_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    'action': 'get_timezone',
                    'nonce': productivity_ajax.nonce
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const locationElement = document.getElementById('location');
                    const timezoneElement = document.getElementById('timezone');
                    
                    if (locationElement) {
                        locationElement.textContent = `${data.data.city}, ${data.data.country}`;
                    }
                    
                    if (timezoneElement) {
                        timezoneElement.textContent = data.data.timezone;
                    }
                }
            })
            .catch(() => {
                // Fallback to browser's timezone
                const locationElement = document.getElementById('location');
                if (locationElement) {
                    locationElement.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone;
                }
            });
        }
    }

    // Background slider functionality
    function initializeBackgroundSlider() {
        if (productivity_ajax && productivity_ajax.theme_settings) {
            backgroundImages = productivity_ajax.theme_settings.background_images || [];
        }
        
        createBackgroundSlider();
        startBackgroundRotation();
    }

    function createBackgroundSlider() {
        const slider = document.getElementById('bg-slider');
        if (!slider || backgroundImages.length === 0) return;
        
        slider.innerHTML = '';
        
        backgroundImages.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'bg-slide';
            slide.style.backgroundImage = `url(${image})`;
            if (index === 0) slide.classList.add('active');
            slider.appendChild(slide);
        });
    }

    function startBackgroundRotation() {
        if (backgroundImages.length <= 1) return;
        
        const interval = 10000; // 10 seconds
        bgInterval = setInterval(changeBackground, interval);
    }

    function changeBackground() {
        const slides = document.querySelectorAll('.bg-slide');
        if (slides.length <= 1) return;
        
        slides[currentBgIndex].classList.remove('active');
        currentBgIndex = (currentBgIndex + 1) % slides.length;
        slides[currentBgIndex].classList.add('active');
    }

    // Theme switching functionality
    function initializeThemeSwitcher() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeOptions = document.getElementById('theme-options');
        const themeBtns = document.querySelectorAll('.theme-btn');
        
        // Apply saved theme
        document.body.className = `theme-${currentTheme}`;
        
        if (themeToggle && themeOptions) {
            themeToggle.addEventListener('click', function() {
                themeOptions.classList.toggle('active');
            });
            
            // Close theme options when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.theme-switcher')) {
                    themeOptions.classList.remove('active');
                }
            });
        }
        
        themeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                switchTheme(theme);
            });
        });
    }

    function switchTheme(theme) {
        currentTheme = theme;
        document.body.className = `theme-${theme}`;
        localStorage.setItem('productivity-theme', theme);
        
        // Update background images for new theme
        if (productivity_ajax && productivity_ajax.theme_settings) {
            backgroundImages = productivity_ajax.theme_settings.background_images || [];
            createBackgroundSlider();
        }
        
        showNotification('Theme Changed', `Switched to ${theme} theme`, 'success', 2000);
    }

    // Navigation functionality
    function initializeNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const mainNav = document.getElementById('main-nav');
        
        if (navToggle && mainNav) {
            navToggle.addEventListener('click', function() {
                mainNav.classList.toggle('active');
                this.classList.toggle('active');
            });
            
            // Close nav when clicking outside
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.site-header')) {
                    mainNav.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }
    }

    // Pomodoro Timer functionality
    function initializePomodoro() {
        const startBtn = document.getElementById('pomodoro-start');
        const resetBtn = document.getElementById('pomodoro-reset');
        const settingsBtn = document.getElementById('pomodoro-settings');
        const display = document.getElementById('pomodoro-display');
        const modal = document.getElementById('pomodoro-modal');
        const closeModal = document.getElementById('close-pomodoro-modal');
        const saveSettings = document.getElementById('save-pomodoro-settings');
        
        // Load settings from WordPress
        if (productivity_ajax && productivity_ajax.theme_settings.timer_settings) {
            const settings = productivity_ajax.theme_settings.timer_settings;
            pomodoroTimer.workDuration = settings.work_duration * 60;
            pomodoroTimer.breakDuration = settings.break_duration * 60;
            pomodoroTimer.longBreakDuration = settings.long_break_duration * 60;
            pomodoroTimer.sessionsUntilLongBreak = settings.sessions_until_long_break;
            pomodoroTimer.timeLeft = pomodoroTimer.workDuration;
        }
        
        updatePomodoroDisplay();
        
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                if (pomodoroTimer.isRunning) {
                    pausePomodoro();
                } else {
                    startPomodoro();
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetPomodoro);
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', function() {
                if (modal) {
                    modal.style.display = 'flex';
                    loadPomodoroSettings();
                }
            });
        }
        
        if (closeModal) {
            closeModal.addEventListener('click', function() {
                if (modal) modal.style.display = 'none';
            });
        }
        
        if (saveSettings) {
            saveSettings.addEventListener('click', savePomodoroSettings);
        }
    }

    function startPomodoro() {
        pomodoroTimer.isRunning = true;
        document.getElementById('pomodoro-start').textContent = 'Pause';
        
        pomodoroTimer.interval = setInterval(function() {
            pomodoroTimer.timeLeft--;
            updatePomodoroDisplay();
            
            if (pomodoroTimer.timeLeft <= 0) {
                finishPomodoroSession();
            }
        }, 1000);
    }

    function pausePomodoro() {
        pomodoroTimer.isRunning = false;
        document.getElementById('pomodoro-start').textContent = 'Start';
        clearInterval(pomodoroTimer.interval);
    }

    function resetPomodoro() {
        pausePomodoro();
        pomodoroTimer.timeLeft = pomodoroTimer.isBreak ? 
            (pomodoroTimer.sessionsCompleted % pomodoroTimer.sessionsUntilLongBreak === 0 ? 
                pomodoroTimer.longBreakDuration : pomodoroTimer.breakDuration) : 
            pomodoroTimer.workDuration;
        pomodoroTimer.isBreak = false;
        pomodoroTimer.sessionsCompleted = 0;
        updatePomodoroDisplay();
    }

    function finishPomodoroSession() {
        pausePomodoro();
        playTimerSound();
        
        if (pomodoroTimer.isBreak) {
            // Break finished, start work session
            pomodoroTimer.isBreak = false;
            pomodoroTimer.timeLeft = pomodoroTimer.workDuration;
            showNotification('Break Over!', 'Time to get back to work', 'success');
        } else {
            // Work session finished
            pomodoroTimer.sessionsCompleted++;
            pomodoroTimer.isBreak = true;
            
            const isLongBreak = pomodoroTimer.sessionsCompleted % pomodoroTimer.sessionsUntilLongBreak === 0;
            pomodoroTimer.timeLeft = isLongBreak ? pomodoroTimer.longBreakDuration : pomodoroTimer.breakDuration;
            
            const breakType = isLongBreak ? 'Long Break' : 'Short Break';
            showNotification('Work Session Complete!', `Time for a ${breakType.toLowerCase()}`, 'success');
        }
        
        updatePomodoroDisplay();
        
        // Auto-start next session after 3 seconds
        setTimeout(() => {
            if (!pomodoroTimer.isRunning) {
                startPomodoro();
            }
        }, 3000);
    }

    function updatePomodoroDisplay() {
        const display = document.getElementById('pomodoro-display');
        const progress = document.getElementById('pomodoro-progress');
        
        if (display) {
            const minutes = Math.floor(pomodoroTimer.timeLeft / 60);
            const seconds = pomodoroTimer.timeLeft % 60;
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (progress) {
            const totalDuration = pomodoroTimer.isBreak ? 
                (pomodoroTimer.sessionsCompleted % pomodoroTimer.sessionsUntilLongBreak === 0 ? 
                    pomodoroTimer.longBreakDuration : pomodoroTimer.breakDuration) : 
                pomodoroTimer.workDuration;
            const progressPercent = ((totalDuration - pomodoroTimer.timeLeft) / totalDuration) * 100;
            progress.style.width = `${progressPercent}%`;
        }
        
        // Update card color based on session type
        const card = document.getElementById('pomodoro-card');
        if (card) {
            if (pomodoroTimer.isBreak) {
                card.classList.add('break-session');
            } else {
                card.classList.remove('break-session');
            }
        }
    }

    // Stopwatch functionality
    function initializeStopwatch() {
        const startBtn = document.getElementById('stopwatch-start');
        const lapBtn = document.getElementById('stopwatch-lap');
        const resetBtn = document.getElementById('stopwatch-reset');
        
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                if (stopwatch.isRunning) {
                    pauseStopwatch();
                } else {
                    startStopwatch();
                }
            });
        }
        
        if (lapBtn) {
            lapBtn.addEventListener('click', addLap);
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetStopwatch);
        }
        
        updateStopwatchDisplay();
    }

    function startStopwatch() {
        stopwatch.isRunning = true;
        document.getElementById('stopwatch-start').textContent = 'Pause';
        
        stopwatch.interval = setInterval(function() {
            stopwatch.time += 10; // Increment by 10ms for precision
            updateStopwatchDisplay();
        }, 10);
    }

    function pauseStopwatch() {
        stopwatch.isRunning = false;
        document.getElementById('stopwatch-start').textContent = 'Start';
        clearInterval(stopwatch.interval);
    }

    function resetStopwatch() {
        pauseStopwatch();
        stopwatch.time = 0;
        stopwatch.lapTimes = [];
        updateStopwatchDisplay();
        updateLapTimes();
    }

    function addLap() {
        if (stopwatch.isRunning) {
            stopwatch.lapTimes.push(stopwatch.time);
            updateLapTimes();
        }
    }

    function updateStopwatchDisplay() {
        const display = document.getElementById('stopwatch-display');
        if (display) {
            const totalMs = stopwatch.time;
            const minutes = Math.floor(totalMs / 60000);
            const seconds = Math.floor((totalMs % 60000) / 1000);
            const milliseconds = Math.floor((totalMs % 1000) / 10);
            
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
        }
    }

    function updateLapTimes() {
        const lapContainer = document.getElementById('lap-times');
        if (lapContainer) {
            lapContainer.innerHTML = '';
            
            stopwatch.lapTimes.forEach((lapTime, index) => {
                const totalMs = lapTime;
                const minutes = Math.floor(totalMs / 60000);
                const seconds = Math.floor((totalMs % 60000) / 1000);
                const milliseconds = Math.floor((totalMs % 1000) / 10);
                
                const lapElement = document.createElement('div');
                lapElement.className = 'lap-time';
                lapElement.textContent = `Lap ${index + 1}: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
                lapContainer.appendChild(lapElement);
            });
        }
    }

    // Countdown Timer functionality
    function initializeCountdown() {
        const startBtn = document.getElementById('countdown-start');
        const resetBtn = document.getElementById('countdown-reset');
        const minutesInput = document.getElementById('countdown-minutes');
        const secondsInput = document.getElementById('countdown-seconds');
        
        if (startBtn) {
            startBtn.addEventListener('click', function() {
                if (countdown.isRunning) {
                    pauseCountdown();
                } else {
                    startCountdown();
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', resetCountdown);
        }
        
        updateCountdownDisplay();
    }

    function startCountdown() {
        const minutes = parseInt(document.getElementById('countdown-minutes').value) || 0;
        const seconds = parseInt(document.getElementById('countdown-seconds').value) || 0;
        
        if (!countdown.isRunning && countdown.timeLeft === 0) {
            countdown.timeLeft = (minutes * 60) + seconds;
        }
        
        if (countdown.timeLeft <= 0) {
            showNotification('Invalid Time', 'Please set a valid countdown time', 'error');
            return;
        }
        
        countdown.isRunning = true;
        document.getElementById('countdown-start').textContent = 'Pause';
        
        countdown.interval = setInterval(function() {
            countdown.timeLeft--;
            updateCountdownDisplay();
            
            if (countdown.timeLeft <= 0) {
                finishCountdown();
            }
        }, 1000);
    }

    function pauseCountdown() {
        countdown.isRunning = false;
        document.getElementById('countdown-start').textContent = 'Start';
        clearInterval(countdown.interval);
    }

    function resetCountdown() {
        pauseCountdown();
        countdown.timeLeft = 0;
        updateCountdownDisplay();
    }

    function finishCountdown() {
        pauseCountdown();
        playTimerSound();
        showNotification('Time\'s Up!', 'Countdown timer has finished', 'success');
        
        // Flash the countdown card
        const card = document.getElementById('countdown-card');
        if (card) {
            card.classList.add('timer-finished');
            setTimeout(() => card.classList.remove('timer-finished'), 3000);
        }
    }

    function updateCountdownDisplay() {
        const display = document.getElementById('countdown-display');
        if (display) {
            const minutes = Math.floor(countdown.timeLeft / 60);
            const seconds = countdown.timeLeft % 60;
            display.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    // Music Player functionality
    function initializeMusicPlayer() {
        const musicToggle = document.getElementById('music-toggle');
        const musicPanel = document.getElementById('music-panel');
        const closeMusicBtn = document.getElementById('close-music');
        const playlistSelect = document.getElementById('playlist-select');
        
        if (musicToggle && musicPanel) {
            musicToggle.addEventListener('click', function() {
                musicPanel.classList.toggle('active');
            });
        }
        
        if (closeMusicBtn) {
            closeMusicBtn.addEventListener('click', function() {
                musicPanel.classList.remove('active');
            });
        }
        
        if (playlistSelect) {
            playlistSelect.addEventListener('change', function() {
                const playlistUrl = this.value;
                if (playlistUrl && youtubePlayer) {
                    loadPlaylist(playlistUrl);
                }
            });
        }
        
        // Initialize YouTube player when API is ready
        window.onYouTubeIframeAPIReady = function() {
            initializeYouTubePlayer();
        };
    }

    function initializeYouTubePlayer() {
        youtubePlayer = new YT.Player('youtube-player', {
            height: '200',
            width: '100%',
            playerVars: {
                'autoplay': 0,
                'controls': 1,
                'showinfo': 0,
                'rel': 0,
                'iv_load_policy': 3
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        // Player is ready
        console.log('YouTube player ready');
    }

    function onPlayerStateChange(event) {
        const trackDisplay = document.getElementById('current-track');
        
        if (event.data === YT.PlayerState.PLAYING && trackDisplay) {
            const videoData = youtubePlayer.getVideoData();
            trackDisplay.textContent = videoData.title || 'Playing...';
        } else if (event.data === YT.PlayerState.PAUSED && trackDisplay) {
            trackDisplay.textContent = 'Paused';
        }
    }

    function loadPlaylist(playlistUrl) {
        if (!youtubePlayer) return;
        
        // Extract playlist ID from URL
        const playlistId = extractPlaylistId(playlistUrl);
        if (playlistId) {
            youtubePlayer.loadPlaylist({
                list: playlistId,
                listType: 'playlist'
            });
        }
    }

    function extractPlaylistId(url) {
        const regex = /[?&]list=([^&#]*)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    // Keyboard shortcuts
    function initializeKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Only trigger if not typing in an input
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                switch(e.code) {
                    case 'Space':
                        e.preventDefault();
                        if (youtubePlayer && youtubePlayer.getPlayerState) {
                            const state = youtubePlayer.getPlayerState();
                            if (state === YT.PlayerState.PLAYING) {
                                youtubePlayer.pauseVideo();
                            } else {
                                youtubePlayer.playVideo();
                            }
                        }
                        break;
                        
                    case 'KeyP':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            document.getElementById('pomodoro-start').click();
                        }
                        break;
                        
                    case 'KeyS':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            document.getElementById('stopwatch-start').click();
                        }
                        break;
                        
                    case 'KeyM':
                        if (e.ctrlKey) {
                            e.preventDefault();
                            document.getElementById('music-toggle').click();
                        }
                        break;
                        
                    case 'ArrowUp':
                        if (e.ctrlKey && youtubePlayer) {
                            e.preventDefault();
                            const volume = youtubePlayer.getVolume();
                            youtubePlayer.setVolume(Math.min(100, volume + 10));
                        }
                        break;
                        
                    case 'ArrowDown':
                        if (e.ctrlKey && youtubePlayer) {
                            e.preventDefault();
                            const volume = youtubePlayer.getVolume();
                            youtubePlayer.setVolume(Math.max(0, volume - 10));
                        }
                        break;
                }
            }
        });
    }

    // Notifications
    function initializeNotifications() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    function showNotification(title, message, type = 'info', duration = 5000) {
        // Show in-page notification
        const container = document.getElementById('notification-container');
        if (container) {
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
            
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => notification.remove());
            
            if (duration > 0) {
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.opacity = '0';
                        setTimeout(() => notification.remove(), 300);
                    }
                }, duration);
            }
        }
        
        // Show browser notification for important alerts
        if ('Notification' in window && Notification.permission === 'granted' && type === 'success') {
            new Notification(title, {
                body: message,
                icon: '/favicon.ico'
            });
        }
    }

    // Utility functions
    function playTimerSound() {
        const audio = document.getElementById('timer-audio');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {
                // Fallback if audio doesn't play
                console.log('Audio play failed');
            });
        }
    }

    function loadUserPreferences() {
        // Load saved timer settings
        const savedPomodoroSettings = localStorage.getItem('pomodoro-settings');
        if (savedPomodoroSettings) {
            const settings = JSON.parse(savedPomodoroSettings);
            Object.assign(pomodoroTimer, settings);
        }
        
        // Load saved volume
        const savedVolume = localStorage.getItem('music-volume');
        if (savedVolume && youtubePlayer) {
            youtubePlayer.setVolume(parseInt(savedVolume));
        }
    }

    function saveUserPreferences() {
        // Save timer settings
        localStorage.setItem('pomodoro-settings', JSON.stringify({
            workDuration: pomodoroTimer.workDuration,
            breakDuration: pomodoroTimer.breakDuration,
            longBreakDuration: pomodoroTimer.longBreakDuration,
            sessionsUntilLongBreak: pomodoroTimer.sessionsUntilLongBreak
        }));
        
        // Save volume
        if (youtubePlayer) {
            localStorage.setItem('music-volume', youtubePlayer.getVolume());
        }
    }

    // Pomodoro settings modal functions
    function loadPomodoroSettings() {
        document.getElementById('work-duration').value = pomodoroTimer.workDuration / 60;
        document.getElementById('break-duration').value = pomodoroTimer.breakDuration / 60;
        document.getElementById('long-break-duration').value = pomodoroTimer.longBreakDuration / 60;
        document.getElementById('sessions-until-long-break').value = pomodoroTimer.sessionsUntilLongBreak;
    }

    function savePomodoroSettings() {
        pomodoroTimer.workDuration = parseInt(document.getElementById('work-duration').value) * 60;
        pomodoroTimer.breakDuration = parseInt(document.getElementById('break-duration').value) * 60;
        pomodoroTimer.longBreakDuration = parseInt(document.getElementById('long-break-duration').value) * 60;
        pomodoroTimer.sessionsUntilLongBreak = parseInt(document.getElementById('sessions-until-long-break').value);
        
        if (!pomodoroTimer.isRunning) {
            pomodoroTimer.timeLeft = pomodoroTimer.workDuration;
            updatePomodoroDisplay();
        }
        
        saveUserPreferences();
        document.getElementById('pomodoro-modal').style.display = 'none';
        showNotification('Settings Saved', 'Pomodoro settings updated successfully', 'success', 2000);
    }

    // Make functions globally available
    window.switchTheme = switchTheme;
    window.showNotification = showNotification;
    window.playTimerSound = playTimerSound;

})();