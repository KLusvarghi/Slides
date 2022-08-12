import SlideNav from './slide.js';

const slide = new SlideNav('.slide', '.slide-wrapper');
slide.init();
slide.addArrow('.prev', '.next');

slide.addControl('.custom-controls') // passando a classe como parametro para ativar as thubes logo a cima do wrapper, e consecutivamente irá desaparecer a navegação pelas bolinha a baixo do wrapper
