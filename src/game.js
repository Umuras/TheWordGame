import gsap, { Power0 } from "gsap";
import { Container, Sprite, TextStyle, Text, Texture } from "pixi.js";
import { GAME_HEIGHT, GAME_WIDTH } from ".";
import { Bodies } from "matter-js";

export default class Game extends Container {
  constructor(physic) {
    super();
    this.level = 0;
    this.levelWordsArray = [];
    this.controlWord = true;
    this.tick;
    this.bubbleText;
    this.randomIndex;
    this.randomLetter;
    this.bubbleSpriteWordMap = new Map();
    this.wordOrder = 0;
    this.isAvailableGreenPaneText = false;
    this.clickableBalloonBorder = false;
    this.cross;
    this.orangeInfoPane;
    this.greenPaneText;
    this.orangePaneForWords;
    this.orangePaneInfoText;
    this.orangeInfoPaneTextStyle;
    this.WriteFirstLetter = true;
    this.bubbleSprites = [];
    this.bubbleWhiteTexts = [];
    this.deleteAllText;
    this.ControlGreenPaneText;
    this.adjustNewIndex(this.letters);
    this.DeleteSelectedBubbleSpriteAndCreateNews;
    this.CloseClickablePropertyBubbleSprites;
    this.ControlLevelWords;
    this.ClearWordPaneTextAndChangeTexture;
    this.AddNewBubbleSprites;
    this.DeleteAllScene;
    this.physic = physic;
    this.init();
  }
  
  init() {
     let background = Sprite.from("background");
     background.anchor.set(0.5);
     this.addChild(background);
     background.x = GAME_WIDTH * 0.5;
     background.y = GAME_HEIGHT * 0.5;
     background.width = GAME_WIDTH;
     background.height = GAME_HEIGHT+100;
    
     this.orangePaneForWords = Sprite.from("orange-pane");
     this.orangePaneForWords.anchor.set(0.5);
     this.addChild(this.orangePaneForWords);
     this.orangePaneForWords.scale.x = 0.85;
     
     let orangePaneForWordsBody = Bodies.rectangle(240, 625, this.orangePaneForWords.width, this.orangePaneForWords.height, { isStatic: true });
     this.physic.add(this.orangePaneForWords, orangePaneForWordsBody);

     const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
     this.levelWordsArray.push("WORD");
     this.levelWordsArray.push("MATE");
     this.levelWordsArray.push("MEAL");
     this.levelWordsArray.push("SON");
     const firstWord = this.levelWordsArray[0].split('');


     for (let i = 0; i < 15; i++) {
      var bubbleSprite = Sprite.from("bubble-white");
      if (!this.clickableBalloonBorder) {
        bubbleSprite.on('pointerdown', this.onClickSprite);
      }


      bubbleSprite.y = 100;
      bubbleSprite.anchor.set(0.5);
      bubbleSprite.width = Math.floor(Math.random()*70)+70;
      bubbleSprite.height = bubbleSprite.width;
 
      this.addChild(bubbleSprite);
      this.bubbleSprites.push(bubbleSprite);

      var bubbleSpriteBody = Bodies.circle(200, 200, bubbleSprite.width/2);
      this.physic.add(bubbleSprite, bubbleSpriteBody);


       const textStyle = new TextStyle({
        fontFamily: 'font',
        fontSize: 200,
        fill: 'orange',
        fontStyle: 'normal',
        fontWeight: 'bold'
       });

       

       if (i <= 3) {
        this.bubbleText = new Text(firstWord[i], textStyle);
        this.bubbleText.anchor.set(0.5);
        this.addChild(this.bubbleText);
        bubbleSprite.addChild(this.bubbleText);
        this.bubbleWhiteTexts.push(this.bubbleText);
       }

       if (i > 3) {
        this.randomIndex = Math.floor(Math.random() * alphabet.length);
        this.randomLetter = alphabet[this.randomIndex];
        this.bubbleText = new Text(this.randomLetter.toUpperCase(), textStyle);
        this.bubbleText.anchor.set(0.5);
        this.addChild(this.bubbleText);
        bubbleSprite.addChild(this.bubbleText);
        this.bubbleWhiteTexts.push(this.bubbleText);
       }
     
     
     }
  }
    CreateInfoOrangePaneAndText(){
      setTimeout(() => {
      this.orangeInfoPane = Sprite.from("orange-pane");
      this.orangeInfoPane.anchor.set(0.5);
      this.orangeInfoPane.x = 240;
      this.orangeInfoPane.y = 175;
      this.orangeInfoPane.width = 350;
      this.orangeInfoPane.height = 70;

      this.orangeInfoPaneTextStyle = new TextStyle({
        fontFamily: 'font',
        fontSize: 20,
        fill: 'white',
        fontStyle: 'normal',
        fontWeight: 'bold'
      })


      this.orangePaneInfoText = new Text("TAP LETTERS TO MAKE WORD",this.orangeInfoPaneTextStyle);
      this.orangePaneInfoText.anchor.set(0.5);
      this.orangePaneInfoText.position = this.orangeInfoPane.position;
      this.addChild(this.orangeInfoPane);
      this.addChild(this.orangePaneInfoText);
      this.OpenClickablePropertyBubbleSprites();
      }, 1000);

      
    }

