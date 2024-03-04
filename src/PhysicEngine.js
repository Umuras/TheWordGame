import { Engine, World, Bodies, Composite, Runner, Matter, Render} from "matter-js";
import { Container, Sprite } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from ".";

export default class PhysicEngine {
  constructor() {
    this.debug = true;
    this.objects = [];
    this.init();
  }

  add(sprite, body) {
    this.objects.push({ sprite: sprite, body: body });
    Composite.add(this.engine.world, body);
  }

  removeWithBody(body) {
    let array = this.objects.filter((object) => object.body === body);
    World.remove(this.engine.world, body);
  }

  removeWithSprite(sprite) {
    let array = this.objects.filter((object) => object.sprite === sprite);
    this.removeFromArray(array);
  }

  removeWithArray(array) {
    for(let i = 0; i < array.length; i++)
    {
        let object = array[i];
        World.remove(this.engine.world, object.body);
        this.objects.splice(this.objects.indexOf(object), 1);
    }
  }

  init() {
    this.engine = Engine.create();

    if(this.debug)
    {

        var render = Render.create({
            element: document.body,
            engine: this.engine,
            options: {
            width: GAME_WIDTH,
            height: GAME_HEIGHT,
            background: "#20a3d6",
            wireframes: false
            },
        });

        Render.run(render);
    }
    createWall(this.engine);
    

    var runner = Runner.create();


    Runner.run(runner, this.engine);
  }
}

function createWall(engine)
{
    const wallOptions = {
        isStatic: true
    };
    const thickness = 1;
    Composite.add(engine.world,[
Bodies.rectangle(GAME_WIDTH/2,GAME_HEIGHT,GAME_WIDTH,thickness,wallOptions),
Bodies.rectangle(GAME_WIDTH,GAME_HEIGHT/2,thickness,GAME_HEIGHT,wallOptions),
Bodies.rectangle(GAME_WIDTH/2,0,GAME_WIDTH,thickness,wallOptions),
Bodies.rectangle(0,GAME_HEIGHT/2,thickness,GAME_HEIGHT,wallOptions),
    ]);
}