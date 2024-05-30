import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import {db} from "../config/firebase";

export const wisataJawa = (req: Request, res: Response) => {
    const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    const { island } = req.params; // Extract the island parameter from the request
    const apiKey = process.env.API_KEY; // Replace with your actual API key
  
    // Include query parameters in the API request
    axios
      .get(apiUrl, {
        params: {
          query: `tourism spot in ${island} island Indonesia`, // Use the island parameter in the query
          key: apiKey,
        },
      })
      .then((response) => {
        // Handle the response data
        res.json(response.data);
      })
      .catch((error) => {
        // Handle the error
        console.error(error);
        res.status(500).send('Internal Server Error');
      });
  };

export const listPulau = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1; // default page is 1
  
  const data = await db.collection("databasePulauIndonesia")
    .offset((page - 1))
    .get();
  
  const dataRaw = data.docs.map((doc) => doc.data());
  
  res.json(dataRaw);
};

interface PlaceResult {
  place_id: string;
  name: string;
  photos?: { photo_reference: string }[];
  rating?: number;
}

interface PlacesResponse {
  results: PlaceResult[];
  status: string;
}

export const getPopularTouristAttractions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { location } = req.query;
    const apiKey = process.env.API_KEY;

    const response: AxiosResponse<PlacesResponse> = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${location}+tourist+attractions+in+indonesia&key=${apiKey}`
    );

    const { results } = response.data;

    const popularAttractions = results.map((result) => ({
      placeId: result.place_id,
      name: result.name,
      photoUrl: result.photos?.[0]?.photo_reference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${result.photos[0].photo_reference}&key=${apiKey}`
        : '',
      rating: result.rating ?? 0,
    }));

    res.json({ popularAttractions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to fetch popular tourist attractions' });
  }
};

