class Convert {
    constructor() {
        this.url = 'http://api.exchangeratesapi.io/v1/latest?';
        this.apiKey = 'ccc57ef6f9aa2f4b6dd2f9a79df64055';
        this.currensyChoisToSale = document.querySelector('.sale__selected');
        this.currensyChoisToBuy = document.querySelector('.buy__selected');
        this.fieldValueCurrensyToSale = document.querySelector('[name="sale"]');
        this.fieldValueCurrensyToBuy = document.querySelector('[name="buy"]');
        this.fieldForexToSale = document.querySelector('.sale__forex');
        this.fieldForexToBuy = document.querySelector('.buy__forex');
        this.forexToSale = 0;
        this.forexToBuy = 0;
    }

    setEventListenerForSelectedCurrensy() {
        let currensiesToSale = document.querySelectorAll('.sale__button_currency');
        let currensiesToBuy = document.querySelectorAll('.buy__button_currency');

        currensiesToSale.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoisToSale.classList.remove('sale__selected');
                this.currensyChoisToSale = event.target;
                this.currensyChoisToSale.classList.add('sale__selected');
                this.GetExchangeRateFromServer(this.currensyChoisToSale.dataset.currency, this.currensyChoisToBuy.dataset.currency);
            })
        });

        currensiesToBuy.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoisToBuy.classList.remove('buy__selected');
                this.currensyChoisToBuy = event.target;
                this.currensyChoisToBuy.classList.add('buy__selected');
                this.GetExchangeRateFromServer(this.currensyChoisToSale.dataset.currency, this.currensyChoisToBuy.dataset.currency);
            })
        });
    }

    setEventListenerForInput() {
        this.fieldValueCurrensyToSale.addEventListener('input', () => {
            this.updateInfo(true);
        });

        this.fieldValueCurrensyToBuy.addEventListener('input', () => {
            this.updateInfo(false);
        });
    }

    /**
     * Запрос курса валюты на сервере
     * @param {*} base Валюта, которую хотим поменять
     * @param {*} symbol Валюта, на которую хотим поменять
     */
    GetExchangeRateFromServer(base, symbol) {
        if (base === symbol) {
            this.forexToSale = this.forexToBuy = 1;
            this.updateInfo();
            return;
        }

        let messageError = document.querySelector('.main__error');
        messageError.textContent = '';

        console.log(this.url + `access_key=${this.apiKey}&base=${base}&symbols=${symbol}`)
        fetch(this.url + `access_key=${this.apiKey}&base=${base}&symbols=${symbol}`)
            .then(request => request.json())
            .then(data => {
                console.log(data.rates[symbol]);
                this.forexToSale = data.rates[symbol];
                this.forexToBuy = 1 / this.forexToSale;
                this.updateInfo();
            })
            .catch(error => {
                messageError.textContent = 'Что-то пошло не так. Попробуйте ещё раз';
                this.forexToSale = this.forexToBuy = 0;
                this.updateInfo();
                console.log(error);
            })
    }


    updateInfo(isSale = true) {
        this.fieldForexToSale.textContent = `1 ${this.currensyChoisToSale.textContent} = ${this.forexToSale.toFixed(4)} ${this.currensyChoisToBuy.textContent}`;
        this.fieldForexToBuy.textContent = `1 ${this.currensyChoisToBuy.textContent} = ${this.forexToBuy.toFixed(4)} ${this.currensyChoisToSale.textContent}`;
        if (isSale) {
            this.fieldValueCurrensyToBuy.value = this.roundNumber((this.fieldValueCurrensyToSale.value * this.forexToSale));
        } else {
            this.fieldValueCurrensyToSale.value = this.roundNumber((this.fieldValueCurrensyToBuy.value * this.forexToBuy));
        }
    }

    /**
     * Округление до 4 знаков после запятой
     * @param {*} number Числок, которое округляем
     * @returns Округленное число
     */
    roundNumber(number) {
        //сколько знаков после запятой нужно
        let i = 4;
        return Math.round(number * (10 ** i)) / (10 ** i)
    }

    init() {
        this.GetExchangeRateFromServer(this.currensyChoisToSale.dataset.currency, this.currensyChoisToBuy.dataset.currency);
        this.setEventListenerForSelectedCurrensy();
        this.setEventListenerForInput();
    }
}

let convert = new Convert();
convert.init();