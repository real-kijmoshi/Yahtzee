const readline = require('readline');
const YahtzeeGame = require('.');

function createGame() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const game = new YahtzeeGame();

  function printDice() {
    console.log(`Current Dice: [${game.dice.join(', ')}]`);
  }

  function printScorecard() {
    console.log('\n--- Scorecard ---');
    for (const [key, value] of Object.entries(game.scorecard)) {
      if (key !== 'yahtzeeBonus') {
        console.log(`${key}: ${value === null ? '-' : value}`);
      }
    }
    console.log(`Yahtzee Bonus: ${game.scorecard.yahtzeeBonus}`);
    console.log('------------------\n');
  }

  function askDiceRoll() {
    printDice();
    rl.question(`You have ${game.remainingRolls} roll(s) left. Enter dice indices to re-roll (comma-separated) or press Enter to roll all: `, input => {
      if (input.trim()) {
        const indices = input.split(',').map(Number).filter(i => i >= 0 && i < 5);
        game.rollDice(indices);
      } else {
        game.rollDice();
      }
      
      if (game.remainingRolls > 0) {
        askDiceRoll();
      } else {
        printDice();
        askCategory();
      }
    });
  }

  function askCategory() {
    printScorecard();
    
    const scores = Object.keys(game.scorecard).reduce((acc, category) => {
      if (game.scorecard[category] === null) {
        try {
          acc[category] = game.calculateScore(category);
        } catch (err) {
          acc[category] = 'Error';
        }
      }
      return acc;
    }, {});
    
    console.log('Possible Scores:');
    
    for (const [category, score] of Object.entries(scores)) {
      console.log(`${category}: ${score}`);
    }

    rl.question('Choose a category to score: ', category => {
      try {
        const score = game.scoreCategory(category);
        console.log(`Scored ${score} points in ${category}`);
      } catch (err) {
        console.log(err.message);
        return askCategory();
      }

      if (game.isGameFinished()) {
        console.log('\n🎉 Game Over! 🎉');
        printScorecard();
        console.log(`Total Score: ${game.getTotalScore()}`);
        return rl.close();
      }

      game.rollDice();
      askDiceRoll();
    });
  }

  console.log('🎲 Welcome to Console Yahtzee! 🎲');
  game.rollDice();
  askDiceRoll();
}

function runCLI(inputs) {
  return new Promise((resolve, reject) => {
    const { spawn } = require('child_process');
    const child = spawn('node', ['ui.js']);

    let output = '';
    let inputIndex = 0;

    child.stdout.on('data', (data) => {
      output += data.toString();

      if (inputIndex < inputs.length) {
        setTimeout(() => {
          child.stdin.write(inputs[inputIndex] + '\n');
          inputIndex++;
        }, 10);
      }
    });

    child.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    child.on('close', (code) => {
      resolve({ output, code });
    });
  });
}

if (require.main === module) {
  createGame();
}

module.exports = { runCLI };