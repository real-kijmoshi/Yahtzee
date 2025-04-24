// yahtzee.test.js
const YahtzeeGame = require('./index.js'); // Adjust the path as necessary

describe('YahtzeeGame', () => {
  let game;

  beforeEach(() => {
    game = new YahtzeeGame();
  });

  describe('Initialization', () => {
    test('should initialize with 5 dice', () => {
      expect(game.dice.length).toBe(5);
    });

    test('should initialize with empty scorecard', () => {
      expect(game.scorecard).toEqual({
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
      });
    });

    test('should initialize with 3 rolls available', () => {
      expect(game.remainingRolls).toBe(3);
    });
  });

  describe('Rolling dice', () => {
    test('should roll all dice when no indexes are provided', () => {
      const originalDice = [...game.dice];
      game.rollDice();
      
      // This test might occasionally fail due to randomness
      // but it's highly unlikely all dice would remain the same
      expect(game.dice).not.toEqual(originalDice);
    });

    test('should only roll selected dice', () => {
      // Set initial dice to known values
      game.dice = [1, 2, 3, 4, 5];
      
      // Roll only the first and last dice
      game.rollDice([0, 4]);
      
      // The middle dice should remain unchanged
      expect(game.dice[1]).toBe(2);
      expect(game.dice[2]).toBe(3);
      expect(game.dice[3]).toBe(4);
    });

    test('should decrement remaining rolls', () => {
      game.rollDice();
      expect(game.remainingRolls).toBe(2);
    });

    test('should not allow rolling when no rolls remaining', () => {
      game.remainingRolls = 0;
      expect(() => game.rollDice()).toThrow('No rolls remaining');
    });
  });

  describe('Scoring', () => {
    test('should correctly score ones', () => {
      game.dice = [1, 1, 3, 4, 5];
      expect(game.calculateScore('ones')).toBe(2);
    });

    test('should correctly score twos', () => {
      game.dice = [1, 2, 2, 4, 5];
      expect(game.calculateScore('twos')).toBe(4);
    });

    test('should correctly score threes', () => {
      game.dice = [1, 3, 3, 3, 5];
      expect(game.calculateScore('threes')).toBe(9);
    });

    test('should correctly score fours', () => {
      game.dice = [4, 4, 3, 4, 5];
      expect(game.calculateScore('fours')).toBe(12);
    });

    test('should correctly score fives', () => {
      game.dice = [1, 5, 3, 5, 5];
      expect(game.calculateScore('fives')).toBe(15);
    });

    test('should correctly score sixes', () => {
      game.dice = [6, 6, 6, 6, 5];
      expect(game.calculateScore('sixes')).toBe(24);
    });

    test('should correctly score three of a kind', () => {
      game.dice = [3, 3, 3, 4, 5];
      expect(game.calculateScore('threeOfAKind')).toBe(18);
    });

    test('should return 0 for three of a kind if criteria not met', () => {
      game.dice = [2, 3, 4, 4, 5];
      expect(game.calculateScore('threeOfAKind')).toBe(0);
    });

    test('should correctly score four of a kind', () => {
      game.dice = [4, 4, 4, 4, 5];
      expect(game.calculateScore('fourOfAKind')).toBe(21);
    });

    test('should return 0 for four of a kind if criteria not met', () => {
      game.dice = [3, 3, 3, 4, 5];
      expect(game.calculateScore('fourOfAKind')).toBe(0);
    });

    test('should correctly score full house', () => {
      game.dice = [2, 2, 3, 3, 3];
      expect(game.calculateScore('fullHouse')).toBe(25);
    });

    test('should return 0 for full house if criteria not met', () => {
      game.dice = [2, 2, 2, 2, 3];
      expect(game.calculateScore('fullHouse')).toBe(0);
    });

    test('should correctly score small straight', () => {
      game.dice = [1, 2, 3, 4, 6];
      expect(game.calculateScore('smallStraight')).toBe(30);
    });

    test('should correctly score another valid small straight', () => {
      game.dice = [2, 3, 4, 5, 5];
      expect(game.calculateScore('smallStraight')).toBe(30);
    });

    test('should return 0 for small straight if criteria not met', () => {
      game.dice = [1, 2, 4, 5, 6];
      expect(game.calculateScore('smallStraight')).toBe(0);
    });

    test('should correctly score large straight', () => {
      game.dice = [1, 2, 3, 4, 5];
      expect(game.calculateScore('largeStraight')).toBe(40);
    });

    test('should correctly score another valid large straight', () => {
      game.dice = [2, 3, 4, 5, 6];
      expect(game.calculateScore('largeStraight')).toBe(40);
    });

    test('should return 0 for large straight if criteria not met', () => {
      game.dice = [1, 2, 3, 5, 6];
      expect(game.calculateScore('largeStraight')).toBe(0);
    });

    test('should correctly score yahtzee', () => {
      game.dice = [5, 5, 5, 5, 5];
      expect(game.calculateScore('yahtzee')).toBe(50);
    });

    test('should return 0 for yahtzee if criteria not met', () => {
      game.dice = [5, 5, 5, 5, 4];
      expect(game.calculateScore('yahtzee')).toBe(0);
    });

    test('should correctly score chance', () => {
      game.dice = [1, 3, 5, 5, 6];
      expect(game.calculateScore('chance')).toBe(20);
    });
  });

  describe('Scoring a category', () => {
    test('should score a category and update scorecard', () => {
      game.dice = [1, 1, 1, 4, 5];
      game.scoreCategory('ones');
      expect(game.scorecard.ones).toBe(3);
    });

    test('should reset remaining rolls after scoring', () => {
      game.remainingRolls = 1;
      game.dice = [1, 1, 1, 4, 5];
      game.scoreCategory('ones');
      expect(game.remainingRolls).toBe(3);
    });

    test('should not allow scoring a category that is already scored', () => {
      game.dice = [1, 1, 1, 4, 5];
      game.scoreCategory('ones');
      expect(() => game.scoreCategory('ones')).toThrow('Category already scored');
    });

    test('should award yahtzee bonus when applicable', () => {
      // First yahtzee
      game.dice = [6, 6, 6, 6, 6];
      game.scoreCategory('yahtzee');
      expect(game.scorecard.yahtzee).toBe(50);
      
      // Second yahtzee - should get bonus
      game.dice = [4, 4, 4, 4, 4];
      game.scoreCategory('fours');
      expect(game.scorecard.yahtzeeBonus).toBe(100);
    });

    test('should not award yahtzee bonus if first yahtzee was scored as 0', () => {
      // First yahtzee attempt fails
      game.dice = [1, 2, 3, 4, 5];
      game.scoreCategory('yahtzee');
      expect(game.scorecard.yahtzee).toBe(0);
      
      // Later yahtzee
      game.dice = [4, 4, 4, 4, 4];
      game.scoreCategory('fours');
      expect(game.scorecard.yahtzeeBonus).toBe(0);
    });
  });

  describe('Game State', () => {
    test('should identify when game is finished', () => {
      // Score all categories
      const categories = [
        'ones', 'twos', 'threes', 'fours', 'fives', 'sixes',
        'threeOfAKind', 'fourOfAKind', 'fullHouse',
        'smallStraight', 'largeStraight', 'yahtzee', 'chance'
      ];
      
      expect(game.isGameFinished()).toBe(false);
      
      categories.forEach(category => {
        game.scorecard[category] = 0; // Just set some value
      });
      
      expect(game.isGameFinished()).toBe(true);
    });

    test('should calculate upper section score correctly', () => {
      game.scorecard.ones = 3;
      game.scorecard.twos = 6;
      game.scorecard.threes = 9;
      game.scorecard.fours = 8;
      game.scorecard.fives = 15;
      game.scorecard.sixes = 18;
      
      expect(game.getUpperSectionScore()).toBe(59);
    });

    test('should award upper section bonus when score >= 63', () => {
      game.scorecard.ones = 3;
      game.scorecard.twos = 6;
      game.scorecard.threes = 9;
      game.scorecard.fours = 12;
      game.scorecard.fives = 15;
      game.scorecard.sixes = 18;
      
      expect(game.getUpperSectionBonus()).toBe(35);
    });

    test('should not award upper section bonus when score < 63', () => {
      game.scorecard.ones = 2;
      game.scorecard.twos = 4;
      game.scorecard.threes = 9;
      game.scorecard.fours = 12;
      game.scorecard.fives = 15;
      game.scorecard.sixes = 18;
      
      expect(game.getUpperSectionBonus()).toBe(0);
    });

    test('should calculate lower section score correctly', () => {
      game.scorecard.threeOfAKind = 20;
      game.scorecard.fourOfAKind = 24;
      game.scorecard.fullHouse = 25;
      game.scorecard.smallStraight = 30;
      game.scorecard.largeStraight = 40;
      game.scorecard.yahtzee = 50;
      game.scorecard.chance = 22;
      game.scorecard.yahtzeeBonus = 100;
      
      expect(game.getLowerSectionScore()).toBe(311);
    });

    test('should calculate total score correctly', () => {
      game.scorecard.ones = 3;
      game.scorecard.twos = 6;
      game.scorecard.threes = 9;
      game.scorecard.fours = 12;
      game.scorecard.fives = 15;
      game.scorecard.sixes = 18;
      game.scorecard.threeOfAKind = 20;
      game.scorecard.fourOfAKind = 24;
      game.scorecard.fullHouse = 25;
      game.scorecard.smallStraight = 30;
      game.scorecard.largeStraight = 40;
      game.scorecard.yahtzee = 50;
      game.scorecard.chance = 22;
      
      // Upper: 63 + 35 bonus = 98
      // Lower: 211
      // Total: 309
      expect(game.getTotalScore()).toBe(309);
    });
  });
});