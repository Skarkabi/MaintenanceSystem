exports.config = {
	// set to "custom" instead of cucumber.
	framework: 'custom',
  
	// path relative to the current config file
	frameworkPath: require.resolve('protractor-cucumber-framework'),
  
	cucumberOpts: {
		cucumberOpts: {
			format: [require.resolve('cucumber-pretty')]
		}
	}
  };