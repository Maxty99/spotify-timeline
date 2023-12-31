use std::fmt;

use chrono::{TimeZone, Utc};
use serde::{
    de::{Error, Visitor},
    Deserializer, Serializer,
};

struct StringVisitor;

impl<'de> Visitor<'de> for StringVisitor {
    type Value = String;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        write!(formatter, "a string")
    }

    fn visit_str<E>(self, s: &str) -> Result<Self::Value, E>
    where
        E: Error,
    {
        Ok(s.to_owned())
    }
}

struct U64Visitor;

impl<'de> Visitor<'de> for U64Visitor {
    type Value = u64;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        write!(formatter, "a number")
    }

    fn visit_u64<E>(self, v: u64) -> Result<Self::Value, E>
    where
        E: Error,
    {
        Ok(v)
    }
}

pub fn deserialize_datetime<'de, D>(deserializer: D) -> Result<chrono::DateTime<Utc>, D::Error>
where
    D: Deserializer<'de>,
{
    let date_string = deserializer.deserialize_string(StringVisitor)?;
    let date = Utc
        .datetime_from_str(&date_string, "%+") // %+ is the ISO format
        .map_err(Error::custom)?;
    Ok(date)
}

pub fn serialize_datetime<S>(date: &chrono::DateTime<Utc>, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let date_format = date.format("%+"); // %+ is the ISO format
    serializer.serialize_str(date_format.to_string().as_ref())
}

pub fn deserialize_milis<'de, D>(deserializer: D) -> Result<chrono::Duration, D::Error>
where
    D: Deserializer<'de>,
{
    let milis_number = deserializer.deserialize_u64(U64Visitor)?;
    Ok(chrono::Duration::milliseconds(milis_number as i64))
}

pub fn serialize_milis<S>(duration: &chrono::Duration, serializer: S) -> Result<S::Ok, S::Error>
where
    S: Serializer,
{
    let milis_number = duration.num_milliseconds() as u64;
    serializer.serialize_u64(milis_number)
}
