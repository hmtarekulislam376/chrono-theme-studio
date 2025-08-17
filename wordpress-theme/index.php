<?php get_header(); ?>

<div class="container">
    <main class="main-content">
        <!-- Clock Section -->
        <section class="clock-section">
            <div class="clock-display">
                <div id="current-time" class="time">00:00:00</div>
                <div id="current-date" class="date-location">
                    <span id="date"></span> • <span id="location">Loading...</span>
                </div>
                <div id="timezone" class="timezone-display">GMT+0</div>
            </div>
        </section>

        <!-- Productivity Tools Section -->
        <section class="tools-section">
            <!-- Pomodoro Timer -->
            <div class="tool-card" id="pomodoro-card">
                <h3>🍅 Pomodoro Timer</h3>
                <div id="pomodoro-display" class="tool-display">25:00</div>
                <div class="tool-controls">
                    <button class="btn" id="pomodoro-start">Start</button>
                    <button class="btn secondary" id="pomodoro-reset">Reset</button>
                    <button class="btn secondary" id="pomodoro-settings">Settings</button>
                </div>
                <div class="progress-bar">
                    <div class="progress" id="pomodoro-progress"></div>
                </div>
            </div>

            <!-- Stopwatch -->
            <div class="tool-card" id="stopwatch-card">
                <h3>⏱️ Stopwatch</h3>
                <div id="stopwatch-display" class="tool-display">00:00.00</div>
                <div class="tool-controls">
                    <button class="btn" id="stopwatch-start">Start</button>
                    <button class="btn secondary" id="stopwatch-lap">Lap</button>
                    <button class="btn secondary" id="stopwatch-reset">Reset</button>
                </div>
                <div id="lap-times" class="lap-times"></div>
            </div>

            <!-- Countdown Timer -->
            <div class="tool-card" id="countdown-card">
                <h3>⏰ Countdown</h3>
                <div id="countdown-display" class="tool-display">00:00</div>
                <div class="countdown-inputs">
                    <input type="number" id="countdown-minutes" placeholder="Min" min="0" max="59" value="10">
                    <input type="number" id="countdown-seconds" placeholder="Sec" min="0" max="59" value="0">
                </div>
                <div class="tool-controls">
                    <button class="btn" id="countdown-start">Start</button>
                    <button class="btn secondary" id="countdown-reset">Reset</button>
                </div>
            </div>

            <!-- Music Player Widget -->
            <div class="tool-card" id="music-card">
                <h3>🎵 Music Player</h3>
                <div class="music-widget">
                    <div id="current-track">No track selected</div>
                    <div class="music-controls">
                        <button class="btn secondary" id="prev-track">⏮️</button>
                        <button class="btn" id="play-pause">▶️</button>
                        <button class="btn secondary" id="next-track">⏭️</button>
                    </div>
                    <div class="volume-control">
                        <span>🔊</span>
                        <input type="range" id="volume-slider" min="0" max="100" value="50">
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>

<!-- Background Slider -->
<div class="bg-slider" id="bg-slider">
    <!-- Background images will be dynamically loaded here -->
</div>
<div class="bg-overlay"></div>

<!-- Theme Switcher -->
<div class="theme-switcher">
    <button class="theme-toggle" id="theme-toggle">🎨</button>
    <div class="theme-options" id="theme-options">
        <button class="theme-btn anime" data-theme="anime" title="Anime Theme"></button>
        <button class="theme-btn minimal" data-theme="minimal" title="Minimal Theme"></button>
        <button class="theme-btn tech" data-theme="tech" title="Tech Theme"></button>
        <button class="theme-btn music" data-theme="music" title="Music Theme"></button>
    </div>
</div>

<!-- Floating Music Player -->
<div class="music-player">
    <button class="music-toggle" id="music-toggle">🎵</button>
    <div class="music-panel" id="music-panel">
        <div class="music-panel-header">
            <h4>Music Player</h4>
            <button class="close-panel" id="close-music">✕</button>
        </div>
        <div class="playlist-selector">
            <select id="playlist-select">
                <option value="">Select Playlist</option>
                <?php
                $playlists = get_theme_mod('productivity_playlists', []);
                foreach ($playlists as $playlist) {
                    echo '<option value="' . esc_url($playlist['url']) . '">' . esc_html($playlist['name']) . '</option>';
                }
                ?>
            </select>
        </div>
        <div id="youtube-player"></div>
    </div>
</div>

<!-- Pomodoro Settings Modal -->
<div class="modal" id="pomodoro-modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3>Pomodoro Settings</h3>
            <button class="close-modal" id="close-pomodoro-modal">✕</button>
        </div>
        <div class="modal-body">
            <div class="setting-group">
                <label for="work-duration">Work Duration (minutes):</label>
                <input type="number" id="work-duration" min="1" max="60" value="25">
            </div>
            <div class="setting-group">
                <label for="break-duration">Break Duration (minutes):</label>
                <input type="number" id="break-duration" min="1" max="30" value="5">
            </div>
            <div class="setting-group">
                <label for="long-break-duration">Long Break Duration (minutes):</label>
                <input type="number" id="long-break-duration" min="1" max="60" value="15">
            </div>
            <div class="setting-group">
                <label for="sessions-until-long-break">Sessions until long break:</label>
                <input type="number" id="sessions-until-long-break" min="2" max="8" value="4">
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn" id="save-pomodoro-settings">Save Settings</button>
        </div>
    </div>
</div>

<script>
// Load YouTube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Theme management
let currentTheme = localStorage.getItem('productivity-theme') || 'anime';
document.body.className = 'theme-' + currentTheme;

// Initialize all components when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeClock();
    initializeBackgroundSlider();
    initializeThemeSwitcher();
    initializePomodoro();
    initializeStopwatch();
    initializeCountdown();
    initializeMusicPlayer();
});
</script>

<?php get_footer(); ?>