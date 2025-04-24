class Yahtze {
    constructor() {
        this.dice = [0, 0, 0, 0, 0];
        this.scorecard = {
            ones: null,
            twos: null,
            threes: null,
            fours: null,
            fives: null,
            sixes: null,
            threeOfAKind: null,
            fourOfAKind: null,
            fullHouse: null,
            smallStraight: null,
            largeStraight: null,
            yahtzee: null,
            chance: null,
            yahtzeeBonus: 0
        };
        this.remainingRolls = 3;
    }

    rollDice(diceToRoll) {
        if (this.remainingRolls <= 0) {
            throw new Error('No rolls remaining');
        }

        if (!diceToRoll) {
            this.dice = this.dice.map(() => Math.floor(Math.random() * 6) + 1);
        } else {
            diceToRoll.forEach(index => {
                this.dice[index] = Math.floor(Math.random() * 6) + 1;
            });
        }

        this.remainingRolls--;
    }

    calculateScore(category) {
        if (this.scorecard[category] !== null) {
          throw new Error('Category already scored');
        }
        
        const counts = {};
        let sum = 0;
        let score = 0;
        
        for (const die of this.dice) {
          counts[die] = (counts[die] || 0) + 1;
          sum += die;
        }
        
        const countValues = Object.values(counts);
        const uniqueValues = Object.keys(counts).map(Number).sort((a, b) => a - b);
        
        const upperCategories = {ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6};
        if (category in upperCategories) {
          const value = upperCategories[category];
          score = (counts[value] || 0) * value;
        } else {
          switch (category) {
            case 'threeOfAKind':
              score = countValues.some(count => count >= 3) ? sum : 0;
              break;
              
            case 'fourOfAKind':
              score = countValues.some(count => count >= 4) ? sum : 0;
              break;
              
            case 'fullHouse':
              score = countValues.length === 2 && countValues.includes(2) && countValues.includes(3) ? 25 : 0;
              break;
                  
            case 'smallStraight': {
              if (uniqueValues.length >= 4) {
                for (let i = 0; i <= uniqueValues.length - 4; i++) {
                  if (uniqueValues[i+3] - uniqueValues[i] === 3) {
                      this.scorecard.yahtzeeBonus += 100;
                      score = 30;
                      break;
                  }
                }
              }
              break;
            }
              
            case 'largeStraight': {
              score = (uniqueValues.length === 5 && uniqueValues[4] - uniqueValues[0] === 4) ? 40 : 0;
              break;
            }
              
            case 'yahtzee':
              score = countValues.includes(5) ? 50 : 0;
              break;
              
            case 'chance':
              score = sum;
              break;
              
            default:
              throw new Error(`Unknown category: ${category}`);
          }
        }
        
        
        return score;
    }

    scoreCategory(category) {
        const score = this.calculateScore(category);
        this.scorecard[category] = score;

        if (category === 'yahtzee' && score > 0) {
            this.scorecard.yahtzeeBonus += 100;
        }

        this.remainingRolls = 3;
        return score;
    }

    isGameFinished() {
        return Object.values(this.scorecard).every(score => score !== null);
    }

    getUpperSectionScore() {
        return Object.keys(this.scorecard)
            .filter(key => ['ones', 'twos', 'threes', 'fours', 'fives', 'sixes'].includes(key))
            .reduce((total, key) => total + (this.scorecard[key] || 0), 0);
    }

    getUpperSectionBonus() {
        const upperSectionScore = this.getUpperSectionScore();
        return upperSectionScore >= 63 ? 35 : 0;
    }

    getLowerSectionScore() {
        return Object.keys(this.scorecard)
            .filter(key => ['threeOfAKind', 'fourOfAKind', 'fullHouse', 'smallStraight', 'largeStraight', 'yahtzee', 'chance'].includes(key))
            .reduce((total, key) => total + (this.scorecard[key] || 0), 0);
    }

    getTotalScore() {
        return this.getUpperSectionScore() + this.getUpperSectionBonus() + this.getLowerSectionScore() + this.scorecard.yahtzeeBonus;
    }
}

module.exports = Yahtze;