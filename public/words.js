var app = angular.module('myApp', []);
app.controller('FormCtrl', function ($scope, $http) {
    
    $scope.act1songs = { 
        '01': 'Alexander Hamilton',
        '02': 'Aaron Burr, Sir',
        '03': 'My Shot',
        '04': 'The Story of Tonight',
        '05': 'The Schuyler Sisters',
        '06': 'Farmer Refuted',
        '07': 'You\'ll Be Back',
        '08': 'Right Hand Man',
        '09': 'A Winter\'s Ball',
        '10': 'Helpless',
        '11': 'Satisfied',
        '12': 'The Story of Tonight(Reprise)',
        '13': 'Wait For It',
        '14': 'Stay Alive',
        '15': 'Ten Duel Commandments',
        '16': 'Meet Me Inside',
        '17': 'That Would Be Enough',
        '18': 'Guns and Ships',
        '19': 'History Has Its Eyes On You',
        '20': 'Yorktown(The World Turned Upside Down)',
        '21': 'What Comes Next?',
        '22': 'Dear Theodosia',
        '23': 'Non-Stop'
    };

    $scope.act2songs = {
        '24': 'What\'d I Miss',
        '25': 'Cabinet Battle #1',
        '26': 'Take A Break',
        '27': 'Say No To This',
        '28': 'The Room Where It Happens',
        '29': 'Schuyler Defeated',
        '30': 'Cabomet Battle #2',
        '31': 'Washington On Your Side',
        '32': 'One Last Time',
        '33': 'I Know Him',
        '34': 'The Adams Administration',
        '35': 'We Know',
        '36': 'Hurricane',
        '37': 'The Reynolds Pamphlet',
        '38': 'Burn',
        '39': 'Blow Us All Away',
        '40': 'Stay Alive(Reprise)',
        '41': 'It\'s Quiet Uptown',
        '42': 'The Election of 1800',
        '43': 'Your Obedient Servant',
        '44': 'Best of Wives and Best of Women',
        '45': 'The World Was Wide Enough',
        '46': 'Who Lives, Who Dies, Who Tells Your Story'
    };
    
    $scope.checkboxes = {};
    $.each($scope.act1songs, function(k,v) {
        $scope.checkboxes[k] = false;
    })
    $.each($scope.act2songs, function(k,v) {
        $scope.checkboxes[k] = false;
    })
    
    $scope.act1songlist = [];    
    $.each($scope.act1songs, function(key, element) {
        $scope.act1songlist.push(key);
    });    
    $scope.act1songlist.sort();

    $scope.act2songlist = [];    
    $.each($scope.act2songs, function(key, element) {
        $scope.act2songlist.push(key);
    });    
    $scope.act2songlist.sort();

    
    $scope.toggleAct1 = function() {
        var checked = $scope.act1isChecked;    
        $.each($scope.act1songs, function(key) {
            $scope.checkboxes[key] = checked;
        });
    }
    
    $scope.toggleAct2 = function() {
        var checked = $scope.act2isChecked;    
        $.each($scope.act2songs, function(key) {
            $scope.checkboxes[key] = checked;
        });
    }
    
    
    $scope.save = function() {
        formData = $scope.form;
    };
    
    $scope.update = function() {
        
        var songs = [];
        
        $.each($scope.checkboxes, function(key, checked) {
            if (checked) {
                songs.push(key);
            } 
        });
        
        if (songs.length === 0) {
            return;
        }
        
        var params = {
            songs: songs.join(',')
        }
        
        $http.get('/getCloud', { params: params }).then(function(response){
            
            
            $('#cloud').jQCloud('update', response.data);
        });
    }
 });