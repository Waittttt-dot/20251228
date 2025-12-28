let stopSprite;
let walkSprite;
let jumpSprite;
let pushSprite;
let toolSprite;
let stopSprite3;
let touchSprite3;
let fallSprite3;
let stopSprite2;
let stopSprite5;
let touchSprite5;
let fallSprite5;
let stopSprite6;
let touchSprite6;
let fallSprite6;
let switchSprite;
let spriteSheet;
let totalFrames = 8;
let currentFrame = 0;
let frameWidth;
let frameHeight;
let playerX;
let playerY;
let stop3X;
let stop3Y;
let stop2X;
let stop2Y;
let stop5X;
let stop5Y;
let stop2_ForestX;
let stop2_ForestY;
let stop6X;
let stop6Y;
let stop2_Bg2X;
let stop2_Bg2Y;
let switchX;
let switchY;
let isFlipped = false;
let isJumping = false;
let jumpStartY;
let isPushing = false;
let projectiles = [];
let inputBox;
let isChar3Falling = false;
let char3FallFrame = 0;
let isChar5Falling = false;
let char5FallFrame = 0;
let isChar6Falling = false;
let char6FallFrame = 0;
let char3Text = '';
let char5Text = '';
let char6Text = '';
let quizTable;
let currentQuizIndex = 0;
let quizState = 'ASKING'; // 'ASKING', 'FEEDBACK', 'WRONG_FEEDBACK'
let feedbackTimer = 0;
let bgImg;
let forestImg;
let background2Img;
let bgX = 0;
let correctCount = 0;
let correctCount5 = 0;
let correctCount6 = 0;

