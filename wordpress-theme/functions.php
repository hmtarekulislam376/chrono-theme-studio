<?php
/**
 * Productivity Homepage Theme Functions
 */

// Theme setup
function productivity_theme_setup() {
    // Add theme support for various features
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('custom-background');
    add_theme_support('customize-selective-refresh-widgets');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => esc_html__('Primary Menu', 'productivity-homepage'),
    ));
}
add_action('after_setup_theme', 'productivity_theme_setup');

// Enqueue styles and scripts
function productivity_enqueue_scripts() {
    // Styles
    wp_enqueue_style('productivity-style', get_stylesheet_uri(), array(), '1.0.0');
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', array(), null);
    
    // Scripts
    wp_enqueue_script('productivity-main', get_template_directory_uri() . '/js/main.js', array(), '1.0.0', true);
    
    // Localize script for AJAX and settings
    wp_localize_script('productivity-main', 'productivity_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('productivity_nonce'),
        'theme_settings' => array(
            'background_images' => productivity_get_background_images(),
            'playlists' => get_theme_mod('productivity_playlists', array()),
            'timer_settings' => get_theme_mod('productivity_timer_settings', array(
                'work_duration' => 25,
                'break_duration' => 5,
                'long_break_duration' => 15,
                'sessions_until_long_break' => 4
            ))
        )
    ));
}
add_action('wp_enqueue_scripts', 'productivity_enqueue_scripts');

// Get background images for current theme
function productivity_get_background_images() {
    $current_theme = get_theme_mod('productivity_current_theme', 'anime');
    $all_images = get_theme_mod('productivity_background_images', array(
        'anime' => array(),
        'minimal' => array(),
        'tech' => array(),
        'music' => array()
    ));
    
    return isset($all_images[$current_theme]) ? $all_images[$current_theme] : array();
}

// Admin enqueue scripts
function productivity_admin_enqueue_scripts($hook) {
    if ('appearance_page_productivity-settings' === $hook) {
        wp_enqueue_media();
        wp_enqueue_script('productivity-admin', get_template_directory_uri() . '/js/admin.js', array('jquery'), '1.0.0', true);
        wp_enqueue_style('productivity-admin-style', get_template_directory_uri() . '/css/admin.css', array(), '1.0.0');
    }
}
add_action('admin_enqueue_scripts', 'productivity_admin_enqueue_scripts');

// Add admin menu
function productivity_admin_menu() {
    add_theme_page(
        'Productivity Settings',
        'Productivity Settings',
        'manage_options',
        'productivity-settings',
        'productivity_settings_page'
    );
}
add_action('admin_menu', 'productivity_admin_menu');

