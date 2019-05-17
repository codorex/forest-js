export default class ObservableCollection {
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