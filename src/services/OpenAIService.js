import axios from 'axios';

// API configuration
const API_KEY = 'YOUR_OPENAI_API_KEY';
const API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

/**
 * Service for interacting with OpenAI's ChatGPT API
 */
class OpenAIService {
  /**
   * Generate FIRE plan recommendations based on user inputs
   * 
   * @param {Object} userData - User financial and personal data
   * @returns {Promise<Object>} - Parsed recommendations
   */
  async generateFIREPlan(userData) {
    try {
      const prompt = this._createFIREPrompt(userData);
      
      const response = await axios.post(
        API_URL,
        {
          model: MODEL,
          messages: [
            { role: 'system', content: 'You are a FIRE (Financial Independence, Retire Early) planning assistant helping users create financial goals.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          }
        }
      );
      
      return {
        success: true,
        data: this._parseResponse(response.data.choices[0].message.content)
      };
    } catch (error) {
      console.error('Error generating FIRE plan:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Failed to generate FIRE plan'
      };
    }
  }
  
  /**
   * Create a prompt for the FIRE planning assistant
   * 
   * @param {Object} userData - User financial and personal data
   * @returns {string} - Formatted prompt
   */
  _createFIREPrompt(userData) {
    return `
You are a FIRE (Financial Independence, Retire Early) planning assistant helping a user create financial goals. Based on the following information, provide a personalized FIRE plan:

Current age: ${userData.currentAge}
Target retirement age: ${userData.targetAge}
Current annual income: ${userData.income}
Current annual expenses: ${userData.expenses}
Current savings: ${userData.savings}
Current investments: ${userData.investments}
Expected lifestyle in retirement: ${userData.lifestyle}
Risk tolerance: ${userData.riskTolerance}

Please provide:
1. A brief explanation of the FIRE approach suitable for this user
2. The savings rate they need to achieve their goal
3. A realistic timeline to financial independence
4. 3-5 specific, actionable milestones they should track
5. Suggested investment allocation based on their risk tolerance
6. Any additional recommendations specific to their situation

Format your response in clear sections with headings. Keep explanations concise and actionable. Focus on practical advice rather than general financial education.
`;
  }
  
  /**
   * Parse the LLM response into structured data
   * 
   * @param {string} responseText - Raw response from OpenAI
   * @returns {Object} - Structured recommendation data
   */
  _parseResponse(responseText) {
    // This is a simple parser that could be enhanced with regex or more sophisticated parsing
    const sections = responseText.split(/#{1,2}\s+/);
    
    // Extract key information
    const explanation = this._extractSection(sections, 'explanation', 'approach');
    const savingsRate = this._extractSection(sections, 'savings rate');
    const timeline = this._extractSection(sections, 'timeline');
    const milestones = this._extractSection(sections, 'milestone');
    const investments = this._extractSection(sections, 'investment', 'allocation');
    const recommendations = this._extractSection(sections, 'recommendation', 'additional');
    
    return {
      explanation,
      savingsRate,
      timeline,
      milestones,
      investments,
      recommendations,
      rawResponse: responseText
    };
  }
  
  /**
   * Extract a section from the response based on keywords
   * 
   * @param {Array<string>} sections - Split sections of the response
   * @param {string} primaryKeyword - Primary keyword to look for
   * @param {string} secondaryKeyword - Optional secondary keyword
   * @returns {string} - Extracted section text
   */
  _extractSection(sections, primaryKeyword, secondaryKeyword = '') {
    const sectionRegex = new RegExp(primaryKeyword, 'i');
    const secondaryRegex = secondaryKeyword ? new RegExp(secondaryKeyword, 'i') : null;
    
    for (const section of sections) {
      if (sectionRegex.test(section) && (!secondaryKeyword || secondaryRegex.test(section))) {
        return section.trim();
      }
    }
    
    return '';
  }
}

export default new OpenAIService();
