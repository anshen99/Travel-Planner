import { useState, useRef, useEffect } from "react";

export default function ItineraryForm({ onSubmit }) {
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 1,
    interests: [],
    budget: "",
    additionalRequests: ""
  });
  
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const destinationRef = useRef(null);
  
  const destinationOptions = ["Paris", "Tokyo", "New York City", "Rome", "Barcelona", "London", "Sydney", "Dubai"];

  // Handle clicks outside the destination autocomplete
  useEffect(() => {
    function handleClickOutside(event) {
      if (destinationRef.current && !destinationRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Handle destination filtering for autocomplete
    if (name === "destination") {
      const filtered = destinationOptions.filter(
        option => option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredDestinations(filtered);
      setShowSuggestions(value.length > 0);
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };
  
  const handleSelectDestination = (destination) => {
    setForm({ ...form, destination });
    setShowSuggestions(false);
  };
  
  const handleMultiChange = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    
    // Clear error for this field when user makes a selection
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!form.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!form.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (form.startDate && new Date(form.endDate) < new Date(form.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (form.travelers < 1) {
      newErrors.travelers = 'At least 1 traveler is required';
    }
    
    if (form.interests.length === 0) {
      newErrors.interests = 'Select at least one interest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = e => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto p-6 bg-white rounded shadow">
      <div ref={destinationRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
        <input 
          type="text"
          name="destination" 
          value={form.destination}
          onChange={handleChange}
          placeholder="Type a destination" 
          className={`w-full border p-2 rounded ${errors.destination ? 'border-red-500' : 'border-gray-300'}`}
          onFocus={() => form.destination.length > 0 && setShowSuggestions(true)}
        />
        
        {showSuggestions && (
          <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map((destination, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  onClick={() => handleSelectDestination(destination)}
                >
                  {destination}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">
                Custom destination: "{form.destination}"
              </div>
            )}
          </div>
        )}
        
        {errors.destination && <p className="text-red-500 text-sm mt-1">{errors.destination}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input 
            name="startDate" 
            type="date" 
            value={form.startDate}
            onChange={handleChange} 
            className={`w-full border p-2 rounded ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`} 
          />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input 
            name="endDate" 
            type="date" 
            value={form.endDate}
            onChange={handleChange} 
            className={`w-full border p-2 rounded ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`} 
          />
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Travelers</label>
        <input 
          name="travelers" 
          type="number" 
          min="1"
          value={form.travelers} 
          onChange={handleChange} 
          className={`w-full border p-2 rounded ${errors.travelers ? 'border-red-500' : 'border-gray-300'}`} 
        />
        {errors.travelers && <p className="text-red-500 text-sm mt-1">{errors.travelers}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
        <PreferencesSelector 
          value={form.interests} 
          onChange={v => handleMultiChange("interests", v)} 
          hasError={!!errors.interests}
        />
        {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Budget (optional)</label>
        <select 
          name="budget" 
          value={form.budget}
          onChange={handleChange} 
          className="w-full border border-gray-300 p-2 rounded"
        >
          <option value="">Select a budget range</option>
          <option value="Budget">Budget (under $100/day)</option>
          <option value="Moderate">Moderate ($100-$300/day)</option>
          <option value="Luxury">Luxury ($300+/day)</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Requests</label>
        <textarea
          name="additionalRequests"
          value={form.additionalRequests}
          onChange={handleChange}
          placeholder="Add any specific preferences or requirements for your trip. For example: 'I prefer boutique hotels', 'I need wheelchair accessibility', 'Include some hidden gems, not just tourist spots', etc."
          className="w-full border border-gray-300 p-2 rounded h-24 resize-y"
        ></textarea>
      </div>
      
      <button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition-colors"
      >
        Generate Itinerary
      </button>
    </form>
  );
}

function PreferencesSelector({ value, onChange, hasError }) {
  const options = ["Culture", "Nature", "Food", "Adventure", "Relaxation", "Shopping", "Nightlife", "History"];
  const toggle = opt => onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
  
  return (
    <div className={`flex gap-2 flex-wrap p-2 border rounded ${hasError ? 'border-red-500' : 'border-gray-300'}`}>
      {options.map(opt => (
        <label 
          key={opt} 
          className={`flex items-center gap-1 px-3 py-1 rounded-full cursor-pointer ${
            value.includes(opt) 
              ? 'bg-blue-100 text-blue-800 border border-blue-300' 
              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
          }`}
        >
          <input 
            type="checkbox" 
            checked={value.includes(opt)} 
            onChange={() => toggle(opt)} 
            className="sr-only" 
          />
          {opt}
        </label>
      ))}
    </div>
  );
} 