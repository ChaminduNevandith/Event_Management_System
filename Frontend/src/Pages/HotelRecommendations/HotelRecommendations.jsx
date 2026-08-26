
import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import {
  BedDouble,
  Building,
  ExternalLink,
  Globe,
  Hotel,
  Loader2,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Search,
  Star,
  Wifi,
  X,
} from "lucide-react";

import Sidebar from "../../Componets/Sidebar";

/*
  FREE HOTEL SEARCH STACK
  -----------------------
  Map: OpenStreetMap + Leaflet
  Location search: Nominatim
  Hotel search: Overpass API

  No Google API key is required.

  Install:
  npm install leaflet react-leaflet
*/

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";
const COMMONS_API_URL = "https://commons.wikimedia.org/w/api.php";
const WIKIDATA_API_URL = "https://www.wikidata.org/w/api.php";

const DEFAULT_CENTER = {
  lat: 6.9271,
  lng: 79.8612,
};

const SEARCH_RADIUS_METERS = 12000;
const MAX_RESULTS = 40;
const IMAGE_ENRICH_LIMIT = 20;

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1000";

const hotelMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const cleanText = (value) => {
  if (!value) return null;
  return String(value).trim() || null;
};

const firstDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const getElementCoordinates = (element) => {
  if (typeof element.lat === "number" && typeof element.lon === "number") {
    return {
      lat: element.lat,
      lng: element.lon,
    };
  }

  if (
    element.center &&
    typeof element.center.lat === "number" &&
    typeof element.center.lon === "number"
  ) {
    return {
      lat: element.center.lat,
      lng: element.center.lon,
    };
  }

  return null;
};

const buildAddress = (tags = {}) => {
  if (tags["addr:full"]) return tags["addr:full"];

  const street = [tags["addr:housenumber"], tags["addr:street"]]
    .filter(Boolean)
    .join(" ");

  const parts = [
    street,
    tags["addr:suburb"],
    tags["addr:city"] || tags["addr:town"] || tags["addr:village"],
    tags["addr:state"],
    tags["addr:postcode"],
    tags["addr:country"],
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(", ") : "Address not mapped";
};

const normalizeWebsite = (website) => {
  if (!website) return null;
  const value = website.trim();

  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
};

const getDirectHotelImage = (tags = {}) => {
  const image = firstDefined(
    tags.image,
    tags["contact:image"],
    tags["image:url"]
  );

  if (image && /^https?:\/\//i.test(image)) {
    return {
      url: image,
      source: "OpenStreetMap",
      sourceUrl: null,
    };
  }

  return null;
};

const normalizeCommonsTitle = (value) => {
  if (!value) return null;

  const decoded = decodeURIComponent(String(value).trim());

  if (/^https?:\/\/commons\.wikimedia\.org\/wiki\/File:/i.test(decoded)) {
    return decoded.split("/wiki/").pop().replaceAll("_", " ");
  }

  if (/^File:/i.test(decoded)) {
    return decoded.replaceAll("_", " ");
  }

  return null;
};

const getCommonsCategory = (value) => {
  if (!value) return null;
  const decoded = decodeURIComponent(String(value).trim());

  if (/^Category:/i.test(decoded)) {
    return decoded.replaceAll("_", " ");
  }

  return null;
};

const getFirstPage = (data) => {
  const pages = data?.query?.pages;
  if (!pages) return null;

  return Object.values(pages).find(
    (page) => page && page.pageid !== -1 && page.imageinfo?.length
  ) || null;
};

const fetchCommonsFile = async (fileTitle) => {
  if (!fileTitle) return null;

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1000",
    titles: fileTitle,
  });

  const response = await fetch(`${COMMONS_API_URL}?${params.toString()}`);
  if (!response.ok) return null;

  const data = await response.json();
  const page = getFirstPage(data);
  const imageInfo = page?.imageinfo?.[0];

  if (!imageInfo) return null;

  return {
    url: imageInfo.thumburl || imageInfo.url || null,
    source: "Wikimedia Commons",
    sourceUrl: imageInfo.descriptionurl || null,
  };
};

