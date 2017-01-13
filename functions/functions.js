module.exports = {
    log: (message, type = null) => {
        let color = 0;
        switch (type) {
            case 'red':
                color = 31;
                break;
            case 'green':
                color = 32;
                break;
            case 'orange':
                color = 33;
                break;
            default:
                color = 0;
        }

        console.log('\x1b[' + color + 'm', '[' + new Date().toString() + ']: ' + message, '\x1b[0m');
    },

    guid: () => {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
};