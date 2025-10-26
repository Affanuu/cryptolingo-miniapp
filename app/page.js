'use client'

import React, { useState, useEffect } from 'react';
import { Coins, Heart, Trophy, Zap, Share2, Lightbulb, RotateCcw, Play } from 'lucide-react';

// Word bank organized by difficulty
const WORD_BANK = {
  easy: [
    { word: 'BITCOIN', hint: 'First cryptocurrency' },
    { word: 'ETHEREUM', hint: 'Smart contract platform' },
    { word: 'WALLET', hint: 'Store your crypto here' },
    { word: 'TOKEN', hint: 'Digital asset' },
    { word: 'MINING', hint: 'Creating new blocks' },
    { word: 'DEFI', hint: 'Decentralized finance' },
    { word: 'NFT', hint: 'Non-fungible token' },
    { word: 'DAO', hint: 'Decentralized organization' },
  ],
  medium: [
    { word: 'BLOCKCHAIN', hint: 'Distributed ledger' },
    { word: 'STAKING', hint: 'Earn rewards by locking tokens' },
    { word: 'PROTOCOL', hint: 'Set of rules' },
    { word: 'SMARTCONTRACT', hint: 'Self-executing code' },
    { word: 'GASFEE', hint: 'Transaction cost' },
    { word: 'VALIDATOR', hint: 'Verifies transactions' },
    { word: 'CONSENSUS', hint: 'Agreement mechanism' },
    { word: 'LIQUIDITY', hint: 'Asset availability' },
  ],
  hard: [
    { word: 'MERKLETREE', hint: 'Data structure for verification' },
    { word: 'ZEROKNOWLEDGE', hint: 'Prove without revealing' },
    { word: 'LAYERTWO', hint: 'Scaling solution' },
    { word: 'SHARDING', hint: 'Database partitioning' },
    { word: 'CROSSCHAIN', hint: 'Interoperability between chains' },
    { word: 'ORACLE', hint: 'Brings external data onchain' },
    { word: 'GOVERNANCE', hint: 'Decision-making process' },
    { word: 'SLASHING', hint: 'Penalty for misbehavior' },
  ],
};

const POINTS = { easy: 50, medium: 100, hard: 200 };
const LEVEL_UP_THRESHOLD = 500;

