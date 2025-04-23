class MySelect extends HTMLElement {
    constructor() {
        super();
        const root = this.attachShadow({ mode: 'open' });

        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', './my-select.css');

        // label
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = '—';

        // options
        const list = document.createElement('div');
        list.className = 'list';

        const slot = document.createElement('slot');
        list.appendChild(slot);

        root.append(link, label, list);

        label.addEventListener('click', () => this.toggleAttribute('open'));
        this.addEventListener('click', e => {
            if (e.target instanceof HTMLOptionElement) {
                label.textContent = e.target.textContent;
                this.removeAttribute('open');
            }
        });
    }
}

const tag = document.currentScript?.dataset.name || 'my-select';
if (!customElements.get(tag)) customElements.define(tag, MySelect);
