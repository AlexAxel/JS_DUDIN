class MyCard extends HTMLElement {
    #titleEl; #subTitleEl;

    static get observedAttributes() { // атрибуты, за которыми следим
        return ['header', 'sub-header'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const tmpl = document.createElement('template');
        tmpl.innerHTML = `
            <link rel="stylesheet" href="./my-card.css">
            <section class="card">
                <header class="card-header">
                    <slot name="header">
                    <h3 class="card-title"></h3>
                    <h4 class="card-subtitle"></h4>
                    </slot>
                </header>
        
                <div class="card-body">
                    <slot></slot>
                </div>
        
                <footer class="card-footer">
                    <slot name="footer"></slot>
                </footer>
            </section>
        `;

        this.shadowRoot.append(tmpl.content.cloneNode(true));

        // кэшируем заголовки
        this.#titleEl = this.shadowRoot.querySelector('.card-title');
        this.#subTitleEl = this.shadowRoot.querySelector('.card-subtitle');

        // первичное заполнение
        this.#updateHeader(this.getAttribute('header'));
        this.#updateSubHeader(this.getAttribute('sub-header'));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'header') this.#updateHeader(newValue);
        if (name === 'sub-header') this.#updateSubHeader(newValue);
    }

    #updateHeader(text) {
        if (this.#titleEl) this.#titleEl.textContent = text || 'Card header';
    }

    #updateSubHeader(text) {
        if (!this.#subTitleEl) return;

        this.#subTitleEl.textContent = text ? text : '';
        this.#subTitleEl.style.display = text ? '' : 'none';
    }
}

const tagCard = document.currentScript?.dataset.name || 'my-card';
if (!customElements.get(tagCard)) customElements.define(tagCard, MyCard);
