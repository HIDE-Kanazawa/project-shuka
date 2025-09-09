/**
 * 季節エフェクトモジュール
 * 
 * 機能:
 * - 各季節の降下物エフェクト（雨、桜など）
 * - Canvas を使用した自然なアニメーション
 * - レスポンシブ対応とパフォーマンス最適化
 */

/**
 * 共通: スタイルを一度だけ注入するユーティリティ（夏柳CSSで使用）
 */
function injectStyleOnce(id, cssText) {
  if (document.getElementById(id)) return;
  const styleEl = document.createElement('style');
  styleEl.id = id;
  styleEl.textContent = cssText;
  document.head.appendChild(styleEl);
}

/**
 * 共有ユーティリティ（非破壊導入）
 * 現時点では既存クラスからは呼び出さず、フェーズ2以降で段階的に置換することを想定。
 */

// 値のクランプ
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// 線形補間
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ビューポート幅に応じた密度算出（例: factor=10 なら width/10 個）
function computeDensity(viewWidth, factor, min = 0, max = Infinity) {
  const raw = Math.floor(viewWidth / Math.max(1, factor));
  return clamp(raw, min, max);
}

// deltaTime（秒）を取得するクロックを生成
function createDeltaClock() {
  let last = performance.now();
  return function tick() {
    const now = performance.now();
    const deltaSec = (now - last) / 1000;
    last = now;
    return { deltaSec, now };
  };
}

// 風モデルの更新ヘルパ
// state: { wind:number, windTarget:number, lastWindChange:number }
// opts: { interval:number(ms), ease:number(0-1), range:number }
function updateWind(state, now, opts = {}) {
  const interval = opts.interval ?? 4000;
  const ease = clamp(opts.ease ?? 0.02, 0, 1);
  const range = opts.range ?? 1.0;

  if (now - state.lastWindChange > interval) {
    state.windTarget = (Math.random() * 2 - 1) * range;
    state.lastWindChange = now;
  }
  state.wind = lerp(state.wind, state.windTarget, ease);
  return state.wind;
}

// （削除済み）未使用の visibility 連動ユーティリティとスタイル注入ユーティリティは保守性向上のため除去

/**
 * 雨エフェクトモジュール（梅雨季専用）
 * 
 * 機能:
 * - リアルな雨粒の降下アニメーション
 * - 風の影響による自然な雨の軌道
 * - 没入感のある密度とエフェクト
 * - 梅雨の季節感を演出する没入感のある密度
 */
class RainEffect {
  /**
   * コンストラクタ - 雨エフェクトの初期化
   */
  constructor() {
    // Canvas要素の作成と設定
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'rain-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    
    // サイズ設定とリサイズ対応
    this.resize();
    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);

    // 雨粒の初期化
    this.drops = []; // 雨粒オブジェクトの配列
    // より没入感のある梅雨エフェクトのために雨粒密度を増加
    this.dropCount = computeDensity(window.innerWidth, 2.5); // 密度の高い雨を生成（共有関数）
    for (let i = 0; i < this.dropCount; i++) {
      this.drops.push(this.createRaindrop(true));
    }

    // フレームレート非依存化のための deltaClock（現状は可視化影響なし）
    this._tick = createDeltaClock();

    // 風モデルの状態（雨では現状使用しないが、将来拡張のため導入）
    this._wind = { wind: 0, windTarget: 0, lastWindChange: performance.now() };

