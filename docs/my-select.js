class MySelect extends HTMLElement {
    #outsideClickHandler; #selectButton; #selectPopup; #selectPopupSearch; #optionsBox;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() { // Срабатывает, когда пользовательский элемент впервые добавляется в DOM.
        if (!this.shadowRoot.hasChildNodes()) this.#createTemplate();
        this.#collectAndRender();

        // подписка на глобальные клики
        this.#outsideClickHandler = (e) => { if (!this.contains(e.target) && !this.shadowRoot.contains(e.target)) this.removeAttribute('open') };
        document.addEventListener('click', this.#outsideClickHandler);
    }

    disconnectedCallback() { // Срабатывает, когда пользовательский элемент удаляется из DOM.
        document.removeEventListener('click', this.#outsideClickHandler);
    }

    #createTemplate() {
        const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: './my-select.css' });
        const btn = Object.assign(document.createElement('button'), { className: 'select-button', textContent: '—' });
        const popup = Object.assign(document.createElement('div'), { className: 'select-popup' });
        const box = Object.assign(document.createElement('div'), { className: 'select-popup-options' });
        const search = Object.assign(document.createElement('input'), { className: 'select-popup-search', placeholder: 'Search...' });
        search.addEventListener('input', () => this.#filterOptions(search.value));

        popup.append(search, box);
        this.shadowRoot.append(link, btn, popup);

        // сохраняем ссылки
        this.#selectButton = btn;
        this.#selectPopup = popup;
        this.#selectPopupSearch = search;
        this.#optionsBox = box;

        btn.addEventListener('click', () => this.toggleAttribute('open'));
        box.addEventListener('click', (e) => {
            const label = e.target.closest('.option');
            if (!label) return;

            const checkboxes = this.#optionsBox.querySelectorAll('input[type="checkbox"]');
            const selected = Array.from(checkboxes).filter(cb => cb.checked);

            const count = selected.length;
            this.#selectButton.textContent = count === 1
                ? selected[0].closest('label')?.querySelector('span')?.textContent || '—'
                : count > 1 ? `Выбрано элементов: ${count}` : '—';
        });
    }

    #filterOptions(value) {
        const query = value.trim().toLowerCase();
        this.#optionsBox.querySelectorAll('.option').forEach((label) => {
            const text = label.querySelector('span').textContent.toLowerCase();
            label.style.display = query && !text.includes(query) ? 'none' : '';
        });
    }

    #collectAndRender() {
        const data = Array.from(this.querySelectorAll('option')).map(o => ({ value: o.value, label: o.textContent }));

        this.querySelectorAll('option').forEach(o => o.remove());
        this.#renderOptions(data);
    }

    #renderOptions(arr) {
        if (!this.constructor.#tpl) {
            const tpl = document.createElement('template');

            const label = document.createElement('label');
            label.className = 'option';
            label.dataset.value = '';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';

            const span = document.createElement('span');

            label.append(checkbox, span);
            tpl.content.append(label);

            this.constructor.#tpl = tpl;
        }

        this.#optionsBox.innerHTML = '';
        const frag = document.createDocumentFragment();

        arr.forEach(({ value, label }) => {
            const node = this.constructor.#tpl.content.firstElementChild.cloneNode(true);
            node.dataset.value = value;
            node.querySelector('span').textContent = label;
            frag.append(node);
        });

        this.#optionsBox.append(frag);
    }

    static #tpl;
}

const tag = document.currentScript?.dataset.name || 'my-select';
if (!customElements.get(tag)) customElements.define(tag, MySelect);
