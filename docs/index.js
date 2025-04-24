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
    card.setAttribute('data-header', 'Выбор фруктов');

    // footer
    const footer = document.createElement('div');
    footer.setAttribute('slot', 'footer');
    // footer.innerHTML = `<button disabled>...</button>`;
    card.append(footer);

    // select
    const element = document.createElement('my-select');
    element.innerHTML = fruits.map(fruit => `<option value="${fruit.toLowerCase()}">${fruit}</option>`).join('');
    card.append(element);

    document.body.append(card);
}
