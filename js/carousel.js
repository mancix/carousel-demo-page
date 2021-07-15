class Carousel {
    constructor(options) {
        this.options = options;
        this.init()
    }

    /**
     * Initialize and show the carousel
     */
    init() {
        let openingHtml = `<div class="carousel"> 
                                <div class="carousel__info">
                                    <div class="carousel__info-icon">&#9989;</div>
                                    <div class="carousel__info-text"><h1>${this.options.title}</h1><h3>${this.options.subtitle}</h3></div>
                                </div>
                                <button class="carousel__slide-button u-right">❯</button>
                                <button class="carousel__slide-button u-left">❮</button>
                                <div class="carousel__slide-container">`;

        let closingHtml = `    </div>
                           </div>`;

        document.getElementById(this.options.container).innerHTML = openingHtml + closingHtml;

        const random = Math.floor(Math.random() * 6) + 3;
        for (let i = 0; i < random; i++) {
            this.addLoadingCard();
        }

        this.getCards();

        this.attachClick();
    }

    /**
     * Generate the html cards structure
     * @param cards
     * @returns {string}
     */
    generateCards(cards) {
        let slide = "";
        for (let i = 0; i < cards.length; i++) {
            let card = cards[i];
            let cardContainerOpening =
                `<div class="carousel__card-container">
                    <div class="carousel__card">
                        <div class="carousel__card-image">
                            <img src="${card.image}">
                            <div class="carousel__card-image-text">
                                <span>${card.type}</span>
                                <span>${this.convertTime(card.duration)}</span>
                            </div>
                        </div>
                        <div class="carousel__card-text">
                            <p>${card.title}</p>
                        </div>
                    </div>
                    ${card.cardinality !== "single" ? "<div class=\"carousel__card\"></div><div class=\"carousel__card\"></div>" : ""}
                </div>`
            slide += cardContainerOpening;
        }

        return slide;
    }

    /**
     * Add click functions to slide buttons
     */
    attachClick() {
        const container = this.options.container;
        const right = document.querySelector(`#${container} .u-right`);
        const left = document.querySelector(`#${container} .u-left`);
        const slideContainer = document.querySelector(`#${this.options.container} .carousel__slide-container`);

        right.onclick = function () {
            const lastCard = this.getLastCard();
            if (lastCard.className !== "carousel__card-container u-loading" && this.isInViewport(lastCard)) {
                this.addLoadingCard();
                this.addLoadingCard();
                //simulate api call
                this.getCards();
            }

            this.sideScroll(slideContainer, 'right', 25, 100, 10);
        }.bind(this);

        left.onclick = function () {
            this.sideScroll(slideContainer, 'left', 25, 100, 10)
        }.bind(this);
    }

    /**
     * Get cards from an API call
     */
    getCards() {
        this.options.fetchCards(staticCards).then(function (cards) {
            this.removeLoadingCard();
            this.appendNewCards(cards);
        }.bind(this)).catch(function (err) {
            this.removeLoadingCard();
        }.bind(this))
    }

    /**
     * Return the last card in the slide container
     * @returns {Element}
     */
    getLastCard() {
        return document.querySelector(`#${this.options.container} .carousel__slide-container`).lastElementChild;
    }

    /**
     * Add a card placeholder while loading
     */
    addLoadingCard() {
        const slide = document.querySelector(`#${this.options.container} .carousel__slide-container`);
        slide.insertAdjacentHTML("beforeend", `<div class="carousel__card-container u-loading">
            <div class="carousel__card">
                <div class="carousel__card-image u-background-loading"></div>
                <div class="carousel__card-text u-text-loading">
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>`);

    }

    /**
     * Remove all the loading cards
     */
    removeLoadingCard() {
        let cards = document.querySelectorAll("#" + this.options.container + " .carousel__card-container.u-loading");
        for (let i = 0; i < cards.length; i++) {
            cards[i].remove();
        }
    }

    /**
     * Append a new cards at the end of the slide container
     * @param cards
     */
    appendNewCards(cards) {
        const slide = document.querySelector(`#${this.options.container} .carousel__slide-container`);
        slide.insertAdjacentHTML("beforeend", this.generateCards(cards));
    }

    /**
     * Convert duration in human-readable time
     * @param duration
     * @returns {string}
     */
    convertTime(duration) {
        if (duration >= 3600) {
            const h = Math.floor(duration / 3600);
            const m = Math.floor(duration % 3600 / 60);
            return h + 'h ' + m.toString().padStart(2, "0") + 'm';
        } else {
            const m = Math.floor(duration / 60);
            const s = duration % 60;
            return m + ':' + s.toString().padStart(2, "0");
        }
    }

    /**
     * Check if and element is inside the viewport
     * @param element
     * @returns {boolean}
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Move horizontally the slide
     * @param element
     * @param direction
     * @param speed
     * @param distance
     * @param step
     */
    sideScroll(element, direction, speed, distance, step) {
        let scrollAmount = 0;
        let slideTimer = setInterval(function () {
            if (direction === 'left') {
                element.scrollLeft -= step;
            } else {
                element.scrollLeft += step;
            }
            scrollAmount += step;
            if (scrollAmount >= distance) {
                window.clearInterval(slideTimer);
            }
        }, speed);
    }
}

const staticCards = [
    {
        image: "https://www.ehabitat.it/wp-content/uploads/2017/10/bosco.jpg",
        type: "elearning",
        duration: 3600,
        title: "Lorem ipsum dolor sit amet.",
        cardinality: "single"
    },
    {
        image: "https://riformismoesolidarieta.it/wp-content/uploads/2019/12/shutterstock_1011189490.jpg",
        type: "playlist",
        duration: 4200,
        title: "Ut commodo luctus nisl nec rhoncus.",
        cardinality: "collection"
    },
    {
        image: "https://ec.europa.eu/programmes/horizon2020/sites/default/files/newsroom/29_05_17_small_22078.jpg",
        type: "video",
        duration: 7800,
        title: "Lorem ipsum dolor sit amet",
        cardinality: "single"
    },
    {
        image: "https://www.collinsdictionary.com/images/full/mojavedesert_169024493_1000.jpg",
        type: "learning_plan",
        duration: 6600,
        title: "Consectetur adipiscing elit",
        cardinality: "collection"
    },
    {
        image: "https://www.collinsdictionary.com/images/full/lake_281848937_1000.jpg",
        type: "video",
        duration: 3650,
        title: "Maecenas pellentesque tincidunt quam accumsan tempor.",
        cardinality: "single"
    },
    {
        image: "https://ssl.quiksilver.com/static/QS/default/category-assets/marketing-landing/landing/img/snow/tiles/snow_featured_2.jpg",
        type: "video",
        duration: 850,
        title: "Aliquam erat volutpat.",
        cardinality: "single"
    }];


