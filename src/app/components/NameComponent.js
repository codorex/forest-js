import Component from '../../common/Component';

export default class NameComponent extends Component{
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