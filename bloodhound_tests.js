
QUnit.module("Basic Tests", {
	beforeEach: function() {
	},
	afterEach: function() {
	}});

QUnit.test( "String observable", function( assert ) {

	var TestModel = function() {
		var self = this;
		self.MyValue = ko.observable("Test").extend({sniff: {}});
	};
	var vm = new TestModel();
	vm.MyValue("Test Change");
	assert.equal(vm.MyValue.modified, true);
	assert.equal(vm.MyValue.originalValue, "Test");
});

QUnit.test( "Date observable", function( assert ) {

	var d = new Date(2015, 8, 1);
	var TestModel = function() {
		var self = this;
		self.MyValue = ko.observable(d).extend({sniff: {}});
	};
	var vm = new TestModel();
	vm.MyValue(new Date(2015, 8, 2));
	assert.equal(vm.MyValue.modified, true);
	assert.equal(vm.MyValue.originalValue, d);
});

QUnit.test( "Integer observable", function( assert ) {

	var x = 10;
	var TestModel = function() {
		var self = this;
		self.MyValue = ko.observable(x).extend({sniff: {}});
	};
	var vm = new TestModel();
	vm.MyValue(20);
	assert.equal(vm.MyValue.modified, true);
	assert.equal(vm.MyValue.originalValue, x);
});

QUnit.test( "Decimal observable", function( assert ) {

	var x = 10.1234;
	var TestModel = function() {
		var self = this;
		self.MyValue = ko.observable(x).extend({sniff: {}});
	};
	var vm = new TestModel();
	vm.MyValue(10.12345);
	assert.equal(vm.MyValue.modified, true);
	assert.equal(vm.MyValue.originalValue, x);
});

QUnit.test( "Type ambiguity", function( assert ) {

	var x = 10.1234;
	var TestModel = function() {
		var self = this;
		self.MyValue = ko.observable(x).extend({sniff: {}});
	};
	var vm = new TestModel();
	vm.MyValue("10.1234");
	assert.equal(vm.MyValue.modified, false);
	assert.equal(vm.MyValue.originalValue, x);
});


QUnit.test( "Type ambiguity (strict)", function( assert ) {

	var x = 10.1234;
	var TestModel = function() {
		var self = this;
		self.MyValue = ko.observable(x).extend({sniff: {strict: true}});
	};
	var vm = new TestModel();
	vm.MyValue("10.1234");
	assert.equal(vm.MyValue.modified, true);
	assert.equal(vm.MyValue.originalValue, x);
});

QUnit.test( "Observable array add", function( assert ) {

	var TestModel = function() {
		var self = this;
		self.MyArray = ko.observableArray([{MyValue: 10}]).extend({sniff: {}});
	};
	var vm = new TestModel();
	vm.MyArray.push({MyValue: 20});
	assert.equal(vm.MyArray.modified, true);
	assert.equal(vm.MyArray.originalValue.length, 1);

});

QUnit.test( "Observable array remove", function( assert ) {

	var TestModel = function() {
		var self = this;
		self.MyArray = ko.observableArray([{MyValue: 10},{MyValue: 20}]).extend({sniff: {}});
	};
	var vm = new TestModel();
	vm.MyArray.remove(function(item) { return item.MyValue === 10 })
	assert.equal(vm.MyArray.modified, true);
	assert.equal(vm.MyArray.originalValue.length, 2);

});

QUnit.test( "Observable array remove all", function( assert ) {

	var TestModel = function() {
		var self = this;
		self.MyArray = ko.observableArray([{MyValue: 10},{MyValue: 20}]).extend({sniff: {}});
	};
	var vm = new TestModel();
	vm.MyArray.removeAll()
	assert.equal(vm.MyArray.modified, true);
	assert.equal(vm.MyArray.originalValue.length, 2);
});

QUnit.test( "Observable array traversal", function( assert ) {

	var TestModel = function() {
		var self = this;
		self.MyArray = ko.observableArray([{MyValue: ko.observable(10).extend({sniff: {}})},{MyValue: ko.observable(20).extend({sniff: {}})}]).extend({sniff: {}});
	};
	var vm = new TestModel();
	vm.MyArray()[1].MyValue(50);
	//console.log("test: " + vm.MyArray()[1].MyValue.modified);
	assert.equal(vm.MyArray.modified, true);
	assert.equal(vm.MyArray.originalValue.length, 2);
});