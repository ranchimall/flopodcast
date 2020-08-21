//Button
const smButton = document.createElement('template')
smButton.innerHTML = `
        <style>     
            *{
                padding: 0;
                margin: 0;
                box-sizing: border-box;
            }       
            :host{
                display: inline-flex;
            }
            :host([disabled]) .button{
                cursor: default;
                opacity: 1;
                background: rgba(var(--text-color), 0.4) !important;
                color: rgba(var(--foreground-color), 1);
            }
            :host([variant='primary']) .button{
                background: hsl(var(--hue), var(--saturation), var(--lightness));
                color: rgba(var(--foreground-color), 1);
            }
            :host([variant='outlined']) .button{
                box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset;
                background: rgba(var(--foreground-color), 1); 
                color: var(--accent-color);
            }
            :host([variant='no-outline']) .button{
                background: rgba(var(--foreground-color), 1); 
                color: var(--accent-color);
            }
            .button {
                display: flex;
                width: 100%;
                padding: 0.6rem 1rem;
                cursor: pointer;
                user-select: none;
                border-radius: 0.3rem; 
                justify-content: center;
                transition: box-shadow 0.3s;
                text-transform: capitalize;
                font-size: 0.9em;
                font-weight: 500;
                color: rgba(var(--text-color), 0.9);
                font-family: var(--font-family);
                background: rgba(var(--text-color), 0.1); 
                -webkit-tap-highlight-color: transparent;
                outline: none;
            }
            :host(:not([disabled])) .button:focus{
                box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.2);
            }
            :host([variant='outlined']) .button:focus{
                box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
            }
            @media (hover: hover){
                :host(:not([disabled])) .button:active{
                    box-shadow: none !important;
                }
                :host([variant='outlined']) .button:active{
                    box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset !important;
                }
                :host(:not([disabled])) .button:hover{
                    box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.12);
                }
                :host([variant='outlined']) .button:hover{
                    box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.12);
                }
                :host([variant="primary"]:not([disabled])) .button:active{
                    background: hsl(var(--hue), var(--saturation), calc(var(--lightness) - 20%)) !important;
                }
                :host([variant="primary"]:not([disabled])) .button:hover{
                    background: hsl(var(--hue), var(--saturation), calc(var(--lightness) - 10%));
                }
            }
            @media (hover: none){
                :host(:not([disabled])) .button:active{
                    box-shadow: 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.2rem 0.8rem rgba(0, 0, 0, 0.2);
                }
                :host([variant='outlined']) .button:active{
                    box-shadow: 0 0 0 1px rgba(var(--text-color), 0.2) inset, 0 0.1rem 0.1rem rgba(0, 0, 0, 0.1), 0 0.4rem 0.8rem rgba(0, 0, 0, 0.2);
                }
            }
        </style>
        <div part="button" class="button" tabindex="0" role="button">
            <slot></slot>   
        </div>`;
customElements.define('sm-button',
    class extends HTMLElement {
        constructor() {
            super()
            this.attachShadow({ mode: 'open' }).append(smButton.content.cloneNode(true))
        }

        get disabled() {
            return this.isDisabled
        }

        set disabled(value) {
            if (value && !this.isDisabled) {
                this.isDisabled = true
                this.setAttribute('disabled', '')
                this.button.removeAttribute('tabindex')
            }
            else if (this.isDisabled) {
                this.isDisabled = false
                this.removeAttribute('disabled')
            }
        }

        dispatch() {
            if (this.isDisabled) {
                this.dispatchEvent(new CustomEvent('disabled', {
                    bubbles: true,
                    composed: true
                }))
            }
            else {
                this.dispatchEvent(new CustomEvent('clicked', {
                    bubbles: true,
                    composed: true
                }))
            }
        }

        connectedCallback() {
            this.isDisabled = false
            this.button = this.shadowRoot.querySelector('.button')
            if (this.hasAttribute('disabled') && !this.isDisabled)
                this.isDisabled = true
            this.addEventListener('click', (e) => {
                this.dispatch()
            })
            this.addEventListener('keyup', (e) => {
                if (e.code === "Enter" || e.code === "Space")
                    this.dispatch()
            })
        }
    })

//carousel

