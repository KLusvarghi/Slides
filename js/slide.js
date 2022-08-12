// lembrando que o debounce serve para que ative uma quantidade menor o evento desejado, conforme o tempo passado
import debounce from "./debounce.js"; // tendo que ativar o debounce sempre quando fazemos o bind

export class Slide {
  constructor(slide, wrapper) {
    this.slide = document.querySelector(slide);
    this.wrapper = document.querySelector(wrapper);
    this.activeClass = "active";

    // um objeto que irá informar onde está meu slide, quanto que movi do meu mouse, etc...
    this.dist = {
      finalPosition: 0,
      startX: 0, // para saber o quando eu movi o mouse, precisamos saber de onde iniciamos o clique, até o lugar que soltamos, por isso dessa variavel, sendo a posição inicial
      movement: 0,
    };
  }

  // metordo para adicionar o evento de transition quando o mouse for largadores
  transition(active) {
    this.slide.style.transition = active ? "transform .3s" : ""; // se
  }

  // método responsavel por fazer a animação
  moveSlide(distX) {
    this.dist.movePosition = distX; // criadno um novo atributo "movePosition"
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
  }

  // Mpetodo que salvará a distancia percorrida pelo mouse dentro do obj
  updatePosition(clientX) {
    // multiplicando o moviemnto para que ele seja mais rápido
    this.dist.movement = (this.dist.startX - clientX) * 1.6; // sendo esse valor constante, mudando a todo momento
    return this.dist.finalPosition - this.dist.movement; // retornando a posição final - a posição do moviemnto, fazendo assim a animação de rolagem do slide
  }

  // Método ao iniciar
  onStart(event) {
    let movetype;
    if (event.type === "mousedown") {
      //verifica se o evento é de mousedown, sneod que poderia fazer um método para mosedown e um para thouchmove
      event.preventDefault();
      // sendo esse um valor fixo
      this.dist.startX = event.clientX; // sendo o clientX a posição no eixo X que clicamos
      movetype = "mousemove";
    } else {
      // console.log(event) // em changedTouches ele mosta a quantidade de dedos clicados, sendo a nossa preferencia o primeiro dedo, index 0

      this.dist.startX = event.changedTouches[0].clientX; //pegando o primeiro toque no slide, pegando a posição no eixo X
      movetype = "touchmove";
    }

    // console.log(this) // sem fazer o "bind" o this irá me retornar o que é o "slide-wraper":
    // <div class="slide-wrapper">
    // Porém eu quero que o this seja referencia ao meu Objeto, ao slide em si, e par aisso fazemos o "bind"

    this.wrapper.addEventListener(movetype, this.onMove); // para que o evento só seja acionado quando clicarmos pela priemira vez, ele tem que ser adiconado neste método, que tbm só será inicializado quando ouver um evento de "mousedown"

    //console.log('mousedown') //sendo adicioanda apenas quando seguramos

    this.transition(false); // quando for começar o meu evento eu deixo ele como falso
  }

  // método para o evento de mouse move
  onMove(event) {
    const pointerPosition =
      event.type === "mousemove"
        ? event.clientX
        : event.changedTouches[0].clientX; //fazendo uma verificação, para que o touchmove funcione tem que ser colocado no "onMove", fazendo assim uma verificação ternária
    const finalPosition = this.updatePosition(pointerPosition);
    this.moveSlide(finalPosition);
  }

  // método para remover o evento ao fim delegated
  onEnd(event) {
    const moveType = event.type === "mouseup" ? "mousemove" : "touchmove"; // caso o evento seja de "mouseup", que no caso é de emulador, ele terá o evento de "mousemove"
    this.wrapper.removeEventListener(moveType, this.onMove); // assim ele irá remove ou adicionar baseado nessa parte
    this.dist.finalPosition = this.dist.movePosition; //quando a pessoa tirar o mouse de cima ele irá amazernar em "finalPosition"
    this.transition(true); // ativando a transition apenas quando chegar ao final porem antes de mudar o slide
    this.changeSlideOnEnd();
  }