    // アニメーションの開始
    this._running = true;
    this.animate();
  }

  /**
   * キャンバスサイズのリサイズ処理
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * 雨粒オブジェクトの生成
   */
  createRaindrop(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -50,
      length: 10 + Math.random() * 20,
      speed: 2 + Math.random() * 6,
      opacity: 0.1 + Math.random() * 0.3
    };
  }

  /**
   * アニメーションループ
   */
  animate() {
    if (!this._running || !this.canvas.parentNode) return; // 停止条件

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 共有の風モデル更新（雨では range=0 で無効化し、挙動は従来通り）
    const { now } = this._tick ? this._tick() : { now: performance.now(), deltaSec: 0 };
    updateWind(this._wind, now, { interval: 3500, ease: 0.05, range: 0 });

    // 雨粒の描画と更新
    for (const drop of this.drops) {
      // 雨粒の描画
      ctx.strokeStyle = `rgba(174, 194, 224, ${drop.opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y);
      ctx.lineTo(drop.x, drop.y + drop.length);
      ctx.stroke();

      // 雨粒の移動
      drop.y += drop.speed;

      // 画面下端に達したら上端にリセット
      if (drop.y > this.canvas.height + 50) {
        drop.x = Math.random() * this.canvas.width;
        drop.y = -drop.length;
        drop.speed = 2 + Math.random() * 6;
      }
    }

    if (this._running) requestAnimationFrame(() => this.animate());
  }

  /**
   * 雨エフェクトの破棄処理
   */
  destroy() {
    this._running = false;
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.remove();
    }
  }
}

/**
 * 桜エフェクトモジュール（春季専用）
 * 
 * 機能:
 * - 舞い散る桜の花びらアニメーション
 * - 初期バースト機能（季節切り替え時の演出）
 * - 風の変化による自然な動き
 * - 春の季節感を演出するエレガントな密度
 */
class SakuraEffect {
  /**
   * コンストラクタ - 桜エフェクトの初期化
   */
  constructor() {
    // Canvas要素の作成と設定
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'sakura-canvas';
    this.ctx = this.canvas.getContext('2d'); // 2D描画コンテキスト
    document.body.appendChild(this.canvas);
    
    // サイズ設定とリサイズ対応
    this.resize();
    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize); // リサイズ対応

    // 花びらの初期化
    this.petals = []; // 花びらオブジェクトの配列
    // エレガントな春エフェクトのための桜の花びら密度（共有関数に置換）
    this.petalCount = computeDensity(window.innerWidth, 15);
    
    // 春のそよ風のための風変数
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    // フレームレート非依存化のための deltaClock（視覚への影響なし）
    this._tick = createDeltaClock();
    
    this.initializePetals();
    this._running = true;
    this.animate();
  }

  /**
   * キャンバスサイズのリサイズ処理 - ウィンドウサイズ変更への動的対応
   * ブラウザのリサイズ時にキャンバスをウィンドウ全体に合わせ、花びらのサイズ倍率を再計算
   * @description レスポンシブデザインに対応し、あらゆるデバイスで適切な桜の演出を保証。
   *              スマートフォンから大画面まで、一貫した美しい春の花びらの演出
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.sizeMultiplier = this.getSizeMultiplier();
  }

  /**
   * デバイスサイズ倍率の計算 - 画面サイズに応じた適切なスケーリング
   * 768pxを基準として画面サイズに応じた花びらのスケール倍率を算出
   * @returns {number} 0.6から1.2の範囲で制限されたサイズ倍率
   * @description モバイル端末では小さめの花びら、大画面では大きめの花びらで調整。
   *              どのデバイスでも美しい桜の演出を提供し、春の美しさを最大化
   */
  getSizeMultiplier() {
    const ratio = window.innerWidth / 768;
    return Math.max(0.6, Math.min(1.2, ratio));
  }

  /**
   * 花びらの初期化 - 春の美しい桜の花びらを初期配置
   * @description 春の訪れとともに桜が満開する美しい情景を再現。
   */
  initializePetals() {
    for (let i = 0; i < this.petalCount; i++) {
      this.petals.push(this.createPetal(true));
    }
  }

  /**
   * 桜の花びらオブジェクトの生成 - 繊細で優美な花びらの物理的特性を再現
   * 春のそよ風に舞う桜の花びらの自然な動きを総合的に表現
   * @param {boolean} randomY - Y座標をランダムに設定するかどうか（初期化時用）
   * @returns {Object} 花びらの物理プロパティを含むオブジェクト
   * @description 日本の春を代表する桜の花びらの美しい動きを再現。風への反応、
   *              穏やかな回転、優雅な揺れ、変化に富んだ色彩などを統合した美しい演出
   */
  createPetal(randomY = false) {
    // 自然な揺らぎを追加するため、位相・ゆらぎ量を持たせる
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      // 少しだけ大きく（+約15〜20%）
      size: (7 + Math.random() * 13) * this.sizeMultiplier, // レスポンシブな花びらサイズ
      // 垂直速度をやや広めにして個体差を出す
      speed: 0.35 + Math.random() * 0.8, // 穏やかな落下速度
      opacity: 0.7 + Math.random() * 0.3, // 視認性向上のための高い透明度
      // ドリフトの幅を少し増やして緩やかな蛇行を演出
      drift: (Math.random() - 0.5) * 0.6, // 水平方向のドリフト
      rotationSpeed: (Math.random() - 0.5) * 2, // 穏やかな回転
      rotation: Math.random() * Math.PI * 2,
      turbulence: 0.25 + Math.random() * 0.5, // 穏やかな乱気流（0.25〜0.75）
      phase: Math.random() * Math.PI * 2, // 個体ごとの位相
      petalType: Math.floor(Math.random() * 3), // 異なる花びらの形
      color: this.getSakuraColor()
    };
  }

  /**
   * 桜の伝統色の取得 - 日本の桜に忠実な美しいカラーパレット
   * 伝統的な桜の色合いからランダムに選択し、自然な色合いのバラエティを作成
   * @returns {Object} RGB値を含む色情報オブジェクト
   * @description 深いピンクから純白まで、桜の花びらが持つ繊細な色合いのグラデーションを再現。
   *              日本の春の美しさを忠実に表現する精巧な色彩設計
   */
  getSakuraColor() {
    // 伝統的な桜の色合い - 柔らかなピンクと白
    const colors = [
      { r: 255, g: 182, b: 193 }, // 淡いピンク
      { r: 255, g: 192, b: 203 }, // ピンク
      { r: 255, g: 228, b: 225 }, // 薄いピンク
      { r: 255, g: 240, b: 245 }, // ごく薄いピンク
      { r: 255, g: 255, b: 255 }, // 純白
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * アニメーションループ
   */
  animate() {
    if (!this._running || !this.canvas.parentNode) return; // 停止条件

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 共有の風モデル更新（既存と同一パラメータ: interval=4000ms, ease=0.015, range=2.5）
    const { now } = this._tick ? this._tick() : { now: performance.now(), deltaSec: 0 };
    updateWind(this, now, { interval: 4000, ease: 0.015, range: 2.5 });

    for (const petal of this.petals) {
      ctx.globalAlpha = petal.opacity;
      
      ctx.save();
      ctx.translate(petal.x, petal.y);
      ctx.rotate(petal.rotation);
      
      // 花びらの色を設定
      const { r, g, b } = petal.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${petal.opacity})`;
      
      // Draw sakura petal
      this.drawSakuraPetal(ctx, 0, 0, petal.size, petal.petalType);
      
      ctx.restore();

      // 花びらの移動（自然な揺らぎを加える）
      // ゆっくりとした左右の揺れ + わずかな上下のゆらぎ + 穏やかな回転
      const tSec = now / 1000;
      const sway = Math.sin(tSec * (0.8 + petal.turbulence) + petal.phase) * (0.6 + petal.turbulence * 1.4);
      petal.x += this.wind + petal.drift + sway * 0.6;
      petal.y += petal.speed + Math.cos(tSec * 0.9 + petal.phase) * 0.15;
      petal.rotation += petal.rotationSpeed * 0.015 + Math.sin(tSec * 0.6 + petal.phase) * 0.002;

      // 画面外に出たら上端から再生成
      if (petal.y > this.canvas.height + 50 || 
          petal.x < -50 || petal.x > this.canvas.width + 50) {
        // 新しい花びらとして再初期化
        const newPetal = this.createPetal(false);
        Object.assign(petal, newPetal);
      }
    }

    ctx.globalAlpha = 1.0;
    if (this._running) requestAnimationFrame(() => this.animate());
  }

  /**
   * リアルな桜の花びらの描画
   * 
   * 機能:
   * - 日本の桜の品種に基づいた3つの花びらタイプを描画
   * - type 0: ソメイヨシノ風のハート型花びら
   * - type 1: ヤマザクラ風の深い切れ込みを持つ花びら
   * - type 2: シダレザクラ風の丸みを帯びた花びら
   * 
   * @param {CanvasRenderingContext2D} ctx - 描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} size - 花びらサイズ
   * @param {number} type - 花びらの種類（0-2）
   */
  drawSakuraPetal(ctx, cx, cy, size, type) {
    const scale = size / 10;
    
    ctx.beginPath();
    
    if (type === 0) {
      // Type A: Classic heart-shaped sakura petal (ソメイヨシノ風)
      const width = 4 * scale;
      const height = 6 * scale;
      
      // Start from bottom center
      ctx.moveTo(cx, cy + height * 0.4);
      
      // Left side curve - realistic sakura petal curve
      ctx.bezierCurveTo(
        cx - width * 0.3, cy + height * 0.1,
        cx - width * 0.5, cy - height * 0.1,
        cx - width * 0.2, cy - height * 0.4
      );
      
      // Top left notch (characteristic sakura indent)
      ctx.quadraticCurveTo(cx - width * 0.1, cy - height * 0.5, cx, cy - height * 0.3);
      
      // Top right notch
      ctx.quadraticCurveTo(cx + width * 0.1, cy - height * 0.5, cx + width * 0.2, cy - height * 0.4);
      
      // Right side curve
      ctx.bezierCurveTo(
        cx + width * 0.5, cy - height * 0.1,
        cx + width * 0.3, cy + height * 0.1,
        cx, cy + height * 0.4
      );
      
    } else if (type === 1) {
      // Type B: Double-notched sakura petal (ヤマザクラ風)
      const width = 3.5 * scale;
      const height = 5.5 * scale;
      
      ctx.moveTo(cx, cy + height * 0.3);
      
      // Left curve with more pronounced shape
      ctx.bezierCurveTo(
        cx - width * 0.4, cy,
        cx - width * 0.3, cy - height * 0.3,
        cx - width * 0.2, cy - height * 0.4
      );
      
      // Deep notch characteristic of some sakura varieties
      ctx.quadraticCurveTo(cx - width * 0.2, cy - height * 0.4, cx - width * 0.1, cy - height * 0.2);
      ctx.quadraticCurveTo(cx, cy - height * 0.5, cx + width * 0.1, cy - height * 0.2);
      ctx.quadraticCurveTo(cx + width * 0.2, cy - height * 0.4, cx + width * 0.2, cy - height * 0.4);
      
      // Right curve
      ctx.bezierCurveTo(
        cx + width * 0.3, cy - height * 0.3,
        cx + width * 0.4, cy,
        cx, cy + height * 0.3
      );
      
    } else {
      // Type C: Simple rounded sakura petal (シダレザクラ風)
      const width = 3 * scale;
      const height = 5 * scale;
      
      ctx.moveTo(cx, cy + height * 0.4);
      
      // Simple, elegant curves for weeping cherry style
      ctx.bezierCurveTo(
        cx - width * 0.3, cy + height * 0.1,
        cx - width * 0.4, cy - height * 0.2,
        cx - width * 0.1, cy - height * 0.4
      );
      
      // Soft top curve
      ctx.quadraticCurveTo(cx, cy - height * 0.5, cx + width * 0.1, cy - height * 0.4);
      
      ctx.bezierCurveTo(
        cx + width * 0.4, cy - height * 0.2,
        cx + width * 0.3, cy + height * 0.1,
        cx, cy + height * 0.4
      );
    }
    
    ctx.fill();
    
    // Add subtle petal veins for realism
    if (size > 6) { // Only add veins to larger petals
      const width = type === 0 ? 4 * scale : type === 1 ? 3.5 * scale : 3 * scale;
      const height = type === 0 ? 6 * scale : type === 1 ? 5.5 * scale : 5 * scale;
      
      ctx.strokeStyle = `rgba(${255}, ${182}, ${193}, 0.3)`;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      
      // Central vein
      ctx.moveTo(cx, cy + height * 0.3);
      ctx.lineTo(cx, cy - height * 0.2);
      
      // Side veins
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - width * 0.15, cy - height * 0.15);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + width * 0.15, cy - height * 0.15);
      
      ctx.stroke();
    }
  }

  /**
   * 桜エフェクトの破棄処理
   * 
   * 機能:
   * - Canvas要素のDOM削除
   * - イベントリスナーの解除
   * - リソースの適切な解放
   */
  destroy() {
    this._running = false;
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.remove();
    }
  }
}

