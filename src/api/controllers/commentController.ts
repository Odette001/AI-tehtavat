import {Request, Response, NextFunction} from 'express';
import fetchData from '../../lib/fetchData';
import {CommentRequest, CommentResponse} from '../../types/MessageTypes';

// Helper function to generate mock responses for testing
const generateMockResponse = (comment: string, style: string): string => {
  const responses = {
    nice: `Thank you for sharing your thoughts! I really appreciate your comment: "${comment}". You seem like a wonderful person! 😊`,
    funny: `Haha, "${comment}" - that's hilarious! You know what's even funnier? My attempt at being an AI comedian! 🤖😄`,
    mean: `"${comment}" - seriously? That's the best you could come up with? I've seen more creativity in a stale cracker.`,
    sarcastic: `Oh wow, "${comment}" - what a truly groundbreaking observation. I'm sure nobody has EVER thought of that before. 🙄`,
    professional: `Thank you for your comment regarding "${comment}". I appreciate your perspective and would like to offer a thoughtful response to your observation.`,
    casual: `Hey! About your comment "${comment}" - totally get what you mean, dude. That's a pretty cool way to look at it! 👍`
  };
  
  return responses[style as keyof typeof responses] || responses.casual;
};

// Helper function to generate AI persona prompts
const getPersonaPrompt = (style: string): string => {
  const prompts = {
    nice: "You are a kind, supportive, and encouraging person. Respond to YouTube comments with warmth, positivity, and understanding. Always try to find something positive to say.",
    funny: "You are a witty and humorous person. Respond to YouTube comments with clever jokes, puns, or funny observations. Keep it light-hearted and entertaining.",
    mean: "You are a blunt and direct person. Respond to YouTube comments with sharp criticism or sarcastic remarks. Be brutally honest but not personally attacking.",
    sarcastic: "You are highly sarcastic. Respond to YouTube comments with clever sarcasm and irony. Use wit to make your point without being too harsh.",
    professional: "You are a professional and knowledgeable expert. Respond to YouTube comments with informative, well-structured, and respectful responses.",
    casual: "You are a laid-back, friendly person. Respond to YouTube comments in a relaxed, conversational tone like you're talking to a friend.",
    mad: "You are a very angry and frustrated person. Respond to YouTube comments with strong emotions, expressing your dissatisfaction or annoyance clearly.",
    disappointed: "You are a person who feels let down and disheartened. Respond to YouTube comments with a tone of sadness and regret, expressing your disappointment in a sincere manner."
  };
  
  return prompts[style as keyof typeof prompts] || prompts.casual;
};

const commentPost = async (
  req: Request<{}, CommentResponse, CommentRequest>,
  res: Response<CommentResponse>,
  next: NextFunction
) => {
  try {
    const { comment, style = 'casual' } = req.body;
    
    // Check if we have a valid OpenAI API URL
    const openaiUrl = process.env.OPENAI_API_URL;
    if (!openaiUrl || openaiUrl === 'https://your-metropolia-openai-server.com' || openaiUrl === 'http://localhost:8080') {
      console.log('Using mock response - OpenAI URL not configured properly');
      const mockResponse = generateMockResponse(comment, style);
      res.status(200).json({
        response: mockResponse,
        style: style,
        originalComment: comment
      });
      return;
    }
    
    // Generate the persona prompt based on the style
    const personaPrompt = getPersonaPrompt(style);
    
    // Prepare the OpenAI API request
    const openAIRequest = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `${personaPrompt} You are responding to a YouTube comment. Keep your response concise (1-3 sentences) and engaging.`
        },
        {
          role: 'user',
          content: `Please respond to this YouTube comment: "${comment}"`
        }
      ],
      max_tokens: 150,
      temperature: 0.8
    };

    // Make the API call to OpenAI
    const fullUrl = `${process.env.OPENAI_API_URL}/v1/chat/completions`;
    console.log('Making request to URL:', fullUrl);
    console.log('OPENAI_API_URL env var:', process.env.OPENAI_API_URL);
    
    const apiResponse = await fetchData(
      fullUrl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(openAIRequest),
      }
    );

    // Extract the AI response
    const aiResponse = (apiResponse as any).choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Send the response
    res.status(200).json({
      response: aiResponse.trim(),
      style: style,
      originalComment: comment
    });

  } catch (error) {
    console.error('Error generating AI response:', error);
    // Fallback to mock response if API fails
    const mockResponse = generateMockResponse(req.body.comment, req.body.style || 'casual');
    res.status(200).json({
      response: mockResponse,
      style: req.body.style || 'casual',
      originalComment: req.body.comment
    });
  }
};

export {commentPost};
