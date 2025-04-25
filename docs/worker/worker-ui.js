let worker = null; // воркер (жив/мёртв)
let activeTasks = 0; // количество активных задач сейчас выполняется

const btn = document.getElementById('start');
const spinner = document.getElementById('spinner');
const resultEl = document.getElementById('result');

btn.addEventListener('click', () => {
    if (!window.Worker) { alert('Web Workers не поддерживаются'); return; }

    if (!worker) { // оздаём воркер только при первом запуске
        worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });
        worker.onerror = (err) => console.error('worker error', err);
        worker.onmessage = (e) => {
            // activeTasks--;
            spinner.hidden = true;
            const { iterations, sum } = e.data;
            resultEl.textContent = `✅ iterations: ${iterations} | sum: ${sum}`;

            if (--activeTasks === 0) { // когда задач не осталось - убиваем воркер
                worker.terminate();
                worker = null; // позволит создать нового на след. клике
            }
        };        
    }

    // отправляем новую задачу текущему (или новому) воркеру
    activeTasks++;
    spinner.hidden = false;
    resultEl.textContent = '';
    worker.postMessage({ timeout: 3000 });
});