const fetchCommonsCategoryImage = async (categoryTitle) => {
  if (!categoryTitle) return null;

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "categorymembers",
    gcmtitle: categoryTitle,
    gcmtype: "file",
    gcmlimit: "1",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1000",
  });

  const response = await fetch(`${COMMONS_API_URL}?${params.toString()}`);
  if (!response.ok) return null;

  const data = await response.json();
  const page = getFirstPage(data);
  const imageInfo = page?.imageinfo?.[0];

  if (!imageInfo) return null;

  return {
    url: imageInfo.thumburl || imageInfo.url || null,
    source: "Wikimedia Commons",
    sourceUrl: imageInfo.descriptionurl || null,
  };
};

const fetchWikidataImage = async (wikidataId) => {
  if (!wikidataId || !/^Q\d+$/i.test(wikidataId)) return null;

  const params = new URLSearchParams({
    action: "wbgetentities",
    format: "json",
    origin: "*",
    ids: wikidataId,
    props: "claims",
  });

  const response = await fetch(`${WIKIDATA_API_URL}?${params.toString()}`);
  if (!response.ok) return null;

  const data = await response.json();
  const entity = data?.entities?.[wikidataId];
  const fileName =
    entity?.claims?.P18?.[0]?.mainsnak?.datavalue?.value || null;

  if (!fileName) return null;

  return fetchCommonsFile(`File:${fileName}`);
};

const searchCommonsHotelImage = async (hotelName, locationLabel = "") => {
  if (!hotelName || hotelName === "Unnamed accommodation") return null;

  const shortLocation = String(locationLabel || "")
    .split(",")
    .slice(0, 2)
    .join(" ")
    .trim();

  const searchText = [hotelName, shortLocation]
    .filter(Boolean)
    .join(" ");

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrsearch: searchText,
    gsrnamespace: "6",
    gsrlimit: "3",
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1000",
  });

  const response = await fetch(`${COMMONS_API_URL}?${params.toString()}`);
  if (!response.ok) return null;

  const data = await response.json();
  const pages = Object.values(data?.query?.pages || {});

  const normalizedHotelName = hotelName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  const hotelWords = normalizedHotelName
    .split(" ")
    .filter((word) => word.length >= 4);

  const scored = pages
    .filter((page) => page?.imageinfo?.[0])
    .map((page) => {
      const title = String(page.title || "").toLowerCase();
      const score = hotelWords.reduce(
        (total, word) => total + (title.includes(word) ? 1 : 0),
        0
      );

      return { page, score };
    })
    .sort((a, b) => b.score - a.score);

  // Do not use a broad name-search result unless at least one meaningful
  // hotel-name word appears in the Commons file title.
  const best = scored.find((item) => item.score > 0)?.page;
  const imageInfo = best?.imageinfo?.[0];

  if (!imageInfo) return null;

  return {
    url: imageInfo.thumburl || imageInfo.url || null,
    source: "Wikimedia Commons",
    sourceUrl: imageInfo.descriptionurl || null,
  };
};

const resolveHotelImage = async (hotel, locationLabel = "") => {
  const direct = getDirectHotelImage(hotel.tags);
  if (direct?.url) return direct;

  const commonsTag = cleanText(hotel.tags?.wikimedia_commons);

  const exactCommonsFile = normalizeCommonsTitle(commonsTag);
  if (exactCommonsFile) {
    const result = await fetchCommonsFile(exactCommonsFile);
    if (result?.url) return result;
  }

  const commonsCategory = getCommonsCategory(commonsTag);
  if (commonsCategory) {
    const result = await fetchCommonsCategoryImage(commonsCategory);
    if (result?.url) return result;
  }

  const wikidataId = cleanText(hotel.tags?.wikidata);
  if (wikidataId) {
    const result = await fetchWikidataImage(wikidataId);
    if (result?.url) return result;
  }

  const searched = await searchCommonsHotelImage(hotel.name, locationLabel);
  if (searched?.url) return searched;

  return {
    url: FALLBACK_IMAGE,
    source: "Fallback",
    sourceUrl: null,
  };
};

