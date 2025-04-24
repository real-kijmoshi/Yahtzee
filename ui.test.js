// ui.test.js

jest.mock('child_process');
const { spawn } = require('child_process');

describe('YahtzeeGame UI', () => {
  let mockProcess;
  
  beforeEach(() => {
    // Reset our mocks before each test
    jest.clearAllMocks();
    
    // Create a mock process with the necessary methods
    mockProcess = {
      stdout: {
        on: jest.fn((event, callback) => {
          if (event === 'data') {
            // Immediately call the callback to simulate output
            callback(Buffer.from('Current Dice: [1, 2, 3, 4, 5]'));
          }
          return mockProcess.stdout;
        })
      },
      stderr: {
        on: jest.fn().mockReturnThis()
      },
      stdin: {
        write: jest.fn()
      },
      on: jest.fn((event, callback) => {
        if (event === 'close') {
          // Simulate the process closing
          setTimeout(() => callback(0), 50);
        }
        return mockProcess;
      })
    };
    
    // Make sure spawn returns our mock
    spawn.mockReturnValue(mockProcess);
  });

  test('should roll and select a scoring category', async () => {
    const inputs = [
      '',        // roll all dice
      '',        // roll all dice
      '',        // roll all dice (end of rolls)
      'chance'   // score in "chance" category
    ];

    // This tells our mock to trigger the data callback quickly for testing
    mockProcess.stdout.on.mockImplementation((event, callback) => {
      if (event === 'data') {
        // Call data callback for each input to simulate a prompt-response cycle
        inputs.forEach(() => {
          callback(Buffer.from('Game prompt'));
        });
      }
      return mockProcess.stdout;
    });

    const { runCLI } = require('./ui');
    await runCLI(inputs);

    // Check that stdin.write was called for each input
    expect(mockProcess.stdin.write).toHaveBeenCalledTimes(inputs.length);
    inputs.forEach((input, index) => {
      expect(mockProcess.stdin.write).toHaveBeenNthCalledWith(index + 1, input + '\n');
    });
  });

  test('should handle invalid category gracefully', async () => {
    const inputs = [
      '',       // roll
      '',       // roll
      '',       // roll
      'invalidCategory', // invalid category
      'chance'  // valid fallback
    ];

    // Similar setup as previous test
    mockProcess.stdout.on.mockImplementation((event, callback) => {
      if (event === 'data') {
        inputs.forEach(() => {
          callback(Buffer.from('Game prompt'));
        });
      }
      return mockProcess.stdout;
    });

    const { runCLI } = require('./ui');
    await runCLI(inputs);

    // Check that stdin.write was called for each input
    expect(mockProcess.stdin.write).toHaveBeenCalledTimes(inputs.length);
    inputs.forEach((input, index) => {
      expect(mockProcess.stdin.write).toHaveBeenNthCalledWith(index + 1, input + '\n');
    });
  });
});