/**
 * 桜エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 春の桜エフェクトの有効化/無効化
 * - 季節変更時のスムーズなエフェクト切り替え
 */
let sakuraEffect;
/**
 * 桜エフェクトを有効化
 */
window.enableSakura = function() {
  if (!sakuraEffect) {
    // 新しい桜エフェクトインスタンスを作成
    sakuraEffect = new SakuraEffect();
    window.sakuraEffect = sakuraEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    sakuraEffect.canvas.style.display = '';
  }
};

/**
 * 桜エフェクトを無効化してリソースを解放
 */
window.disableSakura = function() {
  if (sakuraEffect) {
    sakuraEffect.destroy(); // インスタンスの適切な破棄処理
    sakuraEffect = null;
    window.sakuraEffect = null; // グローバル参照をクリア
  }
};

/**
 * 桜エフェクト用CSSスタイルの追加
 * 
 * 機能:
 * - フルスクリーン固定位置での桜Canvas表示
 * - マウスイベント無効化（pointer-events: none）
 * - 適切なz-indexとopacityによる美しい重ね表示
 */
// 桜エフェクト用CSSの定義
const sakuraCSS = `
.sakura-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.8;
}
`;

// CSSを動的にドキュメントヘッドに追加
injectStyleOnce('sakura-effect-style', sakuraCSS);

/**
 * 雨エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 梅雨シーズンの雨エフェクト有効化/無効化
 * - 没入感のある雨のアニメーションと水しぶきエフェクト
 * - 日本の梅雨の情悩を表現する雨音と雰囲気
 */
let rainEffect;
/**
 * 雨エフェクトを有効化
 */
window.enableRain = function() {
  if (!rainEffect) {
    // 新しい雨エフェクトインスタンスを作成
    rainEffect = new RainEffect();
    window.rainEffect = rainEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    rainEffect.canvas.style.display = '';
  }
};

/**
 * 雨エフェクトを無効化してリソースを解放
 */
window.disableRain = function() {
  if (rainEffect) {
    rainEffect.destroy(); // インスタンスの適切な破棄
    rainEffect = null;
    window.rainEffect = null; // グローバル参照をクリア
  }
};

// 雨エフェクト用CSSの追加
const rainCSS = `
.rain-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
}
`;

injectStyleOnce('rain-effect-style', rainCSS);

/**
 * 雪エフェクトモジュール（冬季専用）
 * 
 * 機能:
 * - Canvas上に美しい雪の結晶アニメーションを描画
 * - 穏やかな風の変化による自然な雪の舞い
 * - 日本の冬の静寂で美しい雪景を演出
 */
class SnowEffect {
  /**
   * コンストラクタ - 雪エフェクトの初期化
   * 日本の冬の美しい雪景を再現するための設定と初期化
   */
  constructor() {
    // Canvas要素の作成と設定
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'snow-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // キャンバスサイズの設定
    this.resize();
    this.sizeMultiplier = this.getSizeMultiplier();
    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);

