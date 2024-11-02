import { View, Text, Image, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import globalApi from "@/utils/globalApi";

export default function PlaceItem({ place }) {
  const PLACE_PHOTO_BASE_URL = "https://places.googleapis.com/v1/";
  const [photoUrl, setPhotoUrl] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPhotoUrl = async () => {
      if (place?.photos) {
        const url = `${PLACE_PHOTO_BASE_URL}${place?.photos[0]?.name}/media?key=${globalApi.API_KEY}&maxHeightPx=800&maxWidthPx=1200`;
        try {
          const response = await fetch(url);
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            // La respuesta es un JSON (probablemente un error)
            setPhotoUrl(null);
          } else {
            // La respuesta es una imagen
            setPhotoUrl(url);
          }
        } catch (error) {
          console.error("Error al verificar la URL de la foto:", error);
          setPhotoUrl(null);
        }
      } else {
        setPhotoUrl(null);
      }
    };

    fetchPhotoUrl();
  }, [place]);

  return (
    <View
      style={{
        width: Dimensions.get("screen").width * 0.91,
        backgroundColor: "#FFFFFF",
        paddingBottom: 10,
        marginRight: 10,
        borderRadius: 20,
      }}
    >
      <Image
        source={
          imageError || !photoUrl
            ? require("../../assets/images/farmacia-item.jpg") // Imagen de la farmacia
            : { uri: photoUrl }
        }
        style={{ width: "100%", borderRadius: 10, height: 130 }}
        onError={() => setImageError(true)}
      />

      <View style={{ padding: 15 }}>
        <Text
          style={{
            color: "#004686",
            fontSize: 23,
            fontWeight: "700",
          }}
        >
          {place.displayName?.text || "Nombre no disponible"}
        </Text>

        <Text
          style={{
            color: "#004686",
            fontSize: 14,
            marginLeft: 5,
          }}
        >
          {place.shortFormattedAddress || "Dirección no disponible"}
        </Text>
      </View>
    </View>
  );
}
