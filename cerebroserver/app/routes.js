module.exports = function(app) {

	// api ---------------------------------------------------------------------

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.render('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});
};