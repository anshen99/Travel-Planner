// Utility functions for handling itineraries in localStorage

// Keys for localStorage
const ITINERARIES_KEY = 'travel-planner-itineraries';

// Save an itinerary to localStorage
export function saveItinerary(itinerary) {
  if (typeof window === 'undefined') return null; // SSR check
  
  try {
    // Generate a unique ID if not present
    if (!itinerary.id) {
      itinerary = {
        ...itinerary,
        id: generateId(),
        savedAt: new Date().toISOString()
      };
    } else {
      // Update the timestamp if editing
      itinerary = {
        ...itinerary,
        updatedAt: new Date().toISOString()
      };
    }
    
    // Get existing itineraries
    const existingItineraries = getItineraries();
    
    // Check if we're updating an existing one
    const updatedItineraries = existingItineraries.filter(i => i.id !== itinerary.id);
    updatedItineraries.unshift(itinerary); // Add to beginning
    
    // Save to localStorage
    localStorage.setItem(ITINERARIES_KEY, JSON.stringify(updatedItineraries));
    
    return itinerary;
  } catch (error) {
    console.error('Error saving itinerary:', error);
    return null;
  }
}

// Get all saved itineraries
export function getItineraries() {
  if (typeof window === 'undefined') return []; // SSR check
  
  try {
    const saved = localStorage.getItem(ITINERARIES_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error retrieving itineraries:', error);
    return [];
  }
}

// Get a specific itinerary by ID
export function getItineraryById(id) {
  if (typeof window === 'undefined') return null; // SSR check
  
  try {
    const itineraries = getItineraries();
    return itineraries.find(i => i.id === id) || null;
  } catch (error) {
    console.error('Error retrieving itinerary:', error);
    return null;
  }
}

// Delete an itinerary
export function deleteItinerary(id) {
  if (typeof window === 'undefined') return false; // SSR check
  
  try {
    const itineraries = getItineraries();
    const updatedItineraries = itineraries.filter(i => i.id !== id);
    localStorage.setItem(ITINERARIES_KEY, JSON.stringify(updatedItineraries));
    return true;
  } catch (error) {
    console.error('Error deleting itinerary:', error);
    return false;
  }
}

// Generate a unique ID
function generateId() {
  return `itin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
} 