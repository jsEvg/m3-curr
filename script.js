class Convert {
    constructor() {
        this.url = 'http://api.exchangeratesapi.io/v1/latest?';
        this.apiKey = 'ccc57ef6f9aa2f4b6dd2f9a79df64055';
        this.currensyChoisToSale = document.querySelector('.sale__selected');
        this.currensyChoisToBuy = document.querySelector('.buy__selected');
        this.fieldValueCurrensyToSale = document.querySelector('[name="sale"]');
        this.fieldValueCurrensyToBuy = document.querySelector('[name="buy"]');
        this.fieldForexToSale = document.querySelector('.s-exchange');
        this.fieldForexToBuy = document.querySelector('.b-exchange');
        this.forexToSale = 0;
        this.forexToBuy = 0;
        this.currQuotations = [];
    }

    setEventListenerForSelectedCurrensy() {
        let currensiesToSale = document.querySelectorAll('.s-button-cur');
        let currensiesToBuy = document.querySelectorAll('.b-button-cur');

        currensiesToSale.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoisToSale.classList.remove('sale__selected');
                this.currensyChoisToSale = event.target;
                this.currensyChoisToSale.classList.add('sale__selected');
                this.getRate(this.currensyChoisToSale.dataset.currency, this.currensyChoisToBuy.dataset.currency);
            })
        });

        currensiesToBuy.forEach((currency) => {
            currency.addEventListener('click', (event) => {
                this.currensyChoisToBuy.classList.remove('buy__selected');
                this.currensyChoisToBuy = event.target;
                this.currensyChoisToBuy.classList.add('buy__selected');
                this.getRate(this.currensyChoisToSale.dataset.currency, this.currensyChoisToBuy.dataset.currency);
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
     * TODO ???????????????? ?????????? ?????????????? ???????????? ?????? ?????????????????????? ?????????????????????? ???????????? ????????????????????????????????
     */
    async getRate(base, symbol) {
        if (base === symbol) {
            this.forexToSale = this.forexToBuy = 1;
            this.updateInfo();
            return;
        }

        let messageError = document.querySelector('.c-error');
        messageError.textContent = '';

        // ?????????????????? ???????????? ?? ?????????????????????? ???????????? ???????????? ??????
        // TODO ?????????????? ???????????????????????????? ???????????? ?????? ?? ??????????????
        if (this.currQuotations.length == 0) {
            await fetch("https://www.cbr-xml-daily.ru/daily_json.js")
                .then(response => response.json())
                .then(data => {

                    // console.log(data); // check response
                    this.currQuotations = [
                        new CurrQuotation('EUR', Number(data.Valute.EUR.Value)),
                        new CurrQuotation('GBP', Number(data.Valute.GBP.Value)),
                        new CurrQuotation('USD', Number(data.Valute.USD.Value)),
                    ]
                })
                .catch(error => {
                    messageError.textContent = '??????-???? ?????????? ???? ??????. ???????????????????? ?????? ??????';
                    this.forexToSale = this.forexToBuy = 0;
                    this.updateInfo();
                    console.log(error);
                });
            this.handleDataRates(base, symbol);
        } else this.handleDataRates(base, symbol);
    }

    handleDataRates(base, symbol) {
        let dataRates = () => {
            if (base === 'RUB') {
                return this.getQuotation(symbol);
            } else if (symbol === 'RUB') {
                return this.getQuotation(base);
            } else {
                let first = this.getQuotation(base);
                let second = this.getQuotation(symbol);
                return Number(first) / Number(second); // like EUR = 89.6731 / USD = 73.587 = 1.2185
            }
        };
        this.forexToSale = dataRates();
        this.forexToBuy = 1 / this.forexToSale;
        this.updateInfo();
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

    getQuotation(filterParam) {
        return this.currQuotations.find(el => el.curr === filterParam).quotation;
    }

    roundNumber(number) {
        let i = 4;
        return Math.round(number * (10 ** i)) / (10 ** i)
    }

    init() {
        this.getRate(this.currensyChoisToSale.dataset.currency, this.currensyChoisToBuy.dataset.currency);
        this.setEventListenerForSelectedCurrensy();
        this.setEventListenerForInput();
    }
}

let convert = new Convert();
convert.init();

class CurrQuotation {
    constructor(curr, quotation) {
        this.curr = curr;
        this.quotation = quotation;
    }
}