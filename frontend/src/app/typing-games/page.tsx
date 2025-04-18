'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './typing-games.module.css';

export default function TypingGames() {
  const [gameMode, setGameMode] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>タイピングゲーム</h1>
      
      {!gameMode ? (
        <div className={styles.selection}>
          <h2>ゲームモードを選択</h2>
          <div className={styles.options}>
            <button 
              className={styles.option} 
              onClick={() => setGameMode('practice')}
            >
              <h3>練習モード</h3>
              <p>時間制限なしで練習できます</p>
            </button>
            <button 
              className={styles.option} 
              onClick={() => setGameMode('timed')}
            >
              <h3>タイムアタック</h3>
              <p>制限時間内にどれだけ入力できるか挑戦</p>
            </button>
            <button 
              className={styles.option} 
              onClick={() => setGameMode('bet')}
            >
              <h3>ベットモード</h3>
              <p>ポイントを賭けて他のプレイヤーと対戦</p>
            </button>
          </div>
        </div>
      ) : !difficulty && gameMode !== 'bet' ? (
        <div className={styles.selection}>
          <h2>難易度を選択</h2>
          <div className={styles.options}>
            <button 
              className={styles.option} 
              onClick={() => setDifficulty('easy')}
            >
              <h3>初級</h3>
              <p>基本的な単語と短い文章</p>
            </button>
            <button 
              className={styles.option} 
              onClick={() => setDifficulty('medium')}
            >
              <h3>中級</h3>
              <p>一般的な単語と中程度の文章</p>
            </button>
            <button 
              className={styles.option} 
              onClick={() => setDifficulty('hard')}
            >
              <h3>上級</h3>
              <p>難しい単語と長い文章</p>
            </button>
          </div>
          <button 
            className={styles.backButton}
            onClick={() => setGameMode(null)}
          >
            戻る
          </button>
        </div>
      ) : gameMode === 'bet' ? (
        <div className={styles.betMode}>
          <h2>ベットモード</h2>
          <div className={styles.betOptions}>
            <div className={styles.roomList}>
              <h3>参加可能な対戦ルーム</h3>
              <div className={styles.room}>
                <span>ルーム#1</span>
                <span>参加者: 2/4</span>
                <span>ベット額: 100pt</span>
                <button className={styles.joinButton}>参加する</button>
              </div>
              <div className={styles.room}>
                <span>ルーム#2</span>
                <span>参加者: 1/4</span>
                <span>ベット額: 250pt</span>
                <button className={styles.joinButton}>参加する</button>
              </div>
            </div>
            <div className={styles.createRoom}>
              <h3>新しいルームを作成</h3>
              <button className={styles.createButton}>ルーム作成</button>
            </div>
          </div>
          <button 
            className={styles.backButton}
            onClick={() => setGameMode(null)}
          >
            戻る
          </button>
        </div>
      ) : (
        <div className={styles.gameContainer}>
          <h2>{gameMode === 'practice' ? '練習モード' : 'タイムアタック'} - {
            difficulty === 'easy' ? '初級' : 
            difficulty === 'medium' ? '中級' : '上級'
          }</h2>
          <div className={styles.gameInterface}>
            <div className={styles.gameStats}>
              <div>
                <span>スコア:</span>
                <span>0</span>
              </div>
              <div>
                <span>時間:</span>
                <span>{gameMode === 'timed' ? '60' : '--'}</span>
              </div>
              <div>
                <span>精度:</span>
                <span>100%</span>
              </div>
            </div>
            <div className={styles.textDisplay}>
              <p className={styles.targetText}>ここにタイプする文章が表示されます。ゲームが開始されると文章が表示されます。</p>
              <input 
                type="text" 
                className={styles.inputField} 
                placeholder="入力を開始してください..."
              />
            </div>
            <div className={styles.controls}>
              <button className={styles.startButton}>開始</button>
              <button 
                className={styles.backButton}
                onClick={() => {
                  setDifficulty(null);
                  setGameMode(null);
                }}
              >
                メニューに戻る
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Link href="/" className={styles.homeLink}>
        ホームに戻る
      </Link>
    </main>
  );
} 