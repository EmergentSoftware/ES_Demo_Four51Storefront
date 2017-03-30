four51.app.controller('MultiProductSearchCtrl', ['$scope', 'Product', 'Category', '$routeParams', '$log',
function ($scope, Product, Category, $routeParams, $log) {
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
        Product.search(categoryInteropID, $scope.searchTerm, null, function (products, count) {

            if ($scope.minPrice && products) {
                products = products.filter(product => product.StandardPriceSchedule.PriceBreaks[0].Price >= $scope.minPrice);
            }

            if ($scope.maxPrice && products) {
                products = products.filter(product => product.StandardPriceSchedule.PriceBreaks[0].Price <= $scope.maxPrice);
            }

            if ($scope.staticSpecGroup && products) {
                products = products.filter(product => product.StaticSpecGroups.VisibleSpecGroups[0].Name.toLowerCase() == $scope.staticSpecGroup.toLowerCase());
            }

            $scope.products = products;
            $scope.productCount = count;
            $scope.searchLoading = false;
        }, $scope.settings.currentPage, $scope.settings.pageSize);
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