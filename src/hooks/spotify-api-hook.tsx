import { useContext } from 'react';
import { SpotifyApiContext } from '@/components/spotify-api-provider';

export default function useSpotifyFile() {
    return useContext(SpotifyApiContext);
}
