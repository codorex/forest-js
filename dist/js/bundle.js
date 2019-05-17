var App =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var rng = __webpack_require__(2);
var bytesToUuid = __webpack_require__(3);

function v4(options, buf, offset) {
  var i = buf && offset || 0;

  if (typeof(options) == 'string') {
    buf = options === 'binary' ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  var rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (var ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || bytesToUuid(rnds);
}

module.exports = v4;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(4);


/***/ }),
/* 2 */
/***/ (function(module, exports) {

// Unique ID creation requires a high quality random # generator.  In the
// browser this is a little complicated due to unknown quality of Math.random()
// and inconsistent support for the `crypto` API.  We do the best we can via
// feature-detection

// getRandomValues needs to be invoked in a context where "this" is a Crypto
// implementation. Also, find the complete implementation of crypto on IE11.
var getRandomValues = (typeof(crypto) != 'undefined' && crypto.getRandomValues && crypto.getRandomValues.bind(crypto)) ||
                      (typeof(msCrypto) != 'undefined' && typeof window.msCrypto.getRandomValues == 'function' && msCrypto.getRandomValues.bind(msCrypto));

if (getRandomValues) {
  // WHATWG crypto RNG - http://wiki.whatwg.org/wiki/Crypto
  var rnds8 = new Uint8Array(16); // eslint-disable-line no-undef

  module.exports = function whatwgRNG() {
    getRandomValues(rnds8);
    return rnds8;
  };
} else {
  // Math.random()-based (RNG)
  //
  // If all else fails, use Math.random().  It's fast, but is of unspecified
  // quality.
  var rnds = new Array(16);

  module.exports = function mathRNG() {
    for (var i = 0, r; i < 16; i++) {
      if ((i & 0x03) === 0) r = Math.random() * 0x100000000;
      rnds[i] = r >>> ((i & 0x03) << 3) & 0xff;
    }

    return rnds;
  };
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
var byteToHex = [];
for (var i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 0x100).toString(16).substr(1);
}

function bytesToUuid(buf, offset) {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return ([bth[buf[i++]], bth[buf[i++]], 
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]], '-',
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]],
	bth[buf[i++]], bth[buf[i++]]]).join('');
}

module.exports = bytesToUuid;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/common/Publisher.js
class Publisher {
    constructor(map){
        this.subscriptionMap = map || {
            // event: [subscribers]
        };
    }

    on(event, listener){
        this._addEventListener(event, listener);
    }

    dispatch(event, args){
        this._dispatchEvent(event, args);
    }

    _addEventListener(event, listener){
            let eventListeners = this.subscriptionMap[event];

            if(!eventListeners || !eventListeners.length){
                eventListeners = [];
                this.subscriptionMap[event] = eventListeners;
            }

            eventListeners.push(listener);
    }

    _dispatchEvent(event, args){
        let eventListeners = this.subscriptionMap[event];

        if(typeof eventListeners === 'object' && eventListeners.length){
            eventListeners.forEach(listener => listener(args));
        }
    }
}
// EXTERNAL MODULE: ./node_modules/uuid/v4.js
var v4 = __webpack_require__(0);
var v4_default = /*#__PURE__*/__webpack_require__.n(v4);

// CONCATENATED MODULE: ./src/common/Component.js



class Component_Component {
    constructor(root) {
        this.id = v4_default()();
        this.root = root;
        this.publisher = new Publisher();
        this.state = {};

        this._renderHandler = undefined;
    }

    /**
     * Renders the component tree into the DOM if the this component is the root element.
     * Otherwise, requests rendering (typically on state changes).
     */
    render() {
        if (this.root) {
            const rootElement = document.querySelector(this.root);
            if (rootElement) {
                rootElement.innerHTML = this.template();
            }
        } else {
            this._renderRequested();
        }
    }

    /**
     * (Do not override).
     * The template compiled for use by parents (consumers) of this component.
     * @return {String}
     */
    template() {
        return `
        <div id="ref-${this.id}">
            ${this._template()}
        </div>`;
    }

    setState(state) {
        this.state = state;
        this.render();
    }

    toString() {
        return this.template();
    }

    onRenderRequested(renderHandler) {
        this._renderHandler = renderHandler;
    }

    on(event, handler) {
        this.publisher.on(event, handler);
    }

    dispatch(event, args) {
        this.publisher.dispatch(event, args);
    }

    listenOn(elementId) {
        let self = {
            for: (event, callback) => {
                if(event && callback){
                    this._bindListener(event, elementId, callback);
                    return self;
                }

                return {
                    click: (callback) => {
                        this._bindListener('click', elementId, callback);
                        return self;
                    },
                    change: (callback) => {
                        this._bindListener('change', elementId, callback);
                        return self;
                    },
                    hover: (callback) => {
                        this._bindListener('mouseover', elementId, callback);
                        return self;
                    }
                };
            },
        };

        return self;
    }

