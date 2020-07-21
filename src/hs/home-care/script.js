window.hc = function () {
  let excess;
  const packagePricing = {
    0: [2050, 23400, 2400, 27600, 3300, 38400, 3800, 44400],
    60: [1400, 15600, 1700, 19200, 2100, 24000, 2350, 27000]
  };

  // Excess radio handler
  const excessRadio = document.querySelector('ns-inputter.excess');
  excessRadio.addEventListener('change', (event) => {
    const newExcess = event.target.value;
    if (newExcess !== excess) {
      excess = event.target.value;
      this.updateProductPricing(excess);
    }
  });

  updateProductPricing = function (excess) {
    const prices = document.querySelectorAll('.homecare-packages ns-product-card [slot="price"] ns-price');
    prices.forEach((price, index) => {
      price.pence = String(packagePricing[excess][index]);
    });
  }

  // Add giftcard banner
  const bannerLockup = document.querySelector('ns-lockup').querySelector(':not(:defined)');
  customElements.whenDefined('ns-panel').then(() => {
    customElements.whenDefined('ns-lockup').then(() => {
      customElements.whenDefined('ns-image').then(() => {
        const image = bannerLockup.shadowRoot;
        let p = document.createElement("p");
        p.className = 'banner';
        p.innerHTML = `
          <style>
            .banner {
              position: relative;
              margin: 0;
              bottom: 0;
              font-size: 1.5em;
              line-height: 1.3em;
              font-weight: bold;
              padding: 20px 30px 20px 90px;
              background: #FFDD57 url(/assets/hs/home-care/present.svg) no-repeat 30px 25px;
              background-size: 35px 35px;
            }

            @media (min-width: 1024px) {
              .banner {
                position: absolute;
              }
            }
          </style>
          ${document.querySelector('ns-image').innerHTML}`;
        image.appendChild(p)
      });
    });
  });
}()