const enrichHotelImages = async (hotels, locationLabel = "") => {
  const output = [...hotels];
  const queue = hotels
    .slice(0, IMAGE_ENRICH_LIMIT)
    .map((hotel, index) => ({ hotel, index }));

  const worker = async () => {
    while (queue.length > 0) {
      const item = queue.shift();
      if (!item) return;

      try {
        const imageInfo = await resolveHotelImage(
          item.hotel,
          locationLabel
        );

        output[item.index] = {
          ...item.hotel,
          image: imageInfo.url || FALLBACK_IMAGE,
          imageSource: imageInfo.source,
          imageSourceUrl: imageInfo.sourceUrl,
          imageLoading: false,
        };
      } catch (error) {
        console.warn(
          `Could not resolve image for ${item.hotel.name}:`,
          error
        );

        output[item.index] = {
          ...item.hotel,
          image: FALLBACK_IMAGE,
          imageSource: "Fallback",
          imageSourceUrl: null,
          imageLoading: false,
        };
      }
    }
  };

  // Small concurrency pool so a search does not hammer free APIs.
  await Promise.all(Array.from({ length: 4 }, () => worker()));

  return output;
};

const radians = (degrees) => (degrees * Math.PI) / 180;

const distanceKm = (lat1, lng1, lat2, lng2) => {
  const earthRadiusKm = 6371;

  const dLat = radians(lat2 - lat1);
  const dLng = radians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radians(lat1)) *
      Math.cos(radians(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const osmElementToHotel = (element, searchCenter) => {
  const tags = element.tags || {};
  const coordinates = getElementCoordinates(element);

  if (!coordinates) return null;

  const website = normalizeWebsite(
    firstDefined(tags.website, tags["contact:website"], tags.url)
  );

  const phone = cleanText(
    firstDefined(tags.phone, tags["contact:phone"], tags.mobile)
  );

  const email = cleanText(
    firstDefined(tags.email, tags["contact:email"])
  );

  const starValue = cleanText(
    firstDefined(tags.stars, tags["hotel:stars"])
  );

  const distance = searchCenter
    ? distanceKm(
        searchCenter.lat,
        searchCenter.lng,
        coordinates.lat,
        coordinates.lng
      )
    : null;

  return {
    id: `${element.type}-${element.id}`,
    osmType: element.type,
    osmId: element.id,
    name:
      cleanText(tags.name) ||
      cleanText(tags["name:en"]) ||
      cleanText(tags.brand) ||
      "Unnamed accommodation",
    type: cleanText(tags.tourism) || "hotel",
    lat: coordinates.lat,
    lng: coordinates.lng,
    address: buildAddress(tags),
    website,
    phone,
    email,
    stars: starValue,
    rooms: cleanText(tags.rooms),
    beds: cleanText(tags.beds),
    wheelchair: cleanText(tags.wheelchair),
    internetAccess: cleanText(tags.internet_access),
    openingHours: cleanText(tags.opening_hours),
    operator: cleanText(tags.operator),
    brand: cleanText(tags.brand),
    image: FALLBACK_IMAGE,
    imageSource: "Fallback",
    imageSourceUrl: null,
    imageLoading: true,
    distance,
    tags,
  };
};

const sortHotels = (hotels, query) => {
  const normalizedQuery = query.toLowerCase().trim();

  return [...hotels].sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    const aExact = aName === normalizedQuery ? 1 : 0;
    const bExact = bName === normalizedQuery ? 1 : 0;

    if (aExact !== bExact) return bExact - aExact;

    const aContains = aName.includes(normalizedQuery) ? 1 : 0;
    const bContains = bName.includes(normalizedQuery) ? 1 : 0;

    if (aContains !== bContains) return bContains - aContains;

    return (a.distance ?? Infinity) - (b.distance ?? Infinity);
  });
};

