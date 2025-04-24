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
        
        for (const die of this.dice) {
          counts[die] = (counts[die] || 0) + 1;
          sum += die;
        }
        
        const countValues = Object.values(counts);
        const uniqueValues = Object.keys(counts).map(Number).sort((a, b) => a - b);
        
        const upperCategories = {ones: 1, twos: 2, threes: 3, fours: 4, fives: 5, sixes: 6};
        if (category in upperCategories) {
          const value = upperCategories[category];
          return (counts[value] || 0) * value;
        }
        
        switch (category) {
          case 'threeOfAKind':
            return countValues.some(count => count >= 3) ? sum : 0;
            
          case 'fourOfAKind':
            return countValues.some(count => count >= 4) ? sum : 0;
            
          case 'fullHouse':
            return countValues.length === 2 && countValues.includes(2) && countValues.includes(3) ? 25 : 0;
            
          case 'smallStraight': {
            if (uniqueValues.length >= 4) {
              for (let i = 0; i <= uniqueValues.length - 4; i++) {
                if (uniqueValues[i+3] - uniqueValues[i] === 3) {
                  return 30;
                }
              }
            }
            return 0;
          }
            
          case 'largeStraight': {
           return (uniqueValues.length === 5 && 
                    uniqueValues[4] - uniqueValues[0] === 4) ? 40 : 0;
          }
            
          case 'yahtzee':
            return countValues.includes(5) ? 50 : 0;
            
          case 'chance':
            return sum;
            
          default:
            throw new Error(`Unknown category: ${category}`);
        }
      }
}

module.exports = Yahtze;