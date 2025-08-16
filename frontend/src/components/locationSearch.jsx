import { MapPinIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { City } from "country-state-city";

const locationSearch = ({ location, onLocationChange }) => {
  const [query, setQuery] = useState(location || "");
  const [activeIndex, setActiveIndex] = useState(-1);
  const suggestionBoxRef = useRef();
  const itemRefs = useRef([]);
  const [suggestions, setSuggestions] = useState([]);

  //fetching all the cities
  useEffect(() => {
    if (query.length > 1) {
      const cities = City.getAllCities()
        .filter((city) => city.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10); // limit results
      setSuggestions(cities);
    } else {
      setSuggestions([]);
      setActiveIndex(-1);
    }
  }, [query]);

  //handling up and dow arrow keys functionalities
  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(
        (prev) => (prev - 1 + suggestions.length) % suggestions.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0) selectCity(suggestions[activeIndex]);
    }
  };

  ////for selecting a city from list
  const selectCity = (city) => {
    const locationStr = `${city.name}, ${city.countryCode}`;
    onLocationChange(locationStr);
    setQuery(locationStr);
    setSuggestions([]);
    setActiveIndex(-1);
  };

  // Scroll to active suggestion
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [activeIndex]);

  return (
    <div className="form-control relative">
      <label className="label">
        <span className="label-text">Location</span>
      </label>
      <div className="relative">
        <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
        <input
          type="text"
          name="location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="input input-bordered w-full pl-10"
          placeholder="City, Country"
        />
        {suggestions.length > 0 && (
          <ul
            ref={suggestionBoxRef}
            className="absolute z-50 bg-base-100 border border-base-300 rounded-md mt-1 max-h-48 overflow-y-auto w-full shadow-lg"
          >
            {suggestions.map((city, index) => (
              <li
                key={`${city.name}-${city.countryCode}`}
                onClick={() => selectCity(city)}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`px-3 py-2 cursor-pointer hover:bg-base-200 ${
                  index === activeIndex ? "bg-base-300" : ""
                }`}
              >
                {city.name}, {city.countryCode}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default locationSearch;
