var handler = StripeCheckout.configure({
  key: 'pk_test_W4oyNJMHYlny4XYgZ7iBHbjj',
  image: '/foundation/img/vigilate_logo.png',
  locale: 'auto',
  token: function(token) {
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
  }
});

$(document).on('click', '#customButton', function(e) {   
  // Open Checkout with further options:
  handler.open({
    name: 'Demo Site',
    description: '2 widgets',
	zipCode: true,
	currency: "EUR",
    amount: 2000
  });
  e.preventDefault();
});

// Close Checkout on page navigation:
$(window).on('popstate', function() {
  handler.close();
});