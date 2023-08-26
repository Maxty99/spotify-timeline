import { SpotifyHistoryEntry } from "@/utils/spotify-history-file";
import { milis_to_time_string } from "@/utils/time";
import { Card, CardBody, Image } from "@nextui-org/react";




export default function TableInfoCard(props: { spotify_entry: SpotifyHistoryEntry }) {
    const entry = props.spotify_entry;
    const date_listened = new Date(Date.parse(entry.timestamp))
    const time_string = milis_to_time_string(entry.ms_played)


    return (<Card
        className="border-none bg-background/60 dark:bg-default-100/50 max-w-[610px]"
        shadow="sm"
    >
        <CardBody>
            <div className="grid grid-cols-2 gap-6 items-center justify-center">
                <div className="flex flex-col">
                    <p className="font-bold text-lg">Listened on</p>
                    <p>{date_listened.toUTCString()}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-bold text-lg">Platform</p>
                    <p>{entry.platform}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-bold text-lg">Listened for</p>
                    <p>{time_string}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-bold text-lg">Listened from</p>
                    <div className="flex flex-row gap-2">
                        <p>{entry.conn_country}</p>
                        <Image
                            width={40}
                            alt="Flag image"
                            radius="sm"
                            src={`https://flagcdn.com/${entry.conn_country.toLowerCase()}.svg`}
                        />
                    </div>
                </div>

            </div>
        </CardBody>
    </Card>)
}