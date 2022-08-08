export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide)
    this.wrapper = document.querySelector(wrapper)
  }

  // Método ao iniciar
  onStart(event) {
    event.preventDefault()

    // console.log(this) // sem fazer o "bind" o this irá me retornar o que é o "slide-wraper":
    // <div class="slide-wrapper">
    // Porém eu quero que o this seja referencia ao meu Objeto, ao slide em si, e par aisso fazemos o "bind"


    this.wrapper.addEventListener('mousemove', this.onStart) // para que o evento só seja acionado quando clicarmos pela priemira vez, ele tem que ser adiconado neste método, que tbm só será inicializado quando ouver um evento de "mousedown"

    //console.log('mousedown') //sendo adicioanda apenas quando seguramos
  }

  // método para o evento de mouse move
  onMove(event){
  }

  // método para remover o evento ao fim delegated
  onEnd(event){
    this.wrapper.removeEventListener('mousemove', this.onStart) 
  }


  // método para adicionar os evetos ao slide
  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart)
    this.wrapper.addEventListener('mouseup', this.onEnd)
  }


  // como será necessario fazer o bind varias vezes, temos um método espécifico para isso
  bindEvents(){
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }

  init(){
    this.bindEvents()
    this.addSlideEvents()
    return this
  }
}