    OpenClickablePropertyBubbleSprites()
    {
      for (let i = 0; i < this.bubbleSprites.length; i++) {
        this.bubbleSprites[i].interactive = true;
        this.bubbleSprites[i].buttonMode = true;
      }
    }
    CloseClickablePropertyBubbleSprites = () =>
    {
      for (let i = 0; i < this.bubbleSprites.length; i++) {
        this.bubbleSprites[i].interactive = false;
        this.bubbleSprites[i].buttonMode = false;
      }
    }

    onClickSprite = (event) =>{
      let clickedSprite = event.currentTarget;
      if (clickedSprite.texture == Texture.from("bubble-white"))
      {
        clickedSprite.texture = Texture.from("circle");
      }
      else
      {
        clickedSprite.texture = Texture.from("bubble-white");
        this.deleteLetterOnGreenPaneText(clickedSprite.children[0]);
      }
      
      console.log(clickedSprite.children[0].text);
      if (this.WriteFirstLetter)
      {
        this.orangeInfoPaneTextStyle.fontSize = 15;
        this.orangePaneInfoText.text = "LETTERS DON'T HAVE TO BE TOUCHING";
        this.createTextOnGrayPane(clickedSprite.children[0].text);
      }
      else if(!this.WriteFirstLetter && clickedSprite.texture == Texture.from("circle"))
      {
        this.removeChild(this.orangePaneInfoText);
        this.removeChild(this.orangeInfoPane);
        this.addNewLetterOnGreenPaneText(clickedSprite.children[0].text);
      }
    }
    createTextOnGrayPane(letterText)
    {
      this.orangePaneForWords.texture = Texture.from("green-pane");

      const greenPaneTextStyle = new TextStyle({
        fontFamily: 'font',
        fontSize: 50,
        fill: 'white',
        fontStyle: 'normal',
        fontWeight: 'bold'
      });


       this.greenPaneText = new Text(letterText, greenPaneTextStyle);
       this.greenPaneText.position = this.orangePaneForWords.position;
       this.greenPaneText.x = 70;
       this.greenPaneText.y = 595;
       this.addChild(this.greenPaneText);
       this.WriteFirstLetter = false;
       this.isAvailableGreenPaneText = true;


       this.cross = Sprite.from("cross");
       this.cross.anchor.set(0.5);
       this.cross.x = 380;
       this.cross.y = 625;
       this.cross.interactive = true;
       this.cross.buttonMode = true;
       this.addChild(this.cross);
       this.cross.on('pointerdown', this.deleteAllText);
    }

    addNewLetterOnGreenPaneText(text)
    {
      if(this.greenPaneText.text == "")
      {
        this.orangePaneForWords.texture = Texture.from("gray-pane");
        this.addChild(this.cross);
      }
      this.greenPaneText.text += text;
    }
    deleteLetterOnGreenPaneText(bubbleSpriteChild)
    {
      let letters = this.greenPaneText.text.split('');
      letters = letters.filter(item => item !== bubbleSpriteChild.text);
      this.greenPaneText.text = "";
      this.greenPaneText.text = "";
      for (let i = 0; i < letters.length; i++) {
        let element = letters[i];
        this.greenPaneText.text += element;
      } 
    }
    deleteAllText = () => {
      this.greenPaneText.text = "";
      this.orangePaneForWords.texture = Texture.from("orange-pane");
      this.removeChild(this.cross);

      for (let i = 0; i < this.bubbleSprites.length; i++) {
        if (this.bubbleSprites[i].texture == Texture.from("circle")) {
          this.bubbleSprites[i].texture = Texture.from("bubble-white");
        }
      }
      this.clickableBalloonBorder = false;
    }

