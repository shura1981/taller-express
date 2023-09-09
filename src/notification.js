const { Notification } = require('electron');


function showNotification({ title, icon, subtitle, body }, show, click, close) {
    if (Notification.isSupported()) {
        const notification = new Notification({
            title: title,
            icon: icon,
            subtitle: subtitle,
            body: body,
            hasReply: true
        })

        notification.on('show', () => show())
        notification.on('click', () => click())
        notification.on('close', () => close())
        notification.on('reply', (event, reply) => {
            console.log(`Reply: ${reply}`)
        })

        notification.show()
    } else {
        console.log('Hm, are notifications supported on this system?')
    }
}

module.exports = {
    showNotification
}
