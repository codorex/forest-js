import AppComponent from '../app/AppComponent';

const init = (root) => {
    const app = new AppComponent(root);
    app.render();
};

export {
    init
}