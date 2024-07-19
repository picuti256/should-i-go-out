export class Tools {
  Tools = [
    {
      type: 'function',
      function: {
        name: 'getCurrentTemperature',
        description: 'Get the current temperature for a specific location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g., San Francisco, CA',
            },
            unit: {
              type: 'string',
              enum: ['Celsius', 'Fahrenheit'],
              description:
                "The temperature unit to use. Infer this from the user's location.",
            },
          },
          required: ['location', 'unit'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'getRainProbability',
        description: 'Get the probability of rain for a specific location',
        parameters: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: 'The city and state, e.g., San Francisco, CA',
            },
          },
          required: ['location'],
        },
      },
    },
  ];
}
