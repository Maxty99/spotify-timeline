## Backtrak

![Build](https://github.com/maxty99/spotify-timeline/actions/workflows/main.yml/badge.svg)

This is a tool I made because I downloaded my Spotify listening history and
could not be bothered to look through the JSON file that they send you. Made
with Next and Tauri.

## Installing

To install this app you can either download the build artifacts from GitHub or
build from source.

To build from source:

1. Install Node and Rust

   Node: https://nodejs.org/en

   Rust: https://www.rust-lang.org/

2. Install the Tauri CLI `cargo install tauri-cli`

3) Clone this repository

4) Install all the neccesary packages with `npm i`

5) Run `cargo tauri build` to build the frontend and the backend
6) The executable should be in `(root_folder)/src-tauri/target/release`

## How to use

The use case for this tool is to make it easier to browse through your spotify
listening history. If you use Spotify you know that the default app lets you
browse your history but it is cut off and you can't browse further than maybe a
year or so.

The fix is using the spotify privacy settings to download your data, but the
files you get are not readable (Despite being in the 'human-readable' JSON
format). This is where this app comes in.

1. Download your data from the
   [Spotify privacy settings](https://www.spotify.com/ca-en/account/privacy/).
   The specific data you want is under **Download your data** -> **Extended
   streaming history**
   > [!NOTE] This will take several days as explained on the Spotify privacy
   > page. For more info refer to the Spotify page

2. Once you get your extended listening history you should have a zipped folder
   with file(s) like `Streaming_History_Audio_2015-2021_0.json` and
   `Streaming_History_Video_2015-2021_0.json`. This tool is only tested with the
   Audio history file(s) so use those. Put these files somewhere you can find
   them

3. Open the app and use the fodler icon at the top left to navigate your file
   system and find the file(s) and select them to make them available to the
   app.

4. After having done this you can use the dropdown next to the folder icon to
   select the files you have added. These files will stay there when you close
   the program and you will not have to go through the process of finding the
   files in your filesystem again, you can delete them if you want.

## Contributing

I am more than happy to receive and bug reports or pull requests as long as it
is done respectfully, but that should go without saying. I recommend reading up
on [Next](https://nextjs.org/docs) and [Next UI](https://nextui.org/) for the
frontend and [Tauri](https://tauri.app/v1/guides/) for the backend.

The project structure is as follows:

- `./public` is the static images used by the app. For now it is just fallback
  images
- `./src` all of the frontend source
  - `./src/app` Next app router directory, manages the pages of the app
  - `./src/components` Component directory
  - `./src/hooks` Hook directory
  - `./src/utils` Directory for misc. utils that don't fit anywhere else
- `./src-tauri` all of the backend source + app icons

The project also uses [Tailwind](https://tailwindcss.com/docs/installation) for
styling

## Thank you

- [Feather Icons](https://feathericons.com/) for the UI Icons
- [Create Next App](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)
  for the bootstrap script
- [Next UI](https://nextui.org/) for the wonderful UI library
