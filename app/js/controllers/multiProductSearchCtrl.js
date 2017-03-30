﻿four51.app.controller('MultiProductSearchCtrl', ['$scope', 'MultiProduct', '$routeParams', '$log',
function ($scope, MultiProduct, $routeParams, $log) {
    $scope.settings = {
        currentPage: 1,
        pageSize: 40
    };

    $scope.searchTerm = $routeParams.searchTerm;
    $scope.searchCategories = $routeParams.searchCategories;
    $scope.search = Search;
    $scope.minPrice = $routeParams.minPrice;
    $scope.maxPrice = $routeParams.maxPrice;
    $scope.staticSpecGroup = $routeParams.staticSpecGroup;

    var categories = {
        'handouts': {
            categoryInteropID: 'Handouts'
        },
        'office supplies': {
            categoryInteropID: 'Office_Supplies'
        }
    }

    $scope.$watch('settings.currentPage', function (n, o) {
        if (n != o || (n == 1 && o == 1))
            Search();
    });

    function Search() {
        $scope.searchLoading = true;
        if ($scope.searchCategories) {
            var keys = Object.keys(categories);
            for (var i = 0; i < keys.length; i++) {
                if ($scope.searchCategories.split(',').includes(keys[i])) {
                    MultiProduct.search(categories[keys[i]].categoryInteropID, $scope.searchTerm, null, function (products, count, minPrice, maxPrice, staticSpecGroup) {

                        if (minPrice && products) {
                            products = products.filter(product => product.StandardPriceSchedule.PriceBreaks[0].Price >= minPrice);
                        }

                        if (maxPrice && products) {
                            products = products.filter(product => product.StandardPriceSchedule.PriceBreaks[0].Price <= maxPrice);
                        }

                        if (staticSpecGroup && products) {
                            products = products.filter(product => product.StaticSpecGroups.VisibleSpecGroups[0].Name.toLowerCase() == staticSpecGroup.toLowerCase());
                        }

                        $scope.products = products;
                        $scope.productCount = count;
                        $scope.searchLoading = false;
                    }, $scope.settings.currentPage, $scope.settings.pageSize, $scope.minPrice, $scope.maxPrice, $scope.staticSpecGroup);
                }
            }
        } else {
            MultiProduct.search(null, $scope.searchTerm, null, function (products, count) {
                $scope.products = products;
                $scope.productCount = count;
                $scope.searchLoading = false;
            }, $scope.settings.currentPage, $scope.settings.pageSize);
        }
    }
}]);