function preload() {
  spriteSheet = loadImage('1/stop/stop_1.png');
  stopSprite = loadImage('1/stop/stop_1.png');
  walkSprite = loadImage('1/walk/walk_1.png');
  jumpSprite = loadImage('1/jump/jump_1.png');
  pushSprite = loadImage('1/push/push_1.png');
  toolSprite = loadImage('1/tool/tool_1.png');
  stopSprite3 = loadImage('3/stop/stop_3.png');
  touchSprite3 = loadImage('3/touch/touch_3.png');
  fallSprite3 = loadImage('3/fall_down/fall_down_3.png');
  stopSprite2 = loadImage('2/stop/stop_2.png');
  stopSprite5 = loadImage('5/stop/stop_5.png');
  touchSprite5 = loadImage('5/touch/touch_5.png');
  switchSprite = loadImage('4/switch/0.png');
  fallSprite5 = loadImage('5/fall_down/fall_down_5.png');
  stopSprite6 = loadImage('6/stop/stop_6.png');
  touchSprite6 = loadImage('6/touch/touch_6.png');
  fallSprite6 = loadImage('6/fall_down/fall_down_6.png');
  bgImg = loadImage('Summer2.png');
  forestImg = loadImage('Forest_3.png');
  background2Img = loadImage('background_2.png');
  quizTable = loadTable('question.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 根據說明，檔案寬高為 699*190，內有 8 張圖片
  // 計算單張圖片的寬度
  frameWidth = 699 / totalFrames;
  frameHeight = 190;
  playerX = width / 2;
  playerY = height / 2;
  stop3X = playerX - 120;
  stop3Y = playerY;
  stop2X = playerX + 600;
  stop2Y = playerY;
  stop5X = playerX - 1000;
  stop5Y = playerY;
  stop2_ForestX = stop5X - 400;
  stop2_ForestY = playerY;
  stop6X = playerX - 600;
  stop6Y = playerY;
  stop2_Bg2X = stop6X - 400;
  stop2_Bg2Y = playerY;
  switchX = stop2X + 400;
  switchY = playerY;

  char3Text = quizTable.getString(currentQuizIndex, 'question');
  char5Text = quizTable.getString(currentQuizIndex, 'question');
  char6Text = quizTable.getString(currentQuizIndex, 'question');

  inputBox = createInput();
  inputBox.hide();
  inputBox.changed(checkAnswer);
}

function draw() {
  image(bgImg, bgX - width, 0, width, height);
  image(bgImg, bgX, 0, width, height);
  image(bgImg, bgX + width, 0, width, height);

  // 處理投射物 (新的角色)
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let p = projectiles[i];
    p.x += p.speed * p.dir;

    // 判斷是否擊中角色3
    if (!isChar3Falling && dist(p.x, p.y, stop3X, stop3Y) < 60) {
      isChar3Falling = true;
      char3FallFrame = 0;
      projectiles.splice(i, 1); // 移除投射物
      continue;
    }

    // 判斷是否擊中角色5 (Forest Scene)
    if (bgImg === forestImg && !isChar5Falling && dist(p.x, p.y, stop5X, stop5Y) < 60) {
      isChar5Falling = true;
      char5FallFrame = 0;
      projectiles.splice(i, 1); // 移除投射物
      continue;
    }

    // 判斷是否擊中角色6 (Background 2 Scene)
    if (bgImg === background2Img && !isChar6Falling && dist(p.x, p.y, stop6X, stop6Y) < 60) {
      isChar6Falling = true;
      char6FallFrame = 0;
      projectiles.splice(i, 1); // 移除投射物
      continue;
    }

    // 投射物動畫
    if (frameCount % 5 === 0) {
      p.frame = (p.frame + 1) % 4;
    }

    let toolW = 331 / 4;
    let toolH = 75;
    let sx = p.frame * toolW;

    push();
    translate(p.x, p.y);
    if (p.dir === -1) {
      scale(-1, 1);
    }
    image(toolSprite, -toolW / 2, -toolH / 2, toolW, toolH, sx, 0, toolW, toolH);
    pop();

    // 移除超出畫面的投射物
    if (p.x < -width || p.x > width * 2) {
      projectiles.splice(i, 1);
    }
  }

  // 處理移動與動作狀態
  if (isPushing) {
    spriteSheet = pushSprite;
    frameWidth = 5101 / 23; // 圖片精靈檔案，內有23張圖片，寬高為5101*191
    frameHeight = 191;
  } else if (isJumping) {
    // 跳躍狀態下鎖定圖片與寬高
    spriteSheet = jumpSprite;
    frameWidth = 3054 / 19; // 圖片精靈檔案，內有19張圖片，寬高為3054*214
    frameHeight = 214;
  } else if (keyIsDown(UP_ARROW)) {
    isJumping = true;
    jumpStartY = playerY;
    currentFrame = 0;
    spriteSheet = jumpSprite;
  } else if (keyIsDown(DOWN_ARROW)) { // 下鍵
    isPushing = true;
    currentFrame = 0;
    spriteSheet = pushSprite;
    frameWidth = 5101 / 23;
    frameHeight = 191;
  } else if (keyIsDown(RIGHT_ARROW)) {
    bgX -= 5;
    stop3X -= 5;
    stop2X -= 5;
    stop5X -= 5;
    stop2_ForestX -= 5;
    stop6X -= 5;
    stop2_Bg2X -= 5;
    switchX -= 5;
    for (let p of projectiles) {
      p.x -= 5;
    }
    if (bgX <= -width) bgX += width;

    spriteSheet = walkSprite;
    frameWidth = 1019 / totalFrames;
    frameHeight = 195;
    isFlipped = false;
  } else if (keyIsDown(LEFT_ARROW)) {
    bgX += 5;
    stop3X += 5;
    stop2X += 5;
    stop5X += 5;
    stop2_ForestX += 5;
    stop6X += 5;
    stop2_Bg2X += 5;
    switchX += 5;
    for (let p of projectiles) {
      p.x += 5;
    }
    if (bgX >= width) bgX -= width;

    spriteSheet = walkSprite;
    frameWidth = 1019 / totalFrames;
    frameHeight = 195;
    isFlipped = true;
  } else {
    spriteSheet = stopSprite;
    frameWidth = 699 / totalFrames;
    frameHeight = 190;
  }

  // 設定動畫速度 (每 5 個 frame 更新一次動作)
  if (frameCount % 5 === 0) {
    if (isPushing) {
      currentFrame++;
      // 當23圖片播放完畢後
      if (currentFrame >= 23) {
        isPushing = false;
        currentFrame = 0;
        // 產生一個新的角色 (投射物)
        projectiles.push({
          x: playerX,
          y: playerY,
          dir: isFlipped ? -1 : 1,
          speed: 10,
          frame: 0
        });
      }
    } else if (isJumping) {
      currentFrame++;
      // 跳躍位移邏輯：前 8 格往上，之後往下 (回到原點)
      if (currentFrame <= 8) {
        playerY -= 20;
      } else if (currentFrame <= 16) {
        playerY += 20;
      }

      // 動畫播放完畢 (19張)
      if (currentFrame >= 19) {
        isJumping = false;
        playerY = jumpStartY; // 強制回到地面
        currentFrame = 0;
      }
    } else {
      currentFrame = (currentFrame + 1) % totalFrames;
    }
  }

  // 繪製右側的新角色 (stop_3)
  if (bgImg !== forestImg && bgImg !== background2Img) {
  // 預設使用 stop_3 (123*38, 4張)
  let currentStop3Sprite = stopSprite3;
  let stop3TotalFrames = 4;
  let stop3SheetW = 123;
  let stop3SheetH = 38;

  if (isChar3Falling) {
    currentStop3Sprite = fallSprite3;
    stop3TotalFrames = 4;
    stop3SheetW = 183;
    stop3SheetH = 43;

    // 播放一次倒下動畫
    if (frameCount % 5 === 0) {
      if (char3FallFrame < 3) {
        char3FallFrame++;
      }
    }
    // 覆蓋目前的 frame 計算，使用倒下動畫的 frame
    // 注意：這裡稍後會用到 stop3Frame 變數，需在下方正確設定
    
    // 當動畫播放完畢且角色1靠近時，才恢復
    if (char3FallFrame >= 3 && dist(playerX, playerY, stop3X, stop3Y) < 200) {
      isChar3Falling = false;
      char3FallFrame = 0;
    }
    inputBox.hide();
  } else {
    // 判斷距離，如果接近 (距離 < 200) 則切換為 touch_3 (91*38, 3張)
    
    // 處理問答狀態的回饋時間
    if (quizState === 'FEEDBACK' && millis() - feedbackTimer > 2000) {
      // 答對後，兩秒切換下一題
      currentQuizIndex = (currentQuizIndex + 1) % quizTable.getRowCount();
      char3Text = quizTable.getString(currentQuizIndex, 'question');
      inputBox.value('');
      quizState = 'ASKING';
    } else if (quizState === 'WRONG_FEEDBACK' && millis() - feedbackTimer > 2000) {
      // 答錯後，兩秒恢復題目
      char3Text = quizTable.getString(currentQuizIndex, 'question');
      inputBox.value('');
      quizState = 'ASKING';
    }

    if (dist(playerX, playerY, stop3X, stop3Y) < 200) {
      currentStop3Sprite = touchSprite3;
      stop3TotalFrames = 3;
      stop3SheetW = 91;
      stop3SheetH = 38;

      push();
      textSize(20);
      let tWidth = textWidth(char3Text);
      fill('#caf0f8');
      rectMode(CENTER);
      rect(stop3X, stop3Y - 66, tWidth + 20, 40, 5);
      fill(0);
      textAlign(CENTER);
      text(char3Text, stop3X, stop3Y - 60);
      pop();

      if (quizState !== 'COMPLETED') {
        inputBox.show();
        inputBox.position(playerX - 60, playerY - 150);
      } else {
        inputBox.hide();
      }
    } else {
      inputBox.hide();
    }
  }

  let stop3W = stop3SheetW / stop3TotalFrames;
  let stop3H = stop3SheetH;
  let stop3Frame = Math.floor(frameCount / 5) % stop3TotalFrames;

  // 如果是倒下狀態，強制使用倒下的 frame
  if (isChar3Falling) {
    stop3Frame = char3FallFrame;
  }

  push();
  translate(stop3X, stop3Y); // 位於角色右方
  
  let scaleX = 3;
  if (currentStop3Sprite === touchSprite3) {
    // touch_3 的背對要照著人物1的方向 (背對人物1)
    scaleX = (playerX < stop3X) ? 3 : -3;
  } else {
    // stop_3 保持原有邏輯
    scaleX = (playerX < stop3X) ? 3 : -3;
  }
  scale(scaleX, 3);
  image(currentStop3Sprite, -stop3W / 2, -stop3H / 2, stop3W, stop3H, stop3Frame * stop3W, 0, stop3W, stop3H);
  pop();
  }

  // 繪製角色2 (stop_2)
  if (bgImg !== forestImg && bgImg !== background2Img) {
  let stop2TotalFrames = 5;
  let stop2SheetW = 275;
  let stop2SheetH = 60;
  let stop2W = stop2SheetW / stop2TotalFrames;
  let stop2H = stop2SheetH;
  let stop2Frame = Math.floor(frameCount / 5) % stop2TotalFrames;

  // 當角色1靠近角色2時顯示提示
  if (dist(playerX, playerY, stop2X, stop2Y) < 200 && quizState !== 'COMPLETED') {
    let hintText = quizTable.getString(currentQuizIndex, 'hint');
    push();
    textSize(20);
    let tWidth = textWidth(hintText);
    fill('#fff3cd'); // 使用淡黃色背景區分提示
    rectMode(CENTER);
    rect(stop2X, stop2Y - 66, tWidth + 20, 40, 5);
    fill(0);
    textAlign(CENTER);
    text(hintText, stop2X, stop2Y - 60);
    pop();
  }

  push();
  translate(stop2X, stop2Y);
  scale(1.5);
  image(stopSprite2, -stop2W / 2, -stop2H / 2, stop2W, stop2H, stop2Frame * stop2W, 0, stop2W, stop2H);
  pop();
  }

  // 繪製角色5 (stop_5) - Forest_3 場景
  if (bgImg === forestImg) {
    // 處理問答狀態的回饋時間 (Forest Scene)
    if (quizState === 'FEEDBACK' && millis() - feedbackTimer > 2000) {
      currentQuizIndex = (currentQuizIndex + 1) % quizTable.getRowCount();
      char5Text = quizTable.getString(currentQuizIndex, 'question');
      inputBox.value('');
      quizState = 'ASKING';
    } else if (quizState === 'WRONG_FEEDBACK' && millis() - feedbackTimer > 2000) {
      char5Text = quizTable.getString(currentQuizIndex, 'question');
      inputBox.value('');
      quizState = 'ASKING';
    }

    // 繪製新的角色2 (提示者)
    let stop2ForestTotalFrames = 5;
    let stop2ForestSheetW = 275;
    let stop2ForestSheetH = 60;
    let stop2ForestW = stop2ForestSheetW / stop2ForestTotalFrames;
    let stop2ForestH = stop2ForestSheetH;
    let stop2ForestFrame = Math.floor(frameCount / 5) % stop2ForestTotalFrames;

    // 當角色1靠近新的角色2時顯示提示
    if (dist(playerX, playerY, stop2_ForestX, stop2_ForestY) < 200 && quizState !== 'COMPLETED') {
      let hintText = quizTable.getString(currentQuizIndex, 'hint');
      push();
      textSize(20);
      let tWidth = textWidth(hintText);
      fill('#fff3cd');
      rectMode(CENTER);
      rect(stop2_ForestX, stop2_ForestY - 66, tWidth + 20, 40, 5);
      fill(0);
      textAlign(CENTER);
      text(hintText, stop2_ForestX, stop2_ForestY - 60);
      pop();
    }

    push();
    translate(stop2_ForestX, stop2_ForestY);
    scale(1.5);
    image(stopSprite2, -stop2ForestW / 2, -stop2ForestH / 2, stop2ForestW, stop2ForestH, stop2ForestFrame * stop2ForestW, 0, stop2ForestW, stop2ForestH);
    pop();

    let stop5TotalFrames = 8;
    let stop5SheetW = 251;
    let stop5SheetH = 31;
    let currentStop5Sprite = stopSprite5;

    if (dist(playerX, playerY, stop5X, stop5Y) < 200) {
      isChar5Falling = false; // 角色1靠近時，恢復互動狀態
      currentStop5Sprite = touchSprite5;
      stop5TotalFrames = 7;
      stop5SheetW = 247;
      
      push();
      textSize(20);
      let tWidth = textWidth(char5Text);
      fill('#caf0f8');
      rectMode(CENTER);
      rect(stop5X, stop5Y - 66, tWidth + 20, 40, 5);
      fill(0);
      textAlign(CENTER);
      text(char5Text, stop5X, stop5Y - 60);
      pop();

      if (quizState !== 'COMPLETED') {
        inputBox.show();
        inputBox.position(playerX - 60, playerY - 150);
      } else {
        inputBox.hide();
      }
    } else if (isChar5Falling) {
      // 被擊中後的倒下狀態
      currentStop5Sprite = fallSprite5;
      stop5TotalFrames = 5;
      stop5SheetW = 160;
      stop5SheetH = 32;
      inputBox.hide();

      // 播放一次倒下動畫，然後停在最後一張
      if (frameCount % 5 === 0 && char5FallFrame < 4) {
        char5FallFrame++;
      }
    } else {
      inputBox.hide();
    }

    let stop5W = stop5SheetW / stop5TotalFrames;
    let stop5H = stop5SheetH;
    // 如果是倒下狀態，使用 char5FallFrame，否則使用循環動畫
    let stop5Frame = (isChar5Falling && currentStop5Sprite === fallSprite5) ? char5FallFrame : Math.floor(frameCount / 5) % stop5TotalFrames;

    push();
    translate(stop5X, stop5Y);
    // 讓角色5背對角色1
    scale(playerX < stop5X ? 3 : -3, 3);
    image(currentStop5Sprite, -stop5W / 2, -stop5H / 2, stop5W, stop5H, stop5Frame * stop5W, 0, stop5W, stop5H);
    pop();
  }

  // 繪製角色6 (stop_6) - Background 2 場景
  if (bgImg === background2Img) {
    // 處理問答狀態的回饋時間 (Background 2 Scene)
    if (quizState === 'FEEDBACK' && millis() - feedbackTimer > 2000) {
      currentQuizIndex = (currentQuizIndex + 1) % quizTable.getRowCount();
      char6Text = quizTable.getString(currentQuizIndex, 'question');
      inputBox.value('');
      quizState = 'ASKING';
    } else if (quizState === 'WRONG_FEEDBACK' && millis() - feedbackTimer > 2000) {
      char6Text = quizTable.getString(currentQuizIndex, 'question');
      inputBox.value('');
      quizState = 'ASKING';
    }

    // 繪製新的角色2 (提示者) - Background 2 場景
    let stop2Bg2TotalFrames = 5;
    let stop2Bg2SheetW = 275;
    let stop2Bg2SheetH = 60;
    let stop2Bg2W = stop2Bg2SheetW / stop2Bg2TotalFrames;
    let stop2Bg2H = stop2Bg2SheetH;
    let stop2Bg2Frame = Math.floor(frameCount / 5) % stop2Bg2TotalFrames;

    // 當角色1靠近新的角色2時顯示提示
    if (dist(playerX, playerY, stop2_Bg2X, stop2_Bg2Y) < 200 && quizState !== 'COMPLETED') {
      let hintText = quizTable.getString(currentQuizIndex, 'hint');
      push();
      textSize(20);
      let tWidth = textWidth(hintText);
      fill('#fff3cd');
      rectMode(CENTER);
      rect(stop2_Bg2X, stop2_Bg2Y - 66, tWidth + 20, 40, 5);
      fill(0);
      textAlign(CENTER);
      text(hintText, stop2_Bg2X, stop2_Bg2Y - 60);
      pop();
    }

    push();
    translate(stop2_Bg2X, stop2_Bg2Y);
    scale(1.5);
    image(stopSprite2, -stop2Bg2W / 2, -stop2Bg2H / 2, stop2Bg2W, stop2Bg2H, stop2Bg2Frame * stop2Bg2W, 0, stop2Bg2W, stop2Bg2H);
    pop();

    let stop6TotalFrames = 6;
    let stop6SheetW = 205;
    let stop6SheetH = 54;
    let currentStop6Sprite = stopSprite6;

    if (dist(playerX, playerY, stop6X, stop6Y) < 200) {
      isChar6Falling = false; // 角色1靠近時，恢復互動狀態
      currentStop6Sprite = touchSprite6;
      stop6TotalFrames = 5;
      stop6SheetW = 195;
      stop6SheetH = 54;

      inputBox.show();
      inputBox.position(playerX - 60, playerY - 150);
    } else if (isChar6Falling) {
      // 被擊中後的倒下狀態
      currentStop6Sprite = fallSprite6;
      stop6TotalFrames = 5;
      stop6SheetW = 310;
      stop6SheetH = 38;

      // 播放一次倒下動畫，然後停在最後一張
      if (frameCount % 5 === 0 && char6FallFrame < 4) {
        char6FallFrame++;
      }
      inputBox.hide();
    } else {
      inputBox.hide();
    }

    let stop6W = stop6SheetW / stop6TotalFrames;
    let stop6H = stop6SheetH;
    let stop6Frame = (isChar6Falling && currentStop6Sprite === fallSprite6) ? char6FallFrame : Math.floor(frameCount / 5) % stop6TotalFrames;

    push();
    translate(stop6X, stop6Y);
    // 讓角色6背對角色1
    scale(playerX < stop6X ? 3 : -3, 3);
    image(currentStop6Sprite, -stop6W / 2, -stop6H / 2, stop6W, stop6H, stop6Frame * stop6W, 0, stop6W, stop6H);
    pop();

    // 文字框移到角色繪製之後，避免被遮擋
    if (dist(playerX, playerY, stop6X, stop6Y) < 200) {
      push();
      textSize(20);
      let tWidth = textWidth(char6Text);
      fill('#caf0f8');
      rectMode(CENTER);
      rect(stop6X, stop6Y - 66, tWidth + 20, 40, 5);
      fill(0);
      textAlign(CENTER);
      text(char6Text, stop6X, stop6Y - 60);
      pop();
    }
  }

  // 繪製角色4 (switch)
  push();
  translate(switchX, switchY);
  image(switchSprite, -30, -30, 60, 60);
  pop();

  if (bgImg !== forestImg && bgImg !== background2Img && quizState === 'COMPLETED' && dist(playerX, playerY, switchX, switchY) < 100) {
    bgImg = forestImg;
    // 切換場景時，跳過一題，確保題目不同
    currentQuizIndex = (currentQuizIndex + 1) % quizTable.getRowCount();
    char5Text = quizTable.getString(currentQuizIndex, 'question');
    // 重置角色5的位置，讓它出現在角色1左方不遠處，否則它會因為之前的移動而離太遠
    stop5X = playerX - 1000;
    stop2_ForestX = stop5X - 400; // 新的角色2在角色5左邊
    inputBox.value(''); // 清空輸入框
    quizState = 'ASKING'; // 重置問答狀態
    correctCount5 = 0; // 重置答對題數
  }

  if (bgImg === forestImg && quizState === 'COMPLETED' && dist(playerX, playerY, switchX, switchY) < 100) {
    bgImg = background2Img;
    // 重置角色6的位置，讓它出現在角色1左方
    stop6X = playerX - 400;
    stop2_Bg2X = stop6X - 400; // 新的角色2在角色6左邊
    currentQuizIndex = (currentQuizIndex + 1) % quizTable.getRowCount();
    char6Text = quizTable.getString(currentQuizIndex, 'question');
    quizState = 'ASKING';
    correctCount6 = 0; // 重置答對題數
  }

  // 計算精靈圖的來源 X 座標與畫布上的中心位置
  let sx = currentFrame * frameWidth;
  let x = (width - frameWidth) / 2;
  let y = (height - frameHeight) / 2;

  push();
  translate(playerX, playerY);
  if (isFlipped) {
    scale(-1, 1);
  }
  // 由於使用了 translate，這裡的座標設為圖片中心點的負偏移量
  image(spriteSheet, -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight, sx, 0, frameWidth, frameHeight);
  pop();
}

