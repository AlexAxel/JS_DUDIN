const components = ['my-select', 'my-card'];
const fruits = ['Apple', 'Orange', 'Banana'];

let loaded = 0;
components.forEach(name => {
    const script = document.createElement('script');
    script.src = `./${name}.js`;
    script.dataset.name = name;

    script.onload = () => { if (++loaded === components.length) init(); };
    script.onerror = () => console.error(`Cannot load ${script.src}`);
    document.body.append(script);
});

function init() { // создаём <my-card> и помещаем в него <my-select>
    const card = document.createElement('my-card');
    card.setAttribute('header', 'Выбор фруктов');
    card.setAttribute('sub-header', 'Демонстрация');

    // footer
    const footer = document.createElement('div');
    footer.setAttribute('slot', 'footer');

    const btn = document.createElement('button');
    btn.textContent = 'Изменить заголовки';

    footer.append(btn);
    btn.addEventListener('click', () => {
        const now = Date.now().toString().slice(-4);
        card.setAttribute('header', `Выбор фруктов :upd${now}`);
        card.setAttribute('sub-header', `Случайный ID: ${Math.floor(Math.random() * 1000)}`);
    });

    card.append(footer);

    // select
    const element = document.createElement('my-select');
    element.innerHTML = fruits.map(fruit => `<option value="${fruit.toLowerCase()}">${fruit}</option>`).join('');
    card.append(element);

    document.body.append(card);
}