  // método para quando passar o slide ele já centralizar no proximo
  changeSlideOnEnd() {
    if (this.dist.movement > 120 && this.index.next !== undefined) {
      // "this.dist.moviemnt" me retorna o valor da distancia que eu percorri com o mouse, porem tendo que verificar se o proxinmo slide não é undefined
      this.activeNextSlide();
    } else if (this.dist.movement < -120 && this.index.prev !== undefined) {
      this.activePrevSlide();
    } else {
      this.changeSlide(this.index.active); //caso não seja nenhum deles, ele  ativ ao slide atual
    }
  }

  // método para adicionar os evetos ao slide
  addSlideEvents() {
    this.wrapper.addEventListener("mousedown", this.onStart);
    this.wrapper.addEventListener("touchstart", this.onStart); //evento para mobile
    this.wrapper.addEventListener("mouseup", this.onEnd);
    this.wrapper.addEventListener("touchend", this.onEnd); //evento para mobile
  }

  // slides config

  // método para fazer um calculo para colcar o slide no centro da tela
  slidePosition(slide) {
    // recebe a arraay de slide
    const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2; // assim, pegando a largura da tela inteira com o "wrapper", e subtraindo com o a lardura da tela em relação ao slide do slide especifico
    return -(slide.offsetLeft - margin); //fazendo então a largura do slide em relção a tela menos a margin, colcondo o valor em negativo para que centralize e não vá mais para a esquerda
  }

  slidesConfig() {
    // desestruturando os "slides" (que são as li) e colocando dentro de uma array, fazendo um map que a sua array será o que estiver dentro do 'return'
    this.slideArray = [...this.slide.children].map((element) => {
      const position = this.slidePosition(element); // passando a array de slides como parametro, retornando o valor do elemento no centro
      return { position, element }; // como a propriedade tem o mesmo nome que o valor, não é necessario colocar o nome duas vezes
    });
  }

  // método para saber o anterior e próximo slides
  slidesIndexNav(index) {
    const last = this.slideArray.length - 1; //pegando o tamanho da mnha lsita de slides
    this.index = {
      //sendo o index do slide anterior, do atual e do proximos
      prev: index ? index - 1 : undefined, // se o slide existir ele irá retornar "index-1", caso ele 0, ele irá retornar "undefined"
      active: index,
      next: index === last ? undefined : index + 1, //se o index for igual a ultima posição, ele terá o valor de "undefined", caso não ele terá valor index + 1
    };
  }

  // método que irá chamar o "moveSlide", passando o slide para qual irá e passando tambem a posição que ele ficará
  changeSlide(index) {
    const activeSlide = this.slideArray[index];
    this.moveSlide(activeSlide.position);
    this.slidesIndexNav(index);
    this.dist.finalPosition = activeSlide.position; // passando para a propriedade do objeto o valor final do slide
    this.chengeActiveClass();
    

    // toda vez que mudar o slide ele irá emetir esse evento "this.changeEvent"
    // passando o evento para o me "wrapper"
    this.wrapper.dispatchEvent(this.changeEvent); // então toda vez que o método "changeSlide" for chamado, ele irá disparar o evento (dispatchEvent), de "this.changeEvent"
  }

  chengeActiveClass() {
    this.slideArray.forEach((item) =>
      item.element.classList.remove(this.activeClass)
    ); // removendo a classe do elemento, sendo "item.element" uma "li" expecifica
    this.slideArray[this.index.active].element.classList.add(this.activeClass);
  }

  // navegação Next and Prev

  activePrevSlide() {
    if (this.index.prev !== undefined) {
      //se o slide anterior for diferente de "undefined"
      this.changeSlide(this.index.prev);
    }
  }

  activeNextSlide() {
    if (this.index.next !== undefined) {
      //se o slide posterior for diferente de "undefined"
      this.changeSlide(this.index.next);
    }
  }

  // quando acontece o risize ele acaba distorcendo os efeitos. Sendo o "Riseze" um evento de quando mexemos a tela
  onResize() {
    setTimeout(() => {
      // colcoando dentro do etTiemout pq mesmo resetando as configurrações ele buga as vez, então após o resize ele irá esperar 1 segundo e ai sim resetar as configurações
      this.slidesConfig(); // resetando as configurações quando mover a tela
      this.changeSlide(this.index.active); // mudando para o slide ativo
    }, 1000);
  }

  addResizeEvent() {
    window.addEventListener("resize", this.onResize);
  }

