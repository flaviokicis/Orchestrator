import axios from "axios";
import ApiError from "../errors/api-error";

async function searchGenius(query: string) {
    try {
        let config = {
            headers: {
                Authorization: `Bearer ${process.env.GENIUS_TOKEN}`,
                Accept: "application/json",
            },
            params: {
                q: query,
            },
        };

        const response = (
            await axios.get("https://api.genius.com/search", config)
        ).data;

        return response;
    } catch (error) {
        throw new ApiError(
            error,
            "Error while retrieving search results from Genius",
        );
    }
}

export async function getGeniusPage(songTitle: string, artist: string) {
    try {
        let config = {
            headers: {
                Authorization: `Bearer ${process.env.GENIUS_TOKEN}`,
                Accept: "application/json",
            },
            params: {
                q: songTitle,
            },
        };

        const data = (await axios.get("https://api.genius.com/search", config))
            .data;

        for (const hit of data.response.hits) {
            if (
                clearName(hit.result.artist_names).includes(
                    artist.toLowerCase(),
                )
            ) {
                return hit.result.url;
            }
        }
        return undefined; // No page found
    } catch (error) {
        throw new ApiError(error, "Error while retrieving page from Genius");
    }
}

function clearName(name: string) {
    return name
        .toLowerCase()
        .replace(/ *\([^)]*\) */g, "")
        .replace(/ *\[[^\]]*]/, "")
        .replace(/feat.|ft./g, "")
        .replace(/\s+/g, " ")
        .trim();
}

export default searchGenius;