// Settings page callback
function productivity_settings_page() {
    ?>
    <div class="wrap">
        <h1>Productivity Homepage Settings</h1>
        
        <div class="nav-tab-wrapper">
            <a href="#background-settings" class="nav-tab nav-tab-active">Background Images</a>
            <a href="#music-settings" class="nav-tab">Music Playlists</a>
            <a href="#timer-settings" class="nav-tab">Timer Settings</a>
            <a href="#general-settings" class="nav-tab">General Settings</a>
        </div>

        <form method="post" action="options.php">
            <?php settings_fields('productivity_settings'); ?>
            
            <!-- Background Images Tab -->
            <div id="background-settings" class="tab-content">
                <h2>Background Images Management</h2>
                <p>Upload and manage background images for each theme.</p>
                
                <div class="theme-tabs">
                    <button type="button" class="theme-tab active" data-theme="anime">Anime</button>
                    <button type="button" class="theme-tab" data-theme="minimal">Minimal</button>
                    <button type="button" class="theme-tab" data-theme="tech">Tech</button>
                    <button type="button" class="theme-tab" data-theme="music">Music</button>
                </div>

                <div id="anime-images" class="theme-images active">
                    <h3>Anime Theme Backgrounds</h3>
                    <button type="button" class="button upload-images" data-theme="anime">Upload Images</button>
                    <div class="images-grid" id="anime-grid"></div>
                </div>

                <div id="minimal-images" class="theme-images">
                    <h3>Minimal Theme Backgrounds</h3>
                    <button type="button" class="button upload-images" data-theme="minimal">Upload Images</button>
                    <div class="images-grid" id="minimal-grid"></div>
                </div>

                <div id="tech-images" class="theme-images">
                    <h3>Tech Theme Backgrounds</h3>
                    <button type="button" class="button upload-images" data-theme="tech">Upload Images</button>
                    <div class="images-grid" id="tech-grid"></div>
                </div>

                <div id="music-images" class="theme-images">
                    <h3>Music Theme Backgrounds</h3>
                    <button type="button" class="button upload-images" data-theme="music">Upload Images</button>
                    <div class="images-grid" id="music-grid"></div>
                </div>
            </div>

            <!-- Music Playlists Tab -->
            <div id="music-settings" class="tab-content" style="display:none;">
                <h2>YouTube Music Playlists</h2>
                <p>Add YouTube playlist URLs for the music player.</p>
                
                <div id="playlists-container">
                    <!-- Playlists will be loaded here -->
                </div>
                
                <button type="button" class="button" id="add-playlist">Add New Playlist</button>
            </div>

            <!-- Timer Settings Tab -->
            <div id="timer-settings" class="tab-content" style="display:none;">
                <h2>Timer Default Settings</h2>
                
                <table class="form-table">
                    <tr>
                        <th><label for="default_work_duration">Default Work Duration (minutes)</label></th>
                        <td>
                            <input type="number" id="default_work_duration" name="productivity_timer_settings[work_duration]" 
                                   value="<?php echo esc_attr(get_theme_mod('productivity_timer_settings')['work_duration'] ?? 25); ?>" 
                                   min="1" max="120" />
                        </td>
                    </tr>
                    <tr>
                        <th><label for="default_break_duration">Default Break Duration (minutes)</label></th>
                        <td>
                            <input type="number" id="default_break_duration" name="productivity_timer_settings[break_duration]" 
                                   value="<?php echo esc_attr(get_theme_mod('productivity_timer_settings')['break_duration'] ?? 5); ?>" 
                                   min="1" max="60" />
                        </td>
                    </tr>
                    <tr>
                        <th><label for="default_long_break_duration">Default Long Break Duration (minutes)</label></th>
                        <td>
                            <input type="number" id="default_long_break_duration" name="productivity_timer_settings[long_break_duration]" 
                                   value="<?php echo esc_attr(get_theme_mod('productivity_timer_settings')['long_break_duration'] ?? 15); ?>" 
                                   min="1" max="120" />
                        </td>
                    </tr>
                </table>
            </div>

            <!-- General Settings Tab -->
            <div id="general-settings" class="tab-content" style="display:none;">
                <h2>General Settings</h2>
                
                <table class="form-table">
                    <tr>
                        <th><label for="background_change_interval">Background Change Interval (seconds)</label></th>
                        <td>
                            <input type="number" id="background_change_interval" name="productivity_general_settings[bg_interval]" 
                                   value="<?php echo esc_attr(get_theme_mod('productivity_general_settings')['bg_interval'] ?? 10); ?>" 
                                   min="5" max="60" />
                        </td>
                    </tr>
                    <tr>
                        <th><label for="enable_notifications">Enable Browser Notifications</label></th>
                        <td>
                            <input type="checkbox" id="enable_notifications" name="productivity_general_settings[notifications]" 
                                   <?php checked(get_theme_mod('productivity_general_settings')['notifications'] ?? true); ?> />
                            <label for="enable_notifications">Allow timer notifications</label>
                        </td>
                    </tr>
                </table>
            </div>

            <?php submit_button(); ?>
        </form>
    </div>

    <script>
    jQuery(document).ready(function($) {
        // Tab switching
        $('.nav-tab').click(function(e) {
            e.preventDefault();
            var target = $(this).attr('href');
            
            $('.nav-tab').removeClass('nav-tab-active');
            $(this).addClass('nav-tab-active');
            
            $('.tab-content').hide();
            $(target).show();
        });
        
        // Theme tab switching
        $('.theme-tab').click(function() {
            var theme = $(this).data('theme');
            
            $('.theme-tab').removeClass('active');
            $(this).addClass('active');
            
            $('.theme-images').removeClass('active');
            $('#' + theme + '-images').addClass('active');
        });
        
        // Image upload functionality
        $('.upload-images').click(function() {
            var theme = $(this).data('theme');
            var frame = wp.media({
                title: 'Select Images for ' + theme + ' theme',
                multiple: true,
                library: { type: 'image' },
                button: { text: 'Use Images' }
            });
            
            frame.on('select', function() {
                var attachments = frame.state().get('selection').toJSON();
                // Handle image selection
                console.log('Selected images for', theme, attachments);
            });
            
            frame.open();
        });
    });
    </script>
    <?php
}

