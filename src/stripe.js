var handler = StripeCheckout.configure({
  key: 'pk_test_W4oyNJMHYlny4XYgZ7iBHbjj',
  image: '/foundation/img/vigilate_logo.png',
  locale: 'auto',
  token: function(token) {
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
  }
});

$(document).on('click', '#customButtonBasic', function(e) {   
  // Open Checkout with further options:
  handler.open({
    name: 'Basic',
    description: 'Basic offer',
	zipCode: true,
	currency: "EUR",
    amount: 00
  });
  e.preventDefault();
});

$(document).on('click', '#customButtonSilver', function(e) {   
  // Open Checkout with further options:
  handler.open({
    name: 'Silver',
    description: 'Silver offer',
	zipCode: true,
	currency: "EUR",
    amount: 999
  });
  e.preventDefault();
});

$(document).on('click', '#customButtonGold', function(e) {   
  // Open Checkout with further options:
  handler.open({
    name: 'Gold',
    description: 'Gpmd offer',
	zipCode: true,
	currency: "EUR",
    amount: 4999
  });
  e.preventDefault();
});


// Close Checkout on page navigation:
$(window).on('popstate', function() {
  handler.close();
});