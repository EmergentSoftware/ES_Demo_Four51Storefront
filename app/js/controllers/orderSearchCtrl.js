'use strict';

$451.app.controller('OrderSearchCtrl', function OrderSearchCtrl($scope, OrderStatsService, OrderSearchService) {
    $scope.OrderStats = OrderStatsService.query();
	$scope.OrderSearch = function($event, stat) {
		$event.preventDefault();
		$scope.orders = OrderSearchService.get(stat);
		$scope.displayOrders = true;
		$scope.orderSearchStat = stat;
	};
});

$451.app.controller('OrderViewCtrl', function OrderViewCtrl($scope, $routeParams, OrderService) {
	$scope.order = OrderService.get({ id: $routeParams.id });
});