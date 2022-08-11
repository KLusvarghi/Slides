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
    let movetype;
    if(event.type === 'mousedown') {//verifica se o evento é de mousedown, sneod que poderia fazer um método para mosedown e um para thouchmove
      event.preventDefault()
      // sendo esse um valor fixo
      this.dist.startX = event.clientX // sendo o clientX a posição no eixo X que clicamos 
      movetype = 'mousemove'
    } else {
      // console.log(event) // em changedTouches ele mosta a quantidade de dedos clicados, sendo a nossa preferencia o primeiro dedo, index 0

      this.dist.startX = event.changedTouches[0].clientX //pegando o primeiro toque no slide, pegando a posição no eixo X
      movetype = 'touchmove'
    }


    // console.log(this) // sem fazer o "bind" o this irá me retornar o que é o "slide-wraper":
    // <div class="slide-wrapper">
    // Porém eu quero que o this seja referencia ao meu Objeto, ao slide em si, e par aisso fazemos o "bind"


    this.wrapper.addEventListener(movetype, this.onMove) // para que o evento só seja acionado quando clicarmos pela priemira vez, ele tem que ser adiconado neste método, que tbm só será inicializado quando ouver um evento de "mousedown"

    //console.log('mousedown') //sendo adicioanda apenas quando seguramos
  }

  // método para o evento de mouse move
  onMove(event){
    const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX; //fazendo uma verificação, para que o touchmove funcione tem que ser colocado no "onMove", fazendo assim uma verificação ternária
    const finalPosition = this.updatePosition(pointerPosition)
    this.moveSlide(finalPosition);
  }

  // método para remover o evento ao fim delegated
  onEnd(event){
    const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'; // caso o evento seja de "mouseup", que no caso é de emulador, ele terá o evento de "mousemove"
    this.wrapper.removeEventListener(moveType, this.onMove); // assim ele irá remove ou adicionar baseado nessa parte
    this.dist.finalPosition = this.dist.movePosition; //quando a pessoa tirar o mouse de cima ele irá amazernar em "finalPosition"
  }


  // método para adicionar os evetos ao slide
  addSlideEvents() {
    this.wrapper.addEventListener('mousedown', this.onStart)
    this.wrapper.addEventListener('touchstart', this.onStart) //evento para mobile
    this.wrapper.addEventListener('mouseup', this.onEnd)
    this.wrapper.addEventListener('touchend', this.onEnd) //evento para mobile
  }


  // como será necessario fazer o bind varias vezes, temos um método espécifico para isso
  bindEvents(){
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }



  // slides config


  // método para fazer um calculo para colcar o slide no centro da tela
  slidePosition(slide) { // recebe a arraay de slide
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2; // assim, pegando a largura da tela inteira com o "wrapper", e subtraindo com o a lardura da tela em relação ao slide do slide especifico
    return -(slide.offsetLeft - margin) //fazendo então a largura do slide em relção a tela menos a margin, colcondo o valor em negativo para que centralize e não vá mais para a esquerda

  }

  slidesConfig() {
    // desestruturando os "slides" (que são as li) e colocando dentro de uma array, fazendo um map que a sua array será o que estiver dentro do 'return'
    this.slideArray = [...this.slide.children].map( (element) => {
      const position = this.slidePosition(element); // passando a array de slides como parametro, retornando o valor do elemento no centro
      return { position,element } // como a propriedade tem o mesmo nome que o valor, não é necessario colocar o nome duas vezes
    }); 
  }


  // método para saber o anterior e próximo slides
  slidesIndexNav(index){
    const last = this.slideArray.length - 1 //pegando o tamanho da mnha lsita de slides
    this.index = { //sendo o index do slide anterior, do atual e do proximos
      prev: index ? index -1 : undefined, // se o slide existir ele irá retornar "index-1", caso ele 0, ele irá retornar "undefined"
      active: index,
      next: index === last ? undefined : index + 1, //se o index for igual a ultima posição, ele terá o valor de "undefined", caso não ele terá valor index + 1
    }
  }


  // método que irá chamar o "moveSlide", passando o slide para qual irá e passando tambem a posição que ele ficará
  changeSlide(index) {
    const activeSlide = this.slideArray[index]; 
    this.moveSlide(activeSlide.position)
    this.slidesIndexNav(index)
    this.dist.finalPosition = activeSlide.position // passando para a propriedade do objeto o valor final do slide
  }

  init(){
    this.bindEvents()
    this.addSlideEvents()
    this.slidesConfig()
    return this
  }
}