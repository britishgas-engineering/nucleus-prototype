window.hc = function () {
  let excess;
  const packagePricing = {
    'zero': [2050, 23400, 2400, 27600, 3300, 38400, 3800, 44400],
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
}();
