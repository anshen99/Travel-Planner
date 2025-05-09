'use client'; // Mark as a Client Component

import { useState, useEffect } from 'react'
import PrivateRoute from '../components/PrivateRoute' // Adjusted import path
import ItineraryForm from '../components/ItineraryForm' // Adjusted import path
import ItineraryDisplay from '../components/ItineraryDisplay' // Adjusted import path
import { generateItinerary } from '../utils/geminiAPI' // Import the Gemini API
import { saveItinerary, getItineraries, getItineraryById, deleteItinerary } from '../utils/localStorage'

export default function ItineraryPage() {
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [savedItineraries, setSavedItineraries] = useState([])
  const [showSavedItineraries, setShowSavedItineraries] = useState(false)
  const [currentViewMode, setCurrentViewMode] = useState('form') // 'form', 'view', 'saved'

  // Load saved itineraries on component mount
  useEffect(() => {
    const itineraries = getItineraries();
    setSavedItineraries(itineraries);
  }, []);

  const handleGenerate = async (form) => {
    setLoading(true)
    setError(null)
    setCurrentViewMode('view')
    
    try {
      // Use the Gemini API to generate the itinerary
      const generatedItinerary = await generateItinerary(form)
      
      // Save the itinerary to localStorage
      const savedItinerary = saveItinerary(generatedItinerary);
      setItinerary(savedItinerary);
      
      // Refresh the saved itineraries list
      setSavedItineraries(getItineraries());
    } catch (err) {
      console.error('Error generating itinerary:', err)
      setError('Failed to generate itinerary. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleSaveItinerary = (updatedItinerary) => {
    const saved = saveItinerary(updatedItinerary);
    setItinerary(saved);
    setSavedItineraries(getItineraries());
  };
  
  const handleLoadItinerary = (id) => {
    const loadedItinerary = getItineraryById(id);
    if (loadedItinerary) {
      setItinerary(loadedItinerary);
      setCurrentViewMode('view');
    }
  };
  
  const handleDeleteItinerary = (id, e) => {
    e.stopPropagation(); // Prevent triggering the parent click event
    if (window.confirm('Are you sure you want to delete this itinerary?')) {
      deleteItinerary(id);
      setSavedItineraries(getItineraries());
      
      // If the currently viewed itinerary is being deleted, go back to form
      if (itinerary && itinerary.id === id) {
        setItinerary(null);
        setCurrentViewMode('form');
      }
    }
  };
  
  const handleNewItinerary = () => {
    setItinerary(null);
    setCurrentViewMode('form');
  };
  
  const toggleSavedView = () => {
    setShowSavedItineraries(!showSavedItineraries);
    if (!showSavedItineraries) {
      setCurrentViewMode('saved');
    } else if (itinerary) {
      setCurrentViewMode('view');
    } else {
      setCurrentViewMode('form');
    }
  };

  return (
    <PrivateRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-center mb-6">Travel Itinerary Planner</h1>
          
          {/* Navigation buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <button 
              onClick={handleNewItinerary}
              className={`px-4 py-2 rounded transition-colors ${
                currentViewMode === 'form' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              New Itinerary
            </button>
            {itinerary && (
              <button 
                onClick={() => setCurrentViewMode('view')}
                className={`px-4 py-2 rounded transition-colors ${
                  currentViewMode === 'view' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                Current Itinerary
              </button>
            )}
            <button 
              onClick={toggleSavedView}
              className={`px-4 py-2 rounded transition-colors ${
                currentViewMode === 'saved' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              {showSavedItineraries ? 'Hide Saved' : 'View Saved'}
              {savedItineraries.length > 0 && 
                <span className="ml-1 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full">
                  {savedItineraries.length}
                </span>
              }
            </button>
          </div>
          
          {/* Saved itineraries section */}
          {showSavedItineraries && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3">Saved Itineraries</h2>
              {savedItineraries.length > 0 ? (
                <div className="space-y-2">
                  {savedItineraries.map((saved) => (
                    <div 
                      key={saved.id} 
                      onClick={() => handleLoadItinerary(saved.id)}
                      className="bg-white p-3 rounded shadow cursor-pointer hover:bg-blue-50 flex justify-between items-center transition-colors"
                    >
                      <div>
                        <h3 className="font-medium">{saved.destination}</h3>
                        <p className="text-sm text-gray-600">
                          {saved.startDate} to {saved.endDate} • {saved.days.length} days
                        </p>
                        <p className="text-xs text-gray-500">
                          {saved.updatedAt ? 
                            `Updated: ${new Date(saved.updatedAt).toLocaleDateString()}` : 
                            `Saved: ${new Date(saved.savedAt).toLocaleDateString()}`
                          }
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={(e) => handleDeleteItinerary(saved.id, e)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete itinerary"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No saved itineraries yet.</p>
              )}
            </div>
          )}
          
          {/* Form or Itinerary display */}
          {currentViewMode === 'form' && <ItineraryForm onSubmit={handleGenerate} />}
          
          {loading && (
            <div className="text-center py-8">
              <p className="text-gray-600">Generating your personalized itinerary...</p>
              <div className="mt-4 w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            </div>
          )}
          
          {error && (
            <div className="max-w-lg mx-auto mt-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          {!loading && itinerary && currentViewMode === 'view' && (
            <ItineraryDisplay 
              itinerary={itinerary} 
              onSave={handleSaveItinerary}
              isEditable={true}
            />
          )}
        </div>
      </div>
    </PrivateRoute>
  )
} 