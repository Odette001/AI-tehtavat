type MessageResponse = {
  message: string;
};

type ErrorResponse = MessageResponse & {
  stack?: string;
};

type CommentRequest = {
  comment: string;
  style?: 'nice' | 'funny' | 'mean' | 'sarcastic' | 'professional' | 'casual';
};

type CommentResponse = {
  response: string;
  style: string;
  originalComment: string;
  isTest?: boolean; // Indicates if this is a test/fallback response
};

export {MessageResponse, ErrorResponse, CommentRequest, CommentResponse};
