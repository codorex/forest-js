import Publisher from './Publisher';
import uuid from 'uuid/v4';

export default class Component {
    constructor(root) {
        this.id = uuid();
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
            for: {
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
            }
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