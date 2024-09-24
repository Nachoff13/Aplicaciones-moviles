package com.example.tp2_app2.home

import androidx.room.Dao
import androidx.room.Delete
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import kotlinx.coroutines.flow.Flow

@Dao
interface CountryDao {
    // Inserta o actualiza un país
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertCountry(country: List<Country>)

    // Obtiene todos los países, esta función ya es asincrónica por retornar un Flow
    @Query("SELECT * FROM country")
    fun getAllCountry(): Flow<List<Country>>

    // Elimina un país
    @Delete
    suspend fun deleteCountry(country: Country)

    @Query("SELECT * FROM country WHERE countryId = :id LIMIT 1")
    suspend fun getCountryById(id: Int): Country?

}
