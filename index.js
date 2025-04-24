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

        const translated = {
            ones: 1,
            twos: 2,
            threes: 3,
            fours: 4,
            fives: 5,
            sixes: 6,
        }[category];

        let score = 0;
        this.dice.forEach((die) => {
            if (die === translated) {
                score += die;
            }
        })
        

        return score;
    }
}

module.exports = Yahtze;