// получает timeout, выполняет медленную функцию и шлёт результат
const slowFunction = (timeout = 3000) => {
    const start = performance.now();
    let x = 0, i = 0;
    
    while (performance.now() - start < timeout) x += (Math.random() - .5) * ++i;
    return { iterations: i, sum: x.toFixed(2) };
};

self.onmessage = (e) => {
    const ms = e.data?.timeout ?? 3000;
    self.postMessage(slowFunction(ms));
};
