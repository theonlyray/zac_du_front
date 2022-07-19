(function(){
    'use strict';
    let IntTable, IntTableRow;
    IntTable =  function ($interpolate,$filter) {
    return {
      restrict: 'E',
      scope: {
        obData: '=obData',
        obSearch: '<obSearch',
        conf: '<obConfig'
      },
      controller: function($scope,$filter){
        this.previousItem = {};
        this.$doCheck = function(){
          if(!angular.equals(this.previousItem, $scope.obSearch)){
            this.previousItem = angular.copy($scope.obSearch);
            $scope.search = $scope.obSearch;
            $scope.data = $filter("filter")( $scope.obData, $scope.search );
            $scope.reSort();
            $scope.calculatePages();
          }
        }
        
        $scope.sortorder = [];
        $scope.data = $scope.obData;
        $scope.cols = $scope.conf.columns;
        $scope.funcs = $scope.conf.funcs;
        $scope.paging = $scope.conf.paging;
        $scope.search = {};
        
        $scope.pages = 1;
        $scope.maxItemsPerPage = $scope.data.length;
        if ($scope.paging < $scope.maxItemsPerPage)
         {
           $scope.maxItemsPerPage = $scope.paging;
         }
        $scope.actualPage = 0;
        $scope.calculatePages = function(){
          if($scope.paging)
          {
            if($scope.data.length <= $scope.paging)
            {
              $scope.pages = 1; 
              return;
            }
            var rest = 0;
            rest = $scope.data.length % $scope.paging;
            if (rest > 0) 
            {
              $scope.pages = (($scope.data.length - rest) / $scope.paging) + 1;
              return;
            }
            $scope.pages = ($scope.data.length - rest) / $scope.paging;
          };
        };
        
        $scope.calculatePages();
        
        $scope.nextPage = function()
        {
          if ($scope.actualPage + 1 < $scope.pages)
          {
            $scope.actualPage++;
          }  
        }
        
        $scope.setPage = function(pgNumber){
          if (pgNumber < $scope.pages && pgNumber >= 0)
            $scope.actualPage = pgNumber;
        }
        
        $scope.prevPage = function()
        {
          if ($scope.actualPage > 0)
          {
            $scope.actualPage--;
          }  
        }
              
        $scope.getNumber = function(n) {
          return new Array(n);
        };
        $scope.reSort = function(){
          if (!$scope.sortorder.length) 
            return;
          var sortField = Object.keys($scope.sortorder[0])[0];
          var sortOrder = ($scope.sortorder[0][sortField] == "desc") ? "-" : "";
          $scope.data = $filter('orderBy')($scope.data,sortOrder + sortField);
        };
        $scope.sortByField = function(n){
          if (n === undefined){
            $scope.sortorder = [];
            return;
          }
          if ($scope.sortorder.length > 0)
          {
            var oldSort = $scope.sortorder[0];
            
            if(oldSort.hasOwnProperty(n))
            {
              oldSort[n] = (oldSort[n] == "asc") ? "desc" : "asc";
            }
            else
            {
              var sort = {};
              sort[n] = "asc";
              oldSort =  sort;
            }
            $scope.sortorder = [oldSort];
            
          }
          else
          {
            var sort = {};
            sort[n] = "asc";
            $scope.sortorder = [sort];
          }
          $scope.reSort();
        }
        
      },
      template: `
        <table class="table table-bordered table-sm">
          <thead class="thead-light">
          <tr>
            <th ng-click="sortByField(cols[$index].name)" ng-repeat="col in getNumber(cols.length) track by $index">
              {{cols[$index].title}}
              <div class="float-right" ng-show="sortorder[0].hasOwnProperty(cols[$index].name)">
                <i ng-class="sortorder[0][cols[$index].name] == 'asc' ? 'fa-sort-asc' : 'fa-sort-desc'" class="fa"></i>
              </div>
              <div class="float-right" ng-show="!sortorder[0].hasOwnProperty(cols[$index].name) && cols[$index].name">
                <i class="fa fa-sort text-secondary"></i>
              </div>
            </th>
          </tr>
          </thead>
          <tr ng-repeat="row in data | filter: search | limitTo:maxItemsPerPage:actualPage*maxItemsPerPage">
            <td ng-repeat="col in getNumber(cols.length) track by $index">
              <int-table-row row-data="row" field-name="cols[$index].name" log-this="funcs" template-data="cols[$index].template"></int-table-row>
            </td>
          </tr>
        </table>
        <nav>
          <ul class="pagination">
            <li class="page-item"><span class="page-link" ng-click="prevPage()">Previous</span></li>
            <li class="page-item" ng-repeat="cols in getNumber(pages) track by $index" class="page-item">
              <span class="page-link" ng-click="setPage($index)">{{$index+1}}</span>
            </li>
            <li class="page-item"><span class="page-link" ng-click="nextPage()">Next</span></li>
          </ul>
        </nav>
        {{actualPage+1}} of {{pages}} 
      `
    };
  }
    IntTableRow =  function($compile) {
        return {
            restrict: 'E',
            scope: {
                row: '<rowData',
                templateData: '<',
                fieldName: '<',
                funcs: '<logThis'
            },
            link: function($scope, element, attrs) {
                function isEmptyOrSpaces(str){
                return str === null || str === undefined|| str.match(/^ *$/) !== null;
                };
                
                if(!isEmptyOrSpaces($scope.templateData))
                {
                var ele = element.html($scope.templateData);
                $compile(ele)($scope);
                }
                else
                {
                element.html($scope.row[$scope.fieldName]);
                }
            }
        };
    }

  angular
    .module('app')
        .directive('intTable',IntTable)
        .directive('intTableRow',IntTableRow)
})();