// Register customizer settings
function productivity_customize_register($wp_customize) {
    // Add sections
    $wp_customize->add_section('productivity_settings', array(
        'title' => __('Productivity Settings', 'productivity-homepage'),
        'priority' => 30,
    ));
    
    // Current theme setting
    $wp_customize->add_setting('productivity_current_theme', array(
        'default' => 'anime',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    
    $wp_customize->add_control('productivity_current_theme', array(
        'label' => __('Default Theme', 'productivity-homepage'),
        'section' => 'productivity_settings',
        'type' => 'select',
        'choices' => array(
            'anime' => __('Anime', 'productivity-homepage'),
            'minimal' => __('Minimal', 'productivity-homepage'),
            'tech' => __('Tech', 'productivity-homepage'),
            'music' => __('Music', 'productivity-homepage'),
        ),
    ));
}
add_action('customize_register', 'productivity_customize_register');

// AJAX handlers
function productivity_save_background_images() {
    check_ajax_referer('productivity_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions.'));
    }
    
    $theme = sanitize_text_field($_POST['theme']);
    $images = array_map('esc_url_raw', $_POST['images']);
    
    $all_images = get_theme_mod('productivity_background_images', array());
    $all_images[$theme] = $images;
    
    set_theme_mod('productivity_background_images', $all_images);
    
    wp_send_json_success();
}
add_action('wp_ajax_save_background_images', 'productivity_save_background_images');

function productivity_save_playlists() {
    check_ajax_referer('productivity_nonce', 'nonce');
    
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions.'));
    }
    
    $playlists = array();
    if (isset($_POST['playlists'])) {
        foreach ($_POST['playlists'] as $playlist) {
            $playlists[] = array(
                'name' => sanitize_text_field($playlist['name']),
                'url' => esc_url_raw($playlist['url']),
                'category' => sanitize_text_field($playlist['category'])
            );
        }
    }
    
    set_theme_mod('productivity_playlists', $playlists);
    
    wp_send_json_success();
}
add_action('wp_ajax_save_playlists', 'productivity_save_playlists');

// Get user's timezone via AJAX
function productivity_get_timezone() {
    $ip = $_SERVER['REMOTE_ADDR'];
    
    // Use a free IP geolocation service
    $response = wp_remote_get("http://ip-api.com/json/{$ip}");
    
    if (is_wp_error($response)) {
        wp_send_json_error('Failed to get location');
    }
    
    $data = wp_remote_retrieve_body($response);
    $location_data = json_decode($data, true);
    
    if ($location_data && $location_data['status'] === 'success') {
        wp_send_json_success(array(
            'timezone' => $location_data['timezone'],
            'city' => $location_data['city'],
            'country' => $location_data['country']
        ));
    } else {
        wp_send_json_error('Location not found');
    }
}
add_action('wp_ajax_get_timezone', 'productivity_get_timezone');
add_action('wp_ajax_nopriv_get_timezone', 'productivity_get_timezone');

// Custom body class for theme
function productivity_body_classes($classes) {
    $current_theme = get_theme_mod('productivity_current_theme', 'anime');
    $classes[] = 'theme-' . $current_theme;
    return $classes;
}
add_filter('body_class', 'productivity_body_classes');

// Widget areas
function productivity_widgets_init() {
    register_sidebar(array(
        'name' => esc_html__('Sidebar', 'productivity-homepage'),
        'id' => 'sidebar-1',
        'description' => esc_html__('Add widgets here.', 'productivity-homepage'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget' => '</section>',
        'before_title' => '<h2 class="widget-title">',
        'after_title' => '</h2>',
    ));
}
add_action('widgets_init', 'productivity_widgets_init');