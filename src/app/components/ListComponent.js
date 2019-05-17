import Component from '../../common/Component';
import NameComponent from './NameComponent';

export default class ListComponent extends Component{
    constructor({ observableValues }){
        super(null);

        this.state = {
            values: []
        };
        
        this._components = {
            name: this.createChildAs(NameComponent)
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