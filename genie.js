// Generated by CoffeeScript 1.5.0
(function() {
  var Faker, fs, genie, moment, _;

  Faker = require('Faker');

  moment = require('moment');

  _ = require("underscore");

  fs = require('fs');

  Faker.Genie = {
    fullName: function() {
      return Faker.Name.findName.apply(Faker.Name);
    },
    ipAddress: function() {
      return Faker.Internet.ip.apply(Faker.Internet);
    },
    zipCode5: function() {
      return Faker.Address.zipCodeFormat(0);
    },
    zipCode9: function() {
      return Faker.Address.zipCodeFormat(1);
    },
    brStateAbbr: function() {
      return Faker.Address.brState(true);
    },
    usStateAbbr: function() {
      return Faker.Address.usState(true);
    },
    pattern: function(pattern) {
      var f, fakerPattern, n;
      fakerPattern = _.flatten((function() {
        var _results;
        _results = [];
        for (n in Faker) {
          _results.push((function() {
            var _results1;
            _results1 = [];
            for (f in Faker[n]) {
              if (f === pattern) {
                _results1.push({
                  func: Faker[n][f],
                  context: Faker[n]
                });
              }
            }
            return _results1;
          })());
        }
        return _results;
      })());
      if (fakerPattern && fakerPattern.length > 0) {
        return fakerPattern[0].func.apply(fakerPattern[0].context);
      } else {
        throw new Error("invalid pattern: " + pattern);
      }
    },
    format: function(format) {
      return Faker.Helpers.replaceSymbolWithNumber(format);
    },
    oneOf: function(items) {
      return Faker.random.array_element(items);
    },
    someOf: function(items, min, max) {
      var candidate, count, excludeCount, excluded, selected;
      count = min + Faker.Helpers.randomNumber(min - max);
      if (items.length >= count) {
        return items;
      } else {
        excluded = [];
        excludeCount = items.length - count;
        while (excluded.length < excludeCount) {
          candidate = Faker.random.array_element(items);
          if (!_.contains(excluded, candidate)) {
            excluded.push(candidate);
          }
        }
        return selected = _.without(items, excluded);
      }
    },
    weightedSample: function(items) {
      var i, itemMap, seed, total, value, _i, _len;
      itemMap = _.map(items, function(item) {
        var o;
        return o = {
          weight: item[0],
          value: item[1]
        };
      });
      total = _.reduce(itemMap, function(memo, item) {
        item.range = [memo, memo + item.weight - 0.0001];
        return memo + item.weight;
      }, 0);
      seed = Math.random() * total;
      value = null;
      for (_i = 0, _len = itemMap.length; _i < _len; _i++) {
        i = itemMap[_i];
        if (seed >= i.range[0] && seed <= i.range[1]) {
          value = i.value;
          break;
        }
      }
      return value;
    }
  };

  genie = function(template) {
    var arr, c, count, current, i, max, min, obj, places, _i, _ref, _ref1, _ref2, _ref3;
    obj = {};
    for (c in template) {
      current = template[c];
      if (_.isFunction(current)) {
        obj[c] = current.apply(obj, [Faker.Genie]);
      } else if (current.template) {
        min = current.min || ((_ref = current.range) != null ? _ref[0] : void 0) || 0;
        max = current.max || ((_ref1 = current.range) != null ? _ref1[1] : void 0) || 5;
        if (!current.exists || (current != null ? current.exists.apply(obj, [Faker.Genie]) : void 0)) {
          if (!current.min && !current.max) {
            obj[c] = genie(current.template);
          } else {
            count = Faker.Helpers.randomNumber(max - min);
            arr = [];
            for (i = _i = 1; 1 <= count ? _i <= count : _i >= count; i = 1 <= count ? ++_i : --_i) {
              arr.push(genie(current.template));
            }
            obj[c] = arr;
          }
        }
      } else if (current.minAge || current.maxAge) {
        min = current.minAge || 0;
        max = current.maxAge || 365;
        if (current.format) {
          obj[c] = moment().subtract('days', min + Faker.Helpers.randomNumber(max - min)).format(current.format);
        } else {
          obj[c] = moment().subtract('days', min + Faker.Helpers.randomNumber(max - min)).clone().toDate();
        }
      } else if (current.min || current.max || current.range) {
        min = current.min || ((_ref2 = current.range) != null ? _ref2[0] : void 0) || 0;
        max = current.max || ((_ref3 = current.range) != null ? _ref3[1] : void 0) || 1000000;
        places = current.places || 0;
        if (places) {
          obj[c] = ((min * Math.pow(10, places)) + Faker.Helpers.randomNumber(max * Math.pow(10, places) - min * Math.pow(10, places))) / Math.pow(10, places);
        } else {
          obj[c] = min + Faker.Helpers.randomNumber(max - min);
        }
      } else if (current.pattern) {
        obj[c] = Faker.Genie.pattern.apply(obj, [current.pattern]);
      } else if (current.format) {
        obj[c] = Faker.Genie.format.apply(obj, [current.format]);
      } else if (current.someOf) {
        obj[c] = Faker.Genie.someOf.apply(obj, [current.someOf, 1, current.someOf.length]);
      } else if (current.oneOf) {
        obj[c] = Faker.Genie.oneOf.apply(obj, [current.oneOf]);
      } else if (current.weightedSample) {
        obj[c] = Faker.Genie.weightedSample.apply(obj, [current.weightedSample]);
      }
    }
    return obj;
  };

  module.exports = genie;

}).call(this);