export default function CryptoLingoGame() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, won, lost, gameover
  const [lives, setLives] = useState(5);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [difficulty, setDifficulty] = useState('easy');
  const [currentWord, setCurrentWord] = useState(null);
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState(''); // 'hint', 'continue', 'share'
  const [revealedHint, setRevealedHint] = useState('');
  const [wordsCompleted, setWordsCompleted] = useState(0);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Start new game
  const startGame = () => {
    const words = WORD_BANK[difficulty];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setCurrentWord(randomWord);
    setGuessedLetters([]);
    setGameState('playing');
    setRevealedHint('');
  };

  // Handle letter guess
  const handleGuess = (letter) => {
    if (guessedLetters.includes(letter) || gameState !== 'playing') return;

    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);

    // Check if letter is in word
    if (!currentWord.word.includes(letter)) {
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives === 0) {
        setGameState('gameover');
      }
    } else {
      // Check if word is complete
      const wordComplete = currentWord.word.split('').every(l => 
        newGuessedLetters.includes(l)
      );
      
      if (wordComplete) {
        const points = POINTS[difficulty];
        const newScore = score + points;
        setScore(newScore);
        setWordsCompleted(wordsCompleted + 1);
        
        // Check for level up
        if (Math.floor(newScore / LEVEL_UP_THRESHOLD) > level - 1) {
          setLevel(level + 1);
          // Increase difficulty as level increases
          if (level % 3 === 0 && difficulty === 'easy') setDifficulty('medium');
          if (level % 6 === 0 && difficulty === 'medium') setDifficulty('hard');
        }
        
        setGameState('won');
      }
    }
  };

  // Continue to next word
  const nextWord = () => {
    startGame();
  };

  // Restart game
  const restartGame = () => {
    setLives(5);
    setScore(0);
    setLevel(1);
    setDifficulty('easy');
    setWordsCompleted(0);
    setGameState('menu');
  };

  // Connect wallet (simulated)
  const connectWallet = () => {
    setIsWalletConnected(true);
  };

  // Handle payment
  const handlePayment = (type) => {
    setPaymentType(type);
    setShowPaymentModal(true);
  };

  // Process payment (simulated)
  const processPayment = () => {
    setShowPaymentModal(false);
    
    if (paymentType === 'hint') {
      // Reveal a random unguessed letter
      const unguessedLetters = currentWord.word.split('')
        .filter(l => !guessedLetters.includes(l));
      if (unguessedLetters.length > 0) {
        const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        setGuessedLetters([...guessedLetters, randomLetter]);
        setRevealedHint(`💡 Revealed: ${randomLetter}`);
        setTimeout(() => setRevealedHint(''), 2000);
      }
    } else if (paymentType === 'continue') {
      setLives(5);
      setGameState('playing');
    } else if (paymentType === 'share') {
      // Simulate sharing to Farcaster
      const shareText = `🎮 I reached Level ${level} in CryptoLingo with ${score} points! Can you beat my score? 🚀`;
      alert(`Shared to Farcaster: ${shareText}`);
    }
  };

  // Display word with guessed letters
  const displayWord = () => {
    if (!currentWord) return '';
    return currentWord.word.split('').map((letter, i) => (
      <span
        key={i}
        className={`inline-block w-8 h-10 mx-1 border-b-4 text-2xl font-bold text-center leading-10 transition-all duration-300 ${
          guessedLetters.includes(letter) 
            ? 'border-purple-500 text-white scale-110' 
            : 'border-gray-600 text-transparent'
        }`}
      >
        {letter}
      </span>
    ));
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-500/20">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Coins className="w-20 h-20 text-purple-400 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CryptoLingo
            </h1>
            <p className="text-gray-300 text-lg">
              Guess crypto words and level up! 🚀
            </p>
            
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-xl p-4 text-left">
                <h3 className="text-purple-400 font-semibold mb-2">How to Play:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Guess letters to reveal crypto words</li>
                  <li>• 5 lives per game</li>
                  <li>• Earn points and level up</li>
                  <li>• Use hints or continue playing with ETH</li>
                </ul>
              </div>
              
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h3 className="text-blue-400 font-semibold mb-2">Points System:</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="bg-green-500/20 rounded-lg p-2">
                    <div className="text-green-400 font-bold">Easy</div>
                    <div className="text-gray-300">50 pts</div>
                  </div>
                  <div className="bg-yellow-500/20 rounded-lg p-2">
                    <div className="text-yellow-400 font-bold">Medium</div>
                    <div className="text-gray-300">100 pts</div>
                  </div>
                  <div className="bg-red-500/20 rounded-lg p-2">
                    <div className="text-red-400 font-bold">Hard</div>
                    <div className="text-gray-300">200 pts</div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Play className="w-6 h-6" />
              Start Game
            </button>

            {!isWalletConnected && (
              <button
                onClick={connectWallet}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-gray-600"
              >
                Connect Wallet
              </button>
            )}

            {isWalletConnected && (
              <div className="text-green-400 text-sm flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                Wallet Connected
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Stats */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 mb-4 border border-purple-500/20">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-1 text-red-400 mb-1">
                  <Heart className="w-5 h-5" />
                  <span className="font-bold text-lg">{lives}</span>
                </div>
                <div className="text-gray-400 text-xs">Lives</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                  <Coins className="w-5 h-5" />
                  <span className="font-bold text-lg">{score}</span>
                </div>
                <div className="text-gray-400 text-xs">Score</div>
              </div>
              <div>
                <div className="flex items-center justify-center gap-1 text-purple-400 mb-1">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold text-lg">{level}</span>
                </div>
                <div className="text-gray-400 text-xs">Level</div>
              </div>
            </div>
          </div>

          {/* Difficulty Badge */}
          <div className="text-center mb-4">
            <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
              difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
              difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-red-500/20 text-red-400'
            }`}>
              {difficulty.toUpperCase()} LEVEL
            </span>
          </div>

          {/* Word Display */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 mb-4 border border-purple-500/20">
            <div className="flex justify-center flex-wrap mb-6">
              {displayWord()}
            </div>
            
            {revealedHint && (
              <div className="text-center text-purple-400 font-semibold animate-bounce">
                {revealedHint}
              </div>
            )}
            
            <div className="text-center text-gray-400 text-sm mt-4">
              Category: {currentWord?.hint}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => handlePayment('hint')}
              disabled={!isWalletConnected}
              className="flex-1 bg-yellow-600/20 hover:bg-yellow-600/30 disabled:bg-gray-800 disabled:text-gray-600 text-yellow-400 font-semibold py-3 px-4 rounded-xl transition-all duration-300 border border-yellow-600/30 flex items-center justify-center gap-2"
            >
              <Lightbulb className="w-5 h-5" />
              Hint (0.00001 ETH)
            </button>
          </div>

          {/* Keyboard */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-4 border border-purple-500/20">
            <div className="grid grid-cols-7 gap-2">
              {alphabet.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleGuess(letter)}
                  disabled={guessedLetters.includes(letter)}
                  className={`aspect-square rounded-lg font-bold text-lg transition-all duration-300 ${
                    guessedLetters.includes(letter)
                      ? currentWord.word.includes(letter)
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600/50 text-gray-400'
                      : 'bg-purple-600/30 hover:bg-purple-600/50 text-white hover:scale-110'
                  }`}
                >
                  {letter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">Payment Required</h3>
              <p className="text-gray-300 mb-6">
                {paymentType === 'hint' && 'Get a hint by revealing one letter for 0.00001 ETH'}
                {paymentType === 'continue' && 'Restore 5 lives and continue playing for 0.00001 ETH'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={processPayment}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Pay 0.00001 ETH
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Word Completed Screen
  if (gameState === 'won') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-500/20 text-center">
          <div className="mb-6 animate-bounce">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Word Complete! 🎉</h2>
          <p className="text-gray-300 text-lg mb-6">
            The word was: <span className="text-purple-400 font-bold">{currentWord.word}</span>
          </p>
          
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              +{POINTS[difficulty]} Points
            </div>
            <div className="text-gray-400">Total Score: {score}</div>
            <div className="text-gray-400">Level: {level}</div>
          </div>

          <div className="space-y-3">
            <button
              onClick={nextWord}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Next Word
            </button>
            <button
              onClick={() => handlePayment('share')}
              disabled={!isWalletConnected}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 disabled:bg-gray-800 disabled:text-gray-600 text-blue-400 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-blue-600/30 flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share on Farcaster (0.00001 ETH)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Over Screen
  if (gameState === 'gameover') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-purple-500/20 text-center">
          <div className="mb-6">
            <Heart className="w-24 h-24 text-red-400 mx-auto opacity-50" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-gray-300 text-lg mb-2">
            The word was: <span className="text-purple-400 font-bold">{currentWord.word}</span>
          </p>
          <p className="text-gray-400 mb-6">{currentWord.hint}</p>
          
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="text-2xl font-bold text-purple-400 mb-2">Final Stats</div>
            <div className="space-y-1 text-gray-300">
              <div>Score: <span className="text-yellow-400 font-bold">{score}</span></div>
              <div>Level: <span className="text-purple-400 font-bold">{level}</span></div>
              <div>Words Completed: <span className="text-blue-400 font-bold">{wordsCompleted}</span></div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => handlePayment('continue')}
              disabled={!isWalletConnected}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" />
              Continue (0.00001 ETH)
            </button>
            <button
              onClick={restartGame}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              New Game
            </button>
            <button
              onClick={() => handlePayment('share')}
              disabled={!isWalletConnected}
              className="w-full bg-blue-600/20 hover:bg-blue-600/30 disabled:bg-gray-800 disabled:text-gray-600 text-blue-400 font-semibold py-3 px-6 rounded-xl transition-all duration-300 border border-blue-600/30 flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              Share Score (0.00001 ETH)
            </button>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full border border-purple-500/30">
              <h3 className="text-2xl font-bold text-white mb-4">Payment Required</h3>
              <p className="text-gray-300 mb-6">
                {paymentType === 'continue' && 'Restore 5 lives and continue playing for 0.00001 ETH'}
                {paymentType === 'share' && 'Share your score on Farcaster for 0.00001 ETH'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={processPayment}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Pay 0.00001 ETH
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
