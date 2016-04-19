/**
 * Created by johnnycage on 16/4/18.
 */
var db = (function () {
    var db = new Wilddog("https://go-bang.wilddogio.com/");
    var rank = db.child('rank');
    var tactics = db.child('tactics');

    var compare = function (a1, a2) {
        return a1 - a2;
    };

    return {
        addRankRecord: function (record) {
            rank.push(record);
        },
        getRankList: function (listener) {
            rank.on('value', function (snapshot) {
                var data = snapshot.val() || [];

                var list = _.chain(data).keys().map(function (key) {
                    return data[key];
                }).value().sort(function (a1, a2) {
                    return compare(a1.degree, a2.degree) ||
                        compare(a1.hold, a2.hold) ||
                        compare(a2.step, a1.step) ||
                        compare(a2.spend, a1.spend);
                });

                listener && listener(list);
            });
        }
    };

})();