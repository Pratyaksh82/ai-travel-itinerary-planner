import json
import sqlite3
import threading
from typing import List, Optional, Dict, Any
from app.config import settings
from app.models.schemas import Itinerary

class DatabaseService:
    def __init__(self):
        self.db_path = settings.SQLITE_DB_PATH
        self._lock = threading.Lock()
        self._init_sqlite()

    def _init_sqlite(self):
        """Initializes the local SQLite database schema for zero-dependency operation."""
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS trips (
                    id TEXT PRIMARY KEY,
                    user_id TEXT NOT NULL,
                    destination TEXT NOT NULL,
                    title TEXT NOT NULL,
                    duration_days INTEGER NOT NULL,
                    budget_tier TEXT NOT NULL,
                    travel_style TEXT NOT NULL,
                    companion_type TEXT NOT NULL,
                    total_cost_usd REAL NOT NULL,
                    data_json TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.commit()
            conn.close()

    def save_itinerary(self, itinerary: Itinerary, user_id: str = "demo-user") -> bool:
        """Saves or updates an itinerary into persistent storage."""
        data_json = itinerary.model_dump_json()
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR REPLACE INTO trips (
                    id, user_id, destination, title, duration_days,
                    budget_tier, travel_style, companion_type, total_cost_usd,
                    data_json, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                itinerary.id,
                user_id,
                itinerary.destination,
                itinerary.title,
                itinerary.duration_days,
                itinerary.budget_tier.value,
                itinerary.travel_style.value,
                itinerary.companion_type.value,
                itinerary.budget_summary.total_estimated_usd,
                data_json,
                itinerary.created_at
            ))
            conn.commit()
            conn.close()
        return True

    def get_itinerary(self, trip_id: str) -> Optional[Itinerary]:
        """Retrieves an itinerary by unique ID."""
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT data_json FROM trips WHERE id = ?", (trip_id,))
            row = cursor.fetchone()
            conn.close()
            if row:
                return Itinerary.model_validate_json(row[0])
            return None

    def list_itineraries(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Lists summary metadata of saved itineraries."""
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            if user_id:
                cursor.execute("""
                    SELECT id, user_id, destination, title, duration_days, budget_tier, travel_style, companion_type, total_cost_usd, created_at
                    FROM trips WHERE user_id = ? ORDER BY created_at DESC
                """, (user_id,))
            else:
                cursor.execute("""
                    SELECT id, user_id, destination, title, duration_days, budget_tier, travel_style, companion_type, total_cost_usd, created_at
                    FROM trips ORDER BY created_at DESC
                """)
            rows = cursor.fetchall()
            conn.close()
            
            return [
                {
                    "id": r[0],
                    "user_id": r[1],
                    "destination": r[2],
                    "title": r[3],
                    "duration_days": r[4],
                    "budget_tier": r[5],
                    "travel_style": r[6],
                    "companion_type": r[7],
                    "total_cost_usd": r[8],
                    "created_at": r[9]
                }
                for r in rows
            ]

    def delete_itinerary(self, trip_id: str) -> bool:
        """Deletes an itinerary from the store."""
        with self._lock:
            conn = sqlite3.connect(self.db_path)
            cursor = conn.cursor()
            cursor.execute("DELETE FROM trips WHERE id = ?", (trip_id,))
            deleted = cursor.rowcount > 0
            conn.commit()
            conn.close()
            return deleted

    def toggle_activity(self, trip_id: str, activity_id: str, completed: bool) -> Optional[Itinerary]:
        """Toggles the completed state of a specific activity within an itinerary."""
        itinerary = self.get_itinerary(trip_id)
        if not itinerary:
            return None
        
        found = False
        for day in itinerary.days:
            for act in day.activities:
                if act.id == activity_id:
                    act.is_completed = completed
                    found = True
                    break
            if found:
                break
        
        if found:
            self.save_itinerary(itinerary, user_id="demo-user")
        return itinerary

db_service = DatabaseService()
