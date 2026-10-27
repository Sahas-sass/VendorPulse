"""
VendorPulse - Colombo Commercial Zones Definition & Metadata
Pre-mapped zones based on high-density informal street vendor clusters across Colombo 01 - 15.
"""

from typing import List, Dict, Any

COLOMBO_COMMERCIAL_ZONES: List[Dict[str, Any]] = [
    {
        "zone_id": "ZONE-PETTAH-01",
        "block_code": "P-04",
        "name": "Pettah Central Market",
        "district": "Colombo 11",
        "coordinates": {"lat": 6.9367, "lon": 79.8530},
        "registered_vendors": 142,
        "daily_volume_lkr": 2500000,
        "typical_foot_traffic_hourly": 3800,
        "primary_transit_routes": ["138", "120", "100", "154", "Main Station"],
        "critical_drainage_points": ["Bodhiraja Mawatha", "5th Cross Street", "Main Street"],
        "baseline_vulnerability_score": 0.85
    },
    {
        "zone_id": "ZONE-FORT-01",
        "block_code": "F-02",
        "name": "Fort Railway & Station Hub",
        "district": "Colombo 01",
        "coordinates": {"lat": 6.9344, "lon": 79.8498},
        "registered_vendors": 95,
        "daily_volume_lkr": 1650000,
        "typical_foot_traffic_hourly": 4200,
        "primary_transit_routes": ["Fort Station Commuter", "100", "101", "177"],
        "critical_drainage_points": ["Olcott Mawatha", "Front Street"],
        "baseline_vulnerability_score": 0.65
    },
    {
        "zone_id": "ZONE-MALIGAWATTA-01",
        "block_code": "M-12",
        "name": "Maligawatta Market",
        "district": "Colombo 10",
        "coordinates": {"lat": 6.9312, "lon": 79.8710},
        "registered_vendors": 86,
        "daily_volume_lkr": 1400000,
        "typical_foot_traffic_hourly": 2100,
        "primary_transit_routes": ["175", "168"],
        "critical_drainage_points": ["Jayantha Weerasekara Mawatha", "Pradeepa Mawatha"],
        "baseline_vulnerability_score": 0.75
    },
    {
        "zone_id": "ZONE-MARADANA-01",
        "block_code": "MD-05",
        "name": "Maradana Technical Junction",
        "district": "Colombo 10",
        "coordinates": {"lat": 6.9272, "lon": 79.8665},
        "registered_vendors": 110,
        "daily_volume_lkr": 1900000,
        "typical_foot_traffic_hourly": 3100,
        "primary_transit_routes": ["103", "138", "Maradana Station"],
        "critical_drainage_points": ["Technical Junction", "Sri Sangaraja Mawatha"],
        "baseline_vulnerability_score": 0.70
    },
    {
        "zone_id": "ZONE-KOLLUPITIYA-01",
        "block_code": "K-03",
        "name": "Kollupitiya Market Corridor",
        "district": "Colombo 03",
        "coordinates": {"lat": 6.9110, "lon": 79.8505},
        "registered_vendors": 64,
        "daily_volume_lkr": 1100000,
        "typical_foot_traffic_hourly": 1900,
        "primary_transit_routes": ["100", "101", "154"],
        "critical_drainage_points": ["Galle Road Canal Outlet", "Station Road"],
        "baseline_vulnerability_score": 0.55
    }
]

def get_zone_by_id(zone_id: str) -> Dict[str, Any]:
    for z in COLOMBO_COMMERCIAL_ZONES:
        if z["zone_id"] == zone_id:
            return z
    return COLOMBO_COMMERCIAL_ZONES[0]
