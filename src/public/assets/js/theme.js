function setTheme(currentTheme) {
    if (currentTheme === 'light') {
        document.body.setAttribute("data-theme", "light");
        localStorage.setItem("userThemeChoice", "light");
    } else if (currentTheme === 'dark') {
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("userThemeChoice", "dark");
    } else if (currentTheme === 'system') {
        document.body.removeAttribute("data-theme");
        localStorage.removeItem("userThemeChoice");
    }

}

function loadTheme() {
    // Al cargar la página, aplicar la elección del usuario si la hay
    let savedTheme = localStorage.getItem("userThemeChoice");
    console.log(savedTheme);
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Si no hay elección guardada, respetamos el tema del sistema operativo
        document.body.removeAttribute("data-theme");
    }
}


export { setTheme, loadTheme };