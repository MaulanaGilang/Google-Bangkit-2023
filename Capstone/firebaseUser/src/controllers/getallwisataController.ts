import { Request, Response } from "express";
import { nanoid } from "nanoid";
import { db } from "../config/firebase";
import axios from 'axios';
import jwt from "jsonwebtoken";

interface Place {
  id: string;
  place: string;
}

export const getAllWisata = (req: Request, res: Response) => {
  const apiUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
  const { query } = req.query;
  const apiKey = process.env.API_KEY; // Replace with your actual API key

  // Include query parameters in the API request
  axios
    .get(apiUrl, {
      params: {
        query: query,
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

export const searchedByUser = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    // Verify and decode the token to get the user ID
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };

    // Extract the required data from the request body
    const { place } = req.body;

    // Generate a unique ID for the subcollection document using nanoid
    const id = nanoid();

    // Create a new place object with the generated ID
    const newPlace: Place = {
      id,
      place,
    };

    // Reference the parent collection document
    const userRef = db.collection("databaseUsers").doc(decodedToken.userId);

    // Create the subcollection reference within the parent document
    const subcollectionRef = userRef.collection("databaseSearched");

    // Store the place data in the subcollection
    await subcollectionRef.doc(id).set(newPlace);

    // Return a response indicating success
    res.json({ message: "Place registered successfully" });
  } catch (error) {
    console.log(error);
    // Return a response indicating failure
    res.status(500).json({ message: "Failed to register place" });
  }
};

interface EditorialSummary {
  language: string;
  overview: string;
}

interface Result {
  editorial_summary: EditorialSummary;
}

interface PlaceDetailsResponse {
  html_attributions: string[];
  result: Result;
  status: string;
}

export const getEditorialSummary = async (req: Request, res: Response) => {
  try {
    const { placeId } = req.query;
    const apiKey = process.env.API_KEY;

    const response = await axios.get<PlaceDetailsResponse>(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&fields=editorial_summary`
    );

    console.log(response.data);

    const { editorial_summary:editorialSummary  } = response.data.result;

    res.json({ editorialSummary });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch editorial summary" });
  }
};






