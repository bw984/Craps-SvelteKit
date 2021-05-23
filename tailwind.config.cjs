module.exports = {
    purge: [
        'src/**/*.html',
        'src/**/*.js',
        'src/**/*.svelte',
        'src/app.html'
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {},
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}