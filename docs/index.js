const componentName = 'my-select';
const fruits = ['Apple', 'Orange', 'Banana'];

const script = document.createElement('script');
script.src = `./${componentName}.js`;
script.dataset.name = componentName;

script.onload = () => {
    const element = document.createElement(componentName);
    element.innerHTML = fruits.map(fruit => `<option value="${fruit.toLowerCase()}">${fruit}</option>`).join('');
    document.body.append(element);
};

script.onerror = () => console.error(`Cannot load ${script.src}`);
document.body.append(script);