    adjustNewIndex = (letters) =>
    {
      this.bubbleSpriteWordMap.forEach((key,value) => {
        for (let i = 0; i < letters.length; i++) {
          console.log(letters[i]);
        }
      });
    }

    ControlGreenPaneText = () =>
    {
      if (this.greenPaneText.text != "") {
       return; 
      }
        this.removeChild(this.cross);
        this.orangePaneForWords.texture = Texture.from("orange-pane");
    }

    ControlLevelWords = () =>{
      if (this.greenPaneText.text == this.levelWordsArray[this.level]) {
        this.controlWord = false;
        this.removeChild(this.cross);
        this.orangePaneForWords.texture = Texture.from("green-pane");
        this.tick = Sprite.from("tick");
        this.tick.anchor.set(0.5);
        this.tick.x = 380;
        this.tick.y = 625;
        this.tick.interactive = true;
        this.tick.buttonMode = true;
        this.addChild(this.tick);
        this.addChild(this.orangeInfoPane);
        this.addChild(this.orangePaneInfoText);
        this.orangeInfoPaneTextStyle.fontSize = 24;
        this.orangePaneInfoText.text = "TAP THE TICK TO CONFIRM";
        this.CloseClickablePropertyBubbleSprites();
        this.tick.on('pointerdown', this.DeleteSelectedBubbleSpriteAndCreateNews);
      }
    }

    DeleteSelectedBubbleSpriteAndCreateNews = () =>
    {
        for (let i = 0; i < this.physic.objects.length; i++) {
          if (this.physic.objects[i].sprite.texture == Texture.from("circle"))
          {
            this.physic.removeWithBody(this.physic.objects[i].body);
          }
        }

        for (let i = 0; i < this.bubbleSprites.length; i++) {
          if (this.bubbleSprites[i].texture == Texture.from("circle")) {
            this.removeChild(this.bubbleSprites[i]);
          }
        }
      this.ClearWordPaneTextAndChangeTexture();
    }

    ClearWordPaneTextAndChangeTexture = () =>
    {
      this.greenPaneText.text = "";
      this.orangePaneForWords.texture = Texture.from("orange-pane");

      this.removeChild(this.orangeInfoPane);
      this.removeChild(this.orangePaneInfoText);
      this.removeChild(this.tick);
      
      if (this.level == 3) {
        this.DeleteAllScene();
        return;
      }

      this.controlWord = true;
      this.level++;
      this.AddNewBubbleSprites().then(this.OpenClickablePropertyBubbleSprites());
    }

    AddNewBubbleSprites = async () => {
      const levelLetters = this.levelWordsArray[this.level].split('');
      for (let i = 0; i < levelLetters.length; i++) {
        var bubbleSprite = Sprite.from("bubble-white");
        if (!this.clickableBalloonBorder) {
          bubbleSprite.on('pointerdown', this.onClickSprite);
        }
      bubbleSprite.y = 100;
      bubbleSprite.anchor.set(0.5);
      bubbleSprite.width = Math.floor(Math.random()*70)+70;
      bubbleSprite.height = bubbleSprite.width;
 
      this.addChild(bubbleSprite);
      this.bubbleSprites.push(bubbleSprite);

      var bubbleSpriteBody = Bodies.circle(200, 200, bubbleSprite.width/2);
      this.physic.add(bubbleSprite, bubbleSpriteBody);

       const textStyle = new TextStyle({
        fontFamily: 'font',
        fontSize: 200,
        fill: 'orange',
        fontStyle: 'normal',
        fontWeight: 'bold'
       });

       this.bubbleText = new Text(levelLetters[i], textStyle);
       this.bubbleText.anchor.set(0.5);
       this.addChild(this.bubbleText);
       bubbleSprite.addChild(this.bubbleText);
       this.bubbleWhiteTexts.push(this.bubbleText);
      }
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    DeleteAllScene = () => {
        for (let i = 0; i < this.bubbleSprites.length; i++) {
          this.removeChild(this.bubbleSprites[i]);
        }

        this.physic.removeWithArray(this.physic.objects);

        this.removeChild(this.orangePaneForWords);
        this.removeChild(this.orangeInfoPane);
        this.removeChild(this.tick);
        this.removeChild(this.greenPaneText);
    }
}
