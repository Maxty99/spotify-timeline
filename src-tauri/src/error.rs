use serde::Serialize;
use thiserror::Error;

#[derive(Debug, Error)]
pub enum BackendError {
    #[error("Could not get data dir")]
    CouldNotGetDataDir,
    #[error(transparent)]
    SerdeError(#[from] serde_json::Error),
    #[error(transparent)]
    IoError(#[from] tauri::api::Error),
    #[error(transparent)]
    FsError(#[from] std::io::Error),
}

impl Serialize for BackendError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        serializer.serialize_str(format!("{:?}", self).as_ref())
    }
}
