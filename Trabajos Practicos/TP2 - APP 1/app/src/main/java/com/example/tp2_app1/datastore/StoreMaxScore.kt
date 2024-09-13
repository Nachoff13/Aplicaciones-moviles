package com.example.tp2_app1.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class StoreMaxScore(private val context: Context) {

    // Única instancia de la clase
    companion object {
        private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "maxScore")
        val MAX_SCORE_KEY = intPreferencesKey("max_score")
    }

    // Obtener el puntaje
    val getScore: Flow<Int> = context.dataStore.data
        .map { preferences ->
        preferences[MAX_SCORE_KEY] ?: 0
    }

    // Establecer el puntaje
    suspend fun setScore(score: Int) {
        context.dataStore.edit { preferences ->
            preferences[MAX_SCORE_KEY] = score
        }
    }
}