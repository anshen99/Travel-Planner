'use client';

import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "./config";

// Initialize the Google Generative AI client
const genAI = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

// Main function to generate travel itinerary
export async function generateItinerary(preferences) {
  const { destination, startDate, endDate, interests, travelers, budget, additionalRequests } = preferences;
  
  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
  
  // Format the interests for the prompt
  const interestsText = interests && interests.length 
    ? `The travelers are particularly interested in: ${interests.join(', ')}.` 
    : '';
  
  // Format budget information
  const budgetText = budget 
    ? `They have a budget of approximately ${budget}.` 
    : 'They have a moderate budget.';
  
  // Format additional requests
  const additionalRequestsText = additionalRequests 
    ? `Additional special requests: ${additionalRequests}` 
    : '';
  
  // Create the prompt for Gemini
  const promptText = `
    Create a detailed ${dayCount}-day itinerary for ${travelers} travelers visiting ${destination} 
    from ${startDate} to ${endDate}. ${interestsText} ${budgetText}
    
    ${additionalRequestsText}
    
    Include a variety of activities, restaurants, and attractions that match their interests.
    Each day should have morning, afternoon, and evening activities with specific locations, estimated times, and brief descriptions.
    
    Format your response as a JSON object with the following structure:
    {
      "destination": "${destination}",
      "startDate": "${startDate}",
      "endDate": "${endDate}",
      "summary": "A brief summary of the trip",
      "tips": ["tip1", "tip2", "tip3", "tip4"],
      "days": [
        {
          "date": "YYYY-MM-DD",
          "activities": [
            {
              "id": "unique-id",
              "time": "HH:MM - HH:MM",
              "title": "Activity name",
              "location": "Location details",
              "description": "Brief description",
              "type": "attraction or restaurant",
              "imageUrl": "URL to an image of this place (publicly accessible image only)",
              "coordinates": "Exact latitude and longitude if known, otherwise leave empty"
            },
            ...more activities
          ]
        },
        ...more days
      ]
    }
    
    Make sure the activities are appropriate for ${destination} and consider the traveler's interests when suggesting places.
    For each activity, try to include a publicly accessible image URL if possible (stock photos, official websites, etc.).
    Include exact coordinates when known to create better map links.
    Include at least 4-5 activities per day including meals.
    The response should ONLY contain the JSON object with no additional explanation or text.
  `;
  
  try {
    // Set up the model and configuration
    const modelName = 'gemini-2.5-flash-preview-04-17'; // Using a stable version; change to gemini-2.5-pro-preview-05-06 if needed
    const config = {
      responseMimeType: 'text/plain',
    };
    
    // Structure the content for the API request
    const contents = [
      {
        role: 'user',
        parts: [{ text: promptText }]
      }
    ];
    
    // Generate content
    const model = genAI.models;
    const response = await model.generateContent({
      model: modelName,
      config,
      contents,
    });
    
    // Access the response text - handle the nested structure of Gemini 2.5 API
    let text = '';
    if (response.candidates && response.candidates[0]?.content?.parts?.length > 0) {
      text = response.candidates[0].content.parts[0].text;
      
      // Remove markdown code blocks if present
      text = text.replace(/```json\n|\n```/g, '');
      console.log("Extracted text:", text);
    } else {
      console.error("Unexpected response structure:", response);
      return fallbackResponse(preferences);
    }
    
    // Parse the JSON response
    try {
      // Extract JSON from the response text (in case there's any extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : text;
      
      // Parse the JSON
      const itineraryData = JSON.parse(jsonText);
      console.log(itineraryData);
      // Validate the response structure
      if (!itineraryData.days || !Array.isArray(itineraryData.days)) {
        console.error("Invalid response structure - missing days array");
        return fallbackResponse(preferences);
      }
      
      return itineraryData;
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.log("Raw response:", text);
      return fallbackResponse(preferences);
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return fallbackResponse(preferences);
  }
}

// Fallback function in case the API call fails
function fallbackResponse(preferences) {
  const { destination, startDate, endDate, interests, travelers, additionalRequests } = preferences;
  
  // Parse dates
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dayCount = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
  
  // Generate days
  const days = [];
  for (let i = 0; i < dayCount; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    days.push({
      date: currentDate.toISOString().split('T')[0],
      activities: [
        {
          id: `morning-${i}`,
          time: '09:00 - 12:00',
          title: `Morning activity in ${destination}`,
          location: `${destination} city center`,
          description: `Explore the local attractions in ${destination}.`,
          type: 'attraction',
          imageUrl: '',
          coordinates: ''
        },
        {
          id: `lunch-${i}`,
          time: '12:30 - 14:00',
          title: `Lunch at local restaurant`,
          location: `${destination} dining district`,
          description: `Enjoy local cuisine at a popular restaurant.`,
          type: 'restaurant',
          imageUrl: '',
          coordinates: ''
        },
        {
          id: `afternoon-${i}`,
          time: '14:30 - 17:30',
          title: `Afternoon activity in ${destination}`,
          location: `${destination} points of interest`,
          description: `Visit popular landmarks and attractions.`,
          type: 'attraction',
          imageUrl: '',
          coordinates: ''
        },
        {
          id: `dinner-${i}`,
          time: '19:00 - 21:00',
          title: `Dinner experience`,
          location: `${destination} evening venue`,
          description: `Experience local dining in a beautiful setting.`,
          type: 'restaurant',
          imageUrl: '',
          coordinates: ''
        }
      ]
    });
  }
  
  // Create a fallback response with basic structure
  return {
    destination,
    startDate,
    endDate,
    days,
    summary: `Your ${dayCount}-day trip to ${destination}${interests.length ? ' with focus on ' + interests.join(', ') : ''}.`,
    tips: [
      `We're experiencing high demand. Please try again later for a more personalized itinerary.`,
      `Research local transportation options before your trip.`,
      `Check local health and safety guidelines before traveling.`,
      `Consider booking accommodations and tours in advance.`
    ]
  };
}

// Helper functions for generating content
function getDestinationAttractions(destination, interests) {
  // Sample attractions for popular destinations
  const attractionsByDestination = {
    'Paris': [
      { name: 'Eiffel Tower', location: 'Champ de Mars, 5 Avenue Anatole France', description: 'The iconic iron tower offering stunning views of the city.', tags: ['culture', 'landmarks'] },
      { name: 'Louvre Museum', location: 'Rue de Rivoli, 75001', description: 'World\'s largest art museum with thousands of works including the Mona Lisa.', tags: ['culture', 'art'] },
      { name: 'Notre-Dame Cathedral', location: 'Parvis Notre-Dame - Pl. Jean-Paul II', description: 'A historic Catholic cathedral noted for its French Gothic architecture.', tags: ['culture', 'history'] },
      { name: 'Montmartre', location: 'Montmartre district', description: 'A hill in Paris\'s 18th arrondissement known for its artistic history and the Sacré-Cœur Basilica.', tags: ['culture', 'art'] },
      { name: 'Seine River Cruise', location: 'Departures from various points along the Seine', description: 'Relaxing boat tour offering unique views of Paris\'s monuments from the water.', tags: ['relaxation'] },
      { name: 'Champs-Élysées', location: 'Avenue des Champs-Élysées', description: 'One of the world\'s most famous avenues, known for luxury shops and the Arc de Triomphe.', tags: ['shopping', 'landmarks'] },
      { name: 'Centre Pompidou', location: '19 Rue Beaubourg', description: 'Complex building housing the National Museum of Modern Art.', tags: ['culture', 'art'] },
      { name: 'Luxembourg Gardens', location: '6th arrondissement', description: 'Beautiful garden set around the Luxembourg Palace.', tags: ['nature', 'relaxation'] }
    ],
    'Tokyo': [
      { name: 'Meiji Shrine', location: '1-1 Yoyogi-Kamizonocho, Shibuya City', description: 'Shinto shrine dedicated to Emperor Meiji and Empress Shoken.', tags: ['culture', 'history'] },
      { name: 'Tokyo Skytree', location: '1 Chome-1-2 Oshiage, Sumida City', description: 'A broadcasting and observation tower providing panoramic views of Tokyo.', tags: ['landmarks'] },
      { name: 'Senso-ji Temple', location: '2 Chome-3-1 Asakusa, Taito City', description: 'Ancient Buddhist temple located in Asakusa.', tags: ['culture', 'history'] },
      { name: 'Shibuya Crossing', location: 'Shibuya, Tokyo', description: 'Famous intersection known for its busy pedestrian scramble.', tags: ['city life'] },
      { name: 'Shinjuku Gyoen National Garden', location: '11 Naitomachi, Shinjuku City', description: 'Large park with Japanese, English, and French gardens.', tags: ['nature', 'relaxation'] },
      { name: 'Akihabara Electric Town', location: 'Akihabara, Taito City', description: 'Shopping district for electronic, anime, and manga items.', tags: ['shopping', 'culture'] },
      { name: 'Tokyo National Museum', location: 'Ueno Park', description: 'Museum presenting Japanese art and antiquities.', tags: ['culture', 'history'] },
      { name: 'Tsukiji Outer Market', location: '4 Chome-16 Tsukiji, Chuo City', description: 'Shopping district with food stalls selling fresh seafood and produce.', tags: ['food', 'shopping'] }
    ],
    'New York City': [
      { name: 'Empire State Building', location: '20 W 34th St', description: 'Iconic 102-story skyscraper with panoramic observatories.', tags: ['landmarks'] },
      { name: 'Central Park', location: 'Central Park', description: 'Urban oasis offering green spaces, walking paths, and various attractions.', tags: ['nature', 'relaxation'] },
      { name: 'Metropolitan Museum of Art', location: '1000 5th Ave', description: 'One of the world\'s largest and most prestigious art museums.', tags: ['culture', 'art'] },
      { name: 'Statue of Liberty', location: 'Liberty Island', description: 'Iconic copper statue symbolizing freedom and democracy.', tags: ['history', 'landmarks'] },
      { name: 'Times Square', location: 'Broadway & 7th Avenue', description: 'Major commercial intersection and entertainment center.', tags: ['city life', 'entertainment'] },
      { name: 'Broadway Show', location: 'Theater District', description: 'Catch a world-class theatrical performance.', tags: ['entertainment', 'culture'] },
      { name: 'Brooklyn Bridge', location: 'Brooklyn Bridge', description: 'Historic suspension bridge connecting Manhattan and Brooklyn.', tags: ['landmarks', 'history'] },
      { name: 'High Line', location: 'Chelsea', description: 'Elevated linear park built on a former freight rail line.', tags: ['nature', 'city life'] }
    ],
    'Rome': [
      { name: 'Colosseum', location: 'Piazza del Colosseo, 1', description: 'Ancient amphitheater, the largest ever built by the Roman Empire.', tags: ['history', 'landmarks'] },
      { name: 'Vatican Museums', location: 'Viale Vaticano', description: 'Museums displaying works from the extensive collection of the Catholic Church.', tags: ['culture', 'art'] },
      { name: 'Roman Forum', location: 'Via della Salara Vecchia, 5/6', description: 'Rectangular forum surrounded by ancient government buildings.', tags: ['history'] },
      { name: 'Trevi Fountain', location: 'Piazza di Trevi', description: 'Iconic 18th-century baroque fountain.', tags: ['landmarks', 'culture'] },
      { name: 'Pantheon', location: 'Piazza della Rotonda', description: 'Former Roman temple, now a church, known for its perfect proportions.', tags: ['history', 'landmarks'] },
      { name: 'Spanish Steps', location: 'Piazza di Spagna', description: 'Monumental stairway of 135 steps linking Piazza di Spagna to Piazza Trinità dei Monti.', tags: ['landmarks'] },
      { name: 'Villa Borghese Gardens', location: 'Piazzale Napoleone I', description: 'Large public park with museums, attractions, and landscapes.', tags: ['nature', 'art'] },
      { name: 'Castel Sant\'Angelo', location: 'Lungotevere Castello, 50', description: 'Towering cylindrical building initially commissioned as a mausoleum.', tags: ['history', 'landmarks'] }
    ]
  };
  
  // Default to a generic list if destination not found
  const attractions = attractionsByDestination[destination] || [
    { name: 'Local Museum', location: 'Downtown', description: 'Main cultural museum showcasing local history and art.', tags: ['culture', 'history'] },
    { name: 'National Park', location: 'City outskirts', description: 'Beautiful natural area with walking trails and scenic views.', tags: ['nature', 'relaxation'] },
    { name: 'Historic District', location: 'Old Town', description: 'Well-preserved historical area with traditional architecture.', tags: ['history', 'culture'] },
    { name: 'Main Square', location: 'City Center', description: 'Central gathering place surrounded by important buildings and cafes.', tags: ['city life'] },
    { name: 'Local Market', location: 'Market District', description: 'Bustling market offering local products, foods, and crafts.', tags: ['shopping', 'food'] },
    { name: 'Viewpoint', location: 'Hilltop', description: 'Elevated area offering panoramic views of the entire city.', tags: ['nature', 'landmarks'] },
    { name: 'Art Gallery', location: 'Cultural District', description: 'Contemporary art gallery showcasing works by local artists.', tags: ['art', 'culture'] },
    { name: 'Nightlife District', location: 'Entertainment District', description: 'Area with numerous bars, clubs, and entertainment venues.', tags: ['entertainment', 'city life'] }
  ];
  
  // If interests are provided, prioritize attractions matching those interests
  if (interests && interests.length > 0) {
    // Convert interests to lowercase for comparison
    const lowerInterests = interests.map(i => i.toLowerCase());
    
    // Sort attractions to prioritize those matching interests
    return [...attractions].sort((a, b) => {
      const aMatchCount = a.tags.filter(tag => lowerInterests.includes(tag.toLowerCase())).length;
      const bMatchCount = b.tags.filter(tag => lowerInterests.includes(tag.toLowerCase())).length;
      return bMatchCount - aMatchCount;
    });
  }
  
  return attractions;
}

function getDestinationRestaurants(destination) {
  // Sample restaurants for popular destinations
  const restaurantsByDestination = {
    'Paris': [
      { name: 'Le Jules Verne', location: 'Eiffel Tower, 2nd floor', cuisine: 'French' },
      { name: 'Café de Flore', location: '172 Boulevard Saint-Germain', cuisine: 'French' },
      { name: 'L\'Ambroisie', location: '9 Place des Vosges', cuisine: 'French' },
      { name: 'Le Comptoir du Relais', location: '9 Carrefour de l\'Odéon', cuisine: 'French' },
      { name: 'Chez L\'Ami Jean', location: '27 Rue Malar', cuisine: 'Basque' },
      { name: 'Le Chateaubriand', location: '129 Avenue Parmentier', cuisine: 'Modern French' }
    ],
    'Tokyo': [
      { name: 'Sukiyabashi Jiro', location: 'Tsukamoto Sogyo Building, Chuo City', cuisine: 'Sushi' },
      { name: 'Ichiran Ramen', location: 'Multiple locations', cuisine: 'Ramen' },
      { name: 'Gonpachi', location: '1-13-11 Nishi-Azabu, Minato City', cuisine: 'Japanese' },
      { name: 'Ukai-tei', location: 'Omotesando', cuisine: 'Teppanyaki' },
      { name: 'Tapas Molecular Bar', location: 'Mandarin Oriental Hotel', cuisine: 'Molecular' },
      { name: 'Yoshihashi', location: '2-7-5 Nagatacho, Chiyoda City', cuisine: 'Yakitori' }
    ],
    'New York City': [
      { name: 'Katz\'s Delicatessen', location: '205 E Houston St', cuisine: 'Deli' },
      { name: 'Le Bernardin', location: '155 W 51st St', cuisine: 'Seafood' },
      { name: 'Gramercy Tavern', location: '42 E 20th St', cuisine: 'American' },
      { name: 'Peter Luger Steak House', location: '178 Broadway, Brooklyn', cuisine: 'Steakhouse' },
      { name: 'Momofuku Ko', location: '8 Extra Pl', cuisine: 'Asian Fusion' },
      { name: 'Eleven Madison Park', location: '11 Madison Ave', cuisine: 'Contemporary American' }
    ],
    'Rome': [
      { name: 'La Pergola', location: 'Via Alberto Cadlolo, 101', cuisine: 'Italian' },
      { name: 'Armando al Pantheon', location: 'Salita dei Crescenzi, 31', cuisine: 'Roman' },
      { name: 'Roscioli', location: 'Via dei Giubbonari, 21', cuisine: 'Italian' },
      { name: 'Da Enzo al 29', location: 'Via dei Vascellari, 29', cuisine: 'Roman' },
      { name: 'Glass Hostaria', location: 'Vicolo del Cinque, 58', cuisine: 'Italian' },
      { name: 'Pierluigi', location: 'Piazza de\' Ricci, 144', cuisine: 'Seafood' }
    ]
  };
  
  // Default to a generic list if destination not found
  return restaurantsByDestination[destination] || [
    { name: 'Local Bistro', location: 'Main Street', cuisine: 'Local' },
    { name: 'Seafood Restaurant', location: 'Harbor District', cuisine: 'Seafood' },
    { name: 'Traditional Tavern', location: 'Old Town', cuisine: 'Traditional' },
    { name: 'Fusion Restaurant', location: 'Modern District', cuisine: 'Fusion' },
    { name: 'Authentic Cuisine', location: 'Cultural Quarter', cuisine: 'Authentic' },
    { name: 'Fine Dining Experience', location: 'Uptown', cuisine: 'Gourmet' }
  ];
}

// Utility function to shuffle array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
} 