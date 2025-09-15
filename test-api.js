// Simple test script for the comment API
const testAPI = async () => {
  const baseURL = 'http://localhost:3000/api/v1/comments';
  
  const testCases = [
    {
      comment: "This video is absolutely amazing! Thanks for sharing!",
      style: "nice"
    },
    {
      comment: "I don't understand this at all, it's confusing",
      style: "funny"
    },
    {
      comment: "This is the worst tutorial ever made",
      style: "sarcastic"
    },
    {
      comment: "Could you please explain this part again?",
      style: "professional"
    },
    {
      comment: "Wow, mind blown! 🤯",
      style: "casual"
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n--- Testing ${testCase.style.toUpperCase()} style ---`);
      console.log(`Original comment: "${testCase.comment}"`);
      
      const response = await fetch(baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase),
      });

      const result = await response.json();
      
      if (response.ok) {
        console.log(`AI Response (${result.style}): "${result.response}"`);
      } else {
        console.log(`Error: ${result.message || 'Unknown error'}`);
      }
      
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.log(`Failed to test ${testCase.style}: ${error.message}`);
    }
  }
};

testAPI().catch(console.error);