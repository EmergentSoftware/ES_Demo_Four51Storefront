four51.app.controller('MultiProductSearchCtrl', ['$scope', 'MultiProduct', 'Product', 'Category', '$routeParams', '$log',
function ($scope, MultiProduct, Product, Category, $routeParams, $log) {
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

    function searchByCategoryInteropID(categoryInteropID) {
        MultiProduct.search(categoryInteropID, $scope.searchTerm, null, function (products, count, pagesize, minPrice, maxPrice, staticSpecGroup) {
            $log.log('minPrice: ' + minPrice + ' maxPrice: ' + maxPrice + ' staticSpecGroup: ' + staticSpecGroup);
            if (minPrice && products) {
                products = products.filter(product => product.StandardPriceSchedule.PriceBreaks[0].Price >= minPrice);
            }

            if (maxPrice && products) {
                products = products.filter(product => product.StandardPriceSchedule.PriceBreaks[0].Price <= maxPrice);
            }

            //if (staticSpecGroup && products) {
            //    products = products.filter(product => product.StaticSpecGroups.VisibleSpecGroups[0].Name.toLowerCase() == staticSpecGroup.toLowerCase());
            //}

            $scope.products = products;
            $scope.productCount = count;
            $scope.searchLoading = false;
        //}, $scope.settings.currentPage, $scope.settings.pageSize, $scope.minPrice, $scope.maxPrice, $scope.staticSpecGroup);
        }, $scope.settings.currentPage, $scope.settings.pageSize, 0, 50.00, null);
    }

    function Search() {
        $scope.searchLoading = true;
        if ($scope.searchCategories) {
            Object.keys(categories).forEach((element, index, array) => {
                if ($scope.searchCategories.split(',').includes(element)) {
                    searchByCategoryInteropID(categories[element].categoryInteropID);
                }
            })
        } else {
            searchByCategoryInteropID(null);
        }
    }
}]);