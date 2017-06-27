const ajax = {
    get(url, callback) {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const content = xhr.responseText;
                callback(content);
            }
        }

        xhr.open('GET', url, true);
        xhr.send(null);
    },

    post(url, data, callback) {
        const xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                const content = xhr.responseText;
                callback(content);
            }
        }

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.send(data);
    }
}

export default ajax
