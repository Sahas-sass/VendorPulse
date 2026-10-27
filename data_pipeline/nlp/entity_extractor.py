"""
VendorPulse - Colombo Civic & Transit Entity Extraction Pipeline (NLP / NER)
Extracts hyper-local geographic entities, disruption categories, and severity ratings
from unstructured Sri Lankan news bulletins and municipal announcements (e.g., Ada Derana, NewsFirst).
"""

import re
from typing import Dict, Any, List, Optional

# Colombo Geographic Gazetteers mapped to standard zones & coordinates
COLOMBO_LOCATION_GAZETTEER = {
    "ZONE-PETTAH-01": [
        "pettah", "pettah market", "bodhiraja mawatha", "bodhiraja", "5th cross", "second cross",
        "2nd cross", "main street colombo 11", "pettah bus stand", "central bus stand", "gas works junction"
    ],
    "ZONE-FORT-01": [
        "fort", "colombo fort", "fort railway station", "olcott mawatha", "front street", "lotus road",
        "york street", "ceylon shipping", "bank of ceylon mawatha"
    ],
    "ZONE-MALIGAWATTA-01": [
        "maligawatta", "maligawatte", "jayantha weerasekara mawatha", "vegetable market maligawatta",
        "pradeepa mawatha", "khettarama"
    ],
    "ZONE-MARADANA-01": [
        "maradana", "technical junction", "sri sangaraja mawatha", "maradana railway", "deans road",
        "elphinstone theatre junction"
    ],
    "ZONE-KOLLUPITIYA-01": [
        "kollupitiya", "colpetty", "galle road colombo 3", "station road kollupitiya", "turret road"
    ]
}

# Categorical disruption patterns with severity weighting
DISRUPTION_PATTERNS = {
    "FLOODING": {
        "keywords": ["flooded", "flooding", "waterlogged", "waterlogging", "submerged", "inundated", 
                     "drainage overflow", "drainage blockage", "heavy rain", "torrential", "canal overflow"],
        "base_severity": 0.85
    },
    "TRANSIT_STRIKE": {
        "keywords": ["bus strike", "route suspended", "strike action", "train delay", "railway strike", 
                     "route 138 suspended", "private bus strike", "go slow", "transit paralysis", "halted operations"],
        "base_severity": 0.90
    },
    "ROAD_CLOSURE": {
        "keywords": ["road closed", "diversion", "traffic diverted", "blocked for vehicular traffic", 
                     "impassable", "temporary closure", "barricaded"],
        "base_severity": 0.70
    },
    "CIVIC_UNREST": {
        "keywords": ["protest", "demonstration", "tear gas", "water cannon", "march", "gathering"],
        "base_severity": 0.75
    },
    "SUPPLY_CHAIN": {
        "keywords": ["wholesale delivery halted", "produce shortage", "market closure", "perishables blocked"],
        "base_severity": 0.65
    }
}

class ColomboCivicEntityExtractor:
    """
    NLP Entity & Disruption Extractor.
    Extracts Colombo geographic entities and computes disruption severity scores.
    """

    def __init__(self):
        self.gazetteer = COLOMBO_LOCATION_GAZETTEER
        self.patterns = DISRUPTION_PATTERNS

    def extract_from_text(self, headline: str, summary: str = "") -> Dict[str, Any]:
        """
        Processes news headline and summary body text, extracting target Colombo zones,
        identified disruption drivers, and an aggregate severity rating.
        """
        combined_text = f"{headline} {summary}".lower()

        # 1. Match Geographic Entities
        matched_zones = []
        matched_landmarks = []
        for zone_id, synonyms in self.gazetteer.items():
            for synonym in synonyms:
                pattern = r"\b" + re.escape(synonym) + r"\b"
                if re.search(pattern, combined_text):
                    if zone_id not in matched_zones:
                        matched_zones.append(zone_id)
                    matched_landmarks.append(synonym.title())

        # 2. Identify Disruption Category & Drivers
        detected_categories = []
        risk_drivers = []
        max_severity = 0.0

        for category, info in self.patterns.items():
            for kw in info["keywords"]:
                if kw in combined_text:
                    if category not in detected_categories:
                        detected_categories.append(category)
                    driver_title = self._format_driver_text(kw, category, combined_text)
                    if driver_title and driver_title not in risk_drivers:
                        risk_drivers.append(driver_title)
                    max_severity = max(max_severity, info["base_severity"])

        # Default fallback if no specific category matched but text has incident markers
        if not detected_categories and any(w in combined_text for w in ["warning", "alert", "halt"]):
            detected_categories.append("GENERAL_MUNICIPAL_ALERT")
            max_severity = 0.50
            risk_drivers.append("Municipal traffic advisory issued")

        return {
            "matched_zones": matched_zones if matched_zones else ["ZONE-PETTAH-01"], # default commercial center
            "matched_landmarks": list(set(matched_landmarks)),
            "detected_categories": detected_categories,
            "risk_drivers": risk_drivers[:3],  # Top 3 concise drivers for the field card
            "severity_score": round(max_severity, 2),
            "confidence": 0.90 if matched_zones and detected_categories else 0.65
        }

    def _format_driver_text(self, keyword: str, category: str, text: str) -> str:
        """Formats clean, concise risk driver labels matching the UI specification."""
        if "138" in text or "route 138" in text:
            return "Bus Route 138 suspended"
        if "drainage" in text or "overflow" in text or "inundat" in text:
            return "Flooded primary drainage"
        if "road closed" in text or "bodhiraja" in text:
            return "Bodhiraja Mawatha road closure"
        if category == "FLOODING":
            return "Severe localized street flooding"
        if category == "TRANSIT_STRIKE":
            return "Commercial feeder transit stoppage"
        if category == "CIVIC_UNREST":
            return "Demonstration and police diversions"
        if category == "SUPPLY_CHAIN":
            return "Perishable produce supply bottleneck"
        return f"{keyword.capitalize()} reported"
