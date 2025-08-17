<?php
/**
 * Front Page Template
 * This is the homepage template that shows the productivity tools
 */

get_header(); ?>

<div class="container">
    <main class="main-content">
        <!-- Hero Section with Clock -->
        <section class="hero-section">
            <div class="clock-display">
                <div id="current-time" class="time">00:00:00</div>
                <div id="current-date" class="date-location">
                    <span id="date"></span> • <span id="location">Loading...</span>
                </div>
                <div id="timezone" class="timezone-display">GMT+0</div>
            </div>
            
            <div class="hero-content">
                <h1>Your Productivity Hub</h1>
                <p>Stay focused with beautiful themes, smart timers, and integrated music</p>
            </div>
        </section>

        <!-- Tools Grid -->
        <section class="tools-section">
            <div class="tool-card" id="pomodoro-card">
                <h3>🍅 Pomodoro Timer</h3>
                <div id="pomodoro-display" class="tool-display">25:00</div>
                <div class="tool-controls">
                    <button class="btn" id="pomodoro-start">Start Focus</button>
                    <button class="btn secondary" id="pomodoro-reset">Reset</button>
                    <button class="btn secondary" id="pomodoro-settings">Settings</button>
                </div>
                <div class="progress-bar">
                    <div class="progress" id="pomodoro-progress"></div>
                </div>
            </div>

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

            <div class="tool-card" id="countdown-card">
                <h3>⏰ Countdown</h3>
                <div id="countdown-display" class="tool-display">10:00</div>
                <div class="countdown-inputs">
                    <input type="number" id="countdown-minutes" placeholder="Min" min="0" max="59" value="10">
                    <input type="number" id="countdown-seconds" placeholder="Sec" min="0" max="59" value="0">
                </div>
                <div class="tool-controls">
                    <button class="btn" id="countdown-start">Start</button>
                    <button class="btn secondary" id="countdown-reset">Reset</button>
                </div>
            </div>

            <div class="tool-card" id="music-card">
                <h3>🎵 Focus Music</h3>
                <div class="music-widget">
                    <div id="current-track">Select a playlist to begin</div>
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

        <!-- Quick Stats -->
        <section class="stats-section">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number" id="sessions-today">0</div>
                    <div class="stat-label">Focus Sessions Today</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="time-focused">0h</div>
                    <div class="stat-label">Time Focused</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="current-streak">0</div>
                    <div class="stat-label">Day Streak</div>
                </div>
            </div>
        </section>
    </main>
</div>

<?php get_footer(); ?>