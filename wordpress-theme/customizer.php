<?php
/**
 * Theme Customizer Settings
 */

function productivity_customize_register($wp_customize) {
    
    // Main Productivity Panel
    $wp_customize->add_panel('productivity_panel', array(
        'title' => __('Productivity Settings', 'productivity-homepage'),
        'description' => __('Customize your productivity homepage settings', 'productivity-homepage'),
        'priority' => 10,
    ));

    // Theme Settings Section
    $wp_customize->add_section('productivity_theme_settings', array(
        'title' => __('Theme & Background', 'productivity-homepage'),
        'panel' => 'productivity_panel',
        'priority' => 10,
    ));

    // Default theme
    $wp_customize->add_setting('productivity_default_theme', array(
        'default' => 'anime',
        'sanitize_callback' => 'sanitize_text_field',
    ));

    $wp_customize->add_control('productivity_default_theme', array(
        'label' => __('Default Theme', 'productivity-homepage'),
        'section' => 'productivity_theme_settings',
        'type' => 'select',
        'choices' => array(
            'anime' => 'Anime Vibe',
            'minimal' => 'Minimalist Dark', 
            'tech' => 'Cyber Neon',
            'music' => 'Music Theme'
        ),
    ));

    // Background rotation interval
    $wp_customize->add_setting('productivity_bg_interval', array(
        'default' => 10,
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control('productivity_bg_interval', array(
        'label' => __('Background Change Interval (seconds)', 'productivity-homepage'),
        'section' => 'productivity_theme_settings',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 5,
            'max' => 60,
        ),
    ));

    // Timer Settings Section
    $wp_customize->add_section('productivity_timer_settings', array(
        'title' => __('Timer Defaults', 'productivity-homepage'),
        'panel' => 'productivity_panel',
        'priority' => 20,
    ));

    // Work duration
    $wp_customize->add_setting('productivity_work_duration', array(
        'default' => 25,
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control('productivity_work_duration', array(
        'label' => __('Default Work Duration (minutes)', 'productivity-homepage'),
        'section' => 'productivity_timer_settings',
        'type' => 'number',
        'input_attrs' => array('min' => 1, 'max' => 120),
    ));

    // Break duration  
    $wp_customize->add_setting('productivity_break_duration', array(
        'default' => 5,
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control('productivity_break_duration', array(
        'label' => __('Default Break Duration (minutes)', 'productivity-homepage'),
        'section' => 'productivity_timer_settings', 
        'type' => 'number',
        'input_attrs' => array('min' => 1, 'max' => 60),
    ));
}
add_action('customize_register', 'productivity_customize_register');