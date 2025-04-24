class MyCard extends HTMLElement {
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
                    <h3 class="card-title">${this.dataset.header || 'Card header'}</h3>
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
    }
}

const tagCard = document.currentScript?.dataset.name || 'my-card';
if (!customElements.get(tagCard)) customElements.define(tagCard, MyCard);
