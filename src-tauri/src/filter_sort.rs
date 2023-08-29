use std::cmp::Reverse;

use chrono::{DateTime, Utc};
use serde::Deserialize;

use crate::spotify_history_file::SpotifyHistoryFile;

#[derive(Clone, Copy, PartialEq, Deserialize)]
pub enum SortingOrder {
    Ascending,
    Descending,
}

#[derive(Clone, Copy, PartialEq, Deserialize)]
pub enum SortingCategory {
    Name(SortingOrder),
    Date(SortingOrder),
    NoSorting,
}

#[derive(PartialEq, Deserialize)]
pub struct DateRange {
    start: DateTime<Utc>,
    end: DateTime<Utc>,
}

#[derive(PartialEq, Deserialize)]
pub struct FilterSortOptions {
    date_range: Option<DateRange>,
    filter_nulls: bool,
    name_query: String,
    sorting: SortingCategory,
}

pub struct FilterSort {
    original_data: SpotifyHistoryFile,
    sorted_cache: SpotifyHistoryFile,
    filter_sort_options: FilterSortOptions,
}

impl FilterSort {
    pub fn new(data: SpotifyHistoryFile) -> FilterSort {
        return FilterSort {
            original_data: data.clone(),
            sorted_cache: data,
            filter_sort_options: FilterSortOptions {
                date_range: None,
                filter_nulls: false,
                name_query: "".to_owned(),
                sorting: SortingCategory::NoSorting,
            },
        };
    }

    pub fn update_filters(&mut self, new_filters: FilterSortOptions) {
        //Update the actual filters
        if new_filters != self.filter_sort_options {
            self.filter_sort_options = new_filters;

            self.apply_filters();
        }
    }

    fn apply_filters(&mut self) {
        let mut data_to_filter_sort = self.original_data.data.clone();
        if let Some(date_range) = &self.filter_sort_options.date_range {
            data_to_filter_sort = data_to_filter_sort
                .into_iter()
                .filter(|elem| {
                    date_range.start <= elem.timestamp && elem.timestamp <= date_range.end
                })
                .collect()
        }

        if self.filter_sort_options.filter_nulls {
            data_to_filter_sort = data_to_filter_sort
                .into_iter()
                .filter(|elem| elem.spotify_track_uri.is_some())
                .collect()
        }

        if !self.filter_sort_options.name_query.is_empty() {
            data_to_filter_sort = data_to_filter_sort
                .into_iter()
                .filter(|elem| {
                    elem.master_metadata_track_name
                        .as_ref()
                        .is_some_and(|track_name| {
                            track_name
                                .to_lowercase()
                                .starts_with(&self.filter_sort_options.name_query.to_lowercase())
                        })
                })
                .collect()
        }

        match self.filter_sort_options.sorting {
            SortingCategory::Name(order) => match order {
                SortingOrder::Ascending => data_to_filter_sort
                    .sort_by_cached_key(|elem| elem.master_metadata_track_name.clone()),
                SortingOrder::Descending => data_to_filter_sort
                    .sort_by_cached_key(|elem| Reverse(elem.master_metadata_track_name.clone())),
            },
            SortingCategory::Date(order) => match order {
                SortingOrder::Ascending => data_to_filter_sort.sort_by_key(|elem| elem.timestamp),
                SortingOrder::Descending => {
                    data_to_filter_sort.sort_by_key(|elem| Reverse(elem.timestamp))
                }
            },
            SortingCategory::NoSorting => {}
        }
        self.sorted_cache.data = data_to_filter_sort;
    }

    pub fn access_data(&self) -> &SpotifyHistoryFile {
        &self.sorted_cache
    }

    pub fn change_file(&mut self, new_file: SpotifyHistoryFile) {
        self.original_data = new_file;
        self.apply_filters();
    }
}