    // 雪片の初期化
    this.flakes = [];
    // 画面幅に基づく雪の密度（共有関数に置換）- 雨よりも稀な密度で静寂な冬を表現
    this.flakeCount = computeDensity(window.innerWidth, 8);
    for (let i = 0; i < this.flakeCount; i++) {
      this.flakes.push(this.createFlake(true));
    }

    // 穏やかな漂いのための風変数
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    // フレームレート非依存化のための deltaClock（視覚への影響なし）
    this._tick = createDeltaClock();
    this.animate = this.animate.bind(this);
    this._running = true;
    if (this._running) requestAnimationFrame(this.animate);
  }

  /**
   * キャンバスサイズのリサイズ処理 - ウィンドウサイズ変更への動的対応
   * ブラウザのリサイズ時にキャンバスをウィンドウ全体に合わせ、雪片のサイズ倍率を再計算
   * @description レスポンシブデザインに対応し、あらゆるデバイスで適切な雪の演出を保証。
   *              スマートフォンから大画面まで、一貫した美しい冬の雪景の演出
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.sizeMultiplier = this.getSizeMultiplier();
  }

  /**
   * デバイスサイズ倍率の計算 - 画面サイズに応じた適切なスケーリング
   * 768pxを基準として画面サイズに応じた雪片のスケール倍率を算出
   * @returns {number} 0.6から1.2の範囲で制限されたサイズ倍率
   * @description モバイル端末では小さめの雪片、大画面では大きめの雪片で調整。
   *              どのデバイスでも美しい雪の演出を提供し、冬の静寂な美しさを最大化
   */
  getSizeMultiplier() {
    const ratio = window.innerWidth / 768;
    return Math.min(Math.max(ratio, 0.6), 1.2);
  }

  /**
   * 雪片オブジェクトの生成 - 本物の雪の結晶の美しさを再現
   * 日本の冬に特有の繊細で美しい雪片の物理的特性を総合的に表現
   * @param {boolean} randomY - Y座標をランダムに設定するかどうか（初期化時用）
   * @returns {Object} 雪片の物理プロパティを含むオブジェクト
   * @description 雪らしい穏やかな落下速度、繊細な回転動作、横方向への漂いなど、
   *              真の雪が持つ美しい特性をすべて再現したリアルな雪片オブジェクト
   */
  createFlake(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -20,
      size: (2 + Math.random() * 6) * this.sizeMultiplier, // レスポンシブな雪片サイズ
      speed: 0.5 + Math.random() * 1.5, // 雨よりも遅い穏やかな落下
      opacity: 0.4 + Math.random() * 0.6, // 雨よりも目立つ透明度
      drift: Math.random() * 0.5 - 0.25, // 左右への漂い動作
      rotationSpeed: (Math.random() - 0.5) * 2, // リアルさのための回転
      rotation: 0
    };
  }

  /**
   * 雪エフェクトのアニメーション処理 - 冬の静寂で美しい雪景の表現
   * 各フレームでの雪片の物理シミュレーションと描画を担当
   * @description 穏やかな風の変化、雪片の自然な落下など、
   *              真の雪の美しい動きを総合的に表現する高品質な冬の演出
   */
  animate() {
    if (!this._running || !this.canvas.parentNode) return;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 共有の風モデル更新（従来と同一パラメータ: interval=4000ms, ease=0.01, range=0.5）
    const { now } = this._tick ? this._tick() : { now: performance.now(), deltaSec: 0 };
    updateWind(this, now, { interval: 4000, ease: 0.01, range: 0.5 });

    // 各雪片の描画と物理シミュレーション
    for (const flake of this.flakes) {
      ctx.globalAlpha = flake.opacity;
      
      // 純白の雪にわずかな青味を加えた自然な雪色
      ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
      
      ctx.save();
      ctx.translate(flake.x, flake.y);
      ctx.rotate(flake.rotation);
      
      // 雪の結晶の形状描画 - サイズに応じて形状を変更
      if (flake.size > 4) {
        // 大きな雪片は美しい6角形の星形状で結晶を表現
        this.drawStar(ctx, 0, 0, flake.size / 2, flake.size / 4, 6);
      } else {
        // 小さな雪片はシンプルな円形で遠くの雪を表現
        ctx.beginPath();
        ctx.arc(0, 0, flake.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      
      ctx.restore();

      // 雪片の位置更新 - 風と自然な漂いによる動き
      flake.x += this.wind + flake.drift;
      flake.y += flake.speed;
      flake.rotation += flake.rotationSpeed * 0.02;

      // 画面の左右端での循環処理 - 連続した雪の演出
      if (flake.x < -20) flake.x = this.canvas.width + 20;
      if (flake.x > this.canvas.width + 20) flake.x = -20;

      // 画面下端に到達した雪片を画面上部でリセット
      if (flake.y > this.canvas.height + 20) {
        Object.assign(flake, this.createFlake());
      }
    }

    requestAnimationFrame(this.animate);
  }

  /**
   * 雪の結晶形状の描画 - 美しい6角形の星形状で雪の結晶を表現
   * より大きな雪片に対して精密な結晶形状を描画し、冬の美しさを強調
   * @param {CanvasRenderingContext2D} ctx - キャンバス描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} outerRadius - 外側の頂点までの距離
   * @param {number} innerRadius - 内側の頂点までの距離
   * @param {number} spikes - 結晶の角数（通常は6角形）
   * @description 本物の雪の結晶のような美しい幾何学形状を描画し、
   *              冬の静寂で神秘的な雪景の演出を最大化
   */
  drawStar(ctx, cx, cy, outerRadius, innerRadius, spikes) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * 雪エフェクトの破棄処理
   */
  destroy() {
    this._running = false;
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.remove();
    }
  }
}

/**
 * 雪エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 雪エフェクトの有効化/無効化
 * - インスタンスの適切な管理とメモリリーク防止
 * - 季節変更時のスムーズなエフェクト切り替え
 */
let snowEffect;
/**
 * 雪エフェクトを有効化
 */
window.enableSnow = function() {
  if (!snowEffect) {
    // 新しい雪エフェクトインスタンスを作成
    snowEffect = new SnowEffect();
    window.snowEffect = snowEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    snowEffect.canvas.style.display = '';
  }
};

/**
 * 雪エフェクトを無効化してリソースを解放
 */
window.disableSnow = function() {
  if (snowEffect) {
    snowEffect.destroy(); // インスタンスの破棄
    snowEffect = null; // インスタンスを破棄
    window.snowEffect = null; // グローバル参照もクリア
  }
};

