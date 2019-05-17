import Component from '../common/Component';
import ListComponent from './components/ListComponent';

import ObservableCollection from '../common/ObservableCollection';

export default class AppComponent extends Component{
    constructor(root){
        super(root);

        this.values = new ObservableCollection();

        this._components = {
            firstList: this.createChildAs(ListComponent, { observableValues: this.values }),
            secondList: this.createChildAs(ListComponent, { observableValues: this.values })
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