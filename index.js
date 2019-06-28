import Datepicker from './src/App';

export default Datepicker;

if (typeof window !== 'undefined' && window.Vue) {
	window.Vue.component('vue-datepicker-apr', Datepicker);
}
