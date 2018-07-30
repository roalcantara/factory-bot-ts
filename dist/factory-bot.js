"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var FactoryBot = /** @class */ (function () {
    function FactoryBot() {
        this.factories = new Map();
        this.sequences = 0;
        this.parse = function (val) {
            if (lodash_1.isFunction(val))
                return val();
            return val;
        };
    }
    FactoryBot.prototype.has = function (name) {
        return this.factories[name] !== undefined;
    };
    FactoryBot.prototype.count = function () {
        return this.factories.keys.length;
    };
    FactoryBot.prototype.clear = function () {
        this.factories.clear();
        this.sequences = 0;
    };
    FactoryBot.prototype.define = function (name, attributes, clazz) {
        this.factories[name] = {
            clazz: clazz, attributes: attributes
        };
    };
    FactoryBot.prototype.instantiate = function (type) {
        return new type();
    };
    FactoryBot.prototype.build = function (name, attributes) {
        var _this = this;
        var factory = this.factories[name];
        var instance = factory.clazz ? this.instantiate(factory.clazz) : {};
        Object.keys(factory.attributes)
            .forEach(function (attribute) {
            instance[attribute] = _this.parse(factory.attributes[attribute]);
        });
        // tslint:disable-next-line
        return Object.assign(instance, attributes);
    };
    FactoryBot.prototype.buildList = function (name, length, attributes) {
        var _this = this;
        if (length === void 0) { length = 1; }
        return Array(length)
            .fill(undefined)
            .map(function () { return _this.build(name, attributes); });
    };
    FactoryBot.prototype.rand = function (enumInstance) {
        return lodash_1.sample(Object.keys(enumInstance)
            .map(function (key) { return enumInstance[key]; }));
    };
    FactoryBot.prototype.seq = function (callbackfn) {
        this.sequences++;
        return callbackfn(this.sequences);
    };
    return FactoryBot;
}());
exports.FactoryBot = FactoryBot;
//# sourceMappingURL=factory-bot.js.map