const MapController = ({ hotels, searchCenter, selectedHotel }) => {
  const map = useMap();

  useEffect(() => {
    if (selectedHotel) {
      map.flyTo([selectedHotel.lat, selectedHotel.lng], 16, {
        duration: 0.8,
      });
      return;
    }

    if (hotels.length > 1) {
      const bounds = L.latLngBounds(
        hotels.map((hotel) => [hotel.lat, hotel.lng])
      );

      map.fitBounds(bounds, {
        padding: [40, 40],
        maxZoom: 14,
      });
      return;
    }

    if (hotels.length === 1) {
      map.flyTo([hotels[0].lat, hotels[0].lng], 15, {
        duration: 0.8,
      });
      return;
    }

    if (searchCenter) {
      map.flyTo([searchCenter.lat, searchCenter.lng], 13, {
        duration: 0.8,
      });
    }
  }, [hotels, searchCenter, selectedHotel, map]);

  return null;
};

const HotelStars = ({ value, compact = false }) => {
  if (!value) return null;

  const parsed = Number.parseFloat(String(value).replace(",", "."));
  if (!Number.isFinite(parsed)) {
    return (
      <span className="text-xs font-semibold text-amber-600">
        {value} star hotel
      </span>
    );
  }

  const rounded = Math.max(1, Math.min(5, Math.round(parsed)));

  return (
    <div
      className={`flex items-center ${
        compact ? "gap-0.5" : "gap-1"
      }`}
      title={`${value}-star hotel classification`}
    >
      {Array.from({ length: rounded }, (_, index) => (
        <Star
          key={index}
          className={`${
            compact ? "w-3 h-3" : "w-4 h-4"
          } text-amber-400 fill-amber-400`}
        />
      ))}
      {!compact && (
        <span className="ml-1 text-xs font-semibold text-amber-700">
          {value}-star hotel
        </span>
      )}
    </div>
  );
};

const DetailRow = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-3 text-sm text-gray-600">
    <Icon className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
    <div className="min-w-0">{children}</div>
  </div>
);

