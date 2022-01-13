import ApiError from "../errors/api-error";
import axios from "axios";
import qs from "qs";

/*
 * This generate a link that when clicked open browser and ask
 * for permission to aplication uses user data
 */
async function getAuthorizationUrl(): Promise<string> {
    const encodeQueryParams = (obj) => {
        let str = [];
        for (let key in obj)
            if (obj.hasOwnProperty(key)) {
                str.push(
                    encodeURIComponent(key) +
                        "=" +
                        encodeURIComponent(obj[key]),
                );
            }
        return str.join("&");
    };

    const params = {
        client_id: process.env.SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: `${process.env.NGROK_LINK}/authorized`,
        scope: "user-read-private playlist-modify-private playlist-read-collaborative",
    };

    const encodedQueryParams = encodeQueryParams(params);

    return `https://accounts.spotify.com/authorize?${encodedQueryParams}`;
}

/*
 * Authenticate client in spotify and return Oauth2.0 token
 */
async function getAuthFromSpotify(): Promise<string> {
    try {
        const config = {
            baseURL: "https://accounts.spotify.com/api/token",
            body: qs.stringify({ grant_type: "client_credentials" }),
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(
                        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
                        "utf-8",
                    ).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        const response = await axios.post(config.baseURL, config.body, {
            headers: config.headers,
        });

        return response.data.access_token;
    } catch (error) {
        throw new ApiError(
            error,
            "Error while getting authentication from Spotify",
        );
    }
}

async function createPlaylistInSpotify() {
    try {
        console.log(getAuthorizationUrl());
        const acessToken = await getAuthFromSpotify();
        console.log(acessToken);

        const config = {
            headers: {
                Authorization: "Bearer " + acessToken,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };

        const response = await axios
            .post(
                `https://api.spotify.com/v1/users/${process.env.SPOTIFY_USERNAME}/playlists`,
                {
                    name: "New Playlist",
                    description: "New playlist description",
                    public: true,
                },
                { headers: config.headers },
            )
            .then((response) => response);
        return response;
    } catch (error) {
        console.log(error.response.data.error);
        throw new ApiError(error, "Error while creating playlist from Spotify");
    }
}

export default createPlaylistInSpotify;
