export default class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide)
    this.wrapper = document.querySelector(wrapper)

    // um objeto que irá informar onde está meu slide, quanto que movi do meu mouse, etc...
    this.dist = {
      finalPosition: 0,
      startX: 0, // para saber o quando eu movi o mouse, precisamos saber de onde iniciamos o clique, até o lugar que soltamos, por isso dessa variavel, sendo a posição inicial
      movement: 0,
    }
  }

  // método responsavel por fazer a animação  
  moveSlide(distX) {
    this.dist.movePosition = distX; // criadno um novo atributo "movePosition"
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
  }

  // Mpetodo que salvará a distancia percorrida pelo mouse dentro do obj
  updatePosition(clientX){

    // multiplicando o moviemnto para que ele seja mais rápido
    this.dist.movement = (this.dist.startX - clientX) * 1.6 // sendo esse valor constante, mudando a todo momento
    return this.dist.finalPosition - this.dist.movement; // retornando a posição final - a posição do moviemnto, fazendo assim a animação de rolagem do slide
  }

  // Método ao iniciar
  onStart(event) {
    event.preventDefault()

    // sendo esse um valor fixo
    this.dist.startX = event.clientX // sendo o clientX a posição no eixo X que clicamos 


    // console.log(this) // sem fazer o "bind" o this irá me retornar o que é o "slide-wraper":
    // <div class="slide-wrapper">
    // Porém eu quero que o this seja referencia ao meu Objeto, ao slide em si, e par aisso fazemos o "bind"


    this.wrapper.addEventListener('mousemove', this.onMove) // para que o evento só seja acionado quando clicarmos pela priemira vez, ele tem que ser adiconado neste método, que tbm só será inicializado quando ouver um evento de "mousedown"

    //console.log('mousedown') //sendo adicioanda apenas quando seguramos
  }

  // método para o evento de mouse move
  onMove(event){
    const finalPosition = this.updatePosition(event.clientX)
    this.moveSlide(finalPosition);
  }

  // método para remover o evento ao fim delegated
  onEnd(event){
    this.wrapper.removeEventListener('mousemove', this.onMove);
    this.dist.finalPosition = this.dist.movePosition; //quando a pessoa tirar o mouse de cima ele irá amazernar em "finalPosition"
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