'use strict';
import { setTheme, loadTheme } from "./theme.js";

const nameExpose = 'apiMainWindow';
class MainWindow {
    constructor() {
        loadTheme();
        this.button = document.getElementById('btn-msg');
        this.messageText = document.getElementById('message');
        this.listMessage = document.getElementById('list-messages');

        this.button.addEventListener('click', () => {
            window[nameExpose].sendMessage(this.messageText.value.trim());
            this.messageText.value = "";
        }
        );

        window[nameExpose].onMessageMain((data) => {
            console.log("render:", data);
            this.listMessage.innerHTML += `<li>${data}</li>`;
        });
        window[nameExpose].theme((event, newTheme) => {
            console.log(event, newTheme);
            setTheme(newTheme);
            localStorage.setItem("userThemeChoice", newTheme);
        });
    }
}


new MainWindow();