import { useContext } from 'react';
import { SpotifyFileContext } from '../components/spotify-file-provider';

export default function useSpotifyFile() {
    return useContext(SpotifyFileContext);
}


