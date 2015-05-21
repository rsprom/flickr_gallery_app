(function () {
    'use strict';

    angular
      .module('galleryApp')
      .controller('GalleryCtrl', GalleryCtrl);

    GalleryCtrl.$inject = ['flickrAPI', $sce, $timeout, $window];

    function GalleryCtrl(flickrAPI, $sce, $timeout, $window) {
        var photos = null;
        var randomNumber;
        var nextPhoto;
        var currentLocation = 0;
        var photoCollection = [];
        var count = 0;
        var vm = this;
        vm.textSearch = "cityscape";
        vm.isLoading = false;
        vm.activePhoto = {};
        vm.activePhotoDescription = "";
        vm.activePhotoUrl = "";
        vm.displayGeneral = true;
        vm.displayPrev = false;
        vm.displayControls = true;
        vm.isPrev = false;
        vm.isNext = false;
        vm.isFront = false;
        vm.backgroundImg = '';
        vm.backgroundImgNext = '';
        vm.backgroundImgPrev = '';
        vm.toggleControls = toggleControls;
        vm.getData = getData;
        vm.nextImg = nextImg;
        vm.prevImg = prevImg;

        getData();
        $window.scrollTo(0, 1);

        ////
        function getData() {
            vm.isLoading = true;
            flickrAPI.getFlickrImg(vm.textSearch)
              .then(function (data) {
                  if (data.photos.total != 0) {
                      photos = data.photos;
                      currentLocation = 0;
                      photoCollection = [];
                      vm.displayGeneral = true;
                      vm.activePhoto = setRandomPhoto();
                      vm.activePhotoDescription = $sce.trustAsHtml(vm.activePhoto.description._content);
                      vm.activePhotoUrl = "https://www.flickr.com/photos/" + vm.activePhoto.owner + "/" + vm.activePhoto.id;
                      preloadNext();
                      setBgUrl();
                  } else {
                      noPhotosFound();
                  }
              })
              .then(function () {
                  vm.isLoading = false;
              });
        }

        function setActivePhoto(index) {
            if (index >= photoCollection.length - 1) {
                preloadNext();
            } else {
                var nextPhoto = photoCollection[index + 1];
                vm.backgroundImgNext = 'url(\'' + nextPhoto.url + '\')';
            }

            if (index != 0) {
                var previousPhoto = photoCollection[index - 1];
                vm.backgroundImgPrev = 'url(\'' + previousPhoto.url + '\')';
            }

            vm.activePhoto = photoCollection[index];
            vm.activePhotoDescription = $sce.trustAsHtml(vm.activePhoto.description._content);
            vm.activePhotoUrl = "https://www.flickr.com/photos/" + vm.activePhoto.owner + "/" + vm.activePhoto.id;
        }

        function setRandomPhoto() {
            var selectedPhoto;
            randomNumber = Math.floor(Math.random() * photos.photo.length);
            selectedPhoto = photos.photo[randomNumber];
            photos.photo.splice(randomNumber, 1);

            //To handle blank images
            if (selectedPhoto.url === undefined) {
                selectedPhoto = setRandomPhoto();
                return selectedPhoto;
            }

            photoCollection.push(selectedPhoto);
            return selectedPhoto;
        }

        function setBgUrl() {
            if (vm.activePhoto !== null || vm.activePhoto !== undefined) {
                vm.backgroundImg = 'url(\'' + vm.activePhoto.url + '\')';
            }

            vm.isPrev = false;
            vm.isNext = false;
        }

        function nextImg() {
            vm.isNext = true;
            vm.isFront = true;

            $timeout(function () {
                vm.isFront = false;
                vm.displayPrev = true;
                currentLocation++;
                setActivePhoto(currentLocation);
                setBgUrl();
            }, 300);
        }

        function prevImg() {
            vm.isPrev = true;
            vm.isFront = true;

            $timeout(function () {
                vm.isFront = false;
                currentLocation--;

                if (currentLocation == 0) {
                    vm.displayPrev = false;
                }

                setActivePhoto(currentLocation);
                setBgUrl();
            }, 300);
        }

        function toggleControls() {
            vm.displayControls = !vm.displayControls;
        }

        function preloadNext() {
            nextPhoto = setRandomPhoto();
            vm.backgroundImgNext = 'url(\'' + nextPhoto.url + '\')';
        }

        function noPhotosFound() {
            photoCollection = [];
            nextPhoto = {};
            vm.displayGeneral = false;
            vm.displayPrev = false;
            vm.backgroundImg = "";
            vm.activePhoto = {};
            vm.activePhotoDescription = $sce.trustAsHtml("<p>No photos found. Please try another search.</p>");
        }
    }
})();