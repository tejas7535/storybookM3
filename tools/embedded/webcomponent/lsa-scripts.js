function getRandomPrice() {
  const min = 0.25;
  const max = 2.5;
  const randomPrice = Math.random() * (max - min) + min;
  return parseFloat(randomPrice.toFixed(2));
}

function handleAvailabilityRequest(event) {
  const eventTextArea = document.getElementById('lsa-events');

  eventTextArea.value = 'Availability Request received\n ';
  eventTextArea.value += JSON.stringify(event.detail.details);

  // Simulate a response with a non-blocking timeout
  setTimeout(() => {
    const transformedPimIds = event.detail.details.payload.pimIds.reduce(
      (acc, pimId) => {
        acc[pimId] = {
          available: Math.random() >= 0.5,
          price: getRandomPrice(),
          currency: 'EUR',
        };
        return acc;
      },
      {}
    );

    const response = {
      items: {
        ...transformedPimIds,
      },
    };

    eventTextArea.value +=
      '\n\n***************************************************\n ';
    eventTextArea.value += 'Availability callback\n ';
    eventTextArea.value += JSON.stringify(response, undefined, 2);
    event.detail.callback(response);
  }, 2000); // Delay of 1000 milliseconds (1 second)
}

function handleAddToCartEvent(event) {
  const eventTextArea = document.getElementById('lsa-add-to-cart-events');

  eventTextArea.value = 'Add to Cart Event received\n ';
  eventTextArea.value += JSON.stringify(event.detail, undefined, 2);
}

function setUpLSAListeners() {
  const lubricatorElement = getLsaApp();

  if (lubricatorElement) {
    lubricatorElement.addEventListener(
      'availabilityRequest',
      handleAvailabilityRequest
    );

    lubricatorElement.addEventListener('addToCart', handleAddToCartEvent);

    const lsaEventsContainer = document.getElementById('lsa-events-container');
    lsaEventsContainer.style.display = 'flex';
  }
}

function getLsaApp() {
  return document.querySelector('lubricator-selection-assistant');
}