const smCarousel = document.createElement('template')
smCarousel.innerHTML = `
<style>
    *{
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    } 
    :host{
        display: flex;
    }
    .icon {
        position: absolute;
        display: flex;
        fill: none;
        height: 2.6rem;
        width: 2.6rem;
        border-radius: 3rem;
        padding: 0.9rem;
        stroke: rgba(var(--foreground-color), 0.8);
        stroke-width: 14;
        overflow: visible;
        stroke-linecap: round;
        stroke-linejoin: round;
        cursor: pointer;
        min-width: 0;
        background: rgba(var(--text-color), 1);
        box-shadow: 0 0.2rem 0.2rem #00000020, 
                    0 0.5rem 1rem #00000040; 
        -webkit-tap-highlight-color: transparent;
        transform: scale(0)
    }
    .hide{
        pointer-events: none;
        opacity: 0;
    }
    .expand{
        transform: scale(1)
    }
    .previous-item{
        left: 1rem;
    }
    .next-item{
        right: 1rem;
    }
    .left,.right{
        position: absolute;
        width: 2rem;
        height: 100%; 
        transition: opacity 0.3s;
    }
    .left{
        background: linear-gradient(to left, transparent, rgba(var(--foreground-color), 0.6))
    }
    .right{
        right: 0;
        background: linear-gradient(to right, transparent, rgba(var(--foreground-color), 0.6))
    }
    .carousel-container{
        position: relative;
        display: flex;
        width: 100%;
        align-items: center;
    }
    .carousel{
        display: flex;
        max-width: 100%;
        overflow: auto hidden;
        scroll-snap-type: x mandatory;
    }
    slot::slotted(*){
        scroll-snap-align: center;
    }
    :host([align-items="start"]) slot::slotted(*){
        scroll-snap-align: start;
    }
    :host([align-items="center"]) slot::slotted(*){
        scroll-snap-align: center;
    }
    :host([align-items="end"]) slot::slotted(*){
        scroll-snap-align: end;
    }
    @media (hover: hover){
        .carousel{
            overflow: hidden;
        }
        .left,.right{
            display: none;
        }
    }
    @media (hover: none){
        ::-webkit-scrollbar-track {
            -webkit-box-shadow: none !important;
            background-color: transparent !important;
        }
        ::-webkit-scrollbar {
            height: 0;
            background-color: transparent;
        }
        .carousel{
            overflow: auto none;
        }
        .icon{
            display: none;
        }
        .left,.right{
            display: block;
        }
    }
</style>
<div class="carousel-container">
    <div class="left"></div>
    <svg class="icon previous-item" viewBox="4 0 64 64">
        <title>Previous</title>
        <polyline points="48.01 0.35 16.35 32 48.01 63.65"/>
    </svg>
    <div part="carousel" class="carousel">
        <slot></slot>
    </div>
    <svg class="icon next-item" viewBox="-6 0 64 64">
        <title>Next</title>
        <polyline points="15.99 0.35 47.65 32 15.99 63.65"/>
    </svg>
    <div class="right"></div>
</div>
`;

customElements.define('sm-carousel', class extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' }).append(smCarousel.content.cloneNode(true))
    }

    scrollLeft() {
        this.carousel.scrollBy({
            top: 0,
            left: -this.scrollDistance,
            behavior: 'smooth'
        })
    }

    scrollRight() {
        this.carousel.scrollBy({
            top: 0,
            left: this.scrollDistance,
            behavior: 'smooth'
        })
    }

    connectedCallback() {
        this.carousel = this.shadowRoot.querySelector('.carousel')
        this.carouselContainer = this.shadowRoot.querySelector('.carousel-container')
        this.carouselSlot = this.shadowRoot.querySelector('slot')
        this.nextArrow = this.shadowRoot.querySelector('.next-item')
        this.previousArrow = this.shadowRoot.querySelector('.previous-item')
        this.nextGradient = this.shadowRoot.querySelector('.right')
        this.previousGradient = this.shadowRoot.querySelector('.left')
        this.carouselItems
        this.scrollDistance = this.carouselContainer.getBoundingClientRect().width / 3
        const firstElementObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                this.previousArrow.classList.remove('expand')
                this.previousGradient.classList.add('hide')
            }
            else {
                this.previousArrow.classList.add('expand')
                this.previousGradient.classList.remove('hide')
            }
        }, {
            root: this.carouselContainer,
            threshold: 0.9
        })
        const lastElementObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                this.nextArrow.classList.remove('expand')
                this.nextGradient.classList.add('hide')
            }
            else {
                this.nextArrow.classList.add('expand')
                this.nextGradient.classList.remove('hide')
            }
        }, {
            root: this.carouselContainer,
            threshold: 0.9
        })

        const carouselObserver = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                this.scrollDistance = this.carouselContainer.getBoundingClientRect().width / 3
            }
        })

        carouselObserver.observe(this.carouselContainer)

        this.carouselSlot.addEventListener('slotchange', e => {
            this.carouselItems = this.carouselSlot.assignedElements()
            firstElementObserver.observe(this.carouselItems[0])
            lastElementObserver.observe(this.carouselItems[this.carouselItems.length - 1])
        })

        this.addEventListener('keyup', e => {
            if (e.code === 'ArrowLeft')
                this.scrollRight()
            else
                this.scrollRight()
        })

        this.nextArrow.addEventListener('click', this.scrollRight.bind(this))
        this.previousArrow.addEventListener('click', this.scrollLeft.bind(this))
    }

    disconnectedCallback() {
        this.nextArrow.removeEventListener('click', this.scrollRight.bind(this))
        this.previousArrow.removeEventListener('click', this.scrollLeft.bind(this))
    }
})