  // como será necessario fazer o bind varias vezes, temos um método espécifico para isso
  bindEvents() {
    this.onStart = this.onStart.bind(this);
    this.onMove = this.onMove.bind(this);
    this.onEnd = this.onEnd.bind(this);

    this.activePrevSlide = this.activePrevSlide.bind(this);
    this.activeNextSlide = this.activeNextSlide.bind(this);

    this.onResize = debounce(this.onResize.bind(this), 200); // tendo que ativar o debounce sempre quando fazemos o bind
  }

  init() {
    this.bindEvents();
    this.transition(true);
    this.addSlideEvents();
    this.slidesConfig();
    this.addResizeEvent();
    this.changeSlide(0); //ativando um slide inicial
    return this;
  }
}

// criando outra classe que extendo da classe "slide", possuindo os mesmo métodos e atributos
export default class SlideNav extends Slide {
  constructor(slide, wrapper) { // podendo usar o "...args" assim, que ee irá desestruturar e enteder
    super(slide, wrapper); //quando usamos o contrutor de uma classe estendida, temos que usar o "super()" para puxar os argumentos da classe super
    this.bindControlEvents() // assim que iniciar a função ele fará o bind

    // criando um EVENTO próprio
    this.changeEvent = new Event('changeEvent') // passando como parametro o nome que ele terá
  }
  
  addArrow(prev, next) {
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvent();
  }

  addArrowEvent() {
    this.prevElement.addEventListener("click", this.activePrevSlide);
    this.nextElement.addEventListener("click", this.activeNextSlide);
  }

  createControl() {
    const control = document.createElement("ul");
    control.dataset.control = "slide"; // adicioando um "data" nele para poder estilzia-lo, chamando "data-control"

    this.slideArray.forEach((item, index) => {
      // percorrendo cada slide
      control.innerHTML += `<li><a href="#slide${index + 1}">${
        index + 1
      }</a></li>`;
    });
    // console.log(control)
    this.wrapper.appendChild(control); //adicionando logo abaixo do "wrapper" a lista de li que criamos
    return control;
  }

  // evento para mudar de slide ao clicar na bolinha
  eventControl(item, index) {
    item.addEventListener("click", (event) => {
      // não precisando fazer um callback e chamando outra função, podendo usar uma arrowFunction mesmo
      event.preventDefault(); // previnindo o evento padrão
      this.changeSlide(index); //chamando o método que irá mudar o slide passando o index, sendo que cada bolinha já tem um index pré definido criando no método "createControl"
    });


    // e após o evento ter sido disparado ele aotomaticamente entra no método e adicioan um evento ao "wrapper", assim, chamdno o "activeControlItem" que fará mudar a cor da bolinha conforme o index
    // toda vez que mudar o slide ele irá adicionar esse evento ao wrapper
    this.wrapper.addEventListener('changeEvent', this.activeControlItem) // como está passando como callbackm, tem que se fazer o bind
  }

  // método para adicionar classe de ativo ao item que estiver ativo no momento
  activeControlItem()  {
    this.controlArray.forEach((item) => item.classList.remove(this.activeClass)) // fazendo um looping pelos itens e removendo os itens ativos antes de ativar outro
    this.controlArray[this.index.active].classList.add(this.activeClass)
  }


  addControl(customControl) {
    // dando a opção ao usuário de passar o controle
    this.control =
      document.querySelector(customControl) || this.createControl(); //caso não passe nada como parametro, o control terá o valor como o retorno do método "createControl"
    // console.log(this.control) //sendo o "this.control" a ul que contem as li'saber

    // criando uma array com os itens dentro de "control" para facilitar a manipulação dos items
    this.controlArray = [...this.control.children]; // desestruturando os filhos do "control", que são as li's, me retornando Array com os li's
    // console.log(this.controlArray)

    // adicioando o evento para que a bolinha fica marcado logo de inicio de
    this.activeControlItem()

    this.controlArray.forEach(this.eventControl); //podendo passar dessa maneira por ser igual ao de baixo, por que o callback vai entender
    // this.controlArray.forEach((item, index) => this.eventControl(item, index))
  }

  // sem fazer o bind, ele dará que o "changeSlide" não foi definido, por que o this da linha 233 " this.changeSlide(index)", está fazendo referencia a esse this - "this.controlArray"
  bindControlEvents() {
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
    
  }
}