    /**
     * Binds an event listener to the element with the provided id in the scope of the component. 
     * If no such element exits in the scope, the listener will not be bound.
     * @param {String} event The event to bind the listener to.
     * @param {String} elementId The id of the target element.
     * @param {Function} listener The callback to execute when the event is fired.
     */
    _bindListener(event, elementId, listener) {
        if (typeof listener === 'function') {
            if (elementId) {
                document.addEventListener(event, (e) => {
                    if (e.target) {
                        let element = e.target;
                        for (; element && element !== document; element = element.parentNode) {
                            if (element.matches(`#ref-${this.id}`) && e.target.id === elementId) {
                                listener(e);
                            }
                        }
                    }
                });
            }
        }
    }

    /**
     * !Overridable!
     * Produces a template ready to be rendered into the DOM.
     * @return {String} The parsed template.
     */
    _template() {
        return '';
    }

    _renderRequested() {
        if (typeof this._renderHandler === 'function') {
            this._renderHandler();
        }
    }

    /**
     * Creates a new instance of the provided component type, and adds it to the component chain.
     * @param {Component} componentType - The type of the component to be constructed.
     * @param {object} props - The parameters, requested by the component constructor function.
     */
    createChildAs(componentType, props) {
        if (typeof componentType === 'function') {
            let instance = new componentType(props);

            instance.onRenderRequested(() => {
                this.render();
            });

            return instance;
        }
    }
}
// CONCATENATED MODULE: ./src/app/components/NameComponent.js


class NameComponent_NameComponent extends Component_Component{
    constructor(){
        super(null);

        this.state = {
            name: ''
        };

        this.listenOn('txt-name').for().change(e => {
            let oldValue = this.state.name;

            this.setState({
                name: e.target.value
            });

            this.dispatch('text-changed', {
                oldValue,
                newValue: e.target.value
            });
        });
    }

    _template(){
        return `
        <input type="text" id="txt-name" value="${this.state.name}" />
        `;
    }
}
// CONCATENATED MODULE: ./src/app/components/ListComponent.js



class ListComponent_ListComponent extends Component_Component{
    constructor({ observableValues }){
        super(null);

        this.state = {
            values: []
        };
        
        this._components = {
            name: this.createChildAs(NameComponent_NameComponent)
        };

        this._observableValues = observableValues;

        this._observableValues && this._observableValues.subscribe(collection => {
            this.setState({
                values: collection
            });
        });

        this._components.name.on('text-changed', ({ newValue }) => {
            this._observableValues.add(newValue);
            
            this._components.name.setState({
                name: ''
            });
        });

        this.listenOn('btn-add-value')
            .for().click(e => this.handleAddValueClicked(e));

        this.listenOn('btn-add-value')
            .for('mouseover', e => console.log(e));
    }

    handleAddValueClicked(e){
        let newValue = Date.now();

        this._observableValues.add(newValue);
        this.dispatch('value-added', {value: newValue});
    }

    _template(){
        let listItems = ``;

        this.state.values.forEach(function(value){
            listItems += `<li>${value}</li>`; 
        });

        return `
            <div>
                ${this._components.name}
                <ul>
                    ${listItems}
                </ul>
                <button @click="handleAddValueClicked" id="btn-add-value">+</button>
                <button id="btn-remove-value">-</button>
            </div>
        `;
    }
}
// CONCATENATED MODULE: ./src/common/ObservableCollection.js
class ObservableCollection {
    constructor(collection){
        this._collection = collection || [];
        this._subscriptions = [];
    }

    subscribe(subscription){
        let match = this._subscriptions.find(sub => sub === subscription);
        if(!match){
            this._subscriptions.push(subscription);
        }
    }

    subscribeMany(subscriptions){
        subscriptions.forEach(subscription => this.subscribe({subscription}));
    }

    publish() {
        this._subscriptions.forEach((sub, _) => sub && sub(this._collection));
    }

    add(item){
        this._collection.push(item);
        this.publish();
    }

    remove(item){
        let match = this._collection.find(x => x === item);
        if(match){
            this._collection.splice(this._collection.findIndex(x => x === item), 1);
            this.publish();
        }
    }

    forEach(func){
        this._collection.forEach((v, i) => func(v, i));
    }
}
// CONCATENATED MODULE: ./src/app/AppComponent.js





class AppComponent_AppComponent extends Component_Component{
    constructor(root){
        super(root);

        this.values = new ObservableCollection();

        this._components = {
            firstList: this.createChildAs(ListComponent_ListComponent, { observableValues: this.values }),
            secondList: this.createChildAs(ListComponent_ListComponent, { observableValues: this.values })
        };

        this._components.firstList.on('value-added', args => {
            console.log({first: args});
        });

        this._components.secondList.on('value-added', args => {
            console.log({second: args});
        });
    }

    _template(){
        return `
        <div>
            ${this._components.firstList}
        </div>
        <hr>
        <div>
            ${this._components.secondList}
        </div>
        `;
    }
}
// CONCATENATED MODULE: ./src/app/main.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "init", function() { return init; });


const init = (root) => {
    const app = new AppComponent_AppComponent(root);
    app.render();
};



/***/ })
/******/ ]);