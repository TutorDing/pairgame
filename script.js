class MemoryGame {
    constructor() {
        // DOM 元素
        this.gameBoard = document.getElementById('game-board');
        this.timeElement = document.getElementById('time');
        this.movesElement = document.getElementById('moves');
        this.winMessage = document.getElementById('win-message');
        this.finalTimeElement = document.getElementById('final-time');
        this.finalMovesElement = document.getElementById('final-moves');

        // 游戏状态
        this.cards = [];
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.timeElapsed = 0;
        this.timer = null;
        this.gameStarted = false;
        this.currentSize = 4; // 默认4x4网格

        // 绑定事件处理
        this.handleRestart = this.resetGame.bind(this);
        this.handlePlayAgain = this.resetGame.bind(this);
        this.handleDifficulty = this.changeDifficulty.bind(this);

        // 绑定事件监听
        document.getElementById('restart').addEventListener('click', this.handleRestart);
        document.getElementById('play-again').addEventListener('click', this.handlePlayAgain);
        document.querySelectorAll('.difficulty button').forEach(button => {
            button.addEventListener('click', this.handleDifficulty);
        });

        // 初始化游戏
        this.initGame();
    }

    // 初始化游戏
    initGame() {
        // 重置游戏状态
        this.cards = [];
        this.flippedCards = [];
        this.matchedCards = [];
        this.moves = 0;
        this.timeElapsed = 0;
        this.gameStarted = false;
        
        // 清除计时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // 确保胜利消息隐藏
        if (this.winMessage) {
            this.winMessage.classList.add('hidden');
        }

        // 更新显示
        this.updateStats();
        
        // 创建卡片
        const totalPairs = Math.pow(this.currentSize, 2) / 2;
        const symbols = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎫', '🎬', 
                        '🎤', '🎧', '🎼', '🎹', '🎷', '🎸', '🎺', '🎻', 
                        '🎾', '⚽', '🏀', '🏈', '⚾', '🎱', '🏓', '🏸'];
        
        // 选择所需数量的符号并复制一份
        const selectedSymbols = symbols.slice(0, totalPairs);
        this.cards = [...selectedSymbols, ...selectedSymbols];
        
        // 随机打乱卡片
        this.shuffleCards();
        
        // 渲染游戏板
        this.renderBoard();
        
        // 更新游戏板大小类名
        this.gameBoard.className = `size-${this.currentSize}`;
    }

    // 重置游戏
    resetGame() {
        // 停止计时器
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        // 隐藏胜利消息
        if (this.winMessage) {
            this.winMessage.classList.add('hidden');
        }

        // 重新初始化游戏
        this.initGame();
    }

    // 渲染游戏板
    renderBoard() {
        this.gameBoard.innerHTML = '';
        this.cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-front"></div>
                <div class="card-back">${symbol}</div>
            `;
            card.addEventListener('click', () => this.handleCardClick(card, index));
            this.gameBoard.appendChild(card);
        });
    }

    // 处理卡片点击
    handleCardClick(card, index) {
        // 如果卡片已翻开或已匹配，则忽略点击
        if (card.classList.contains('flipped') || 
            card.classList.contains('matched') || 
            this.flippedCards.length >= 2) {
            return;
        }

        // 开始计时（第一次点击时）
        if (!this.gameStarted) {
            this.startTimer();
            this.gameStarted = true;
        }

        // 翻开卡片
        card.classList.add('flipped');
        this.flippedCards.push({ card, index });

        // 检查是否需要比较两张卡片
        if (this.flippedCards.length === 2) {
            this.moves++;
            this.updateStats();
            this.checkMatch();
        }
    }

    // 检查匹配
    checkMatch() {
        const [card1, card2] = this.flippedCards;
        const match = this.cards[card1.index] === this.cards[card2.index];

        if (match) {
            // 匹配成功
            card1.card.classList.add('matched');
            card2.card.classList.add('matched');
            this.matchedCards.push(card1.card, card2.card);
            this.flippedCards = [];

            // 检查游戏是否结束
            if (this.matchedCards.length === this.cards.length) {
                this.endGame();
            }
        } else {
            // 不匹配，延迟翻回
            setTimeout(() => {
                card1.card.classList.remove('flipped');
                card2.card.classList.remove('flipped');
                this.flippedCards = [];
            }, 1000);
        }
    }

    // 更新统计信息
    updateStats() {
        this.movesElement.textContent = this.moves;
        this.timeElement.textContent = this.timeElapsed;
    }

    // 开始计时器
    startTimer() {
        this.timer = setInterval(() => {
            this.timeElapsed++;
            this.updateStats();
        }, 1000);
    }

    // 结束游戏
    endGame() {
        clearInterval(this.timer);
        this.finalTimeElement.textContent = this.timeElapsed;
        this.finalMovesElement.textContent = this.moves;
        this.winMessage.classList.remove('hidden');
    }

    // 改变难度
    changeDifficulty(event) {
        const newSize = parseInt(event.target.dataset.size);
        if (newSize === this.currentSize) return;

        // 更新按钮状态
        document.querySelectorAll('.difficulty button').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        // 更新大小并重置游戏
        this.currentSize = newSize;
        this.resetGame();
    }

    // 随机打乱卡片
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }
}

// 启动游戏
window.addEventListener('DOMContentLoaded', () => {
    const game = new MemoryGame();
});
