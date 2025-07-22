import { SpotifyHistoryEntry } from "@/utils/spotify-history-file";
import { milis_to_time_string } from "@/utils/time";
import { Card, CardBody, Image, Tooltip } from "@heroui/react";




export default function TableInfoCard(props: { spotify_entry: SpotifyHistoryEntry }) {
    const entry = props.spotify_entry;
    const date_listened = new Date(Date.parse(entry.timestamp))
    const time_string = milis_to_time_string(entry.ms_played)


    return (<Card
        className="border-none w-full"
        shadow="sm"
    >
        <CardBody>
            <div className="grid grid-cols-2 gap-6 place-content-around">
                <div className="flex flex-col">
                    <p className="font-bold sm:md:text-sm md:text-base lg:text-lg">Listened on</p>
                    <p className="sm:md:text-xs md:text-sm lg:text-base">{date_listened.toLocaleString()}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-bold sm:md:text-sm md:text-base lg:text-lg">Platform</p>
                    <Tooltip delay={2000} content={entry.platform} placement="bottom">
                        <p className="truncate max-w-full sm:md:text-xs md:text-sm lg:text-base">{entry.platform}</p>
                    </Tooltip>
                </div>
                <div className="flex flex-col">
                    <p className="font-bold sm:md:text-sm md:text-base lg:text-lg">Listened for</p>
                    <p className="sm:md:text-xs md:text-sm lg:text-base">{time_string}</p>
                </div>
                <div className="flex flex-col">
                    <p className="font-bold sm:md:text-sm md:text-base lg:text-lg">Listened from</p>
                    <div className="flex flex-row gap-2 items-center">
                        <p className="sm:md:text-xs md:text-sm lg:text-base">{entry.conn_country}</p>
                        <Image
                            width={30}
                            height={20}
                            alt="Flag image"
                            radius="sm"
                            src={`https://flagcdn.com/${entry.conn_country.toLowerCase()}.svg`}
                            fallbackSrc={"fallback_flag.svg"}
                        />
                    </div>
                </div>

            </div>
        </CardBody>
    </Card>)
}