/**
 * 雪エフェクト用CSSの動的注入
 * 雪のキャンバスのスタイルを動的に設定し、全画面に美しい雪の演出を提供
 * @description 固定位置でポインターイベントを無効化し、適切な透明度で冬の雪を表現
 */
const snowCSS = `
.snow-canvas {
  position: fixed;     /* 画面全体に固定 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* マウスイベントを通す */
  z-index: 1;          /* 背景の上、コンテンツの下 */
  opacity: 0.8;        /* 雪らしい穏やかな透明度 */
}
`;

// CSSスタイルの動的注入
injectStyleOnce('snow-effect-style', snowCSS);

/**
 * 紅葉エフェクトモジュール（秋季専用）
 * 
 * 機能:
 * - もみじとイチョウの落ち葉アニメーション
 * - リアルな葉の形状をCanvasで描画（ベジェ曲線使用）
 * - 風による自然な舞い散りと回転動作
 * - 季節の情緒を表現する適度な密度と色合い
 */
class AutumnLeavesEffect {
  /**
   * コンストラクタ - 秋の落ち葉エフェクトの初期化
   * もみじとイチョウの美しい紅葉シーンを再現するための設定と初期化
   */
  constructor() {
    // Canvas要素の作成と設定
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'autumn-leaves-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    // キャンバスサイズの設定
    this.resize();
    this.sizeMultiplier = this.getSizeMultiplier();
    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);

    // 落ち葉の初期化
    this.leaves = [];
    // 画面幅に基づく落ち葉の密度（やや少なめに調整）
    // factor を大きくして密度を下げ、上限も設けて過密を防止
    this.leafCount = computeDensity(window.innerWidth, 18, 8, 40);
    for (let i = 0; i < this.leafCount; i++) {
      this.leaves.push(this.createLeaf(true));
    }

