// получаем запрос от основного потока и создаём дочерний воркер worker-2.js и возвращаем ответ наверх
self.onmessage = (e) => {
    // создаём потомка-воркера
    const child = new Worker(new URL('./worker-2.js', import.meta.url), { type: 'module' });

    // когда потомок пришлёт ответ - отправляем результат в основной поток
    child.onmessage = (ev) => {
        self.postMessage(ev.data); // вверх
        child.terminate();
    };

    // пробрасываем ошибки наверх
    child.onerror = (err) => {
        self.postMessage({ error: err.message });
        child.terminate();
    };

    // передаём те же параметры (timeout)
    child.postMessage(e.data);
};
