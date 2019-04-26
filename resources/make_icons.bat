pushd %~dp0..

magick convert resources/icon_128.png -resize 48x48 resources/icon.png
magick convert resources/icon_128.png -resize 128x128 src/icon_128.png
magick convert resources/icon_128.png -resize 64x64 src/icon_64.png
magick convert resources/icon_128.png -resize 48x48 src/icon_48.png
magick convert resources/icon_128.png -resize 38x38 src/icon_38.png
magick convert resources/icon_128.png -resize 32x32 src/icon_32.png
magick convert resources/icon_128.png -resize 19x19 src/icon_19.png
magick convert resources/icon_128.png -resize 16x16 src/icon_16.png

pause