function checkAnswer() {
  let userAns = inputBox.value();
  let answer = quizTable.getString(currentQuizIndex, 'answer');

  if (bgImg === background2Img) {
    if (userAns === answer) {
      correctCount6++;
      if (correctCount6 >= 2) {
        char6Text = "恭喜通關";
        quizState = 'COMPLETED';
      } else {
        char6Text = "答對了! 好棒!";
        quizState = 'FEEDBACK';
        feedbackTimer = millis();
      }
    } else {
      char6Text = "答錯了 " + quizTable.getString(currentQuizIndex, 'hint');
      quizState = 'WRONG_FEEDBACK';
      feedbackTimer = millis();
    }
    inputBox.value('');
    return;
  }

  if (bgImg === forestImg) {
    if (userAns === answer) {
      correctCount5++;
      if (correctCount5 >= 2) {
        char5Text = "恭喜通關";
        quizState = 'COMPLETED';
      } else {
        char5Text = "答對了! 好棒!";
        quizState = 'FEEDBACK';
        feedbackTimer = millis();
      }
    } else {
      char5Text = "答錯了 " + quizTable.getString(currentQuizIndex, 'hint');
      quizState = 'WRONG_FEEDBACK';
      feedbackTimer = millis();
    }
    inputBox.value('');
    return;
  }
  
  if (userAns === answer) {
    correctCount++;
    if (correctCount >= 2) {
      char3Text = "恭喜通關";
      quizState = 'COMPLETED';
    } else {
      char3Text = quizTable.getString(currentQuizIndex, 'correct_feedback');
      quizState = 'FEEDBACK';
      feedbackTimer = millis();
    }
  } else {
    char3Text = quizTable.getString(currentQuizIndex, 'wrong_feedback') + " " + quizTable.getString(currentQuizIndex, 'hint');
    quizState = 'WRONG_FEEDBACK';
    feedbackTimer = millis();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // 當視窗改變大小時，重新計算角色位置以保持在畫面中間
  let newPlayerX = width / 2;
  let diffX = newPlayerX - playerX;

  playerX = newPlayerX;
  stop3X += diffX; // 保持角色3與角色1的相對距離
  stop2X += diffX;
  stop5X += diffX;
  stop2_ForestX += diffX;
  stop6X += diffX;
  stop2_Bg2X += diffX;
  switchX += diffX;

  let newGroundY = height / 2;
  if (isJumping) {
    let jumpOffset = jumpStartY - playerY;
    jumpStartY = newGroundY;
    playerY = newGroundY - jumpOffset;
  } else {
    playerY = newGroundY;
  }
  stop3Y = newGroundY;
  stop2Y = newGroundY;
  stop5Y = newGroundY;
  stop2_ForestY = newGroundY;
  stop6Y = newGroundY;
  stop2_Bg2Y = newGroundY;
  switchY = newGroundY;
}
