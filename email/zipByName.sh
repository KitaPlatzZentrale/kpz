mkdir -p zipped
for fname in *.*; do
    prefix=${fname%%.*}
    [ ! -f "$fname" ] || [ -f "$prefix.zip" ] && continue
    zip "$prefix" "$prefix".*  
    mv "$prefix".zip zipped 
done