const HotelRecommendations = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hotels, setHotels] = useState([]);
  const [searchCenter, setSearchCenter] = useState(DEFAULT_CENTER);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(null);

  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchLabel, setSearchLabel] = useState("");

  const resultText = useMemo(() => {
    if (!searchLabel || hotels.length === 0) return null;

    return `${hotels.length} accommodation${
      hotels.length === 1 ? "" : "s"
    } found near ${searchLabel}`;
  }, [hotels.length, searchLabel]);

  const geocodeLocation = async (query) => {
    const params = new URLSearchParams({
      q: query,
      format: "jsonv2",
      limit: "1",
      addressdetails: "1",
    });

    const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Location search failed (${response.status}). Please try again.`
      );
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`Could not find "${query}". Try a city or area name.`);
    }

    const result = data[0];

    return {
      lat: Number(result.lat),
      lng: Number(result.lon),
      displayName: result.display_name || query,
    };
  };

  const fetchNearbyHotels = async (center) => {
    const { lat, lng } = center;

    const overpassQuery = `
      [out:json][timeout:25];
      (
        nwr["tourism"="hotel"](around:${SEARCH_RADIUS_METERS},${lat},${lng});
        nwr["tourism"="hostel"](around:${SEARCH_RADIUS_METERS},${lat},${lng});
        nwr["tourism"="guest_house"](around:${SEARCH_RADIUS_METERS},${lat},${lng});
        nwr["tourism"="motel"](around:${SEARCH_RADIUS_METERS},${lat},${lng});
        nwr["tourism"="resort"](around:${SEARCH_RADIUS_METERS},${lat},${lng});
        nwr["tourism"="apartment"](around:${SEARCH_RADIUS_METERS},${lat},${lng});
      );
      out center tags;
    `;

    const body = new URLSearchParams({
      data: overpassQuery,
    });

    const response = await fetch(OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      throw new Error(
        `Hotel search service returned ${response.status}. The free Overpass server may be busy; try again shortly.`
      );
    }

    const data = await response.json();

    const mapped = (data.elements || [])
      .map((element) => osmElementToHotel(element, center))
      .filter(Boolean);

    const deduplicated = Array.from(
      new Map(
        mapped.map((hotel) => [
          `${hotel.name.toLowerCase()}-${hotel.lat.toFixed(
            5
          )}-${hotel.lng.toFixed(5)}`,
          hotel,
        ])
      ).values()
    );

    return deduplicated;
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      setSearchError("Enter a city, area, landmark, or hotel name.");
      return;
    }

    setIsSearching(true);
    setIsLoadingImages(false);
    setSearchError("");
    setSelectedHotel(null);
    setHotelDetails(null);

    try {
      const location = await geocodeLocation(query);

      setSearchCenter({
        lat: location.lat,
        lng: location.lng,
      });

      setSearchLabel(location.displayName);

      const hotelResults = await fetchNearbyHotels(location);

      const sorted = sortHotels(hotelResults, query).slice(0, MAX_RESULTS);

      setHotels(sorted);

      if (sorted.length === 0) {
        setSearchError(
          `No mapped hotels were found near "${query}". Try a nearby city or larger area.`
        );
      } else {
        // Show results immediately, then progressively replace fallback
        // images with exact OSM / Wikimedia / Wikidata photos.
        setIsLoadingImages(true);

        enrichHotelImages(sorted, location.displayName)
          .then((enriched) => {
            setHotels(enriched);

            setSelectedHotel((current) => {
              if (!current) return current;
              return (
                enriched.find((hotel) => hotel.id === current.id) || current
              );
            });

            setHotelDetails((current) => {
              if (!current) return current;
              return (
                enriched.find((hotel) => hotel.id === current.id) || current
              );
            });
          })
          .catch((imageError) => {
            console.warn("Hotel image enrichment failed:", imageError);
          })
          .finally(() => {
            setIsLoadingImages(false);
          });
      }
    } catch (error) {
      console.error("Free hotel search failed:", error);
      setHotels([]);
      setSearchError(
        error?.message || "Hotel search failed. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectHotel = (hotel) => {
    setSelectedHotel(hotel);
  };

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setHotelDetails(hotel);
  };

  const openDirections = (hotel) => {
    const destination = `${hotel.lat},${hotel.lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
      destination
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const openOpenStreetMap = (hotel) => {
    const url = `https://www.openstreetmap.org/?mlat=${hotel.lat}&mlon=${hotel.lng}#map=18/${hotel.lat}/${hotel.lng}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="flex h-screen bg-gray-50 relative"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 z-10 flex-shrink-0">
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Accommodations
              </h2>
              <p className="text-gray-500 mt-1 font-light">
                Find hotels and accommodation near your events.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex w-full md:w-[440px] relative"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>

              <input
                type="text"
                placeholder="Search city, area, landmark or hotel..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="w-full pl-11 pr-28 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />

              <button
                type="submit"
                disabled={isSearching}
                className="absolute right-2 top-1.5 bottom-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Search
                  </>
                ) : (
                  "Search"
                )}
              </button>
            </form>
          </div>

          {searchError && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {searchError}
            </div>
          )}

          {resultText && !searchError && (
            <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
              <span>{resultText}</span>
              {isLoadingImages && (
                <span className="inline-flex items-center gap-1 text-indigo-500">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Loading real hotel photos...
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Hotel list */}
          <div className="w-full lg:w-5/12 xl:w-1/3 border-r border-gray-200 bg-gray-50 overflow-y-auto p-6 space-y-5">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                <Loader2 className="w-9 h-9 animate-spin mb-3 text-indigo-600" />
                <p className="font-medium">Finding hotels...</p>
                <p className="text-xs text-gray-400 mt-1">
                  Searching OpenStreetMap data
                </p>
              </div>
            ) : hotels.length > 0 ? (
              hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  onClick={() => handleSelectHotel(hotel)}
                  className={`bg-white rounded-2xl shadow-sm border p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedHotel?.id === hotel.id
                      ? "border-indigo-500 ring-1 ring-indigo-500"
                      : "border-gray-100 hover:border-indigo-200"
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-24 h-24 rounded-xl object-cover bg-gray-100"
                        onError={(event) => {
                          event.currentTarget.src = FALLBACK_IMAGE;
                        }}
                      />

                      {hotel.imageLoading && isLoadingImages && (
                        <div className="absolute inset-0 rounded-xl bg-black/20 flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-900 line-clamp-2">
                          {hotel.name}
                        </h3>

                        {hotel.stars && (
                          <div className="bg-amber-50 px-2 py-1 rounded-md whitespace-nowrap">
                            <HotelStars value={hotel.stars} compact />
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[11px] capitalize font-medium text-indigo-600 bg-indigo-50 rounded-full px-2 py-1">
                          {hotel.type.replaceAll("_", " ")}
                        </span>

                        {hotel.distance !== null && (
                          <span className="text-xs text-gray-400">
                            {hotel.distance.toFixed(1)} km away
                          </span>
                        )}
                      </div>

                      <div className="flex items-start text-xs text-gray-500 font-light mt-3">
                        <MapPin className="w-3.5 h-3.5 mr-1.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">
                          {hotel.address}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500">
                      {hotel.rooms && (
                        <span className="flex items-center gap-1">
                          <Hotel className="w-3.5 h-3.5 text-gray-400" />
                          {hotel.rooms} rooms
                        </span>
                      )}

                      {hotel.beds && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3.5 h-3.5 text-gray-400" />
                          {hotel.beds} beds
                        </span>
                      )}

                      {hotel.internetAccess && (
                        <span className="flex items-center gap-1">
                          <Wifi className="w-3.5 h-3.5 text-gray-400" />
                          Internet
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-3">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleViewDetails(hotel);
                        }}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors"
                      >
                        View Details
                      </button>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDirections(hotel);
                        }}
                        className="px-3 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Route
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <Building className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">
                  Search for hotels
                </h3>
                <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                  Enter a city, area, landmark, or hotel name to find nearby
                  accommodation.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {["Colombo", "Kandy", "Galle"].map((place) => (
                    <button
                      key={place}
                      type="button"
                      onClick={() => setSearchQuery(place)}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                    >
                      {place}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div className="hidden lg:block lg:w-7/12 xl:w-2/3 bg-gray-200 relative p-4">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner border border-gray-200 relative">
              <MapContainer
                center={[DEFAULT_CENTER.lat, DEFAULT_CENTER.lng]}
                zoom={13}
                scrollWheelZoom
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController
                  hotels={hotels}
                  searchCenter={searchCenter}
                  selectedHotel={selectedHotel}
                />

                {hotels.map((hotel) => (
                  <Marker
                    key={hotel.id}
                    position={[hotel.lat, hotel.lng]}
                    icon={hotelMarkerIcon}
                    eventHandlers={{
                      click: () => setSelectedHotel(hotel),
                    }}
                  >
                    <Popup>
                      <div
                        className="min-w-[220px]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        <h4 className="font-bold text-gray-900 text-sm">
                          {hotel.name}
                        </h4>

                        <p className="text-xs text-gray-500 mt-1">
                          {hotel.address}
                        </p>

                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => handleViewDetails(hotel)}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-xs"
                          >
                            Details
                          </button>

                          <button
                            type="button"
                            onClick={() => openDirections(hotel)}
                            className="px-3 py-1.5 border border-gray-200 rounded-md text-xs"
                          >
                            Route
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {selectedHotel && (
                <div className="absolute top-4 left-4 z-[500] bg-white/95 backdrop-blur rounded-xl shadow-lg border border-gray-100 p-3 max-w-[280px]">
                  <button
                    type="button"
                    onClick={() => setSelectedHotel(null)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <p className="font-bold text-sm text-gray-900 pr-5">
                    {selectedHotel.name}
                  </p>

                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {selectedHotel.address}
                  </p>
                </div>
              )}
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-gray-100 text-xs font-medium text-gray-500 z-[500] whitespace-nowrap">
              Free map & hotel data from OpenStreetMap
            </div>
          </div>
        </div>
      </main>

      {/* Details modal */}
      {hotelDetails && (
        <div className="fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl relative">
            <button
              type="button"
              onClick={() => setHotelDetails(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/95 shadow flex items-center justify-center hover:bg-white"
              aria-label="Close hotel details"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative">
              <img
                src={hotelDetails.image}
                alt={hotelDetails.name}
                className="w-full h-64 object-cover bg-gray-100"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_IMAGE;
                }}
              />

              {hotelDetails.imageSource &&
                hotelDetails.imageSource !== "Fallback" && (
                  <div className="absolute bottom-3 left-3 bg-black/65 text-white text-[10px] px-2 py-1 rounded-md">
                    {hotelDetails.imageSourceUrl ? (
                      <a
                        href={hotelDetails.imageSourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline"
                      >
                        Photo: {hotelDetails.imageSource}
                      </a>
                    ) : (
                      <>Photo: {hotelDetails.imageSource}</>
                    )}
                  </div>
                )}
            </div>

            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {hotelDetails.name}
                    </h3>

                    {hotelDetails.stars && (
                      <HotelStars value={hotelDetails.stars} />
                    )}
                  </div>

                  <p className="text-sm capitalize text-indigo-600 mt-1">
                    {hotelDetails.type.replaceAll("_", " ")}
                    {hotelDetails.distance !== null
                      ? ` • ${hotelDetails.distance.toFixed(1)} km from search`
                      : ""}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => openDirections(hotelDetails)}
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  Directions
                </button>
              </div>

              <div className="mt-6 space-y-4">
                <DetailRow icon={MapPin}>
                  {hotelDetails.address}
                </DetailRow>

                {hotelDetails.phone && (
                  <DetailRow icon={Phone}>
                    <a
                      href={`tel:${hotelDetails.phone}`}
                      className="hover:text-indigo-600 break-all"
                    >
                      {hotelDetails.phone}
                    </a>
                  </DetailRow>
                )}

                {hotelDetails.email && (
                  <DetailRow icon={Mail}>
                    <a
                      href={`mailto:${hotelDetails.email}`}
                      className="hover:text-indigo-600 break-all"
                    >
                      {hotelDetails.email}
                    </a>
                  </DetailRow>
                )}

                {hotelDetails.website && (
                  <DetailRow icon={Globe}>
                    <a
                      href={hotelDetails.website}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-indigo-600 flex items-center gap-1 break-all"
                    >
                      Visit hotel website
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    </a>
                  </DetailRow>
                )}

                {(hotelDetails.rooms || hotelDetails.beds) && (
                  <DetailRow icon={BedDouble}>
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {hotelDetails.rooms && (
                        <span>{hotelDetails.rooms} rooms</span>
                      )}
                      {hotelDetails.beds && (
                        <span>{hotelDetails.beds} beds</span>
                      )}
                    </div>
                  </DetailRow>
                )}

                {hotelDetails.internetAccess && (
                  <DetailRow icon={Wifi}>
                    Internet access: {hotelDetails.internetAccess}
                  </DetailRow>
                )}

                {hotelDetails.operator && (
                  <DetailRow icon={Building}>
                    Operator: {hotelDetails.operator}
                  </DetailRow>
                )}
              </div>

              <div className="mt-7 rounded-xl bg-gray-50 border border-gray-100 p-4">
                <h4 className="font-semibold text-gray-900 text-sm">
                  OpenStreetMap listing
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  Hotel details and star classifications come from
                  OpenStreetMap when mapped. Photos are resolved from exact
                  OpenStreetMap image tags, Wikimedia Commons, or Wikidata when
                  available. Missing data is left unavailable rather than invented.
                </p>

                <button
                  type="button"
                  onClick={() => openOpenStreetMap(hotelDetails)}
                  className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View location on OpenStreetMap
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelRecommendations;