    // 自然な落ち葉の動きのための風変数
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    // フレームレート非依存化のための deltaClock（視覚への影響なし）
    this._tick = createDeltaClock();
    this.animate = this.animate.bind(this);
    this._running = true;
    requestAnimationFrame(this.animate);
  }

  /**
   * キャンバスサイズのリサイズ処理 - ウィンドウサイズ変更への動的対応
   * ブラウザのリサイズ時にキャンバスをウィンドウ全体に合わせ、落ち葉のサイズ倍率を再計算
   * @description レスポンシブデザインに対応し、あらゆるデバイスで適切な秋の紅葉演出を保証。
   *              スマートフォンから大画面まで、一貫した美しい秋の情緒ある演出
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.sizeMultiplier = this.getSizeMultiplier();
  }

  /**
   * デバイスサイズ倍率の計算 - 画面サイズに応じた適切な落ち葉スケーリング
   * 768pxを基準として画面サイズに応じた落ち葉のスケール倍率を算出
   * @returns {number} 0.6から1.2の範囲で制限されたサイズ倍率
   * @description モバイル端末では小さめの落ち葉、大画面では大きめの落ち葉で調整。
   *              どのデバイスでも美しい秋の紅葉演出を提供し、日本の秋の情緒を最大化
   */
  getSizeMultiplier() {
    const ratio = window.innerWidth / 768;
    return Math.min(Math.max(ratio, 0.6), 1.2);
  }

  /**
   * 落ち葉オブジェクトの生成 - もみじとイチョウの美しい紅葉の表現
   * 日本の秋に特有の美しいもみじ（楓）とイチョウ（銀杏）の物理的特性を総合的に表現
   * @param {boolean} randomY - Y座標をランダムに設定するかどうか（初期化時用）
   * @returns {Object} 落ち葉の物理プロパティと視覚的特性を含むオブジェクト
   * @description 自然な落下速度、風による揺れ、回転動作、季節の色合いなど、
   *              真の紅葉が持つ美しい特性をすべて再現した情緒ある秋の落ち葉オブジェクト
   */
  createLeaf(randomY = false) {
    const leafTypes = ['maple', 'ginkgo']; // もみじとイチョウ - 日本の代表的な紅葉樹
    const type = leafTypes[Math.floor(Math.random() * leafTypes.length)];
    
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -50,
      type: type, // 葉の種類（もみじまたはイチョウ）
      size: (8 + Math.random() * 16) * this.sizeMultiplier, // レスポンシブな落ち葉サイズ
      speed: 0.8 + Math.random() * 1.2, // 自然な落下速度
      opacity: 0.6 + Math.random() * 0.4, // 十分な視認性
      drift: Math.random() * 1 - 0.5, // 左右への漂い動作
      rotationSpeed: (Math.random() - 0.5) * 3, // 回転運動
      rotation: Math.random() * Math.PI * 2, // 初期回転角
      swayAmplitude: 20 + Math.random() * 30, // 揺れの振幅
      swaySpeed: 0.02 + Math.random() * 0.03, // 揺れの速度
      swayOffset: Math.random() * Math.PI * 2, // 位相オフセット（多様な動きのため）
      color: this.getLeafColor(type) // 葉の種類に応じた季節の色彩
    };
  }

  /**
   * 葉の季節色取得 - もみじとイチョウの美しい秋色を再現
   * 日本の秋の紅葉で見られる自然な色合いをリアルに表現
   * @param {string} type - 葉の種類（'maple': もみじ, 'ginkgo': イチョウ）
   * @returns {Object} RGB値を持つ色オブジェクト
   * @description 各樹種の特徴的な紅葉色を精密に再現。もみじは赤〜オレンジ系、
   *              イチョウは黄色〜金色系で、日本の秋の美しい自然色を完全表現
   */
  getLeafColor(type) {
    if (type === 'maple') {
      // もみじ（楓）の色 - 深い赤から鮮やかなオレンジまでの紅葉色
      const colors = [
        { r: 200, g: 30, b: 30 },   // 深い赤（深紅）
        { r: 220, g: 20, b: 60 },   // クリムゾン（紅色）
        { r: 255, g: 69, b: 0 },    // オレンジ赤（朱色）
        { r: 255, g: 120, b: 0 },   // 鮮やかなオレンジ
        { r: 255, g: 160, b: 0 }    // 明るいオレンジ
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    } else {
      // イチョウ（銀杏）の色 - 金色から薄黄色までの美しい黄葉色
      const colors = [
        { r: 255, g: 215, b: 0 },   // 金色（きんいろ）
        { r: 255, g: 223, b: 0 },   // 明るい金色
        { r: 255, g: 255, b: 0 },   // 純黄色
        { r: 238, g: 221, b: 130 }, // 薄い黄色
        { r: 255, g: 239, b: 145 }  // クリーム色
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }
  }

  /**
   * 紅葉エフェクトのアニメーション処理 - 秋の情緒ある紅葉景の表現
   * 各フレームでの落ち葉の物理シミュレーションと精密な描画を担当
   * @description 秋風の変化、落ち葉の自然な舞いなど、
   *              もみじとイチョウの美しい舞い散りを総合的に表現する高品質な秋の演出
   */
  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 共有の風モデル更新（従来と同一パラメータ: interval=3500ms, ease=0.015, range=1.5）
    const { now } = this._tick ? this._tick() : { now: performance.now(), deltaSec: 0 };
    updateWind(this, now, { interval: 3500, ease: 0.015, range: 1.5 });

    // 各落ち葉の描画と物理シミュレーション
    for (const leaf of this.leaves) {
      ctx.globalAlpha = leaf.opacity;
      
      const time = now * 0.001; // ミリ秒を秒に変換（_tickのnowを使用）
      const swayX = Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude;
      
      ctx.save();
      ctx.translate(leaf.x + swayX, leaf.y);
      ctx.rotate(leaf.rotation);
      
      // 葉の季節色設定 - 秋の美しい紅葉色
      const { r, g, b } = leaf.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${leaf.opacity})`;
      
      // 葉の種類に応じた形状描画 - もみじとイチョウの特徴的な形状
      if (leaf.type === 'maple') {
        this.drawMapleLeaf(ctx, 0, 0, leaf.size); // もみじの手のひら形状
      } else {
        this.drawGinkgoLeaf(ctx, 0, 0, leaf.size); // イチョウの扇形状
      }
      
      ctx.restore();

      // 落ち葉の位置更新 - 風と自然な漂いによる動き
      leaf.x += this.wind + leaf.drift;
      leaf.y += leaf.speed;
      leaf.rotation += leaf.rotationSpeed * 0.02;

      // 画面の左右端での循環処理 - 連続した紅葉の演出
      if (leaf.x < -50) leaf.x = this.canvas.width + 50;
      if (leaf.x > this.canvas.width + 50) leaf.x = -50;

      // 画面下端に到達した落ち葉を画面上部でリセット
      if (leaf.y > this.canvas.height + 50) {
        Object.assign(leaf, this.createLeaf());
      }
    }

    requestAnimationFrame(this.animate);
  }

  /**
   * もみじ（楓）の葉形描画 - 日本の秋を代表する美しい手のひら形状
   * もみじの特徴的な5裂の手のひら形状を精密に描画し、秋の情緒を表現
   * @param {CanvasRenderingContext2D} ctx - キャンバス描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} size - 葉のサイズ
   * @description 本物のもみじの葉のような美しい幾何学形状を描画し、
   *              日本の秋の伝統的な美しさを表現する紅葉のシンボル
   */
  drawMapleLeaf(ctx, cx, cy, size) {
    const s = size / 15;

    ctx.beginPath();
    ctx.moveTo(cx, cy - 9 * s);
    ctx.lineTo(cx - 2 * s, cy - 6 * s);
    ctx.lineTo(cx - 7 * s, cy - 8 * s);
    ctx.lineTo(cx - 4 * s, cy - 3 * s);
    ctx.lineTo(cx - 9 * s, cy - 2 * s);
    ctx.lineTo(cx - 5 * s, cy + 1 * s);
    ctx.lineTo(cx - 7 * s, cy + 6 * s);
    ctx.lineTo(cx, cy + 3 * s);
    ctx.lineTo(cx + 7 * s, cy + 6 * s);
    ctx.lineTo(cx + 5 * s, cy + 1 * s);
    ctx.lineTo(cx + 9 * s, cy - 2 * s);
    ctx.lineTo(cx + 4 * s, cy - 3 * s);
    ctx.lineTo(cx + 7 * s, cy - 8 * s);
    ctx.lineTo(cx + 2 * s, cy - 6 * s);
    ctx.closePath();
    ctx.fill();
  }

  /**
   * イチョウ（銀杏）の葉形描画 - 秋の黄金色の美しい扇形状
   * イチョウの特徴的な扇形と中央の切り込みを精密に描画し、秋の黄葉を表現
   * @param {CanvasRenderingContext2D} ctx - キャンバス描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} size - 葉のサイズ
   * @description 本物のイチョウの葉のような美しい扇形状と特徴的な切り込みを描画し、
   *              日本の秋の黄金色の美しさを表現する黄葉のシンボル
   */
  drawGinkgoLeaf(ctx, cx, cy, size) {
    const scale = size / 20;
    
    ctx.beginPath();

    // Soft fan-shaped ginkgo leaf
    ctx.moveTo(cx, cy + 8 * scale);
    ctx.quadraticCurveTo(cx - 8 * scale, cy + 6 * scale, cx - 8 * scale, cy);
    ctx.quadraticCurveTo(cx - 8 * scale, cy - 6 * scale, cx, cy - 8 * scale);
    ctx.quadraticCurveTo(cx + 8 * scale, cy - 6 * scale, cx + 8 * scale, cy);
    ctx.quadraticCurveTo(cx + 8 * scale, cy + 6 * scale, cx, cy + 8 * scale);
    ctx.closePath();
    ctx.fill();

    // Characteristic notch at the center
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(cx - 2 * scale, cy - 2 * scale, cx, cy - 4 * scale);
    ctx.quadraticCurveTo(cx + 2 * scale, cy - 2 * scale, cx, cy);
    ctx.closePath();
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * 紅葉エフェクトの破棄処理
   */
  destroy() {
    this._running = false;
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.remove();
    }
  }
}

/**
 * 紅葉エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 秋の紅葉エフェクトの有効化/無効化
 * - もみじとイチョウの美しい落ち葉アニメーション制御
 * - メモリリークを防止する適切なリソース管理
 */
let autumnLeavesEffect;
/**
 * 紅葉エフェクトを有効化
 */
window.enableAutumnLeaves = function() {
  if (!autumnLeavesEffect) {
    // 新しい紅葉エフェクトインスタンスを作成
    autumnLeavesEffect = new AutumnLeavesEffect();
    window.autumnLeavesEffect = autumnLeavesEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    autumnLeavesEffect.canvas.style.display = '';
  }
};

/**
 * 紅葉エフェクトを無効化してリソースを解放
 */
window.disableAutumnLeaves = function() {
  if (autumnLeavesEffect) {
    autumnLeavesEffect.destroy(); // インスタンスの破棄
    autumnLeavesEffect = null; // インスタンスを破棄
    window.autumnLeavesEffect = null; // グローバル参照もクリア
  }
};

/**
 * 紅葉エフェクト用CSSの動的注入
 * 秋の落ち葉のキャンバスのスタイルを動的に設定し、全画面に美しい紅葉の演出を提供
 * @description 固定位置でポインターイベントを無効化し、秋の情緒を表現する透明度を設定
 */
const autumnLeavesCSS = `
.autumn-leaves-canvas {
  position: fixed;     /* 画面全体に固定 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* マウスイベントを通す */
  z-index: 1;          /* 背景の上、コンテンツの下 */
  opacity: 0.9;        /* 紅葉らしいやや高めの透明度 */
}
`;

// CSSスタイルの動的注入
injectStyleOnce('autumn-leaves-effect-style', autumnLeavesCSS);

/**
 * 夏の柳エフェクトモジュール（青柳エフェクト）
 * 
 * 機能:
 * - 青々とした柳の葉が風にそよぐアニメーション
 * - 細長い柳の葉の形状を精密に描画
 * - 夏の風による大きな揺れと流れるような動き
 * - 夏の涼しさを表現する緑のグラデーションと清涼感
 */
class SummerWillowEffect {
  /**
   * コンストラクタ - 夏の柳エフェクトの初期化
   * 青々とした柳の葉が風にそよぐ美しい夏の情景を再現するための設定と初期化
   * @description 日本の夏の涼しげと流れるような柳の葉の動きを表現し、
   *              涼風を感じる夏の美しい情景をつくり出す。細長い柳葉の特徴を生かした豊かなアニメーション
   */
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'summer-willow-canvas';
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.resize();
    this._onResize = this.resize.bind(this);
    window.addEventListener('resize', this._onResize);

    this.willowLeaves = [];
    // 柳葉の密度（共有関数に置換）- 繊細で流れるような夏の表現
    this.leafCount = computeDensity(window.innerWidth, 10); // 適度な密度で涼しげを表現
    for (let i = 0; i < this.leafCount; i++) {
      this.willowLeaves.push(this.createWillowLeaf(true));
    }

    // 穏やかな夏風のための風変数 - 涼風の表現
    this.wind = 0;
    this.windTarget = 0;
    this.lastWindChange = performance.now();
    // フレームレート非依存化のための deltaClock（視覚への影響なし）
    this._tick = createDeltaClock();
    this.animate = this.animate.bind(this);
    this._running = true;
    requestAnimationFrame(this.animate);
  }

  /**
   * キャンバスサイズのリサイズ処理 - ウィンドウサイズ変更への動的対応
   * ブラウザのリサイズ時にキャンバスをウィンドウ全体に合わせ、柳葉の流れるような動きを保持
   * @description レスポンシブデザインに対応し、あらゆるデバイスで適切な夏の柳演出を保証。
   *              スマートフォンから大画面まで、一貫した涼しげのある夏の情景演出
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * 柳葉オブジェクトの生成 - 細長い柳葉の美しい流れる動きを表現
   * 日本の夏に特有の柳の葉の物理的特性と美しい動きを総合的に表現
   * @param {boolean} randomY - Y座標をランダムに設定するかどうか（初期化時用）
   * @returns {Object} 柳葉の物理プロパティと視覚的特性を含むオブジェクト
   * @description 柳らしい細長い形状、風に大きく反応する性質、涼しげを表現する青緑色など、
   *              真の柳葉が持つ美しい特性をすべて再現した夏らしい柳葉オブジェクト
   */
  createWillowLeaf(randomY = false) {
    return {
      x: Math.random() * this.canvas.width,
      y: randomY ? Math.random() * this.canvas.height : -30,
      length: 15 + Math.random() * 25, // 柳葉の特徴的な細長い形状
      width: 3 + Math.random() * 4, // 他の葉よりも非常に細い
      speed: 0.4 + Math.random() * 0.8, // 水平方向の動きを強調するためのゲっくりした落下
      opacity: 0.5 + Math.random() * 0.4, // 控えめな視認性
      drift: Math.random() * 2 - 1, // 左右への動きを強化
      rotationSpeed: (Math.random() - 0.5) * 2.5, // よりダイナミックな回転
      rotation: Math.random() * Math.PI * 2, // 初期回転角
      swayAmplitude: 50 + Math.random() * 60, // 非常に目立つ揺れ
      swaySpeed: 0.02 + Math.random() * 0.025, // わずかに速い揺れ
      swayOffset: Math.random() * Math.PI * 2, // 位相オフセット
      curvature: 0.1 + Math.random() * 0.3, // 柳葉の自然な曲線
      windResistance: 0.3 + Math.random() * 0.7, // 葉が風に反応する程度
      turbulence: Math.random() * 0.5, // ランダムな乱流要素
      color: this.getWillowColor() // 夏らしい青緑色
    };
  }

  /**
   * 柳葉の夏色取得 - 青柳の涼しげある美しい青緑色を再現
   * 日本の夏の柳で見られる涼しげを表現する自然な青緑色をリアルに表現
   * @returns {Object} RGB値を持つ色オブジェクト
   * @description 青柳（あおやのぎ）の特徴的な緑色を精密に再現。深い緑から新緑まで、
   *              青緑色を含む幅広い色合いで、夏の涼しげと柳の美しい自然色を完全表現
   */
  getWillowColor() {
    // 青柳 - 青みを含んだ様々な緑の陰影で涼しげを表現
    const colors = [
      { r: 50, g: 150, b: 50 },   // 深い緑（深緑）
      { r: 60, g: 180, b: 60 },   // 明るい緑（明緑）
      { r: 40, g: 140, b: 80 },   // 青緑（清涼な青緑）
      { r: 70, g: 160, b: 70 },   // 柔らかい緑
      { r: 80, g: 200, b: 80 },   // 新緑（若葉色）
      { r: 45, g: 130, b: 90 },   // 深い青緑
      { r: 90, g: 190, b: 90 }    // 薄い緑（淡緑）
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /**
   * 夏の柳エフェクトのアニメーション処理 - 涼しげのある夏の柳景の表現
   * 各フレームでの柳葉の物理シミュレーションと流らかな描画を担当
   * @description 夏風の変化、柳葉の美しい流れなど、
   *              青柳の美しいそよぎを総合的に表現する高品質な夏の演出
   */
  animate() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 共有の風モデル更新（従来と同一パラメータ: interval=3000ms, ease=0.02, range=3.5）
    const { now } = this._tick ? this._tick() : { now: performance.now(), deltaSec: 0 };
    updateWind(this, now, { interval: 3000, ease: 0.02, range: 3.5 });

    // 各柳葉の描画と物理シミュレーション
    for (const leaf of this.willowLeaves) {
      ctx.globalAlpha = leaf.opacity;
      
      const time = now * 0.001; // ミリ秒を秒に変換
      const swayX = Math.sin(time * leaf.swaySpeed + leaf.swayOffset) * leaf.swayAmplitude;
      
      ctx.save();
      ctx.translate(leaf.x + swayX, leaf.y);
      
      // 風の影響を受けた回転 - 葉が風の方向に傾く
      const windTilt = this.wind * 0.1;
      ctx.rotate(leaf.rotation + windTilt);
      
      // 柳葉の夏色設定 - 涼しげのある青緑色
      const { r, g, b } = leaf.color;
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${leaf.opacity})`;
      ctx.strokeStyle = `rgba(${r - 20}, ${g - 20}, ${b - 10}, ${leaf.opacity * 0.8})`;
      ctx.lineWidth = 0.5;
      
      // 柳葉の描画 - 長く、細く、わずかに曲がった特徴的な形状
      this.drawWillowLeaf(ctx, 0, 0, leaf.length, leaf.width, leaf.curvature);
      
      ctx.restore();

      // 柳葉の位置更新 - 風に吹かれる動き
      const windForce = this.wind * leaf.windResistance;
      const turbulenceX = Math.sin(now * 0.001 * leaf.turbulence) * 0.5;
      const turbulenceY = Math.cos(now * 0.0015 * leaf.turbulence) * 0.3;
      
      leaf.x += windForce + leaf.drift + turbulenceX;
      leaf.y += leaf.speed + Math.abs(windForce) * 0.1 + turbulenceY; // 風は垂直方向の動きにも影響
      leaf.rotation += leaf.rotationSpeed * 0.02 + Math.abs(windForce) * 0.01; // 風は回転にも影響

      // 画面の左右端での循環処理 - 連続した柳の演出
      if (leaf.x < -60) leaf.x = this.canvas.width + 60;
      if (leaf.x > this.canvas.width + 60) leaf.x = -60;

      // 画面下端に到達した柳葉を画面上部でリセット
      if (leaf.y > this.canvas.height + 60) {
        Object.assign(leaf, this.createWillowLeaf());
      }
    }

    requestAnimationFrame(this.animate);
  }

  /**
   * 柳葉形状の描画 - 細長い柳葉の美しい曲線を表現
   * 青柳の特徴的な細長い形状と自然な曲線を精密に描画し、夏の涼しげを表現
   * @param {CanvasRenderingContext2D} ctx - キャンバス描画コンテキスト
   * @param {number} cx - 中心X座標
   * @param {number} cy - 中心Y座標
   * @param {number} length - 葉の長さ
   * @param {number} width - 葉の幅
   * @param {number} curvature - 葉の曲がり具合
   * @description 本物の柳葉のような美しい細長い形状と特徴的な中央線を描画し、
   *              日本の夏の涼しげと柳の美しさを表現する青緑色のシンボル
   */
  drawWillowLeaf(ctx, cx, cy, length, width, curvature) {
    ctx.beginPath();
    
    // 曲線的で細長い葉の形状を作成
    const halfLength = length / 2;
    const halfWidth = width / 2;
    
    // 曲線的な柳葉の制御点
    ctx.moveTo(cx, cy - halfLength);
    
    // 右側の曲線 - 柳葉の自然な曲がりを表現
    ctx.quadraticCurveTo(
      cx + halfWidth + curvature * 10, cy - halfLength * 0.3,
      cx + halfWidth, cy
    );
    ctx.quadraticCurveTo(
      cx + halfWidth - curvature * 5, cy + halfLength * 0.3,
      cx, cy + halfLength
    );
    
    // 左側の曲線 - 対称的で美しい柳葉の形状
    ctx.quadraticCurveTo(
      cx - halfWidth + curvature * 5, cy + halfLength * 0.3,
      cx - halfWidth, cy
    );
    ctx.quadraticCurveTo(
      cx - halfWidth - curvature * 10, cy - halfLength * 0.3,
      cx, cy - halfLength
    );
    
    ctx.closePath();
    ctx.fill();
    
    // リアルさのための微細な中央線描画
    ctx.beginPath();
    ctx.moveTo(cx, cy - halfLength * 0.8);
    ctx.quadraticCurveTo(
      cx + curvature * 3, cy,
      cx, cy + halfLength * 0.8
    );
    ctx.stroke();
  }

  /**
   * 夏の柳エフェクトの破棄処理
   */
  destroy() {
    this._running = false;
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.remove();
    }
  }
}

