import { useState } from 'react';

export default function ItineraryDisplay({ itinerary, onSave, isEditable = false }) {
  const [editableItinerary, setEditableItinerary] = useState(itinerary);
  const [editMode, setEditMode] = useState(false);
  
  if (!itinerary) return null;
  
  const handleEditActivity = (dayIndex, activityIndex, field, value) => {
    const newItinerary = JSON.parse(JSON.stringify(editableItinerary));
    newItinerary.days[dayIndex].activities[activityIndex][field] = value;
    setEditableItinerary(newItinerary);
  };
  
  const handleSave = () => {
    setEditMode(false);
    onSave && onSave(editableItinerary);
  };
  
  const toggleEditMode = () => {
    if (!isEditable) return;
    if (editMode) {
      // Discard changes
      setEditableItinerary(itinerary);
    }
    setEditMode(!editMode);
  };
  
  // Use the editable version when in edit mode, otherwise use the original
  const displayItinerary = editMode ? editableItinerary : itinerary;
  
  return (
    <div className="max-w-3xl mx-auto my-8">
      <div className="mb-6 p-4 bg-white rounded shadow">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold mb-2">Your Trip to {displayItinerary.destination}</h2>
          {isEditable && (
            <div className="flex gap-2">
              {editMode ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="px-4 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={toggleEditMode}
                    className="px-4 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  onClick={toggleEditMode}
                  className="px-4 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Edit Itinerary
                </button>
              )}
            </div>
          )}
        </div>
        <p className="text-lg text-gray-700 mb-4">{displayItinerary.summary}</p>
        
        {displayItinerary.tips && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Travel Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {displayItinerary.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <h3 className="text-xl font-bold mb-4">Daily Itinerary</h3>
      {displayItinerary.days.map((day, dayIdx) => (
        <ItineraryDay 
          key={dayIdx} 
          day={day} 
          dayNumber={dayIdx + 1} 
          editMode={editMode}
          dayIndex={dayIdx}
          onEditActivity={handleEditActivity}
        />
      ))}
    </div>
  );
}

function ItineraryDay({ day, dayNumber, editMode, dayIndex, onEditActivity }) {
  return (
    <div className="mb-6 p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-2">Day {dayNumber}: {day.date}</h3>
      <div className="space-y-4">
        {day.activities.map((activity, activityIdx) => (
          <ActivityCard 
            key={activity.id || activityIdx} 
            activity={activity} 
            editMode={editMode}
            dayIndex={dayIndex}
            activityIndex={activityIdx}
            onEditActivity={onEditActivity}
          />
        ))}
      </div>
    </div>
  );
}

function ActivityCard({ activity, editMode, dayIndex, activityIndex, onEditActivity }) {
  // Determine background color based on activity type
  const getBgColor = (type) => {
    switch(type) {
      case 'restaurant': return 'bg-amber-50';
      case 'attraction': return 'bg-blue-50';
      case 'shopping': return 'bg-emerald-50';
      default: return 'bg-gray-50';
    }
  };
  
  // Create Google Maps link from location or coordinates
  const getGoogleMapsLink = () => {
    if (activity.coordinates && activity.coordinates !== "Exact latitude and longitude if known, otherwise leave empty") {
      return `https://www.google.com/maps/search/?api=1&query=${activity.coordinates}`;
    } else if (activity.location) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`;
    }
    return null;
  };
  
  const mapsLink = getGoogleMapsLink();
  
  const handleChange = (field, value) => {
    onEditActivity(dayIndex, activityIndex, field, value);
  };

  return (
    <div className={`border rounded p-3 ${getBgColor(activity.type)} flex flex-col md:flex-row gap-4`}>
      {activity.imageUrl && activity.imageUrl !== "URL to an image of this place (publicly accessible image only)" ? (
        <div className="w-full md:w-1/3 flex-shrink-0">
          {editMode ? (
            <input 
              type="text" 
              value={activity.imageUrl} 
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              className="w-full p-1 border rounded mb-1 text-sm"
              placeholder="Image URL"
            />
          ) : null}
          <img 
            src={activity.imageUrl} 
            alt={activity.title} 
            className="w-full h-32 md:h-full object-cover rounded" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image";
            }}
          />
        </div>
      ) : editMode ? (
        <div className="w-full md:w-1/3 flex-shrink-0">
          <input 
            type="text" 
            value={activity.imageUrl || ''} 
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            className="w-full p-1 border rounded mb-1 text-sm"
            placeholder="Add an image URL"
          />
          <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        </div>
      ) : null}
      <div className="flex-1">
        <div className="flex justify-between items-start">
          {editMode ? (
            <input 
              type="text" 
              value={activity.title} 
              onChange={(e) => handleChange('title', e.target.value)}
              className="font-bold p-1 border rounded w-full mr-2"
            />
          ) : (
            <h4 className="font-bold">{activity.title}</h4>
          )}
          
          {editMode ? (
            <input 
              type="text" 
              value={activity.time} 
              onChange={(e) => handleChange('time', e.target.value)}
              className="text-sm text-gray-600 p-1 border rounded w-28"
            />
          ) : (
            <span className="text-sm text-gray-600">{activity.time}</span>
          )}
        </div>
        <div className="flex items-center gap-2 mb-1">
          {editMode ? (
            <input 
              type="text" 
              value={activity.location} 
              onChange={(e) => handleChange('location', e.target.value)}
              className="text-sm text-gray-600 p-1 border rounded w-full"
            />
          ) : (
            <p className="text-sm text-gray-600">{activity.location}</p>
          )}
          {!editMode && mapsLink && (
            <a 
              href={mapsLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              View on Maps
            </a>
          )}
        </div>
        {editMode ? (
          <>
            <textarea 
              value={activity.description} 
              onChange={(e) => handleChange('description', e.target.value)}
              className="text-gray-700 p-1 border rounded w-full mb-2"
              rows={3}
            />
            <div className="flex gap-2">
              <select 
                value={activity.type || 'attraction'} 
                onChange={(e) => handleChange('type', e.target.value)}
                className="text-sm p-1 border rounded"
              >
                <option value="attraction">Attraction</option>
                <option value="restaurant">Restaurant</option>
                <option value="shopping">Shopping</option>
                <option value="transport">Transport</option>
                <option value="other">Other</option>
              </select>
              <input 
                type="text" 
                value={activity.coordinates || ''} 
                onChange={(e) => handleChange('coordinates', e.target.value)}
                className="text-sm p-1 border rounded flex-1"
                placeholder="Coordinates (optional)"
              />
            </div>
          </>
        ) : (
          <p className="text-gray-700">{activity.description}</p>
        )}
      </div>
    </div>
  );
} 