import { useContext } from 'react';
import { SpotifyApiContext } from '@/components/spotify-api-provider';

export default function useSpotifyApi() {
    return useContext(SpotifyApiContext);
}