/**
 * 夏の柳エフェクトのグローバル制御関数
 * 
 * 機能:
 * - 夏の青柳エフェクトの有効化/無効化
 * - 風にそよぐ柳の葉の美しいアニメーション制御
 * - 夏の涼しさを表現する緑のエフェクト管理
 */
let summerWillowEffect;
/**
 * 夏の柳エフェクトを有効化
 */
window.enableSummerWillow = function() {
  if (!summerWillowEffect) {
    // 新しい夏柳エフェクトインスタンスを作成
    summerWillowEffect = new SummerWillowEffect();
    window.summerWillowEffect = summerWillowEffect; // グローバルアクセス用
  } else {
    // 既存インスタンスの表示を復元
    summerWillowEffect.canvas.style.display = '';
  }
};

/**
 * 夏の柳エフェクトを無効化してリソースを解放
 */
window.disableSummerWillow = function() {
  if (summerWillowEffect) {
    summerWillowEffect.destroy(); // インスタンスの破棄
    summerWillowEffect = null; // インスタンスを破棄
    window.summerWillowEffect = null; // グローバル参照もクリア
  }
};

/**
 * 夏の柳エフェクト用CSSの動的注入
 * 夏の柳葉のキャンバスのスタイルを動的に設定し、全画面に涼しげのある柳の演出を提供
 * @description 固定位置でポインターイベントを無効化し、夏の涼しげを表現する透明度を設定
 */
const summerWillowCSS = `
.summer-willow-canvas {
  position: fixed;     /* 画面全体に固定 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* マウスイベントを通す */
  z-index: 1;          /* 背景の上、コンテンツの下 */
  opacity: 0.85;       /* 柳らしい涼しげのある透明度 */
}
`;

// CSSスタイルの動的注入
injectStyleOnce('summer-willow-effect-style', summerWillowCSS);