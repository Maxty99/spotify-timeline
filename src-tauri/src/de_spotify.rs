use serde::{
    de::{Error, Visitor},
    Deserializer,
};
use std::fmt::{self, Display, Formatter};

/// This is made into an explicit type because I forsee a
/// lot of times where I might need to access just the id  
/// portion of the [TrackURI]
#[derive(Debug)]
pub struct TrackURI(String);

impl Display for TrackURI {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "spotify:track:{}", self.0)
    }
}

struct TrackURIVisitor;

impl<'de> Visitor<'de> for TrackURIVisitor {
    type Value = TrackURI;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        write!(
            formatter,
            "a string in the form of `spotify:track:<base-62 string>`"
        )
    }

    fn visit_str<E>(self, v: &str) -> Result<Self::Value, E>
    where
        E: Error,
    {
        if v.starts_with("spotify:track:") {
            let id = v
                .get(14..)
                .ok_or(E::custom("`spotify:track:` not followed by base-62 string"))?;
            Ok(TrackURI(id.to_owned()))
        } else {
            Err(E::custom("doesn't start with `spotify:track:`"))
        }
    }
}

pub fn deserialize_track_uri<'de, D>(deserializer: D) -> Result<TrackURI, D::Error>
where
    D: Deserializer<'de>,
{
    let track_uri = deserializer.deserialize_str(TrackURIVisitor)?;
    Ok(track_uri)
}
