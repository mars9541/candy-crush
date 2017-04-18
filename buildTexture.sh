# Set this to the location of LibGDX texture packer
TexturePacker=runnable-texturepacker.jar
# Set this to the location of Python 2.7.x
Python=python
if [ $OSTYPE == "win" ]; then
  Python=/c/Python27/python
fi

here=`dirname $0`
cd $here

# Linux equivalent to Windows pause
function pause {
  echo Press any key to continue . . .
  read -rsn 1
  read -rst 0.01
}

echo 1. Packing texture
java -jar $TexturePacker  assets/shapes img shapes textureSettings.json
java -jar $TexturePacker  assets/number img number textureSettings.json
echo 2. Convert format
$Python atlasConvert.py img/shapes_big.atlas > img/shapes_big.json
$Python atlasConvert.py img/shapes_small.atlas > img/shapes_small.json
$Python atlasConvert.py img/number_big.atlas > img/number_big.json
$Python atlasConvert.py img/number_small.atlas > img/number_small.json
pause
