(function () {
    'use strict';

    angular
      .module('galleryApp')
      .factory('flickrAPI', flickrAPI);

    flickrAPI.$inject = ['$http'];

    function flickrAPI($http) {
        var flickrAPIKey = "0f40131d0253a205094f298e92f96ad3";
        var defaultSearch = "space";
        var perPage = 10;
        var url_size = "url_l";

        return {
            getFlickrImg: getFlickrImg
        };

        function getFlickrImg(newSearch) {
            return $http({
                method: 'GET',
                params: {
                    api_key: flickrAPIKey,
                    text: newSearch,
                    safe_search: 1,
                    sort: "relevance",
                    extras: url_size + ",description",
                    format: "json",
                    nojsoncallback: "?"
                },
                url: 'https://api.flickr.com/services/rest/?method=flickr.photos.search'
            })
              .then(getFlickrImgComplete)
              .catch(getFlickrImgFailed);

            function getFlickrImgComplete(response) {
                angular.forEach(response.data.photos.photo, function (value, key) {
                    value.url = value[url_size];
                });

                return response.data;
            }

            function getFlickrImgFailed(error) {
                console.log(error);
            }
        }
    }
})();