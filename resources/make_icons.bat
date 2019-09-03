pushd %~dp0..

magick convert -background none -size 48x48 resources/icon.svg resources/icon.png
magick convert -background none -size 128x128 resources/icon.svg src/icon_128.png
magick convert -background none -size 64x64 resources/icon.svg src/icon_64.png
magick convert -background none -size 48x48 resources/icon.svg src/icon_48.png
magick convert -background none -size 38x38 resources/icon.svg src/icon_38.png
magick convert -background none -size 32x32 resources/icon.svg src/icon_32.png
magick convert -background none -size 19x19 resources/icon.svg src/icon_19.png
magick convert -background none -size 16x16 resources/icon.svg src/icon_16.png

pause
