'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import { getRandomPracticeText, getRandomTimeAttackText } from './data';

export default function TypingGame() {
  const [gameMode, setGameMode] = useState<'practice' | 'timeAttack' | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [currentText, setCurrentText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(60); // 60秒
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const selectMode = (mode: 'practice' | 'timeAttack') => {
    setGameMode(mode);
    resetGame();
    
    if (mode === 'timeAttack') {
      setCurrentText(getRandomTimeAttackText());
      setDifficulty(null);
    }
  };

  const selectDifficulty = (level: 'easy' | 'medium' | 'hard') => {
    setDifficulty(level);
    const text = getRandomPracticeText(level);
    setCurrentText(text.text);
  };

  const startGame = () => {
    setGameStarted(true);
    setIsGameActive(true);
    setUserInput('');
    setTotalKeystrokes(0);
    
    if (gameMode === 'timeAttack') {
      intervalRef.current = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            endGame();
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const resetGame = () => {
    setUserInput('');
    setTimer(60);
    setGameStarted(false);
    setGameFinished(false);
    setIsGameActive(false);
    setScore(0);
    setAccuracy(0);
    setTypingSpeed(0);
    setTotalKeystrokes(0);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const endGame = () => {
    setIsGameActive(false);
    setGameFinished(true);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // 精度を計算
    const correctCharacters = currentText.split('').filter((char, index) => 
      userInput.length > index && userInput[index] === char
    ).length;
    
    const typedCharacters = userInput.length;
    const calculatedAccuracy = typedCharacters > 0 
      ? Math.round((correctCharacters / typedCharacters) * 100) 
      : 0;
    
    // タイピング速度（1分あたりの文字数）
    const elapsedTime = gameMode === 'timeAttack' 
      ? 60 - timer 
      : (userInput.length / currentText.length) * 60;
    
    const calculatedSpeed = elapsedTime > 0 
      ? Math.round((correctCharacters / elapsedTime) * 60) 
      : 0;
    
    setAccuracy(calculatedAccuracy);
    setTypingSpeed(calculatedSpeed);
    setScore(correctCharacters);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);
    setTotalKeystrokes(prev => prev + 1);
    
    // プラクティスモードの場合、テキストが完了したらゲーム終了
    if (gameMode === 'practice' && value === currentText) {
      endGame();
    }
  };

  const backToModeSelection = () => {
    setGameMode(null);
    resetGame();
  };

  const startNewGame = () => {
    if (gameMode === 'practice') {
      if (difficulty) {
        const text = getRandomPracticeText(difficulty);
        setCurrentText(text.text);
      }
    } else {
      setCurrentText(getRandomTimeAttackText());
    }
    resetGame();
  };

  // ゲーム終了時のクリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // テキスト表示用の関数（正確なタイプとミスタイプを区別）
  const renderText = () => {
    return currentText.split('').map((char, index) => {
      let className;
      if (index < userInput.length) {
        className = userInput[index] === char ? styles.correct : styles.incorrect;
      } else if (index === userInput.length) {
        className = styles.current;
      } else {
        className = '';
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>タイピングゲーム</h1>

      {!gameMode && (
        <div className={styles.modeSelection}>
          <h2>モードを選択してください</h2>
          <div className={styles.modes}>
            <button 
              className={styles.modeButton} 
              onClick={() => selectMode('practice')}
            >
              練習モード
            </button>
            <button 
              className={styles.modeButton} 
              onClick={() => selectMode('timeAttack')}
            >
              タイムアタック
            </button>
          </div>
        </div>
      )}

      {gameMode === 'practice' && !difficulty && (
        <div className={styles.modeSelection}>
          <h2>難易度を選択してください</h2>
          <button onClick={() => backToModeSelection()} className={styles.backButton}>
            戻る
          </button>
          <div className={styles.modes}>
            <button 
              className={styles.modeButton} 
              onClick={() => selectDifficulty('easy')}
            >
              簡単
            </button>
            <button 
              className={styles.modeButton} 
              onClick={() => selectDifficulty('medium')}
            >
              普通
            </button>
            <button 
              className={styles.modeButton} 
              onClick={() => selectDifficulty('hard')}
            >
              難しい
            </button>
          </div>
        </div>
      )}

      {((gameMode === 'practice' && difficulty) || gameMode === 'timeAttack') && (
        <div className={styles.gameContainer}>
          <h2 className={styles.gameTitle}>
            {gameMode === 'practice' ? '練習モード' : 'タイムアタック'}
            {gameMode === 'practice' && difficulty && ` - ${
              difficulty === 'easy' ? '簡単' : 
              difficulty === 'medium' ? '普通' : 
              '難しい'
            }`}
          </h2>
          
          <button onClick={() => backToModeSelection()} className={styles.backButton}>
            モード選択に戻る
          </button>
          
          {gameMode === 'timeAttack' && (
            <div className={styles.timer}>残り時間: {timer}秒</div>
          )}
          
          {!gameStarted && !gameFinished && (
            <button onClick={startGame} className={styles.startButton}>
              ゲーム開始
            </button>
          )}
          
          {isGameActive && (
            <>
              <div className={styles.textDisplay}>
                {renderText()}
              </div>
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className={styles.inputField}
                disabled={!isGameActive}
                autoComplete="off"
              />
            </>
          )}
          
          {gameFinished && (
            <div className={styles.results}>
              <h3>結果</h3>
              <p>スコア: {score}文字</p>
              <p>正確性: {accuracy}%</p>
              <p>タイピング速度: {typingSpeed} CPM (文字/分)</p>
              <p>総キーストローク: {totalKeystrokes}</p>
              <button onClick={startNewGame} className={styles.startButton}>
                もう一度プレイ
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className={styles.comingSoon}>
        <h3>今後の追加予定機能</h3>
        <p>- オンラインランキング</p>
        <p>- カスタムテキスト入力</p>
        <p>- 進捗の保存</p>
      </div>
    </div>
  );
} 