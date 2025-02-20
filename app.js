// AWS Configuration (Replace with your details!)
AWS.config.update({
    region: 'us-east-1', // Your Lex bot's region
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: 'YOUR_COGNITO_IDENTITY_POOL_ID' // From Cognito Console
    })
  });
  
  const lexRuntime = new AWS.LexRuntimeV2();
  let sessionId = generateSessionId(); // Unique session per user
  
  // Initialize Lex bot parameters (Replace with your bot details!)
  const botConfig = {
    botId: 'QUCDLFES0J', // From Lex Console > Bot details
    botAliasId: 'PXRGWY24XI', // From Lex Console > Aliases
    localeId: 'en_US'
  };
  
  // Generate a random session ID
  function generateSessionId() {
    return 'session-' + Math.random().toString(36).substr(2, 9);
  }
  
  // Send message to Lex
  async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const message = userInput.value.trim();
    userInput.value = '';
  
    if (!message) return;
  
    // Display user message
    appendMessage(message, 'user-message');
  
    try {
      const params = {
        ...botConfig,
        sessionId: sessionId,
        text: message
      };
  
      const response = await lexRuntime.recognizeText(params).promise();
      const botReply = response.messages[0].content;
      
      // Display bot response
      appendMessage(botReply, 'bot-message');
    } catch (error) {
      console.error('Error:', error);
      appendMessage('Sorry, there was an error.', 'bot-message');
    }
  }
  
  // Display messages in the chat
  function appendMessage(text, className) {
    const messagesDiv = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.textContent = text;
    messagesDiv.appendChild(messageElement);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
  
  // Handle Enter key
  document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
