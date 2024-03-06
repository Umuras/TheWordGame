import * as PIXI from "pixi.js";
import { Application, Text } from "pixi.js";
import { initAssets } from "./assets";
import { gsap } from "gsap";
import { CustomEase, PixiPlugin } from "gsap/all";
import Game from "./game";
import PhysicEngine from "./PhysicEngine";

export const GAME_WIDTH = 480;
export const GAME_HEIGHT = 800;

export const app = new Application({
  backgroundColor: 0x000000,
  antialias: true,
  hello: true,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
});

app.ticker.stop();
gsap.ticker.add(() => {
  app.ticker.update();
});

async function init() {

  document.body.appendChild(app.view);

  let assets = await initAssets();
  console.log("assets", assets);

  gsap.registerPlugin(PixiPlugin, CustomEase);
  PixiPlugin.registerPIXI(PIXI);

  const physic = new PhysicEngine();
  physic.debug = false;

  const game = new Game(physic);
  

  app.ticker.add(() => {
      for(let i = 0; i < physic.objects.length; i++)
    {
      let object = physic.objects[i];
      object.sprite.position = object.body.position;
      object.sprite.rotation = object.body.angle;
    }

     for (let i = 0; i < game.bubbleSprites.length; i++) {
      let bubbleSprite = game.bubbleSprites[i];
      let letter = game.bubbleWhiteTexts[i];
      letter.transform.position = bubbleSprite.transform.position;
    } 
    
    if (game.isAvailableGreenPaneText) {
      game.ControlGreenPaneText();
      if (game.controlWord) {
        game.ControlLevelWords();
      }
    }
  });

  app.stage.addChild(game);
}

init();
