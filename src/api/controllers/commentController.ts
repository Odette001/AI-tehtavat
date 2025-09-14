import {Request, Response, NextFunction} from 'express';
import fetchData from '../../lib/fetchData';

const commentPost = async (
  req: Request<{}, {}, {greeting: string}>,
  res: Response<{replies: string}>,
  next: NextFunction
) => {
  try {
    const TemResponse = `Thank you for your greeting: "${req.body.greeting}". This is a reply from AI!`;
    res.status(300).json({replies: TemResponse});
  } catch (error) {
    next(error);
  }
}

/*const commentPost = async (
  req: Request<{}, {}, {text: string}>,
  res: Response<{response: string}>,
  next: NextFunction
) => {
  try {
    // TEMPORARY: Return mock response until we get the correct OpenAI URL
    const mockResponse = `Thank you for your comment: "${req.body.text}". This is a generated response from AI!`;
    res.status(200).json({response: mockResponse});

    
    
    // TODO: Uncomment this when you have the correct OPENAI_API_URL
    /*
    const response = await fetchData(process.env.OPENAI_API_URL + '/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: req.body.text,
          },
        ],
      }),
    });
    
    const aiResponse = (response as any).choices[0].message.content;
    res.status(200).json({response: aiResponse});
    
  } catch (error) {
    next(error);
  }
};
*/

export {commentPost};
