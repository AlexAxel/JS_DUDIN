let worker = null; // воркер (жив/мёртв)
let queue = [];
let dotTimer = null;
let activeJob = null;

const log = document.getElementById('log');
const btn = document.getElementById('start');

btn.addEventListener('click', onStartClick);

function onStartClick() {
    const isNewWorker = !worker;
    if (isNewWorker) createWorker();

    const line = document.createElement('div');
    line.className = 'line';

    if (!activeJob) {
        // Если нет активной задачи - выполняем её сразу!
        activeJob = { line, state: 'working' };
        line.innerHTML = `<span class="green">🟢 Создан</span> — Working`;
        log.append(line);
        startDots(activeJob);
        worker.postMessage({ timeout: 3000 });
    } else {
        // иначе в очередь
        line.innerHTML = `<span class="wait">⏳ Ожидание</span>`;
        log.append(line);
        queue.push({ line, state: 'wait' });
    }
}

// создаём воркер
function createWorker() {
    worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
    worker.onerror = (err) => console.error('worker error', err);
    worker.onmessage = (e) => {
        stopDots();
        const { iterations, sum } = e.data;
        activeJob.line.innerHTML = `<span class="green">✅</span> ${iterations} | ${sum}`;
        activeJob = null;

        if (queue.length) {
            nextTask();
        } else {
            destroyWorker();
        }
    };
}

// запустить следующую задачу
function nextTask() {
    if (!queue.length) return;

    activeJob = queue.shift();
    activeJob.state = 'working';

    activeJob.line.innerHTML = `<span class="orange">🟠 Переиспользован</span> — Working`;
    startDots();
    worker.postMessage({ timeout: 3000 });
}

// уничтожение воркера
function destroyWorker() {
    worker.terminate();
    worker = null;

    const endLine = document.createElement('div');
    endLine.className = 'line red';
    endLine.textContent = '🔴 Уничтожен';
    log.append(endLine);
}

function startDots() {
    let dots = 0;
    stopDots();
    dotTimer = setInterval(() => {
        dots = (dots + 1) % 4;
        if (activeJob) activeJob.line.innerHTML = `<span class="orange">🟠 В работе</span> — Working` + '.'.repeat(dots);
    }, 1000);
}

function stopDots() {
    clearInterval(dotTimer);
    dotTimer = null;
}
